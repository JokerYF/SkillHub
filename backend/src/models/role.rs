use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

/// 角色模型
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Role {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub is_system: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// 创建角色请求
#[derive(Debug, Deserialize)]
pub struct CreateRole {
    pub name: String,
    pub description: Option<String>,
}

/// 更新角色请求
#[derive(Debug, Deserialize)]
pub struct UpdateRole {
    pub name: Option<String>,
    pub description: Option<String>,
}

/// 角色详情（包含权限列表）
#[derive(Debug, Serialize)]
pub struct RoleDetail {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub is_system: bool,
    pub permissions: Vec<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// 用户角色关联
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserRole {
    pub id: Uuid,
    pub user_id: Uuid,
    pub role_id: Uuid,
    pub assigned_by: Option<Uuid>,
    pub assigned_at: DateTime<Utc>,
}

/// 分配角色请求
#[derive(Debug, Deserialize)]
pub struct AssignRole {
    pub role_id: Uuid,
}