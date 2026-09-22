import { createCrudService } from '@/features/common/crud/createCrudService'
import { customerViewUrls } from '@/core/api/urls/customer_viewUrls'

/** Flutter customer_view_url — blockUnblock/detail requires unitId+channelId in body
 *  (live probe: empty body → 000001; {unitId,channelId} → 000000 SUCCESS). */
const service = createCrudService({
  name: 'customer_360_view',
  base: 'bo',
  fetchBody: { unitId: 'PRD', channelId: 'BO' },
  urls: {
    fetchAll: customerViewUrls.blockUserDetail,
    create: customerViewUrls.addBlockedUser,
    update: customerViewUrls.blockUnblockUpdate,
    delete: customerViewUrls.blockUnblockUpdate,
  },
  idKeys: ['id', 'customerId', 'cif', 'userId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.customerId || row.cif || row.userId || ''),
    customerId: row.customerId || row.userId || '',
    customerName: row.customerName || row.name || row.englishName || '',
    cif: row.cif || row.cifNumber || '',
    mobile: row.mobile || row.mobileNumber || row.phone || '',
    blockReason: row.blockReason || row.reason || '',
    blockStatus:
      row.blockStatus ||
      row.userStatus ||
      (row.blocked === true ? 'BLOCKED' : row.blocked === false ? 'ACTIVE' : ''),
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
