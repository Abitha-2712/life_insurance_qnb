import { createCrudService } from '@/features/common/crud/createCrudService'
import { bankManagementUrls } from '@/core/api/urls/bank_managementUrls'

const service = createCrudService({
  name: 'bank_management',
  base: 'data',
  urls: {
    fetchAll: bankManagementUrls.getAllBanks,
    create: bankManagementUrls.createBank,
    update: bankManagementUrls.updateBank,
    delete: bankManagementUrls.deleteBank,
  },
  idKeys: ['id', 'bankCode', 'bankId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.bankCode || row.bankId || ''),
    bankCode: row.bankCode || '',
    bankName: row.bankName || row.englishLabel || '',
    bankNameAr: row.bankNameAr || row.arabicLabel || '',
    swiftCode: row.swiftCode || row.swift || '',
    countryCode: row.countryCode || row.country || '',
    city: row.city || '',
    address: row.address || '',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
