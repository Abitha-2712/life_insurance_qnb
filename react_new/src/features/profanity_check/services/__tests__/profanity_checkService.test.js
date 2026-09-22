import { describe, it, expect } from 'vitest'
import service from '../profanity_checkService'

describe('profanity_checkService', () => {
  it('uses SoftFetch profanity endpoints', () => {
    expect(service.urls.fetchAll).toBe('profanity/getAll')
  })
  it('seed includes severity/action', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].severity).toBeTruthy()
  })
})
