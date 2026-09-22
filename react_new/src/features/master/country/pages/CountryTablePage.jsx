import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { StatusChip } from '@/components/ui'
import service from '../services/countryService'

const ADDRESS_REQUIREMENT_OPTIONS = [
  { value: 'Required', label: 'Required' },
  { value: 'Not Required', label: 'Not Required' },
  { value: 'Optional', label: 'Optional' },
]

const TIN_ELIGIBILITY_OPTIONS = [
  { value: 'Required', label: 'Required' },
  { value: 'Not Required', label: 'Not Required' },
]

const YES_NO_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
]

function optionalMaxLength(fieldName, maxLength = 20) {
  return (value) => {
    const val = String(value ?? '').trim()
    if (!val) return ''
    if (val.length > maxLength) {
      return `${fieldName} cannot exceed ${maxLength} characters`
    }
    return ''
  }
}

const columns = [
  { key: 'countryDesc', label: 'Country Description' },
  { key: 'countryCode', label: 'Country Code' },
  { key: 'isoCountryCode', label: 'ISO Country Code' },
  { key: 'baseCurrency', label: 'Base Currency' },
  { key: 'mobNoPrefix', label: 'Mobile Number Prefix' },
  { key: 'langEn', label: 'Language EN' },
  { key: 'langAr', label: 'Language AR' },
  { key: 'swiftName', label: 'Swift Name' },
  { key: 'benefAddress', label: 'Beneficiary Address Field' },
  { key: 'beneficiaryAddressPob', label: 'Beneficiary Address Field (POB)' },
  { key: 'beneficiaryAddressDob', label: 'Beneficiary Address Field (DOB)' },
  { key: 'tinEligibility', label: 'TIN Eligibility' },
  { key: 'tinType', label: 'TIN Type' },
  { key: 'tinValidation', label: 'TIN Validation' },
  { key: 'dialCode', label: 'Dial Code' },
  { key: 'eipoSubscription', label: 'eIPO subscription' },
  { key: 'eipoAllowedNationality', label: 'eIPO Allowed Nationality' },
  {
    key: 'digitalOnboardingEligibility',
    label: 'Digital Onboarding Eligibility',
    render: (row) => (
      <StatusChip
        status={row.digitalOnboardingEligibility === 'Y' ? 'Active' : 'Inactive'}
      />
    ),
  },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  {
    key: 'countryCode',
    label: 'Country Code',
    required: true,
    lockOnEdit: true,
    maxLength: 20,
    placeholder: 'Enter Country Code',
    requiredMessage: 'Please enter Country Code',
  },
  {
    key: 'countryDesc',
    label: 'Country Description',
    required: true,
    maxLength: 30,
    placeholder: 'Enter Country Description',
    requiredMessage: 'Please enter Country Description',
  },
  {
    key: 'isoCountryCode',
    label: 'ISO Country Code',
    required: true,
    maxLength: 30,
    placeholder: 'Enter Iso Country Code',
    requiredMessage: 'Please enter ISO Country Code',
  },
  {
    key: 'langEn',
    label: 'Language EN',
    showRequiredStar: true,
    maxLength: 20,
    placeholder: 'Enter Language EN',
    validate: optionalMaxLength('Language EN', 20),
  },
  {
    key: 'langAr',
    label: 'Language AR',
    showRequiredStar: true,
    arabicOnly: true,
    placeholder: 'Enter Language AR',
    validate: (value) => {
      const val = String(value ?? '').trim()
      if (!val) return ''
      if (!/^[\u0600-\u06FF\s]+$/.test(val)) return 'Only Arabic Allowed'
      return ''
    },
  },
  {
    key: 'swiftName',
    label: 'Swift Name',
    required: true,
    maxLength: 20,
    placeholder: 'Enter Swift Name',
    requiredMessage: 'Please enter Swift Name',
  },
  {
    key: 'baseCurrency',
    label: 'Base Currency',
    required: true,
    maxLength: 20,
    placeholder: 'Enter Base Currency',
    requiredMessage: 'Please enter Base Currency',
  },
  {
    key: 'mobNoPrefix',
    label: 'Mobile Number Prefix',
    showRequiredStar: true,
    maxLength: 4,
    allowPattern: /^\+?\d*$/,
    placeholder: 'Enter Mobile Number Prefix',
    validate: optionalMaxLength('Mobile Number Prefix', 4),
  },
  {
    key: 'benefAddress',
    label: 'Beneficiary Address Field',
    type: 'select',
    required: true,
    enableSearch: false,
    hintText: 'Select Value',
    options: ADDRESS_REQUIREMENT_OPTIONS,
    requiredMessage: 'Please select Beneficiary Address Field',
  },
  {
    key: 'beneficiaryAddressPob',
    label: 'Beneficiary Address Field (POB)',
    type: 'select',
    required: true,
    enableSearch: false,
    hintText: 'Select Value',
    options: ADDRESS_REQUIREMENT_OPTIONS,
    requiredMessage: 'Please select Beneficiary Address Field (POB)',
  },
  {
    key: 'beneficiaryAddressDob',
    label: 'Beneficiary Address Field (DOB)',
    type: 'select',
    required: true,
    enableSearch: false,
    hintText: 'Select Value',
    options: ADDRESS_REQUIREMENT_OPTIONS,
    requiredMessage: 'Please select Beneficiary Address Field (DOB)',
  },
  {
    key: 'tinEligibility',
    label: 'TIN Eligibility',
    type: 'select',
    required: true,
    enableSearch: false,
    hintText: 'Select Value',
    options: TIN_ELIGIBILITY_OPTIONS,
    requiredMessage: 'Please select TIN Eligibility',
  },
  {
    key: 'tinType',
    label: 'TIN Type',
    required: false,
    maxLength: 2000,
    placeholder: 'Enter TIN Type',
    validate: optionalMaxLength('TIN Type', 2000),
  },
  {
    key: 'tinValidation',
    label: 'TIN Validation',
    required: false,
    maxLength: 2000,
    placeholder: 'Enter TIN Validation',
    validate: optionalMaxLength('TIN Validation', 2000),
  },
  {
    key: 'dialCode',
    label: 'Dial Code',
    required: false,
    maxLength: 20,
    placeholder: 'Enter Dial Code',
    validate: optionalMaxLength('Dial Code', 20),
  },
  {
    key: 'eipoSubscription',
    label: 'eIPO subscription',
    type: 'select',
    enableSearch: false,
    hintText: 'Select Value',
    options: YES_NO_OPTIONS,
  },
  {
    key: 'eipoAllowedNationality',
    label: 'eIPO Allowed Nationality',
    type: 'select',
    enableSearch: false,
    hintText: 'Select Value',
    options: YES_NO_OPTIONS,
  },
  {
    key: 'digitalOnboardingEligibility',
    label: 'Digital Onboarding Eligibility',
    type: 'switch',
    defaultValue: 'Y',
    activeValue: 'Y',
    inactiveValue: 'N',
    labelPosition: 'left',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'switch',
    defaultValue: 'ACT',
    activeValue: 'ACT',
    inactiveValue: 'IAC',
    labelPosition: 'left',
  },
]

export default function CountryTablePage() {
  return (
    <GenericCrudPage
      title="Country"
      entityLabel="Country"
      listTitle="List of Country"
      addLabel="Add Country"
      totalLabel="Total Countries"
      activeLabel="Active Countries"
      inactiveLabel="Inactive Countries"
      service={service}
      columns={columns}
      fields={fields}
      rowKey="countryCode"
      pdfFileName="countries.pdf"
      excelFileName="countries.csv"
    />
  )
}
