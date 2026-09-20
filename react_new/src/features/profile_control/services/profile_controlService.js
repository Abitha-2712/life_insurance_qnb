import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'profile_control',
  urls: {
    fetchAll: 'profile-control/getAll',
    create: 'profile-control/save',
    update: 'profile-control/save',
    delete: 'profile-control/delete',
  },
  idKeys: ["id","profileCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.profileCode || row.code || ''),
    profileCode: row.profileCode || row.code || '',
    profileName: row.profileName || row.englishLabel || row.name || '',
    profileNameAr: row.profileNameAr || row.arabicLabel || '',
    segmentCode: row.segmentCode || row.segment || '',
    channel: row.channel || row.channelCode || 'ALL',
    maxDevices: String(row.maxDevices ?? row.deviceLimit ?? ''),
    allowBiometric: row.allowBiometric || row.biometric || 'Y',
    allowNickname: row.allowNickname || row.nickname || 'Y',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
