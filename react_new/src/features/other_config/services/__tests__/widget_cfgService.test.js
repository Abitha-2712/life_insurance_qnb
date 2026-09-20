import { describe, it, expect } from 'vitest'
import service from '../widget_cfgService'

describe('widget_cfgService', () => {
  it('exposes Widget Configuration endpoints', () => {
    expect(service.urls.fetchAll).toBe('widget/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
