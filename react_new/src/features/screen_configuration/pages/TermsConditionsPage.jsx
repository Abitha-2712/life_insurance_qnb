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
  fetchTncSummary,
  fetchUnits,
} from '../services/termsConditionsService'
import '@/features/common/crud/GenericCrudPage.css'
import './TermsConditionsPage.css'

function TncForm({ mode, initial, onSubmit, onClose, unitOptions, channelOptions }) {
  const [form, setForm] = useState({
    unitId: '',
    channelId: '',
    moduleId: '',
    subModuleId: '',
    screenId: '',
    tcUrlId: '',
    tcUrlEn: '',
    tcUrlAr: '',
    description: '',
    remarks: '',
    status: 'Y',
    ...initial,
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
    if (!String(form.unitId || '').trim()) next.unitId = t('Required_Field', 'This field is required')
    if (!String(form.channelId || '').trim()) next.channelId = t('Required_Field', 'This field is required')
    if (!String(form.moduleId || '').trim()) next.moduleId = t('Required_Field', 'This field is required')
    if (!String(form.tcUrlEn || '').trim()) next.tcUrlEn = t('Required_Field', 'This field is required')
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    onSubmit?.(form)
  }

  return (
    <Form className="generic-crud-form tnc-form" onSubmit={handleSubmit}>
      <UIDropdown
        label={t('Unit', 'Unit')}
        value={form.unitId}
        disabled={readOnly}
        readOnly={readOnly}
        error={errors.unitId}
        onChange={(v) => setField('unitId', v)}
        options={unitOptions.length ? unitOptions : [{ value: form.unitId || '', label: form.unitId || '—' }]}
      />
      <UIDropdown
        label={t('Channel', 'Channel')}
        value={form.channelId}
        disabled={readOnly}
        readOnly={readOnly}
        error={errors.channelId}
        onChange={(v) => setField('channelId', v)}
        options={channelOptions.length ? channelOptions : [{ value: form.channelId || '', label: form.channelId || '—' }]}
      />
      <UIInput
        label={t('Module', 'Module')}
        value={form.moduleId}
        readOnly={readOnly}
        error={errors.moduleId}
        onChange={(e) => setField('moduleId', e.target.value)}
        required
      />
      <UIInput
        label={t('Sub_Module', 'Sub-Module')}
        value={form.subModuleId}
        readOnly={readOnly}
        onChange={(e) => setField('subModuleId', e.target.value)}
      />
      <UIInput
        label={t('Screen_Id', 'Screen Id')}
        value={form.screenId}
        readOnly={readOnly}
        onChange={(e) => setField('screenId', e.target.value)}
      />
      <UIInput
        label={t('URL_ID', 'URL ID')}
        value={form.tcUrlId}
        readOnly={readOnly}
        onChange={(e) => setField('tcUrlId', e.target.value)}
      />
      <UITextArea
        label={t('English_url', 'English URL')}
        value={form.tcUrlEn}
        readOnly={readOnly}
        error={errors.tcUrlEn}
        onChange={(e) => setField('tcUrlEn', e.target.value)}
      />
      <UITextArea
        label={t('Arabic_URL', 'Arabic URL')}
        value={form.tcUrlAr}
        readOnly={readOnly}
        onChange={(e) => setField('tcUrlAr', e.target.value)}
      />
      <UITextArea
        label={t('Description', 'Description')}
        value={form.description}
        readOnly={readOnly}
        onChange={(e) => setField('description', e.target.value)}
      />
      <UITextArea
        label={t('Remarks_tnc', 'Remarks / Arabic Description')}
        value={form.remarks}
        readOnly={readOnly}
        onChange={(e) => setField('remarks', e.target.value)}
      />
      <UIDropdown
        label={t('Status', 'Status')}
        value={form.status}
        disabled={readOnly}
        readOnly={readOnly}
        onChange={(v) => setField('status', v)}
        options={[
          { value: 'Y', label: t('Active', 'Active') },
          { value: 'ACT', label: t('Active', 'Active') },
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

/** Flutter TermsConditionsPage — CMS Terms and Conditions */
export default function TermsConditionsPage() {
  const { rows, setRows, loading, error, upsert, remove, softFetch } = useCrudList(service)
  const toast = useToast()
  const [panel, setPanel] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [unitOptions, setUnitOptions] = useState([])
  const [channelOptions, setChannelOptions] = useState([])
  const [filterUnit, setFilterUnit] = useState('')
  const [filterChannel, setFilterChannel] = useState('')
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [units, channels] = await Promise.all([
        fetchUnits().catch(() => []),
        fetchChannels().catch(() => []),
      ])
      if (cancelled) return
      setUnitOptions(units)
      setChannelOptions(channels)
      const qatar = units.find((u) => String(u.label).toLowerCase().includes('qatar'))
      const mobile = channels.find((c) => /mobile|mb/i.test(`${c.label} ${c.value}`))
      if (qatar) setFilterUnit(qatar.value)
      if (mobile) setFilterChannel(mobile.value)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const columns = useMemo(
    () => [
      { key: 'unitId', label: t('Unit', 'Unit') },
      { key: 'channelId', label: t('Channel', 'Channel') },
      { key: 'moduleId', label: t('Module', 'Module') },
      { key: 'subModuleId', label: t('Sub_Module', 'Sub-Module') },
      { key: 'screenId', label: t('Screen_Id', 'Screen Id') },
      { key: 'tcUrlId', label: t('URL_ID', 'URL ID') },
      { key: 'tcUrlEn', label: t('English_url', 'English URL') },
      { key: 'tcUrlAr', label: t('Arabic_URL', 'Arabic URL') },
      {
        key: 'status',
        label: t('Status', 'Status'),
        statusChip: true,
        render: (row) => <StatusChip status={row.status} />,
      },
    ],
    [],
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
      const list = await fetchTncSummary({
        unitId: filterUnit,
        channelId: filterChannel,
      })
      setRows(list)
    } catch (err) {
      toast.error(err?.message || t('Search_failed', 'Search failed'))
    } finally {
      setSearching(false)
    }
  }, [filterUnit, filterChannel, setRows, toast])

  useEffect(() => {
    if (!filterUnit && !filterChannel) return
    applySearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterUnit, filterChannel])

  async function handleSave(form) {
    try {
      await upsert(form)
      toast.success(t('Saved_successfully', 'Saved successfully'))
      setPanel(null)
      await applySearch()
    } catch (err) {
      toast.error(err?.message || t('Save_failed', 'Save failed'))
    }
  }

  return (
    <Box className="generic-crud-page terms-conditions-page">
      <Box className="generic-crud-page-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('Terms_and_Conditions', 'Terms and Conditions')}
        </UIText>
        <UIAddButton
          label={t('Add_Terms', 'Add Terms')}
          onClick={() =>
            setPanel({
              mode: 'add',
              row: { unitId: filterUnit, channelId: filterChannel, status: 'Y' },
            })
          }
        />
      </Box>

      <Box className="tnc-filters">
        <UIDropdown
          label={t('Unit', 'Unit')}
          value={filterUnit}
          onChange={setFilterUnit}
          options={[{ value: '', label: t('All', 'All') }, ...unitOptions]}
        />
        <UIDropdown
          label={t('Channel', 'Channel')}
          value={filterChannel}
          onChange={setFilterChannel}
          options={[{ value: '', label: t('All', 'All') }, ...channelOptions]}
        />
        <UIButton type="button" variant="primary" onClick={applySearch} disabled={searching}>
          {t('Search', 'Search')}
        </UIButton>
        <UIButton
          type="button"
          variant="outline"
          onClick={async () => {
            setFilterUnit('')
            setFilterChannel('')
            setStatusFilter('all')
            await softFetch()
          }}
        >
          {t('Clear', 'Clear')}
        </UIButton>
      </Box>

      <UISummaryStatusRow
        totalCount={rows.length}
        activeCount={activeCount}
        inactiveCount={rows.length - activeCount}
        totalLabel={t('Total_Terms', 'Total Terms')}
        activeLabel={t('Active_Terms', 'Active Terms')}
        inactiveLabel={t('Inactive_Terms', 'Inactive Terms')}
        value={statusFilter}
        onChange={setStatusFilter}
      />

      <Box className="generic-crud-export">
        <UIPdfExcelDownload
          title={t('Terms_List', 'Terms List')}
          columns={columns}
          data={filtered}
          pdfFileName="terms_conditions.pdf"
          excelFileName="terms_conditions.xlsx"
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
          title={t('Terms_List', 'Terms List')}
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
            ? t('Edit_Terms', 'Edit Terms')
            : panel?.mode === 'view'
              ? t('View_Terms', 'View Terms')
              : t('Add_Terms', 'Add Terms')
        }
        onClose={() => setPanel(null)}
      >
        {panel ? (
          <TncForm
            key={`${panel.mode}-${panel.row?.id || 'new'}`}
            mode={panel.mode}
            initial={panel.row}
            onClose={() => setPanel(null)}
            onSubmit={handleSave}
            unitOptions={unitOptions}
            channelOptions={channelOptions}
          />
        ) : null}
      </UIRightPanel>

      <UIDialog
        open={Boolean(deleteTarget)}
        title={t('Delete_Terms', 'Delete Terms')}
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
            await applySearch()
          } catch (err) {
            toast.error(err?.message || t('Delete_failed', 'Delete failed'))
          }
        }}
      />
    </Box>
  )
}
