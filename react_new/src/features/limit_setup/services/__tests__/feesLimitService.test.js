import { describe, it, expect } from 'vitest'
import service from '../feesLimitService'

describe('feesLimitService', () => {
  it('uses TransferControl endpoints for fees limits', () => {
    expect(service.urls.fetchAll).toBe('TransferControl/getAll')
  })
})
