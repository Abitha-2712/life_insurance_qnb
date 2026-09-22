import { createCrudService } from '@/features/common/crud/createCrudService'
import { apiRequest, API_SUCCESS_CODE } from '@/core/api/client'
import { otpControlUrls } from '@/core/api/urls/otp_controlUrls'

const service = createCrudService({
  name: 'sms_configuration',
  urls: {
    fetchAll: otpControlUrls.fetchAllOtpControl,
    create: otpControlUrls.createOtpControl,
    update: otpControlUrls.updateOtpControl,
    delete: otpControlUrls.deleteOtpControl,
  },
  idKeys: ['id', 'configName', 'code'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.configName || row.code || ''),
    configName: row.configName || row.name || row.englishLabel || '',
    configNameAr: row.configNameAr || row.arabicLabel || '',
    domainCode: row.domainCode || row.domain || '',
    channel: row.channel || row.channelCode || 'ALL',
    otpLength: String(row.otpLength ?? row.length ?? '6'),
    expirySeconds: String(row.expirySeconds ?? row.expiry ?? ''),
    maxRetry: String(row.maxRetry ?? row.retryCount ?? ''),
    templateCode: row.templateCode || row.template || '',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export async function fetchTemplates() {
  const res = await apiRequest(otpControlUrls.getTemplate, {
    base: 'data',
    method: 'POST',
    body: {},
  })
  return res.data || { status: { code: API_SUCCESS_CODE }, data: [] }
}

export async function fetchPageDropdown() {
  const res = await apiRequest(otpControlUrls.otpconfigura, {
    base: 'data',
    method: 'POST',
    body: {},
  })
  return res.data || { status: { code: API_SUCCESS_CODE }, data: [] }
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
