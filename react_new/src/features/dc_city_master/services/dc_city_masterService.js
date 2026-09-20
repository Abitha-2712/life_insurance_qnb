import { createCrudService } from '@/features/common/crud/createCrudService'

/** Flutter dc_city_master_datasource — dataurl + city-master/getAll|manage
 *  (sample: baseUrlOverride: dataurl; manage action ADD|UPDATE|DELETE). */
const service = createCrudService({
  name: 'dc_city_master',
  base: 'data',
  urls: {
    fetchAll: 'city-master/getAll',
    create: 'city-master/manage',
    update: 'city-master/manage',
    delete: 'city-master/manage',
  },
  idKeys: ['id', 'cityCode', 'cityId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.cityCode || row.cityId || ''),
    cityCode: row.cityCode || row.code || '',
    cityNameEnglish: row.englishLabel || row.cityNameEnglish || row.city || row.cityName || '',
    cityNameArabic: row.arabicLabel || row.cityNameArabic || row.cityAr || '',
    countryCode: row.isoCountryCode || row.countryCode || row.country || 'QA',
    region: row.region || row.state || '',
    status: row.status || 'Y',
  }),
  buildCreateBody: (form) => ({
    action: 'ADD',
    country: form.country || form.countryCode || '',
    city: form.cityNameEnglish || form.city || '',
    isoCountryCode: form.countryCode || form.isoCountryCode || '',
    status: form.status || 'Y',
    ...(form.cityNameArabic ? { cityAr: form.cityNameArabic } : {}),
  }),
  buildUpdateBody: (form) => ({
    action: 'UPDATE',
    id: form.id,
    country: form.country || form.countryCode || '',
    city: form.cityNameEnglish || form.city || '',
    isoCountryCode: form.countryCode || form.isoCountryCode || '',
    status: form.status || 'Y',
    ...(form.cityNameArabic ? { cityAr: form.cityNameArabic } : {}),
  }),
  buildDeleteBody: (id, row) => ({ id, action: 'DELETE' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
