import { describe, it, expect } from 'vitest'
import service from '../screen_configurationService'

describe('screen_configurationService', () => {
  it('uses theme/config endpoints', () => {
    expect(service.urls.fetchAll).toBe('theme/config/fetch')
    expect(service.urls.create).toBe('theme/config/manage')
  })
})
