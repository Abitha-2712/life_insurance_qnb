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
  rowAction,
  useToast,
} from '@/components/ui'
import { t } from '@/core/i18n/t'
import { useCrudList } from '@/features/common/crud/useCrudList'
import service, {
  fetchChannels,
  fetchLabels,
  fetchModules,
  fetchScreens,
  fetchUnits,
} from '../services/CMSService'
import '@/features/common/crud/GenericCrudPage.css'
import './CMSi18nPage.css'

function I18Form({ mode, initial, onSubmit, onClose, unitOptions, channelOptions, screenOptions }) {
  const [form, setForm] = useState({
    labelKey: '',
    englishLabel: '',
    arabicLabel: '',
    unitId: '',
    channelId: '',
    screenId: '',
    domainId: 'BO',
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
    if (!String(form.labelKey || '').trim()) next.labelKey = t('Required_Field', 'This field is required')
    if (!String(form.englishLabel || '').trim()) next.englishLabel = t('Required_Field', 'This field is required')
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    onSubmit?.(form)
  }

  return (
    <Form className="generic-crud-form i18-form" onSubmit={handleSubmit}>
      <UIInput
        label={t('Label_Key', 'Label Key')}
        value={form.labelKey}
        readOnly={readOnly || mode === 'edit'}
        error={errors.labelKey}
        onChange={(e) => setField('labelKey', e.target.value)}
        required
      />
      <UIInput
        label={t('English_Label', 'English Label')}
        value={form.englishLabel}
        readOnly={readOnly}
        error={errors.englishLabel}
        onChange={(e) => setField('englishLabel', e.target.value)}
        required
      />
      <UIInput
        label={t('Arabic_Label', 'Arabic Label')}
        value={form.arabicLabel}
        readOnly={readOnly}
        onChange={(e) => setField('arabicLabel', e.target.value)}
      />
      <UIDropdown
        label={t('Unit', 'Unit')}
        value={form.unitId}
        disabled={readOnly}
        readOnly={readOnly}
        onChange={(v) => setField('unitId', v)}
        options={unitOptions.length ? unitOptions : [{ value: form.unitId || '', label: form.unitId || '—' }]}
      />
      <UIDropdown
        label={t('Channel', 'Channel')}
        value={form.channelId}
        disabled={readOnly}
        readOnly={readOnly}
        onChange={(v) => setField('channelId', v)}
        options={channelOptions.length ? channelOptions : [{ value: form.channelId || '', label: form.channelId || '—' }]}
      />
      <UIDropdown
        label={t('Screen', 'Screen')}
        value={form.screenId}
        disabled={readOnly}
        readOnly={readOnly}
        onChange={(v) => setField('screenId', v)}
        options={screenOptions.length ? screenOptions : [{ value: form.screenId || '', label: form.screenId || '—' }]}
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

/** Flutter I18MaintenancePage — CMS I18 Maintenance */
export default function CMSi18nPage() {
  const { rows, setRows, loading, error, upsert, remove } = useCrudList(service)
  const toast = useToast()
  const [panel, setPanel] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [unitOptions, setUnitOptions] = useState([])
  const [channelOptions, setChannelOptions] = useState([])
  const [moduleOptions, setModuleOptions] = useState([])
  const [screenOptions, setScreenOptions] = useState([])
  const [filterUnit, setFilterUnit] = useState('')
  const [filterChannel, setFilterChannel] = useState('')
  const [filterModule, setFilterModule] = useState('')
  const [filterScreen, setFilterScreen] = useState('')
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [units, channels, modules] = await Promise.all([
        fetchUnits().catch(() => []),
        fetchChannels().catch(() => []),
        fetchModules().catch(() => []),
      ])
      if (cancelled) return
      setUnitOptions(units)
      setChannelOptions(channels)
      setModuleOptions(modules)
      const qatar = units.find((u) => /qatar/i.test(u.label))
      const mobile = channels.find((c) => /mobile|mb/i.test(`${c.label} ${c.value}`))
      if (qatar) setFilterUnit(qatar.value)
      if (mobile) setFilterChannel(mobile.value)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    if (!filterModule) {
      setScreenOptions([])
      return undefined
    }
    fetchScreens(filterModule)
      .then((list) => {
        if (!cancelled) setScreenOptions(list)
      })
      .catch(() => {
        if (!cancelled) setScreenOptions([])
      })
    return () => {
      cancelled = true
    }
  }, [filterModule])

  const columns = useMemo(
    () => [
      { key: 'labelKey', label: t('Label_Key', 'Label Key') },
      { key: 'englishLabel', label: t('English', 'English') },
      { key: 'arabicLabel', label: t('Arabic', 'Arabic') },
      { key: 'unitId', label: t('Unit', 'Unit') },
      { key: 'channelId', label: t('Channel', 'Channel') },
      { key: 'screenId', label: t('Screen', 'Screen') },
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
    if (!filterUnit || !filterChannel || !filterScreen) {
      toast.error(t('Select_filters', 'Select unit, channel, and screen'))
      return
    }
    setSearching(true)
    try {
      const list = await fetchLabels({
        unitId: filterUnit,
        channelId: filterChannel,
        screenId: filterScreen,
        domainId: 'BO',
      })
      setRows(list)
    } catch (err) {
      toast.error(err?.message || t('Search_failed', 'Search failed'))
    } finally {
      setSearching(false)
    }
  }, [filterUnit, filterChannel, filterScreen, setRows, toast])

  async function handleSave(form) {
    try {
      await upsert({
        ...form,
        unitId: form.unitId || filterUnit,
        channelId: form.channelId || filterChannel,
        screenId: form.screenId || filterScreen,
      })
      toast.success(t('Saved_successfully', 'Saved successfully'))
      setPanel(null)
      await applySearch()
    } catch (err) {
      toast.error(err?.message || t('Save_failed', 'Save failed'))
    }
  }

  return (
    <Box className="generic-crud-page i18-maintenance-page">
      <Box className="generic-crud-page-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('I18_Maintenance', 'I18 Maintenance')}
        </UIText>
        <UIAddButton
          label={t('Add_Label', 'Add Label')}
          onClick={() =>
            setPanel({
              mode: 'add',
              row: {
                unitId: filterUnit,
                channelId: filterChannel,
                screenId: filterScreen,
                domainId: 'BO',
                status: 'Y',
              },
            })
          }
        />
      </Box>

      <Box className="i18-filters">
        <UIDropdown
          label={t('Unit', 'Unit')}
          value={filterUnit}
          onChange={setFilterUnit}
          options={[{ value: '', label: t('Select', 'Select') }, ...unitOptions]}
        />
        <UIDropdown
          label={t('Channel', 'Channel')}
          value={filterChannel}
          onChange={setFilterChannel}
          options={[{ value: '', label: t('Select', 'Select') }, ...channelOptions]}
        />
        <UIDropdown
          label={t('Module', 'Module')}
          value={filterModule}
          onChange={(v) => {
            setFilterModule(v)
            setFilterScreen('')
          }}
          options={[{ value: '', label: t('Select', 'Select') }, ...moduleOptions]}
        />
        <UIDropdown
          label={t('Screen', 'Screen')}
          value={filterScreen}
          onChange={setFilterScreen}
          options={[{ value: '', label: t('Select', 'Select') }, ...screenOptions]}
        />
        <UIButton type="button" variant="primary" onClick={applySearch} disabled={searching}>
          {t('Search', 'Search')}
        </UIButton>
      </Box>

      <UISummaryStatusRow
        totalCount={rows.length}
        activeCount={activeCount}
        inactiveCount={rows.length - activeCount}
        totalLabel={t('Total_Labels', 'Total Labels')}
        activeLabel={t('Active_Labels', 'Active Labels')}
        inactiveLabel={t('Inactive_Labels', 'Inactive Labels')}
        value={statusFilter}
        onChange={setStatusFilter}
      />

      <Box className="generic-crud-export">
        <UIPdfExcelDownload
          title={t('I18_Labels', 'I18 Labels')}
          columns={columns}
          data={filtered}
          pdfFileName="i18_labels.pdf"
          excelFileName="i18_labels.xlsx"
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
          title={t('List_of_Labels', 'List of Labels')}
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
            ? t('Edit_Label', 'Edit Label')
            : panel?.mode === 'view'
              ? t('View_Label', 'View Label')
              : t('Add_Label', 'Add Label')
        }
        onClose={() => setPanel(null)}
      >
        {panel ? (
          <I18Form
            key={`${panel.mode}-${panel.row?.id || 'new'}`}
            mode={panel.mode}
            initial={panel.row}
            onClose={() => setPanel(null)}
            onSubmit={handleSave}
            unitOptions={unitOptions}
            channelOptions={channelOptions}
            screenOptions={screenOptions}
          />
        ) : null}
      </UIRightPanel>

      <UIDialog
        open={Boolean(deleteTarget)}
        title={t('Delete_Label', 'Delete Label')}
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
