import { createCrudService } from '@/features/common/crud/createCrudService'

/** Flutter DirectRemittanceUrl.beneficiaryAccountType — beneficiaryAccountType/getAll */
const service = createCrudService({
  name: 'direct_remittance',
  base: 'data',
  urls: {
    fetchAll: 'beneficiaryAccountType/getAll',
    create: 'beneficiaryAccountType/create',
    update: 'beneficiaryAccountType/update',
    delete: 'beneficiaryAccountType/delete',
  },
  idKeys: ['txnId', 'beneficiaryAccountTypeCode', 'id'],
  mapRow: (row) => ({
    ...row,
    id: String(row.txnId || row.beneficiaryAccountTypeCode || row.id || ''),
    beneficiaryAccountTypeCode: row.beneficiaryAccountTypeCode || '',
    beneficiaryAccountTypeName: row.beneficiaryAccountTypeName || '',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
