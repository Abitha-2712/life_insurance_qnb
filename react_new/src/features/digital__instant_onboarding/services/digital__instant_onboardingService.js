import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'digital__instant_onboarding',
  base: 'data',
  urls: {
    fetchAll: 'customerOnboarding/getAll',
    create: 'onboarding/save',
    update: 'onboarding/save',
    delete: 'onboarding/delete',
  },
  idKeys: ["id","stepCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.stepCode || row.code || ''),
    stepCode: row.stepCode || row.code || '',
    stepName: row.stepName || row.englishLabel || row.name || '',
    stepNameAr: row.stepNameAr || row.arabicLabel || '',
    sequence: String(row.sequence ?? row.seq ?? ''),
    channel: row.channel || row.channelCode || 'MB',
    mandatory: row.mandatory || row.required || 'Y',
    estimatedMinutes: String(row.estimatedMinutes ?? row.etaMinutes ?? ''),
    description: row.description || '',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
