import { describe, it, expect } from 'vitest'
import service from '../favoriteService'

describe('favoriteService', () => {
  it('exposes Favorite endpoints', () => {
    expect(service.urls.fetchAll).toBe('favorite/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
