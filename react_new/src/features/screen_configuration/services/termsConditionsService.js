import { apiRequest } from '@/core/api/client'
import { tncUrls } from '@/core/api/urls/tncUrls'
import { createCrudService } from '@/features/common/crud/createCrudService'

function mapTncRow(row) {
  let channelId = row.channelId || ''
  if ((!channelId || !String(channelId).trim()) && Array.isArray(row.channelIds)) {
    channelId = row.channelIds.map((e) => String(e || '').trim()).filter(Boolean).join(',')
  }
  const descriptionAr = row.descriptionAr || row.remarks || ''
  return {
    ...row,
    id: String(row.txnId ?? row.id ?? row.uniqueKey ?? row.tcUrlId ?? ''),
    txnId: row.txnId,
    unitId: String(row.unitId ?? ''),
    channelId: String(channelId),
    moduleId: String(row.moduleId ?? ''),
    subModuleId: String(row.subModuleId ?? ''),
    screenId: String(row.screenId ?? ''),
    tcUrlId: String(row.tcUrlId ?? ''),
    tcUrlEn: row.tcUrlEn || '',
    tcUrlAr: row.tcUrlAr || '',
    tcUrlFr: row.tcUrlFr || '',
    description: row.description || '',
    remarks: descriptionAr,
    status: row.status || 'Y',
  }
}

function buildManageRow(form, action) {
  const channelIds = String(form.channelId || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return {
    action,
    txnId: form.txnId,
    unitId: form.unitId || '',
    channelId: form.channelId || '',
    channelIds,
    moduleId: form.moduleId || '',
    subModuleId: form.subModuleId || '',
    screenId: form.screenId || '',
    tcUrlId: form.tcUrlId || '',
    tcUrlEn: form.tcUrlEn || '',
    tcUrlAr: form.tcUrlAr || '',
    tcUrlFr: form.tcUrlFr || '',
    description: form.description || '',
    descriptionAr: form.remarks || form.descriptionAr || '',
    remarks: form.remarks || '',
    status: form.status || 'Y',
  }
}

const service = createCrudService({
  name: 'terms_conditions',
  base: 'data',
  urls: {
    fetchAll: tncUrls.summaryTnc,
    create: tncUrls.manageTnc,
    update: tncUrls.manageTnc,
    delete: tncUrls.manageTnc,
  },
  fetchBody: () => ({ unitId: '', channelId: '' }),
  idKeys: ['txnId', 'id', 'tcUrlId', 'uniqueKey'],
  mapRow: mapTncRow,
  buildCreateBody: (form) => ({
    processName: 'TC',
    action: 'ADD',
    requestData: [buildManageRow(form, 'ADD')],
  }),
  buildUpdateBody: (form) => ({
    processName: 'TC',
    action: 'UPDATE',
    requestData: [buildManageRow(form, 'UPDATE')],
  }),
  buildDeleteBody: (id, row) => ({
    processName: 'TC',
    action: 'DELETE',
    requestData: [buildManageRow({ ...(row || {}), id }, 'DELETE')],
  }),
})

/** Filtered summary — Flutter getTncSummary({ unitId, channelId }) */
export async function fetchTncSummary({ unitId = '', channelId = '' } = {}) {
  const res = await apiRequest(tncUrls.summaryTnc, {
    base: 'data',
    method: 'POST',
    body: { unitId, channelId },
  })
  const list = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
      ? res.data.data
      : []
  return list.map(mapTncRow)
}

export async function fetchUnits() {
  const res = await apiRequest('units/all', { base: 'data', method: 'GET' })
  const raw = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data?.units)
        ? res.data.units
        : []
  return raw.map((u) => ({
    value: String(u.unitCode || u.unitId || u.id || ''),
    label: String(u.unitDesc || u.unitName || u.name || u.unitCode || ''),
  })).filter((o) => o.value)
}

export async function fetchChannels() {
  const res = await apiRequest('channel/list', { base: 'data', method: 'GET' })
  const raw = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data?.channels)
        ? res.data.channels
        : []
  return raw.map((c) => ({
    value: String(c.channelId || c.id || c.code || ''),
    label: String(c.channelDesc || c.channelName || c.name || c.channelId || ''),
  })).filter((o) => o.value)
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service, mapTncRow }
export default service
