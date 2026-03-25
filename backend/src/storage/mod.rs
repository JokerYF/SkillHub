// Storage stub - temporarily disabled due to Rust version compatibility
// aws-sdk-s3 requires Rust 1.91+, current stable is 1.86

use anyhow::Result;
use uuid::Uuid;

/// Storage stub - does nothing
#[derive(Clone)]
pub struct Storage;

impl Storage {
    pub async fn new(
        _endpoint: &str,
        _access_key: &str,
        _secret_key: &str,
        _bucket: &str,
    ) -> Result<Self> {
        Ok(Self)
    }

    pub async fn upload_skill_content(
        &self,
        _skill_id: Uuid,
        _version: &str,
        _content: &str,
    ) -> Result<String> {
        // Return empty path - storage is disabled
        Ok(String::new())
    }

    pub async fn download_skill_content(
        &self,
        _skill_id: Uuid,
        _version: &str,
    ) -> Result<Option<String>> {
        // Return None - storage is disabled
        Ok(None)
    }

    pub async fn delete_skill_content(
        &self,
        _skill_id: Uuid,
        _version: &str,
    ) -> Result<()> {
        Ok(())
    }

    pub async fn delete_skill(&self, _skill_id: Uuid) -> Result<()> {
        Ok(())
    }
}