import { createCrudService } from '@/features/common/crud/createCrudService'
import { forceUpdateUrls } from '@/core/api/urls/force_updateUrls'

const service = createCrudService({
  name: 'force_update_configuration',
  urls: {
    fetchAll: forceUpdateUrls.forceSummaryList,
    create: forceUpdateUrls.forceModify,
    update: forceUpdateUrls.forceModify,
    delete: forceUpdateUrls.forceModify,
  },
  idKeys: ['id', 'platform'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.platform || ''),
    platform: row.platform || '',
    version: row.version || row.minVersion || '',
    latestVersion: row.latestVersion || '',
    storeUrl: row.storeUrl || row.url || '',
    messageEn: row.messageEn || row.message || '',
    messageAr: row.messageAr || '',
    forceUpdate: row.forceUpdate || row.force || 'N',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
