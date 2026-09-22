import { describe, it, expect } from 'vitest'
import service from '../transfer_configService'

describe('transfer_configService', () => {
  it('uses TransferControl endpoints', () => {
    expect(service.urls.fetchAll).toBe('TransferControl/getAll')
    expect(service.urls.create).toBe('TransferControl/save')
  })
})
