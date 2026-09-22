import { createCrudService } from '@/features/common/crud/createCrudService'
import { blockListUrls } from '@/core/api/urls/block_listUrls'

/** Flutter block_list_url — imei-block/list|manage on dataurl. */
const service = createCrudService({
  name: 'blocklist_imei',
  base: 'data',
  urls: {
    fetchAll: blockListUrls.blockIMEIList,
    create: blockListUrls.blockIMEIModify,
    update: blockListUrls.blockIMEIModify,
    delete: blockListUrls.blockIMEIModify,
  },
  idKeys: ['id', 'imei'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.imei || ''),
    imei: row.imei || row.imeiNumber || '',
    reason: row.reason || row.blockReason || '',
    blockedBy: row.blockedBy || row.createdBy || '',
    blockedOn: row.blockedOn || row.createdOn || row.blockDate || '',
    channel: row.channel || row.channelCode || 'ALL',
    remarks: row.remarks || row.comments || '',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, imei: row?.imei || id, status: 'N', action: 'UNBLOCK' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
