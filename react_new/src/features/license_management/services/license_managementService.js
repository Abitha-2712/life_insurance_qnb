import { createCrudService } from '@/features/common/crud/createCrudService'
import { licenseManagementUrls } from '@/core/api/urls/license_managementUrls'

const service = createCrudService({
  base: 'wfc',
  name: 'license_management',
  urls: {
    fetchAll: licenseManagementUrls.fetchAllLicense,
    create: licenseManagementUrls.postLicense,
    update: licenseManagementUrls.postLicense,
    delete: licenseManagementUrls.postLicense,
  },
  idKeys: ["id","licenseKey","licenseId"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.licenseKey || row.licenseId || ''),
    licenseKey: row.licenseKey || row.key || '',
    licenseName: row.licenseName || row.name || '',
    issuedTo: row.issuedTo || row.organization || '',
    issueDate: row.issueDate || row.issuedOn || '',
    expiryDate: row.expiryDate || row.expiresOn || '',
    maxUsers: String(row.maxUsers ?? row.userLimit ?? ''),
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
