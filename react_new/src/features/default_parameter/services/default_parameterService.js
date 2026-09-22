import { createCrudService } from '@/features/common/crud/createCrudService'
import { apiRequest, API_SUCCESS_CODE } from '@/core/api/client'
import { defaultParameterUrls } from '@/core/api/urls/default_parameterUrls'

const service = createCrudService({
  name: 'default_parameter',
  urls: {
    fetchAll: defaultParameterUrls.fetchAll,
    create: defaultParameterUrls.action,
    update: defaultParameterUrls.action,
    delete: defaultParameterUrls.action,
  },
  idKeys: ['id', 'configKey', 'key'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.configKey || row.key || ''),
    configKey: row.configKey || row.key || row.paramCode || '',
    configValue: row.configValue ?? row.value ?? row.paramValue ?? '',
    domainCode: row.domainCode || row.domain || '',
    channel: row.channel || row.channelCode || 'ALL',
    description: row.description || '',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N', action: 'DELETE' }),
})

export async function fetchDomains() {
  const res = await apiRequest(defaultParameterUrls.fetchDomains, {
    base: 'bo',
    method: 'POST',
    body: {},
  })
  return res.data || { status: { code: API_SUCCESS_CODE }, data: [] }
}

export async function fetchOtpDefaults(domainCode) {
  const res = await apiRequest(defaultParameterUrls.fetchOtpConfigByDomain, {
    base: 'bo',
    method: 'POST',
    body: { domainCode },
  })
  return res.data || { status: { code: API_SUCCESS_CODE } }
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
