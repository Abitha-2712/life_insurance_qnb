import { useState } from 'react'
import Box from '@/components/layout/Box/Box'
import Form from '@/components/layout/Form/Form'
import { UIButton, UIDropdown, UIInput, UISwitch, UITextArea } from '@/components/ui'
import { t } from '@/core/i18n/t'
import './GenericCrudPage.css'

/**
 * Flutter CardsForm / generic CRUD form inside showRightPanel popup.
 * Add/Edit: Discard + Save. View: read-only, no footer (close via ×).
 */
function GenericCrudForm({
  mode = 'add',
  initial = {},
  fields = [],
  onSubmit,
  onClose,
}) {
  const defaults = Object.fromEntries(
    fields.map((f) => [f.key, f.defaultValue ?? (f.type === 'status' ? 'Y' : '')]),
  )
  const [form, setForm] = useState({ ...defaults, ...initial })
  const [errors, setErrors] = useState({})
  const readOnly = mode === 'view'

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (readOnly) return
    const nextErrors = {}
    for (const f of fields) {
      if (f.required && !String(form[f.key] ?? '').trim()) {
        nextErrors[f.key] = t('Required_Field', 'This field is required')
      }
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    onSubmit?.(form)
  }

  return (
    <Box className="generic-crud-form-panel">
      <Form className="generic-crud-form" onSubmit={handleSubmit}>
        <div className="generic-crud-form-fields">
          {fields.map((f) => {
            const locked = readOnly || (mode === 'edit' && f.lockOnEdit)
            const label = t(f.labelKey || f.key, f.label || f.key)
            if (f.type === 'status' || f.type === 'select') {
              return (
                <UIDropdown
                  key={f.key}
                  label={label}
                  value={form[f.key] ?? ''}
                  enabled={!locked}
                  required={Boolean(f.required)}
                  enableSearch={f.enableSearch !== false}
                  hintText={
                    f.hintText ||
                    f.placeholder ||
                    t(`Select_${f.key}`, `Select ${f.label || f.key}`)
                  }
                  error={errors[f.key]}
                  onChange={(v) => setField(f.key, v == null ? '' : v)}
                  options={
                    f.options || [
                      { value: 'Y', label: t('Active', 'Active') },
                      { value: 'N', label: t('Inactive', 'Inactive') },
                    ]
                  }
                />
              )
            }
            if (f.type === 'switch') {
              return (
                <div key={f.key} className="generic-crud-status-row">
                  <UISwitch
                    label={label}
                    checked={form[f.key] === 'Y' || form[f.key] === true}
                    disabled={locked}
                    onChange={(checked) => setField(f.key, checked ? 'Y' : 'N')}
                  />
                </div>
              )
            }
            if (f.type === 'textarea') {
              return (
                <UITextArea
                  key={f.key}
                  label={label}
                  value={form[f.key] ?? ''}
                  readOnly={locked}
                  disabled={mode === 'edit' && f.lockOnEdit}
                  error={errors[f.key]}
                  onChange={(e) => setField(f.key, e.target.value)}
                  required={Boolean(f.required)}
                />
              )
            }
            return (
              <UIInput
                key={f.key}
                label={label}
                value={form[f.key] ?? ''}
                readOnly={locked}
                disabled={mode === 'edit' && f.lockOnEdit}
                error={errors[f.key]}
                onChange={(e) => setField(f.key, e.target.value)}
                required={Boolean(f.required)}
                inputMode={f.inputMode}
                maxLength={f.maxLength}
              />
            )
          })}
        </div>

        {!readOnly ? (
          <Box className="generic-crud-form-actions">
            <UIButton type="button" variant="outline" onClick={onClose}>
              {t('Discard', 'Discard')}
            </UIButton>
            <UIButton type="submit" variant="success">
              {t('Save', 'Save')}
            </UIButton>
          </Box>
        ) : null}
      </Form>
    </Box>
  )
}

export default GenericCrudForm
