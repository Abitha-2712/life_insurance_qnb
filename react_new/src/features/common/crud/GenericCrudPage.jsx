import { useEffect, useMemo, useRef, useState } from 'react'
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
import GenericCrudForm from './GenericCrudForm'
import { useCrudList } from './useCrudList'
import './GenericCrudPage.css'

function isActiveStatus(status) {
  const s = String(status || '')
    .toUpperCase()
    .trim()
  return ['Y', 'YES', 'ACT', 'ACTIVE', '1', 'TRUE', 'ENABLED'].includes(s)
}

/**
 * City-template CRUD page driven by config.
 * Pass `embedded` when hosted inside a multi-tab hub (hides page title + status cards).
 */
function GenericCrudPage({
  title,
  titleKey,
  entityLabel,
  service,
  columns,
  fields,
  rowKey = 'id',
  statusKey = 'status',
  addLabel,
  listTitle,
  enableStatusFilter = true,
  enableExport = true,
  pdfFileName,
  excelFileName,
  totalLabel,
  activeLabel,
  inactiveLabel,
  embedded = false,
  hideAdd = false,
  hideExport = false,
  hideHeader = false,
  actionsRef = null,
  rowFilter = null,
  className = '',
  onRowsChange,
}) {
  const { rows, loading, error, upsert, remove } = useCrudList(service)
  const toast = useToast()
  const [panel, setPanel] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const onRowsChangeRef = useRef(onRowsChange)
  onRowsChangeRef.current = onRowsChange

  useEffect(() => {
    onRowsChangeRef.current?.(rows)
  }, [rows])

  useEffect(() => {
    if (!actionsRef) return undefined
    actionsRef.current = {
      openAdd: () => setPanel({ mode: 'add' }),
    }
    return () => {
      actionsRef.current = null
    }
  }, [actionsRef])

  const tableColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        label: t(col.labelKey || col.key, col.label || col.key),
        render: col.statusChip
          ? (row) => <StatusChip status={row[col.key]} />
          : col.render,
      })),
    [columns],
  )

  const rowActions = useMemo(
    () => [
      rowAction(RowActionType.view),
      rowAction(RowActionType.modify),
      rowAction(RowActionType.delete),
    ],
    [],
  )

  const hasStatus =
    !embedded &&
    enableStatusFilter &&
    columns.some((c) => c.key === statusKey || c.statusChip)

  const statusCounts = useMemo(() => {
    if (!hasStatus) return { total: 0, active: 0, inactive: 0 }
    const active = rows.filter((r) => isActiveStatus(r[statusKey])).length
    return {
      total: rows.length,
      active,
      inactive: rows.length - active,
    }
  }, [rows, hasStatus, statusKey])

  const filteredRows = useMemo(() => {
    let next = rows
    if (hasStatus && statusFilter === 'active') {
      next = next.filter((r) => isActiveStatus(r[statusKey]))
    } else if (hasStatus && statusFilter === 'inactive') {
      next = next.filter((r) => !isActiveStatus(r[statusKey]))
    }
    if (typeof rowFilter === 'function') {
      next = rowFilter(next)
    }
    return next
  }, [rows, statusFilter, hasStatus, statusKey, rowFilter])

  const pageTitle = t(titleKey || title, title)
  const entity = entityLabel || title
  const tableListTitle = listTitle || t('List', `${title} List`)
  const resolvedTotalLabel = totalLabel || t('Total_entity', `Total ${entity}`)
  const resolvedActiveLabel = activeLabel || t('Active_entity', `Active ${entity}`)
  const resolvedInactiveLabel =
    inactiveLabel || t('Inactive_entity', `Inactive ${entity}`)
  const exportBase =
    String(title || 'export')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '') || 'export'
  const panelTitle =
    panel?.mode === 'edit'
      ? t('Edit_entity', `Edit ${entity}`)
      : panel?.mode === 'view'
        ? t('View_entity', `View ${entity}`)
        : t('Add_entity', `Add ${entity}`)

  const showHeader = !hideHeader && (!embedded || !hideAdd)
  const showExport = enableExport && !hideExport

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
      await remove(deleteTarget[rowKey] ?? deleteTarget.id, deleteTarget)
      toast.success(t('Deleted_successfully', 'Deleted successfully'))
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err?.message || t('Delete_failed', 'Delete failed'))
    }
  }

  return (
    <Box
      className={['generic-crud-page', embedded ? 'is-embedded' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {showHeader ? (
        <Box
          className={[
            'generic-crud-page-header',
            embedded ? 'is-embedded-header' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {!embedded ? (
            <UIText as="h2" variant="h24SemiBold">
              {pageTitle}
            </UIText>
          ) : (
            <span />
          )}
          {!hideAdd ? (
            <UIAddButton
              label={addLabel || t('Add', `Add ${title}`)}
              onClick={() => setPanel({ mode: 'add' })}
            />
          ) : null}
        </Box>
      ) : null}

      {hasStatus ? (
        <UISummaryStatusRow
          totalCount={statusCounts.total}
          activeCount={statusCounts.active}
          inactiveCount={statusCounts.inactive}
          totalLabel={resolvedTotalLabel}
          activeLabel={resolvedActiveLabel}
          inactiveLabel={resolvedInactiveLabel}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      ) : null}

      {showExport ? (
        <Box className="generic-crud-export">
          <UIPdfExcelDownload
            title={tableListTitle}
            columns={tableColumns}
            data={filteredRows}
            pdfFileName={pdfFileName || `${exportBase}.pdf`}
            excelFileName={excelFileName || `${exportBase}.xlsx`}
          />
        </Box>
      ) : null}

      <UICard>
        {loading ? <UILoader label={t('Loading', 'Loading…')} /> : null}
        {error ? (
          <UIText variant="b13Regular" className="generic-crud-page-error">
            {error}
          </UIText>
        ) : null}
        <UIDataTable
          title={tableListTitle}
          columns={tableColumns}
          rows={filteredRows}
          rowKey={rowKey}
          rowActions={rowActions}
          onView={(row) => setPanel({ mode: 'view', row })}
          onModify={(row) => setPanel({ mode: 'edit', row })}
          onDelete={(row) => setDeleteTarget(row)}
        />
      </UICard>

      <UIRightPanel open={Boolean(panel)} title={panelTitle} onClose={() => setPanel(null)}>
        {panel ? (
          <GenericCrudForm
            key={`${panel.mode}-${panel.row?.[rowKey] || panel.row?.id || 'new'}`}
            mode={panel.mode}
            initial={panel.row}
            fields={fields}
            onClose={() => setPanel(null)}
            onSubmit={handleSave}
          />
        ) : null}
      </UIRightPanel>

      <UIDialog
        open={Boolean(deleteTarget)}
        title={t('Delete', `Delete ${title}`)}
        message={t(
          'Delete_confirm',
          'Are you sure you want to delete this record? This action cannot be undone.',
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

export default GenericCrudPage
