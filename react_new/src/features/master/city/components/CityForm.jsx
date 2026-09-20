import { useState } from 'react'
import Box from '@/components/layout/Box/Box'
import Form from '@/components/layout/Form/Form'
import { UIButton, UIInput, UISwitch } from '@/components/ui'
import { t } from '@/core/i18n/t'
import './CityForm.css'

const empty = {
  cityNameEnglish: '',
  cityNameArabic: '',
  status: 'Y',
}

function CityForm({ mode = 'add', initial, onSubmit, onClose }) {
  const [form, setForm] = useState({ ...empty, ...initial })
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
    const en = String(form.cityNameEnglish || '').trim()
    if (!en) {
      nextErrors.cityNameEnglish = t('Please_enter_City_Name_English', 'Please enter City Name (English)')
    } else if (en.length > 150) {
      nextErrors.cityNameEnglish = t('Max_150', 'City Name (English) cannot exceed 150 characters')
    }
    const ar = String(form.cityNameArabic || '').trim()
    if (ar.length > 150) {
      nextErrors.cityNameArabic = t('Max_150_ar', 'City Name (Arabic) cannot exceed 150 characters')
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    onSubmit?.({
      ...form,
      cityNameEnglish: en,
      cityNameArabic: ar,
      status: form.status === 'Y' || form.status === true ? 'Y' : 'N',
    })
  }

  return (
    <Box className="city-form-panel">
      <Form className="city-form" onSubmit={handleSubmit}>
        <UIInput
          label={t('City_Name_English', 'City Name (English)')}
          value={form.cityNameEnglish}
          readOnly={readOnly}
          error={errors.cityNameEnglish}
          onChange={(e) => setField('cityNameEnglish', e.target.value)}
          required
        />
        <UIInput
          label={t('City_Name_Arabic', 'City Name (Arabic)')}
          value={form.cityNameArabic}
          readOnly={readOnly}
          error={errors.cityNameArabic}
          onChange={(e) => setField('cityNameArabic', e.target.value)}
        />
        <UISwitch
          label={t('Active', 'Active')}
          checked={form.status === 'Y' || form.status === true}
          disabled={readOnly}
          onChange={(checked) => setField('status', checked ? 'Y' : 'N')}
        />
        <Box className="city-form-actions">
          <UIButton type="button" variant="outline" onClick={onClose}>
            {t('Close', 'Close')}
          </UIButton>
          {!readOnly ? (
            <UIButton type="submit" variant="primary">
              {t('Save', 'Save')}
            </UIButton>
          ) : null}
        </Box>
      </Form>
    </Box>
  )
}

export default CityForm
