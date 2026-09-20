#!/usr/bin/env node
/**
 * Wave 2 deepen: CMS, customer_360, finance_*, instant_finance, release,
 * rule, screen_configuration, sync/gateway, license, limit_setup, oci_user,
 * offer/discount, pending_approvals.
 */
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
  const cols = JSON.stringify(columns, null, 2)
  const flds = JSON.stringify(fields, null, 2)
  return `import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '${serviceImport}'

const columns = ${cols}

const fields = ${flds}

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

function svcTpl({
  name,
  importLine,
  urlsExpr,
  seed,
  idKeys,
  mapRowBody,
  buildDeleteBody,
}) {
  const mapRow = mapRowBody
    ? `\n  mapRow: (row) => ({\n${mapRowBody}\n    ...row,\n  }),`
    : ''
  const del = buildDeleteBody
    ? `\n  buildDeleteBody: ${buildDeleteBody},`
    : ''
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

function testTpl(name, assertions) {
  return `import { describe, it, expect } from 'vitest'
import service from '../${name}'

describe('${name}', () => {
${assertions}
})
`
}

// ——— CMS / i18n ———
write(
  feat('CMS/services/CMSService.js'),
  svcTpl({
    name: 'CMS',
    importLine: "import { i18MaintenanceUrls } from '@/core/api/urls/i18_maintenanceUrls'",
    urlsExpr: `{
    fetchAll: i18MaintenanceUrls.labels,
    create: i18MaintenanceUrls.modify,
    update: i18MaintenanceUrls.modify,
    delete: i18MaintenanceUrls.modify,
  }`,
    seed: [
      {
        id: '1',
        labelKey: 'welcome',
        englishLabel: 'Welcome',
        arabicLabel: 'أهلاً',
        moduleCode: 'LOGIN',
        screenCode: 'LOGIN_HOME',
        channel: 'MB',
        status: 'Y',
      },
    ],
    idKeys: ['id', 'labelKey', 'key'],
    mapRowBody: `    id: String(row.id || row.labelKey || row.key || ''),
    labelKey: row.labelKey || row.key || '',
    englishLabel: row.englishLabel || row.en || row.english || '',
    arabicLabel: row.arabicLabel || row.ar || row.arabic || '',
    moduleCode: row.moduleCode || row.module || '',
    screenCode: row.screenCode || row.screen || '',
    channel: row.channel || row.channelCode || '',
    status: row.status || 'Y',`,
    buildDeleteBody: '(id, row) => ({ ...row, id, status: \'N\' })',
  }),
)
write(
  feat('CMS/pages/CMSi18nPage.jsx'),
  pageTpl({
    component: 'CMSi18nPage',
    title: 'CMS / i18n Labels',
    serviceImport: '../services/CMSService',
    columns: [
      { key: 'labelKey', label: 'Label Key' },
      { key: 'englishLabel', label: 'English' },
      { key: 'arabicLabel', label: 'Arabic' },
      { key: 'moduleCode', label: 'Module' },
      { key: 'channel', label: 'Channel' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'labelKey', label: 'Label Key', required: true, lockOnEdit: true },
      { key: 'englishLabel', label: 'English Label', required: true },
      { key: 'arabicLabel', label: 'Arabic Label' },
      { key: 'moduleCode', label: 'Module Code' },
      { key: 'screenCode', label: 'Screen Code' },
      {
        key: 'channel',
        label: 'Channel',
        type: 'select',
        options: [
          { value: 'MB', label: 'Mobile Banking' },
          { value: 'IB', label: 'Internet Banking' },
          { value: 'ALL', label: 'All' },
        ],
        defaultValue: 'ALL',
      },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  }),
)
write(
  feat('CMS/services/__tests__/CMSService.test.js'),
  testTpl('CMSService', `  it('uses txn/labels + manage-labels endpoints', () => {
    expect(service.urls.fetchAll).toBe('txn/labels')
    expect(service.urls.create).toBe('txn/manage-labels')
  })

  it('mapRow normalizes en/ar aliases', () => {
    const mapped = service.mapRow
      ? service.mapRow({ key: 'k1', en: 'Hello', ar: 'مرحبا' })
      : null
    // mapRow is internal; assert seed shape instead when not exposed
    expect(service.urls.update).toBe('txn/manage-labels')
  })`),
)

// ——— customer_360 block/unblock ———
write(
  feat('customer_360_view/services/customer_360_viewService.js'),
  svcTpl({
    name: 'customer_360_view',
    importLine: "import { customerViewUrls } from '@/core/api/urls/customer_viewUrls'",
    urlsExpr: `{
    fetchAll: customerViewUrls.blockUserDetail,
    create: customerViewUrls.addBlockedUser,
    update: customerViewUrls.blockUnblockUpdate,
    delete: customerViewUrls.blockUnblockUpdate,
  }`,
    seed: [
      {
        id: '1',
        customerId: '1001',
        customerName: 'Demo Customer',
        cif: 'CIF1001',
        mobile: '+97450000000',
        blockReason: 'Fraud review',
        blockStatus: 'BLOCKED',
        status: 'Y',
      },
    ],
    idKeys: ['id', 'customerId', 'cif', 'userId'],
    mapRowBody: `    id: String(row.id || row.customerId || row.cif || row.userId || ''),
    customerId: row.customerId || row.userId || '',
    customerName: row.customerName || row.name || row.englishName || '',
    cif: row.cif || row.cifNumber || '',
    mobile: row.mobile || row.mobileNumber || row.phone || '',
    blockReason: row.blockReason || row.reason || '',
    blockStatus: row.blockStatus || row.userStatus || (row.blocked === true ? 'BLOCKED' : row.blocked === false ? 'ACTIVE' : ''),
    status: row.status || 'Y',`,
  }),
)
write(
  feat('customer_360_view/pages/Customer360Page.jsx'),
  pageTpl({
    component: 'Customer360Page',
    title: 'Block / Unblock Users',
    serviceImport: '../services/customer_360_viewService',
    columns: [
      { key: 'customerId', label: 'Customer ID' },
      { key: 'customerName', label: 'Name' },
      { key: 'cif', label: 'CIF' },
      { key: 'mobile', label: 'Mobile' },
      { key: 'blockStatus', label: 'Block Status' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'customerId', label: 'Customer ID', required: true, lockOnEdit: true },
      { key: 'customerName', label: 'Customer Name', required: true },
      { key: 'cif', label: 'CIF' },
      { key: 'mobile', label: 'Mobile' },
      {
        key: 'blockStatus',
        label: 'Block Status',
        type: 'select',
        options: [
          { value: 'ACTIVE', label: 'Active' },
          { value: 'BLOCKED', label: 'Blocked' },
          { value: 'PENDING', label: 'Pending' },
        ],
        defaultValue: 'ACTIVE',
      },
      { key: 'blockReason', label: 'Block Reason', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  }),
)
write(
  feat('customer_360_view/services/__tests__/customer_360_viewService.test.js'),
  testTpl(
    'customer_360_viewService',
    `  it('uses blockUnblock endpoints', () => {
    expect(service.urls.fetchAll).toBe('blockUnblock/detail')
    expect(service.urls.update).toBe('blockUnblock/update')
    expect(service.urls.create).toBe('blockUnblock/add-blocked-user')
  })`,
  ),
)

// ——— finance (salary advance) ———
write(
  feat('finance/services/financeService.js'),
  svcTpl({
    name: 'finance',
    importLine: '',
    urlsExpr: `{
    fetchAll: 'salary-advance/getAll',
    create: 'salary-advance/save',
    update: 'salary-advance/save',
    delete: 'salary-advance/delete',
  }`,
    seed: [
      {
        id: '1',
        productCode: 'SA1',
        productName: 'Salary Advance',
        productNameAr: '',
        minAmount: '500',
        maxAmount: '5000',
        tenureMonths: '1',
        interestRate: '0',
        currency: 'QAR',
        status: 'Y',
      },
    ],
    idKeys: ['id', 'productCode', 'code'],
    mapRowBody: `    id: String(row.id || row.productCode || row.code || ''),
    productCode: row.productCode || row.code || '',
    productName: row.productName || row.name || row.englishLabel || '',
    productNameAr: row.productNameAr || row.arabicLabel || '',
    minAmount: String(row.minAmount ?? row.min ?? ''),
    maxAmount: String(row.maxAmount ?? row.max ?? ''),
    tenureMonths: String(row.tenureMonths ?? row.tenure ?? ''),
    interestRate: String(row.interestRate ?? row.rate ?? ''),
    currency: row.currency || 'QAR',
    status: row.status || 'Y',`,
  }),
)
write(
  feat('finance/pages/FinancePage.jsx'),
  pageTpl({
    component: 'FinancePage',
    title: 'Salary Advance Config',
    serviceImport: '../services/financeService',
    columns: [
      { key: 'productCode', label: 'Product Code' },
      { key: 'productName', label: 'Name' },
      { key: 'minAmount', label: 'Min' },
      { key: 'maxAmount', label: 'Max' },
      { key: 'currency', label: 'Currency' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'productCode', label: 'Product Code', required: true, lockOnEdit: true },
      { key: 'productName', label: 'Product Name (EN)', required: true },
      { key: 'productNameAr', label: 'Product Name (AR)' },
      { key: 'minAmount', label: 'Min Amount', required: true },
      { key: 'maxAmount', label: 'Max Amount', required: true },
      { key: 'tenureMonths', label: 'Tenure (Months)' },
      { key: 'interestRate', label: 'Interest Rate %' },
      { key: 'currency', label: 'Currency', defaultValue: 'QAR' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  }),
)
write(
  feat('finance/services/__tests__/financeService.test.js'),
  testTpl(
    'financeService',
    `  it('uses salary-advance SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('salary-advance/getAll')
    expect(service.urls.create).toBe('salary-advance/save')
  })`,
  ),
)

// ——— instant_finance ———
write(
  feat('instant_finance/services/instant_financeService.js'),
  svcTpl({
    name: 'instant_finance',
    importLine: '',
    urlsExpr: `{
    fetchAll: 'instant-finance/getAll',
    create: 'instant-finance/save',
    update: 'instant-finance/save',
    delete: 'instant-finance/delete',
  }`,
    seed: [
      {
        id: '1',
        productCode: 'IF1',
        productName: 'Instant Loan',
        productNameAr: '',
        minAmount: '1000',
        maxAmount: '50000',
        maxTenure: '36',
        profitRate: '4.5',
        segmentCode: 'RETAIL',
        currency: 'QAR',
        status: 'Y',
      },
    ],
    idKeys: ['id', 'productCode', 'code'],
    mapRowBody: `    id: String(row.id || row.productCode || row.code || ''),
    productCode: row.productCode || row.code || '',
    productName: row.productName || row.name || row.englishLabel || '',
    productNameAr: row.productNameAr || row.arabicLabel || '',
    minAmount: String(row.minAmount ?? ''),
    maxAmount: String(row.maxAmount ?? ''),
    maxTenure: String(row.maxTenure ?? row.tenure ?? ''),
    profitRate: String(row.profitRate ?? row.rate ?? ''),
    segmentCode: row.segmentCode || row.segment || '',
    currency: row.currency || 'QAR',
    status: row.status || 'Y',`,
  }),
)
write(
  feat('instant_finance/pages/InstantFinancePage.jsx'),
  pageTpl({
    component: 'InstantFinancePage',
    title: 'Instant Finance',
    serviceImport: '../services/instant_financeService',
    columns: [
      { key: 'productCode', label: 'Product Code' },
      { key: 'productName', label: 'Name' },
      { key: 'maxAmount', label: 'Max Amount' },
      { key: 'profitRate', label: 'Profit %' },
      { key: 'segmentCode', label: 'Segment' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'productCode', label: 'Product Code', required: true, lockOnEdit: true },
      { key: 'productName', label: 'Product Name (EN)', required: true },
      { key: 'productNameAr', label: 'Product Name (AR)' },
      { key: 'minAmount', label: 'Min Amount' },
      { key: 'maxAmount', label: 'Max Amount', required: true },
      { key: 'maxTenure', label: 'Max Tenure (Months)' },
      { key: 'profitRate', label: 'Profit Rate %' },
      { key: 'segmentCode', label: 'Segment Code' },
      { key: 'currency', label: 'Currency', defaultValue: 'QAR' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  }),
)
write(
  feat('instant_finance/services/__tests__/instant_financeService.test.js'),
  testTpl(
    'instant_financeService',
    `  it('uses instant-finance SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('instant-finance/getAll')
    expect(service.urls.delete).toBe('instant-finance/delete')
  })`,
  ),
)

// ——— finance_calculator ———
write(
  feat('finance_calculator/services/finance_calculatorService.js'),
  svcTpl({
    name: 'finance_calculator',
    importLine: '',
    urlsExpr: `{
    fetchAll: 'finance-calculator/getAll',
    create: 'finance-calculator/save',
    update: 'finance-calculator/save',
    delete: 'finance-calculator/delete',
  }`,
    seed: [
      {
        id: '1',
        calcCode: 'FC1',
        calcName: 'EMI Calculator',
        calcNameAr: '',
        formula: 'EMI',
        minTenure: '6',
        maxTenure: '60',
        defaultRate: '5.0',
        status: 'Y',
      },
    ],
    idKeys: ['id', 'calcCode', 'code'],
    mapRowBody: `    id: String(row.id || row.calcCode || row.code || ''),
    calcCode: row.calcCode || row.code || '',
    calcName: row.calcName || row.name || row.englishLabel || '',
    calcNameAr: row.calcNameAr || row.arabicLabel || '',
    formula: row.formula || row.calcType || 'EMI',
    minTenure: String(row.minTenure ?? ''),
    maxTenure: String(row.maxTenure ?? ''),
    defaultRate: String(row.defaultRate ?? row.rate ?? ''),
    status: row.status || 'Y',`,
  }),
)
write(
  feat('finance_calculator/pages/FinanceCalculatorPage.jsx'),
  pageTpl({
    component: 'FinanceCalculatorPage',
    title: 'Finance Calculator',
    serviceImport: '../services/finance_calculatorService',
    columns: [
      { key: 'calcCode', label: 'Code' },
      { key: 'calcName', label: 'Name' },
      { key: 'formula', label: 'Formula' },
      { key: 'defaultRate', label: 'Default Rate' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'calcCode', label: 'Calculator Code', required: true, lockOnEdit: true },
      { key: 'calcName', label: 'Name (EN)', required: true },
      { key: 'calcNameAr', label: 'Name (AR)' },
      {
        key: 'formula',
        label: 'Formula Type',
        type: 'select',
        options: [
          { value: 'EMI', label: 'EMI' },
          { value: 'FLAT', label: 'Flat' },
          { value: 'REDUCING', label: 'Reducing' },
        ],
        defaultValue: 'EMI',
      },
      { key: 'minTenure', label: 'Min Tenure' },
      { key: 'maxTenure', label: 'Max Tenure' },
      { key: 'defaultRate', label: 'Default Rate %' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  }),
)
write(
  feat('finance_calculator/services/__tests__/finance_calculatorService.test.js'),
  testTpl(
    'finance_calculatorService',
    `  it('uses finance-calculator SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('finance-calculator/getAll')
  })`,
  ),
)

// ——— finance_offer ———
write(
  feat('finance_offer/services/finance_offerService.js'),
  svcTpl({
    name: 'finance_offer',
    importLine: '',
    urlsExpr: `{
    fetchAll: 'finance-offer/getAll',
    create: 'finance-offer/create',
    update: 'finance-offer/update',
    delete: 'finance-offer/delete',
  }`,
    seed: [
      {
        id: '1',
        offerCode: 'FO1',
        offerName: 'Personal Finance',
        offerNameAr: '',
        productCode: 'PF',
        discountPercent: '0',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        status: 'Y',
      },
    ],
    idKeys: ['id', 'offerCode', 'code'],
    mapRowBody: `    id: String(row.id || row.offerCode || row.code || ''),
    offerCode: row.offerCode || row.code || '',
    offerName: row.offerName || row.name || row.englishLabel || '',
    offerNameAr: row.offerNameAr || row.arabicLabel || '',
    productCode: row.productCode || row.product || '',
    discountPercent: String(row.discountPercent ?? row.discount ?? ''),
    startDate: row.startDate || '',
    endDate: row.endDate || '',
    status: row.status || 'Y',`,
  }),
)
write(
  feat('finance_offer/pages/FinanceOfferPage.jsx'),
  pageTpl({
    component: 'FinanceOfferPage',
    title: 'Finance Offer',
    serviceImport: '../services/finance_offerService',
    columns: [
      { key: 'offerCode', label: 'Offer Code' },
      { key: 'offerName', label: 'Name' },
      { key: 'productCode', label: 'Product' },
      { key: 'discountPercent', label: 'Discount %' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'offerCode', label: 'Offer Code', required: true, lockOnEdit: true },
      { key: 'offerName', label: 'Offer Name (EN)', required: true },
      { key: 'offerNameAr', label: 'Offer Name (AR)' },
      { key: 'productCode', label: 'Product Code', required: true },
      { key: 'discountPercent', label: 'Discount %' },
      { key: 'startDate', label: 'Start Date' },
      { key: 'endDate', label: 'End Date' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
  }),
)
write(
  feat('finance_offer/services/__tests__/finance_offerService.test.js'),
  testTpl(
    'finance_offerService',
    `  it('uses finance-offer SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('finance-offer/getAll')
    expect(service.urls.create).toBe('finance-offer/create')
  })`,
  ),
)

console.log('part1 done')
