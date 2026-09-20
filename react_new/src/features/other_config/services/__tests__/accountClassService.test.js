import { describe, it, expect } from 'vitest'
import service from '../accountClassService'

describe('accountClassService', () => {
  it('uses account-class endpoints', () => {
    expect(service.urls.fetchAll).toBe('account-class/getall')
    expect(service.urls.create).toBe('account-class/add')
  })
})
