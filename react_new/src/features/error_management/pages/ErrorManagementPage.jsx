import { useCallback, useEffect, useMemo, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import Form from '@/components/layout/Form/Form'
import {
  RowActionType,
  StatusChip,
  UIAddButton,
  UIButton,
  UICard,
  UIDataTable,
  UIDialog,
  UIDropdown,
  UIInput,
  UILoader,
  UIPdfExcelDownload,
  UIRightPanel,
  UISummaryStatusRow,
  UIText,
  UITextArea,
  rowAction,
  useToast,
} from '@/components/ui'
import { t } from '@/core/i18n/t'
import { useCrudList } from '@/features/common/crud/useCrudList'
import service, {
  fetchChannels,
  fetchErrorProviders,
  fetchErrorTypes,
  searchErrors,
} from '../services/error_managementService'
import '@/features/common/crud/GenericCrudPage.css'
import './ErrorManagementPage.css'

function ErrorForm({
  mode,
  initial,
  onSubmit,
  onClose,
  typeOptions,
  providerOptions,
  channelOptions,
}) {
  const [form, setForm] = useState({
    mwErrCode: '',
    ocsErrCode: '',
    title: '',
    provider: '',
    channelId: '',
    lang: 'en',
    serviceType: '',
    errDesc: '',
    mwErrDesc: '',
    status: 'Y',
    ...initial,
    lang:
      String(initial?.lang || initial?.language || 'en')
        .toLowerCase()
        .startsWith('ar')
        ? 'ar'
        : 'en',
    channelId: initial?.channelId || initial?.channel || '',
  })
  const [errors, setErrors] = useState({})
  const readOnly = mode === 'view'
  const setField = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }))
    setErrors((p) => ({ ...p, [k]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (readOnly) return
    const next = {}
    if (!String(form.mwErrCode || '').trim()) next.mwErrCode = t('Required_Field', 'This field is required')
    if (!String(form.ocsErrCode || '').trim()) next.ocsErrCode = t('Required_Field', 'This field is required')
    if (!String(form.title || '').trim()) next.title = t('Required_Field', 'This field is required')
    if (!String(form.provider || '').trim()) next.provider = t('Required_Field', 'This field is required')
    if (!String(form.channelId || '').trim()) next.channelId = t('Required_Field', 'This field is required')
    if (!String(form.serviceType || '').trim()) next.serviceType = t('Required_Field', 'This field is required')
    if (!String(form.errDesc || '').trim()) next.errDesc = t('Required_Field', 'This field is required')
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    onSubmit?.(form)
  }

  return (
    <Form className="generic-crud-form error-mgmt-form" onSubmit={handleSubmit}>
      <UIInput
        label={t('MW_Error_Code', 'MW Error Code')}
        value={form.mwErrCode}
        readOnly={readOnly || mode === 'edit'}
        error={errors.mwErrCode}
        onChange={(e) => setField('mwErrCode', e.target.value)}
        required
      />
      <UIInput
        label={t('OCS_Error_Code', 'OCS Error Code')}
        value={form.ocsErrCode}
        readOnly={readOnly}
        error={errors.ocsErrCode}
        onChange={(e) => setField('ocsErrCode', e.target.value)}
        required
      />
      <UIInput
        label={t('Title', 'Title')}
        value={form.title}
        readOnly={readOnly}
        error={errors.title}
        onChange={(e) => setField('title', e.target.value)}
        required
      />
      <UIDropdown
        label={t('Provider', 'Provider')}
        value={form.provider}
        disabled={readOnly}
        readOnly={readOnly}
        error={errors.provider}
        onChange={(v) => setField('provider', v)}
        options={
          providerOptions.length
            ? providerOptions
            : [{ value: form.provider || '', label: form.provider || '—' }]
        }
      />
      <UIDropdown
        label={t('Channel', 'Channel')}
        value={form.channelId}
        disabled={readOnly}
        readOnly={readOnly}
        error={errors.channelId}
        onChange={(v) => setField('channelId', v)}
        options={
          channelOptions.length
            ? channelOptions
            : [{ value: form.channelId || '', label: form.channelId || '—' }]
        }
      />
      <UIDropdown
        label={t('Language', 'Language')}
        value={form.lang}
        disabled={readOnly}
        readOnly={readOnly}
        onChange={(v) => setField('lang', v)}
        options={[
          { value: 'en', label: t('English', 'English') },
          { value: 'ar', label: t('Arabic', 'Arabic') },
        ]}
      />
      <UIDropdown
        label={t('Error_Type', 'Error Type')}
        value={form.serviceType}
        disabled={readOnly}
        readOnly={readOnly}
        error={errors.serviceType}
        onChange={(v) => setField('serviceType', v)}
        options={
          typeOptions.length
            ? typeOptions
            : [{ value: form.serviceType || '', label: form.serviceType || '—' }]
        }
      />
      <UITextArea
        label={t('Description', 'Description')}
        value={form.errDesc}
        readOnly={readOnly}
        error={errors.errDesc}
        onChange={(e) => setField('errDesc', e.target.value)}
      />
      <UITextArea
        label={t('MW_Error_Description', 'MW Error Description')}
        value={form.mwErrDesc}
        readOnly={readOnly}
        onChange={(e) => setField('mwErrDesc', e.target.value)}
      />
      <UIDropdown
        label={t('Status', 'Status')}
        value={form.status}
        disabled={readOnly}
        readOnly={readOnly}
        onChange={(v) => setField('status', v)}
        options={[
          { value: 'Y', label: t('Active', 'Active') },
          { value: 'N', label: t('Inactive', 'Inactive') },
        ]}
      />
      <Box className="generic-crud-form-actions">
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
  )
}

/** Flutter ErrorManagementTablePage */
export default function ErrorManagementPage() {
  const { rows, setRows, loading, error, upsert, remove, softFetch } = useCrudList(service)
  const toast = useToast()
  const [panel, setPanel] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeOptions, setTypeOptions] = useState([])
  const [providerOptions, setProviderOptions] = useState([])
  const [channelOptions, setChannelOptions] = useState([])
  const [filterCode, setFilterCode] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterLang, setFilterLang] = useState('')
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [types, providers, channels] = await Promise.all([
        fetchErrorTypes().catch(() => []),
        fetchErrorProviders().catch(() => []),
        fetchChannels().catch(() => []),
      ])
      if (cancelled) return
      setTypeOptions(types)
      setProviderOptions(providers)
      setChannelOptions(channels)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const channelLabel = useCallback(
    (channelId) => {
      const ids = String(channelId || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      if (!ids.length) return ''
      return ids
        .map((id) => channelOptions.find((c) => c.value === id)?.label || id)
        .join(', ')
    },
    [channelOptions],
  )

  const columns = useMemo(
    () => [
      { key: 'ocsErrCode', label: t('OCS_Error_Code', 'OCS Error Code') },
      { key: 'mwErrCode', label: t('MW_Error_Code', 'MW Error Code') },
      { key: 'provider', label: t('Provider', 'Provider') },
      {
        key: 'channelId',
        label: t('Channel', 'Channel'),
        render: (row) => channelLabel(row.channelId),
      },
      { key: 'title', label: t('Title', 'Title') },
      {
        key: 'lang',
        label: t('Language', 'Language'),
        render: (row) =>
          String(row.lang || '').toLowerCase() === 'ar'
            ? t('Arabic', 'Arabic')
            : t('English', 'English'),
      },
      { key: 'errDesc', label: t('Description', 'Description') },
      { key: 'mwErrDesc', label: t('MW_Error_Description', 'MW Error Description') },
      { key: 'serviceType', label: t('Error_Type', 'Error Type') },
      {
        key: 'status',
        label: t('Status', 'Status'),
        statusChip: true,
        render: (row) => <StatusChip status={row.status} />,
      },
    ],
    [channelLabel],
  )

  const isActive = (s) => ['Y', 'YES', 'ACT', 'ACTIVE'].includes(String(s || '').toUpperCase())
  const activeCount = useMemo(() => rows.filter((r) => isActive(r.status)).length, [rows])
  const filtered = useMemo(() => {
    if (statusFilter === 'active') return rows.filter((r) => isActive(r.status))
    if (statusFilter === 'inactive') return rows.filter((r) => !isActive(r.status))
    return rows
  }, [rows, statusFilter])

  const applySearch = useCallback(async () => {
    setSearching(true)
    try {
      if (!filterCode && !filterType && !filterLang) {
        await softFetch()
        return
      }
      const list = await searchErrors({
        errorCode: filterCode,
        errorType: filterType,
        lang: filterLang,
      })
      setRows(list)
    } catch (err) {
      toast.error(err?.message || t('Search_failed', 'Search failed'))
    } finally {
      setSearching(false)
    }
  }, [filterCode, filterType, filterLang, softFetch, setRows, toast])

  const clearSearch = useCallback(async () => {
    setFilterCode('')
    setFilterType('')
    setFilterLang('')
    setStatusFilter('all')
    await softFetch()
  }, [softFetch])

  async function handleSave(form) {
    try {
      await upsert(form)
      toast.success(t('Saved_successfully', 'Saved successfully'))
      setPanel(null)
    } catch (err) {
      toast.error(err?.message || t('Save_failed', 'Save failed'))
    }
  }

  return (
    <Box className="generic-crud-page error-management-page">
      <Box className="generic-crud-page-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('Error_Management', 'Error Management')}
        </UIText>
        <UIAddButton
          label={t('Add_Error', 'Add Error')}
          onClick={() => setPanel({ mode: 'add' })}
        />
      </Box>

      <Box className="error-mgmt-filters">
        <UIInput
          label={t('Error_Code', 'Error Code')}
          value={filterCode}
          onChange={(e) => setFilterCode(e.target.value)}
          placeholder={t('Enter_Error_Code', 'Enter error code')}
        />
        <UIDropdown
          label={t('Error_Type', 'Error Type')}
          value={filterType}
          onChange={setFilterType}
          options={[{ value: '', label: t('All', 'All') }, ...typeOptions]}
        />
        <UIDropdown
          label={t('Language', 'Language')}
          value={filterLang}
          onChange={setFilterLang}
          options={[
            { value: '', label: t('All', 'All') },
            { value: 'en', label: t('English', 'English') },
            { value: 'ar', label: t('Arabic', 'Arabic') },
          ]}
        />
        <Box className="error-mgmt-filter-actions">
          <UIButton type="button" variant="primary" onClick={applySearch} disabled={searching}>
            {t('Search', 'Search')}
          </UIButton>
          <UIButton type="button" variant="outline" onClick={clearSearch}>
            {t('Clear', 'Clear')}
          </UIButton>
        </Box>
      </Box>

      <UISummaryStatusRow
        totalCount={rows.length}
        activeCount={activeCount}
        inactiveCount={rows.length - activeCount}
        totalLabel={t('Total_Errors', 'Total Errors')}
        activeLabel={t('Active_Errors', 'Active Errors')}
        inactiveLabel={t('Inactive_Errors', 'Inactive Errors')}
        value={statusFilter}
        onChange={setStatusFilter}
      />

      <Box className="generic-crud-export">
        <UIPdfExcelDownload
          title={t('List_of_Error_Management', 'List of Error Management')}
          columns={columns}
          data={filtered}
          pdfFileName="error_management.pdf"
          excelFileName="error_management.xlsx"
        />
      </Box>

      <UICard>
        {loading || searching ? <UILoader label={t('Loading', 'Loading…')} /> : null}
        {error ? (
          <UIText variant="b14Regular" className="generic-crud-page-error">
            {error}
          </UIText>
        ) : null}
        <UIDataTable
          title={t('List_of_Error_Management', 'List of Error Management')}
          columns={columns}
          rows={filtered}
          rowKey="id"
          rowActions={[
            rowAction(RowActionType.view),
            rowAction(RowActionType.modify),
            rowAction(RowActionType.delete),
          ]}
          onView={(row) => setPanel({ mode: 'view', row })}
          onModify={(row) => setPanel({ mode: 'edit', row })}
          onDelete={(row) => setDeleteTarget(row)}
        />
      </UICard>

      <UIRightPanel
        open={Boolean(panel)}
        title={
          panel?.mode === 'edit'
            ? t('Edit_Error', 'Edit Error')
            : panel?.mode === 'view'
              ? t('View_Error', 'View Error')
              : t('Add_Error', 'Add Error')
        }
        onClose={() => setPanel(null)}
      >
        {panel ? (
          <ErrorForm
            key={`${panel.mode}-${panel.row?.id || 'new'}`}
            mode={panel.mode}
            initial={panel.row}
            onClose={() => setPanel(null)}
            onSubmit={handleSave}
            typeOptions={typeOptions}
            providerOptions={providerOptions}
            channelOptions={channelOptions}
          />
        ) : null}
      </UIRightPanel>

      <UIDialog
        open={Boolean(deleteTarget)}
        title={t('Delete_Error', 'Delete Error')}
        message={t('Delete_confirm', 'Are you sure you want to delete this record? This action cannot be undone.')}
        confirmLabel={t('Delete', 'Delete')}
        cancelLabel={t('Cancel', 'Cancel')}
        tone="danger"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          try {
            await remove(deleteTarget.id, deleteTarget)
            toast.success(t('Deleted_successfully', 'Deleted successfully'))
            setDeleteTarget(null)
          } catch (err) {
            toast.error(err?.message || t('Delete_failed', 'Delete failed'))
          }
        }}
      />
    </Box>
  )
}
