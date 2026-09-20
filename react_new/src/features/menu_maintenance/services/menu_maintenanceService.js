import { createCrudService } from '@/features/common/crud/createCrudService'
import { menuEntitlementUrls } from '@/core/api/urls/menu_entitlementUrls'

const service = createCrudService({
  name: 'menu_maintenance',
  urls: {
    fetchAll: menuEntitlementUrls.viewMenus,
    create: menuEntitlementUrls.manageMenus,
    update: menuEntitlementUrls.manageMenus,
    delete: menuEntitlementUrls.manageMenus,
  },
  idKeys: ['id', 'menuCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.menuCode || ''),
    menuCode: row.menuCode || row.code || '',
    menuDesc: row.menuDesc || row.description || row.name || '',
    parentMenuCode: row.parentMenuCode || row.parentCode || '',
    roleCode: row.roleCode || row.role || '',
    sequence: row.sequence ?? row.seq ?? '',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
