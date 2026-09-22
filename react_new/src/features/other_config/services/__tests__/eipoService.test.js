import { describe, it, expect } from 'vitest'
import service from '../eipoService'

describe('eipoService', () => {
  it('exposes eIPO Company Configuration endpoints', () => {
    expect(service.urls.fetchAll).toBe('eipo-company/getAll')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
