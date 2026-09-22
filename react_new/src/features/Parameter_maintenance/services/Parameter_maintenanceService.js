import { createCrudService } from '@/features/common/crud/createCrudService'
import { parameterUrls } from '@/core/api/urls/parameterUrls'

const service = createCrudService({
  name: 'Parameter_maintenance',
  urls: {
    fetchAll: parameterUrls.fetchAllparameter,
    create: parameterUrls.parametermanager,
    update: parameterUrls.parametermanager,
    delete: parameterUrls.parametermanager,
  },
  idKeys: ["id","parameterCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.parameterCode || row.code || ''),
    parameterCode: row.parameterCode || row.code || row.paramCode || '',
    parameterValue: row.parameterValue ?? row.value ?? row.paramValue ?? '',
    parameterName: row.parameterName || row.englishLabel || row.name || '',
    parameterNameAr: row.parameterNameAr || row.arabicLabel || '',
    module: row.module || row.moduleCode || '',
    dataType: row.dataType || row.type || 'STRING',
    channel: row.channel || row.channelCode || 'ALL',
    description: row.description || '',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N', action: 'DELETE' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
