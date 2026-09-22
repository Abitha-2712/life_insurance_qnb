import { createCrudService } from '@/features/common/crud/createCrudService'
import { accessManagementUrls } from '@/core/api/urls/access_managementUrls'

/** Flutter access_management: WFC + domainId body.
 *  Live env: bko-features/fetchAll returns empty 200; fetchByCriteria + {domainId:'BO'} → 000000. */
const service = createCrudService({
  base: 'wfc',
  name: 'feature_management',
  fetchBody: { domainId: 'BO' },
  urls: {
    fetchAll: accessManagementUrls.searchByCriteriaAccess || 'bko-features/fetchByCriteria',
    create: accessManagementUrls.saveAccess,
    update: accessManagementUrls.saveAccess,
    delete: accessManagementUrls.deleteAccess,
  },
  idKeys: ['id', 'featureCode', 'code', 'functionCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.featureCode || row.functionCode || row.code || ''),
    featureCode: row.featureCode || row.functionCode || row.code || '',
    featureName: row.featureName || row.functionDesc || row.englishLabel || row.name || '',
    featureNameAr: row.featureNameAr || row.arabicLabel || '',
    productCode: row.productCode || row.product || '',
    domainCode: row.domainCode || row.domainId || row.domain || '',
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
