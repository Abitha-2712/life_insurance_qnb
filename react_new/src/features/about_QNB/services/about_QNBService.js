import { createCrudService } from '@/features/common/crud/createCrudService'
import { disclaimerUrls } from '@/core/api/urls/disclaimerUrls'

const service = createCrudService({
  name: 'about_QNB',
  base: 'data',
  urls: {
    fetchAll: disclaimerUrls.fetchAllDisclaimer,
    create: disclaimerUrls.manageDisclaimer,
    update: disclaimerUrls.manageDisclaimer,
    delete: disclaimerUrls.manageDisclaimer,
  },
  idKeys: ["id","contentCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.contentCode || row.code || ''),
    contentCode: row.contentCode || row.code || row.disclaimerCode || '',
    title: row.title || row.englishLabel || row.name || '',
    titleAr: row.titleAr || row.arabicLabel || '',
    contentEn: row.contentEn || row.content || row.englishContent || '',
    contentAr: row.contentAr || row.arabicContent || '',
    channel: row.channel || row.channelCode || 'ALL',
    version: String(row.version ?? ''),
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N', action: 'DELETE' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
