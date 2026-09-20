import { describe, it, expect } from 'vitest'
import service from '../western_union_historyService'

describe('western_union_historyService', () => {
  it('exposes Western Union History endpoints', () => {
    expect(service.urls.fetchAll).toBe('wu-history/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
