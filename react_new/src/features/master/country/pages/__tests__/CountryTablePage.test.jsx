import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GenericCrudForm from '@/features/common/crud/GenericCrudForm'
import { StatusChip } from '@/components/ui'
import service from '../../services/countryService'

describe('CountryTablePage form, validations, and service tests', () => {
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
      key: 'benefAddress',
      label: 'Beneficiary Address Field',
      type: 'select',
      required: true,
      enableSearch: false,
      hintText: 'Select Value',
      options: [
        { value: 'Required', label: 'Required' },
        { value: 'Not Required', label: 'Not Required' },
        { value: 'Optional', label: 'Optional' },
      ],
      requiredMessage: 'Please select Beneficiary Address Field',
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

  it('renders required placeholders and status switch', () => {
    render(
      <GenericCrudForm
        mode="add"
        fields={fields}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    expect(screen.getByPlaceholderText('Enter Country Code')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter Country Description')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter Iso Country Code')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter Swift Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter Base Currency')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('initially disables Save until required fields are filled', () => {
    render(
      <GenericCrudForm
        mode="add"
        fields={fields}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    const saveButton = screen.getByRole('button', { name: /Save/i })
    expect(saveButton).toBeDisabled()

    fireEvent.change(screen.getByPlaceholderText('Enter Country Code'), {
      target: { value: 'QA' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter Country Description'), {
      target: { value: 'Qatar' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter Iso Country Code'), {
      target: { value: 'QAT' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter Swift Name'), {
      target: { value: 'QATAR' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter Base Currency'), {
      target: { value: 'QAR' },
    })

    expect(saveButton).toBeDisabled()
  })

  it('shows inline error when required text field is cleared without blur', () => {
    render(
      <GenericCrudForm
        mode="add"
        fields={fields}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    const descInput = screen.getByPlaceholderText('Enter Country Description')
    fireEvent.change(descInput, { target: { value: 'Canada' } })
    fireEvent.change(descInput, { target: { value: '' } })

    expect(screen.getByText('Please enter Country Description')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Save/i })).toBeDisabled()
  })

  it('service mapRow maps API fields and status values', () => {
    const mapped = service.mapRow({
      countryCode: 'QA',
      countryDesc: 'Qatar',
      isoCountryCode: 'QAT',
      baseCurrency: 'QAR',
      mobNoPrefix: '+974',
      langEn: 'English',
      langAr: 'العربية',
      swiftName: 'QATARQA',
      benefAddress: 'Required',
      beneficiaryAddressPob: 'Not Required',
      beneficiaryAddressDob: 'Optional',
      tinEligibility: 'Required',
      eipoSubscription: 'Y',
      eipoAllowedNationality: 'N',
      digitalOnboardingEligible: 'Y',
      status: 'ACT',
    })

    expect(mapped.id).toBe('QA')
    expect(mapped.countryDesc).toBe('Qatar')
    expect(mapped.eipoSubscription).toBe('Yes')
    expect(mapped.eipoAllowedNationality).toBe('No')
    expect(mapped.digitalOnboardingEligibility).toBe('Y')
    expect(mapped.status).toBe('ACT')
  })

  it('service buildCreateBody maps form to Flutter post payload', () => {
    const body = service.buildCreateBody({
      countryCode: 'QA',
      countryDesc: 'Qatar',
      isoCountryCode: 'QAT',
      langEn: 'English',
      langAr: 'العربية',
      swiftName: 'QATARQA',
      baseCurrency: 'QAR',
      mobNoPrefix: '+974',
      benefAddress: 'Required',
      beneficiaryAddressPob: 'Not Required',
      beneficiaryAddressDob: 'Optional',
      tinEligibility: 'Required',
      eipoSubscription: 'Yes',
      eipoAllowedNationality: 'No',
      digitalOnboardingEligibility: 'Y',
      status: 'ACT',
    })

    expect(body.action).toBe('ADD')
    expect(body.countryCode).toBe('QA')
    expect(body.digitalOnboardingEligible).toBe('Y')
    expect(body.eipoSubscription).toBe('Y')
    expect(body.eipoAllowedNationality).toBe('N')
    expect(body.status).toBe('ACT')
  })

  it('renders INACTIVE chip for IAC status', () => {
    const { container } = render(<StatusChip status="IAC" />)
    const chip = container.querySelector('.ui-status-chip')
    expect(chip).toBeInTheDocument()
    expect(chip.textContent).toBe('INACTIVE')
  })
})
