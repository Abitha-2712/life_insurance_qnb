/**
 * City CRUD — mirrors Flutter city_datasource.dart (dataurl + english/arabic labels).
 */
import {
  apiRequest,
  isApiSuccess,
  apiStatusDescription,
  API_SUCCESS_CODE,
  ApiError,
} from '@/core/api/client'
import { cityUrls } from '@/core/api/urls/cityUrls'

const seed = [
  { id: '1', cityId: 1, cityNameEnglish: 'Doha', cityNameArabic: 'الدوحة', status: 'Y' },
  { id: '2', cityId: 2, cityNameEnglish: 'Al Wakrah', cityNameArabic: 'الوكرة', status: 'Y' },
  { id: '3', cityId: 3, cityNameEnglish: 'Al Khor', cityNameArabic: 'الخور', status: 'N' },
]

let memory = seed.map((r) => ({ ...r }))

function mapRow(row = {}) {
  const cityId = row.cityId ?? row.id
  return {
    id: String(cityId ?? ''),
    cityId: cityId != null ? Number(cityId) : undefined,
    cityNameEnglish: row.englishLabel || row.cityNameEnglish || row.cityName || '',
    cityNameArabic: row.arabicLabel || row.cityNameArabic || '',
    status: row.status || 'Y',
    raw: row,
  }
}

function unwrapList(data) {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.data)) return data.data
  if (Array.isArray(data.content)) return data.content
  if (data.data?.content) return data.data.content
  if (Array.isArray(data.list)) return data.list
  return []
}

export async function fetchCities() {
  try {
    const res = await apiRequest(cityUrls.fetchAll, {
      base: 'data',
      method: 'POST',
      body: {},
    })
    if (!res.ok && !isApiSuccess(res.data)) {
      throw new ApiError(apiStatusDescription(res.data, 'Unable to load cities'), res)
    }
    const list = unwrapList(res.data).map(mapRow)
    if (list.length || isApiSuccess(res.data)) {
      memory = list
      return { status: { code: API_SUCCESS_CODE }, data: list }
    }
    throw new ApiError(apiStatusDescription(res.data, 'Unable to load cities'), res)
  } catch (err) {
    if (memory.length) {
      return { status: { code: API_SUCCESS_CODE }, data: memory.map((r) => ({ ...r })), offline: true }
    }
    throw err
  }
}

export async function saveCity(payload) {
  const isEdit = payload.cityId != null || (payload.id && payload.id !== '')
  const englishLabel = String(payload.cityNameEnglish || payload.englishLabel || '').trim()
  const arabicLabel = String(payload.cityNameArabic || payload.arabicLabel || '').trim()
  const status = payload.status || 'Y'
  const body = isEdit
    ? {
        cityId: Number(payload.cityId ?? payload.id),
        englishLabel,
        arabicLabel,
        status,
      }
    : { englishLabel, arabicLabel, status }

  try {
    const res = await apiRequest(isEdit ? cityUrls.update : cityUrls.save, {
      base: 'data',
      method: 'POST',
      body,
    })
    if (!res.ok && !isApiSuccess(res.data)) {
      throw new ApiError(apiStatusDescription(res.data, 'Save failed'), res)
    }
    return { status: { code: API_SUCCESS_CODE }, raw: res.data }
  } catch (err) {
    // offline soft-save
    if (isEdit) {
      memory = memory.map((r) =>
        String(r.cityId) === String(payload.cityId ?? payload.id)
          ? mapRow({ ...r, englishLabel, arabicLabel, status, cityId: r.cityId })
          : r,
      )
    } else {
      const cityId = Date.now()
      memory = [...memory, mapRow({ cityId, englishLabel, arabicLabel, status })]
    }
    return { status: { code: API_SUCCESS_CODE }, offline: true }
  }
}

export async function deleteCity(cityId) {
  const id = Number(cityId)
  try {
    const res = await apiRequest(cityUrls.delete, {
      base: 'data',
      method: 'POST',
      body: { cityId: id },
    })
    if (!res.ok && !isApiSuccess(res.data)) {
      throw new ApiError(apiStatusDescription(res.data, 'Delete failed'), res)
    }
    return { status: { code: API_SUCCESS_CODE }, raw: res.data }
  } catch (err) {
    memory = memory.filter((r) => Number(r.cityId) !== id)
    return { status: { code: API_SUCCESS_CODE }, offline: true }
  }
}

/** Exposed for tests / URL shape checks */
export const cityServiceMeta = {
  urls: cityUrls,
  base: 'data',
}

export default { fetchCities, saveCity, deleteCity, cityServiceMeta }
