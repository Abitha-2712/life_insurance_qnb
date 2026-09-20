import { apiRequest } from '@/core/api/client'
import { createCrudService } from '@/features/common/crud/createCrudService'
import { manageUserUrls } from '@/core/api/urls/manage_userUrls'

/** Flutter manage_user_url.dart â€” user CRUD + dropdowns + entitlement helpers. */
const service = createCrudService({
  name: 'user_management',
  base: 'wfc',
  urls: {
    fetchAll: manageUserUrls.fetchAllUsers,
    create: manageUserUrls.saveUser,
    update: manageUserUrls.modifyUser || manageUserUrls.saveUser,
    delete: manageUserUrls.deleteUser,
  },
  idKeys: ['id', 'userId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.userId || ''),
    userId: row.userId || '',
    userName: row.userName || row.firstName || '',
    userEmail: row.userEmail || row.email || '',
    userRole: row.userRole || row.role || '',
    userGroup: row.userGroup || row.groupCode || row.group || '',
    userType: row.userType || '',
    status: row.status || 'Y',
  }),
  buildCreateBody: (f) => ({
    userId: f.userId,
    userName: f.userName,
    userEmail: f.userEmail,
    userRole: f.userRole,
    userGroup: f.userGroup,
    userType: f.userType,
    status: f.status,
  }),
  buildUpdateBody: (f) => ({
    id: f.id,
    userId: f.userId,
    userName: f.userName,
    userEmail: f.userEmail,
    userRole: f.userRole,
    userGroup: f.userGroup,
    userType: f.userType,
    status: f.status,
  }),
  buildDeleteBody: (id, row) => ({ id, userId: row?.userId || id }),
})

function unwrapDropdown(data) {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray(data.data)) return data.data
  if (Array.isArray(data.content)) return data.content
  if (Array.isArray(data.list)) return data.list
  if (Array.isArray(data.result)) return data.result
  return []
}

function toOptions(raw, valueKeys = ['code', 'value', 'id'], labelKeys = ['name', 'label', 'desc', 'description']) {
  return unwrapDropdown(raw).map((item, i) => {
    if (typeof item === 'string') return { value: item, label: item }
    const value =
      valueKeys.map((k) => item[k]).find((v) => v != null && String(v).trim()) ??
      item.roleCode ??
      item.groupCode ??
      item.productCode ??
      item.subProductCode ??
      item.accessCode ??
      item.domainCode ??
      String(i)
    const label =
      labelKeys.map((k) => item[k]).find((v) => v != null && String(v).trim()) ??
      item.roleName ??
      item.groupName ??
      item.productName ??
      item.englishLabel ??
      String(value)
    return { value: String(value), label: String(label) }
  })
}

export async function fetchRoleDropdown() {
  try {
    const res = await apiRequest(manageUserUrls.dropdownRoles, { method: 'POST', body: {} })
    const opts = toOptions(res.data, ['roleCode', 'code', 'value', 'id'], ['roleName', 'name', 'label'])
    if (opts.length) return opts
  } catch {
    /* offline */
  }
  return [
    { value: 'ADMIN', label: 'Administrator' },
    { value: 'MAKER', label: 'Maker' },
    { value: 'CHECKER', label: 'Checker' },
  ]
}

export async function fetchGroupDropdown() {
  try {
    const res = await apiRequest(manageUserUrls.dropdownGroups, { method: 'POST', body: {} })
    const opts = toOptions(res.data, ['groupCode', 'code', 'value', 'id'], ['groupName', 'name', 'label'])
    if (opts.length) return opts
  } catch {
    /* offline */
  }
  return [
    { value: 'OPS', label: 'Operations' },
    { value: 'IT', label: 'IT' },
  ]
}

export async function fetchDomainDropdown() {
  try {
    const res = await apiRequest(manageUserUrls.domainDropdown, { method: 'POST', body: {} })
    return toOptions(res.data, ['domainCode', 'code', 'value', 'id'], ['domainName', 'name', 'englishLabel', 'label'])
  } catch {
    return []
  }
}

export async function fetchProductDropdown() {
  try {
    const res = await apiRequest(manageUserUrls.productDropdown, { method: 'POST', body: {} })
    return toOptions(res.data, ['productCode', 'code', 'value', 'id'], ['productName', 'name', 'englishLabel', 'label'])
  } catch {
    return []
  }
}

export async function fetchSubProductDropdown(productCode) {
  try {
    const path = productCode
      ? manageUserUrls.subProdfetchbyProdCode
      : manageUserUrls.subProductDropdown
    const res = await apiRequest(path, {
      method: 'POST',
      body: productCode ? { productCode } : {},
    })
    return toOptions(res.data, ['subProductCode', 'code', 'value', 'id'], ['subProductName', 'name', 'englishLabel', 'label'])
  } catch {
    return []
  }
}

export async function fetchAccessDropdown({ productCode, subProductCode } = {}) {
  try {
    const path =
      productCode || subProductCode
        ? manageUserUrls.accessfetchbyPrdSub
        : manageUserUrls.accessDropdown
    const res = await apiRequest(path, {
      method: 'POST',
      body: { productCode, subProductCode },
    })
    return toOptions(res.data, ['accessCode', 'featureCode', 'code', 'value', 'id'], ['accessName', 'featureName', 'name', 'englishLabel', 'label'])
  } catch {
    return []
  }
}

export async function searchUsers(criteria = {}) {
  const res = await apiRequest(manageUserUrls.searchByCriteria, {
    method: 'POST',
    body: criteria,
  })
  return res.data
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
