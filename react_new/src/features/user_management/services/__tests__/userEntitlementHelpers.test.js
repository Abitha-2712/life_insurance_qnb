import { describe, it, expect, vi, beforeEach } from 'vitest'
import { manageUserUrls } from '@/core/api/urls/manage_userUrls'

vi.mock('@/core/api/client', () => ({
  apiRequest: vi.fn(async (path) => {
    if (path === manageUserUrls.dropdownRoles) {
      return { ok: true, data: { data: [{ roleCode: 'ADMIN', roleName: 'Administrator' }] } }
    }
    if (path === manageUserUrls.dropdownGroups) {
      return { ok: true, data: { data: [{ groupCode: 'OPS', groupName: 'Operations' }] } }
    }
    if (path === manageUserUrls.productDropdown) {
      return { ok: true, data: [{ productCode: 'P1', productName: 'Payments' }] }
    }
    if (path === manageUserUrls.subProductDropdown || path === manageUserUrls.subProdfetchbyProdCode) {
      return { ok: true, data: [{ subProductCode: 'SP1', subProductName: 'Transfers' }] }
    }
    if (path === manageUserUrls.accessDropdown || path === manageUserUrls.accessfetchbyPrdSub) {
      return { ok: true, data: [{ accessCode: 'A1', accessName: 'View' }] }
    }
    if (path === manageUserUrls.domainDropdown) {
      return { ok: true, data: [{ domainCode: 'D1', domainName: 'Retail' }] }
    }
    return { ok: true, data: [] }
  }),
}))

import {
  fetchAccessDropdown,
  fetchDomainDropdown,
  fetchGroupDropdown,
  fetchProductDropdown,
  fetchRoleDropdown,
  fetchSubProductDropdown,
} from '../user_managementService'

describe('user entitlement dropdown helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetchRoleDropdown returns role options', async () => {
    const opts = await fetchRoleDropdown()
    expect(opts).toEqual([{ value: 'ADMIN', label: 'Administrator' }])
  })

  it('fetchGroupDropdown returns group options', async () => {
    const opts = await fetchGroupDropdown()
    expect(opts).toEqual([{ value: 'OPS', label: 'Operations' }])
  })

  it('fetchProduct/SubProduct/Access/Domain dropdowns resolve options', async () => {
    expect(await fetchProductDropdown()).toEqual([{ value: 'P1', label: 'Payments' }])
    expect(await fetchSubProductDropdown('P1')).toEqual([{ value: 'SP1', label: 'Transfers' }])
    expect(await fetchAccessDropdown({ productCode: 'P1', subProductCode: 'SP1' })).toEqual([
      { value: 'A1', label: 'View' },
    ])
    expect(await fetchDomainDropdown()).toEqual([{ value: 'D1', label: 'Retail' }])
  })
})
