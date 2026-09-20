import { createCrudService } from '@/features/common/crud/createCrudService'

function mapAthkarRow(row) {
  return {
    ...row,
    id: String(row.id ?? row.rowNo ?? ''),
    rowNo: row.rowNo ?? row.rowNumber ?? '',
    categoryEn: row.categoryEn || row.englishName || '',
    categoryAr: row.categoryAr || row.arabicName || '',
    contentEn: row.contentEn || row.englishContent || '',
    contentAr: row.contentAr || row.arabicContent || '',
    status: row.status || 'Y',
  }
}

function buildPayload(form) {
  return {
    id: form.id ? Number(form.id) || form.id : undefined,
    rowNo: Number(form.rowNo) || 0,
    categoryEn: form.categoryEn || '',
    categoryAr: form.categoryAr || '',
    contentEn: form.contentEn || '',
    contentAr: form.contentAr || '',
    status: form.status || 'Y',
  }
}

/** Flutter AthkarUrl — athkar/fetchAll|add|update|delete|search */
const service = createCrudService({
  name: 'athkar',
  base: 'data',
  urls: {
    fetchAll: 'athkar/fetchAll',
    create: 'athkar/add',
    update: 'athkar/update',
    delete: 'athkar/delete',
  },
  idKeys: ['id', 'rowNo'],
  mapRow: mapAthkarRow,
  buildCreateBody: (form) => {
    const body = buildPayload(form)
    delete body.id
    return body
  },
  buildUpdateBody: (form) => buildPayload(form),
  buildDeleteBody: (id, row) => ({ id: row?.id ?? Number(id) ?? id }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service, mapAthkarRow }
export default service
