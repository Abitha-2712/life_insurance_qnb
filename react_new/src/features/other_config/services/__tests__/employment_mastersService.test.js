import { describe, it, expect } from 'vitest'
import {
  occupationService,
  employerService,
  sectorTypeService,
  countryService,
  cityService,
} from '../employment_mastersService'

describe('employment_mastersService', () => {
  it('exposes five Flutter DOB endpoints', () => {
    expect(occupationService.urls.fetchAll).toBe('dob/occupation/getAll')
    expect(employerService.urls.fetchAll).toBe('dob/employer/getAll')
    expect(employerService.urls.create).toBe('dob/employer/manage')
    expect(sectorTypeService.urls.fetchAll).toBe('dob/sector-type/getAll')
    expect(countryService.urls.fetchAll).toBe('dob/country/getAll')
    expect(cityService.urls.fetchAll).toBe('dob/city/getAll')
  })
})
