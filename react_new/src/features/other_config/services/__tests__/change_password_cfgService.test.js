import { describe, it, expect } from 'vitest'
import service from '../change_password_cfgService'
import { passwordConfigurationUrls } from '@/core/api/urls/password_configurationUrls'

describe('change_password_cfgService', () => {
  it('uses CSV passwordConfigurationUrls', () => {
    expect(service.urls.fetchAll).toBe(passwordConfigurationUrls.fetchAllPasswordConfiguration)
    expect(service.urls.create).toBe(passwordConfigurationUrls.createPasswordConfiguration)
  })
})
