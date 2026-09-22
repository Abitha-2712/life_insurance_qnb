/**
 * Factory for CRUD services that call real BO endpoints.
 * Never falls back to seed/mock data — API failures surface to the UI.
 */
import {
  apiRequest,
  isApiSuccess,
  apiStatusDescription,
  API_SUCCESS_CODE,
  ApiError,
} from '@/core/api/client'

function unwrapList(data) {
  if (!data) return []
  if (Array.isArray(data)) return data
  // SoftFetch payload is often { status, data }
  const root = data && typeof data === 'object' && 'data' in data ? data.data : data
  if (Array.isArray(root)) return root
  if (!root || typeof root !== 'object') return []

  const preferred = [
    'content', 'result', 'list', 'items', 'records', 'rows',
    'customers', 'eipoList', 'programs', 'details', 'recodrs', 'recordsList',
  ]
  for (const k of preferred) {
    if (Array.isArray(root[k])) return root[k]
  }
  for (const k of preferred) {
    if (Array.isArray(data[k])) return data[k]
  }
  // First array-of-objects value (skip primitives)
  for (const v of Object.values(root)) {
    if (Array.isArray(v) && v.length && typeof v[0] === 'object') return v
  }
  for (const v of Object.values(data)) {
    if (Array.isArray(v) && v.length && typeof v[0] === 'object') return v
  }
  if (Array.isArray(root.content)) return root.content
  if (Array.isArray(root.list)) return root.list
  return []
}

function normalizeRow(row, idKeys = ['id', 'code', 'Id']) {
  if (!row || typeof row !== 'object') return row
  const out = { ...row }
  if (!out.id) {
    for (const k of idKeys) {
      if (row[k] != null && String(row[k]).trim()) {
        out.id = String(row[k])
        break
      }
    }
  }
  if (!out.id) out.id = String(JSON.stringify(row).slice(0, 40))
  return out
}

/**
 * @param {{
 *   name: string,
 *   urls: { fetchAll?: string, create?: string, update?: string, delete?: string, save?: string },
 *   base?: 'bo'|'data'|'wfc',
 *   methodFetch?: string,
 *   fetchBody?: object|(()=>object),
 *   mapRow?: (row:any)=>any,
 *   buildCreateBody?: (form:any)=>any,
 *   buildUpdateBody?: (form:any)=>any,
 *   buildDeleteBody?: (id:any,row?:any)=>any,
 *   idKeys?: string[],
 * }} config
 */
export function createCrudService(config) {
  const {
    name,
    urls = {},
    base = 'bo',
    methodFetch = 'POST',
    fetchBody = {},
    mapRow,
    buildCreateBody,
    buildUpdateBody,
    buildDeleteBody,
    idKeys = ['id', 'code', 'Id', `${name}Id`, `${name}Code`],
  } = config

  /** Share one in-flight list request (React StrictMode double-mount, etc.). */
  let fetchAllInflight = null

  async function fetchAll() {
    if (!urls.fetchAll) {
      throw new ApiError(`${name}: fetchAll URL is not configured`)
    }
    if (fetchAllInflight) return fetchAllInflight

    fetchAllInflight = (async () => {
      try {
        const body =
          typeof fetchBody === 'function' ? fetchBody() : { ...(fetchBody || {}) }
        const res = await apiRequest(urls.fetchAll, {
          base,
          method: methodFetch,
          body: methodFetch === 'GET' ? undefined : body,
        })
        if (!res.ok) {
          throw new ApiError(
            apiStatusDescription(res.data, `Fetch failed (${res.status})`),
            res,
          )
        }
        if (!isApiSuccess(res.data) && res.status >= 400) {
          throw new ApiError(apiStatusDescription(res.data, 'Fetch failed'), res)
        }
        const list = unwrapList(res.data).map((row) => {
          const n = normalizeRow(row, idKeys)
          return mapRow ? mapRow(n) : n
        })
        return {
          status: { code: API_SUCCESS_CODE },
          data: list,
          raw: res.data,
        }
      } finally {
        fetchAllInflight = null
      }
    })()

    return fetchAllInflight
  }

  async function save(payload) {
    const isEdit = Boolean(payload?.id)
    const path = isEdit
      ? urls.update || urls.save || urls.create
      : urls.create || urls.save || urls.update
    if (!path) {
      throw new ApiError(`${name}: save URL is not configured`)
    }
    const body = isEdit
      ? (buildUpdateBody ? buildUpdateBody(payload) : payload)
      : (buildCreateBody ? buildCreateBody(payload) : payload)

    const res = await apiRequest(path, { base, method: 'POST', body })
    if (!res.ok || !isApiSuccess(res.data)) {
      throw new ApiError(apiStatusDescription(res.data, `Save failed (${res.status})`), res)
    }
    return { status: { code: API_SUCCESS_CODE }, raw: res.data }
  }

  async function remove(id, row) {
    if (!urls.delete) {
      throw new ApiError(`${name}: delete URL is not configured`)
    }
    const body = buildDeleteBody ? buildDeleteBody(id, row) : { id }
    const res = await apiRequest(urls.delete, { base, method: 'POST', body })
    if (!res.ok || !isApiSuccess(res.data)) {
      throw new ApiError(apiStatusDescription(res.data, `Delete failed (${res.status})`), res)
    }
    return { status: { code: API_SUCCESS_CODE }, raw: res.data }
  }

  return {
    fetchAll,
    save,
    remove,
    name,
    urls,
    mapRow,
    buildCreateBody,
    buildUpdateBody,
    buildDeleteBody,
  }
}

export default createCrudService