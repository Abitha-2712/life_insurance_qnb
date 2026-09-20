import { describe, it, expect } from 'vitest'
import service from '../user_name_rulesService'

describe('user_name_rulesService', () => {
  it('uses usernamerule endpoints', () => {
    expect(service.urls.fetchAll).toBe('usernamerule/getAll')
    expect(service.urls.create).toBe('usernamerule/create')
  })
  it('seed includes min/max length', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].minLength).toBeTruthy()
    expect(res.data[0].maxLength).toBeTruthy()
  })
})
