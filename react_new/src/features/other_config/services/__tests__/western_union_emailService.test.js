import { describe, it, expect } from 'vitest'
import service from '../western_union_emailService'

describe('western_union_emailService', () => {
  it('exposes Western Union Email endpoints', () => {
    expect(service.urls.fetchAll).toBe('wu-email/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
