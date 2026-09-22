import { createCrudService } from '@/features/common/crud/createCrudService'
import { subProductManagementUrls } from '@/core/api/urls/sub_product_managementUrls'

/** Flutter sub_product_management: WFC + domainId body.
 *  Live env: bko-subProduct/fetchAll empty 200; fetchByCriteria + {domainId:'BO'} works. */
const service = createCrudService({
  name: 'sub_product_management',
  base: 'wfc',
  fetchBody: { domainId: 'BO' },
  urls: {
    fetchAll: subProductManagementUrls.searchByCriteriaSubProduct || 'bko-subProduct/fetchByCriteria',
    create: subProductManagementUrls.saveSubProduct,
    update: subProductManagementUrls.saveSubProduct,
    delete: subProductManagementUrls.deleteSubProduct,
  },
  idKeys: ['id', 'subProductCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.subProductCode || ''),
    subProductCode: row.subProductCode || row.code || '',
    subProductName: row.subProductName || row.englishLabel || row.name || '',
    subProductNameAr: row.subProductNameAr || row.arabicLabel || '',
    productCode: row.productCode || row.parentCode || '',
    featureCode: row.featureCode || '',
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
