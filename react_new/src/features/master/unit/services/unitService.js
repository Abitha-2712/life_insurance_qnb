import { createCrudService } from '@/features/common/crud/createCrudService'
import { unitUrls } from '@/core/api/urls/unitUrls.js'

/** Unit — CSV bko-* URLs with english/arabic label mapping (city parity). */
const service = createCrudService({
  base: 'wfc',
  name: 'unit',
  urls: {
    fetchAll: unitUrls.fetchAllUnit,
    create: unitUrls.postUnit,
    update: unitUrls.postUnit,
    delete: unitUrls.deleteUnit,
  },
  idKeys: ['id', 'unitCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.unitCode || ''),
    unitCode: row.unitCode || row.code || '',
    unitName: row.englishLabel || row.unitName || row.name || '',
    unitNameAr: row.arabicLabel || row.unitNameAr || row.nameAr || '',
    status: row.status || 'Y',
  }),
  buildCreateBody: (form) => ({
    unitCode: form.unitCode,
    englishLabel: form.unitName,
    arabicLabel: form.unitNameAr,
    status: form.status || 'Y',
  }),
  buildUpdateBody: (form) => ({
    id: form.id,
    unitCode: form.unitCode,
    englishLabel: form.unitName,
    arabicLabel: form.unitNameAr,
    status: form.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export default service
