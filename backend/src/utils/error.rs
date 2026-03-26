use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;

#[derive(Debug)]
pub enum ApiError {
    BadRequest(String),
    Unauthorized,
    Forbidden,
    NotFound(String),
    Conflict(String),
    InternalServerError,
}

#[derive(Serialize)]
struct ErrorResponse {
    error: ErrorDetail,
}

#[derive(Serialize)]
struct ErrorDetail {
    code: String,
    message: String,
}

/// 根据错误消息内容判断具体的错误码
fn determine_bad_request_code(msg: &str) -> &'static str {
    let msg_lower = msg.to_lowercase();

    if msg_lower.contains("邮箱") || msg_lower.contains("email") {
        "EMAIL_REGISTERED"
    } else if msg_lower.contains("用户名") || msg_lower.contains("username") {
        "USERNAME_TAKEN"
    } else if msg_lower.contains("密码") || msg_lower.contains("password") {
        "INVALID_PASSWORD"
    } else {
        "BAD_REQUEST"
    }
}

/// 根据错误消息内容判断 NotFound 类型的错误码
fn determine_not_found_code(msg: &str) -> &'static str {
    let msg_lower = msg.to_lowercase();

    if msg_lower.contains("用户") || msg_lower.contains("user") {
        "USER_NOT_FOUND"
    } else {
        "NOT_FOUND"
    }
}

/// 根据错误消息内容判断 Conflict 类型的错误码
fn determine_conflict_code(msg: &str) -> &'static str {
    let msg_lower = msg.to_lowercase();

    if msg_lower.contains("邮箱") || msg_lower.contains("email") {
        "EMAIL_REGISTERED"
    } else if msg_lower.contains("用户名") || msg_lower.contains("username") {
        "USERNAME_TAKEN"
    } else {
        "CONFLICT"
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, code) = match self {
            ApiError::BadRequest(msg) => {
                let code = determine_bad_request_code(&msg);
                (StatusCode::BAD_REQUEST, code)
            }
            ApiError::Unauthorized => (StatusCode::UNAUTHORIZED, "UNAUTHORIZED"),
            ApiError::Forbidden => (StatusCode::FORBIDDEN, "FORBIDDEN"),
            ApiError::NotFound(msg) => {
                let code = determine_not_found_code(&msg);
                (StatusCode::NOT_FOUND, code)
            }
            ApiError::Conflict(msg) => {
                let code = determine_conflict_code(&msg);
                (StatusCode::CONFLICT, code)
            }
            ApiError::InternalServerError => {
                (StatusCode::INTERNAL_SERVER_ERROR, "INTERNAL_ERROR")
            }
        };

        let body = Json(ErrorResponse {
            error: ErrorDetail {
                code: code.to_string(),
                message: String::new(),
            },
        });

        (status, body).into_response()
    }
}

impl From<sqlx::Error> for ApiError {
    fn from(err: sqlx::Error) -> Self {
        match err {
            sqlx::Error::RowNotFound => ApiError::NotFound("记录不存在".into()),
            sqlx::Error::Database(db_err) if db_err.constraint().is_some() => {
                ApiError::Conflict("数据冲突，可能是重复的值".into())
            }
            _ => ApiError::InternalServerError,
        }
    }
}

impl From<anyhow::Error> for ApiError {
    fn from(err: anyhow::Error) -> Self {
        // 检查是否是业务错误（通过错误消息判断）
        let msg = err.to_string();

        // 认证相关错误返回 401 Unauthorized
        if msg.contains("邮箱或密码错误") || msg.contains("账户已被禁用") {
            ApiError::Unauthorized
        } else if msg.contains("已被") || msg.contains("不存在") || msg.contains("无效") {
            ApiError::BadRequest(msg)
        } else if msg.contains("无权") {
            ApiError::Forbidden
        } else {
            // 记录详细错误日志，但不暴露给客户端
            tracing::error!("Internal error: {}", msg);
            ApiError::InternalServerError
        }
    }
}