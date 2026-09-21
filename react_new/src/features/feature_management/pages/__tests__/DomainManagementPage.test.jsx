import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GenericCrudForm from '@/features/common/crud/GenericCrudForm'
import { StatusChip } from '@/components/ui'
import service from '../../services/domainService'

describe('DomainManagement form, validations, and service tests', () => {
  const fields = [
    {
      key: 'domainId',
      label: 'Domain',
      required: true,
      lockOnEdit: true,
      capsOnly: true,
      maxLength: 30,
      placeholder: 'Enter Domain',
      helperText: 'Caps only allowed',
      requiredMessage: 'Please enter Domain',
    },
    {
      key: 'domainDesc',
      label: 'Domain Description',
      required: true,
      maxLength: 30,
      placeholder: 'Enter Domain Description',
      requiredMessage: 'Please enter Domain Description',
    },
    {
      key: 'priority',
      label: 'Priority',
      required: true,
      digitsOnly: true,
      maxLength: 15,
      placeholder: 'Enter Priority',
      requiredMessage: 'Please enter Priority',
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

  it('renders required asterisks, placeholders, helperText, and switch', () => {
    render(
      <GenericCrudForm
        mode="add"
        fields={fields}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    // Check required asterisks
    expect(screen.getByText('Domain')).toBeInTheDocument()
    expect(screen.getByText('Domain Description')).toBeInTheDocument()
    expect(screen.getByText('Priority')).toBeInTheDocument()

    // Placeholders
    expect(screen.getByPlaceholderText('Enter Domain')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter Domain Description')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter Priority')).toBeInTheDocument()

    // Helper text
    expect(screen.getByText(/Caps only allowed/i)).toBeInTheDocument()

    // Switch
    const statusSwitch = screen.getByRole('checkbox')
    expect(statusSwitch).toBeChecked()
  })

  it('initially disables Save button in add mode, and enables only when all required fields are filled', () => {
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

    const domainInput = screen.getByPlaceholderText('Enter Domain')
    const descInput = screen.getByPlaceholderText('Enter Domain Description')
    const priorityInput = screen.getByPlaceholderText('Enter Priority')

    // Fill domain
    fireEvent.change(domainInput, { target: { value: 'TEST' } })
    expect(saveButton).toBeDisabled()

    // Fill desc
    fireEvent.change(descInput, { target: { value: 'Test Description' } })
    expect(saveButton).toBeDisabled()

    // Fill priority
    fireEvent.change(priorityInput, { target: { value: '1' } })

    // Now all 3 are filled and valid
    expect(saveButton).not.toBeDisabled()
  })

  it('shows inline error messages when required fields are blurred while empty', () => {
    render(
      <GenericCrudForm
        mode="add"
        fields={fields}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    const domainInput = screen.getByPlaceholderText('Enter Domain')
    const descInput = screen.getByPlaceholderText('Enter Domain Description')
    const priorityInput = screen.getByPlaceholderText('Enter Priority')

    // Blur fields while empty
    fireEvent.blur(domainInput)
    expect(screen.getByText('Please enter Domain')).toBeInTheDocument()

    fireEvent.blur(descInput)
    expect(screen.getByText('Please enter Domain Description')).toBeInTheDocument()

    fireEvent.blur(priorityInput)
    expect(screen.getByText('Please enter Priority')).toBeInTheDocument()
  })

  it('displays inline error message immediately when any field value is cleared without blur after filling all fields', () => {
    render(
      <GenericCrudForm
        mode="add"
        fields={fields}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    const domainInput = screen.getByPlaceholderText('Enter Domain')
    const descInput = screen.getByPlaceholderText('Enter Domain Description')
    const priorityInput = screen.getByPlaceholderText('Enter Priority')
    const saveButton = screen.getByRole('button', { name: /Save/i })

    // 1. Enter data into all fields
    fireEvent.change(domainInput, { target: { value: 'TEST' } })
    fireEvent.change(descInput, { target: { value: 'wwwww' } })
    fireEvent.change(priorityInput, { target: { value: '10' } })

    // Save should now be enabled and no errors displayed
    expect(saveButton).not.toBeDisabled()
    expect(screen.queryByText('Please enter Domain Description')).not.toBeInTheDocument()

    // 2. Remove the data from Domain Description without blurring / clicking elsewhere
    fireEvent.change(descInput, { target: { value: '' } })
    expect(descInput.value).toBe('')

    // Inline error message MUST be displayed immediately without clicking another field
    expect(screen.getByText('Please enter Domain Description')).toBeInTheDocument()
    expect(saveButton).toBeDisabled()

    // 3. Re-enter data in Domain Description
    fireEvent.change(descInput, { target: { value: 'New Description' } })
    expect(screen.queryByText('Please enter Domain Description')).not.toBeInTheDocument()
    expect(saveButton).not.toBeDisabled()

    // 4. Remove data from Domain Id without blurring
    fireEvent.change(domainInput, { target: { value: '' } })
    expect(screen.getByText('Please enter Domain')).toBeInTheDocument()
    expect(saveButton).toBeDisabled()

    // 5. Re-enter Domain Id and clear Priority without blurring
    fireEvent.change(domainInput, { target: { value: 'DOM' } })
    expect(screen.queryByText('Please enter Domain')).not.toBeInTheDocument()
    expect(saveButton).not.toBeDisabled()

    fireEvent.change(priorityInput, { target: { value: '' } })
    expect(screen.getByText('Please enter Priority')).toBeInTheDocument()
    expect(saveButton).toBeDisabled()
  })

  it('enforces uppercase caps only for domain id and digits only for priority', () => {
    render(
      <GenericCrudForm
        mode="add"
        fields={fields}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    const domainInput = screen.getByPlaceholderText('Enter Domain')
    fireEvent.change(domainInput, { target: { value: 'abc_123' } })
    expect(domainInput.value).toBe('ABC_123')

    const priorityInput = screen.getByPlaceholderText('Enter Priority')
    fireEvent.change(priorityInput, { target: { value: 'abc123xyz' } })
    expect(priorityInput.value).toBe('123')
  })

  it('allows toggling status switch off and on and submits correct data', () => {
    let submittedForm = null
    const handleSubmit = vi.fn((data) => {
      submittedForm = data
    })

    render(
      <GenericCrudForm
        mode="add"
        fields={fields}
        onSubmit={handleSubmit}
        onClose={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByPlaceholderText('Enter Domain'), { target: { value: 'DOM' } })
    fireEvent.change(screen.getByPlaceholderText('Enter Domain Description'), {
      target: { value: 'Description' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter Priority'), { target: { value: '5' } })

    const statusSwitch = screen.getByRole('checkbox')
    expect(statusSwitch).toBeChecked()

    // Toggle off
    fireEvent.click(statusSwitch)
    expect(statusSwitch).not.toBeChecked()

    // Submit form
    const saveBtn = screen.getByRole('button', { name: /Save/i })
    expect(saveBtn).not.toBeDisabled()
    fireEvent.click(saveBtn)

    expect(handleSubmit).toHaveBeenCalled()
    expect(submittedForm.status).toBe('IAC')
  })

  it('service mapRow normalizes IAC to INACTIVE and ACT to ACTIVE', () => {
    const inactiveRow = service.mapRow({
      domainId: 'GI',
      domainDesc: 'Domain des',
      status: 'IAC',
      priority: 17,
    })
    expect(inactiveRow.status).toBe('INACTIVE')

    const activeRow = service.mapRow({
      domainId: 'MB',
      domainDesc: 'Mobile Banking',
      status: 'ACT',
      priority: 20,
    })
    expect(activeRow.status).toBe('ACTIVE')
  })

  it('renders INACTIVE chip for IAC status', () => {
    const { container } = render(<StatusChip status="IAC" />)
    const chip = container.querySelector('.ui-status-chip')
    expect(chip).toBeInTheDocument()
    expect(chip.textContent).toBe('INACTIVE')
    expect(chip).toHaveClass('tone-neutral')
  })

  it('rejects with backend description when save returns error status (e.g. Priority already exists)', async () => {
    const errorResponse = {
      status: {
        code: 'WF-P001',
        description: 'Priority is already exists Please check!',
      },
      data: null,
    }

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      text: async () => JSON.stringify(errorResponse),
    })

    await expect(
      service.save({
        domainId: 'TEST',
        domainDesc: 'Test Domain',
        priority: '1',
        status: 'ACT',
      }),
    ).rejects.toThrow('Priority is already exists Please check!')

    vi.restoreAllMocks()
  })
})
