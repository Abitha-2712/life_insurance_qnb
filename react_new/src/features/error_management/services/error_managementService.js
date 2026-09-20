import { apiRequest } from '@/core/api/client'
import { createCrudService } from '@/features/common/crud/createCrudService'

function mapErrorRow(row) {
  const txnId = row.txnId ?? row.id
  const mwErrCode = row.mwErrCode || row.errorCode || ''
  const ocsErrCode = row.ocsErrCode || ''
  const channelId = Array.isArray(row.channelIds)
    ? row.channelIds.join(',')
    : row.channelId || ''
  return {
    ...row,
    id: String(txnId ?? mwErrCode),
    txnId: txnId != null ? Number(txnId) || txnId : undefined,
    mwErrCode,
    ocsErrCode,
    errorCode: mwErrCode,
    title: row.title || '',
    provider: row.provider || '',
    channelId,
    channel: channelId,
    lang: row.lang || 'en',
    language: String(row.lang || '').toLowerCase() === 'ar' ? 'Arabic' : 'English',
    errDesc: row.errDesc || row.errorMessage || row.englishLabel || row.englishDesc || '',
    mwErrDesc: row.mwErrDesc || row.mwErrorDescription || '',
    errorMessage: row.errDesc || row.errorMessage || row.englishLabel || '',
    errorMessageAr: row.arabicDesc || row.errorMessageAr || row.arabicLabel || '',
    serviceType: row.serviceType || row.errorType || '',
    status: row.status || 'Y',
  }
}

function toChannelIds(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean)
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function buildPayload(form) {
  const lang =
    String(form.lang || form.language || 'en').toLowerCase().startsWith('ar')
      ? 'ar'
      : 'en'
  return {
    txnId: form.txnId,
    mwErrCode: form.mwErrCode || form.errorCode || '',
    ocsErrCode: form.ocsErrCode || '',
    serviceType: form.serviceType || '',
    status: form.status || 'Y',
    lang,
    errDesc: form.errDesc || form.errorMessage || '',
    mwErrDesc: form.mwErrDesc || '',
    title: form.title || '',
    provider: form.provider || '',
    channelIds: toChannelIds(form.channelId || form.channelIds || form.channel),
  }
}

const service = createCrudService({
  name: 'error_management',
  base: 'data',
  urls: {
    fetchAll: 'error-config/getAll',
    create: 'error-config/add',
    update: 'error-config/update',
    delete: 'error-config/delete',
  },
  idKeys: ['txnId', 'id', 'mwErrCode', 'errorCode'],
  mapRow: mapErrorRow,
  buildCreateBody: (form) => {
    const body = buildPayload(form)
    delete body.txnId
    return body
  },
  buildUpdateBody: (form) => buildPayload(form),
  buildDeleteBody: (id, row) => ({
    txnId: row?.txnId ?? Number(id) ?? id,
  }),
})

/** Flutter error-config/fetchByCriteria */
export async function searchErrors({ errorCode, errorType, lang } = {}) {
  const body = {}
  if (errorCode) {
    body.mwErrCode = errorCode
    body.ocsErrCode = errorCode
  }
  if (errorType) body.serviceType = errorType
  if (lang) body.lang = String(lang).toLowerCase().startsWith('ar') ? 'ar' : 'en'

  const res = await apiRequest('error-config/fetchByCriteria', {
    base: 'data',
    method: 'POST',
    body,
  })
  const list = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data?.content)
        ? res.data.content
        : []
  return list.map(mapErrorRow)
}

/** Flutter BoLookUp/list — error type values */
export async function fetchErrorTypes() {
  const res = await apiRequest('BoLookUp/list', {
    base: 'data',
    method: 'POST',
    body: {},
  })
  const raw = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
      ? res.data.data
      : []
  const field = raw.find((e) => {
    const name = String(e?.fieldName || e?.name || '').toLowerCase()
    return name === 'error type' || name === 'errortype' || name.includes('error type')
  })
  const values = field?.values || []
  return values.map((v) => ({
    value: String(v?.value ?? v?.code ?? v?.txnId ?? v?.typeId ?? ''),
    label: String(v?.label ?? v?.description ?? v?.name ?? v?.value ?? ''),
  })).filter((o) => o.value || o.label)
}

/** Flutter BoLookUp/list — provider values */
export async function fetchErrorProviders() {
  const res = await apiRequest('BoLookUp/list', {
    base: 'data',
    method: 'POST',
    body: {},
  })
  const raw = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
      ? res.data.data
      : []
  const field = raw.find((e) => {
    const name = String(e?.fieldName || e?.name || '').toLowerCase()
    return name === 'provider' || name.includes('provider')
  })
  const values = field?.values || []
  return values.map((v) => ({
    value: String(v?.value ?? v?.code ?? v?.txnId ?? ''),
    label: String(v?.label ?? v?.description ?? v?.name ?? v?.value ?? ''),
  })).filter((o) => o.value || o.label)
}

export async function fetchChannels() {
  const res = await apiRequest('channel/list', {
    base: 'data',
    method: 'GET',
  })
  const raw = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data?.channels)
        ? res.data.channels
        : []
  return raw.map((item) => ({
    value: String(item.channelId || item.id || item.code || ''),
    label: String(item.channelDesc || item.channelName || item.name || item.channelId || ''),
  })).filter((o) => o.value)
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service, mapErrorRow }
export default service
