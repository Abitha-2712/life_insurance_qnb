import { createCrudService } from '@/features/common/crud/createCrudService'

/** Flutter EmploymentMasterOccupationUrl */
export const occupationService = createCrudService({
  name: 'occupation',
  base: 'data',
  urls: {
    fetchAll: 'dob/occupation/getAll',
    create: 'dob/occupation/create',
    update: 'dob/occupation/update',
    delete: 'dob/occupation/delete',
  },
  idKeys: ['occupationId', 'id'],
  mapRow: (row) => ({
    ...row,
    id: String(row.occupationId ?? row.id ?? ''),
    occupationId: row.occupationId ?? row.id ?? '',
    occupationName: row.occupationName || '',
    occupationNameAr: row.occupationNameAr || '',
    displayOrder: row.displayOrder ?? '',
    status: row.status || 'Y',
  }),
  buildCreateBody: (form) => ({
    occupationName: form.occupationName,
    occupationNameAr: form.occupationNameAr || '',
    displayOrder: Number(form.displayOrder) || 0,
    status: form.status || 'Y',
  }),
  buildUpdateBody: (form) => ({
    occupationId: Number(form.occupationId || form.id),
    occupationName: form.occupationName,
    occupationNameAr: form.occupationNameAr || '',
    displayOrder: Number(form.displayOrder) || 0,
    status: form.status || 'Y',
  }),
  buildDeleteBody: (id) => ({ occupationId: Number(id) }),
})

/** Flutter EmploymentMasterEmployerUrl — manage with action */
export const employerService = createCrudService({
  name: 'employer',
  base: 'data',
  urls: {
    fetchAll: 'dob/employer/getAll',
    create: 'dob/employer/manage',
    update: 'dob/employer/manage',
    delete: 'dob/employer/manage',
  },
  idKeys: ['employerId', 'id'],
  mapRow: (row) => ({
    ...row,
    id: String(row.employerId ?? row.id ?? ''),
    employerId: row.employerId ?? row.id ?? '',
    employerName: row.employerName || '',
    employerNameAr: row.employerNameAr || '',
    displayOrder: row.displayOrder ?? '',
    status: row.status || 'Y',
  }),
  buildCreateBody: (form) => ({
    action: 'ADD',
    employerName: form.employerName,
    employerNameAr: form.employerNameAr || '',
    displayOrder: Number(form.displayOrder) || 0,
    status: form.status || 'Y',
  }),
  buildUpdateBody: (form) => ({
    action: 'UPDATE',
    employerId: Number(form.employerId || form.id),
    employerName: form.employerName,
    employerNameAr: form.employerNameAr || '',
    displayOrder: Number(form.displayOrder) || 0,
    status: form.status || 'Y',
  }),
  buildDeleteBody: (id) => ({
    action: 'DELETE',
    employerId: Number(id),
  }),
})

/** Flutter EmploymentMasterSectorTypeUrl */
export const sectorTypeService = createCrudService({
  name: 'sectorType',
  base: 'data',
  urls: {
    fetchAll: 'dob/sector-type/getAll',
    create: 'dob/sector-type/create',
    update: 'dob/sector-type/update',
    delete: 'dob/sector-type/delete',
  },
  idKeys: ['sectorTypeId', 'id'],
  mapRow: (row) => ({
    ...row,
    id: String(row.sectorTypeId ?? row.id ?? ''),
    sectorTypeId: row.sectorTypeId ?? row.id ?? '',
    sectorTypeName: row.sectorTypeName || row.name || '',
    sectorTypeNameAr: row.sectorTypeNameAr || row.nameAr || '',
    displayOrder: row.displayOrder ?? '',
    status: row.status || 'Y',
  }),
  buildCreateBody: (form) => ({
    sectorTypeName: form.sectorTypeName,
    sectorTypeNameAr: form.sectorTypeNameAr || '',
    displayOrder: Number(form.displayOrder) || 0,
    status: form.status || 'Y',
  }),
  buildUpdateBody: (form) => ({
    sectorTypeId: Number(form.sectorTypeId || form.id),
    sectorTypeName: form.sectorTypeName,
    sectorTypeNameAr: form.sectorTypeNameAr || '',
    displayOrder: Number(form.displayOrder) || 0,
    status: form.status || 'Y',
  }),
  buildDeleteBody: (id) => ({ sectorTypeId: Number(id) }),
})

/** Flutter EmploymentMasterCountryUrl */
export const countryService = createCrudService({
  name: 'employmentCountry',
  base: 'data',
  urls: {
    fetchAll: 'dob/country/getAll',
    create: 'dob/country/create',
    update: 'dob/country/update',
    delete: 'dob/country/delete',
  },
  idKeys: ['id', 'countryCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id ?? row.countryCode ?? ''),
    countryCode: row.countryCode || '',
    countryName: row.countryName || '',
    countryNameAr: row.countryNameAr || '',
    displayOrder: row.displayOrder ?? '',
    status: row.status || 'Y',
  }),
  buildCreateBody: (form) => ({
    countryCode: form.countryCode,
    countryName: form.countryName,
    countryNameAr: form.countryNameAr || '',
    displayOrder: Number(form.displayOrder) || 0,
    status: form.status || 'Y',
  }),
  buildUpdateBody: (form) => ({
    id: form.id,
    countryCode: form.countryCode,
    countryName: form.countryName,
    countryNameAr: form.countryNameAr || '',
    displayOrder: Number(form.displayOrder) || 0,
    status: form.status || 'Y',
  }),
  buildDeleteBody: (id) => ({ id }),
})

/** Flutter EmploymentMasterCityUrl */
export const cityService = createCrudService({
  name: 'employmentCity',
  base: 'data',
  urls: {
    fetchAll: 'dob/city/getAll',
    create: 'dob/city/create',
    update: 'dob/city/update',
    delete: 'dob/city/delete',
  },
  idKeys: ['id', 'cityCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id ?? row.cityCode ?? ''),
    cityCode: row.cityCode || '',
    cityName: row.cityName || '',
    cityNameAr: row.cityNameAr || '',
    countryCode: row.countryCode || '',
    displayOrder: row.displayOrder ?? '',
    status: row.status || 'Y',
  }),
  buildCreateBody: (form) => ({
    cityCode: form.cityCode,
    cityName: form.cityName,
    cityNameAr: form.cityNameAr || '',
    countryCode: form.countryCode,
    displayOrder: Number(form.displayOrder) || 0,
    status: form.status || 'Y',
  }),
  buildUpdateBody: (form) => ({
    id: form.id,
    cityCode: form.cityCode,
    cityName: form.cityName,
    cityNameAr: form.cityNameAr || '',
    countryCode: form.countryCode,
    displayOrder: Number(form.displayOrder) || 0,
    status: form.status || 'Y',
  }),
  buildDeleteBody: (id) => ({ id }),
})

/** @deprecated use employerService — kept for older imports */
const service = employerService
export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
