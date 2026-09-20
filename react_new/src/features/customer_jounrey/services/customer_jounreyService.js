import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'customer_jounrey',
  urls: {
    fetchAll: 'customer-journey/getAll',
    create: 'customer-journey/save',
    update: 'customer-journey/save',
    delete: 'customer-journey/delete',
  },
  idKeys: ["id","journeyCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.journeyCode || row.code || ''),
    journeyCode: row.journeyCode || row.code || '',
    journeyName: row.journeyName || row.englishLabel || row.name || '',
    journeyNameAr: row.journeyNameAr || row.arabicLabel || '',
    channel: row.channel || row.channelCode || 'ALL',
    segmentCode: row.segmentCode || row.segment || '',
    stepCount: String(row.stepCount ?? row.steps ?? ''),
    sequence: String(row.sequence ?? row.seq ?? ''),
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
