import { useMemo, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import Form from '@/components/layout/Form/Form'
import { UIButton, UIDropdown, UIInput, UISwitch, UITextArea } from '@/components/ui'
import { t } from '@/core/i18n/t'
import './GenericCrudPage.css'

function isActiveStatus(status) {
  const s = String(status || '')
    .toUpperCase()
    .trim()
  return ['Y', 'YES', 'ACT', 'ACTIVE', '1', 'TRUE', 'ENABLED'].includes(s)
}

function filterFieldValue(f, rawVal) {
  let nextVal = rawVal
  if (f.capsOnly || f.uppercase) {
    nextVal = String(nextVal || '').toUpperCase().replace(/[^A-Z0-9_]/g, '')
  } else if (f.digitsOnly) {
    nextVal = String(nextVal || '').replace(/[^0-9]/g, '')
  } else if (f.arabicOnly) {
    nextVal = String(nextVal || '').replace(/[^\u0600-\u06FF\s]/g, '')
  } else if (f.allowPattern instanceof RegExp) {
    const str = String(nextVal || '')
    let filtered = ''
    for (const ch of str) {
      if (f.allowPattern.test(filtered + ch)) filtered += ch
    }
    nextVal = filtered
  }
  if (f.maxLength != null) {
    nextVal = String(nextVal || '').slice(0, f.maxLength)
  }
  return nextVal
}

function validateField(f, value, form = {}) {
  const valStr = String(value ?? '').trim()
  if (f.required && !valStr) {
    const fieldName = (f.label || f.key).replace(/\*$/, '')
    if (f.type === 'select' || f.type === 'status') {
      return f.requiredMessage || t('Please_select_value', `Please select ${fieldName}`)
    }
    return f.requiredMessage || t(`Please_enter_${f.key}`, `Please enter ${fieldName}`)
  }
  if (f.capsOnly && value && /[^A-Z0-9_]/.test(String(value))) {
    return t('Caps_only_allowed', 'Caps only allowed')
  }
  if (f.digitsOnly && value && /[^0-9]/.test(String(value))) {
    return t('Digits_only_allowed', 'Please enter valid number')
  }
  if (f.maxLength && String(value || '').length > f.maxLength) {
    return t('Max_length_exceeded', `${f.label || f.key} cannot exceed ${f.maxLength} characters`)
  }
  if (typeof f.validate === 'function') {
    return f.validate(value, form) || ''
  }
  return ''
}

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
    fields.map((f) => [
      f.key,
      f.defaultValue ??
        (f.type === 'status'
          ? 'Y'
          : f.type === 'switch' || f.type === 'toggle'
            ? (f.activeValue || 'ACT')
            : ''),
    ]),
  )
  const [form, setForm] = useState({ ...defaults, ...initial })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const readOnly = mode === 'view'

  function handleFieldChange(f, rawVal) {
    const nextVal = filterFieldValue(f, rawVal)
    const nextForm = { ...form, [f.key]: nextVal }
    const err = validateField(f, nextVal, nextForm)
    setTouched((prev) => ({ ...prev, [f.key]: true }))
    setForm((prev) => ({ ...prev, [f.key]: nextVal }))
    setErrors((prevErr) => ({ ...prevErr, [f.key]: err }))
  }

  function handleFieldBlur(f) {
    setTouched((prev) => ({ ...prev, [f.key]: true }))
    const err = validateField(f, form[f.key], form)
    setErrors((prev) => ({ ...prev, [f.key]: err }))
  }

  const isSaveEnabled = useMemo(() => {
    if (readOnly) return false
    for (const f of fields) {
      if (f.required && !String(form[f.key] ?? '').trim()) {
        return false
      }
      const err = validateField(f, form[f.key], form)
      if (err) return false
    }
    return true
  }, [fields, form, readOnly])

  function handleSubmit(event) {
    event.preventDefault()
    if (readOnly || !isSaveEnabled) return
    const nextErrors = {}
    const allTouched = {}
    for (const f of fields) {
      allTouched[f.key] = true
      const err = validateField(f, form[f.key], form)
      if (err) nextErrors[f.key] = err
    }
    setTouched(allTouched)
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
                  required={Boolean(f.required || f.showRequiredStar)}
                  enableSearch={f.enableSearch !== false}
                  hintText={
                    f.hintText ||
                    f.placeholder ||
                    t(`Select_${f.key}`, `Select ${f.label || f.key}`)
                  }
                  error={errors[f.key]}
                  onChange={(v) => handleFieldChange(f, v == null ? '' : v)}
                  options={
                    f.options || [
                      { value: 'Y', label: t('Active', 'Active') },
                      { value: 'N', label: t('Inactive', 'Inactive') },
                    ]
                  }
                />
              )
            }
            if (f.type === 'switch' || f.type === 'toggle') {
              const isChecked = isActiveStatus(form[f.key])
              return (
                <div key={f.key} className="generic-crud-status-row">
                  <UISwitch
                    label={label}
                    labelPosition={f.labelPosition || 'left'}
                    checked={isChecked}
                    disabled={locked}
                    onChange={(checked) => {
                      const activeVal =
                        f.activeValue ||
                        (form[f.key] === 'Y' || form[f.key] === 'N' ? 'Y' : 'ACT')
                      const inactiveVal =
                        f.inactiveValue ||
                        (form[f.key] === 'Y' || form[f.key] === 'N' ? 'N' : 'IAC')
                      handleFieldChange(f, checked ? activeVal : inactiveVal)
                    }}
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
                  placeholder={f.placeholder || f.hintText}
                  onChange={(e) => handleFieldChange(f, e.target.value)}
                  onBlur={() => handleFieldBlur(f)}
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
                placeholder={f.placeholder || f.hintText}
                helperText={f.helperText}
                onChange={(e) => handleFieldChange(f, e.target.value)}
                onBlur={() => handleFieldBlur(f)}
                required={Boolean(f.required)}
                showRequiredStar={Boolean(f.showRequiredStar)}
                inputMode={f.inputMode || (f.digitsOnly ? 'numeric' : undefined)}
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
            <UIButton type="submit" variant="success" disabled={!isSaveEnabled}>
              {t('Save', 'Save')}
            </UIButton>
          </Box>
        ) : null}
      </Form>
    </Box>
  )
}

export default GenericCrudForm
