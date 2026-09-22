import { createCrudService } from '@/features/common/crud/createCrudService'
import { subProductsManagementUrls } from '@/core/api/urls/sub_products_managementUrls'

/** Flutter Apply_sub_product datasource: dataurl + csubproduct/getAll */
const service = createCrudService({
  name: 'Apply_sub_product',
  base: 'data',
  urls: {
    fetchAll: subProductsManagementUrls.getall,
    create: subProductsManagementUrls.save,
    update: subProductsManagementUrls.update,
    delete: subProductsManagementUrls.delte || subProductsManagementUrls.delete,
  },
  idKeys: ['id', 'subProductId', 'subProductCode', 'code'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.subProductId || row.subProductCode || row.code || ''),
    subProductCode: row.subProductCode || row.code || '',
    nameEn: row.nameEn || row.subProductName || row.englishLabel || row.name || '',
    nameAr: row.nameAr || row.subProductNameAr || row.arabicLabel || '',
    productName: row.productName || row.productCode || '',
    imageEn: row.imageEn || row.imageUrlEn || '',
    imageAr: row.imageAr || row.imageUrlAr || '',
    priority: row.priority ?? row.sequence ?? '',
    enableFlag: row.enableFlag ?? row.status ?? 'Y',
    status: row.enableFlag ?? row.status ?? 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, subProductId: row?.subProductId || id }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service

