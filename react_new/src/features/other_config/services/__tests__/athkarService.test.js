import { describe, it, expect } from 'vitest'
import service from '../athkarService'

describe('athkarService', () => {
  it('exposes Athkar Management endpoints', () => {
    expect(service.urls.fetchAll).toBe('athkar/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
