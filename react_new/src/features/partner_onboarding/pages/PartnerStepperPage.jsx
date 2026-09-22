import { useMemo, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import Form from '@/components/layout/Form/Form'
import {
  UIButton,
  UICard,
  UIInput,
  UIDropdown,
  UIText,
  UITextArea,
  useToast,
} from '@/components/ui'
import { t } from '@/core/i18n/t'
import {
  createPartner,
  savePartnerMapping,
  savePartnerSecurity,
  savePartnerUser,
  confirmPartner,
  fetchPartnerProducts,
} from '../services/partner_onboardingService'
import '@/features/common/crud/GenericCrudPage.css'
import './PartnerStepperPage.css'

const STEPS = [
  { key: 'profile', label: 'Partner Profile' },
  { key: 'products', label: 'Products & Mapping' },
  { key: 'security', label: 'Security' },
  { key: 'users', label: 'Users' },
  { key: 'confirm', label: 'Confirmation' },
]

const empty = {
  partnerCode: '',
  partnerName: '',
  partnerNameAr: '',
  email: '',
  phone: '',
  status: 'Y',
  productIds: '',
  tokenType: 'oauth',
  volumeLimit: '',
  userName: '',
  userEmail: '',
  userRole: 'PARTNER_ADMIN',
  notes: '',
}

export default function PartnerStepperPage() {
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ ...empty })
  const [partnerId, setPartnerId] = useState(null)
  const [products, setProducts] = useState([])
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const setField = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }))
    setErrors((p) => ({ ...p, [k]: '' }))
  }

  const stepMeta = STEPS[step]
  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step])

  async function loadProducts() {
    try {
      const res = await fetchPartnerProducts()
      const list = Array.isArray(res?.data) ? res.data : []
      setProducts(list)
    } catch {
      setProducts([{ id: 'P1', name: 'Payments' }, { id: 'P2', name: 'Transfers' }])
    }
  }

  function validateStep() {
    const next = {}
    if (step === 0) {
      if (!String(form.partnerCode).trim()) next.partnerCode = t('Required_Field', 'This field is required')
      if (!String(form.partnerName).trim()) next.partnerName = t('Required_Field', 'This field is required')
    }
    if (step === 3) {
      if (!String(form.userName).trim()) next.userName = t('Required_Field', 'This field is required')
      if (!String(form.userEmail).trim()) next.userEmail = t('Required_Field', 'This field is required')
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleNext() {
    if (!validateStep()) return
    setSaving(true)
    try {
      if (step === 0) {
        const res = await createPartner({
          partnerCode: form.partnerCode,
          partnerName: form.partnerName,
          partnerNameAr: form.partnerNameAr,
          email: form.email,
          phone: form.phone,
          status: form.status,
        })
        const id = res?.partnerId || res?.data?.partnerId || form.partnerCode
        setPartnerId(id)
        await loadProducts()
      } else if (step === 1) {
        await savePartnerMapping({
          partnerId,
          productIds: String(form.productIds || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          volumeLimit: form.volumeLimit,
        })
      } else if (step === 2) {
        await savePartnerSecurity({ partnerId, tokenType: form.tokenType })
      } else if (step === 3) {
        await savePartnerUser({
          partnerId,
          userName: form.userName,
          userEmail: form.userEmail,
          userRole: form.userRole,
        })
      }
      setStep((s) => Math.min(s + 1, STEPS.length - 1))
    } catch (err) {
      toast.error(err?.message || t('Save_failed', 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  async function handleConfirm() {
    setSaving(true)
    try {
      await confirmPartner(partnerId || form.partnerCode, { notes: form.notes })
      toast.success(t('Partner_created', 'Partner created successfully'))
      setForm({ ...empty })
      setPartnerId(null)
      setStep(0)
    } catch (err) {
      toast.error(err?.message || t('Save_failed', 'Save failed'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box className="partner-stepper-page">
      <Box className="partner-stepper-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('Partner_Onboarding', 'Partner Onboarding')}
        </UIText>
        <UIText variant="b13Regular" className="partner-stepper-subtitle">
          {t('Partner_Stepper_Hint', 'Multi-step partner setup (Flutter partner_stepper parity)')}
        </UIText>
      </Box>

      <UICard className="partner-stepper-card">
        <Box className="partner-stepper-progress" aria-hidden="true">
          <Box className="partner-stepper-progress-bar" style={{ width: `${progress}%` }} />
        </Box>
        <Box className="partner-stepper-steps">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              className={`partner-stepper-chip${i === step ? ' is-active' : ''}${i < step ? ' is-done' : ''}`}
              onClick={() => i <= step && setStep(i)}
            >
              <span className="partner-stepper-chip-num">{i + 1}</span>
              {t(`Partner_Step_${s.key}`, s.label)}
            </button>
          ))}
        </Box>

        <Form className="generic-crud-form partner-stepper-form" onSubmit={(e) => e.preventDefault()}>
          {step === 0 ? (
            <>
              <UIInput
                label={t('Partner_Code', 'Partner Code')}
                value={form.partnerCode}
                required
                error={errors.partnerCode}
                onChange={(e) => setField('partnerCode', e.target.value)}
              />
              <UIInput
                label={t('Partner_Name', 'Partner Name (English)')}
                value={form.partnerName}
                required
                error={errors.partnerName}
                onChange={(e) => setField('partnerName', e.target.value)}
              />
              <UIInput
                label={t('Partner_Name_Ar', 'Partner Name (Arabic)')}
                value={form.partnerNameAr}
                onChange={(e) => setField('partnerNameAr', e.target.value)}
              />
              <UIInput
                label={t('Email', 'Email')}
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
              />
              <UIInput
                label={t('Phone', 'Phone')}
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
              />
              <UIDropdown
                label={t('Status', 'Status')}
                value={form.status}
                onChange={(v) => setField('status', v)}
                options={[
                  { value: 'Y', label: t('Active', 'Active') },
                  { value: 'N', label: t('Inactive', 'Inactive') },
                ]}
              />
            </>
          ) : null}

          {step === 1 ? (
            <>
              <UIInput
                label={t('Product_Ids', 'Product IDs (comma-separated)')}
                value={form.productIds}
                onChange={(e) => setField('productIds', e.target.value)}
                placeholder={products.map((p) => p.id || p.productId || p.code).filter(Boolean).join(', ') || 'P1,P2'}
              />
              <UIInput
                label={t('Volume_Limit', 'Volume Limit')}
                value={form.volumeLimit}
                onChange={(e) => setField('volumeLimit', e.target.value)}
              />
              {products.length ? (
                <UIText variant="b12Regular">
                  {t('Available_Products', 'Available')}:{' '}
                  {products.map((p) => p.name || p.productName || p.id).join(', ')}
                </UIText>
              ) : null}
            </>
          ) : null}

          {step === 2 ? (
            <UIDropdown
              label={t('Token_Type', 'Token Type')}
              value={form.tokenType}
              onChange={(v) => setField('tokenType', v)}
              options={[
                { value: 'oauth', label: 'OAuth' },
                { value: 'api_key', label: 'API Key' },
                { value: 'mtls', label: 'mTLS' },
              ]}
            />
          ) : null}

          {step === 3 ? (
            <>
              <UIInput
                label={t('User_Name', 'User Name')}
                value={form.userName}
                required
                error={errors.userName}
                onChange={(e) => setField('userName', e.target.value)}
              />
              <UIInput
                label={t('User_Email', 'User Email')}
                value={form.userEmail}
                required
                error={errors.userEmail}
                onChange={(e) => setField('userEmail', e.target.value)}
              />
              <UIDropdown
                label={t('User_Role', 'User Role')}
                value={form.userRole}
                onChange={(v) => setField('userRole', v)}
                options={[
                  { value: 'PARTNER_ADMIN', label: 'Partner Admin' },
                  { value: 'PARTNER_USER', label: 'Partner User' },
                ]}
              />
            </>
          ) : null}

          {step === 4 ? (
            <>
              <UIText variant="b14Regular">
                {t('Confirm_Partner', 'Review and confirm partner')}{' '}
                <strong>{form.partnerName || partnerId}</strong> ({form.partnerCode})
              </UIText>
              <UITextArea
                label={t('Notes', 'Notes')}
                value={form.notes}
                onChange={(e) => setField('notes', e.target.value)}
              />
            </>
          ) : null}

          <Box className="generic-crud-form-actions partner-stepper-actions">
            <UIButton
              type="button"
              variant="outline"
              disabled={step === 0 || saving}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
            >
              {t('Back', 'Back')}
            </UIButton>
            {step < STEPS.length - 1 ? (
              <UIButton type="button" variant="primary" disabled={saving} onClick={handleNext}>
                {saving ? t('Saving', 'Saving…') : t('Next', 'Next')}
              </UIButton>
            ) : (
              <UIButton type="button" variant="primary" disabled={saving} onClick={handleConfirm}>
                {saving ? t('Saving', 'Saving…') : t('Confirm', 'Confirm')}
              </UIButton>
            )}
          </Box>
        </Form>
        <UIText variant="b12Regular" className="partner-stepper-step-label">
          {stepMeta.label} ({step + 1}/{STEPS.length})
        </UIText>
      </UICard>
    </Box>
  )
}
