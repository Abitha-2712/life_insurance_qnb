import { describe, it, expect } from 'vitest'
import service from '../mq_configurationService'

describe('mq_configurationService', () => {
  it('exposes MQ Configuration endpoints', () => {
    expect(service.urls.fetchAll).toBe('mq-config/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
