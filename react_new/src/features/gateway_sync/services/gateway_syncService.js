import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'gateway_sync',
  base: 'data',
  urls: {
    fetchAll: 'gateway-sync/getAll',
    create: 'gateway-sync/create',
    update: 'gateway-sync/create',
    delete: 'gateway-sync/delete',
  },
  idKeys: ["id","gatewayCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.gatewayCode || row.code || ''),
    gatewayCode: row.gatewayCode || row.code || '',
    gatewayName: row.gatewayName || row.name || row.englishLabel || '',
    gatewayNameAr: row.gatewayNameAr || row.arabicLabel || '',
    endpointUrl: row.endpointUrl || row.url || row.endpoint || '',
    protocol: row.protocol || row.type || 'REST',
    environment: row.environment || row.env || 'PROD',
    syncInterval: String(row.syncInterval ?? row.interval ?? ''),
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
