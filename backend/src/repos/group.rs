use anyhow::{anyhow, Result};
use sqlx::PgPool;
use tracing::{debug, info, warn};
use uuid::Uuid;

use crate::models::group::{CreateGroup, Group, GroupDetail, GroupTreeNode, UpdateGroup, UserGroup};

pub struct GroupRepo {
    pool: PgPool,
}

impl GroupRepo {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    /// 创建用户组
    pub async fn create(&self, payload: &CreateGroup, _created_by: Option<Uuid>) -> Result<Group> {
        debug!(name = %payload.name, "Creating group");

        let group = sqlx::query_as::<_, Group>(
            r#"
            INSERT INTO groups (name, description, parent_id, created_by)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            "#
        )
        .bind(&payload.name)
        .bind(&payload.description)
        .bind(&payload.parent_id)
        .bind(&payload.created_by)
        .fetch_one(&self.pool)
        .await?;

        info!(group_id = %group.id, name = %group.name, "Group created successfully");
        Ok(group)
    }

    /// 根据 ID 查找用户组
    pub async fn find_by_id(&self, id: Uuid) -> Result<Option<Group>> {
        let group = sqlx::query_as::<_, Group>(
            "SELECT * FROM groups WHERE id = $1"
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(group)
    }

    /// 根据名称查找用户组
    pub async fn find_by_name(&self, name: &str) -> Result<Option<Group>> {
        let group = sqlx::query_as::<_, Group>(
            "SELECT * FROM groups WHERE name = $1"
        )
        .bind(name)
        .fetch_optional(&self.pool)
        .await?;

        Ok(group)
    }

    /// 获取所有用户组
    pub async fn find_all(&self) -> Result<Vec<Group>> {
        let groups = sqlx::query_as::<_, Group>(
            "SELECT * FROM groups ORDER BY path, created_at"
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(groups)
    }

    /// 获取根用户组
    pub async fn find_root_groups(&self) -> Result<Vec<Group>> {
        let groups = sqlx::query_as::<_, Group>(
            "SELECT * FROM groups WHERE parent_id IS NULL ORDER BY created_at"
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(groups)
    }

    /// 获取子用户组
    pub async fn find_children(&self, parent_id: Uuid) -> Result<Vec<Group>> {
        let groups = sqlx::query_as::<_, Group>(
            "SELECT * FROM groups WHERE parent_id = $1 ORDER BY created_at"
        )
        .bind(parent_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(groups)
    }

    /// 更新用户组
    pub async fn update(&self, id: Uuid, payload: &UpdateGroup) -> Result<Option<Group>> {
        debug!(group_id = %id, "Updating group");

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
        if payload.parent_id.is_some() {
            updates.push(format!("parent_id = ${}", param_count));
            param_count += 1;
        }

        if updates.is_empty() {
            return self.find_by_id(id).await;
        }

        let sql = format!(
            "UPDATE groups SET {} WHERE id = ${} RETURNING *",
            updates.join(", "),
            param_count
        );

        let mut query = sqlx::query_as::<_, Group>(&sql);

        if let Some(ref name) = payload.name {
            query = query.bind(name);
        }
        if let Some(ref description) = payload.description {
            query = query.bind(description);
        }
        if let Some(ref parent_id) = payload.parent_id {
            query = query.bind(parent_id);
        }
        query = query.bind(id);

        let group = query.fetch_optional(&self.pool).await?;

        if group.is_some() {
            info!(group_id = %id, "Group updated successfully");
        } else {
            warn!(group_id = %id, "Group not found");
        }

        Ok(group)
    }

    /// 删除用户组
    pub async fn delete(&self, id: Uuid) -> Result<bool> {
        debug!(group_id = %id, "Deleting group");

        // 检查是否有子组
        let children = self.find_children(id).await?;
        if !children.is_empty() {
            return Err(anyhow!("无法删除包含子组的用户组"));
        }

        let result = sqlx::query(
            "DELETE FROM groups WHERE id = $1"
        )
        .bind(id)
        .execute(&self.pool)
        .await?;

        let deleted = result.rows_affected() > 0;

        if deleted {
            info!(group_id = %id, "Group deleted successfully");
        } else {
            warn!(group_id = %id, "Group not found");
        }

        Ok(deleted)
    }

    /// 获取用户组详情
    pub async fn get_detail(&self, id: Uuid) -> Result<Option<GroupDetail>> {
        let group = self.find_by_id(id).await?;

        if group.is_none() {
            return Ok(None);
        }

        let group = group.unwrap();
        let member_count = self.get_member_count(id).await?;

        Ok(Some(GroupDetail {
            id: group.id,
            name: group.name,
            description: group.description,
            parent_id: group.parent_id,
            path: group.path,
            member_count,
            created_at: group.created_at,
            updated_at: group.updated_at,
        }))
    }

    /// 获取成员数量
    pub async fn get_member_count(&self, group_id: Uuid) -> Result<i64> {
        let count: (i64,) = sqlx::query_as(
            "SELECT COUNT(*) FROM user_groups WHERE group_id = $1"
        )
        .bind(group_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(count.0)
    }

    /// 添加用户到组
    pub async fn add_user(&self, group_id: Uuid, user_id: Uuid, is_primary: bool) -> Result<UserGroup> {
        debug!(group_id = %group_id, user_id = %user_id, "Adding user to group");

        let user_group = sqlx::query_as::<_, UserGroup>(
            r#"
            INSERT INTO user_groups (user_id, group_id, is_primary)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, group_id) DO UPDATE SET is_primary = $3
            RETURNING *
            "#
        )
        .bind(user_id)
        .bind(group_id)
        .bind(is_primary)
        .fetch_one(&self.pool)
        .await?;

        info!(group_id = %group_id, user_id = %user_id, "User added to group");
        Ok(user_group)
    }

    /// 从组移除用户
    pub async fn remove_user(&self, group_id: Uuid, user_id: Uuid) -> Result<bool> {
        debug!(group_id = %group_id, user_id = %user_id, "Removing user from group");

        let result = sqlx::query(
            "DELETE FROM user_groups WHERE group_id = $1 AND user_id = $2"
        )
        .bind(group_id)
        .bind(user_id)
        .execute(&self.pool)
        .await?;

        Ok(result.rows_affected() > 0)
    }

    /// 获取用户所属的所有组
    pub async fn get_user_groups(&self, user_id: Uuid) -> Result<Vec<Group>> {
        let groups = sqlx::query_as::<_, Group>(
            r#"
            SELECT g.*
            FROM groups g
            INNER JOIN user_groups ug ON g.id = ug.group_id
            WHERE ug.user_id = $1
            ORDER BY ug.is_primary DESC, g.name
            "#
        )
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(groups)
    }

    /// 获取组的所有成员
    pub async fn get_group_members(&self, group_id: Uuid) -> Result<Vec<Uuid>> {
        let members: Vec<(Uuid,)> = sqlx::query_as(
            "SELECT user_id FROM user_groups WHERE group_id = $1 ORDER BY joined_at"
        )
        .bind(group_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(members.into_iter().map(|m| m.0).collect())
    }

    /// 构建用户组树
    pub async fn build_tree(&self) -> Result<Vec<GroupTreeNode>> {
        let all_groups = self.find_all().await?;

        // 构建树形结构
        fn build_node(
            group: Group,
            all_groups: &[Group],
        ) -> GroupTreeNode {
            let children: Vec<GroupTreeNode> = all_groups
                .iter()
                .filter(|g| g.parent_id == Some(group.id))
                .map(|g| build_node(g.clone(), all_groups))
                .collect();

            GroupTreeNode {
                id: group.id,
                name: group.name,
                description: group.description,
                parent_id: group.parent_id,
                path: group.path,
                children,
            }
        }

        // 从根节点开始构建
        let tree: Vec<GroupTreeNode> = all_groups
            .iter()
            .filter(|g| g.parent_id.is_none())
            .map(|g| build_node(g.clone(), &all_groups))
            .collect();

        Ok(tree)
    }

    /// 获取子树所有组ID
    pub async fn get_subtree_ids(&self, group_id: Uuid) -> Result<Vec<Uuid>> {
        let ids: Vec<(Uuid,)> = sqlx::query_as(
            r#"
            SELECT id FROM get_group_subtree($1)
            "#
        )
        .bind(group_id)
        .fetch_all(&self.pool)
        .await?;

        Ok(ids.into_iter().map(|id| id.0).collect())
    }
}