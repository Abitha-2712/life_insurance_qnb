import { createCrudService } from '@/features/common/crud/createCrudService'
import { currencyUrls } from '@/core/api/urls/currencyUrls.js'

/** Currency — CSV bko-* URLs with english/arabic label mapping (city parity). */
const service = createCrudService({
  base: 'wfc',
  name: 'currency',
  urls: {
    fetchAll: currencyUrls.fetchAllCurrency,
    create: currencyUrls.fetchAllCurrencyPost,
    update: currencyUrls.fetchAllCurrencyPost,
    delete: currencyUrls.fetchAllCurrencyDelete,
  },
  idKeys: ['id', 'currencyCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.currencyCode || ''),
    currencyCode: row.currencyCode || row.code || '',
    currencyName: row.englishLabel || row.currencyName || row.name || '',
    currencyNameAr: row.arabicLabel || row.currencyNameAr || row.nameAr || '',
    status: row.status || 'Y',
  }),
  buildCreateBody: (form) => ({
    currencyCode: form.currencyCode,
    englishLabel: form.currencyName,
    arabicLabel: form.currencyNameAr,
    status: form.status || 'Y',
  }),
  buildUpdateBody: (form) => ({
    id: form.id,
    currencyCode: form.currencyCode,
    englishLabel: form.currencyName,
    arabicLabel: form.currencyNameAr,
    status: form.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export default service
