-- RBAC 权限系统迁移
-- 创建角色表、权限表、角色权限关联表、用户角色关联表、审计日志表

-- 角色表
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,        -- 是否为系统内置角色
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 权限表
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,      -- 格式: resource:action，如 skills:read
    description TEXT,
    resource VARCHAR(50) NOT NULL,          -- 资源名称：skills, users, roles, groups
    action VARCHAR(20) NOT NULL,            -- 操作：create, read, update, delete, manage
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 角色权限关联表
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- 用户角色关联表
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),   -- 分配者
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- 审计日志表
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,            -- 操作类型：user.login, skill.create, role.assign
    resource_type VARCHAR(50),               -- 资源类型：user, skill, role, group
    resource_id UUID,                        -- 资源ID
    details JSONB,                           -- 操作详情
    ip_address VARCHAR(45),                  -- 客户端IP
    user_agent TEXT,                         -- 客户端信息
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_permissions_resource ON permissions(resource);
CREATE INDEX idx_permissions_name ON permissions(name);
CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- updated_at 触发器
CREATE TRIGGER roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- 插入系统默认角色
INSERT INTO roles (name, description, is_system) VALUES
    ('admin', '系统管理员，拥有所有权限', true),
    ('manager', '部门管理员，管理本部门用户和技能', true),
    ('user', '普通用户，基本读写权限', true);

-- 插入默认权限
INSERT INTO permissions (name, description, resource, action) VALUES
    -- 技能权限
    ('skills:create', '创建技能', 'skills', 'create'),
    ('skills:read', '查看技能', 'skills', 'read'),
    ('skills:update', '更新技能', 'skills', 'update'),
    ('skills:delete', '删除技能', 'skills', 'delete'),
    ('skills:manage', '管理所有技能', 'skills', 'manage'),
    -- 用户权限
    ('users:create', '创建用户', 'users', 'create'),
    ('users:read', '查看用户', 'users', 'read'),
    ('users:update', '更新用户', 'users', 'update'),
    ('users:delete', '删除用户', 'users', 'delete'),
    ('users:manage', '管理所有用户', 'users', 'manage'),
    -- 角色权限
    ('roles:create', '创建角色', 'roles', 'create'),
    ('roles:read', '查看角色', 'roles', 'read'),
    ('roles:update', '更新角色', 'roles', 'update'),
    ('roles:delete', '删除角色', 'roles', 'delete'),
    ('roles:manage', '管理所有角色', 'roles', 'manage'),
    -- 用户组权限
    ('groups:create', '创建用户组', 'groups', 'create'),
    ('groups:read', '查看用户组', 'groups', 'read'),
    ('groups:update', '更新用户组', 'groups', 'update'),
    ('groups:delete', '删除用户组', 'groups', 'delete'),
    ('groups:manage', '管理所有用户组', 'groups', 'manage'),
    -- 审计日志权限
    ('audit:read', '查看审计日志', 'audit', 'read');

-- 为 admin 角色分配所有权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin';

-- 为 manager 角色分配部分权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'manager'
AND p.name IN (
    'skills:create', 'skills:read', 'skills:update', 'skills:delete',
    'users:read', 'users:update',
    'groups:read'
);

-- 为 user 角色分配基本权限
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'user'
AND p.name IN (
    'skills:create', 'skills:read', 'skills:update',
    'users:read'
);