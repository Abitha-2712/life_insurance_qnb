import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GenericCrudForm from '@/features/common/crud/GenericCrudForm'
import { StatusChip } from '@/components/ui'
import service from '../../services/transferTypeService'

describe('TransferTypePage form, validations, and service tests', () => {
  const fields = [
    {
      key: 'transferTypeKey',
      label: 'Transfer Type Key',
      required: true,
      maxLength: 200,
      placeholder: 'Enter Transfer Type Key',
      requiredMessage: 'Please enter Transfer Type Key',
    },
    {
      key: 'transferTypeValue',
      label: 'Transfer Type Value',
      required: true,
      maxLength: 200,
      placeholder: 'Enter Transfer Type Value',
      requiredMessage: 'Please enter Transfer Type Value',
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

  it('renders only 2 input fields with required asterisks, placeholders, and status toggle switch', () => {
    render(
      <GenericCrudForm
        mode="add"
        fields={fields}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    // Check required asterisks and labels
    expect(screen.getByText('Transfer Type Key')).toBeInTheDocument()
    expect(screen.getByText('Transfer Type Value')).toBeInTheDocument()

    // Placeholders
    expect(screen.getByPlaceholderText('Enter Transfer Type Key')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter Transfer Type Value')).toBeInTheDocument()

    // Status toggle switch
    const statusSwitch = screen.getByRole('checkbox')
    expect(statusSwitch).toBeInTheDocument()
    expect(statusSwitch).toBeChecked()

    // Ensure ONLY 2 text input fields exist
    const textInputs = screen.getAllByRole('textbox')
    expect(textInputs).toHaveLength(2)
  })

  it('initially disables Save button in add mode, and enables only when both required fields are filled', () => {
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

    const keyInput = screen.getByPlaceholderText('Enter Transfer Type Key')
    const valInput = screen.getByPlaceholderText('Enter Transfer Type Value')

    // Fill key only
    fireEvent.change(keyInput, { target: { value: 'DOMESTIC' } })
    expect(saveButton).toBeDisabled()

    // Fill value
    fireEvent.change(valInput, { target: { value: 'Domestic Transfer' } })
    expect(saveButton).not.toBeDisabled()
  })

  it('displays inline error message immediately when any field value is cleared without blur', () => {
    render(
      <GenericCrudForm
        mode="add"
        fields={fields}
        onSubmit={vi.fn()}
        onClose={vi.fn()}
      />,
    )

    const keyInput = screen.getByPlaceholderText('Enter Transfer Type Key')
    const valInput = screen.getByPlaceholderText('Enter Transfer Type Value')
    const saveButton = screen.getByRole('button', { name: /Save/i })

    // 1. Enter data into both fields
    fireEvent.change(keyInput, { target: { value: 'TEST_KEY' } })
    fireEvent.change(valInput, { target: { value: 'Test Value' } })

    expect(saveButton).not.toBeDisabled()
    expect(screen.queryByText('Please enter Transfer Type Key')).not.toBeInTheDocument()
    expect(screen.queryByText('Please enter Transfer Type Value')).not.toBeInTheDocument()

    // 2. Clear Transfer Type Key without blur
    fireEvent.change(keyInput, { target: { value: '' } })
    expect(keyInput.value).toBe('')

    // Inline error message appears immediately
    expect(screen.getByText('Please enter Transfer Type Key')).toBeInTheDocument()
    expect(saveButton).toBeDisabled()

    // 3. Re-enter Key and clear Value without blur
    fireEvent.change(keyInput, { target: { value: 'VALID_KEY' } })
    expect(screen.queryByText('Please enter Transfer Type Key')).not.toBeInTheDocument()
    expect(saveButton).not.toBeDisabled()

    fireEvent.change(valInput, { target: { value: '' } })
    expect(valInput.value).toBe('')
    expect(screen.getByText('Please enter Transfer Type Value')).toBeInTheDocument()
    expect(saveButton).toBeDisabled()
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

    fireEvent.change(screen.getByPlaceholderText('Enter Transfer Type Key'), {
      target: { value: 'INTERNAL' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter Transfer Type Value'), {
      target: { value: 'Internal Transfer' },
    })

    const statusSwitch = screen.getByRole('checkbox')
    expect(statusSwitch).toBeChecked()

    // Toggle off (Inactive)
    fireEvent.click(statusSwitch)
    expect(statusSwitch).not.toBeChecked()

    const saveBtn = screen.getByRole('button', { name: /Save/i })
    expect(saveBtn).not.toBeDisabled()
    fireEvent.click(saveBtn)

    expect(handleSubmit).toHaveBeenCalled()
    expect(submittedForm.status).toBe('IAC')
    expect(submittedForm.transferTypeKey).toBe('INTERNAL')
    expect(submittedForm.transferTypeValue).toBe('Internal Transfer')
  })

  it('service mapRow normalizes IAC to INACTIVE and ACT to ACTIVE', () => {
    const inactiveRow = service.mapRow({
      id: 10,
      transferTypeKey: 'Total transfer',
      transferTypeValue: 'Total type transfer',
      status: 'IAC',
    })
    expect(inactiveRow.status).toBe('INACTIVE')

    const activeRow = service.mapRow({
      id: 11,
      transferTypeKey: 'Zakat',
      transferTypeValue: 'Zakat',
      status: 'ACT',
    })
    expect(activeRow.status).toBe('ACTIVE')
  })

  it('service rejects with backend description when save returns business error status', async () => {
    const errorResponse = {
      status: {
        code: 'WF-T001',
        description: 'Transfer Type Key is already exists Please check!',
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
        transferTypeKey: 'DUPLICATE',
        transferTypeValue: 'Duplicate Transfer',
        status: 'ACT',
      }),
    ).rejects.toThrow('Transfer Type Key is already exists Please check!')

    vi.restoreAllMocks()
  })
})
