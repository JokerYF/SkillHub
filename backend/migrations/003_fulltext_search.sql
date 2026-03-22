-- Full-text search extension and indexes
-- Add pg_trgm extension for trigram-based text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create full-text search index on skills (name + description)
CREATE INDEX idx_skills_fulltext ON skills
    USING GIN(to_tsvector('simple', name || ' ' || COALESCE(description, '')));

-- Create trigram index for LIKE/ILIKE pattern matching on name
CREATE INDEX idx_skills_name_trgm ON skills USING GIN(name gin_trgm_ops);

-- Create trigram index for LIKE/ILIKE pattern matching on description
CREATE INDEX idx_skills_description_trgm ON skills USING GIN(description gin_trgm_ops);