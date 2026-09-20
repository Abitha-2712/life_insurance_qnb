import { describe, it, expect } from 'vitest'
import service from '../cardService'

describe('cardService', () => {
  it('exposes Card Management endpoints', () => {
    expect(service.urls.fetchAll).toBe('card/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
