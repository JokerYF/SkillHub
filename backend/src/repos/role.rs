use anyhow::Result;
use sqlx::PgPool;
use tracing::{debug, info, warn};
use uuid::Uuid;

use crate::models::role::{CreateRole, Role, RoleDetail, UpdateRole, UserRole};

pub struct RoleRepo {
    pool: PgPool,
}

impl RoleRepo {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    /// 创建角色
    pub async fn create(&self, payload: &CreateRole) -> Result<Role> {
        debug!(name = %payload.name, "Creating role");

        let role = sqlx::query_as::<_, Role>(
            r#"
            INSERT INTO roles (name, description, is_system)
            VALUES ($1, $2, false)
            RETURNING *
            "#
        )
        .bind(&payload.name)
        .bind(&payload.description)
        .fetch_one(&self.pool)
        .await?;

        info!(role_id = %role.id, name = %role.name, "Role created successfully");
        Ok(role)
    }

    /// 根据 ID 查找角色
    pub async fn find_by_id(&self, id: Uuid) -> Result<Option<Role>> {
        let role = sqlx::query_as::<_, Role>(
            "SELECT * FROM roles WHERE id = $1"
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(role)
    }

    /// 根据名称查找角色
    pub async fn find_by_name(&self, name: &str) -> Result<Option<Role>> {
        let role = sqlx::query_as::<_, Role>(
            "SELECT * FROM roles WHERE name = $1"
        )
        .bind(name)
        .fetch_optional(&self.pool)
        .await?;

        Ok(role)
    }

    /// 获取所有角色
    pub async fn find_all(&self) -> Result<Vec<Role>> {
        let roles = sqlx::query_as::<_, Role>(
            "SELECT * FROM roles ORDER BY created_at ASC"
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(roles)
    }

    /// 获取所有角色（包含权限）
    pub async fn find_all_with_permissions(&self) -> Result<Vec<RoleDetail>> {
        let roles = sqlx::query_as::<_, Role>(
            "SELECT * FROM roles ORDER BY created_at ASC"
        )
        .fetch_all(&self.pool)
        .await?;

        let mut result = Vec::new();
        for role in roles {
            let permissions = self.get_role_permissions(role.id).await?;
            result.push(RoleDetail {
                id: role.id,
                name: role.name,
                description: role.description,
                is_system: role.is_system,
                permissions,
                created_at: role.created_at,
                updated_at: role.updated_at,
            });
        }

        Ok(result)
    }

    /// 更新角色
    pub async fn update(&self, id: Uuid, payload: &UpdateRole) -> Result<Option<Role>> {
        debug!(role_id = %id, "Updating role");

        // 构建动态更新语句
        let mut updates = Vec::new();
        let mut param_count = 1;

        if payload.name.is_some() {
            updates.push(format!("name = ${}", param_count));
            param_count += 1;
        }
        if payload.description.is_some() {
            updates.push(format!("description = ${}", param_count));
            param_count += 1;
        }

        if updates.is_empty() {
            return self.find_by_id(id).await;
        }

        let sql = format!(
            "UPDATE roles SET {} WHERE id = ${} AND is_system = false RETURNING *",
            updates.join(", "),
            param_count
        );

        let mut query = sqlx::query_as::<_, Role>(&sql);

        if let Some(ref name) = payload.name {
            query = query.bind(name);
        }
        if let Some(ref description) = payload.description {
            query = query.bind(description);
        }
        query = query.bind(id);

        let role = query.fetch_optional(&self.pool).await?;

        if role.is_some() {
            info!(role_id = %id, "Role updated successfully");
        } else {
            warn!(role_id = %id, "Role not found or is system role");
        }

        Ok(role)
    }

    /// 删除角色
    pub async fn delete(&self, id: Uuid) -> Result<bool> {
        debug!(role_id = %id, "Deleting role");

        let result = sqlx::query(
            "DELETE FROM roles WHERE id = $1 AND is_system = false"
        )
        .bind(id)
        .execute(&self.pool)
        .await?;

        let deleted = result.rows_affected() > 0;

        if deleted {
            info!(role_id = %id, "Role deleted successfully");
        } else {
            warn!(role_id = %id, "Role not found or is system role");
        }

        Ok(deleted)
    }

    /// 获取角色详情（包含权限列表）
    pub async fn get_detail(&self, id: Uuid) -> Result<Option<RoleDetail>> {
        let role = self.find_by_id(id).await?;

        if role.is_none() {
            return Ok(None);
        }

        let role = role.unwrap();
        let permissions = self.get_role_permissions(id).await?;

        Ok(Some(RoleDetail {
            id: role.id,
            name: role.name,
            description: role.description,
            is_system: role.is_system,
            permissions,
            created_at: role.created_at,
            updated_at: role.updated_at,
        }))
    }

    /// 获取角色的权限名称列表
    pub async fn get_role_permissions(&self, role_id: Uuid) -> Result<Vec<String>> {
        let permissions: Vec<(String,)> = sqlx::query_as(
            r#"
            SELECT p.name
            FROM permissions p
            INNER JOIN role_permissions rp ON p.id = rp.permission_id
            WHERE rp.role_id = $1
            ORDER BY p.name
            "#
        )
        .bind(role_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(permissions.into_iter().map(|p| p.0).collect())
    }

    /// 为角色添加权限
    pub async fn add_permission(&self, role_id: Uuid, permission_id: Uuid) -> Result<bool> {
        debug!(role_id = %role_id, permission_id = %permission_id, "Adding permission to role");

        let result = sqlx::query(
            r#"
            INSERT INTO role_permissions (role_id, permission_id)
            VALUES ($1, $2)
            ON CONFLICT (role_id, permission_id) DO NOTHING
            "#
        )
        .bind(role_id)
        .bind(permission_id)
        .execute(&self.pool)
        .await?;

        Ok(result.rows_affected() > 0)
    }

    /// 从角色移除权限
    pub async fn remove_permission(&self, role_id: Uuid, permission_id: Uuid) -> Result<bool> {
        debug!(role_id = %role_id, permission_id = %permission_id, "Removing permission from role");

        let result = sqlx::query(
            "DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = $2"
        )
        .bind(role_id)
        .bind(permission_id)
        .execute(&self.pool)
        .await?;

        Ok(result.rows_affected() > 0)
    }

    /// 同步角色权限（先删除所有，再添加指定的）
    pub async fn sync_permissions(&self, role_id: Uuid, permission_ids: &[Uuid]) -> Result<()> {
        debug!(role_id = %role_id, count = permission_ids.len(), "Syncing role permissions");

        // 先删除所有权限
        sqlx::query(
            "DELETE FROM role_permissions WHERE role_id = $1"
        )
        .bind(role_id)
        .execute(&self.pool)
        .await?;

        // 添加新权限
        for permission_id in permission_ids {
            sqlx::query(
                r#"
                INSERT INTO role_permissions (role_id, permission_id)
                VALUES ($1, $2)
                ON CONFLICT (role_id, permission_id) DO NOTHING
                "#
            )
            .bind(role_id)
            .bind(permission_id)
            .execute(&self.pool)
            .await?;
        }

        Ok(())
    }

    /// 为用户分配角色
    pub async fn assign_to_user(&self, user_id: Uuid, role_id: Uuid, assigned_by: Option<Uuid>) -> Result<UserRole> {
        debug!(user_id = %user_id, role_id = %role_id, "Assigning role to user");

        let user_role = sqlx::query_as::<_, UserRole>(
            r#"
            INSERT INTO user_roles (user_id, role_id, assigned_by)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, role_id) DO UPDATE SET assigned_by = $3
            RETURNING *
            "#
        )
        .bind(user_id)
        .bind(role_id)
        .bind(assigned_by)
        .fetch_one(&self.pool)
        .await?;

        info!(user_id = %user_id, role_id = %role_id, "Role assigned to user");
        Ok(user_role)
    }

    /// 移除用户角色
    pub async fn remove_from_user(&self, user_id: Uuid, role_id: Uuid) -> Result<bool> {
        debug!(user_id = %user_id, role_id = %role_id, "Removing role from user");

        let result = sqlx::query(
            "DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2"
        )
        .bind(user_id)
        .bind(role_id)
        .execute(&self.pool)
        .await?;

        Ok(result.rows_affected() > 0)
    }

    /// 获取用户的所有角色
    pub async fn get_user_roles(&self, user_id: Uuid) -> Result<Vec<Role>> {
        let roles = sqlx::query_as::<_, Role>(
            r#"
            SELECT r.*
            FROM roles r
            INNER JOIN user_roles ur ON r.id = ur.role_id
            WHERE ur.user_id = $1
            ORDER BY r.created_at
            "#
        )
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(roles)
    }

    /// 获取用户的所有权限（通过角色）
    pub async fn get_user_permissions(&self, user_id: Uuid) -> Result<Vec<String>> {
        let permissions: Vec<(String,)> = sqlx::query_as(
            r#"
            SELECT DISTINCT p.name
            FROM permissions p
            INNER JOIN role_permissions rp ON p.id = rp.permission_id
            INNER JOIN user_roles ur ON rp.role_id = ur.role_id
            WHERE ur.user_id = $1
            ORDER BY p.name
            "#
        )
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(permissions.into_iter().map(|p| p.0).collect())
    }

    /// 检查用户是否拥有特定权限
    pub async fn user_has_permission(&self, user_id: Uuid, permission_name: &str) -> Result<bool> {
        let exists: Option<(bool,)> = sqlx::query_as(
            r#"
            SELECT true
            FROM permissions p
            INNER JOIN role_permissions rp ON p.id = rp.permission_id
            INNER JOIN user_roles ur ON rp.role_id = ur.role_id
            WHERE ur.user_id = $1 AND p.name = $2
            LIMIT 1
            "#
        )
        .bind(user_id)
        .bind(permission_name)
        .fetch_optional(&self.pool)
        .await?;

        Ok(exists.is_some())
    }
}