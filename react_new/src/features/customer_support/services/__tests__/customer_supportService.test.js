import { describe, it, expect } from 'vitest'
import service, {
  fetchCustomerDetails,
  fetchCustomerCards,
  fetchCustomerAccounts,
} from '../customer_supportService'

describe('customer_supportService', () => {
  it('uses customer details endpoint for list', () => {
    expect(service.urls.fetchAll).toBe('api/customer/details')
  })
  it('exposes card/account/details helpers', () => {
    expect(typeof fetchCustomerDetails).toBe('function')
    expect(typeof fetchCustomerCards).toBe('function')
    expect(typeof fetchCustomerAccounts).toBe('function')
  })
  it('seed maps CIF fields', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].customerId).toBeTruthy()
  })
})
