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
  rowAction,
  useToast,
} from '@/components/ui'
import { t } from '@/core/i18n/t'
import { useCrudList } from '@/features/common/crud/useCrudList'
import service, {
  fetchGroupDropdown,
  fetchRoleDropdown,
} from '../services/user_managementService'
import '@/features/common/crud/GenericCrudPage.css'

function isActiveStatus(status) {
  const s = String(status || '').toUpperCase().trim()
  return ['Y', 'YES', 'ACT', 'ACTIVE', '1', 'TRUE', 'ENABLED'].includes(s)
}

function UserForm({ mode, initial, onSubmit, onClose }) {
  const empty = {
    userId: '',
    userName: '',
    userEmail: '',
    userRole: '',
    userGroup: '',
    userType: '',
    status: 'Y',
  }
  const [form, setForm] = useState({ ...empty, ...initial })
  const [errors, setErrors] = useState({})
  const [roleOptions, setRoleOptions] = useState([])
  const [groupOptions, setGroupOptions] = useState([])
  const readOnly = mode === 'view'

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [roles, groups] = await Promise.all([fetchRoleDropdown(), fetchGroupDropdown()])
      if (!cancelled) {
        setRoleOptions(roles)
        setGroupOptions(groups)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }))
    setErrors((p) => ({ ...p, [k]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (readOnly) return
    const next = {}
    if (!String(form.userId || '').trim()) next.userId = t('Required_Field', 'This field is required')
    if (!String(form.userName || '').trim()) next.userName = t('Required_Field', 'This field is required')
    if (Object.keys(next).length) {
      setErrors(next)
      return
    }
    onSubmit?.(form)
  }

  return (
    <Form className="generic-crud-form" onSubmit={handleSubmit}>
      <UIInput
        label={t('User_ID', 'User ID')}
        value={form.userId}
        readOnly={readOnly || mode === 'edit'}
        disabled={mode === 'edit'}
        error={errors.userId}
        onChange={(e) => setField('userId', e.target.value)}
        required
      />
      <UIInput
        label={t('User_Name', 'User Name')}
        value={form.userName}
        readOnly={readOnly}
        error={errors.userName}
        onChange={(e) => setField('userName', e.target.value)}
        required
      />
      <UIInput
        label={t('Email', 'Email')}
        value={form.userEmail}
        readOnly={readOnly}
        onChange={(e) => setField('userEmail', e.target.value)}
      />
      <UIDropdown
        label={t('Role', 'Role')}
        value={form.userRole}
        disabled={readOnly}
        readOnly={readOnly}
        placeholder={t('Select_Role', 'Select role')}
        onChange={(v) => setField('userRole', v)}
        options={roleOptions}
      />
      <UIDropdown
        label={t('Group', 'Group')}
        value={form.userGroup || ''}
        disabled={readOnly}
        readOnly={readOnly}
        placeholder={t('Select_Group', 'Select group')}
        onChange={(v) => setField('userGroup', v)}
        options={groupOptions}
      />
      <UIInput
        label={t('User_Type', 'User Type')}
        value={form.userType}
        readOnly={readOnly}
        onChange={(e) => setField('userType', e.target.value)}
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

export default function UserManagementPage() {
  const { rows, loading, error, upsert, remove } = useCrudList(service)
  const toast = useToast()
  const [panel, setPanel] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const columns = useMemo(
    () => [
      { key: 'userId', label: t('User_ID', 'User ID') },
      { key: 'userName', label: t('User_Name', 'User Name') },
      { key: 'userEmail', label: t('Email', 'Email') },
      { key: 'userRole', label: t('Role', 'Role') },
      {
        key: 'status',
        label: t('Status', 'Status'),
        statusChip: true,
        render: (row) => <StatusChip status={row.status} />,
      },
    ],
    [],
  )

  const filtered = useMemo(() => {
    if (statusFilter === 'active') return rows.filter((r) => isActiveStatus(r.status))
    if (statusFilter === 'inactive') return rows.filter((r) => !isActiveStatus(r.status))
    return rows
  }, [rows, statusFilter])

  const activeCount = useMemo(
    () => rows.filter((r) => isActiveStatus(r.status)).length,
    [rows],
  )

  async function handleSave(form) {
    try {
      await upsert(form)
      toast.success(t('Saved_successfully', 'Saved successfully'))
      setPanel(null)
    } catch (err) {
      toast.error(err?.message || t('Save_failed', 'Save failed'))
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await remove(deleteTarget.id, deleteTarget)
      toast.success(t('Deleted_successfully', 'Deleted successfully'))
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err?.message || t('Delete_failed', 'Delete failed'))
    }
  }

  const panelTitle =
    panel?.mode === 'edit'
      ? t('Edit_User', 'Edit User')
      : panel?.mode === 'view'
        ? t('View_User', 'View User')
        : t('Add_User', 'Add User')

  return (
    <Box className="generic-crud-page">
      <Box className="generic-crud-page-header">
        <UIText as="h2" variant="h24SemiBold">
          {t('User_Management', 'User Management')}
        </UIText>
        <UIAddButton label={t('Add_User', 'Add User')} onClick={() => setPanel({ mode: 'add' })} />
      </Box>
      <UISummaryStatusRow
        totalCount={rows.length}
        activeCount={activeCount}
        inactiveCount={rows.length - activeCount}
        totalLabel={t('Total_Users', 'Total Users')}
        activeLabel={t('Active_Users', 'Active Users')}
        inactiveLabel={t('Inactive_Users', 'Inactive Users')}
        value={statusFilter}
        onChange={setStatusFilter}
      />
      <Box className="generic-crud-export">
        <UIPdfExcelDownload
          title={t('User_List', 'User List')}
          columns={columns}
          data={filtered}
          pdfFileName="user_management.pdf"
          excelFileName="user_management.xlsx"
        />
      </Box>
      <UICard>
        {loading ? <UILoader label={t('Loading', 'Loading…')} /> : null}
        {error ? (
          <UIText variant="b13Regular" className="generic-crud-page-error">
            {error}
          </UIText>
        ) : null}
        <UIDataTable
          title={t('User_List', 'User List')}
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
      <UIRightPanel open={Boolean(panel)} title={panelTitle} onClose={() => setPanel(null)}>
        {panel ? (
          <UserForm
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
        title={t('Delete_User', 'Delete User')}
        message={t('Delete_confirm', 'Are you sure you want to delete this record? This action cannot be undone.')}
        confirmLabel={t('Delete', 'Delete')}
        cancelLabel={t('Cancel', 'Cancel')}
        tone="danger"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Box>
  )
}
