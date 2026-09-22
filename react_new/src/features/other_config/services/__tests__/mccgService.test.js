import { describe, it, expect } from 'vitest'
import service from '../mccgService'

describe('mccgService', () => {
  it('exposes MCCG endpoints', () => {
    expect(service.urls.fetchAll).toBe('mccg/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
