import { describe, it, expect } from 'vitest'
import service from '../limit_setupService'

describe('limit_setupService', () => {
  it('uses TransferControl endpoints for transfer limits', () => {
    expect(service.urls.fetchAll).toBe('TransferControl/getAll')
    expect(service.urls.create).toBe('TransferControl/save')
  })
})
