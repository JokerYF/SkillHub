use axum::{
    async_trait,
    extract::FromRequestParts,
    http::request::Parts,
};
use tracing::warn;
use uuid::Uuid;

use crate::middleware::auth::{AuthUser, CurrentUser};
use crate::services::permission::PermissionService;
use crate::state::AppState;
use crate::utils::error::ApiError;

/// 权限检查提取器
/// 用于验证用户是否有特定资源和操作的权限
pub struct RequirePermission {
    pub user: CurrentUser,
}

impl RequirePermission {
    /// 创建权限检查器
    pub fn new(resource: &'static str, action: &'static str) -> PermissionGuard {
        PermissionGuard { resource, action }
    }
}

/// 权限守卫，用于在路由中检查权限
pub struct PermissionGuard {
    pub resource: &'static str,
    pub action: &'static str,
}

#[async_trait]
impl FromRequestParts<AppState> for RequirePermission {
    type Rejection = ApiError;

    async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
        // 首先获取认证用户
        let AuthUser(current_user) = AuthUser::from_request_parts(parts, state).await?;

        Ok(RequirePermission { user: current_user })
    }
}

/// 检查用户是否有指定权限
pub async fn check_permission(
    state: &AppState,
    user_id: Uuid,
    resource: &str,
    action: &str,
) -> Result<bool, ApiError> {
    let service = PermissionService::new(state.db.clone());

    let has_permission = service.check_permission(user_id, resource, action).await
        .map_err(|e| {
            warn!(error = %e, "Permission check failed");
            ApiError::InternalServerError
        })?;

    Ok(has_permission)
}

/// 检查用户是否是管理员
pub async fn is_admin(state: &AppState, user_id: Uuid) -> Result<bool, ApiError> {
    let service = PermissionService::new(state.db.clone());

    let is_admin = service.is_admin(user_id).await
        .map_err(|e| {
            warn!(error = %e, "Admin check failed");
            ApiError::InternalServerError
        })?;

    Ok(is_admin)
}

/// 管理员权限提取器
/// 验证用户是否是管理员
pub struct AdminUser(pub CurrentUser);

#[async_trait]
impl FromRequestParts<AppState> for AdminUser {
    type Rejection = ApiError;

    async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
        let AuthUser(current_user) = AuthUser::from_request_parts(parts, state).await?;

        // 检查是否是管理员
        let is_admin = is_admin(state, current_user.id).await?;

        if !is_admin {
            warn!(user_id = %current_user.id, "Non-admin user attempted to access admin-only resource");
            return Err(ApiError::Forbidden);
        }

        Ok(AdminUser(current_user))
    }
}

/// 权限检查宏辅助
/// 用法: require_permission!(state, user_id, "skills", "create")
#[macro_export]
macro_rules! require_permission {
    ($state:expr, $user_id:expr, $resource:expr, $action:expr) => {{
        let service = $crate::services::permission::PermissionService::new($state.db.clone());
        let has = service.check_permission($user_id, $resource, $action).await?;
        if !has {
            return Err($crate::utils::error::ApiError::Forbidden);
        }
    }};
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_permission_name() {
        assert_eq!(
            $crate::models::permission::permission_name("skills", "read"),
            "skills:read"
        );
    }
}