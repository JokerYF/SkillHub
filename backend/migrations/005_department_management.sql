-- 部门管理迁移
-- 将 departments 重命名为 groups，添加 path 字段支持树形查询

-- 重命名 departments 表为 groups
ALTER TABLE departments RENAME TO groups;

-- 添加 path 字段用于树形查询（物化路径模式）
ALTER TABLE groups ADD COLUMN path VARCHAR(500);

-- 添加描述字段
ALTER TABLE groups ADD COLUMN description TEXT;

-- 添加创建者字段
ALTER TABLE groups ADD COLUMN created_by UUID REFERENCES users(id);

-- 添加 updated_at 字段
ALTER TABLE groups ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- 更新外键约束名称（可选，保持一致性）
ALTER TABLE users RENAME CONSTRAINT users_department_id_fkey TO users_group_id_fkey;

-- 重命名 users 表中的 department_id 为 group_id
ALTER TABLE users RENAME COLUMN department_id TO group_id;

-- 更新索引名称
DROP INDEX IF EXISTS idx_users_department;
CREATE INDEX idx_users_group ON users(group_id);

-- 为 groups 表添加索引
CREATE INDEX idx_groups_path ON groups(path);
CREATE INDEX idx_groups_parent ON groups(parent_id);
CREATE INDEX idx_groups_name ON groups(name);

-- 创建触发器自动维护 path 字段
CREATE OR REPLACE FUNCTION update_group_path()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NULL THEN
        -- 根节点：path = id
        NEW.path = NEW.id::text;
    ELSE
        -- 子节点：path = parent_path/id
        SELECT path || '/' || NEW.id::text
        INTO NEW.path
        FROM groups
        WHERE id = NEW.parent_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 插入时触发
CREATE TRIGGER groups_path_insert
    BEFORE INSERT ON groups
    FOR EACH ROW
    EXECUTE FUNCTION update_group_path();

-- 更新时触发（当 parent_id 改变时需要重新计算）
CREATE TRIGGER groups_path_update
    BEFORE UPDATE OF parent_id ON groups
    FOR EACH ROW
    WHEN (OLD.parent_id IS DISTINCT FROM NEW.parent_id)
    EXECUTE FUNCTION update_group_path();

-- updated_at 触发器
CREATE TRIGGER groups_updated_at
    BEFORE UPDATE ON groups
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- 创建用户组关联表（用户可以属于多个组）
CREATE TABLE user_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,       -- 是否为主组
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, group_id)
);

-- 索引
CREATE INDEX idx_user_groups_user ON user_groups(user_id);
CREATE INDEX idx_user_groups_group ON user_groups(group_id);

-- 技能可见性组关联表
CREATE TABLE skill_visibility_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(skill_id, group_id)
);

-- 索引
CREATE INDEX idx_skill_visibility_skill ON skill_visibility_groups(skill_id);
CREATE INDEX idx_skill_visibility_group ON skill_visibility_groups(group_id);

-- 创建查询子树的所有组的函数
CREATE OR REPLACE FUNCTION get_group_subtree(group_id UUID)
RETURNS TABLE (id UUID, name VARCHAR, path VARCHAR, depth INT) AS $$
BEGIN
    RETURN QUERY
    SELECT g.id, g.name, g.path,
           (length(g.path) - length(replace(g.path, '/', ''))) as depth
    FROM groups g
    WHERE g.path LIKE (
        SELECT path || '%'
        FROM groups
        WHERE id = group_id
    )
    ORDER BY g.path;
END;
$$ LANGUAGE plpgsql;

-- 创建查询祖先组的函数
CREATE OR REPLACE FUNCTION get_group_ancestors(group_id UUID)
RETURNS TABLE (id UUID, name VARCHAR, path VARCHAR) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE ancestors AS (
        SELECT id, name, parent_id, path
        FROM groups
        WHERE id = group_id
        UNION ALL
        SELECT g.id, g.name, g.parent_id, g.path
        FROM groups g
        INNER JOIN ancestors a ON g.id = (
            SELECT parent_id FROM groups WHERE id = a.id
        )
    )
    SELECT id, name, path FROM ancestors
    WHERE id != group_id
    ORDER BY path;
END;
$$ LANGUAGE plpgsql;