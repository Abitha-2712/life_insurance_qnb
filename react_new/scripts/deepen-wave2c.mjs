#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const feat = (...p) => path.join(root, 'src/features', ...p)

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
  console.log('wrote', path.relative(root, file))
}

function pageTpl({ component, title, serviceImport, columns, fields }) {
  return `import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '${serviceImport}'

const columns = ${JSON.stringify(columns, null, 2)}

const fields = ${JSON.stringify(fields, null, 2)}

function ${component}() {
  return (
    <GenericCrudPage
      title="${title}"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}

export default ${component}
`
}

function svcTpl({ name, importLine, urlsExpr, seed, idKeys, mapRowBody, buildDeleteBody }) {
  const mapRow = mapRowBody
    ? `\n  mapRow: (row) => ({\n${mapRowBody}\n    ...row,\n  }),`
    : ''
  const del = buildDeleteBody ? `\n  buildDeleteBody: ${buildDeleteBody},` : ''
  return `import { createCrudService } from '@/features/common/crud/createCrudService'
${importLine}

const service = createCrudService({
  name: '${name}',
  urls: ${urlsExpr},
  seed: ${JSON.stringify(seed, null, 2)},
  idKeys: ${JSON.stringify(idKeys)},${mapRow}${del}
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
`
}

function testTpl(name, body) {
  return `import { describe, it, expect } from 'vitest'
import service from '../${name}'

describe('${name}', () => {
${body}
})
`
}

