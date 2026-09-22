import { createCrudService } from '@/features/common/crud/createCrudService'
import { countryUrls } from '@/core/api/urls/countryUrls.js'

function isActiveStatus(status) {
  const s = String(status || '')
    .toUpperCase()
    .trim()
  return ['Y', 'YES', 'ACT', 'ACTIVE', '1', 'TRUE', 'ENABLED'].includes(s)
}

function mapYesNoToLabel(value) {
  if (value === 'Y') return 'Yes'
  if (value === 'N') return 'No'
  return value || ''
}

function mapLabelToYesNo(value) {
  const v = String(value || '').trim()
  if (v === 'Yes') return 'Y'
  if (v === 'No') return 'N'
  return ''
}

function buildRequestData(form) {
  const data = {
    countryCode: String(form.countryCode || '').trim(),
    countryDesc: String(form.countryDesc || '').trim(),
    isoCountryCode: String(form.isoCountryCode || '').trim(),
    langEn: String(form.langEn || '').trim(),
    langAr: String(form.langAr || '').trim(),
    baseCurrency: String(form.baseCurrency || '').trim(),
    mobNoPrefix: String(form.mobNoPrefix || '').trim(),
    status: isActiveStatus(form.status) ? 'ACT' : 'IAC',
    digitalOnboardingEligible: isActiveStatus(form.digitalOnboardingEligibility) ? 'Y' : 'N',
  }

  const optionalText = [
    'swiftName',
    'tinType',
    'tinValidation',
    'dialCode',
    'benefAddress',
    'beneficiaryAddressPob',
    'beneficiaryAddressDob',
    'tinEligibility',
  ]
  for (const key of optionalText) {
    const value = String(form[key] ?? '').trim()
    if (value) data[key] = value
  }

  const eipoSubscription = mapLabelToYesNo(form.eipoSubscription)
  if (eipoSubscription) data.eipoSubscription = eipoSubscription

  const eipoAllowedNationality = mapLabelToYesNo(form.eipoAllowedNationality)
  if (eipoAllowedNationality) data.eipoAllowedNationality = eipoAllowedNationality

  return data
}

/** Country — mirrors Flutter master_country_datasource.dart field mapping. */
const service = createCrudService({
  base: 'wfc',
  name: 'country',
  urls: {
    fetchAll: countryUrls.fetchAllCountry,
    create: countryUrls.postCountry,
    update: countryUrls.postCountry,
    delete: countryUrls.deleteCountry,
  },
  idKeys: ['id', 'countryCode'],
  mapRow: (row) => {
    const statusRaw = String(row.status || 'ACT').toUpperCase().trim()
    const isInactive = ['N', 'NO', 'IAC', 'INACTIVE', 'INACT', '0', 'FALSE'].includes(statusRaw)
    const digitalRaw =
      row.digitalOnboardingEligible ?? row.digitalOnboardingEligibility ?? 'Y'
    const digitalInactive = !isActiveStatus(digitalRaw)

    return {
      ...row,
      id: String(row.countryCode || row.id || ''),
      countryCode: row.countryCode || '',
      countryDesc: row.countryDesc || '',
      isoCountryCode: row.isoCountryCode || '',
      baseCurrency: row.baseCurrency || '',
      mobNoPrefix: row.mobNoPrefix || '',
      langEn: row.langEn || '',
      langAr: row.langAr || '',
      swiftName: row.swiftName || '',
      benefAddress: row.benefAddress || '',
      beneficiaryAddressPob: row.beneficiaryAddressPob || '',
      beneficiaryAddressDob: row.beneficiaryAddressDob || '',
      tinEligibility: row.tinEligibility || '',
      tinType: row.tinType || '',
      tinValidation: row.tinValidation || '',
      dialCode: row.dialCode || '',
      eipoSubscription: mapYesNoToLabel(row.eipoSubscription),
      eipoAllowedNationality: mapYesNoToLabel(row.eipoAllowedNationality),
      digitalOnboardingEligibility: digitalInactive ? 'N' : 'Y',
      status: isInactive ? 'IAC' : 'ACT',
    }
  },
  buildCreateBody: (form) => ({
    action: 'ADD',
    ...buildRequestData(form),
  }),
  buildUpdateBody: (form) => ({
    action: 'UPDATE',
    ...buildRequestData(form),
  }),
  buildDeleteBody: (id, row) => ({
    action: 'DELETE',
    countryCode: row?.countryCode || id,
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export default service
