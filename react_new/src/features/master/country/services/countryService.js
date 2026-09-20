import { createCrudService } from '@/features/common/crud/createCrudService'
import { countryUrls } from '@/core/api/urls/countryUrls.js'

/** Country — CSV bko-* URLs with english/arabic label mapping (city parity). */
const service = createCrudService({
  base: 'wfc',
  name: 'country',
  urls: {
    fetchAll: countryUrls.fetchAllCountry,
    create: countryUrls.postCountry,
    update: countryUrls.postCountry,
    delete: countryUrls.deleteCountry,
  },
  idKeys: ['id', 'countryCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.countryCode || ''),
    countryCode: row.countryCode || row.code || '',
    countryName: row.englishLabel || row.countryName || row.name || '',
    countryNameAr: row.arabicLabel || row.countryNameAr || row.nameAr || '',
    status: row.status || 'Y',
  }),
  buildCreateBody: (form) => ({
    countryCode: form.countryCode,
    englishLabel: form.countryName,
    arabicLabel: form.countryNameAr,
    status: form.status || 'Y',
  }),
  buildUpdateBody: (form) => ({
    id: form.id,
    countryCode: form.countryCode,
    englishLabel: form.countryName,
    arabicLabel: form.countryNameAr,
    status: form.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export default service
