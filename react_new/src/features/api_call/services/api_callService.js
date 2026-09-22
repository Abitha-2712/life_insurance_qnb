import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'api_call',
  base: 'data',
  urls: {
    fetchAll: 'api-call/getAll',
    create: 'api-call/save',
    update: 'api-call/save',
    delete: 'api-call/delete',
  },
  idKeys: ["id","apiCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.apiCode || row.code || ''),
    apiCode: row.apiCode || row.code || '',
    apiName: row.apiName || row.name || row.englishLabel || '',
    httpMethod: row.httpMethod || row.method || 'POST',
    endpoint: row.endpoint || row.path || row.url || '',
    serviceId: row.serviceId || row.service || '',
    requestSample: row.requestSample || row.requestBody || '',
    responseSample: row.responseSample || row.responseBody || '',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
