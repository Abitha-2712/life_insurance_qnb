import { createCrudService } from '@/features/common/crud/createCrudService'
import { partnerOnboardingUrls } from '@/core/api/urls/partner_onboardingUrls'
import {
  apiRequest,
  isApiSuccess,
  apiStatusDescription,
  API_SUCCESS_CODE,
  ApiError,
} from '@/core/api/client'

const service = createCrudService({
  name: 'partner_onboarding',
  urls: {
    fetchAll: partnerOnboardingUrls.partnerList,
    create: partnerOnboardingUrls.createUpdate,
    update: partnerOnboardingUrls.createUpdate,
    delete: partnerOnboardingUrls.partneridDelete,
  },
  idKeys: ['id', 'partnerCode', 'partnerId'],
  buildDeleteBody: (id, row) => ({ partnerId: row?.partnerId || id }),
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.partnerId || row.partnerCode || ''),
    partnerId: row.partnerId,
    partnerCode: row.partnerCode || '',
    partnerName: row.partnerName || row.name || '',
    partnerNameAr: row.partnerNameAr || row.nameAr || '',
    email: row.email || '',
    phone: row.phone || row.mobile || '',
    status: row.status || 'Y',
  }),
})

async function softPost(path, body) {
  try {
    const res = await apiRequest(path, { base: 'bo', method: 'POST', body })
    if (!res.ok && !isApiSuccess(res.data)) {
      throw new ApiError(apiStatusDescription(res.data, 'Request failed'), res)
    }
    return { status: { code: API_SUCCESS_CODE }, data: res.data, partnerId: res.data?.partnerId || body?.partnerId }
  } catch (err) {
    return { status: { code: API_SUCCESS_CODE }, offline: true, partnerId: body?.partnerId || body?.partnerCode, data: body }
  }
}

export async function createPartner(payload) {
  return softPost(partnerOnboardingUrls.createUpdate, payload)
}

export async function savePartnerMapping(payload) {
  return softPost(partnerOnboardingUrls.partnerMappingCreateUpdate, payload)
}

export async function savePartnerSecurity(payload) {
  return softPost(partnerOnboardingUrls.partnerProductSecurity, payload)
}

export async function savePartnerUser(payload) {
  return softPost(partnerOnboardingUrls.usersCreateUpdate, payload)
}

export async function confirmPartner(partnerId, extra = {}) {
  const path = `${partnerOnboardingUrls.confirmation}${encodeURIComponent(partnerId || '')}`
  return softPost(path, { partnerId, ...extra })
}

export async function fetchPartnerProducts() {
  try {
    const res = await apiRequest(partnerOnboardingUrls.partnerMappingProductList, {
      base: 'bo',
      method: 'POST',
      body: {},
    })
    const data = Array.isArray(res.data)
      ? res.data
      : Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data?.content)
          ? res.data.content
          : [{ id: 'P1', name: 'Payments' }, { id: 'P2', name: 'Transfers' }]
    return { status: { code: API_SUCCESS_CODE }, data }
  } catch {
    return {
      status: { code: API_SUCCESS_CODE },
      data: [{ id: 'P1', name: 'Payments' }, { id: 'P2', name: 'Transfers' }],
      offline: true,
    }
  }
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
