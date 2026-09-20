import { createCrudService } from '@/features/common/crud/createCrudService'
import { configurationParaUrls } from '@/core/api/urls/configuration_paraUrls'

/** Flutter configuration_para_url — formconfig/* on dataurl. */
const service = createCrudService({
  name: 'configuration_parameters',
  base: 'data',
  urls: {
    fetchAll: configurationParaUrls.getall,
    create: configurationParaUrls.save,
    update: configurationParaUrls.update,
    delete: configurationParaUrls.delete,
  },
  idKeys: ['id', 'paramCode', 'code'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.paramCode || row.code || ''),
    paramCode: row.paramCode || row.code || row.configKey || '',
    paramValue: row.paramValue ?? row.value ?? row.configValue ?? '',
    paramName: row.paramName || row.englishLabel || row.name || '',
    paramNameAr: row.paramNameAr || row.arabicLabel || '',
    module: row.module || row.moduleCode || '',
    dataType: row.dataType || row.type || 'STRING',
    channel: row.channel || row.channelCode || 'ALL',
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
