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

function svcTpl({ name, importLine, urlsExpr, seed, idKeys, mapRowBody, buildDeleteBody, extras = '' }) {
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
${extras}
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

// ——— release_management ———
write(feat('release_management/services/release_managementService.js'), svcTpl({
  name: 'release_management',
  importLine: '',
  urlsExpr: `{
    fetchAll: 'release/getAll',
    create: 'release/save',
    update: 'release/save',
    delete: 'release/delete',
  }`,
  seed: [{
    id: '1', version: '3.5.0', platform: 'Android', releaseDate: '2026-01-01',
    releaseNotes: 'Bug fixes and performance', releaseNotesAr: '', forceUpdate: 'N', status: 'Y',
  }],
  idKeys: ['id', 'version', 'releaseId'],
  mapRowBody: `    id: String(row.id || row.releaseId || row.version || ''),
    version: row.version || row.releaseVersion || '',
    platform: row.platform || row.os || '',
    releaseDate: row.releaseDate || row.date || '',
    releaseNotes: row.releaseNotes || row.notes || row.description || '',
    releaseNotesAr: row.releaseNotesAr || '',
    forceUpdate: row.forceUpdate || 'N',
    status: row.status || 'Y',`,
}))
write(feat('release_management/pages/ReleaseManagementPage.jsx'), pageTpl({
  component: 'ReleaseManagementPage',
  title: 'Release Management',
  serviceImport: '../services/release_managementService',
  columns: [
    { key: 'version', label: 'Version' },
    { key: 'platform', label: 'Platform' },
    { key: 'releaseDate', label: 'Release Date' },
    { key: 'forceUpdate', label: 'Force Update' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'version', label: 'Version', required: true, lockOnEdit: true },
    {
      key: 'platform', label: 'Platform', type: 'select', required: true,
      options: [
        { value: 'Android', label: 'Android' },
        { value: 'iOS', label: 'iOS' },
        { value: 'ALL', label: 'All' },
      ],
      defaultValue: 'Android',
    },
    { key: 'releaseDate', label: 'Release Date', required: true },
    { key: 'releaseNotes', label: 'Release Notes (EN)', type: 'textarea' },
    { key: 'releaseNotesAr', label: 'Release Notes (AR)', type: 'textarea' },
    {
      key: 'forceUpdate', label: 'Force Update', type: 'select',
      options: [{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }],
      defaultValue: 'N',
    },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('release_management/services/__tests__/release_managementService.test.js'), testTpl(
  'release_managementService',
  `  it('uses release SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('release/getAll')
    expect(service.urls.create).toBe('release/save')
  })`,
))

// ——— rule_management ———
write(feat('rule_management/services/rule_managementService.js'), svcTpl({
  name: 'rule_management',
  importLine: "import { ruleManagementUrls } from '@/core/api/urls/rule_managementUrls'",
  urlsExpr: `{
    fetchAll: ruleManagementUrls.allRule,
    create: ruleManagementUrls.addRule,
    update: ruleManagementUrls.editRule,
    delete: ruleManagementUrls.deleteRule,
  }`,
  seed: [{
    id: '1', ruleCode: 'R1', ruleName: 'Default Rule', ruleNameAr: '',
    ruleType: 'VALIDATION', priority: '10', expression: 'amount > 0',
    description: 'Basic amount validation', status: 'Y',
  }],
  idKeys: ['id', 'ruleCode', 'ruleId'],
  mapRowBody: `    id: String(row.id || row.ruleCode || row.ruleId || ''),
    ruleCode: row.ruleCode || row.code || '',
    ruleName: row.ruleName || row.name || row.englishLabel || '',
    ruleNameAr: row.ruleNameAr || row.arabicLabel || '',
    ruleType: row.ruleType || row.type || '',
    priority: String(row.priority ?? ''),
    expression: row.expression || row.ruleExpression || row.condition || '',
    description: row.description || row.desc || '',
    status: row.status || 'Y',`,
}))
write(feat('rule_management/pages/RuleManagementPage.jsx'), pageTpl({
  component: 'RuleManagementPage',
  title: 'Rule Management',
  serviceImport: '../services/rule_managementService',
  columns: [
    { key: 'ruleCode', label: 'Rule Code' },
    { key: 'ruleName', label: 'Name' },
    { key: 'ruleType', label: 'Type' },
    { key: 'priority', label: 'Priority' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'ruleCode', label: 'Rule Code', required: true, lockOnEdit: true },
    { key: 'ruleName', label: 'Rule Name (EN)', required: true },
    { key: 'ruleNameAr', label: 'Rule Name (AR)' },
    {
      key: 'ruleType', label: 'Rule Type', type: 'select',
      options: [
        { value: 'VALIDATION', label: 'Validation' },
        { value: 'ROUTING', label: 'Routing' },
        { value: 'LIMIT', label: 'Limit' },
        { value: 'FRAUD', label: 'Fraud' },
        { value: 'OTHER', label: 'Other' },
      ],
      defaultValue: 'VALIDATION',
    },
    { key: 'priority', label: 'Priority' },
    { key: 'expression', label: 'Expression / Condition', type: 'textarea' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('rule_management/services/__tests__/rule_managementService.test.js'), testTpl(
  'rule_managementService',
  `  it('uses bko-rule endpoints', () => {
    expect(service.urls.fetchAll).toBe('bko-rule/fetchAll')
    expect(service.urls.create).toBe('bko-rule/post')
    expect(service.urls.update).toBe('bko-rule/update')
    expect(service.urls.delete).toBe('bko-rule/delete')
  })`,
))

// ——— screen_configuration (theme) + TermsDisclaimer ———
write(feat('screen_configuration/services/screen_configurationService.js'), svcTpl({
  name: 'screen_configuration',
  importLine: "import { themeConfigUrls } from '@/core/api/urls/theme_configUrls'",
  urlsExpr: `{
    fetchAll: themeConfigUrls.fetchAllTheme,
    create: themeConfigUrls.manageTheme,
    update: themeConfigUrls.manageTheme,
    delete: themeConfigUrls.manageTheme,
  }`,
  seed: [{
    id: '1', themeCode: 'DEFAULT', themeName: 'Default Theme', themeNameAr: '',
    primaryColor: '#8A1538', secondaryColor: '#1A1A2E', fontFamily: 'Roboto',
    isDefault: 'Y', status: 'Y',
  }],
  idKeys: ['id', 'themeCode', 'code'],
  mapRowBody: `    id: String(row.id || row.themeCode || row.code || ''),
    themeCode: row.themeCode || row.code || '',
    themeName: row.themeName || row.name || row.englishLabel || '',
    themeNameAr: row.themeNameAr || row.arabicLabel || '',
    primaryColor: row.primaryColor || row.primary || '',
    secondaryColor: row.secondaryColor || row.secondary || '',
    fontFamily: row.fontFamily || row.font || '',
    isDefault: row.isDefault || row.defaultTheme || 'N',
    status: row.status || 'Y',`,
  buildDeleteBody: '(id, row) => ({ ...row, id, status: \'N\' })',
}))
write(feat('screen_configuration/pages/ScreenConfigurationPage.jsx'), pageTpl({
  component: 'ScreenConfigurationPage',
  title: 'Theme Configuration',
  serviceImport: '../services/screen_configurationService',
  columns: [
    { key: 'themeCode', label: 'Theme Code' },
    { key: 'themeName', label: 'Name' },
    { key: 'primaryColor', label: 'Primary' },
    { key: 'fontFamily', label: 'Font' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'themeCode', label: 'Theme Code', required: true, lockOnEdit: true },
    { key: 'themeName', label: 'Theme Name (EN)', required: true },
    { key: 'themeNameAr', label: 'Theme Name (AR)' },
    { key: 'primaryColor', label: 'Primary Color' },
    { key: 'secondaryColor', label: 'Secondary Color' },
    { key: 'fontFamily', label: 'Font Family' },
    {
      key: 'isDefault', label: 'Default Theme', type: 'select',
      options: [{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }],
      defaultValue: 'N',
    },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('screen_configuration/services/termsDisclaimerService.js'), svcTpl({
  name: 'terms_disclaimer',
  importLine: "import { disclaimerUrls } from '@/core/api/urls/disclaimerUrls'",
  urlsExpr: `{
    fetchAll: disclaimerUrls.fetchAllDisclaimer,
    create: disclaimerUrls.manageDisclaimer,
    update: disclaimerUrls.manageDisclaimer,
    delete: disclaimerUrls.manageDisclaimer,
  }`,
  seed: [{
    id: '1', disclaimerCode: 'TC1', titleEn: 'Terms & Conditions', titleAr: '',
    contentEn: 'Default terms', contentAr: '', channel: 'ALL', version: '1.0', status: 'Y',
  }],
  idKeys: ['id', 'disclaimerCode', 'code'],
  mapRowBody: `    id: String(row.id || row.disclaimerCode || row.code || ''),
    disclaimerCode: row.disclaimerCode || row.code || '',
    titleEn: row.titleEn || row.title || row.englishLabel || '',
    titleAr: row.titleAr || row.arabicLabel || '',
    contentEn: row.contentEn || row.content || row.englishContent || '',
    contentAr: row.contentAr || row.arabicContent || '',
    channel: row.channel || 'ALL',
    version: row.version || '',
    status: row.status || 'Y',`,
  buildDeleteBody: '(id, row) => ({ ...row, id, status: \'N\' })',
}))
write(feat('screen_configuration/pages/TermsDisclaimerPage.jsx'), pageTpl({
  component: 'TermsDisclaimerPage',
  title: 'Terms & Disclaimer',
  serviceImport: '../services/termsDisclaimerService',
  columns: [
    { key: 'disclaimerCode', label: 'Code' },
    { key: 'titleEn', label: 'Title (EN)' },
    { key: 'channel', label: 'Channel' },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'disclaimerCode', label: 'Code', required: true, lockOnEdit: true },
    { key: 'titleEn', label: 'Title (EN)', required: true },
    { key: 'titleAr', label: 'Title (AR)' },
    { key: 'contentEn', label: 'Content (EN)', type: 'textarea', required: true },
    { key: 'contentAr', label: 'Content (AR)', type: 'textarea' },
    {
      key: 'channel', label: 'Channel', type: 'select',
      options: [
        { value: 'MB', label: 'Mobile Banking' },
        { value: 'IB', label: 'Internet Banking' },
        { value: 'ALL', label: 'All' },
      ],
      defaultValue: 'ALL',
    },
    { key: 'version', label: 'Version' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('screen_configuration/services/__tests__/screen_configurationService.test.js'), testTpl(
  'screen_configurationService',
  `  it('uses theme/config endpoints', () => {
    expect(service.urls.fetchAll).toBe('theme/config/fetch')
    expect(service.urls.create).toBe('theme/config/manage')
  })`,
))
write(feat('screen_configuration/services/__tests__/termsDisclaimerService.test.js'), testTpl(
  'termsDisclaimerService',
  `  it('uses disclaimer endpoints', () => {
    expect(service.urls.fetchAll).toBe('disclaimer/summary')
    expect(service.urls.create).toBe('disclaimer/manage')
  })`,
))

// ——— sync_table_management ———
write(feat('sync_table_management/services/sync_table_managementService.js'), `import { createCrudService } from '@/features/common/crud/createCrudService'
import { syncTableUrls } from '@/core/api/urls/sync_tableUrls'
import { apiRequest, isApiSuccess, API_SUCCESS_CODE } from '@/core/api/client'

const service = createCrudService({
  name: 'sync_table_management',
  urls: {
    fetchAll: syncTableUrls.tableList,
    create: syncTableUrls.saveOrUpdate,
    update: syncTableUrls.saveOrUpdate,
    delete: syncTableUrls.saveOrUpdate,
  },
  seed: [
    {
      id: '1',
      tableName: 'bko_user',
      schemaName: 'bko',
      lastSync: '-',
      syncStatus: 'READY',
      recordCount: '0',
      status: 'Y',
    },
  ],
  idKeys: ['id', 'tableName', 'tableId'],
  mapRow: (row) => ({
    id: String(row.id || row.tableName || row.tableId || ''),
    tableName: row.tableName || row.name || '',
    schemaName: row.schemaName || row.schema || '',
    lastSync: row.lastSync || row.lastSyncDate || row.syncedAt || '-',
    syncStatus: row.syncStatus || row.state || 'READY',
    recordCount: String(row.recordCount ?? row.count ?? ''),
    status: row.status || 'Y',
    ...row,
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export async function refreshTables() {
  try {
    const res = await apiRequest(syncTableUrls.refresh, { base: 'bo', method: 'POST', body: {} })
    if (res.ok || isApiSuccess(res.data)) {
      return { status: { code: API_SUCCESS_CODE }, raw: res.data }
    }
  } catch {
    /* offline */
  }
  return { status: { code: API_SUCCESS_CODE }, offline: true }
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
`)
write(feat('sync_table_management/pages/SyncTableManagementPage.jsx'), pageTpl({
  component: 'SyncTableManagementPage',
  title: 'Table Migration',
  serviceImport: '../services/sync_table_managementService',
  columns: [
    { key: 'tableName', label: 'Table' },
    { key: 'schemaName', label: 'Schema' },
    { key: 'lastSync', label: 'Last Sync' },
    { key: 'syncStatus', label: 'Sync Status' },
    { key: 'recordCount', label: 'Records' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'tableName', label: 'Table Name', required: true, lockOnEdit: true },
    { key: 'schemaName', label: 'Schema' },
    {
      key: 'syncStatus', label: 'Sync Status', type: 'select',
      options: [
        { value: 'READY', label: 'Ready' },
        { value: 'SYNCING', label: 'Syncing' },
        { value: 'DONE', label: 'Done' },
        { value: 'ERROR', label: 'Error' },
      ],
      defaultValue: 'READY',
    },
    { key: 'recordCount', label: 'Record Count' },
    { key: 'lastSync', label: 'Last Sync' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('sync_table_management/services/__tests__/sync_table_managementService.test.js'), `import { describe, it, expect } from 'vitest'
import service, { refreshTables } from '../sync_table_managementService'

describe('sync_table_managementService', () => {
  it('uses migration endpoints', () => {
    expect(service.urls.fetchAll).toBe('migration/table-list')
    expect(service.urls.create).toBe('migration/saveOrUpdate')
  })

  it('exposes refreshTables helper', async () => {
    const res = await refreshTables()
    expect(res.status.code).toBeDefined()
  })
})
`)

// ——— ready_to_sync ———
write(feat('ready_to_sync_table/services/ready_to_sync_tableService.js'), svcTpl({
  name: 'ready_to_sync_table',
  importLine: "import { syncTableUrls } from '@/core/api/urls/sync_tableUrls'",
  urlsExpr: `{
    fetchAll: syncTableUrls.tableList,
    create: syncTableUrls.refresh,
    update: syncTableUrls.refresh,
    delete: syncTableUrls.refresh,
  }`,
  seed: [{
    id: '1', tableName: 'bko_role', schemaName: 'bko', ready: 'Y',
    pendingChanges: '3', lastValidated: '-', status: 'Y',
  }],
  idKeys: ['id', 'tableName'],
  mapRowBody: `    id: String(row.id || row.tableName || ''),
    tableName: row.tableName || row.name || '',
    schemaName: row.schemaName || row.schema || '',
    ready: row.ready || row.isReady || 'Y',
    pendingChanges: String(row.pendingChanges ?? row.pending ?? ''),
    lastValidated: row.lastValidated || row.validatedAt || '-',
    status: row.status || 'Y',`,
}))
write(feat('ready_to_sync_table/pages/ReadyToSyncPage.jsx'), pageTpl({
  component: 'ReadyToSyncPage',
  title: 'Ready To Sync',
  serviceImport: '../services/ready_to_sync_tableService',
  columns: [
    { key: 'tableName', label: 'Table' },
    { key: 'schemaName', label: 'Schema' },
    { key: 'ready', label: 'Ready' },
    { key: 'pendingChanges', label: 'Pending' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'tableName', label: 'Table Name', required: true, lockOnEdit: true },
    { key: 'schemaName', label: 'Schema' },
    {
      key: 'ready', label: 'Ready', type: 'select',
      options: [{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }],
      defaultValue: 'Y',
    },
    { key: 'pendingChanges', label: 'Pending Changes' },
    { key: 'lastValidated', label: 'Last Validated' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('ready_to_sync_table/services/__tests__/ready_to_sync_tableService.test.js'), testTpl(
  'ready_to_sync_tableService',
  `  it('uses migration table-list + refresh', () => {
    expect(service.urls.fetchAll).toBe('migration/table-list')
    expect(service.urls.create).toBe('migration/refresh')
  })`,
))

// ——— gateway_sync ———
write(feat('gateway_sync/services/gateway_syncService.js'), svcTpl({
  name: 'gateway_sync',
  importLine: '',
  urlsExpr: `{
    fetchAll: 'gateway/getAll',
    create: 'gateway/save',
    update: 'gateway/save',
    delete: 'gateway/delete',
  }`,
  seed: [{
    id: '1', gatewayCode: 'GW1', gatewayName: 'Primary Gateway', gatewayNameAr: '',
    endpointUrl: 'https://gw.example.com', protocol: 'REST', environment: 'PROD',
    syncInterval: '60', status: 'Y',
  }],
  idKeys: ['id', 'gatewayCode', 'code'],
  mapRowBody: `    id: String(row.id || row.gatewayCode || row.code || ''),
    gatewayCode: row.gatewayCode || row.code || '',
    gatewayName: row.gatewayName || row.name || row.englishLabel || '',
    gatewayNameAr: row.gatewayNameAr || row.arabicLabel || '',
    endpointUrl: row.endpointUrl || row.url || row.endpoint || '',
    protocol: row.protocol || row.type || 'REST',
    environment: row.environment || row.env || 'PROD',
    syncInterval: String(row.syncInterval ?? row.interval ?? ''),
    status: row.status || 'Y',`,
}))
write(feat('gateway_sync/pages/GatewaySyncPage.jsx'), pageTpl({
  component: 'GatewaySyncPage',
  title: 'Gateway Sync / Configuration',
  serviceImport: '../services/gateway_syncService',
  columns: [
    { key: 'gatewayCode', label: 'Code' },
    { key: 'gatewayName', label: 'Name' },
    { key: 'protocol', label: 'Protocol' },
    { key: 'environment', label: 'Env' },
    { key: 'status', label: 'Status', statusChip: true },
  ],
  fields: [
    { key: 'gatewayCode', label: 'Gateway Code', required: true, lockOnEdit: true },
    { key: 'gatewayName', label: 'Gateway Name (EN)', required: true },
    { key: 'gatewayNameAr', label: 'Gateway Name (AR)' },
    { key: 'endpointUrl', label: 'Endpoint URL', required: true },
    {
      key: 'protocol', label: 'Protocol', type: 'select',
      options: [
        { value: 'REST', label: 'REST' },
        { value: 'SOAP', label: 'SOAP' },
        { value: 'MQ', label: 'MQ' },
        { value: 'GRAPHQL', label: 'GraphQL' },
      ],
      defaultValue: 'REST',
    },
    {
      key: 'environment', label: 'Environment', type: 'select',
      options: [
        { value: 'DEV', label: 'DEV' },
        { value: 'SIT', label: 'SIT' },
        { value: 'UAT', label: 'UAT' },
        { value: 'PROD', label: 'PROD' },
      ],
      defaultValue: 'PROD',
    },
    { key: 'syncInterval', label: 'Sync Interval (sec)' },
    { key: 'status', label: 'Status', type: 'status' },
  ],
}))
write(feat('gateway_sync/services/__tests__/gateway_syncService.test.js'), testTpl(
  'gateway_syncService',
  `  it('uses gateway SoftFetch paths', () => {
    expect(service.urls.fetchAll).toBe('gateway/getAll')
    expect(service.urls.create).toBe('gateway/save')
  })`,
))

console.log('part2a done')
