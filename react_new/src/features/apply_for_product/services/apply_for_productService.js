import { createCrudService } from '@/features/common/crud/createCrudService'

function mapApplyProductRow(row) {
  return {
    ...row,
    id: String(row.id ?? row.productCode ?? ''),
    productCode: row.productCode || row.code || '',
    productNameEn: row.productNameEn || row.productName || row.englishLabel || row.name || '',
    productNameAr: row.productNameAr || row.arabicLabel || '',
    productDescriptionEn: row.productDescriptionEn || row.description || row.descriptionEn || '',
    productDescriptionAr: row.productDescriptionAr || row.descriptionAr || '',
    imageEn: row.imageEn || row.productImageEn || '',
    imageAr: row.imageAr || row.productImageAr || '',
    imageUrlEn: row.imageUrlEn || '',
    imageUrlAr: row.imageUrlAr || '',
    backgroundImageEn: row.backgroundImageEn || '',
    backgroundImageAr: row.backgroundImageAr || '',
    backgroundImageUrlEn: row.backgroundImageUrlEn || '',
    backgroundImageUrlAr: row.backgroundImageUrlAr || '',
    priorityOrder: String(row.priorityOrder ?? row.priority ?? row.sequence ?? ''),
    enabled: row.enabled || row.status || 'Y',
    status: row.enabled || row.status || 'Y',
  }
}

function buildActionBody(form, action) {
  return {
    action,
    id: form.id ? Number(form.id) || form.id : undefined,
    productCode: form.productCode || '',
    productNameEn: form.productNameEn || form.productName || '',
    productNameAr: form.productNameAr || '',
    productDescriptionEn: form.productDescriptionEn || '',
    productDescriptionAr: form.productDescriptionAr || '',
    imageEn: form.imageEn || '',
    imageAr: form.imageAr || '',
    imageUrlEn: form.imageUrlEn || '',
    imageUrlAr: form.imageUrlAr || '',
    backgroundImageEn: form.backgroundImageEn || '',
    backgroundImageAr: form.backgroundImageAr || '',
    backgroundImageUrlEn: form.backgroundImageUrlEn || '',
    backgroundImageUrlAr: form.backgroundImageUrlAr || '',
    priorityOrder: Number(form.priorityOrder) || 0,
    enabled: form.enabled || form.status || 'Y',
  }
}

/** Flutter ApplyProductDatasource — cproduct/getAll + cproduct/action */
const service = createCrudService({
  name: 'apply_for_product',
  base: 'data',
  urls: {
    fetchAll: 'cproduct/getAll',
    create: 'cproduct/action',
    update: 'cproduct/action',
    delete: 'cproduct/action',
  },
  idKeys: ['id', 'productCode'],
  mapRow: mapApplyProductRow,
  buildCreateBody: (form) => {
    const body = buildActionBody(form, 'ADD')
    delete body.id
    return body
  },
  buildUpdateBody: (form) => buildActionBody(form, 'UPDATE'),
  buildDeleteBody: (id, row) => ({
    action: 'DELETE',
    id: row?.id ?? Number(id) ?? id,
    productCode: row?.productCode,
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service, mapApplyProductRow }
export default service
