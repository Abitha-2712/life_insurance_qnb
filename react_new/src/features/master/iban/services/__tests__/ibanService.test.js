import { describe, it, expect } from 'vitest'
import service from '../ibanService'

describe('ibanService', () => {
  it('uses Flutter IBAN block-list endpoints', () => {
    expect(service.urls.fetchAll).toBe('iban/blockedIbanList')
    expect(service.urls.create).toBe('iban/modifyBlockIban')
  })
})
