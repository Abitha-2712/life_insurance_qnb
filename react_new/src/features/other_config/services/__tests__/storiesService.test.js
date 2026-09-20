import { describe, it, expect } from 'vitest'
import service from '../storiesService'

describe('storiesService', () => {
  it('exposes Stories Management endpoints', () => {
    expect(service.urls.fetchAll).toBe('stories/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
