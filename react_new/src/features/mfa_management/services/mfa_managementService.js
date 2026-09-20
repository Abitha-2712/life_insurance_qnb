import { createCrudService } from '@/features/common/crud/createCrudService'
import { mfaManagementUrls } from '@/core/api/urls/mfa_managementUrls'

const service = createCrudService({
  name: 'mfa_management',
  base: 'data',
  urls: {
    fetchAll: mfaManagementUrls.mfagetall,
    create: mfaManagementUrls.mfasave,
    update: mfaManagementUrls.mfaupdate,
    delete: mfaManagementUrls.mfadelete,
  },
  idKeys: ["id","mfaCode","mfaId"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.mfaCode || row.mfaId || ''),
    mfaCode: row.mfaCode || row.code || '',
    mfaName: row.mfaName || row.name || row.englishLabel || '',
    mfaNameAr: row.mfaNameAr || row.arabicLabel || '',
    mfaType: row.mfaType || row.type || 'otp',
    channel: row.channel || row.channelCode || 'ALL',
    priority: String(row.priority ?? ''),
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
