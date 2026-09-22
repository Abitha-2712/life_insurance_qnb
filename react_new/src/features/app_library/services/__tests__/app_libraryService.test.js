import { describe, it, expect } from 'vitest'
import service from '../app_libraryService'

describe('app_libraryService', () => {
  it('uses SoftFetch app-library endpoints', () => {
    expect(service.urls.fetchAll).toBe('app-library/getAll')
  })
  it('seed includes version/platform', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].version).toBeTruthy()
  })
})
