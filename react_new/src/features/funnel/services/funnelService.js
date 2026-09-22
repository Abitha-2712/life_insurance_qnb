import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'funnel',
  urls: {
    fetchAll: 'funnel/getAll',
    create: 'funnel/save',
    update: 'funnel/save',
    delete: 'funnel/delete',
  },
  idKeys: ["id","funnelCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.funnelCode || row.code || ''),
    funnelCode: row.funnelCode || row.code || '',
    funnelName: row.funnelName || row.englishLabel || row.name || '',
    funnelNameAr: row.funnelNameAr || row.arabicLabel || '',
    channel: row.channel || row.channelCode || 'ALL',
    productCode: row.productCode || row.product || '',
    stages: row.stages || row.stageList || '',
    conversionTarget: String(row.conversionTarget ?? row.target ?? ''),
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
