import { describe, it, expect } from 'vitest'
import service from '../rtp_account_typeService'

describe('rtp_account_typeService', () => {
  it('exposes RTP Account Type endpoints', () => {
    expect(service.urls.fetchAll).toBe('rtp-account-type/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
