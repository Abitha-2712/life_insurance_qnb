import { createCrudService } from '@/features/common/crud/createCrudService'
import { subProductsManagementUrls } from '@/core/api/urls/sub_products_managementUrls'

const service = createCrudService({
  name: 'apply_product_subproduct',
  urls: {
    fetchAll: subProductsManagementUrls.getall,
    create: subProductsManagementUrls.save,
    update: subProductsManagementUrls.update,
    delete: subProductsManagementUrls.delte,
  },
  idKeys: ["id","subProductCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.subProductCode || row.code || ''),
    subProductCode: row.subProductCode || row.code || '',
    subProductName: row.subProductName || row.englishLabel || row.name || '',
    subProductNameAr: row.subProductNameAr || row.arabicLabel || '',
    productCode: row.productCode || row.parentCode || '',
    channel: row.channel || row.channelCode || 'ALL',
    sequence: String(row.sequence ?? row.seq ?? ''),
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
