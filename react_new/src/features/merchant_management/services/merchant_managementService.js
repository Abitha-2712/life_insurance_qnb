import { createCrudService } from '@/features/common/crud/createCrudService'

function mapMerchantRow(row) {
  return {
    ...row,
    id: String(row.merchantId ?? row.id ?? row.merchantCode ?? ''),
    merchantId: row.merchantId ?? row.id,
    merchantCode: row.merchantCode || row.code || '',
    merchantNameEn: row.merchantNameEn || row.merchantName || row.name || '',
    merchantNameAr: row.merchantNameAr || '',
    sectorId: String(row.sectorId ?? ''),
    sectorName: row.sectorName || row.category || '',
    merchantImageEn: row.merchantImageEn || row.merchantImage || '',
    merchantImageAr: row.merchantImageAr || '',
    status: row.status || 'ACT',
  }
}

function buildBody(form, { includeId = false } = {}) {
  const body = {
    merchantCode: form.merchantCode || '',
    merchantNameEn: form.merchantNameEn || '',
    merchantNameAr: form.merchantNameAr || '',
    merchantImage: form.merchantImageEn || form.merchantImage || '',
    merchantImageAr: form.merchantImageAr || '',
    sectorId: Number(form.sectorId) || 0,
    status: form.status || 'ACT',
  }
  if (includeId) {
    body.merchantId = Number(form.merchantId || form.id) || form.merchantId || form.id
    if (form.createdBy != null) body.createdBy = form.createdBy
    if (form.createdDate != null) body.createdDate = form.createdDate
    if (form.lastModifiedBy != null) body.lastModifiedBy = form.lastModifiedBy
    if (form.lastModifiedDate != null) body.lastModifiedDate = form.lastModifiedDate
  }
  return body
}

/** Flutter MerchantUrl — merchantmaster/* */
const service = createCrudService({
  name: 'merchant_management',
  base: 'data',
  urls: {
    fetchAll: 'merchantmaster/getAll',
    create: 'merchantmaster/create',
    update: 'merchantmaster/update',
    delete: 'merchantmaster/delete',
  },
  idKeys: ['merchantId', 'id', 'merchantCode'],
  mapRow: mapMerchantRow,
  buildCreateBody: (form) => buildBody(form),
  buildUpdateBody: (form) => buildBody(form, { includeId: true }),
  buildDeleteBody: (id, row) => ({
    merchantId: Number(row?.merchantId || row?.id || id) || id,
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
