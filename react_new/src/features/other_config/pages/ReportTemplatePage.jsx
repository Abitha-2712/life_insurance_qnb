import { useEffect, useMemo, useState } from 'react'
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
import service, { fetchSegmentList } from '../services/report_templateService'
import '@/features/common/crud/GenericCrudPage.css'
import './ReportTemplatePage.css'

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function imgSrc(value) {
  if (!value) return ''
  if (value.startsWith('data:') || value.startsWith('http')) return value
  return `data:image/jpeg;base64,${value}`
}

function ReportTemplateForm({ mode, initial, onSubmit, onClose, segmentOptions }) {
  const [form, setForm] = useState({
    reportName: '',
    reportTitleEn: '',
    reportTitleAr: '',
    segmentLabel: '',
    allCustomer: false,
    headerImage: '',
    footerImage: '',
    headerImageName: '',
    footerImageName: '',
    status: 'Y',
    ...initial,
    segmentLabel:
      initial?.segmentLabel ||
      (Array.isArray(initial?.segmentName)
        ? initial.segmentName.map((s) => s.segmentNameEN || s).join(', ')
        : ''),
    allCustomer: Boolean(initial?.allCustomer),
  })
  const [errors, setErrors] = useState({})
  const readOnly = mode === 'view'
  const setField = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }))
    setErrors((p) => ({ ...p, [k]: '' }))
  }

  async function onImagePick(key, nameKey, file) {
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    setForm((p) => ({ ...p, [key]: dataUrl, [nameKey]: file.name }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (readOnly) return
    const next = {}
    if (!String(form.reportName || '').trim()) next.reportName = t('Required_Field', 'This field is required')
    if (!String(form.reportTitleEn || '').trim()) next.reportTitleEn = t('Required_Field', 'This field is required')
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    onSubmit?.(form)
  }

  return (
    <Form className="generic-crud-form report-template-form" onSubmit={handleSubmit}>
      <UIInput
        label={t('Report_Name', 'Report Name')}
        value={form.reportName}
        readOnly={readOnly}
        error={errors.reportName}
        onChange={(e) => setField('reportName', e.target.value)}
        required
      />
      <UIInput
        label={t('Report_Title_English', 'Report Title (English)')}
        value={form.reportTitleEn}
        readOnly={readOnly}
        error={errors.reportTitleEn}
        onChange={(e) => setField('reportTitleEn', e.target.value)}
        required
      />
      <UIInput
        label={t('Report_Title_Arabic', 'Report Title (Arabic)')}
        value={form.reportTitleAr}
        readOnly={readOnly}
        onChange={(e) => setField('reportTitleAr', e.target.value)}
      />
      <UIDropdown
        label={t('All_Customers', 'All Customers')}
        value={form.allCustomer ? 'Yes' : 'No'}
        disabled={readOnly}
        readOnly={readOnly}
        onChange={(v) => setField('allCustomer', v === 'Yes')}
        options={[
          { value: 'Yes', label: t('Yes', 'Yes') },
          { value: 'No', label: t('No', 'No') },
        ]}
      />
      <UITextArea
        label={t('Segment', 'Segment')}
        value={form.segmentLabel}
        readOnly={readOnly || form.allCustomer}
        onChange={(e) => setField('segmentLabel', e.target.value)}
        placeholder={
          segmentOptions.length
            ? segmentOptions.map((s) => s.label).slice(0, 5).join(', ') + '…'
            : t('Comma_separated_segments', 'Comma-separated segment names')
        }
      />
      {!readOnly ? (
        <>
          <label className="report-template-file">
            <span>{t('Header_Image', 'Header Image')}</span>
            <input type="file" accept="image/*" onChange={(e) => onImagePick('headerImage', 'headerImageName', e.target.files?.[0])} />
          </label>
          <label className="report-template-file">
            <span>{t('Footer_Image', 'Footer Image')}</span>
            <input type="file" accept="image/*" onChange={(e) => onImagePick('footerImage', 'footerImageName', e.target.files?.[0])} />
          </label>
        </>
      ) : null}
      <Box className="report-template-previews">
        {form.headerImage ? <img src={imgSrc(form.headerImage)} alt="header" /> : null}
        {form.footerImage ? <img src={imgSrc(form.footerImage)} alt="footer" /> : null}
      </Box>
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

/** Flutter ReportTemplateTablePage */
export default function ReportTemplatePage() {
  const { rows, loading, error, upsert, remove } = useCrudList(service)
  const toast = useToast()
  const [panel, setPanel] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [segmentOptions, setSegmentOptions] = useState([])

  useEffect(() => {
    let cancelled = false
    fetchSegmentList()
      .then((list) => {
        if (!cancelled) setSegmentOptions(list)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const columns = useMemo(
    () => [
      { key: 'reportName', label: t('Report_Name', 'Report Name') },
      {
        key: 'allCustomerLabel',
        label: t('All_Customers', 'All Customers'),
      },
      { key: 'segmentLabel', label: t('Segment', 'Segment') },
      { key: 'reportTitleEn', label: t('Report_Title_English', 'Report Title (English)') },
      { key: 'reportTitleAr', label: t('Report_Title_Arabic', 'Report Title (Arabic)') },
      { key: 'headerImage', label: t('Header_Image', 'Header Image'), image: true },
      { key: 'footerImage', label: t('Footer_Image', 'Footer Image'), image: true },
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
    <Box className="generic-crud-page report-template-page">
      <Box className="generic-crud-page-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('Report_Template_Management', 'Report Template Management')}
        </UIText>
        <UIAddButton
          label={t('Add_Report_Template', 'Add Report Template')}
          onClick={() => setPanel({ mode: 'add' })}
        />
      </Box>

      <UISummaryStatusRow
        totalCount={rows.length}
        activeCount={activeCount}
        inactiveCount={rows.length - activeCount}
        totalLabel={t('Total_Report_Templates', 'Total Report Templates')}
        activeLabel={t('Active_Report_Templates', 'Active Report Templates')}
        inactiveLabel={t('Inactive_Report_Templates', 'Inactive Report Templates')}
        value={statusFilter}
        onChange={setStatusFilter}
      />

      <Box className="generic-crud-export">
        <UIPdfExcelDownload
          title={t('Report_Template_List', 'Report Template List')}
          columns={columns}
          data={filtered}
          pdfFileName="report_template.pdf"
          excelFileName="report_template.xlsx"
        />
      </Box>

      <UICard>
        {loading ? <UILoader label={t('Loading', 'Loading…')} /> : null}
        {error ? (
          <UIText variant="b14Regular" className="generic-crud-page-error">
            {error}
          </UIText>
        ) : null}
        <UIDataTable
          title={t('Report_Template_List', 'Report Template List')}
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
            ? t('Edit_Report_Template', 'Edit Report Template')
            : panel?.mode === 'view'
              ? t('View_Report_Template', 'View Report Template')
              : t('Add_Report_Template', 'Add Report Template')
        }
        onClose={() => setPanel(null)}
      >
        {panel ? (
          <ReportTemplateForm
            key={`${panel.mode}-${panel.row?.id || 'new'}`}
            mode={panel.mode}
            initial={panel.row}
            onClose={() => setPanel(null)}
            onSubmit={handleSave}
            segmentOptions={segmentOptions}
          />
        ) : null}
      </UIRightPanel>

      <UIDialog
        open={Boolean(deleteTarget)}
        title={t('Delete_Report_Template', 'Delete Report Template')}
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
