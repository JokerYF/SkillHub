import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '../index'
import {
  listRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  type Role,
  type CreateRoleRequest,
  type UpdateRoleRequest,
} from '../roles'

// Mock the api module
vi.mock('../index', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('Roles API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('listRoles', () => {
    it('should call GET /roles and return roles list', async () => {
      const mockRoles: Role[] = [
        {
          id: '1',
          name: 'admin',
          description: 'Administrator role',
          permissions: ['read', 'write', 'delete'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          name: 'user',
          description: 'Regular user role',
          permissions: ['read'],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ]

      vi.mocked(api.get).mockResolvedValueOnce({ data: mockRoles })

      const result = await listRoles()

      expect(api.get).toHaveBeenCalledWith('/roles')
      expect(result).toEqual(mockRoles)
    })
  })

  describe('getRole', () => {
    it('should call GET /roles/:id and return role', async () => {
      const mockRole: Role = {
        id: '1',
        name: 'admin',
        description: 'Administrator role',
        permissions: ['read', 'write', 'delete'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      vi.mocked(api.get).mockResolvedValueOnce({ data: mockRole })

      const result = await getRole('1')

      expect(api.get).toHaveBeenCalledWith('/roles/1')
      expect(result).toEqual(mockRole)
    })
  })

  describe('createRole', () => {
    it('should call POST /roles with role data and return created role', async () => {
      const newRole: CreateRoleRequest = {
        name: 'editor',
        description: 'Editor role',
        permissions: ['read', 'write'],
      }

      const mockCreatedRole: Role = {
        id: '3',
        ...newRole,
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
      }

      vi.mocked(api.post).mockResolvedValueOnce({ data: mockCreatedRole })

      const result = await createRole(newRole)

      expect(api.post).toHaveBeenCalledWith('/roles', newRole)
      expect(result).toEqual(mockCreatedRole)
    })
  })

  describe('updateRole', () => {
    it('should call PUT /roles/:id with update data and return updated role', async () => {
      const updateData: UpdateRoleRequest = {
        description: 'Updated description',
        permissions: ['read', 'write', 'delete', 'admin'],
      }

      const mockUpdatedRole: Role = {
        id: '1',
        name: 'admin',
        description: 'Updated description',
        permissions: ['read', 'write', 'delete', 'admin'],
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
      }

      vi.mocked(api.put).mockResolvedValueOnce({ data: mockUpdatedRole })

      const result = await updateRole('1', updateData)

      expect(api.put).toHaveBeenCalledWith('/roles/1', updateData)
      expect(result).toEqual(mockUpdatedRole)
    })
  })

  describe('deleteRole', () => {
    it('should call DELETE /roles/:id', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({})

      await deleteRole('1')

      expect(api.delete).toHaveBeenCalledWith('/roles/1')
    })
  })
})