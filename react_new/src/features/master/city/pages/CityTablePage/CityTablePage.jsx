import { useMemo, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import {
  RowActionType,
  StatusChip,
  UIAddButton,
  UICard,
  UIDataTable,
  UIDialog,
  UILoader,
  UIPdfExcelDownload,
  UIRightPanel,
  UISummaryStatusRow,
  UIText,
  rowAction,
  useToast,
} from '@/components/ui'
import { t } from '@/core/i18n/t'
import CityForm from '../../components/CityForm'
import { useCityList } from '../../hooks/useCityList'
import './CityTablePage.css'

function isActiveStatus(status) {
  const s = String(status || '')
    .toUpperCase()
    .trim()
  return ['Y', 'YES', 'ACT', 'ACTIVE', '1', 'TRUE', 'ENABLED'].includes(s)
}

function CityTablePage() {
  const { rows, loading, error, upsert, remove } = useCityList()
  const toast = useToast()
  const [panel, setPanel] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const columns = useMemo(
    () => [
      { key: 'cityNameEnglish', label: t('City_Name_English', 'City Name (English)') },
      { key: 'cityNameArabic', label: t('City_Name_Arabic', 'City Name (Arabic)') },
      {
        key: 'status',
        label: t('Status', 'Status'),
        statusChip: true,
        render: (row) => <StatusChip status={row.status} />,
      },
    ],
    [],
  )

  const rowActions = useMemo(
    () => [
      rowAction(RowActionType.view),
      rowAction(RowActionType.modify),
      rowAction(RowActionType.delete),
    ],
    [],
  )

  const filteredRows = useMemo(() => {
    if (statusFilter === 'active') return rows.filter((r) => isActiveStatus(r.status))
    if (statusFilter === 'inactive') return rows.filter((r) => !isActiveStatus(r.status))
    return rows
  }, [rows, statusFilter])

  const panelTitle =
    panel?.mode === 'edit'
      ? t('Edit_City', 'Edit City')
      : panel?.mode === 'view'
        ? t('View_City', 'View City')
        : t('Add_City', 'Add City')

  async function handleSave(form) {
    try {
      await upsert(form)
      toast.success(t('Saved_successfully', 'Saved successfully'))
      setPanel(null)
    } catch (err) {
      toast.error(err?.message || t('Save_failed', 'Save failed'))
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    try {
      await remove(deleteTarget.cityId ?? deleteTarget.id)
      toast.success(t('Deleted_successfully', 'Deleted successfully'))
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err?.message || t('Delete_failed', 'Delete failed'))
    }
  }

  return (
    <Box className="city-page">
      <Box className="city-page-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('City', 'City')}
        </UIText>
        <UIAddButton
          label={t('Add_City', 'Add City')}
          onClick={() => setPanel({ mode: 'add' })}
        />
      </Box>

      <UISummaryStatusRow
        totalCount={rows.length}
        activeCount={rows.filter((r) => isActiveStatus(r.status)).length}
        inactiveCount={rows.filter((r) => !isActiveStatus(r.status)).length}
        totalLabel={t('Total_Cities', 'Total Cities')}
        activeLabel={t('Active_Cities', 'Active Cities')}
        inactiveLabel={t('Inactive_Cities', 'Inactive Cities')}
        value={statusFilter}
        onChange={setStatusFilter}
      />

      <Box className="generic-crud-export">
        <UIPdfExcelDownload
          title={t('City_List', 'City List')}
          columns={columns}
          data={filteredRows}
          pdfFileName="city.pdf"
          excelFileName="city.xlsx"
        />
      </Box>

      <UICard>
        {loading ? <UILoader label={t('Loading', 'Loading…')} /> : null}
        {error ? (
          <UIText variant="b13Regular" className="city-page-error">
            {error}
          </UIText>
        ) : null}
        <UIDataTable
          title={t('City_List', 'City List')}
          columns={columns}
          rows={filteredRows}
          rowKey="id"
          rowActions={rowActions}
          onView={(row) => setPanel({ mode: 'view', row })}
          onModify={(row) => setPanel({ mode: 'edit', row })}
          onDelete={(row) => setDeleteTarget(row)}
        />
      </UICard>

      <UIRightPanel open={Boolean(panel)} title={panelTitle} onClose={() => setPanel(null)}>
        {panel ? (
          <CityForm
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
        title={t('Delete_City', 'Delete City')}
        message={t(
          'Delete_city_confirm',
          'Are you sure you want to delete this city?',
        )}
        confirmLabel={t('Delete', 'Delete')}
        cancelLabel={t('Cancel', 'Cancel')}
        tone="danger"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  )
}

export default CityTablePage
