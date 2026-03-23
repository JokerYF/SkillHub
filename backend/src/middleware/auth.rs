use axum::{
    async_trait,
    extract::{FromRef, FromRequestParts},
    http::request::Parts,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::state::AppState;
use crate::utils::error::ApiError;
use crate::utils::jwt;

/// 用户身份信息，从 JWT 中提取
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CurrentUser {
    pub id: Uuid,
    pub role: String,
}

/// 用于请求扩展的用户身份信息
#[derive(Debug, Clone)]
pub struct AuthUser(pub CurrentUser);

/// 从请求中提取用户身份
#[async_trait]
impl FromRequestParts<AppState> for AuthUser {
    type Rejection = ApiError;

    async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
        // 从 State 中获取 JWT 密钥
        let jwt_secret = &state.jwt_secret;

        // 从 Authorization header 中提取 token
        let auth_header = parts
            .headers
            .get(axum::http::header::AUTHORIZATION)
            .and_then(|h| h.to_str().ok());

        let auth_header = match auth_header {
            Some(h) => h,
            None => return Err(ApiError::Unauthorized),
        };

        // 验证 Bearer token 格式
        let token = if auth_header.starts_with("Bearer ") {
            &auth_header[7..]
        } else {
            return Err(ApiError::Unauthorized);
        };

        // 验证 JWT
        let claims = jwt::verify_token(token, jwt_secret)
            .map_err(|_| ApiError::Unauthorized)?;

        // 解析用户 ID
        let user_id = Uuid::parse_str(&claims.sub)
            .map_err(|_| ApiError::Unauthorized)?;

        Ok(AuthUser(CurrentUser {
            id: user_id,
            role: claims.role,
        }))
    }
}

/// 可选的用户身份提取（允许未认证用户）
#[derive(Debug, Clone)]
pub struct OptionalAuthUser(pub Option<CurrentUser>);

#[async_trait]
impl FromRequestParts<AppState> for OptionalAuthUser {
    type Rejection = ApiError;

    async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, Self::Rejection> {
        // 尝试提取用户身份，但不强制要求认证
        match AuthUser::from_request_parts(parts, state).await {
            Ok(AuthUser(user)) => Ok(OptionalAuthUser(Some(user))),
            Err(_) => Ok(OptionalAuthUser(None)),
        }
    }
}