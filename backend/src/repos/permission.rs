use anyhow::Result;
use sqlx::PgPool;
use tracing::{debug, info};
use uuid::Uuid;

use crate::models::permission::{CreatePermission, Permission};

pub struct PermissionRepo {
    pool: PgPool,
}

impl PermissionRepo {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    /// 创建权限
    pub async fn create(&self, payload: &CreatePermission) -> Result<Permission> {
        debug!(name = %payload.name, resource = %payload.resource, action = %payload.action, "Creating permission");

        let permission = sqlx::query_as::<_, Permission>(
            r#"
            INSERT INTO permissions (name, description, resource, action)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            "#
        )
        .bind(&payload.name)
        .bind(&payload.description)
        .bind(&payload.resource)
        .bind(&payload.action)
        .fetch_one(&self.pool)
        .await?;

        info!(permission_id = %permission.id, name = %permission.name, "Permission created successfully");
        Ok(permission)
    }

    /// 根据 ID 查找权限
    pub async fn find_by_id(&self, id: Uuid) -> Result<Option<Permission>> {
        let permission = sqlx::query_as::<_, Permission>(
            "SELECT * FROM permissions WHERE id = $1"
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(permission)
    }

    /// 根据名称查找权限
    pub async fn find_by_name(&self, name: &str) -> Result<Option<Permission>> {
        let permission = sqlx::query_as::<_, Permission>(
            "SELECT * FROM permissions WHERE name = $1"
        )
        .bind(name)
        .fetch_optional(&self.pool)
        .await?;

        Ok(permission)
    }

    /// 获取所有权限
    pub async fn find_all(&self) -> Result<Vec<Permission>> {
        let permissions = sqlx::query_as::<_, Permission>(
            "SELECT * FROM permissions ORDER BY resource, action"
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(permissions)
    }

    /// 按资源分组获取权限
    pub async fn find_by_resource(&self, resource: &str) -> Result<Vec<Permission>> {
        let permissions = sqlx::query_as::<_, Permission>(
            "SELECT * FROM permissions WHERE resource = $1 ORDER BY action"
        )
        .bind(resource)
        .fetch_all(&self.pool)
        .await?;

        Ok(permissions)
    }

    /// 删除权限
    pub async fn delete(&self, id: Uuid) -> Result<bool> {
        debug!(permission_id = %id, "Deleting permission");

        let result = sqlx::query(
            "DELETE FROM permissions WHERE id = $1"
        )
        .bind(id)
        .execute(&self.pool)
        .await?;

        Ok(result.rows_affected() > 0)
    }

    /// 获取所有权限资源列表
    pub async fn get_resources(&self) -> Result<Vec<String>> {
        let resources: Vec<(String,)> = sqlx::query_as(
            "SELECT DISTINCT resource FROM permissions ORDER BY resource"
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(resources.into_iter().map(|r| r.0).collect())
    }
}