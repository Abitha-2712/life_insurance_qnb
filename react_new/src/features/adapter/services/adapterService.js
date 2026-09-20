import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'adapter',
  base: 'data',
  urls: {
    fetchAll: 'adapter/getAll',
    create: 'adapter/save',
    update: 'adapter/save',
    delete: 'adapter/delete',
  },
  idKeys: ["id","adapterCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.adapterCode || row.code || ''),
    adapterCode: row.adapterCode || row.code || '',
    adapterName: row.adapterName || row.name || row.englishLabel || '',
    adapterType: row.adapterType || row.type || '',
    endpointUrl: row.endpointUrl || row.url || row.endpoint || '',
    protocol: row.protocol || 'HTTP',
    timeoutMs: String(row.timeoutMs ?? row.timeout ?? ''),
    description: row.description || row.desc || '',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
