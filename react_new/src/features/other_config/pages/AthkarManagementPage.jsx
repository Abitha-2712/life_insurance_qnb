import { useMemo, useState } from 'react'
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
import service from '../services/athkarService'
import '@/features/common/crud/GenericCrudPage.css'
import './AthkarManagementPage.css'

function AthkarForm({ mode, initial, onSubmit, onClose }) {
  const [form, setForm] = useState({
    rowNo: '',
    categoryEn: '',
    categoryAr: '',
    contentEn: '',
    contentAr: '',
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
    if (!String(form.categoryEn || '').trim()) next.categoryEn = t('Required_Field', 'This field is required')
    if (!String(form.contentEn || '').trim()) next.contentEn = t('Required_Field', 'This field is required')
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    onSubmit?.(form)
  }

  return (
    <Form className="generic-crud-form athkar-form" onSubmit={handleSubmit}>
      <UIInput
        label={t('Row_Number', 'Row Number')}
        value={form.rowNo}
        readOnly={readOnly}
        onChange={(e) => setField('rowNo', e.target.value)}
      />
      <UIInput
        label={t('English_Name', 'English Name')}
        value={form.categoryEn}
        readOnly={readOnly}
        error={errors.categoryEn}
        onChange={(e) => setField('categoryEn', e.target.value)}
        required
      />
      <UIInput
        label={t('Arabic_Name', 'Arabic Name')}
        value={form.categoryAr}
        readOnly={readOnly}
        onChange={(e) => setField('categoryAr', e.target.value)}
      />
      <UITextArea
        label={t('English_Content', 'English Content')}
        value={form.contentEn}
        readOnly={readOnly}
        error={errors.contentEn}
        onChange={(e) => setField('contentEn', e.target.value)}
      />
      <UITextArea
        label={t('Arabic_Content', 'Arabic Content')}
        value={form.contentAr}
        readOnly={readOnly}
        onChange={(e) => setField('contentAr', e.target.value)}
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

/** Flutter AthkarManagementTablePage */
export default function AthkarManagementPage() {
  const { rows, loading, error, upsert, remove } = useCrudList(service)
  const toast = useToast()
  const [panel, setPanel] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const columns = useMemo(
    () => [
      { key: 'rowNo', label: t('Row_Number', 'Row Number') },
      { key: 'categoryEn', label: t('English_Name', 'English Name') },
      { key: 'categoryAr', label: t('Arabic_Name', 'Arabic Name') },
      { key: 'contentEn', label: t('English_Content', 'English Content') },
      { key: 'contentAr', label: t('Arabic_Content', 'Arabic Content') },
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
    <Box className="generic-crud-page athkar-management-page">
      <Box className="generic-crud-page-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('Athkar_Management', 'Athkar Management')}
        </UIText>
        <UIAddButton label={t('Add_Athkar', 'Add Athkar')} onClick={() => setPanel({ mode: 'add' })} />
      </Box>

      <UISummaryStatusRow
        totalCount={rows.length}
        activeCount={activeCount}
        inactiveCount={rows.length - activeCount}
        totalLabel={t('Total_Athkar', 'Total Athkar')}
        activeLabel={t('Active_Athkar', 'Active Athkar')}
        inactiveLabel={t('Inactive_Athkar', 'Inactive Athkar')}
        value={statusFilter}
        onChange={setStatusFilter}
      />

      <Box className="generic-crud-export">
        <UIPdfExcelDownload
          title={t('List_of_Athkar', 'List of Athkar')}
          columns={columns}
          data={filtered}
          pdfFileName="athkar_management.pdf"
          excelFileName="athkar_management.xlsx"
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
          title={t('List_of_Athkar', 'List of Athkar')}
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
            ? t('Edit_Athkar', 'Edit Athkar')
            : panel?.mode === 'view'
              ? t('View_Athkar', 'View Athkar')
              : t('Add_Athkar', 'Add Athkar')
        }
        onClose={() => setPanel(null)}
      >
        {panel ? (
          <AthkarForm
            key={`${panel.mode}-${panel.row?.id || 'new'}`}
            mode={panel.mode}
            initial={panel.row}
            onClose={() => setPanel(null)}
            onSubmit={handleSave}
          />
        ) : null}
      </UIRightPanel>

      <UIDialog
        open={Boolean(deleteTarget)}
        title={t('Delete_Athkar', 'Delete Athkar')}
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
