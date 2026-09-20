import { describe, it, expect } from 'vitest'
import service from '../report_templateService'

describe('report_templateService', () => {
  it('exposes Report Template Maintenance endpoints', () => {
    expect(service.urls.fetchAll).toBe('report-template/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
