import { createCrudService } from '@/features/common/crud/createCrudService'
import { blocklistIpUrls } from '@/core/api/urls/blocklist_ipUrls'

/** Flutter blocklist_ip_url — dataurl paths backoffice-service/ip-block/*. */
const service = createCrudService({
  name: 'blocklist_ip',
  base: 'wfc',
  urls: {
    fetchAll: blocklistIpUrls.fetchAllIP,
    create: blocklistIpUrls.postBlockIP,
    update: blocklistIpUrls.postBlockIP,
    delete: blocklistIpUrls.postBlockIP,
  },
  idKeys: ['id', 'ipAddress'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.ipAddress || row.ip || ''),
    ipAddress: row.ipAddress || row.ip || '',
    reason: row.reason || row.blockReason || '',
    blockedBy: row.blockedBy || row.createdBy || '',
    blockedOn: row.blockedOn || row.createdOn || row.blockDate || '',
    channel: row.channel || row.channelCode || 'ALL',
    remarks: row.remarks || row.comments || '',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, ipAddress: row?.ipAddress || id, status: 'N', action: 'UNBLOCK' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
