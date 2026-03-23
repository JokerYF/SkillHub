pub mod auth;
pub mod skills;
pub mod users;

use axum::Router;
use crate::state::AppState;

pub fn routes() -> Router<AppState> {
    Router::new()
        .merge(auth::routes())
        .merge(skills::routes())
        .merge(users::routes())
}