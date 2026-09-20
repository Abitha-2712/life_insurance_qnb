import { createCrudService } from '@/features/common/crud/createCrudService'
import { apiRequest, API_SUCCESS_CODE } from '@/core/api/client'
import { customerSupportUrls } from '@/core/api/urls/customer_supportUrls'

const service = createCrudService({
  name: 'customer_support',
  urls: {
    fetchAll: customerSupportUrls.fetchAllcustomerDETAILS,
    create: customerSupportUrls.fetchAllcustomerDETAILS,
    update: customerSupportUrls.fetchAllcustomerDETAILS,
    delete: customerSupportUrls.fetchAllcustomerDETAILS,
  },
  idKeys: ['id', 'customerId', 'cif'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.customerId || row.cif || ''),
    customerId: row.customerId || row.cif || row.customerCIF || '',
    customerName: row.customerName || row.name || row.englishLabel || '',
    mobile: row.mobile || row.mobileNumber || row.phone || '',
    email: row.email || '',
    segment: row.segment || row.segmentCode || '',
    actionType: row.actionType || row.type || 'VIEW',
    status: row.status || 'Y',
  }),
})

export async function fetchCustomerDetails(customerId) {
  const res = await apiRequest(customerSupportUrls.fetchAllcustomerDETAILS, {
    base: 'data',
    method: 'POST',
    body: { customerId },
  })
  return res.data || { status: { code: API_SUCCESS_CODE } }
}

export async function fetchCustomerCards(customerId) {
  const res = await apiRequest(customerSupportUrls.fetchAllcustomercards, {
    base: 'data',
    method: 'POST',
    body: { customerId },
  })
  return res.data || { status: { code: API_SUCCESS_CODE } }
}

export async function fetchCustomerAccounts(customerId) {
  const res = await apiRequest(customerSupportUrls.fetchAllcustomeraccounds, {
    base: 'data',
    method: 'POST',
    body: { customerId },
  })
  return res.data || { status: { code: API_SUCCESS_CODE } }
}

export async function fetchCustomerLoans(customerId) {
  const res = await apiRequest(customerSupportUrls.fetchAllcustomerloan, {
    base: 'data',
    method: 'POST',
    body: { customerId },
  })
  return res.data || { status: { code: API_SUCCESS_CODE } }
}

export async function fetchCustomerDeposits(customerId) {
  const res = await apiRequest(customerSupportUrls.fetchAllcustomerdeposite, {
    base: 'data',
    method: 'POST',
    body: { customerId },
  })
  return res.data || { status: { code: API_SUCCESS_CODE } }
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
