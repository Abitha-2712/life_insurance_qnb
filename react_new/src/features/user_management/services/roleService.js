import { createCrudService } from '@/features/common/crud/createCrudService'
import { userRoleManagementUrls } from '@/core/api/urls/user_role_managementUrls'

const service = createCrudService({
  base: 'wfc',
  name: 'role_management',
  urls: {
    fetchAll: userRoleManagementUrls.allUser,
    create: userRoleManagementUrls.addUserRole,
    update: userRoleManagementUrls.addUserRole,
    delete: userRoleManagementUrls.deleteRole,
  },
  idKeys: ['id', 'roleCode', 'roleId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.roleCode || row.roleId || ''),
    roleCode: row.roleCode || row.code || '',
    roleName: row.roleName || row.name || row.roleDesc || '',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export default service
