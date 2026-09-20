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
  fetchBannerSummary,
  fetchChannels,
  fetchDomains,
  fetchLanguageSummary,
  fetchScreenIds,
  fetchUnits,
} from '../services/banner_configurationService'
import '@/features/common/crud/GenericCrudPage.css'
import './BannerConfigurationPage.css'

function toOptions(payload, valueKey = 'code', labelKey = 'name') {
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.content)
        ? payload.content
        : Array.isArray(payload?.units)
          ? payload.units
          : Array.isArray(payload?.channels)
            ? payload.channels
            : Array.isArray(payload?.languages)
              ? payload.languages
              : Array.isArray(payload?.groups)
                ? payload.groups
                : []
  return list.map((item, i) => {
    if (typeof item === 'string') return { value: item, label: item }
    const value = String(
      item[valueKey] ||
        item.id ||
        item.screenId ||
        item.unitId ||
        item.channelId ||
        item.domainId ||
        item.groupId ||
        item.langCode ||
        item.code ||
        i,
    )
    const label = String(
      item[labelKey] ||
        item.description ||
        item.screenName ||
        item.unitName ||
        item.channelName ||
        item.domainName ||
        item.groupName ||
        item.langName ||
        item.name ||
        value,
    )
    return { value, label }
  })
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function BannerForm({ mode, initial, onSubmit, onClose, screenOptions, unitOptions, channelOptions, domainOptions }) {
  const [form, setForm] = useState({
    bannerId: '',
    bannerName: '',
    bannerUrl: '',
    bannerUrlAr: '',
    redirectionUrl: '',
    redirectionUrlAr: '',
    dispPriority: '',
    screenId: '',
    unitId: '',
    domainId: '',
    channelId: '',
    segmentType: '',
    startDate: '',
    endDate: '',
    bannerImageEnglish: '',
    bannerImageArabic: '',
    status: 'Y',
    ...initial,
  })
  const [errors, setErrors] = useState({})
  const readOnly = mode === 'view'
  const setField = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }))
    setErrors((p) => ({ ...p, [k]: '' }))
  }

  async function onImagePick(key, file) {
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    setField(key, dataUrl)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (readOnly) return
    const next = {}
    if (!String(form.bannerId || '').trim()) next.bannerId = t('Required_Field', 'This field is required')
    if (!String(form.unitId || '').trim()) next.unitId = t('Required_Field', 'This field is required')
    if (!String(form.screenId || '').trim()) next.screenId = t('Required_Field', 'This field is required')
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    onSubmit?.(form)
  }

  return (
    <Form className="generic-crud-form banner-form" onSubmit={handleSubmit}>
      <UIInput
        label={t('Banner_ID', 'Banner ID')}
        value={form.bannerId}
        readOnly={readOnly || mode === 'edit'}
        error={errors.bannerId}
        onChange={(e) => setField('bannerId', e.target.value)}
        required
      />
      <UIInput
        label={t('Banner_Name', 'Banner Name / Description')}
        value={form.bannerName}
        readOnly={readOnly}
        onChange={(e) => setField('bannerName', e.target.value)}
      />
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
        label={t('Domain', 'Domain')}
        value={form.domainId}
        disabled={readOnly}
        readOnly={readOnly}
        onChange={(v) => setField('domainId', v)}
        options={domainOptions.length ? domainOptions : [{ value: form.domainId || '', label: form.domainIdDisplay || form.domainId || '—' }]}
      />
      <UIDropdown
        label={t('Channel', 'Channel')}
        value={form.channelId}
        disabled={readOnly}
        readOnly={readOnly}
        onChange={(v) => setField('channelId', v)}
        options={channelOptions.length ? channelOptions : [{ value: form.channelId || '', label: form.channel || form.channelId || '—' }]}
      />
      <UIDropdown
        label={t('Screen_ID', 'Screen ID')}
        value={form.screenId}
        disabled={readOnly}
        readOnly={readOnly}
        error={errors.screenId}
        onChange={(v) => setField('screenId', v)}
        options={screenOptions.length ? screenOptions : [{ value: form.screenId || '', label: form.screenId || '—' }]}
      />
      <UIInput
        label={t('Customer_Segment', 'Customer Segment')}
        value={form.segmentType}
        readOnly={readOnly}
        onChange={(e) => setField('segmentType', e.target.value)}
      />
      <UIInput
        label={t('Display_Priority', 'Display Priority')}
        value={form.dispPriority}
        readOnly={readOnly}
        onChange={(e) => setField('dispPriority', e.target.value)}
      />
      <UITextArea
        label={t('Banner_URL_English', 'Banner URL (English)')}
        value={form.bannerUrl}
        readOnly={readOnly}
        onChange={(e) => setField('bannerUrl', e.target.value)}
      />
      <UITextArea
        label={t('Banner_URL_Arabic', 'Banner URL (Arabic)')}
        value={form.bannerUrlAr}
        readOnly={readOnly}
        onChange={(e) => setField('bannerUrlAr', e.target.value)}
      />
      <UITextArea
        label={t('Redirection_URL_English', 'Redirection URL (English)')}
        value={form.redirectionUrl}
        readOnly={readOnly}
        onChange={(e) => setField('redirectionUrl', e.target.value)}
      />
      <UITextArea
        label={t('Redirection_URL_Arabic', 'Redirection URL (Arabic)')}
        value={form.redirectionUrlAr}
        readOnly={readOnly}
        onChange={(e) => setField('redirectionUrlAr', e.target.value)}
      />
      <UIInput
        label={t('Start_Date', 'Start Date')}
        value={form.startDate}
        readOnly={readOnly}
        onChange={(e) => setField('startDate', e.target.value)}
        placeholder="dd/MM/yyyy"
      />
      <UIInput
        label={t('End_Date', 'End Date')}
        value={form.endDate}
        readOnly={readOnly}
        onChange={(e) => setField('endDate', e.target.value)}
        placeholder="dd/MM/yyyy"
      />
      {!readOnly ? (
        <>
          <label className="banner-file-label">
            <span>{t('Image_En', 'Image En')}</span>
            <input type="file" accept="image/*" onChange={(e) => onImagePick('bannerImageEnglish', e.target.files?.[0])} />
          </label>
          <label className="banner-file-label">
            <span>{t('Image_Ar', 'Image Ar')}</span>
            <input type="file" accept="image/*" onChange={(e) => onImagePick('bannerImageArabic', e.target.files?.[0])} />
          </label>
        </>
      ) : null}
      {(form.bannerImageEnglish || form.bannerImageArabic) && (
        <Box className="banner-image-previews">
          {form.bannerImageEnglish ? (
            <img src={form.bannerImageEnglish.startsWith('data:') || form.bannerImageEnglish.startsWith('http') ? form.bannerImageEnglish : `data:image/jpeg;base64,${form.bannerImageEnglish}`} alt="EN" />
          ) : null}
          {form.bannerImageArabic ? (
            <img src={form.bannerImageArabic.startsWith('data:') || form.bannerImageArabic.startsWith('http') ? form.bannerImageArabic : `data:image/jpeg;base64,${form.bannerImageArabic}`} alt="AR" />
          ) : null}
        </Box>
      )}
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

/** Flutter BannerConfigurationPage / CMS Banner Maintenance */
export default function BannerConfigurationPage() {
  const { rows, loading, error, upsert, remove, setRows, reload } = useCrudList(service)
  const toast = useToast()
  const [panel, setPanel] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [screenOptions, setScreenOptions] = useState([])
  const [unitOptions, setUnitOptions] = useState([])
  const [channelOptions, setChannelOptions] = useState([])
  const [domainOptions, setDomainOptions] = useState([])
  const [filterUnit, setFilterUnit] = useState('')
  const [filterChannel, setFilterChannel] = useState('')
  const [filterDomain, setFilterDomain] = useState('')
  const [filterLoading, setFilterLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [screens, units, channels, domains] = await Promise.all([
          fetchScreenIds().catch(() => null),
          fetchUnits().catch(() => null),
          fetchChannels().catch(() => null),
          fetchDomains().catch(() => null),
          fetchLanguageSummary().catch(() => null),
        ])
        if (cancelled) return
        setScreenOptions(toOptions(screens, 'screenId', 'description'))
        setUnitOptions(toOptions(units, 'unitId', 'unitName'))
        setChannelOptions(toOptions(channels, 'channelId', 'channelName'))
        setDomainOptions(toOptions(domains, 'domainId', 'domainName'))
      } catch {
        /* offline */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const columns = useMemo(
    () => [
      { key: 'domainIdDisplay', label: t('Domain', 'Domain') },
      { key: 'channel', label: t('Channel', 'Channel') },
      { key: 'unitId', label: t('Unit', 'Unit') },
      { key: 'screenId', label: t('Screen_ID', 'Screen ID') },
      { key: 'segmentType', label: t('Segment', 'Segment') },
      { key: 'bannerId', label: t('Banner_ID', 'Banner ID') },
      { key: 'bannerUrl', label: t('Banner_URL_English', 'Banner URL (English)') },
      { key: 'bannerUrlAr', label: t('Banner_URL_Arabic', 'Banner URL (Arabic)') },
      { key: 'redirectionUrl', label: t('Redirection_URL_English', 'Redirection URL (EN)') },
      { key: 'redirectionUrlAr', label: t('Redirection_URL_Arabic', 'Redirection URL (AR)') },
      { key: 'dispPriority', label: t('Display_Priority', 'Display Priority') },
      {
        key: 'bannerImageEnglish',
        label: t('Image_En', 'Image En'),
        image: true,
      },
      {
        key: 'bannerImageArabic',
        label: t('Image_Ar', 'Image Ar'),
        image: true,
      },
      {
        key: 'status',
        label: t('Status', 'Status'),
        statusChip: true,
        render: (row) => <StatusChip status={row.status} />,
      },
    ],
    [],
  )

  const isActive = (s) => ['Y', 'YES', 'ACT', 'ACTIVE', 'ENABLED'].includes(String(s || '').toUpperCase())
  const activeCount = useMemo(() => rows.filter((r) => isActive(r.status)).length, [rows])
  const filtered = useMemo(() => {
    if (statusFilter === 'active') return rows.filter((r) => isActive(r.status))
    if (statusFilter === 'inactive') return rows.filter((r) => !isActive(r.status))
    return rows
  }, [rows, statusFilter])

  const applySearch = useCallback(async () => {
    setFilterLoading(true)
    try {
      const list = await fetchBannerSummary({
        unit: filterUnit,
        channelIds: filterChannel ? [filterChannel] : [],
        domainId: filterDomain,
      })
      setRows?.(list)
    } catch (err) {
      toast.error(err?.message || t('Search_failed', 'Search failed'))
    } finally {
      setFilterLoading(false)
    }
  }, [filterUnit, filterChannel, filterDomain, setRows, toast])

  async function handleSave(form) {
    try {
      await upsert(form)
      toast.success(t('Saved_successfully', 'Saved successfully'))
      setPanel(null)
      reload?.()
    } catch (err) {
      toast.error(err?.message || t('Save_failed', 'Save failed'))
    }
  }

  return (
    <Box className="generic-crud-page banner-configuration-page">
      <Box className="generic-crud-page-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('Banner_Maintenance', 'Banner Maintenance')}
        </UIText>
        <UIAddButton label={t('Add_Banner', 'Add Banner')} onClick={() => setPanel({ mode: 'add' })} />
      </Box>

      <Box className="banner-filters">
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
        <UIDropdown
          label={t('Domain', 'Domain')}
          value={filterDomain}
          onChange={setFilterDomain}
          options={[{ value: '', label: t('All', 'All') }, ...domainOptions]}
        />
        <UIButton type="button" variant="primary" onClick={applySearch} disabled={filterLoading}>
          {t('Search', 'Search')}
        </UIButton>
      </Box>

      <UISummaryStatusRow
        totalCount={rows.length}
        activeCount={activeCount}
        inactiveCount={rows.length - activeCount}
        totalLabel={t('Total_Banners', 'Total Banners')}
        activeLabel={t('Active_Banners', 'Active Banners')}
        inactiveLabel={t('Inactive_Banners', 'Inactive Banners')}
        value={statusFilter}
        onChange={setStatusFilter}
      />
      <Box className="generic-crud-export">
        <UIPdfExcelDownload
          title={t('Banner_List', 'Banner List')}
          columns={columns}
          data={filtered}
          pdfFileName="banner_configuration.pdf"
          excelFileName="banner_configuration.xlsx"
        />
      </Box>
      <UICard>
        {loading || filterLoading ? <UILoader label={t('Loading', 'Loading…')} /> : null}
        {error ? (
          <UIText variant="b13Regular" className="generic-crud-page-error">
            {error}
          </UIText>
        ) : null}
        <UIDataTable
          title={t('Banner_List', 'Banner List')}
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
            ? t('Edit_Banner', 'Edit Banner')
            : panel?.mode === 'view'
              ? t('View_Banner', 'View Banner')
              : t('Add_Banner', 'Add Banner')
        }
        onClose={() => setPanel(null)}
      >
        {panel ? (
          <BannerForm
            key={`${panel.mode}-${panel.row?.id || 'new'}`}
            mode={panel.mode}
            initial={panel.row}
            onClose={() => setPanel(null)}
            onSubmit={handleSave}
            screenOptions={screenOptions}
            unitOptions={unitOptions}
            channelOptions={channelOptions}
            domainOptions={domainOptions}
          />
        ) : null}
      </UIRightPanel>
      <UIDialog
        open={Boolean(deleteTarget)}
        title={t('Delete_Banner', 'Delete Banner')}
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
            reload?.()
          } catch (err) {
            toast.error(err?.message || t('Delete_failed', 'Delete failed'))
          }
        }}
      />
    </Box>
  )
}
