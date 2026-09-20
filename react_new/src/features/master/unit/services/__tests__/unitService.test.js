import { describe, it, expect } from 'vitest'
import service from '../unitService.js'

describe('unitService', () => {
  it('exposes CRUD functions and url map', () => {
    expect(typeof service.fetchAll).toBe('function')
    expect(typeof service.save).toBe('function')
    expect(typeof service.remove).toBe('function')
    expect(service.urls).toBeTruthy()
    expect(service.urls.fetchAll).toBeTruthy()
  })
})
