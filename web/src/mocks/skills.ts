/**
 * Mock 数据 - 技能模块
 *
 * 基于 docs/api-spec.yaml 生成
 * 用于前端开发时模拟后端 API 响应
 */

import type { Skill, SkillVersion, SkillTag } from '@/api/skills'

export const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'Python 安全编码规范',
    slug: 'python-security',
    description: '基于 OWASP 和实战经验的安全编码技能',
    readme: '# Python 安全编码规范\n\n## 概述\n\n本技能包含 Python 安全编码的最佳实践...',
    author_id: '1',
    version: 'v2.1.0',
    tags: ['python', 'security', 'owasp'],
    is_public: true,
    download_count: 1234,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-03-20T15:30:00Z',
  },
  {
    id: '2',
    name: 'React 组件设计模式',
    slug: 'react-patterns',
    description: 'React 组件设计模式和最佳实践',
    readme: '# React 组件设计模式\n\n## 概述\n\n本技能包含 React 组件设计的常用模式...',
    author_id: '2',
    version: 'v1.0.0',
    tags: ['react', 'frontend', 'patterns'],
    is_public: true,
    download_count: 856,
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-02-15T12:00:00Z',
  },
  {
    id: '3',
    name: 'Git 工作流规范',
    slug: 'git-workflow',
    description: '团队 Git 工作流和提交规范',
    readme: '# Git 工作流规范\n\n## 概述\n\n本技能定义团队 Git 工作流...',
    author_id: '1',
    version: 'v1.2.0',
    tags: ['git', 'workflow', 'team'],
    is_public: true,
    download_count: 2341,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-03-01T10:00:00Z',
  },
]

export const mockSkillVersions: SkillVersion[] = [
  {
    id: '1',
    skill_id: '1',
    version: 'v2.1.0',
    storage_path: '/skills/python-security/v2.1.0',
    content: '# Python 安全编码规范 v2.1.0\n\n## 更新内容\n\n- 新增 OWASP Top 10 检查',
    changelog: '新增 OWASP Top 10 检查',
    digest: 'abc123',
    created_at: '2024-03-20T15:30:00Z',
    created_by: '1',
  },
  {
    id: '2',
    skill_id: '1',
    version: 'v2.0.0',
    storage_path: '/skills/python-security/v2.0.0',
    content: '# Python 安全编码规范 v2.0.0',
    changelog: '重大更新',
    digest: 'def456',
    created_at: '2024-02-01T10:00:00Z',
    created_by: '1',
  },
]

export const mockSkillTags: SkillTag[] = [
  {
    id: '1',
    skill_id: '1',
    tag: 'latest',
    version: 'v2.1.0',
    updated_at: '2024-03-20T15:30:00Z',
    updated_by: '1',
  },
  {
    id: '2',
    skill_id: '1',
    tag: 'stable',
    version: 'v2.0.0',
    updated_at: '2024-02-01T10:00:00Z',
    updated_by: '1',
  },
]