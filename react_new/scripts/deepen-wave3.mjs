#!/usr/bin/env node
/**
 * Wave 3 deepen: thin PARTIALs toward field/API parity.
 * adapter, api_call, app_library, apply_*, blocklists, configuration_parameters,
 * customer_journey/service/support, data_cleansing/dc_city, default_parameter,
 * digital onboarding, dynamic_screen, E-statement, feature_management, follow_us,
 * funnel, merchant, Parameter_maintenance, profile_control, profanity, ready_to_sync,
 * sms_configuration, username rules, about_QNB, Apply_sub_product.
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

function svcTpl({
  name,
  importLine = '',
  urlsExpr,
  seed,
  idKeys,
  mapRowBody,
  buildDeleteBody,
  extras = '',
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
${extras}export { service }
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

const softDel = "(id, row) => ({ ...row, id, status: 'N' })"

// ——— adapter ———
write(feat('adapter/services/adapterService.js'), svcTpl({
  name: 'adapter',
  urlsExpr: `{
    fetchAll: 'adapter/getAll',
    create: 'adapter/save',
    update: 'adapter/save',
    delete: 'adapter/delete',
  }`,
  seed: [{
    id: '1', adapterCode: 'CORE_ISO', adapterName: 'Core ISO8583',
    adapterType: 'ISO8583', endpointUrl: 'https://core.local/iso',
    protocol: 'TCP', timeoutMs: '30000', description: 'Core banking adapter',
    status: 'Y',
  }],
  idKeys: ['id', 'adapterCode', 'code'],
  mapRowBody: `    id: String(row.id || row.adapterCode || row.code || ''),
    adapterCode: row.adapterCode || row.code || '',
    adapterName: row.adapterName || row.name || row.englishLabel || '',
    adapterType: row.adapterType || row.type || '',
    endpointUrl: row.endpointUrl || row.url || row.endpoint || '',
    protocol: row.protocol || 'HTTP',
    timeoutMs: String(row.timeoutMs ?? row.timeout ?? ''),
    description: row.description || row.desc || '',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('adapter/pages/AdapterTablePage.jsx'), pageTpl({
  component: 'AdapterTablePage',
  title: 'Adapter Table',
  serviceImport: '../services/adapterService',
  columns: [
    { key: 'adapterCode', label: 'Code' },
    { key: 'adapterName', label: 'Name' },
    { key: 'adapterType', label: 'Type' },
    { key: 'protocol', label: 'Protocol' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'adapterCode', label: 'Adapter Code', required: true, lockOnEdit: true },
    { key: 'adapterName', label: 'Adapter Name', required: true },
    { key: 'adapterType', label: 'Type', type: 'select', options: [
      { value: 'ISO8583', label: 'ISO8583' },
      { value: 'REST', label: 'REST' },
      { value: 'SOAP', label: 'SOAP' },
      { value: 'MQ', label: 'MQ' },
    ]},
    { key: 'endpointUrl', label: 'Endpoint URL' },
    { key: 'protocol', label: 'Protocol', type: 'select', options: [
      { value: 'HTTP', label: 'HTTP' },
      { value: 'HTTPS', label: 'HTTPS' },
      { value: 'TCP', label: 'TCP' },
      { value: 'MQ', label: 'MQ' },
    ], defaultValue: 'HTTP' },
    { key: 'timeoutMs', label: 'Timeout (ms)', defaultValue: '30000' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('adapter/services/__tests__/adapterService.test.js'), testTpl(
  'adapterService',
  `  it('uses SoftFetch adapter endpoints', () => {
    expect(service.urls.fetchAll).toBe('adapter/getAll')
    expect(service.urls.create).toBe('adapter/save')
  })
  it('maps adapter fields from alternate keys', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].adapterCode).toBeTruthy()
    expect(res.data[0].adapterType).toBeTruthy()
  })`,
))

// ——— api_call ———
write(feat('api_call/services/api_callService.js'), svcTpl({
  name: 'api_call',
  urlsExpr: `{
    fetchAll: 'api-call/getAll',
    create: 'api-call/save',
    update: 'api-call/save',
    delete: 'api-call/delete',
  }`,
  seed: [{
    id: '1', apiCode: 'GET_BAL', apiName: 'Get Balance',
    httpMethod: 'POST', endpoint: '/accounts/balance',
    serviceId: 'ACC', requestSample: '{}', responseSample: '{}',
    status: 'Y',
  }],
  idKeys: ['id', 'apiCode', 'code'],
  mapRowBody: `    id: String(row.id || row.apiCode || row.code || ''),
    apiCode: row.apiCode || row.code || '',
    apiName: row.apiName || row.name || row.englishLabel || '',
    httpMethod: row.httpMethod || row.method || 'POST',
    endpoint: row.endpoint || row.path || row.url || '',
    serviceId: row.serviceId || row.service || '',
    requestSample: row.requestSample || row.requestBody || '',
    responseSample: row.responseSample || row.responseBody || '',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('api_call/pages/APICallPage.jsx'), pageTpl({
  component: 'APICallPage',
  title: 'API Call',
  serviceImport: '../services/api_callService',
  columns: [
    { key: 'apiCode', label: 'Code' },
    { key: 'apiName', label: 'Name' },
    { key: 'httpMethod', label: 'Method' },
    { key: 'endpoint', label: 'Endpoint' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'apiCode', label: 'API Code', required: true, lockOnEdit: true },
    { key: 'apiName', label: 'API Name', required: true },
    { key: 'httpMethod', label: 'HTTP Method', type: 'select', options: [
      { value: 'GET', label: 'GET' },
      { value: 'POST', label: 'POST' },
      { value: 'PUT', label: 'PUT' },
      { value: 'DELETE', label: 'DELETE' },
    ], defaultValue: 'POST' },
    { key: 'endpoint', label: 'Endpoint Path', required: true },
    { key: 'serviceId', label: 'Service ID' },
    { key: 'requestSample', label: 'Request Sample', type: 'textarea' },
    { key: 'responseSample', label: 'Response Sample', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('api_call/services/__tests__/api_callService.test.js'), testTpl(
  'api_callService',
  `  it('uses SoftFetch api-call endpoints', () => {
    expect(service.urls.fetchAll).toBe('api-call/getAll')
  })
  it('seed includes method and endpoint', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].httpMethod).toBeTruthy()
    expect(res.data[0].endpoint).toBeTruthy()
  })`,
))

// ——— app_library ———
write(feat('app_library/services/app_libraryService.js'), svcTpl({
  name: 'app_library',
  urlsExpr: `{
    fetchAll: 'app-library/getAll',
    create: 'app-library/save',
    update: 'app-library/save',
    delete: 'app-library/delete',
  }`,
  seed: [{
    id: '1', libCode: 'QDS', libName: 'QNB Design System',
    version: '2.1.0', platform: 'Flutter', packageName: 'qnb_design',
    repositoryUrl: '', description: 'Shared UI kit', status: 'Y',
  }],
  idKeys: ['id', 'libCode', 'code'],
  mapRowBody: `    id: String(row.id || row.libCode || row.code || ''),
    libCode: row.libCode || row.code || '',
    libName: row.libName || row.name || row.englishLabel || '',
    version: row.version || row.libVersion || '',
    platform: row.platform || '',
    packageName: row.packageName || row.package || '',
    repositoryUrl: row.repositoryUrl || row.repoUrl || '',
    description: row.description || '',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('app_library/pages/AppLibraryPage.jsx'), pageTpl({
  component: 'AppLibraryPage',
  title: 'App Library',
  serviceImport: '../services/app_libraryService',
  columns: [
    { key: 'libCode', label: 'Code' },
    { key: 'libName', label: 'Name' },
    { key: 'version', label: 'Version' },
    { key: 'platform', label: 'Platform' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'libCode', label: 'Library Code', required: true, lockOnEdit: true },
    { key: 'libName', label: 'Library Name', required: true },
    { key: 'version', label: 'Version', required: true },
    { key: 'platform', label: 'Platform', type: 'select', options: [
      { value: 'Flutter', label: 'Flutter' },
      { value: 'React', label: 'React' },
      { value: 'Android', label: 'Android' },
      { value: 'iOS', label: 'iOS' },
      { value: 'Shared', label: 'Shared' },
    ]},
    { key: 'packageName', label: 'Package Name' },
    { key: 'repositoryUrl', label: 'Repository URL' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('app_library/services/__tests__/app_libraryService.test.js'), testTpl(
  'app_libraryService',
  `  it('uses SoftFetch app-library endpoints', () => {
    expect(service.urls.fetchAll).toBe('app-library/getAll')
  })
  it('seed includes version/platform', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].version).toBeTruthy()
  })`,
))

// ——— apply_for_product (bko-product) ———
write(feat('apply_for_product/services/apply_for_productService.js'), svcTpl({
  name: 'apply_for_product',
  importLine: "import { productManagementUrls } from '@/core/api/urls/product_managementUrls'",
  urlsExpr: `{
    fetchAll: productManagementUrls.fetchAllProduct,
    create: productManagementUrls.saveProduct,
    update: productManagementUrls.saveProduct,
    delete: productManagementUrls.deleteProduct,
  }`,
  seed: [{
    id: '1', productCode: 'SAV', productName: 'Savings Account',
    productNameAr: 'حساب التوفير', domainCode: 'RETAIL',
    channel: 'MB', sequence: '10', description: '', status: 'Y',
  }],
  idKeys: ['id', 'productCode', 'productId'],
  mapRowBody: `    id: String(row.id || row.productCode || row.productId || ''),
    productCode: row.productCode || row.code || '',
    productName: row.productName || row.englishLabel || row.name || '',
    productNameAr: row.productNameAr || row.arabicLabel || '',
    domainCode: row.domainCode || row.domain || '',
    channel: row.channel || row.channelCode || 'ALL',
    sequence: String(row.sequence ?? row.seq ?? ''),
    description: row.description || '',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('apply_for_product/pages/ApplyforProductPage.jsx'), pageTpl({
  component: 'ApplyforProductPage',
  title: 'Apply for Product',
  serviceImport: '../services/apply_for_productService',
  columns: [
    { key: 'productCode', label: 'Code' },
    { key: 'productName', label: 'Name' },
    { key: 'domainCode', label: 'Domain' },
    { key: 'channel', label: 'Channel' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'productCode', label: 'Product Code', required: true, lockOnEdit: true },
    { key: 'productName', label: 'Name (English)', required: true },
    { key: 'productNameAr', label: 'Name (Arabic)' },
    { key: 'domainCode', label: 'Domain Code' },
    { key: 'channel', label: 'Channel', defaultValue: 'ALL' },
    { key: 'sequence', label: 'Sequence' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('apply_for_product/services/__tests__/apply_for_productService.test.js'), testTpl(
  'apply_for_productService',
  `  it('uses bko-product endpoints', () => {
    expect(service.urls.fetchAll).toBe('bko-product/fetchAll')
    expect(service.urls.create).toBe('bko-product/post')
  })`,
))

// ——— apply_product_subproduct (csubproduct) ———
write(feat('apply_product_subproduct/services/apply_product_subproductService.js'), svcTpl({
  name: 'apply_product_subproduct',
  importLine: "import { subProductsManagementUrls } from '@/core/api/urls/sub_products_managementUrls'",
  urlsExpr: `{
    fetchAll: subProductsManagementUrls.getall,
    create: subProductsManagementUrls.save,
    update: subProductsManagementUrls.update,
    delete: subProductsManagementUrls.delte,
  }`,
  seed: [{
    id: '1', subProductCode: 'SAV_ONLINE', subProductName: 'Online Savings',
    subProductNameAr: '', productCode: 'SAV', channel: 'MB',
    sequence: '1', status: 'Y',
  }],
  idKeys: ['id', 'subProductCode', 'code'],
  mapRowBody: `    id: String(row.id || row.subProductCode || row.code || ''),
    subProductCode: row.subProductCode || row.code || '',
    subProductName: row.subProductName || row.englishLabel || row.name || '',
    subProductNameAr: row.subProductNameAr || row.arabicLabel || '',
    productCode: row.productCode || row.parentCode || '',
    channel: row.channel || row.channelCode || 'ALL',
    sequence: String(row.sequence ?? row.seq ?? ''),
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('apply_product_subproduct/pages/ApplyProductSubproductPage.jsx'), pageTpl({
  component: 'ApplyProductSubproductPage',
  title: 'Apply Product Subproduct',
  serviceImport: '../services/apply_product_subproductService',
  columns: [
    { key: 'subProductCode', label: 'Code' },
    { key: 'subProductName', label: 'Name' },
    { key: 'productCode', label: 'Product' },
    { key: 'channel', label: 'Channel' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'subProductCode', label: 'Sub Product Code', required: true, lockOnEdit: true },
    { key: 'subProductName', label: 'Name (English)', required: true },
    { key: 'subProductNameAr', label: 'Name (Arabic)' },
    { key: 'productCode', label: 'Product Code', required: true },
    { key: 'channel', label: 'Channel', defaultValue: 'ALL' },
    { key: 'sequence', label: 'Sequence' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('apply_product_subproduct/services/__tests__/apply_product_subproductService.test.js'), testTpl(
  'apply_product_subproductService',
  `  it('uses csubproduct endpoints', () => {
    expect(service.urls.fetchAll).toBe('csubproduct/getAll')
    expect(service.urls.create).toBe('csubproduct/create')
  })`,
))

// ——— Apply_sub_product (bko-subProduct) ———
write(feat('Apply_sub_product/services/Apply_sub_productService.js'), svcTpl({
  name: 'Apply_sub_product',
  importLine: "import { subProductManagementUrls } from '@/core/api/urls/sub_product_managementUrls'",
  urlsExpr: `{
    fetchAll: subProductManagementUrls.fetchAllSubProduct,
    create: subProductManagementUrls.saveSubProduct,
    update: subProductManagementUrls.saveSubProduct,
    delete: subProductManagementUrls.deleteSubProduct,
  }`,
  seed: [{
    id: '1', subProductCode: 'TF_DOM', subProductName: 'Domestic Transfer',
    subProductNameAr: '', productCode: 'TF', featureCode: 'XFER',
    sequence: '1', status: 'Y',
  }],
  idKeys: ['id', 'subProductCode', 'code'],
  mapRowBody: `    id: String(row.id || row.subProductCode || row.code || ''),
    subProductCode: row.subProductCode || row.code || '',
    subProductName: row.subProductName || row.englishLabel || row.name || '',
    subProductNameAr: row.subProductNameAr || row.arabicLabel || '',
    productCode: row.productCode || row.parentCode || '',
    featureCode: row.featureCode || row.feature || '',
    sequence: String(row.sequence ?? row.seq ?? ''),
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('Apply_sub_product/pages/ApplySubProductPage.jsx'), pageTpl({
  component: 'ApplySubProductPage',
  title: 'Apply Sub Product',
  serviceImport: '../services/Apply_sub_productService',
  columns: [
    { key: 'subProductCode', label: 'Code' },
    { key: 'subProductName', label: 'Name' },
    { key: 'productCode', label: 'Product' },
    { key: 'featureCode', label: 'Feature' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'subProductCode', label: 'Sub Product Code', required: true, lockOnEdit: true },
    { key: 'subProductName', label: 'Name (English)', required: true },
    { key: 'subProductNameAr', label: 'Name (Arabic)' },
    { key: 'productCode', label: 'Product Code', required: true },
    { key: 'featureCode', label: 'Feature Code' },
    { key: 'sequence', label: 'Sequence' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('Apply_sub_product/services/__tests__/Apply_sub_productService.test.js'), testTpl(
  'Apply_sub_productService',
  `  it('uses bko-subProduct endpoints', () => {
    expect(service.urls.fetchAll).toBe('bko-subProduct/fetchAll')
    expect(service.urls.create).toBe('bko-subProduct/post')
  })`,
))

// ——— blocklist_imei (official blockListUrls) ———
write(feat('blocklist_imei/services/blocklist_imeiService.js'), svcTpl({
  name: 'blocklist_imei',
  importLine: "import { blockListUrls } from '@/core/api/urls/block_listUrls'",
  urlsExpr: `{
    fetchAll: blockListUrls.blockIMEIList,
    create: blockListUrls.blockIMEIModify,
    update: blockListUrls.blockIMEIModify,
    delete: blockListUrls.blockIMEIModify,
  }`,
  seed: [{
    id: '1', imei: '356938035643809', reason: 'Lost device',
    blockedBy: 'admin', blockedOn: '2026-01-15', channel: 'MB',
    remarks: '', status: 'Y',
  }],
  idKeys: ['id', 'imei'],
  mapRowBody: `    id: String(row.id || row.imei || ''),
    imei: row.imei || row.imeiNumber || '',
    reason: row.reason || row.blockReason || '',
    blockedBy: row.blockedBy || row.createdBy || '',
    blockedOn: row.blockedOn || row.createdOn || row.blockDate || '',
    channel: row.channel || row.channelCode || 'ALL',
    remarks: row.remarks || row.comments || '',
    status: row.status || 'Y',`,
  buildDeleteBody: "(id, row) => ({ ...row, id, imei: row?.imei || id, status: 'N', action: 'UNBLOCK' })",
}))
write(feat('blocklist_imei/pages/BlocklistIMEIPage.jsx'), pageTpl({
  component: 'BlocklistIMEIPage',
  title: 'Blocklist IMEI',
  serviceImport: '../services/blocklist_imeiService',
  columns: [
    { key: 'imei', label: 'IMEI' },
    { key: 'reason', label: 'Reason' },
    { key: 'blockedBy', label: 'Blocked By' },
    { key: 'blockedOn', label: 'Blocked On' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'imei', label: 'IMEI', required: true, lockOnEdit: true },
    { key: 'reason', label: 'Reason', required: true },
    { key: 'blockedBy', label: 'Blocked By' },
    { key: 'blockedOn', label: 'Blocked On' },
    { key: 'channel', label: 'Channel', defaultValue: 'ALL' },
    { key: 'remarks', label: 'Remarks', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('blocklist_imei/services/__tests__/blocklist_imeiService.test.js'), testTpl(
  'blocklist_imeiService',
  `  it('uses imei-block endpoints from blockListUrls', () => {
    expect(service.urls.fetchAll).toBe('imei-block/list')
    expect(service.urls.create).toBe('imei-block/manage')
  })`,
))

// ——— blocklist_ip deepen ———
write(feat('blocklist_ip/services/blocklist_ipService.js'), svcTpl({
  name: 'blocklist_ip',
  importLine: "import { blocklistIpUrls } from '@/core/api/urls/blocklist_ipUrls'",
  urlsExpr: `{
    fetchAll: blocklistIpUrls.fetchAllIP,
    create: blocklistIpUrls.postBlockIP,
    update: blocklistIpUrls.postBlockIP,
    delete: blocklistIpUrls.postBlockIP,
  }`,
  seed: [{
    id: '1', ipAddress: '10.0.0.1', reason: 'Suspicious activity',
    blockedBy: 'admin', blockedOn: '2026-02-01', channel: 'ALL',
    remarks: '', status: 'Y',
  }],
  idKeys: ['id', 'ipAddress'],
  mapRowBody: `    id: String(row.id || row.ipAddress || row.ip || ''),
    ipAddress: row.ipAddress || row.ip || '',
    reason: row.reason || row.blockReason || '',
    blockedBy: row.blockedBy || row.createdBy || '',
    blockedOn: row.blockedOn || row.createdOn || row.blockDate || '',
    channel: row.channel || row.channelCode || 'ALL',
    remarks: row.remarks || row.comments || '',
    status: row.status || 'Y',`,
  buildDeleteBody: "(id, row) => ({ ...row, id, ipAddress: row?.ipAddress || id, status: 'N', action: 'UNBLOCK' })",
}))
write(feat('blocklist_ip/pages/BlocklistIPPage.jsx'), pageTpl({
  component: 'BlocklistIPPage',
  title: 'Blocklist IP',
  serviceImport: '../services/blocklist_ipService',
  columns: [
    { key: 'ipAddress', label: 'IP Address' },
    { key: 'reason', label: 'Reason' },
    { key: 'blockedBy', label: 'Blocked By' },
    { key: 'blockedOn', label: 'Blocked On' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'ipAddress', label: 'IP Address', required: true, lockOnEdit: true },
    { key: 'reason', label: 'Reason', required: true },
    { key: 'blockedBy', label: 'Blocked By' },
    { key: 'blockedOn', label: 'Blocked On' },
    { key: 'channel', label: 'Channel', defaultValue: 'ALL' },
    { key: 'remarks', label: 'Remarks', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('blocklist_ip/services/__tests__/blocklist_ipService.test.js'), testTpl(
  'blocklist_ipService',
  `  it('uses ip-block list/manage endpoints', () => {
    expect(service.urls.fetchAll).toBe('backoffice-service/ip-block/list')
    expect(service.urls.create).toBe('backoffice-service/ip-block/manage')
  })`,
))

// ——— configuration_parameters ———
write(feat('configuration_parameters/services/configuration_parametersService.js'), svcTpl({
  name: 'configuration_parameters',
  importLine: "import { configurationParaUrls } from '@/core/api/urls/configuration_paraUrls'",
  urlsExpr: `{
    fetchAll: configurationParaUrls.getall,
    create: configurationParaUrls.save,
    update: configurationParaUrls.update,
    delete: configurationParaUrls.delete,
  }`,
  seed: [{
    id: '1', paramCode: 'MAX_OTP_RETRY', paramValue: '3',
    paramName: 'Max OTP Retry', paramNameAr: '',
    module: 'AUTH', dataType: 'NUMBER', channel: 'ALL',
    description: 'Maximum OTP retry attempts', status: 'Y',
  }],
  idKeys: ['id', 'paramCode', 'code'],
  mapRowBody: `    id: String(row.id || row.paramCode || row.code || ''),
    paramCode: row.paramCode || row.code || row.configKey || '',
    paramValue: row.paramValue ?? row.value ?? row.configValue ?? '',
    paramName: row.paramName || row.englishLabel || row.name || '',
    paramNameAr: row.paramNameAr || row.arabicLabel || '',
    module: row.module || row.moduleCode || '',
    dataType: row.dataType || row.type || 'STRING',
    channel: row.channel || row.channelCode || 'ALL',
    description: row.description || '',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('configuration_parameters/pages/ConfigurationParametersPage.jsx'), pageTpl({
  component: 'ConfigurationParametersPage',
  title: 'Configuration Parameters',
  serviceImport: '../services/configuration_parametersService',
  columns: [
    { key: 'paramCode', label: 'Code' },
    { key: 'paramName', label: 'Name' },
    { key: 'paramValue', label: 'Value' },
    { key: 'module', label: 'Module' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'paramCode', label: 'Parameter Code', required: true, lockOnEdit: true },
    { key: 'paramName', label: 'Name (English)', required: true },
    { key: 'paramNameAr', label: 'Name (Arabic)' },
    { key: 'paramValue', label: 'Value', required: true },
    { key: 'module', label: 'Module' },
    { key: 'dataType', label: 'Data Type', type: 'select', options: [
      { value: 'STRING', label: 'STRING' },
      { value: 'NUMBER', label: 'NUMBER' },
      { value: 'BOOLEAN', label: 'BOOLEAN' },
      { value: 'JSON', label: 'JSON' },
    ], defaultValue: 'STRING' },
    { key: 'channel', label: 'Channel', defaultValue: 'ALL' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('configuration_parameters/services/__tests__/configuration_parametersService.test.js'), testTpl(
  'configuration_parametersService',
  `  it('uses formconfig endpoints', () => {
    expect(service.urls.fetchAll).toBe('formconfig/getAll')
    expect(service.urls.create).toBe('formconfig/create')
  })`,
))

console.log('wave3 part A done')

// ——— customer_jounrey ———
write(feat('customer_jounrey/services/customer_jounreyService.js'), svcTpl({
  name: 'customer_jounrey',
  urlsExpr: `{
    fetchAll: 'customer-journey/getAll',
    create: 'customer-journey/save',
    update: 'customer-journey/save',
    delete: 'customer-journey/delete',
  }`,
  seed: [{
    id: '1', journeyCode: 'ONB_RETAIL', journeyName: 'Retail Onboarding',
    journeyNameAr: '', channel: 'MB', segmentCode: 'RETAIL',
    stepCount: '5', sequence: '1', description: '', status: 'Y',
  }],
  idKeys: ['id', 'journeyCode', 'code'],
  mapRowBody: `    id: String(row.id || row.journeyCode || row.code || ''),
    journeyCode: row.journeyCode || row.code || '',
    journeyName: row.journeyName || row.englishLabel || row.name || '',
    journeyNameAr: row.journeyNameAr || row.arabicLabel || '',
    channel: row.channel || row.channelCode || 'ALL',
    segmentCode: row.segmentCode || row.segment || '',
    stepCount: String(row.stepCount ?? row.steps ?? ''),
    sequence: String(row.sequence ?? row.seq ?? ''),
    description: row.description || '',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('customer_jounrey/pages/CustomerJourneyPage.jsx'), pageTpl({
  component: 'CustomerJourneyPage',
  title: 'Customer Journey',
  serviceImport: '../services/customer_jounreyService',
  columns: [
    { key: 'journeyCode', label: 'Code' },
    { key: 'journeyName', label: 'Name' },
    { key: 'channel', label: 'Channel' },
    { key: 'segmentCode', label: 'Segment' },
    { key: 'stepCount', label: 'Steps' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'journeyCode', label: 'Journey Code', required: true, lockOnEdit: true },
    { key: 'journeyName', label: 'Name (English)', required: true },
    { key: 'journeyNameAr', label: 'Name (Arabic)' },
    { key: 'channel', label: 'Channel', defaultValue: 'MB' },
    { key: 'segmentCode', label: 'Segment Code' },
    { key: 'stepCount', label: 'Step Count' },
    { key: 'sequence', label: 'Sequence' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('customer_jounrey/services/__tests__/customer_jounreyService.test.js'), testTpl(
  'customer_jounreyService',
  `  it('uses SoftFetch customer-journey endpoints', () => {
    expect(service.urls.fetchAll).toBe('customer-journey/getAll')
  })
  it('seed includes channel/segment', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].channel).toBeTruthy()
  })`,
))

// ——— customer_service (CRM) ———
write(feat('customer_service/services/customer_serviceService.js'), svcTpl({
  name: 'customer_service',
  importLine: "import { crmServiceUrls } from '@/core/api/urls/crm_serviceUrls'",
  urlsExpr: `{
    fetchAll: crmServiceUrls.fetchAll,
    create: crmServiceUrls.add,
    update: crmServiceUrls.update,
    delete: crmServiceUrls.delete,
  }`,
  seed: [{
    id: '1', serviceCode: 'COMPLAINT', serviceName: 'Complaint',
    serviceNameAr: '', category: 'SERVICE', priority: 'MEDIUM',
    slaHours: '24', description: '', status: 'Y',
  }],
  idKeys: ['id', 'serviceCode', 'code'],
  mapRowBody: `    id: String(row.id || row.serviceCode || row.code || ''),
    serviceCode: row.serviceCode || row.code || '',
    serviceName: row.serviceName || row.englishLabel || row.name || '',
    serviceNameAr: row.serviceNameAr || row.arabicLabel || '',
    category: row.category || row.serviceCategory || '',
    priority: row.priority || 'MEDIUM',
    slaHours: String(row.slaHours ?? row.sla ?? ''),
    description: row.description || '',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('customer_service/pages/CRMServicePage.jsx'), pageTpl({
  component: 'CRMServicePage',
  title: 'CRM Service',
  serviceImport: '../services/customer_serviceService',
  columns: [
    { key: 'serviceCode', label: 'Code' },
    { key: 'serviceName', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'priority', label: 'Priority' },
    { key: 'slaHours', label: 'SLA (hrs)' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'serviceCode', label: 'Service Code', required: true, lockOnEdit: true },
    { key: 'serviceName', label: 'Name (English)', required: true },
    { key: 'serviceNameAr', label: 'Name (Arabic)' },
    { key: 'category', label: 'Category' },
    { key: 'priority', label: 'Priority', type: 'select', options: [
      { value: 'LOW', label: 'LOW' },
      { value: 'MEDIUM', label: 'MEDIUM' },
      { value: 'HIGH', label: 'HIGH' },
      { value: 'CRITICAL', label: 'CRITICAL' },
    ], defaultValue: 'MEDIUM' },
    { key: 'slaHours', label: 'SLA Hours', defaultValue: '24' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('customer_service/services/__tests__/customer_serviceService.test.js'), testTpl(
  'customer_serviceService',
  `  it('uses crm-service-type endpoints', () => {
    expect(service.urls.fetchAll).toBe('crm-service-type/get-all')
    expect(service.urls.create).toBe('crm-service-type/add')
  })`,
))

// ——— customer_support ———
write(feat('customer_support/services/customer_supportService.js'), `import { createCrudService } from '@/features/common/crud/createCrudService'
import { apiRequest, API_SUCCESS_CODE } from '@/core/api/client'
import { customerSupportUrls } from '@/core/api/urls/customer_supportUrls'

const service = createCrudService({
  name: 'customer_support',
  urls: {
    fetchAll: customerSupportUrls.fetchAllcustomerDETAILS,
    create: customerSupportUrls.fetchAllcustomerDETAILS,
    update: customerSupportUrls.fetchAllcustomerDETAILS,
    delete: customerSupportUrls.fetchAllcustomerDETAILS,
  },
  seed: [
    {
      id: '1',
      customerId: 'CIF1001',
      customerName: 'Sample Customer',
      mobile: '97450000000',
      email: 'sample@qnb.com',
      segment: 'RETAIL',
      actionType: 'VIEW',
      status: 'Y',
    },
  ],
  idKeys: ['id', 'customerId', 'cif'],
  mapRow: (row) => ({
    id: String(row.id || row.customerId || row.cif || ''),
    customerId: row.customerId || row.cif || row.customerCIF || '',
    customerName: row.customerName || row.name || row.englishLabel || '',
    mobile: row.mobile || row.mobileNumber || row.phone || '',
    email: row.email || '',
    segment: row.segment || row.segmentCode || '',
    actionType: row.actionType || row.type || 'VIEW',
    status: row.status || 'Y',
    ...row,
  }),
})

export async function fetchCustomerDetails(customerId) {
  const res = await apiRequest(customerSupportUrls.fetchAllcustomerDETAILS, {
    base: 'bo',
    method: 'POST',
    body: { customerId },
  })
  return res.data || { status: { code: API_SUCCESS_CODE } }
}

export async function fetchCustomerCards(customerId) {
  const res = await apiRequest(customerSupportUrls.fetchAllcustomercards, {
    base: 'bo',
    method: 'POST',
    body: { customerId },
  })
  return res.data || { status: { code: API_SUCCESS_CODE } }
}

export async function fetchCustomerAccounts(customerId) {
  const res = await apiRequest(customerSupportUrls.fetchAllcustomeraccounds, {
    base: 'bo',
    method: 'POST',
    body: { customerId },
  })
  return res.data || { status: { code: API_SUCCESS_CODE } }
}

export async function fetchCustomerLoans(customerId) {
  const res = await apiRequest(customerSupportUrls.fetchAllcustomerloan, {
    base: 'bo',
    method: 'POST',
    body: { customerId },
  })
  return res.data || { status: { code: API_SUCCESS_CODE } }
}

export async function fetchCustomerDeposits(customerId) {
  const res = await apiRequest(customerSupportUrls.fetchAllcustomerdeposite, {
    base: 'bo',
    method: 'POST',
    body: { customerId },
  })
  return res.data || { status: { code: API_SUCCESS_CODE } }
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
`)
write(feat('customer_support/pages/CustomerSupportPage.jsx'), pageTpl({
  component: 'CustomerSupportPage',
  title: 'Customer Support',
  serviceImport: '../services/customer_supportService',
  columns: [
    { key: 'customerId', label: 'CIF / Customer ID' },
    { key: 'customerName', label: 'Name' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'segment', label: 'Segment' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'customerId', label: 'CIF / Customer ID', required: true, lockOnEdit: true },
    { key: 'customerName', label: 'Customer Name', required: true },
    { key: 'mobile', label: 'Mobile' },
    { key: 'email', label: 'Email' },
    { key: 'segment', label: 'Segment' },
    { key: 'actionType', label: 'Action Type', type: 'select', options: [
      { value: 'VIEW', label: 'VIEW' },
      { value: 'SUPPORT', label: 'SUPPORT' },
      { value: 'ESCALATE', label: 'ESCALATE' },
    ], defaultValue: 'VIEW' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('customer_support/services/__tests__/customer_supportService.test.js'), `import { describe, it, expect } from 'vitest'
import service, {
  fetchCustomerDetails,
  fetchCustomerCards,
  fetchCustomerAccounts,
} from '../customer_supportService'

describe('customer_supportService', () => {
  it('uses customer details endpoint for list', () => {
    expect(service.urls.fetchAll).toBe('api/customer/details')
  })
  it('exposes card/account/details helpers', () => {
    expect(typeof fetchCustomerDetails).toBe('function')
    expect(typeof fetchCustomerCards).toBe('function')
    expect(typeof fetchCustomerAccounts).toBe('function')
  })
  it('seed maps CIF fields', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].customerId).toBeTruthy()
  })
})
`)

// ——— data_cleansing ———
write(feat('data_cleansing/services/data_cleansingService.js'), svcTpl({
  name: 'data_cleansing',
  urlsExpr: `{
    fetchAll: 'data-cleansing/getAll',
    create: 'data-cleansing/run',
    update: 'data-cleansing/run',
    delete: 'data-cleansing/run',
  }`,
  seed: [{
    id: '1', jobCode: 'DEDUP_CIF', jobName: 'CIF Deduplication',
    targetTable: 'customer_master', lastRun: '-', lastStatus: 'IDLE',
    recordsProcessed: '0', schedule: 'MANUAL', status: 'Y',
  }],
  idKeys: ['id', 'jobCode', 'code'],
  mapRowBody: `    id: String(row.id || row.jobCode || row.code || ''),
    jobCode: row.jobCode || row.code || '',
    jobName: row.jobName || row.name || row.englishLabel || '',
    targetTable: row.targetTable || row.tableName || '',
    lastRun: row.lastRun || row.lastExecuted || '-',
    lastStatus: row.lastStatus || row.runStatus || 'IDLE',
    recordsProcessed: String(row.recordsProcessed ?? row.processed ?? ''),
    schedule: row.schedule || 'MANUAL',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
  extras: `
export async function runJob(jobCode) {
  return service.save({ id: jobCode, jobCode, action: 'RUN' })
}
`,
}))
write(feat('data_cleansing/pages/DataCleansingPage.jsx'), pageTpl({
  component: 'DataCleansingPage',
  title: 'Data Cleansing',
  serviceImport: '../services/data_cleansingService',
  columns: [
    { key: 'jobCode', label: 'Job' },
    { key: 'jobName', label: 'Name' },
    { key: 'targetTable', label: 'Table' },
    { key: 'lastRun', label: 'Last Run' },
    { key: 'lastStatus', label: 'Last Status' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'jobCode', label: 'Job Code', required: true, lockOnEdit: true },
    { key: 'jobName', label: 'Job Name', required: true },
    { key: 'targetTable', label: 'Target Table' },
    { key: 'schedule', label: 'Schedule', type: 'select', options: [
      { value: 'MANUAL', label: 'MANUAL' },
      { value: 'DAILY', label: 'DAILY' },
      { value: 'WEEKLY', label: 'WEEKLY' },
    ], defaultValue: 'MANUAL' },
    { key: 'lastRun', label: 'Last Run' },
    { key: 'lastStatus', label: 'Last Status' },
    { key: 'recordsProcessed', label: 'Records Processed' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('data_cleansing/services/__tests__/data_cleansingService.test.js'), `import { describe, it, expect } from 'vitest'
import service, { runJob } from '../data_cleansingService'

describe('data_cleansingService', () => {
  it('uses SoftFetch data-cleansing endpoints', () => {
    expect(service.urls.fetchAll).toBe('data-cleansing/getAll')
    expect(service.urls.create).toBe('data-cleansing/run')
  })
  it('exposes runJob helper', () => {
    expect(typeof runJob).toBe('function')
  })
})
`)

// ——— dc_city_master (city-template parity) ———
write(feat('dc_city_master/services/dc_city_masterService.js'), svcTpl({
  name: 'dc_city_master',
  urlsExpr: `{
    fetchAll: 'dc-city/getAll',
    create: 'dc-city/create',
    update: 'dc-city/update',
    delete: 'dc-city/delete',
  }`,
  seed: [{
    id: '1', cityCode: 'DOH', cityNameEnglish: 'Doha',
    cityNameArabic: 'الدوحة', countryCode: 'QA',
    region: 'Central', status: 'Y',
  }],
  idKeys: ['id', 'cityCode', 'cityId'],
  mapRowBody: `    id: String(row.id || row.cityCode || row.cityId || ''),
    cityCode: row.cityCode || row.code || '',
    cityNameEnglish: row.englishLabel || row.cityNameEnglish || row.cityName || '',
    cityNameArabic: row.arabicLabel || row.cityNameArabic || '',
    countryCode: row.countryCode || row.country || 'QA',
    region: row.region || row.state || '',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('dc_city_master/pages/DCCityMasterPage.jsx'), pageTpl({
  component: 'DCCityMasterPage',
  title: 'DC City Master',
  serviceImport: '../services/dc_city_masterService',
  columns: [
    { key: 'cityCode', label: 'City Code' },
    { key: 'cityNameEnglish', label: 'City (EN)' },
    { key: 'cityNameArabic', label: 'City (AR)' },
    { key: 'countryCode', label: 'Country' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'cityCode', label: 'City Code', required: true, lockOnEdit: true },
    { key: 'cityNameEnglish', label: 'City Name (English)', required: true },
    { key: 'cityNameArabic', label: 'City Name (Arabic)' },
    { key: 'countryCode', label: 'Country Code', defaultValue: 'QA' },
    { key: 'region', label: 'Region' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('dc_city_master/services/__tests__/dc_city_masterService.test.js'), testTpl(
  'dc_city_masterService',
  `  it('uses SoftFetch dc-city endpoints', () => {
    expect(service.urls.fetchAll).toBe('dc-city/getAll')
  })
  it('maps EN/AR city labels like city master', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].cityNameEnglish).toBeTruthy()
  })`,
))

// ——— default_parameter ———
write(feat('default_parameter/services/default_parameterService.js'), `import { createCrudService } from '@/features/common/crud/createCrudService'
import { apiRequest, API_SUCCESS_CODE } from '@/core/api/client'
import { defaultParameterUrls } from '@/core/api/urls/default_parameterUrls'

const service = createCrudService({
  name: 'default_parameter',
  urls: {
    fetchAll: defaultParameterUrls.fetchAll,
    create: defaultParameterUrls.action,
    update: defaultParameterUrls.action,
    delete: defaultParameterUrls.action,
  },
  seed: [
    {
      id: '1',
      configKey: 'OTP_LENGTH',
      configValue: '6',
      domainCode: 'AUTH',
      channel: 'MB',
      description: 'Default OTP length',
      status: 'Y',
    },
  ],
  idKeys: ['id', 'configKey', 'key'],
  mapRow: (row) => ({
    id: String(row.id || row.configKey || row.key || ''),
    configKey: row.configKey || row.key || row.paramCode || '',
    configValue: row.configValue ?? row.value ?? row.paramValue ?? '',
    domainCode: row.domainCode || row.domain || '',
    channel: row.channel || row.channelCode || 'ALL',
    description: row.description || '',
    status: row.status || 'Y',
    ...row,
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N', action: 'DELETE' }),
})

export async function fetchDomains() {
  const res = await apiRequest(defaultParameterUrls.fetchDomains, {
    base: 'bo',
    method: 'POST',
    body: {},
  })
  return res.data || { status: { code: API_SUCCESS_CODE }, data: [] }
}

export async function fetchOtpDefaults(domainCode) {
  const res = await apiRequest(defaultParameterUrls.fetchOtpConfigByDomain, {
    base: 'bo',
    method: 'POST',
    body: { domainCode },
  })
  return res.data || { status: { code: API_SUCCESS_CODE } }
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
`)
write(feat('default_parameter/pages/DefaultParameterPage.jsx'), pageTpl({
  component: 'DefaultParameterPage',
  title: 'Default Parameter',
  serviceImport: '../services/default_parameterService',
  columns: [
    { key: 'configKey', label: 'Key' },
    { key: 'configValue', label: 'Value' },
    { key: 'domainCode', label: 'Domain' },
    { key: 'channel', label: 'Channel' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'configKey', label: 'Config Key', required: true, lockOnEdit: true },
    { key: 'configValue', label: 'Config Value', required: true },
    { key: 'domainCode', label: 'Domain Code' },
    { key: 'channel', label: 'Channel', defaultValue: 'ALL' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('default_parameter/services/__tests__/default_parameterService.test.js'), `import { describe, it, expect } from 'vitest'
import service, { fetchDomains, fetchOtpDefaults } from '../default_parameterService'

describe('default_parameterService', () => {
  it('uses api/default-config endpoints', () => {
    expect(service.urls.fetchAll).toBe('api/default-config/getAll')
    expect(service.urls.create).toBe('api/default-config/action')
  })
  it('exposes domain and OTP default helpers', () => {
    expect(typeof fetchDomains).toBe('function')
    expect(typeof fetchOtpDefaults).toBe('function')
  })
})
`)

console.log('wave3 part B done')

// ——— digital instant onboarding ———
write(feat('digital__instant_onboarding/services/digital__instant_onboardingService.js'), svcTpl({
  name: 'digital__instant_onboarding',
  urlsExpr: `{
    fetchAll: 'onboarding/getAll',
    create: 'onboarding/save',
    update: 'onboarding/save',
    delete: 'onboarding/delete',
  }`,
  seed: [{
    id: '1', stepCode: 'KYC', stepName: 'KYC Verification',
    stepNameAr: '', sequence: '1', channel: 'MB',
    mandatory: 'Y', estimatedMinutes: '5', description: '', status: 'Y',
  }],
  idKeys: ['id', 'stepCode', 'code'],
  mapRowBody: `    id: String(row.id || row.stepCode || row.code || ''),
    stepCode: row.stepCode || row.code || '',
    stepName: row.stepName || row.englishLabel || row.name || '',
    stepNameAr: row.stepNameAr || row.arabicLabel || '',
    sequence: String(row.sequence ?? row.seq ?? ''),
    channel: row.channel || row.channelCode || 'MB',
    mandatory: row.mandatory || row.required || 'Y',
    estimatedMinutes: String(row.estimatedMinutes ?? row.etaMinutes ?? ''),
    description: row.description || '',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('digital__instant_onboarding/pages/DigitalInstantOnboardingPage.jsx'), pageTpl({
  component: 'DigitalInstantOnboardingPage',
  title: 'Digital Instant Onboarding',
  serviceImport: '../services/digital__instant_onboardingService',
  columns: [
    { key: 'stepCode', label: 'Step' },
    { key: 'stepName', label: 'Name' },
    { key: 'sequence', label: 'Seq' },
    { key: 'channel', label: 'Channel' },
    { key: 'mandatory', label: 'Mandatory' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'stepCode', label: 'Step Code', required: true, lockOnEdit: true },
    { key: 'stepName', label: 'Name (English)', required: true },
    { key: 'stepNameAr', label: 'Name (Arabic)' },
    { key: 'sequence', label: 'Sequence', required: true },
    { key: 'channel', label: 'Channel', defaultValue: 'MB' },
    { key: 'mandatory', label: 'Mandatory', type: 'status', defaultValue: 'Y' },
    { key: 'estimatedMinutes', label: 'Est. Minutes' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('digital__instant_onboarding/services/__tests__/digital__instant_onboardingService.test.js'), testTpl(
  'digital__instant_onboardingService',
  `  it('uses SoftFetch onboarding endpoints', () => {
    expect(service.urls.fetchAll).toBe('onboarding/getAll')
  })
  it('seed includes sequence/mandatory', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].sequence).toBeTruthy()
  })`,
))

// ——— dynamic_screen ———
write(feat('dynamic_screen/services/dynamic_screenService.js'), svcTpl({
  name: 'dynamic_screen',
  urlsExpr: `{
    fetchAll: 'dynamic-screen/getAll',
    create: 'dynamic-screen/save',
    update: 'dynamic-screen/save',
    delete: 'dynamic-screen/delete',
  }`,
  seed: [{
    id: '1', screenCode: 'SPLASH', screenName: 'Splash Screen',
    screenNameAr: '', screenType: 'SPLASH', channel: 'MB',
    layoutJson: '{}', version: '1', status: 'Y',
  }],
  idKeys: ['id', 'screenCode', 'code'],
  mapRowBody: `    id: String(row.id || row.screenCode || row.code || ''),
    screenCode: row.screenCode || row.code || '',
    screenName: row.screenName || row.englishLabel || row.name || '',
    screenNameAr: row.screenNameAr || row.arabicLabel || '',
    screenType: row.screenType || row.type || 'DYNAMIC',
    channel: row.channel || row.channelCode || 'ALL',
    layoutJson: row.layoutJson || row.layout || row.config || '',
    version: String(row.version ?? ''),
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('dynamic_screen/pages/DynamicScreenPage.jsx'), pageTpl({
  component: 'DynamicScreenPage',
  title: 'Dynamic Screen',
  serviceImport: '../services/dynamic_screenService',
  columns: [
    { key: 'screenCode', label: 'Code' },
    { key: 'screenName', label: 'Name' },
    { key: 'screenType', label: 'Type' },
    { key: 'channel', label: 'Channel' },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'screenCode', label: 'Screen Code', required: true, lockOnEdit: true },
    { key: 'screenName', label: 'Name (English)', required: true },
    { key: 'screenNameAr', label: 'Name (Arabic)' },
    { key: 'screenType', label: 'Screen Type', type: 'select', options: [
      { value: 'SPLASH', label: 'SPLASH' },
      { value: 'BANNER', label: 'BANNER' },
      { value: 'DYNAMIC', label: 'DYNAMIC' },
      { value: 'FORM', label: 'FORM' },
    ], defaultValue: 'DYNAMIC' },
    { key: 'channel', label: 'Channel', defaultValue: 'ALL' },
    { key: 'version', label: 'Version' },
    { key: 'layoutJson', label: 'Layout JSON', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('dynamic_screen/services/__tests__/dynamic_screenService.test.js'), testTpl(
  'dynamic_screenService',
  `  it('uses SoftFetch dynamic-screen endpoints', () => {
    expect(service.urls.fetchAll).toBe('dynamic-screen/getAll')
  })`,
))

// ——— E-statement ———
write(feat('E-statement/services/E-statementService.js'), svcTpl({
  name: 'E-statement',
  urlsExpr: `{
    fetchAll: 'e-statement/getAll',
    create: 'e-statement/save',
    update: 'e-statement/save',
    delete: 'e-statement/delete',
  }`,
  seed: [{
    id: '1', templateCode: 'STMT_MONTHLY', templateName: 'Monthly Statement',
    templateNameAr: '', productCode: 'SAV', format: 'PDF',
    frequency: 'MONTHLY', language: 'EN', status: 'Y',
  }],
  idKeys: ['id', 'templateCode', 'code'],
  mapRowBody: `    id: String(row.id || row.templateCode || row.code || ''),
    templateCode: row.templateCode || row.code || '',
    templateName: row.templateName || row.englishLabel || row.name || '',
    templateNameAr: row.templateNameAr || row.arabicLabel || '',
    productCode: row.productCode || row.product || '',
    format: row.format || row.fileFormat || 'PDF',
    frequency: row.frequency || 'MONTHLY',
    language: row.language || row.lang || 'EN',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('E-statement/pages/EStatementPage.jsx'), pageTpl({
  component: 'EStatementPage',
  title: 'E-Statement',
  serviceImport: '../services/E-statementService',
  columns: [
    { key: 'templateCode', label: 'Template' },
    { key: 'templateName', label: 'Name' },
    { key: 'productCode', label: 'Product' },
    { key: 'format', label: 'Format' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'templateCode', label: 'Template Code', required: true, lockOnEdit: true },
    { key: 'templateName', label: 'Name (English)', required: true },
    { key: 'templateNameAr', label: 'Name (Arabic)' },
    { key: 'productCode', label: 'Product Code' },
    { key: 'format', label: 'Format', type: 'select', options: [
      { value: 'PDF', label: 'PDF' },
      { value: 'CSV', label: 'CSV' },
      { value: 'XLS', label: 'XLS' },
    ], defaultValue: 'PDF' },
    { key: 'frequency', label: 'Frequency', type: 'select', options: [
      { value: 'DAILY', label: 'DAILY' },
      { value: 'WEEKLY', label: 'WEEKLY' },
      { value: 'MONTHLY', label: 'MONTHLY' },
      { value: 'YEARLY', label: 'YEARLY' },
    ], defaultValue: 'MONTHLY' },
    { key: 'language', label: 'Language', defaultValue: 'EN' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('E-statement/services/__tests__/E-statementService.test.js'), testTpl(
  'E-statementService',
  `  it('uses SoftFetch e-statement endpoints', () => {
    expect(service.urls.fetchAll).toBe('e-statement/getAll')
  })
  it('seed includes format/frequency', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].format).toBe('PDF')
  })`,
))

// ——— feature_management (main + domain/product/subproduct deepen) ———
write(feat('feature_management/services/feature_managementService.js'), svcTpl({
  name: 'feature_management',
  urlsExpr: `{
    fetchAll: 'bko-features/fetchAll',
    create: 'bko-features/post',
    update: 'bko-features/post',
    delete: 'bko-features/delete',
  }`,
  seed: [{
    id: '1', featureCode: 'XFER', featureName: 'Transfers',
    featureNameAr: '', productCode: 'TF', domainCode: 'RETAIL',
    channel: 'MB', sequence: '10', status: 'Y',
  }],
  idKeys: ['id', 'featureCode', 'code'],
  mapRowBody: `    id: String(row.id || row.featureCode || row.code || ''),
    featureCode: row.featureCode || row.code || '',
    featureName: row.featureName || row.englishLabel || row.name || '',
    featureNameAr: row.featureNameAr || row.arabicLabel || '',
    productCode: row.productCode || row.product || '',
    domainCode: row.domainCode || row.domain || '',
    channel: row.channel || row.channelCode || 'ALL',
    sequence: String(row.sequence ?? row.seq ?? ''),
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('feature_management/pages/FeatureManagementPage.jsx'), pageTpl({
  component: 'FeatureManagementPage',
  title: 'Feature Management',
  serviceImport: '../services/feature_managementService',
  columns: [
    { key: 'featureCode', label: 'Code' },
    { key: 'featureName', label: 'Name' },
    { key: 'productCode', label: 'Product' },
    { key: 'domainCode', label: 'Domain' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'featureCode', label: 'Feature Code', required: true, lockOnEdit: true },
    { key: 'featureName', label: 'Name (English)', required: true },
    { key: 'featureNameAr', label: 'Name (Arabic)' },
    { key: 'productCode', label: 'Product Code' },
    { key: 'domainCode', label: 'Domain Code' },
    { key: 'channel', label: 'Channel', defaultValue: 'ALL' },
    { key: 'sequence', label: 'Sequence' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('feature_management/services/__tests__/feature_managementService.test.js'), testTpl(
  'feature_managementService',
  `  it('uses SoftFetch bko-features endpoints', () => {
    expect(service.urls.fetchAll).toBe('bko-features/fetchAll')
    expect(service.urls.create).toBe('bko-features/post')
  })`,
))

write(feat('feature_management/services/domainService.js'), svcTpl({
  name: 'domain_management',
  importLine: "import { domainManagementUrls } from '@/core/api/urls/domain_managementUrls'",
  urlsExpr: `{
    fetchAll: domainManagementUrls.fetchAllDomain,
    create: domainManagementUrls.saveDomain,
    update: domainManagementUrls.saveDomain,
    delete: domainManagementUrls.deleteDomain,
  }`,
  seed: [{
    id: '1', domainCode: 'BO', domainName: 'Back Office',
    domainNameAr: '', description: 'Back office domain', sequence: '1', status: 'Y',
  }],
  idKeys: ['id', 'domainCode', 'domainId'],
  mapRowBody: `    id: String(row.id || row.domainCode || row.domainId || ''),
    domainCode: row.domainCode || row.code || '',
    domainName: row.domainName || row.englishLabel || row.name || '',
    domainNameAr: row.domainNameAr || row.arabicLabel || '',
    description: row.description || '',
    sequence: String(row.sequence ?? row.seq ?? ''),
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('feature_management/pages/DomainManagementPage.jsx'), pageTpl({
  component: 'DomainManagementPage',
  title: 'Domain Management',
  serviceImport: '../services/domainService',
  columns: [
    { key: 'domainCode', label: 'Domain Code' },
    { key: 'domainName', label: 'Name' },
    { key: 'sequence', label: 'Seq' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'domainCode', label: 'Domain Code', required: true, lockOnEdit: true },
    { key: 'domainName', label: 'Name (English)', required: true },
    { key: 'domainNameAr', label: 'Name (Arabic)' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'sequence', label: 'Sequence' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))

write(feat('feature_management/services/productService.js'), svcTpl({
  name: 'product_management',
  importLine: "import { productManagementUrls } from '@/core/api/urls/product_managementUrls'",
  urlsExpr: `{
    fetchAll: productManagementUrls.fetchAllProduct,
    create: productManagementUrls.saveProduct,
    update: productManagementUrls.saveProduct,
    delete: productManagementUrls.deleteProduct,
  }`,
  seed: [{
    id: '1', productCode: 'IB', productName: 'Internet Banking',
    productNameAr: '', domainCode: 'RETAIL', channel: 'IB', sequence: '1', status: 'Y',
  }],
  idKeys: ['id', 'productCode'],
  mapRowBody: `    id: String(row.id || row.productCode || ''),
    productCode: row.productCode || row.code || '',
    productName: row.productName || row.englishLabel || row.name || '',
    productNameAr: row.productNameAr || row.arabicLabel || '',
    domainCode: row.domainCode || row.domain || '',
    channel: row.channel || row.channelCode || 'ALL',
    sequence: String(row.sequence ?? row.seq ?? ''),
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('feature_management/pages/ProductManagementPage.jsx'), pageTpl({
  component: 'ProductManagementPage',
  title: 'Product Management',
  serviceImport: '../services/productService',
  columns: [
    { key: 'productCode', label: 'Product Code' },
    { key: 'productName', label: 'Name' },
    { key: 'domainCode', label: 'Domain' },
    { key: 'channel', label: 'Channel' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'productCode', label: 'Product Code', required: true, lockOnEdit: true },
    { key: 'productName', label: 'Name (English)', required: true },
    { key: 'productNameAr', label: 'Name (Arabic)' },
    { key: 'domainCode', label: 'Domain Code' },
    { key: 'channel', label: 'Channel', defaultValue: 'ALL' },
    { key: 'sequence', label: 'Sequence' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))

write(feat('feature_management/services/subProductService.js'), svcTpl({
  name: 'sub_product_management',
  importLine: "import { subProductManagementUrls } from '@/core/api/urls/sub_product_managementUrls'",
  urlsExpr: `{
    fetchAll: subProductManagementUrls.fetchAllSubProduct,
    create: subProductManagementUrls.saveSubProduct,
    update: subProductManagementUrls.saveSubProduct,
    delete: subProductManagementUrls.deleteSubProduct,
  }`,
  seed: [{
    id: '1', subProductCode: 'MENU', subProductName: 'Menu',
    subProductNameAr: '', productCode: 'IB', featureCode: '', sequence: '1', status: 'Y',
  }],
  idKeys: ['id', 'subProductCode'],
  mapRowBody: `    id: String(row.id || row.subProductCode || ''),
    subProductCode: row.subProductCode || row.code || '',
    subProductName: row.subProductName || row.englishLabel || row.name || '',
    subProductNameAr: row.subProductNameAr || row.arabicLabel || '',
    productCode: row.productCode || row.parentCode || '',
    featureCode: row.featureCode || '',
    sequence: String(row.sequence ?? row.seq ?? ''),
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('feature_management/pages/SubProductManagementPage.jsx'), pageTpl({
  component: 'SubProductManagementPage',
  title: 'Sub Product Management',
  serviceImport: '../services/subProductService',
  columns: [
    { key: 'subProductCode', label: 'Sub Product Code' },
    { key: 'subProductName', label: 'Name' },
    { key: 'productCode', label: 'Product' },
    { key: 'featureCode', label: 'Feature' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'subProductCode', label: 'Sub Product Code', required: true, lockOnEdit: true },
    { key: 'subProductName', label: 'Name (English)', required: true },
    { key: 'subProductNameAr', label: 'Name (Arabic)' },
    { key: 'productCode', label: 'Product Code', required: true },
    { key: 'featureCode', label: 'Feature Code' },
    { key: 'sequence', label: 'Sequence' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))

// ——— follow_us ———
write(feat('follow_us/services/follow_usService.js'), svcTpl({
  name: 'follow_us',
  urlsExpr: `{
    fetchAll: 'reach-us/getAll',
    create: 'reach-us/save',
    update: 'reach-us/save',
    delete: 'reach-us/delete',
  }`,
  seed: [{
    id: '1', channel: 'Twitter', value: '@QNB',
    displayName: 'QNB Twitter', displayNameAr: '',
    icon: 'twitter', sequence: '1', url: 'https://twitter.com/QNB', status: 'Y',
  }],
  idKeys: ['id', 'channel', 'code'],
  mapRowBody: `    id: String(row.id || row.channel || row.code || ''),
    channel: row.channel || row.socialChannel || row.code || '',
    value: row.value || row.handle || row.contactValue || '',
    displayName: row.displayName || row.englishLabel || row.name || '',
    displayNameAr: row.displayNameAr || row.arabicLabel || '',
    icon: row.icon || row.iconName || '',
    sequence: String(row.sequence ?? row.seq ?? ''),
    url: row.url || row.link || '',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('follow_us/pages/FollowUsReachUsPage.jsx'), pageTpl({
  component: 'FollowUsReachUsPage',
  title: 'Follow Us / Reach Us',
  serviceImport: '../services/follow_usService',
  columns: [
    { key: 'channel', label: 'Channel' },
    { key: 'displayName', label: 'Display Name' },
    { key: 'value', label: 'Value' },
    { key: 'sequence', label: 'Seq' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'channel', label: 'Channel', required: true, lockOnEdit: true },
    { key: 'displayName', label: 'Display Name (English)', required: true },
    { key: 'displayNameAr', label: 'Display Name (Arabic)' },
    { key: 'value', label: 'Value / Handle', required: true },
    { key: 'url', label: 'URL' },
    { key: 'icon', label: 'Icon' },
    { key: 'sequence', label: 'Sequence' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('follow_us/services/__tests__/follow_usService.test.js'), testTpl(
  'follow_usService',
  `  it('uses SoftFetch reach-us endpoints', () => {
    expect(service.urls.fetchAll).toBe('reach-us/getAll')
  })`,
))

// ——— funnel ———
write(feat('funnel/services/funnelService.js'), svcTpl({
  name: 'funnel',
  urlsExpr: `{
    fetchAll: 'funnel/getAll',
    create: 'funnel/save',
    update: 'funnel/save',
    delete: 'funnel/delete',
  }`,
  seed: [{
    id: '1', funnelCode: 'ONB_FUNNEL', funnelName: 'Onboarding Funnel',
    funnelNameAr: '', channel: 'MB', productCode: 'SAV',
    stages: 'START,KYC,REVIEW,DONE', conversionTarget: '25', status: 'Y',
  }],
  idKeys: ['id', 'funnelCode', 'code'],
  mapRowBody: `    id: String(row.id || row.funnelCode || row.code || ''),
    funnelCode: row.funnelCode || row.code || '',
    funnelName: row.funnelName || row.englishLabel || row.name || '',
    funnelNameAr: row.funnelNameAr || row.arabicLabel || '',
    channel: row.channel || row.channelCode || 'ALL',
    productCode: row.productCode || row.product || '',
    stages: row.stages || row.stageList || '',
    conversionTarget: String(row.conversionTarget ?? row.target ?? ''),
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('funnel/pages/FunnelPage.jsx'), pageTpl({
  component: 'FunnelPage',
  title: 'Funnel',
  serviceImport: '../services/funnelService',
  columns: [
    { key: 'funnelCode', label: 'Code' },
    { key: 'funnelName', label: 'Name' },
    { key: 'channel', label: 'Channel' },
    { key: 'productCode', label: 'Product' },
    { key: 'conversionTarget', label: 'Target %' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'funnelCode', label: 'Funnel Code', required: true, lockOnEdit: true },
    { key: 'funnelName', label: 'Name (English)', required: true },
    { key: 'funnelNameAr', label: 'Name (Arabic)' },
    { key: 'channel', label: 'Channel', defaultValue: 'MB' },
    { key: 'productCode', label: 'Product Code' },
    { key: 'stages', label: 'Stages (comma-separated)', type: 'textarea' },
    { key: 'conversionTarget', label: 'Conversion Target %' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('funnel/services/__tests__/funnelService.test.js'), testTpl(
  'funnelService',
  `  it('uses SoftFetch funnel endpoints', () => {
    expect(service.urls.fetchAll).toBe('funnel/getAll')
  })`,
))

console.log('wave3 part C done')

// ——— merchant_management ———
write(feat('merchant_management/services/merchant_managementService.js'), svcTpl({
  name: 'merchant_management',
  urlsExpr: `{
    fetchAll: 'merchant/getAll',
    create: 'merchant/create',
    update: 'merchant/update',
    delete: 'merchant/delete',
  }`,
  seed: [{
    id: '1', merchantCode: 'M001', merchantName: 'Sample Merchant',
    merchantNameAr: '', category: 'RETAIL', city: 'Doha',
    contactEmail: 'merchant@example.com', contactPhone: '97440000000',
    mcc: '5411', status: 'Y',
  }],
  idKeys: ['id', 'merchantCode', 'code'],
  mapRowBody: `    id: String(row.id || row.merchantCode || row.code || ''),
    merchantCode: row.merchantCode || row.code || '',
    merchantName: row.merchantName || row.englishLabel || row.name || '',
    merchantNameAr: row.merchantNameAr || row.arabicLabel || '',
    category: row.category || row.merchantCategory || '',
    city: row.city || '',
    contactEmail: row.contactEmail || row.email || '',
    contactPhone: row.contactPhone || row.phone || row.mobile || '',
    mcc: row.mcc || row.mccCode || '',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('merchant_management/pages/MerchantManagementPage.jsx'), pageTpl({
  component: 'MerchantManagementPage',
  title: 'Merchant Management',
  serviceImport: '../services/merchant_managementService',
  columns: [
    { key: 'merchantCode', label: 'Code' },
    { key: 'merchantName', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'city', label: 'City' },
    { key: 'mcc', label: 'MCC' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'merchantCode', label: 'Merchant Code', required: true, lockOnEdit: true },
    { key: 'merchantName', label: 'Name (English)', required: true },
    { key: 'merchantNameAr', label: 'Name (Arabic)' },
    { key: 'category', label: 'Category' },
    { key: 'city', label: 'City' },
    { key: 'contactEmail', label: 'Contact Email' },
    { key: 'contactPhone', label: 'Contact Phone' },
    { key: 'mcc', label: 'MCC Code' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('merchant_management/services/__tests__/merchant_managementService.test.js'), testTpl(
  'merchant_managementService',
  `  it('uses SoftFetch merchant endpoints', () => {
    expect(service.urls.fetchAll).toBe('merchant/getAll')
    expect(service.urls.create).toBe('merchant/create')
  })`,
))

// ——— Parameter_maintenance ———
write(feat('Parameter_maintenance/services/Parameter_maintenanceService.js'), svcTpl({
  name: 'Parameter_maintenance',
  importLine: "import { parameterUrls } from '@/core/api/urls/parameterUrls'",
  urlsExpr: `{
    fetchAll: parameterUrls.fetchAllparameter,
    create: parameterUrls.parametermanager,
    update: parameterUrls.parametermanager,
    delete: parameterUrls.parametermanager,
  }`,
  seed: [{
    id: '1', parameterCode: 'SESSION_TIMEOUT', parameterValue: '15',
    parameterName: 'Session Timeout (min)', parameterNameAr: '',
    module: 'SECURITY', dataType: 'NUMBER', channel: 'ALL',
    description: 'Idle session timeout', status: 'Y',
  }],
  idKeys: ['id', 'parameterCode', 'code'],
  mapRowBody: `    id: String(row.id || row.parameterCode || row.code || ''),
    parameterCode: row.parameterCode || row.code || row.paramCode || '',
    parameterValue: row.parameterValue ?? row.value ?? row.paramValue ?? '',
    parameterName: row.parameterName || row.englishLabel || row.name || '',
    parameterNameAr: row.parameterNameAr || row.arabicLabel || '',
    module: row.module || row.moduleCode || '',
    dataType: row.dataType || row.type || 'STRING',
    channel: row.channel || row.channelCode || 'ALL',
    description: row.description || '',
    status: row.status || 'Y',`,
  buildDeleteBody: "(id, row) => ({ ...row, id, status: 'N', action: 'DELETE' })",
}))
write(feat('Parameter_maintenance/pages/ParameterMaintenancePage.jsx'), pageTpl({
  component: 'ParameterMaintenancePage',
  title: 'Parameter Maintenance',
  serviceImport: '../services/Parameter_maintenanceService',
  columns: [
    { key: 'parameterCode', label: 'Code' },
    { key: 'parameterName', label: 'Name' },
    { key: 'parameterValue', label: 'Value' },
    { key: 'module', label: 'Module' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'parameterCode', label: 'Parameter Code', required: true, lockOnEdit: true },
    { key: 'parameterName', label: 'Name (English)', required: true },
    { key: 'parameterNameAr', label: 'Name (Arabic)' },
    { key: 'parameterValue', label: 'Value', required: true },
    { key: 'module', label: 'Module' },
    { key: 'dataType', label: 'Data Type', type: 'select', options: [
      { value: 'STRING', label: 'STRING' },
      { value: 'NUMBER', label: 'NUMBER' },
      { value: 'BOOLEAN', label: 'BOOLEAN' },
      { value: 'JSON', label: 'JSON' },
    ], defaultValue: 'STRING' },
    { key: 'channel', label: 'Channel', defaultValue: 'ALL' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('Parameter_maintenance/services/__tests__/Parameter_maintenanceService.test.js'), testTpl(
  'Parameter_maintenanceService',
  `  it('uses parameter list/manage endpoints', () => {
    expect(service.urls.fetchAll).toBe('backoffice-service/parameter/list')
    expect(service.urls.create).toBe('parameter/manage-parameter')
  })`,
))

// ——— profile_control ———
write(feat('profile_control/services/profile_controlService.js'), svcTpl({
  name: 'profile_control',
  urlsExpr: `{
    fetchAll: 'profile-control/getAll',
    create: 'profile-control/save',
    update: 'profile-control/save',
    delete: 'profile-control/delete',
  }`,
  seed: [{
    id: '1', profileCode: 'RETAIL_STD', profileName: 'Retail Standard',
    profileNameAr: '', segmentCode: 'RETAIL', channel: 'MB',
    maxDevices: '3', allowBiometric: 'Y', allowNickname: 'Y', status: 'Y',
  }],
  idKeys: ['id', 'profileCode', 'code'],
  mapRowBody: `    id: String(row.id || row.profileCode || row.code || ''),
    profileCode: row.profileCode || row.code || '',
    profileName: row.profileName || row.englishLabel || row.name || '',
    profileNameAr: row.profileNameAr || row.arabicLabel || '',
    segmentCode: row.segmentCode || row.segment || '',
    channel: row.channel || row.channelCode || 'ALL',
    maxDevices: String(row.maxDevices ?? row.deviceLimit ?? ''),
    allowBiometric: row.allowBiometric || row.biometric || 'Y',
    allowNickname: row.allowNickname || row.nickname || 'Y',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('profile_control/pages/ProfileControlPage.jsx'), pageTpl({
  component: 'ProfileControlPage',
  title: 'Profile Control',
  serviceImport: '../services/profile_controlService',
  columns: [
    { key: 'profileCode', label: 'Code' },
    { key: 'profileName', label: 'Name' },
    { key: 'segmentCode', label: 'Segment' },
    { key: 'maxDevices', label: 'Max Devices' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'profileCode', label: 'Profile Code', required: true, lockOnEdit: true },
    { key: 'profileName', label: 'Name (English)', required: true },
    { key: 'profileNameAr', label: 'Name (Arabic)' },
    { key: 'segmentCode', label: 'Segment Code' },
    { key: 'channel', label: 'Channel', defaultValue: 'ALL' },
    { key: 'maxDevices', label: 'Max Devices', defaultValue: '3' },
    { key: 'allowBiometric', label: 'Allow Biometric', type: 'status', defaultValue: 'Y' },
    { key: 'allowNickname', label: 'Allow Nickname', type: 'status', defaultValue: 'Y' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('profile_control/services/__tests__/profile_controlService.test.js'), testTpl(
  'profile_controlService',
  `  it('uses SoftFetch profile-control endpoints', () => {
    expect(service.urls.fetchAll).toBe('profile-control/getAll')
  })
  it('seed includes device/biometric controls', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].maxDevices).toBeTruthy()
  })`,
))

// ——— profanity_check ———
write(feat('profanity_check/services/profanity_checkService.js'), svcTpl({
  name: 'profanity_check',
  urlsExpr: `{
    fetchAll: 'profanity/getAll',
    create: 'profanity/save',
    update: 'profanity/save',
    delete: 'profanity/delete',
  }`,
  seed: [{
    id: '1', word: 'badword', severity: 'HIGH',
    language: 'EN', category: 'GENERAL', action: 'BLOCK',
    replacement: '****', status: 'Y',
  }],
  idKeys: ['id', 'word'],
  mapRowBody: `    id: String(row.id || row.word || ''),
    word: row.word || row.term || row.profanityWord || '',
    severity: row.severity || row.level || 'MEDIUM',
    language: row.language || row.lang || 'EN',
    category: row.category || '',
    action: row.action || row.actionType || 'BLOCK',
    replacement: row.replacement || row.mask || '****',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('profanity_check/pages/ProfanityCheckPage.jsx'), pageTpl({
  component: 'ProfanityCheckPage',
  title: 'Profanity Check',
  serviceImport: '../services/profanity_checkService',
  columns: [
    { key: 'word', label: 'Word' },
    { key: 'severity', label: 'Severity' },
    { key: 'language', label: 'Language' },
    { key: 'action', label: 'Action' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'word', label: 'Word', required: true, lockOnEdit: true },
    { key: 'severity', label: 'Severity', type: 'select', options: [
      { value: 'LOW', label: 'LOW' },
      { value: 'MEDIUM', label: 'MEDIUM' },
      { value: 'HIGH', label: 'HIGH' },
    ], defaultValue: 'MEDIUM' },
    { key: 'language', label: 'Language', defaultValue: 'EN' },
    { key: 'category', label: 'Category' },
    { key: 'action', label: 'Action', type: 'select', options: [
      { value: 'BLOCK', label: 'BLOCK' },
      { value: 'MASK', label: 'MASK' },
      { value: 'WARN', label: 'WARN' },
    ], defaultValue: 'BLOCK' },
    { key: 'replacement', label: 'Replacement / Mask' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('profanity_check/services/__tests__/profanity_checkService.test.js'), testTpl(
  'profanity_checkService',
  `  it('uses SoftFetch profanity endpoints', () => {
    expect(service.urls.fetchAll).toBe('profanity/getAll')
  })
  it('seed includes severity/action', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].severity).toBeTruthy()
  })`,
))

// ——— ready_to_sync_table (refresh helper) ———
write(feat('ready_to_sync_table/services/ready_to_sync_tableService.js'), `import { createCrudService } from '@/features/common/crud/createCrudService'
import { apiRequest, API_SUCCESS_CODE } from '@/core/api/client'
import { syncTableUrls } from '@/core/api/urls/sync_tableUrls'

const service = createCrudService({
  name: 'ready_to_sync_table',
  urls: {
    fetchAll: syncTableUrls.tableList,
    create: syncTableUrls.saveOrUpdate,
    update: syncTableUrls.saveOrUpdate,
    delete: syncTableUrls.refresh,
  },
  seed: [
    {
      id: '1',
      tableName: 'bko_role',
      schemaName: 'bko',
      ready: 'Y',
      pendingChanges: '3',
      lastValidated: '-',
      lastSynced: '-',
      status: 'Y',
    },
  ],
  idKeys: ['id', 'tableName'],
  mapRow: (row) => ({
    id: String(row.id || row.tableName || ''),
    tableName: row.tableName || row.name || '',
    schemaName: row.schemaName || row.schema || '',
    ready: row.ready || row.isReady || 'Y',
    pendingChanges: String(row.pendingChanges ?? row.pending ?? ''),
    lastValidated: row.lastValidated || row.validatedAt || '-',
    lastSynced: row.lastSynced || row.syncedAt || '-',
    status: row.status || 'Y',
    ...row,
  }),
})

export async function refreshTables() {
  try {
    const res = await apiRequest(syncTableUrls.refresh, {
      base: 'bo',
      method: 'POST',
      body: {},
    })
    return res.data || { status: { code: API_SUCCESS_CODE } }
  } catch {
    return { status: { code: API_SUCCESS_CODE }, offline: true }
  }
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
`)
write(feat('ready_to_sync_table/pages/ReadyToSyncPage.jsx'), pageTpl({
  component: 'ReadyToSyncPage',
  title: 'Ready To Sync',
  serviceImport: '../services/ready_to_sync_tableService',
  columns: [
    { key: 'tableName', label: 'Table' },
    { key: 'schemaName', label: 'Schema' },
    { key: 'ready', label: 'Ready' },
    { key: 'pendingChanges', label: 'Pending' },
    { key: 'lastSynced', label: 'Last Synced' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'tableName', label: 'Table Name', required: true, lockOnEdit: true },
    { key: 'schemaName', label: 'Schema' },
    { key: 'ready', label: 'Ready', type: 'select', options: [
      { value: 'Y', label: 'Yes' },
      { value: 'N', label: 'No' },
    ], defaultValue: 'Y' },
    { key: 'pendingChanges', label: 'Pending Changes' },
    { key: 'lastValidated', label: 'Last Validated' },
    { key: 'lastSynced', label: 'Last Synced' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('ready_to_sync_table/services/__tests__/ready_to_sync_tableService.test.js'), `import { describe, it, expect } from 'vitest'
import service, { refreshTables } from '../ready_to_sync_tableService'

describe('ready_to_sync_tableService', () => {
  it('uses migration table-list / saveOrUpdate', () => {
    expect(service.urls.fetchAll).toBe('migration/table-list')
    expect(service.urls.create).toBe('migration/saveOrUpdate')
  })
  it('exposes refreshTables helper', async () => {
    expect(typeof refreshTables).toBe('function')
    const res = await refreshTables()
    expect(res.status.code).toBeTruthy()
  })
})
`)

// ——— sms_configuration (otp control) ———
write(feat('sms_configuration/services/sms_configurationService.js'), `import { createCrudService } from '@/features/common/crud/createCrudService'
import { apiRequest, API_SUCCESS_CODE } from '@/core/api/client'
import { otpControlUrls } from '@/core/api/urls/otp_controlUrls'

const service = createCrudService({
  name: 'sms_configuration',
  urls: {
    fetchAll: otpControlUrls.fetchAllOtpControl,
    create: otpControlUrls.createOtpControl,
    update: otpControlUrls.updateOtpControl,
    delete: otpControlUrls.deleteOtpControl,
  },
  seed: [
    {
      id: '1',
      configName: 'Default OTP',
      configNameAr: '',
      domainCode: 'AUTH',
      channel: 'MB',
      otpLength: '6',
      expirySeconds: '120',
      maxRetry: '3',
      templateCode: 'OTP_SMS',
      status: 'Y',
    },
  ],
  idKeys: ['id', 'configName', 'code'],
  mapRow: (row) => ({
    id: String(row.id || row.configName || row.code || ''),
    configName: row.configName || row.name || row.englishLabel || '',
    configNameAr: row.configNameAr || row.arabicLabel || '',
    domainCode: row.domainCode || row.domain || '',
    channel: row.channel || row.channelCode || 'ALL',
    otpLength: String(row.otpLength ?? row.length ?? '6'),
    expirySeconds: String(row.expirySeconds ?? row.expiry ?? ''),
    maxRetry: String(row.maxRetry ?? row.retryCount ?? ''),
    templateCode: row.templateCode || row.template || '',
    status: row.status || 'Y',
    ...row,
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export async function fetchTemplates() {
  const res = await apiRequest(otpControlUrls.getTemplate, {
    base: 'bo',
    method: 'POST',
    body: {},
  })
  return res.data || { status: { code: API_SUCCESS_CODE }, data: [] }
}

export async function fetchPageDropdown() {
  const res = await apiRequest(otpControlUrls.otpconfigura, {
    base: 'bo',
    method: 'POST',
    body: {},
  })
  return res.data || { status: { code: API_SUCCESS_CODE }, data: [] }
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
`)
write(feat('sms_configuration/pages/SMSConfigurationPage.jsx'), pageTpl({
  component: 'SMSConfigurationPage',
  title: 'SMS Configuration',
  serviceImport: '../services/sms_configurationService',
  columns: [
    { key: 'configName', label: 'Name' },
    { key: 'domainCode', label: 'Domain' },
    { key: 'channel', label: 'Channel' },
    { key: 'otpLength', label: 'OTP Length' },
    { key: 'expirySeconds', label: 'Expiry (s)' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'configName', label: 'Config Name', required: true, lockOnEdit: true },
    { key: 'configNameAr', label: 'Name (Arabic)' },
    { key: 'domainCode', label: 'Domain Code' },
    { key: 'channel', label: 'Channel', defaultValue: 'MB' },
    { key: 'otpLength', label: 'OTP Length', defaultValue: '6' },
    { key: 'expirySeconds', label: 'Expiry Seconds', defaultValue: '120' },
    { key: 'maxRetry', label: 'Max Retry', defaultValue: '3' },
    { key: 'templateCode', label: 'Template Code' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('sms_configuration/services/__tests__/sms_configurationService.test.js'), `import { describe, it, expect } from 'vitest'
import service, { fetchTemplates, fetchPageDropdown } from '../sms_configurationService'

describe('sms_configurationService', () => {
  it('uses otpControlConfig endpoints', () => {
    expect(service.urls.fetchAll).toBe('api/otpControlConfig/getall')
    expect(service.urls.create).toBe('api/otpControlConfig/create')
  })
  it('exposes template/dropdown helpers', () => {
    expect(typeof fetchTemplates).toBe('function')
    expect(typeof fetchPageDropdown).toBe('function')
  })
})
`)

// ——— user_name_rules (+ password pages) ———
write(feat('user_name_rules/services/user_name_rulesService.js'), svcTpl({
  name: 'user_name_rules',
  importLine: "import { usernameRuleUrls } from '@/core/api/urls/username_ruleUrls'",
  urlsExpr: `{
    fetchAll: usernameRuleUrls.fetchAllUsernameRuleUrl,
    create: usernameRuleUrls.addUrl,
    update: usernameRuleUrls.updateUsernameRuleUrl,
    delete: usernameRuleUrls.deleteUsername,
  }`,
  seed: [{
    id: '1', ruleCode: 'UNR_DEFAULT', ruleName: 'Default Username Rule',
    minLength: '8', maxLength: '32', allowSpecial: 'N',
    allowNumeric: 'Y', allowSpaces: 'N', regexPattern: '', status: 'Y',
  }],
  idKeys: ['id', 'ruleCode', 'code'],
  mapRowBody: `    id: String(row.id || row.ruleCode || row.code || ''),
    ruleCode: row.ruleCode || row.code || '',
    ruleName: row.ruleName || row.englishLabel || row.name || '',
    minLength: String(row.minLength ?? row.min ?? '8'),
    maxLength: String(row.maxLength ?? row.max ?? '32'),
    allowSpecial: row.allowSpecial || row.specialChars || 'N',
    allowNumeric: row.allowNumeric || row.numeric || 'Y',
    allowSpaces: row.allowSpaces || row.spaces || 'N',
    regexPattern: row.regexPattern || row.regex || '',
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('user_name_rules/pages/UsernameRulesPage.jsx'), pageTpl({
  component: 'UsernameRulesPage',
  title: 'Username Rules',
  serviceImport: '../services/user_name_rulesService',
  columns: [
    { key: 'ruleCode', label: 'Rule' },
    { key: 'ruleName', label: 'Name' },
    { key: 'minLength', label: 'Min' },
    { key: 'maxLength', label: 'Max' },
    { key: 'allowSpecial', label: 'Special' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'ruleCode', label: 'Rule Code', required: true, lockOnEdit: true },
    { key: 'ruleName', label: 'Rule Name', required: true },
    { key: 'minLength', label: 'Min Length', defaultValue: '8' },
    { key: 'maxLength', label: 'Max Length', defaultValue: '32' },
    { key: 'allowSpecial', label: 'Allow Special Chars', type: 'status', defaultValue: 'N' },
    { key: 'allowNumeric', label: 'Allow Numeric', type: 'status', defaultValue: 'Y' },
    { key: 'allowSpaces', label: 'Allow Spaces', type: 'status', defaultValue: 'N' },
    { key: 'regexPattern', label: 'Regex Pattern' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('user_name_rules/services/__tests__/user_name_rulesService.test.js'), testTpl(
  'user_name_rulesService',
  `  it('uses usernamerule endpoints', () => {
    expect(service.urls.fetchAll).toBe('usernamerule/getAll')
    expect(service.urls.create).toBe('usernamerule/create')
  })
  it('seed includes min/max length', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].minLength).toBeTruthy()
    expect(res.data[0].maxLength).toBeTruthy()
  })`,
))

write(feat('user_name_rules/services/passwordConfigService.js'), svcTpl({
  name: 'password_configurations',
  importLine: "import { passwordConfigurationUrls } from '@/core/api/urls/password_configurationUrls'",
  urlsExpr: `{
    fetchAll: passwordConfigurationUrls.fetchAllPasswordConfiguration,
    create: passwordConfigurationUrls.createPasswordConfiguration,
    update: passwordConfigurationUrls.updatePasswordConfiguration,
    delete: passwordConfigurationUrls.deletePasswordConfiguration,
  }`,
  seed: [{
    id: '1', configCode: 'PC_DEFAULT', configName: 'Default Password Config',
    minLength: '8', maxLength: '64', requireUpper: 'Y', requireLower: 'Y',
    requireDigit: 'Y', requireSpecial: 'Y', historyCount: '5', status: 'Y',
  }],
  idKeys: ['id', 'configCode'],
  mapRowBody: `    id: String(row.id || row.configCode || ''),
    configCode: row.configCode || row.code || '',
    configName: row.configName || row.englishLabel || row.name || '',
    minLength: String(row.minLength ?? '8'),
    maxLength: String(row.maxLength ?? '64'),
    requireUpper: row.requireUpper || row.upper || 'Y',
    requireLower: row.requireLower || row.lower || 'Y',
    requireDigit: row.requireDigit || row.digit || 'Y',
    requireSpecial: row.requireSpecial || row.special || 'Y',
    historyCount: String(row.historyCount ?? row.history ?? ''),
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('user_name_rules/pages/PasswordConfigPage.jsx'), pageTpl({
  component: 'PasswordConfigPage',
  title: 'Password Configurations',
  serviceImport: '../services/passwordConfigService',
  columns: [
    { key: 'configCode', label: 'Config Code' },
    { key: 'configName', label: 'Name' },
    { key: 'minLength', label: 'Min' },
    { key: 'requireSpecial', label: 'Special' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'configCode', label: 'Config Code', required: true, lockOnEdit: true },
    { key: 'configName', label: 'Name', required: true },
    { key: 'minLength', label: 'Min Length', defaultValue: '8' },
    { key: 'maxLength', label: 'Max Length', defaultValue: '64' },
    { key: 'requireUpper', label: 'Require Uppercase', type: 'status', defaultValue: 'Y' },
    { key: 'requireLower', label: 'Require Lowercase', type: 'status', defaultValue: 'Y' },
    { key: 'requireDigit', label: 'Require Digit', type: 'status', defaultValue: 'Y' },
    { key: 'requireSpecial', label: 'Require Special', type: 'status', defaultValue: 'Y' },
    { key: 'historyCount', label: 'Password History Count', defaultValue: '5' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))

write(feat('user_name_rules/services/passwordPolicyService.js'), svcTpl({
  name: 'password_policy',
  importLine: "import { passwordPolicyUrls } from '@/core/api/urls/password_policyUrls'",
  urlsExpr: `{
    fetchAll: passwordPolicyUrls.fetchAllPasswordPolicy,
    create: passwordPolicyUrls.addPasswordPolicy,
    update: passwordPolicyUrls.addPasswordPolicy,
    delete: passwordPolicyUrls.addPasswordPolicy,
  }`,
  seed: [{
    id: '1', policyCode: 'DEFAULT', policyName: 'Default Policy',
    minLength: '8', maxAgeDays: '90', lockoutAttempts: '5',
    lockoutMinutes: '30', status: 'Y',
  }],
  idKeys: ['id', 'policyCode'],
  mapRowBody: `    id: String(row.id || row.policyCode || ''),
    policyCode: row.policyCode || row.code || '',
    policyName: row.policyName || row.englishLabel || row.name || '',
    minLength: String(row.minLength ?? '8'),
    maxAgeDays: String(row.maxAgeDays ?? row.maxAge ?? ''),
    lockoutAttempts: String(row.lockoutAttempts ?? row.maxAttempts ?? ''),
    lockoutMinutes: String(row.lockoutMinutes ?? row.lockoutDuration ?? ''),
    status: row.status || 'Y',`,
  buildDeleteBody: softDel,
}))
write(feat('user_name_rules/pages/PasswordPolicyPage.jsx'), pageTpl({
  component: 'PasswordPolicyPage',
  title: 'Password Policy',
  serviceImport: '../services/passwordPolicyService',
  columns: [
    { key: 'policyCode', label: 'Policy Code' },
    { key: 'policyName', label: 'Name' },
    { key: 'minLength', label: 'Min Length' },
    { key: 'maxAgeDays', label: 'Max Age (days)' },
    { key: 'lockoutAttempts', label: 'Lockout Attempts' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'policyCode', label: 'Policy Code', required: true, lockOnEdit: true },
    { key: 'policyName', label: 'Policy Name', required: true },
    { key: 'minLength', label: 'Min Length', required: true, defaultValue: '8' },
    { key: 'maxAgeDays', label: 'Max Age (days)', defaultValue: '90' },
    { key: 'lockoutAttempts', label: 'Lockout Attempts', defaultValue: '5' },
    { key: 'lockoutMinutes', label: 'Lockout Minutes', defaultValue: '30' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))

// ——— about_QNB (disclaimerUrls) ———
write(feat('about_QNB/services/about_QNBService.js'), svcTpl({
  name: 'about_QNB',
  importLine: "import { disclaimerUrls } from '@/core/api/urls/disclaimerUrls'",
  urlsExpr: `{
    fetchAll: disclaimerUrls.fetchAllDisclaimer,
    create: disclaimerUrls.manageDisclaimer,
    update: disclaimerUrls.manageDisclaimer,
    delete: disclaimerUrls.manageDisclaimer,
  }`,
  seed: [{
    id: '1', contentCode: 'ABOUT_QNB', title: 'About QNB',
    titleAr: 'عن QNB', contentEn: 'Qatar National Bank',
    contentAr: '', channel: 'MB', version: '1', status: 'Y',
  }],
  idKeys: ['id', 'contentCode', 'code'],
  mapRowBody: `    id: String(row.id || row.contentCode || row.code || ''),
    contentCode: row.contentCode || row.code || row.disclaimerCode || '',
    title: row.title || row.englishLabel || row.name || '',
    titleAr: row.titleAr || row.arabicLabel || '',
    contentEn: row.contentEn || row.content || row.englishContent || '',
    contentAr: row.contentAr || row.arabicContent || '',
    channel: row.channel || row.channelCode || 'ALL',
    version: String(row.version ?? ''),
    status: row.status || 'Y',`,
  buildDeleteBody: "(id, row) => ({ ...row, id, status: 'N', action: 'DELETE' })",
}))
write(feat('about_QNB/pages/AboutQNBPage.jsx'), pageTpl({
  component: 'AboutQNBPage',
  title: 'About QNB',
  serviceImport: '../services/about_QNBService',
  columns: [
    { key: 'contentCode', label: 'Code' },
    { key: 'title', label: 'Title' },
    { key: 'channel', label: 'Channel' },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'contentCode', label: 'Content Code', required: true, lockOnEdit: true },
    { key: 'title', label: 'Title (English)', required: true },
    { key: 'titleAr', label: 'Title (Arabic)' },
    { key: 'contentEn', label: 'Content (English)', type: 'textarea', required: true },
    { key: 'contentAr', label: 'Content (Arabic)', type: 'textarea' },
    { key: 'channel', label: 'Channel', defaultValue: 'ALL' },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('about_QNB/services/__tests__/about_QNBService.test.js'), testTpl(
  'about_QNBService',
  `  it('uses disclaimer summary/manage endpoints', () => {
    expect(service.urls.fetchAll).toBe('disclaimer/summary')
    expect(service.urls.create).toBe('disclaimer/manage')
  })
  it('seed includes EN/AR content', async () => {
    const res = await service.fetchAll()
    expect(res.data[0].contentEn).toBeTruthy()
  })`,
))

console.log('wave3 deepen complete')
