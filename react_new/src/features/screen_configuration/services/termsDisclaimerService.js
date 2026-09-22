import { createCrudService } from '@/features/common/crud/createCrudService'
import { disclaimerUrls } from '@/core/api/urls/disclaimerUrls'

const service = createCrudService({
  name: 'terms_disclaimer',
  base: 'data',
  urls: {
    fetchAll: disclaimerUrls.fetchAllDisclaimer,
    create: disclaimerUrls.manageDisclaimer,
    update: disclaimerUrls.manageDisclaimer,
    delete: disclaimerUrls.manageDisclaimer,
  },
  idKeys: ["id","disclaimerCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.disclaimerCode || row.code || ''),
    disclaimerCode: row.disclaimerCode || row.code || '',
    titleEn: row.titleEn || row.title || row.englishLabel || '',
    titleAr: row.titleAr || row.arabicLabel || '',
    contentEn: row.contentEn || row.content || row.englishContent || '',
    contentAr: row.contentAr || row.arabicContent || '',
    channel: row.channel || 'ALL',
    version: row.version || '',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
