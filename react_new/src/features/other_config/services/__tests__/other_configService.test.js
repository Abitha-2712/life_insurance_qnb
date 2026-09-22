import { describe, it, expect } from 'vitest'
import service from '../other_configService.js'
import { accountClassUrls } from '@/core/api/urls/account_classUrls'

describe('other_configService', () => {
  it('uses CSV accountClassUrls', () => {
    expect(service.urls.fetchAll).toBe(accountClassUrls.fetchAllAccountClass)
    expect(service.urls.create).toBe(accountClassUrls.addAccountClass)
    expect(service.urls.update).toBe(accountClassUrls.updateAccountClass)
    expect(service.urls.delete).toBe(accountClassUrls.deleteAccountClass)
  })

  it('mapRow normalizes code/name aliases', () => {
    const mapped = service.mapRow({
      classCode: 'SAV',
      className: 'Savings',
      status: 'Y',
    })
    expect(mapped.id).toBe('SAV')
    expect(mapped.code).toBe('SAV')
    expect(mapped.name).toBe('Savings')
  })
})
