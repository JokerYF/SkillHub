use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

/// 权限模型
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Permission {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub resource: String,
    pub action: String,
    pub created_at: DateTime<Utc>,
}

/// 创建权限请求
#[derive(Debug, Deserialize)]
pub struct CreatePermission {
    pub name: String,
    pub description: Option<String>,
    pub resource: String,
    pub action: String,
}

/// 权限资源枚举
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Resource {
    Skills,
    Users,
    Roles,
    Groups,
    Audit,
}

impl Resource {
    pub fn as_str(&self) -> &'static str {
        match self {
            Resource::Skills => "skills",
            Resource::Users => "users",
            Resource::Roles => "roles",
            Resource::Groups => "groups",
            Resource::Audit => "audit",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "skills" => Some(Resource::Skills),
            "users" => Some(Resource::Users),
            "roles" => Some(Resource::Roles),
            "groups" => Some(Resource::Groups),
            "audit" => Some(Resource::Audit),
            _ => None,
        }
    }
}

/// 权限操作枚举
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Action {
    Create,
    Read,
    Update,
    Delete,
    Manage,
}

impl Action {
    pub fn as_str(&self) -> &'static str {
        match self {
            Action::Create => "create",
            Action::Read => "read",
            Action::Update => "update",
            Action::Delete => "delete",
            Action::Manage => "manage",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "create" => Some(Action::Create),
            "read" => Some(Action::Read),
            "update" => Some(Action::Update),
            "delete" => Some(Action::Delete),
            "manage" => Some(Action::Manage),
            _ => None,
        }
    }
}

/// 生成权限名称
pub fn permission_name(resource: &str, action: &str) -> String {
    format!("{}:{}", resource, action)
}