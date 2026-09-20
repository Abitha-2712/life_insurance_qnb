import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'dynamic_screen',
  base: 'data',
  urls: {
    fetchAll: 'dynamic-screen/getAll',
    create: 'dynamic-screen/save',
    update: 'dynamic-screen/save',
    delete: 'dynamic-screen/delete',
  },
  idKeys: ["id","screenCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.screenCode || row.code || ''),
    screenCode: row.screenCode || row.code || '',
    screenName: row.screenName || row.englishLabel || row.name || '',
    screenNameAr: row.screenNameAr || row.arabicLabel || '',
    screenType: row.screenType || row.type || 'DYNAMIC',
    channel: row.channel || row.channelCode || 'ALL',
    layoutJson: row.layoutJson || row.layout || row.config || '',
    version: String(row.version ?? ''),
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
