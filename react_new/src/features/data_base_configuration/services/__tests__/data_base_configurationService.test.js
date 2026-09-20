import { describe, it, expect } from 'vitest'
import service from '../data_base_configurationService.js'
import { databaseUrls } from '@/core/api/urls/databaseUrls'

describe('data_base_configurationService', () => {
  it('exposes CRUD functions and CSV databaseUrls', () => {
    expect(typeof service.fetchAll).toBe('function')
    expect(typeof service.save).toBe('function')
    expect(typeof service.remove).toBe('function')
    expect(service.urls.fetchAll).toBe(databaseUrls.fetchAlldatabasefetch)
    expect(service.urls.create).toBe(databaseUrls.databasepost)
  })

  it('mapRow normalizes host/schema', () => {
    const mapped = service.mapRow({ name: 'core', host: 'db.local', port: 5432, schema: 'bo' })
    expect(mapped.dbName).toBe('core')
    expect(mapped.host).toBe('db.local')
    expect(mapped.port).toBe('5432')
    expect(mapped.schemaName).toBe('bo')
  })
})
