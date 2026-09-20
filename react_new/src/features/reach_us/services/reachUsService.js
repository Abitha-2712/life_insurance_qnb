import { createCrudService } from '@/features/common/crud/createCrudService'

function mapReachUsRow(row) {
  return {
    ...row,
    id: String(row.id ?? ''),
    nameEn: row.nameEn || row.featureNameEn || row.titleEn || '',
    nameAr: row.nameAr || row.featureNameAr || row.titleAr || '',
    descEn: row.descEn || row.descriptionEn || '',
    descAr: row.descAr || row.descriptionAr || '',
    imageEn: row.imageEn || '',
    imageAr: row.imageAr || '',
    imageNameEn: row.imageNameEn || '',
    imageNameAr: row.imageNameAr || '',
    imageUrlEn: row.imageUrlEn || '',
    imageUrlAr: row.imageUrlAr || '',
    priority: String(row.priority ?? ''),
    status: row.status || 'ACT',
  }
}

function buildBody(form, { includeId = false } = {}) {
  const body = {
    nameEn: form.nameEn || '',
    nameAr: form.nameAr || '',
    descEn: form.descEn || '',
    descAr: form.descAr || '',
    priority: Number(form.priority) || 0,
    status: form.status || 'ACT',
  }
  if (includeId && form.id) body.id = Number(form.id) || form.id
  if (form.imageEn) body.imageEn = form.imageEn
  if (form.imageAr) body.imageAr = form.imageAr
  if (form.imageNameEn) body.imageNameEn = form.imageNameEn
  if (form.imageNameAr) body.imageNameAr = form.imageNameAr
  if (form.imageUrlEn) body.imageUrlEn = form.imageUrlEn
  if (form.imageUrlAr) body.imageUrlAr = form.imageUrlAr
  return body
}

/** Flutter ReachUsUrl — dataurl */
const service = createCrudService({
  name: 'reach_us',
  base: 'data',
  urls: {
    fetchAll: 'reachUs/getAll',
    create: 'reachUs/create',
    update: 'reachUs/update',
    delete: 'reachUs/delete',
  },
  idKeys: ['id'],
  mapRow: mapReachUsRow,
  buildCreateBody: (form) => buildBody(form),
  buildUpdateBody: (form) => buildBody(form, { includeId: true }),
  buildDeleteBody: (id) => ({ id: Number(id) || id }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
