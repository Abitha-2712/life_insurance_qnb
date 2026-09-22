import { createCrudService } from '@/features/common/crud/createCrudService'

/** Flutter AfaqWorkingScheduleUrl */
export const afaqWorkingScheduleService = createCrudService({
  name: 'afaq_working_schedule',
  base: 'data',
  urls: {
    fetchAll: 'afaqWorkingSchedule/getAll',
    create: 'afaqWorkingSchedule/create',
    update: 'afaqWorkingSchedule/update',
    delete: 'afaqWorkingSchedule/delete',
  },
  idKeys: ['id', 'countryCode'],
  mapRow: (row) => {
    const dayTime = Array.isArray(row.dayTime) ? row.dayTime : []
    return {
      ...row,
      id: String(row.id || row.countryCode || ''),
      countryDesc: row.countryDesc || '',
      dayOfWeek: dayTime.map((dt) => dt.day || '').join(', '),
      workingDay: dayTime.map((dt) => dt.isWorkingDay || '').join(', '),
      startTime: dayTime.map((dt) => dt.time || dt.startTime || '').join(', '),
      endTime: dayTime.map((dt) => dt.endTime || '').join(', '),
      status: row.status || 'Y',
    }
  },
})

/** Flutter AfaqHolidayUrl */
export const afaqHolidayService = createCrudService({
  name: 'afaq_holiday',
  base: 'data',
  urls: {
    fetchAll: 'afaq-holiday/get-all',
    create: 'afaq-holiday/create',
    update: 'afaq-holiday/update',
    delete: 'afaq-holiday/delete',
  },
  idKeys: ['id'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id ?? ''),
    holidayDate: row.holidayDate || '',
    countryDesc: row.countryDesc || '',
    descriptionEn: row.descriptionEn || '',
    descriptionAr: row.descriptionAr || '',
    status: row.status || 'Y',
  }),
})

/** Flutter AfaqCountryCurrencyUrl */
export const afaqCountryCurrencyService = createCrudService({
  name: 'afaq_country_currency',
  base: 'data',
  urls: {
    fetchAll: 'afaq-country-currencies/getAll',
    create: 'afaq-country-currencies/manage',
    update: 'afaq-country-currencies/manage',
    delete: 'afaq-country-currencies/manage',
  },
  idKeys: ['id', 'countryCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.countryCode || ''),
    countryCode: row.countryCode ?? '',
    countryDesc: row.countryDesc || '',
    currencyCode: row.currencyCode || '',
    isoNumber: row.isoNumber ?? '',
    status: row.status || 'Y',
  }),
})

/** @deprecated prefer named exports */
const service = afaqCountryCurrencyService
export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