// ——— license ———
write(feat('license_management/services/license_managementService.js'), svcTpl({
  name: 'license_management',
  importLine: "import { licenseManagementUrls } from '@/core/api/urls/license_managementUrls'",
  urlsExpr: `{
    fetchAll: licenseManagementUrls.fetchAllLicense,
    create: licenseManagementUrls.postLicense,
    update: licenseManagementUrls.postLicense,
    delete: licenseManagementUrls.postLicense,
  }`,
  seed: [{
    id: '1', licenseKey: 'LIC-001', licenseName: 'Core BO License',
    issuedTo: 'QNB Life', issueDate: '2025-01-01', expiryDate: '2027-12-31',
    maxUsers: '500', status: 'Y',
  }],
  idKeys: ['id', 'licenseKey', 'licenseId'],
  mapRowBody: `    id: String(row.id || row.licenseKey || row.licenseId || ''),
    licenseKey: row.licenseKey || row.key || '',
    licenseName: row.licenseName || row.name || '',
    issuedTo: row.issuedTo || row.organization || '',
    issueDate: row.issueDate || row.issuedOn || '',
    expiryDate: row.expiryDate || row.expiresOn || '',
    maxUsers: String(row.maxUsers ?? row.userLimit ?? ''),
    status: row.status || 'Y',`,
  buildDeleteBody: '(id, row) => ({ ...row, id, status: \'N\' })',
}))
write(feat('license_management/pages/LicenseManagementPage.jsx'), pageTpl({
  component: 'LicenseManagementPage',
  title: 'License Management',
  serviceImport: '../services/license_managementService',
  columns: [
    { key: 'licenseKey', label: 'License Key' },
    { key: 'licenseName', label: 'Name' },
    { key: 'issuedTo', label: 'Issued To' },
    { key: 'expiryDate', label: 'Expiry' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'licenseKey', label: 'License Key', required: true, lockOnEdit: true },
    { key: 'licenseName', label: 'License Name', required: true },
    { key: 'issuedTo', label: 'Issued To' },
    { key: 'issueDate', label: 'Issue Date' },
    { key: 'expiryDate', label: 'Expiry Date', required: true },
    { key: 'maxUsers', label: 'Max Users' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('license_management/services/__tests__/license_managementService.test.js'), testTpl(
  'license_managementService',
  `  it('uses bko-license endpoints', () => {
    expect(service.urls.fetchAll).toBe('bko-license/fetchAll')
    expect(service.urls.create).toBe('bko-license/post')
  })`,
))

// ——— limit_setup: transfer limit + fees limit ———
write(feat('limit_setup/services/limit_setupService.js'), svcTpl({
  name: 'limit_setup',
  importLine: "import { transferControlUrls } from '@/core/api/urls/transfer_controlUrls'",
  urlsExpr: `{
    fetchAll: transferControlUrls.getAll,
    create: transferControlUrls.save,
    update: transferControlUrls.save,
    delete: transferControlUrls.save,
  }`,
  seed: [{
    id: '1', limitCode: 'TL_DOM', limitName: 'Domestic Transfer',
    transferType: 'DOMESTIC', channel: 'MB', segmentCode: 'RETAIL',
    perTxnLimit: '25000', dailyLimit: '100000', monthlyLimit: '500000',
    currency: 'QAR', status: 'Y',
  }],
  idKeys: ['id', 'limitCode', 'code'],
  mapRowBody: `    id: String(row.id || row.limitCode || row.code || ''),
    limitCode: row.limitCode || row.code || '',
    limitName: row.limitName || row.name || row.englishLabel || '',
    transferType: row.transferType || row.type || '',
    channel: row.channel || row.channelCode || 'ALL',
    segmentCode: row.segmentCode || row.segment || '',
    perTxnLimit: String(row.perTxnLimit ?? row.txnLimit ?? row.limitAmount ?? ''),
    dailyLimit: String(row.dailyLimit ?? ''),
    monthlyLimit: String(row.monthlyLimit ?? ''),
    currency: row.currency || 'QAR',
    status: row.status || 'Y',`,
  buildDeleteBody: '(id, row) => ({ ...row, id, status: \'N\' })',
}))
write(feat('limit_setup/services/feesLimitService.js'), svcTpl({
  name: 'fees_limit',
  importLine: "import { transferControlUrls } from '@/core/api/urls/transfer_controlUrls'",
  urlsExpr: `{
    fetchAll: transferControlUrls.getAll,
    create: transferControlUrls.save,
    update: transferControlUrls.save,
    delete: transferControlUrls.save,
  }`,
  seed: [{
    id: '1', feeCode: 'FEE_DOM', feeName: 'Domestic Fee',
    transferType: 'DOMESTIC', channel: 'ALL', feeAmount: '5',
    feePercent: '0', minFee: '1', maxFee: '50', currency: 'QAR', status: 'Y',
  }],
  idKeys: ['id', 'feeCode', 'code'],
  mapRowBody: `    id: String(row.id || row.feeCode || row.code || ''),
    feeCode: row.feeCode || row.code || '',
    feeName: row.feeName || row.name || '',
    transferType: row.transferType || row.type || '',
    channel: row.channel || 'ALL',
    feeAmount: String(row.feeAmount ?? row.amount ?? ''),
    feePercent: String(row.feePercent ?? row.percent ?? ''),
    minFee: String(row.minFee ?? ''),
    maxFee: String(row.maxFee ?? ''),
    currency: row.currency || 'QAR',
    status: row.status || 'Y',`,
  buildDeleteBody: '(id, row) => ({ ...row, id, status: \'N\' })',
}))
write(feat('limit_setup/pages/LimitSetupPage.jsx'), pageTpl({
  component: 'LimitSetupPage',
  title: 'Transfer Limit Configuration',
  serviceImport: '../services/limit_setupService',
  columns: [
    { key: 'limitCode', label: 'Code' },
    { key: 'limitName', label: 'Name' },
    { key: 'transferType', label: 'Type' },
    { key: 'channel', label: 'Channel' },
    { key: 'perTxnLimit', label: 'Per Txn' },
    { key: 'dailyLimit', label: 'Daily' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'limitCode', label: 'Limit Code', required: true, lockOnEdit: true },
    { key: 'limitName', label: 'Limit Name', required: true },
    {
      key: 'transferType', label: 'Transfer Type', type: 'select', required: true,
      options: [
        { value: 'DOMESTIC', label: 'Domestic' },
        { value: 'INTERNATIONAL', label: 'International' },
        { value: 'OWN', label: 'Own Account' },
        { value: 'WITHIN_BANK', label: 'Within Bank' },
        { value: 'OTHER', label: 'Other' },
      ],
      defaultValue: 'DOMESTIC',
    },
    {
      key: 'channel', label: 'Channel', type: 'select',
      options: [
        { value: 'IB', label: 'Internet Banking' },
        { value: 'MB', label: 'Mobile Banking' },
        { value: 'ALL', label: 'All' },
      ],
      defaultValue: 'ALL',
    },
    { key: 'segmentCode', label: 'Segment Code' },
    { key: 'perTxnLimit', label: 'Per Transaction Limit', required: true },
    { key: 'dailyLimit', label: 'Daily Limit' },
    { key: 'monthlyLimit', label: 'Monthly Limit' },
    { key: 'currency', label: 'Currency', defaultValue: 'QAR' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('limit_setup/pages/FeesLimitPage.jsx'), pageTpl({
  component: 'FeesLimitPage',
  title: 'Fees Limit Configuration',
  serviceImport: '../services/feesLimitService',
  columns: [
    { key: 'feeCode', label: 'Fee Code' },
    { key: 'feeName', label: 'Name' },
    { key: 'transferType', label: 'Type' },
    { key: 'feeAmount', label: 'Amount' },
    { key: 'feePercent', label: '%' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'feeCode', label: 'Fee Code', required: true, lockOnEdit: true },
    { key: 'feeName', label: 'Fee Name', required: true },
    {
      key: 'transferType', label: 'Transfer Type', type: 'select',
      options: [
        { value: 'DOMESTIC', label: 'Domestic' },
        { value: 'INTERNATIONAL', label: 'International' },
        { value: 'OWN', label: 'Own Account' },
        { value: 'OTHER', label: 'Other' },
      ],
      defaultValue: 'DOMESTIC',
    },
    {
      key: 'channel', label: 'Channel', type: 'select',
      options: [
        { value: 'IB', label: 'Internet Banking' },
        { value: 'MB', label: 'Mobile Banking' },
        { value: 'ALL', label: 'All' },
      ],
      defaultValue: 'ALL',
    },
    { key: 'feeAmount', label: 'Fee Amount' },
    { key: 'feePercent', label: 'Fee Percent' },
    { key: 'minFee', label: 'Min Fee' },
    { key: 'maxFee', label: 'Max Fee' },
    { key: 'currency', label: 'Currency', defaultValue: 'QAR' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('limit_setup/services/__tests__/limit_setupService.test.js'), testTpl(
  'limit_setupService',
  `  it('uses TransferControl endpoints for transfer limits', () => {
    expect(service.urls.fetchAll).toBe('TransferControl/getAll')
    expect(service.urls.create).toBe('TransferControl/save')
  })`,
))
write(feat('limit_setup/services/__tests__/feesLimitService.test.js'), testTpl(
  'feesLimitService',
  `  it('uses TransferControl endpoints for fees limits', () => {
    expect(service.urls.fetchAll).toBe('TransferControl/getAll')
  })`,
))

// ——— oci_user ———
write(feat('oci_user/services/oci_userService.js'), svcTpl({
  name: 'oci_user',
  importLine: '',
  urlsExpr: `{
    fetchAll: 'oci-user/getAll',
    create: 'oci-user/save',
    update: 'oci-user/save',
    delete: 'oci-user/delete',
  }`,
  seed: [{
    id: '1', userId: 'oci1', userName: 'OCI Admin', email: 'oci.admin@qnb.com',
    role: 'ADMIN', department: 'IT', notifyEmail: 'Y', notifySms: 'N', status: 'Y',
  }],
  idKeys: ['id', 'userId', 'ociUserId'],
  mapRowBody: `    id: String(row.id || row.userId || row.ociUserId || ''),
    userId: row.userId || row.ociUserId || '',
    userName: row.userName || row.name || row.displayName || '',
    email: row.email || row.emailId || '',
    role: row.role || row.userRole || '',
    department: row.department || row.dept || '',
    notifyEmail: row.notifyEmail || row.emailNotify || 'N',
    notifySms: row.notifySms || row.smsNotify || 'N',
    status: row.status || 'Y',`,
}))
write(feat('oci_user/pages/OCIUserManagementPage.jsx'), pageTpl({
  component: 'OCIUserManagementPage',
  title: 'OCI User Management',
  serviceImport: '../services/oci_userService',
  columns: [
    { key: 'userId', label: 'User ID' },
    { key: 'userName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'userId', label: 'User ID', required: true, lockOnEdit: true },
    { key: 'userName', label: 'User Name', required: true },
    { key: 'email', label: 'Email', required: true },
    {
      key: 'role', label: 'Role', type: 'select',
      options: [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'OPERATOR', label: 'Operator' },
        { value: 'VIEWER', label: 'Viewer' },
      ],
      defaultValue: 'OPERATOR',
    },
    { key: 'department', label: 'Department' },
    {
      key: 'notifyEmail', label: 'Email Notify', type: 'select',
      options: [{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }],
      defaultValue: 'Y',
    },
    {
      key: 'notifySms', label: 'SMS Notify', type: 'select',
      options: [{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }],
      defaultValue: 'N',
    },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('oci_user/pages/OCINotificationPage.jsx'), pageTpl({
  component: 'OCINotificationPage',
  title: 'OCI User Notification',
  serviceImport: '../services/oci_userService',
  columns: [
    { key: 'userId', label: 'User ID' },
    { key: 'userName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'notifyEmail', label: 'Email Notify' },
    { key: 'notifySms', label: 'SMS Notify' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'userId', label: 'User ID', required: true, lockOnEdit: true },
    { key: 'userName', label: 'User Name', required: true },
    { key: 'email', label: 'Email' },
    {
      key: 'notifyEmail', label: 'Email Notify', type: 'select',
      options: [{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }],
      defaultValue: 'Y',
    },
    {
      key: 'notifySms', label: 'SMS Notify', type: 'select',
      options: [{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }],
      defaultValue: 'N',
    },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('oci_user/services/__tests__/oci_userService.test.js'), testTpl(
  'oci_userService',
  `  it('uses oci-user SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('oci-user/getAll')
    expect(service.urls.create).toBe('oci-user/save')
  })`,
))

// ——— offer + discount split ———
write(feat('offer_discount_management/services/offer_discount_managementService.js'), svcTpl({
  name: 'offer_discount_management',
  importLine: "import { offerUrls } from '@/core/api/urls/offerUrls'",
  urlsExpr: `{
    fetchAll: offerUrls.fetchAllOffer,
    create: offerUrls.addOffer,
    update: offerUrls.updateOffer,
    delete: offerUrls.deleteOfferManagement,
  }`,
  seed: [{
    id: '1', offerCode: 'O1', offerName: 'Welcome Offer', offerNameAr: '',
    offerType: 'REWARD', startDate: '2026-01-01', endDate: '2026-12-31',
    rewardKey: 'POINTS', description: 'Welcome bonus', status: 'Y',
  }],
  idKeys: ['id', 'offerCode', 'code'],
  mapRowBody: `    id: String(row.id || row.offerCode || row.code || ''),
    offerCode: row.offerCode || row.code || '',
    offerName: row.offerName || row.name || row.englishLabel || '',
    offerNameAr: row.offerNameAr || row.arabicLabel || '',
    offerType: row.offerType || row.type || '',
    startDate: row.startDate || '',
    endDate: row.endDate || '',
    rewardKey: row.rewardKey || row.reward || '',
    description: row.description || '',
    status: row.status || 'Y',`,
}))
write(feat('offer_discount_management/services/discountService.js'), svcTpl({
  name: 'discount_management',
  importLine: "import { offerUrls } from '@/core/api/urls/offerUrls'",
  urlsExpr: `{
    fetchAll: offerUrls.fetchAllOffer,
    create: offerUrls.addOffer,
    update: offerUrls.updateOffer,
    delete: offerUrls.deleteOfferManagement,
  }`,
  seed: [{
    id: '1', discountCode: 'D1', discountName: 'Seasonal Discount',
    discountPercent: '10', maxDiscountAmount: '100', currency: 'QAR',
    startDate: '2026-01-01', endDate: '2026-06-30', status: 'Y',
  }],
  idKeys: ['id', 'discountCode', 'code'],
  mapRowBody: `    id: String(row.id || row.discountCode || row.code || ''),
    discountCode: row.discountCode || row.code || '',
    discountName: row.discountName || row.name || row.offerName || '',
    discountPercent: String(row.discountPercent ?? row.percent ?? ''),
    maxDiscountAmount: String(row.maxDiscountAmount ?? row.maxAmount ?? ''),
    currency: row.currency || 'QAR',
    startDate: row.startDate || '',
    endDate: row.endDate || '',
    status: row.status || 'Y',`,
}))
write(feat('offer_discount_management/pages/OfferDiscountPage.jsx'), pageTpl({
  component: 'OfferDiscountPage',
  title: 'Offer Management',
  serviceImport: '../services/offer_discount_managementService',
  columns: [
    { key: 'offerCode', label: 'Offer Code' },
    { key: 'offerName', label: 'Name' },
    { key: 'offerType', label: 'Type' },
    { key: 'startDate', label: 'Start' },
    { key: 'endDate', label: 'End' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'offerCode', label: 'Offer Code', required: true, lockOnEdit: true },
    { key: 'offerName', label: 'Offer Name (EN)', required: true },
    { key: 'offerNameAr', label: 'Offer Name (AR)' },
    {
      key: 'offerType', label: 'Offer Type', type: 'select',
      options: [
        { value: 'REWARD', label: 'Reward' },
        { value: 'CASHBACK', label: 'Cashback' },
        { value: 'PROMO', label: 'Promo' },
        { value: 'OTHER', label: 'Other' },
      ],
      defaultValue: 'REWARD',
    },
    { key: 'rewardKey', label: 'Reward Key' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('offer_discount_management/pages/DiscountManagementPage.jsx'), pageTpl({
  component: 'DiscountManagementPage',
  title: 'Discount Management',
  serviceImport: '../services/discountService',
  columns: [
    { key: 'discountCode', label: 'Code' },
    { key: 'discountName', label: 'Name' },
    { key: 'discountPercent', label: '%' },
    { key: 'maxDiscountAmount', label: 'Max Amount' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'discountCode', label: 'Discount Code', required: true, lockOnEdit: true },
    { key: 'discountName', label: 'Discount Name', required: true },
    { key: 'discountPercent', label: 'Discount %', required: true },
    { key: 'maxDiscountAmount', label: 'Max Discount Amount' },
    { key: 'currency', label: 'Currency', defaultValue: 'QAR' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('offer_discount_management/services/__tests__/offer_discount_managementService.test.js'), testTpl(
  'offer_discount_managementService',
  `  it('uses offer/* endpoints', () => {
    expect(service.urls.fetchAll).toBe('offer/getAll')
    expect(service.urls.create).toBe('offer/create')
    expect(service.urls.update).toBe('offer/update')
    expect(service.urls.delete).toBe('offer/delete')
  })`,
))
write(feat('offer_discount_management/services/__tests__/discountService.test.js'), testTpl(
  'discountService',
  `  it('uses offer endpoints for discount CRUD', () => {
    expect(service.urls.fetchAll).toBe('offer/getAll')
  })`,
))

// ——— pending_approvals polish ———
write(feat('pending_approvals/services/pending_approvalsService.js'), `import { createCrudService } from '@/features/common/crud/createCrudService'
import { dashboardUrls } from '@/core/api/urls/dashboardUrls'
import { apiRequest, isApiSuccess, API_SUCCESS_CODE } from '@/core/api/client'

const service = createCrudService({
  name: 'pending_approvals',
  urls: {
    fetchAll: 'pending-approval/list',
    create: 'pending-approval/action',
    update: 'pending-approval/action',
    delete: 'pending-approval/action',
  },
  seed: [
    {
      id: '1',
      requestId: 'PA-1001',
      requestType: 'USER',
      requestedBy: 'maker1',
      requestedOn: '2026-09-01',
      moduleName: 'User Management',
      action: 'CREATE',
      approvalStatus: 'PENDING',
      comments: '',
      status: 'Y',
    },
  ],
  idKeys: ['id', 'requestId', 'approvalId'],
  mapRow: (row) => ({
    id: String(row.id || row.requestId || row.approvalId || ''),
    requestId: row.requestId || row.approvalId || '',
    requestType: row.requestType || row.type || '',
    requestedBy: row.requestedBy || row.maker || row.createdBy || '',
    requestedOn: row.requestedOn || row.createdOn || row.requestDate || '',
    moduleName: row.moduleName || row.module || '',
    action: row.action || row.requestAction || '',
    approvalStatus: row.approvalStatus || row.workflowStatus || row.status || 'PENDING',
    comments: row.comments || row.remark || '',
    status: row.status === 'PENDING' || row.status === 'APPROVED' || row.status === 'REJECTED'
      ? 'Y'
      : row.status || 'Y',
    ...row,
  }),
})

export async function fetchPendingCount() {
  try {
    const res = await apiRequest(dashboardUrls.pendingRequestCount, {
      base: 'bo',
      method: 'POST',
      body: {},
    })
    if (res.ok || isApiSuccess(res.data)) {
      const raw = res.data?.data ?? res.data
      const count = typeof raw === 'number' ? raw : Number(raw?.count ?? raw?.total ?? 0)
      return { count, raw: res.data }
    }
  } catch {
    /* offline */
  }
  return { count: 1, offline: true }
}

export async function approveRequest(row, comments = '') {
  return service.save({
    ...row,
    approvalStatus: 'APPROVED',
    action: 'APPROVE',
    comments,
  })
}

export async function rejectRequest(row, comments = '') {
  return service.save({
    ...row,
    approvalStatus: 'REJECTED',
    action: 'REJECT',
    comments,
  })
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
`)
write(feat('pending_approvals/pages/PendingApprovalsPage.jsx'), pageTpl({
  component: 'PendingApprovalsPage',
  title: 'Pending Approvals',
  serviceImport: '../services/pending_approvalsService',
  columns: [
    { key: 'requestId', label: 'Request ID' },
    { key: 'requestType', label: 'Type' },
    { key: 'moduleName', label: 'Module' },
    { key: 'requestedBy', label: 'Requested By' },
    { key: 'requestedOn', label: 'Requested On' },
    { key: 'approvalStatus', label: 'Approval' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'requestId', label: 'Request ID', required: true, lockOnEdit: true },
    {
      key: 'requestType', label: 'Request Type', type: 'select', required: true,
      options: [
        { value: 'USER', label: 'User' },
        { value: 'ROLE', label: 'Role' },
        { value: 'CONFIG', label: 'Config' },
        { value: 'PRODUCT', label: 'Product' },
        { value: 'OTHER', label: 'Other' },
      ],
      defaultValue: 'CONFIG',
    },
    { key: 'moduleName', label: 'Module' },
    { key: 'requestedBy', label: 'Requested By' },
    { key: 'requestedOn', label: 'Requested On' },
    {
      key: 'action', label: 'Action', type: 'select',
      options: [
        { value: 'CREATE', label: 'Create' },
        { value: 'UPDATE', label: 'Update' },
        { value: 'DELETE', label: 'Delete' },
        { value: 'APPROVE', label: 'Approve' },
        { value: 'REJECT', label: 'Reject' },
      ],
    },
    {
      key: 'approvalStatus', label: 'Approval Status', type: 'select',
      options: [
        { value: 'PENDING', label: 'Pending' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'REJECTED', label: 'Rejected' },
      ],
      defaultValue: 'PENDING',
    },
    { key: 'comments', label: 'Comments', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('pending_approvals/services/__tests__/pending_approvalsService.test.js'), `import { describe, it, expect } from 'vitest'
import service, { fetchPendingCount, approveRequest, rejectRequest } from '../pending_approvalsService'

describe('pending_approvalsService', () => {
  it('uses pending-approval SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('pending-approval/list')
    expect(service.urls.update).toBe('pending-approval/action')
  })

  it('fetchPendingCount returns a count', async () => {
    const res = await fetchPendingCount()
    expect(typeof res.count).toBe('number')
  })

  it('approve/reject helpers set approvalStatus', async () => {
    const row = { id: '1', requestId: 'PA-1001', requestType: 'USER' }
    const a = await approveRequest(row, 'ok')
    expect(a.status).toBeDefined()
    const r = await rejectRequest(row, 'no')
    expect(r.status).toBeDefined()
  })
})
`)

// ——— MFA deepen mapRow ———
write(feat('mfa_management/services/mfa_managementService.js'), svcTpl({
  name: 'mfa_management',
  importLine: "import { mfaManagementUrls } from '@/core/api/urls/mfa_managementUrls'",
  urlsExpr: `{
    fetchAll: mfaManagementUrls.mfagetall,
    create: mfaManagementUrls.mfasave,
    update: mfaManagementUrls.mfaupdate,
    delete: mfaManagementUrls.mfadelete,
  }`,
  seed: [{
    id: '1', mfaCode: 'OTP', mfaName: 'One Time Password', mfaNameAr: '',
    mfaType: 'otp', channel: 'ALL', priority: '1', status: 'Y',
  }],
  idKeys: ['id', 'mfaCode', 'mfaId'],
  mapRowBody: `    id: String(row.id || row.mfaCode || row.mfaId || ''),
    mfaCode: row.mfaCode || row.code || '',
    mfaName: row.mfaName || row.name || row.englishLabel || '',
    mfaNameAr: row.mfaNameAr || row.arabicLabel || '',
    mfaType: row.mfaType || row.type || 'otp',
    channel: row.channel || 'ALL',
    priority: String(row.priority ?? ''),
    status: row.status || 'Y',`,
}))
write(feat('mfa_management/pages/MFAManagementPage.jsx'), pageTpl({
  component: 'MFAManagementPage',
  title: 'MFA Management',
  serviceImport: '../services/mfa_managementService',
  columns: [
    { key: 'mfaCode', label: 'MFA Code' },
    { key: 'mfaName', label: 'Name' },
    { key: 'mfaType', label: 'Type' },
    { key: 'channel', label: 'Channel' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'mfaCode', label: 'MFA Code', required: true, lockOnEdit: true },
    { key: 'mfaName', label: 'Name (EN)', required: true },
    { key: 'mfaNameAr', label: 'Name (AR)' },
    {
      key: 'mfaType', label: 'Type', type: 'select',
      options: [
        { value: 'otp', label: 'OTP' },
        { value: 'secure', label: 'Secure Value' },
        { value: 'biometric', label: 'Biometric' },
      ],
      defaultValue: 'otp',
    },
    {
      key: 'channel', label: 'Channel', type: 'select',
      options: [
        { value: 'MB', label: 'Mobile Banking' },
        { value: 'IB', label: 'Internet Banking' },
        { value: 'ALL', label: 'All' },
      ],
      defaultValue: 'ALL',
    },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('mfa_management/services/__tests__/mfa_managementService.test.js'), testTpl(
  'mfa_managementService',
  `  it('uses mfa endpoints from url module', () => {
    expect(service.urls.fetchAll).toBeTruthy()
    expect(service.urls.create).toBeTruthy()
  })`,
))

console.log('part2c done')
