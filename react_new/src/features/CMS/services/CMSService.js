import { apiRequest } from '@/core/api/client'
import { i18MaintenanceUrls } from '@/core/api/urls/i18_maintenanceUrls'
import { createCrudService } from '@/features/common/crud/createCrudService'

function langFromValues(labelValue, code) {
  if (!Array.isArray(labelValue)) return ''
  const hit = labelValue.find(
    (v) => String(v?.langCode || '').toLowerCase() === String(code).toLowerCase(),
  )
  return hit?.langValue != null ? String(hit.langValue) : ''
}

export function mapI18Row(row) {
  const labelValue = row.labelValue || row.langs || []
  const englishLabel =
    row.englishLabel || row.en || langFromValues(labelValue, 'en') || ''
  const arabicLabel =
    row.arabicLabel || row.ar || langFromValues(labelValue, 'ar') || ''
  return {
    ...row,
    id: String(row.id || row.labelKey || row.key || ''),
    labelKey: row.labelKey || row.key || '',
    englishLabel,
    arabicLabel,
    unitId: String(row.unitId || ''),
    channelId: String(row.channelId || row.channel || ''),
    channel: String(row.channelId || row.channel || ''),
    screenId: String(row.screenId || row.screenCode || ''),
    screenCode: String(row.screenId || row.screenCode || ''),
    moduleCode: row.moduleCode || row.menuId || '',
    domainId: row.domainId || 'BO',
    description: row.description || '',
    status: row.status || 'Y',
    labelValue: Array.isArray(labelValue)
      ? labelValue
      : [
          { langCode: 'en', langValue: englishLabel },
          { langCode: 'ar', langValue: arabicLabel },
        ],
  }
}

function buildModifyRow(form, action) {
  return {
    action,
    labelKey: form.labelKey || '',
    unitId: form.unitId || '',
    channelId: form.channelId || form.channel || '',
    screenId: form.screenId || form.screenCode || '',
    domainId: form.domainId || 'BO',
    status: form.status || 'Y',
    description: form.description || '',
    labelValue: [
      { langCode: 'en', langValue: form.englishLabel || '' },
      { langCode: 'ar', langValue: form.arabicLabel || '' },
    ],
  }
}

const service = createCrudService({
  name: 'CMS',
  base: 'data',
  urls: {
    fetchAll: i18MaintenanceUrls.labels,
    create: i18MaintenanceUrls.modify,
    update: i18MaintenanceUrls.modify,
    delete: i18MaintenanceUrls.modify,
  },
  // Empty defaults — real fetch uses fetchLabels with filters
  fetchBody: () => ({
    unitId: '',
    channelId: '',
    screenId: '',
    domainId: 'BO',
  }),
  idKeys: ['id', 'labelKey', 'key'],
  mapRow: mapI18Row,
  buildCreateBody: (form) => ({
    processName: 'I18N',
    action: 'ADD',
    requestData: [buildModifyRow(form, 'ADD')],
  }),
  buildUpdateBody: (form) => ({
    processName: 'I18N',
    action: 'UPDATE',
    requestData: [buildModifyRow(form, 'UPDATE')],
  }),
  buildDeleteBody: (id, row) => ({
    processName: 'I18N',
    action: 'DELETE',
    requestData: [buildModifyRow({ ...(row || {}), id }, 'DELETE')],
  }),
})

/** Flutter getLabels — txn/labels with unit/channel/screen/domain */
export async function fetchLabels({
  unitId = '',
  channelId = '',
  screenId = '',
  domainId = 'BO',
} = {}) {
  const res = await apiRequest(i18MaintenanceUrls.labels, {
    base: 'data',
    method: 'POST',
    body: {
      unitId,
      channelId,
      screenId,
      domainId: domainId || 'BO',
    },
  })
  const root = res?.data?.data ?? res?.data ?? {}
  const list = Array.isArray(root?.i18)
    ? root.i18
    : Array.isArray(root)
      ? root
      : Array.isArray(root?.content)
        ? root.content
        : []
  return list.map(mapI18Row)
}

export async function fetchUnits() {
  const res = await apiRequest(i18MaintenanceUrls.country, {
    base: 'data',
    method: 'GET',
  })
  const raw = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data?.units)
        ? res.data.units
        : []
  return raw
    .map((u) => ({
      value: String(u.unitCode || u.unitId || u.id || ''),
      label: String(u.unitDesc || u.unitName || u.name || u.unitCode || ''),
    }))
    .filter((o) => o.value)
}

export async function fetchChannels() {
  const res = await apiRequest(i18MaintenanceUrls.channel, {
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
  return raw
    .map((c) => ({
      value: String(c.channelId || c.id || c.code || ''),
      label: String(c.channelDesc || c.channelName || c.name || c.channelId || ''),
    }))
    .filter((o) => o.value)
}

export async function fetchModules() {
  const res = await apiRequest(i18MaintenanceUrls.modules, {
    base: 'data',
    method: 'POST',
    body: {},
  })
  const raw = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data?.menus)
        ? res.data.menus
        : []
  return raw
    .map((m) => ({
      value: String(m.menuId || m.moduleCode || m.id || m.code || ''),
      label: String(m.menuName || m.moduleName || m.name || m.menuId || ''),
    }))
    .filter((o) => o.value)
}

export async function fetchScreens(moduleCode = '') {
  const res = await apiRequest(i18MaintenanceUrls.screens, {
    base: 'data',
    method: 'POST',
    body: { menuId: moduleCode },
  })
  const raw = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
      ? res.data.data
      : Array.isArray(res?.data?.menus)
        ? res.data.menus
        : []
  return raw
    .map((s) => ({
      value: String(s.screenId || s.subMenuId || s.id || s.code || ''),
      label: String(s.screenName || s.subMenuName || s.name || s.screenId || ''),
    }))
    .filter((o) => o.value)
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
