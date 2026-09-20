import { describe, it, expect } from 'vitest'
import service from '../rtp_purposeService'

describe('rtp_purposeService', () => {
  it('exposes RTP Transfer Purpose endpoints', () => {
    expect(service.urls.fetchAll).toBe('rtp-purpose/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
