import { apiRequest } from '@/core/api/client'
import { bannerConfigurationUrls } from '@/core/api/urls/banner_configurationUrls'
import { createCrudService } from '@/features/common/crud/createCrudService'

/** Flutter select-banner + workflow manage (BANNER). */
export const BANNER_SUMMARY = 'commonservice/public/select-banner'
export const BANNER_MANAGE = 'banner/manage'

function mapBannerRow(row) {
  const bannerId = row.bannerId || row.id || ''
  return {
    ...row,
    id: String(row.id || bannerId || row.uniqueKey || ''),
    bannerId: String(bannerId),
    domainId: String(row.domainId ?? ''),
    domainIdDisplay: String(row.domainIdDisplay || row.domainId || row.domain || ''),
    channel: row.channel || row.channelName || '',
    channelId: String(row.channelId ?? ''),
    channelIds: Array.isArray(row.channelIds) ? row.channelIds : [],
    unitId: String(row.unitId ?? row.countryId ?? ''),
    screenId: String(row.screenId ?? ''),
    segmentType: row.segmentType || row.segment || '',
    bannerUrl: row.bannerUrl || row.bannerUrlEn || '',
    bannerUrlAr: row.bannerUrlAr || '',
    redirectionUrl: row.redirectionUrl || row.redirectionUrlEn || '',
    redirectionUrlAr: row.redirectionUrlAr || '',
    dispPriority: String(row.dispPriority ?? row.displayPriority ?? ''),
    bannerImageEnglish: row.bannerImageEnglish || row.imageEn || '',
    bannerImageArabic: row.bannerImageArabic || row.imageAr || '',
    startDate: row.startDate || '',
    endDate: row.endDate || '',
    allCustomer: row.allCustomer === true || String(row.allCustomer).toLowerCase() === 'true',
    status: row.status || 'Y',
    langCode: row.langCode || row.language || '',
    description: row.description || row.bannerName || '',
    bannerName: row.bannerName || row.description || bannerId,
  }
}

const service = createCrudService({
  name: 'banner_configuration',
  base: 'data',
  urls: {
    fetchAll: BANNER_SUMMARY,
    create: BANNER_MANAGE,
    update: BANNER_MANAGE,
    delete: BANNER_MANAGE,
  },
  // Flutter initial fetch: empty unit/channel/domain returns all (or empty)
  fetchBody: () => ({
    unit: '',
    channelIds: [],
    domainId: '',
  }),
  idKeys: ['id', 'bannerId', 'uniqueKey'],
  mapRow: mapBannerRow,
  buildCreateBody: (form) => ({
    action: 'ADD',
    processName: 'BANNER',
    requestData: [normalizeManagePayload(form, 'ADD')],
  }),
  buildUpdateBody: (form) => ({
    action: 'UPDATE',
    processName: 'BANNER',
    requestData: [normalizeManagePayload(form, 'UPDATE')],
  }),
  buildDeleteBody: (id, row) => ({
    action: 'DELETE',
    processName: 'BANNER',
    requestData: [{ ...(row || {}), id, bannerId: row?.bannerId || id }],
  }),
})

function normalizeManagePayload(form, action) {
  return {
    action,
    bannerId: form.bannerId || '',
    bannerUrl: form.bannerUrl || '',
    bannerUrlAr: form.bannerUrlAr || '',
    redirectionUrl: form.redirectionUrl || '',
    redirectionUrlAr: form.redirectionUrlAr || '',
    dispPriority: Number(form.dispPriority) || 0,
    status: form.status || 'Y',
    unitId: form.unitId || '',
    screenId: form.screenId || '',
    domainId: form.domainId || '',
    channelId: form.channelId || '',
    channelIds: form.channelIds || (form.channelId ? [form.channelId] : []),
    segmentType: form.segmentType || '',
    bannerImageEnglish: form.bannerImageEnglish || '',
    bannerImageArabic: form.bannerImageArabic || '',
    startDate: form.startDate || '',
    endDate: form.endDate || '',
    allCustomer: Boolean(form.allCustomer),
    langCode: form.langCode || form.language || '',
    description: form.bannerName || form.description || '',
  }
}

/** Filtered summary — Flutter getBannerSummary filters. */
export async function fetchBannerSummary({
  unit = '',
  channelIds = [],
  domainId = '',
  disPriority = '',
} = {}) {
  const body = {
    unit,
    channelIds: Array.isArray(channelIds) ? channelIds : [],
    domainId,
  }
  const normalized = String(disPriority || '').trim()
  if (normalized && normalized.toUpperCase() !== 'ALL') {
    const n = Number(normalized)
    if (!Number.isNaN(n)) body.disPriority = n
  }
  const res = await apiRequest(BANNER_SUMMARY, {
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
  return list.map(mapBannerRow)
}

export async function fetchLanguageSummary() {
  const res = await apiRequest(bannerConfigurationUrls.languageSummary, {
    base: 'data',
    method: 'GET',
  })
  return res.data
}

export async function fetchScreenIds(unit = '', channel = '') {
  const res = await apiRequest(bannerConfigurationUrls.screenid, {
    base: 'data',
    method: 'POST',
    body: { unit, channel },
  })
  return res.data
}

export async function fetchUnits() {
  const res = await apiRequest(bannerConfigurationUrls.country, {
    base: 'data',
    method: 'GET',
  })
  return res.data
}

export async function fetchChannels() {
  const res = await apiRequest('channel/list', {
    base: 'data',
    method: 'GET',
  })
  return res.data
}

export async function fetchDomains() {
  const res = await apiRequest(bannerConfigurationUrls.groupName, {
    base: 'data',
    method: 'POST',
    body: {},
  })
  return res.data
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service, mapBannerRow }
export default service

