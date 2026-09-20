import { describe, it, expect } from 'vitest'
import service from '../configuration_parametersService'

describe('configuration_parametersService', () => {
  it('uses formconfig endpoints', () => {
    expect(service.urls.fetchAll).toBe('formconfig/getAll')
    expect(service.urls.create).toBe('formconfig/create')
  })
})
