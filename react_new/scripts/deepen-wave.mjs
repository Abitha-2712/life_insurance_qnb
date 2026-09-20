#!/usr/bin/env node
/**
 * Deepen-wave generator: dedicated other_config pages + services + route map patch hints.
 * Run from react/: node scripts/deepen-wave.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ocPages = path.join(root, 'src/features/other_config/pages')
const ocServices = path.join(root, 'src/features/other_config/services')
const ocTests = path.join(ocServices, '__tests__')

fs.mkdirSync(ocPages, { recursive: true })
fs.mkdirSync(ocTests, { recursive: true })

/** Dedicated pages that still pointed at OtherConfigurationPage catch-all */
const modules = [
  {
    id: 'cheque_book',
    page: 'ChequeBookPage',
    title: 'Cheque Book Management',
    routeKeys: ['cheque_book_management'],
    urls: { fetchAll: 'cheque-book/getAll', create: 'cheque-book/create', update: 'cheque-book/update', delete: 'cheque-book/delete' },
    columns: [
      { key: 'productCode', label: 'Product Code' },
      { key: 'productName', label: 'Product Name' },
      { key: 'leaves', label: 'Leaves' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'productCode', label: 'Product Code', required: true, lockOnEdit: true },
      { key: 'productName', label: 'Product Name', required: true },
      { key: 'leaves', label: 'Number of Leaves' },
      { key: 'feeAmount', label: 'Fee Amount' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', productCode: 'CB25', productName: '25 Leaves', leaves: '25', feeAmount: '10', status: 'Y' }],
    idKeys: ['id', 'productCode'],
  },
  {
    id: 'cheque_deposit',
    page: 'ChequeDepositPage',
    title: 'Cheque Deposit',
    routeKeys: ['cheque_deposit'],
    urls: { fetchAll: 'cheque-deposit/getAll', create: 'cheque-deposit/create', update: 'cheque-deposit/update', delete: 'cheque-deposit/delete' },
    columns: [
      { key: 'configCode', label: 'Config Code' },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'configCode', label: 'Config Code', required: true, lockOnEdit: true },
      { key: 'description', label: 'Description', required: true },
      { key: 'maxAmount', label: 'Max Amount' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', configCode: 'CD1', description: 'Default deposit', maxAmount: '50000', status: 'Y' }],
    idKeys: ['id', 'configCode'],
  },
  {
    id: 'western_union_email',
    page: 'WesternUnionEmailPage',
    title: 'Western Union Email',
    routeKeys: ['western_union_email'],
    urls: { fetchAll: 'wu-email/getAll', create: 'wu-email/save', update: 'wu-email/save', delete: 'wu-email/delete' },
    columns: [
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'email', label: 'Email', required: true },
      { key: 'role', label: 'Role' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', email: 'wu.ops@qnb.com', role: 'Ops', status: 'Y' }],
    idKeys: ['id', 'email'],
  },
  {
    id: 'western_union_history',
    page: 'WesternUnionHistoryPage',
    title: 'Western Union History',
    routeKeys: ['western_union_history'],
    urls: { fetchAll: 'wu-history/getAll', create: 'wu-history/save', update: 'wu-history/save', delete: 'wu-history/delete' },
    columns: [
      { key: 'referenceNo', label: 'Reference' },
      { key: 'amount', label: 'Amount' },
      { key: 'currency', label: 'Currency' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'referenceNo', label: 'Reference No', required: true, lockOnEdit: true },
      { key: 'amount', label: 'Amount', required: true },
      { key: 'currency', label: 'Currency', defaultValue: 'QAR' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', referenceNo: 'WU001', amount: '1000', currency: 'QAR', status: 'Y' }],
    idKeys: ['id', 'referenceNo'],
  },
  {
    id: 'afaq',
    page: 'AfaqManagementPage',
    title: 'Afaq Management',
    routeKeys: ['afaq_management'],
    urls: { fetchAll: 'afaq/getAll', create: 'afaq/create', update: 'afaq/update', delete: 'afaq/delete' },
    columns: [
      { key: 'afaqCode', label: 'Code' },
      { key: 'afaqName', label: 'Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'afaqCode', label: 'Afaq Code', required: true, lockOnEdit: true },
      { key: 'afaqName', label: 'Name', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', afaqCode: 'AF1', afaqName: 'Afaq Default', description: '', status: 'Y' }],
    idKeys: ['id', 'afaqCode'],
  },
  {
    id: 'beneficiary',
    page: 'BeneficiaryConfigPage',
    title: 'Beneficiary Configuration',
    routeKeys: ['beneficiary_nav', 'beneficiary_add', 'beneficiary_edit', 'beneficiary_cooling_off', 'beneficiary_cooling_pending'],
    urls: { fetchAll: 'beneficiary/getAll', create: 'beneficiary/create', update: 'beneficiary/update', delete: 'beneficiary/delete' },
    columns: [
      { key: 'beneficiaryType', label: 'Type' },
      { key: 'coolingPeriodHours', label: 'Cooling (hrs)' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'beneficiaryType', label: 'Beneficiary Type', required: true, lockOnEdit: true },
      { key: 'coolingPeriodHours', label: 'Cooling Period (Hours)', required: true },
      { key: 'maxBeneficiaries', label: 'Max Beneficiaries' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', beneficiaryType: 'Domestic', coolingPeriodHours: '24', maxBeneficiaries: '10', status: 'Y' }],
    idKeys: ['id', 'beneficiaryType'],
  },
  {
    id: 'charity',
    page: 'CharityManagementPage',
    title: 'Charity Management',
    routeKeys: ['charity_management'],
    urls: { fetchAll: 'charity/getAll', create: 'charity/create', update: 'charity/update', delete: 'charity/delete' },
    columns: [
      { key: 'charityCode', label: 'Code' },
      { key: 'charityNameEn', label: 'Name (EN)' },
      { key: 'charityNameAr', label: 'Name (AR)' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'charityCode', label: 'Charity Code', required: true, lockOnEdit: true },
      { key: 'charityNameEn', label: 'Name (English)', required: true },
      { key: 'charityNameAr', label: 'Name (Arabic)' },
      { key: 'accountNumber', label: 'Account Number' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', charityCode: 'CH1', charityNameEn: 'Qatar Charity', charityNameAr: 'قطر الخيرية', accountNumber: '001', status: 'Y' }],
    idKeys: ['id', 'charityCode'],
  },
  {
    id: 'card',
    page: 'CardManagementPage',
    title: 'Card Management',
    routeKeys: ['card'],
    urls: { fetchAll: 'card/getAll', create: 'card/create', update: 'card/update', delete: 'card/delete' },
    columns: [
      { key: 'cardProductCode', label: 'Product Code' },
      { key: 'cardProductName', label: 'Product Name' },
      { key: 'cardType', label: 'Type' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'cardProductCode', label: 'Product Code', required: true, lockOnEdit: true },
      { key: 'cardProductName', label: 'Product Name', required: true },
      { key: 'cardType', label: 'Card Type' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', cardProductCode: 'VISA_GOLD', cardProductName: 'Visa Gold', cardType: 'Credit', status: 'Y' }],
    idKeys: ['id', 'cardProductCode'],
  },
  {
    id: 'card_spend',
    page: 'CardSpendPage',
    title: 'Card Spend',
    routeKeys: ['card_spend', 'sector_management'],
    urls: { fetchAll: 'card-spend/getAll', create: 'card-spend/save', update: 'card-spend/save', delete: 'card-spend/delete' },
    columns: [
      { key: 'mccCode', label: 'MCC' },
      { key: 'categoryName', label: 'Category' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'mccCode', label: 'MCC Code', required: true, lockOnEdit: true },
      { key: 'categoryName', label: 'Category Name', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', mccCode: '5411', categoryName: 'Grocery', status: 'Y' }],
    idKeys: ['id', 'mccCode'],
  },
  {
    id: 'card_issuance',
    page: 'CardIssuancePage',
    title: 'Card Issuance',
    routeKeys: ['card_issuance_management'],
    urls: { fetchAll: 'card-issuance/getAll', create: 'card-issuance/create', update: 'card-issuance/update', delete: 'card-issuance/delete' },
    columns: [
      { key: 'issuanceCode', label: 'Code' },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'issuanceCode', label: 'Issuance Code', required: true, lockOnEdit: true },
      { key: 'description', label: 'Description', required: true },
      { key: 'feeAmount', label: 'Fee Amount' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', issuanceCode: 'ISS1', description: 'Standard issuance', feeAmount: '50', status: 'Y' }],
    idKeys: ['id', 'issuanceCode'],
  },
  {
    id: 'google_pay',
    page: 'GooglePayPage',
    title: 'Google Pay',
    routeKeys: ['google_pay'],
    urls: { fetchAll: 'google-pay/getAll', create: 'google-pay/save', update: 'google-pay/save', delete: 'google-pay/delete' },
    columns: [
      { key: 'configKey', label: 'Key' },
      { key: 'configValue', label: 'Value' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'configKey', label: 'Config Key', required: true, lockOnEdit: true },
      { key: 'configValue', label: 'Config Value', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', configKey: 'enabled', configValue: 'Y', status: 'Y' }],
    idKeys: ['id', 'configKey'],
  },
  {
    id: 'apple_pay',
    page: 'ApplePayPage',
    title: 'Apple Pay',
    routeKeys: ['apple_pay'],
    urls: { fetchAll: 'apple-pay/getAll', create: 'apple-pay/save', update: 'apple-pay/save', delete: 'apple-pay/delete' },
    columns: [
      { key: 'configKey', label: 'Key' },
      { key: 'configValue', label: 'Value' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'configKey', label: 'Config Key', required: true, lockOnEdit: true },
      { key: 'configValue', label: 'Config Value', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', configKey: 'enabled', configValue: 'Y', status: 'Y' }],
    idKeys: ['id', 'configKey'],
  },
  {
    id: 'direct_remittance',
    page: 'DirectRemittancePage',
    title: 'Direct Remittance',
    routeKeys: ['direct_remittance'],
    urls: { fetchAll: 'direct-remittance/getAll', create: 'direct-remittance/create', update: 'direct-remittance/update', delete: 'direct-remittance/delete' },
    columns: [
      { key: 'corridorCode', label: 'Corridor' },
      { key: 'corridorName', label: 'Name' },
      { key: 'currency', label: 'Currency' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'corridorCode', label: 'Corridor Code', required: true, lockOnEdit: true },
      { key: 'corridorName', label: 'Corridor Name', required: true },
      { key: 'currency', label: 'Currency', defaultValue: 'QAR' },
      { key: 'minAmount', label: 'Min Amount' },
      { key: 'maxAmount', label: 'Max Amount' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', corridorCode: 'IN', corridorName: 'India', currency: 'INR', minAmount: '10', maxAmount: '10000', status: 'Y' }],
    idKeys: ['id', 'corridorCode'],
  },
  {
    id: 'direct_remittance_type',
    page: 'DirectRemittanceTypePage',
    title: 'Direct Remittance Type',
    routeKeys: ['direct_remittance_type'],
    urls: { fetchAll: 'direct-remittance-type/getAll', create: 'direct-remittance-type/create', update: 'direct-remittance-type/update', delete: 'direct-remittance-type/delete' },
    columns: [
      { key: 'typeCode', label: 'Type Code' },
      { key: 'typeName', label: 'Type Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'typeCode', label: 'Type Code', required: true, lockOnEdit: true },
      { key: 'typeName', label: 'Type Name', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', typeCode: 'BANK', typeName: 'Bank Account', status: 'Y' }],
    idKeys: ['id', 'typeCode'],
  },
  {
    id: 'rtp_purpose',
    page: 'RtpPurposePage',
    title: 'RTP Transfer Purpose',
    routeKeys: ['rtp_transfer_purpose_management'],
    urls: { fetchAll: 'rtp-purpose/getAll', create: 'rtp-purpose/create', update: 'rtp-purpose/update', delete: 'rtp-purpose/delete' },
    columns: [
      { key: 'purposeCode', label: 'Purpose Code' },
      { key: 'purposeName', label: 'Purpose Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'purposeCode', label: 'Purpose Code', required: true, lockOnEdit: true },
      { key: 'purposeName', label: 'Purpose Name', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', purposeCode: 'SAL', purposeName: 'Salary', status: 'Y' }],
    idKeys: ['id', 'purposeCode'],
  },
  {
    id: 'rtp_account_type',
    page: 'RtpAccountTypePage',
    title: 'RTP Account Type',
    routeKeys: ['rtp_account_type_management'],
    urls: { fetchAll: 'rtp-account-type/getAll', create: 'rtp-account-type/create', update: 'rtp-account-type/update', delete: 'rtp-account-type/delete' },
    columns: [
      { key: 'accountTypeCode', label: 'Type Code' },
      { key: 'accountTypeName', label: 'Type Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'accountTypeCode', label: 'Account Type Code', required: true, lockOnEdit: true },
      { key: 'accountTypeName', label: 'Account Type Name', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', accountTypeCode: 'CACC', accountTypeName: 'Current', status: 'Y' }],
    idKeys: ['id', 'accountTypeCode'],
  },
  {
    id: 'connectivity_hub',
    page: 'ConnectivityHubPage',
    title: 'Connectivity Hub',
    routeKeys: ['connectivity_hub'],
    urls: { fetchAll: 'connectivity-hub/getAll', create: 'connectivity-hub/save', update: 'connectivity-hub/save', delete: 'connectivity-hub/delete' },
    columns: [
      { key: 'hubCode', label: 'Hub Code' },
      { key: 'hubName', label: 'Hub Name' },
      { key: 'endpoint', label: 'Endpoint' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'hubCode', label: 'Hub Code', required: true, lockOnEdit: true },
      { key: 'hubName', label: 'Hub Name', required: true },
      { key: 'endpoint', label: 'Endpoint URL' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', hubCode: 'HUB1', hubName: 'Primary Hub', endpoint: 'https://hub.example', status: 'Y' }],
    idKeys: ['id', 'hubCode'],
  },
  {
    id: 'mq_configuration',
    page: 'MqConfigurationPage',
    title: 'MQ Configuration',
    routeKeys: ['mq_configuration'],
    urls: { fetchAll: 'mq-config/getAll', create: 'mq-config/save', update: 'mq-config/save', delete: 'mq-config/delete' },
    columns: [
      { key: 'queueName', label: 'Queue' },
      { key: 'channel', label: 'Channel' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'queueName', label: 'Queue Name', required: true, lockOnEdit: true },
      { key: 'channel', label: 'Channel', required: true },
      { key: 'host', label: 'Host' },
      { key: 'port', label: 'Port' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', queueName: 'QNB.IN', channel: 'SYSTEM.DEF', host: 'mq-host', port: '1414', status: 'Y' }],
    idKeys: ['id', 'queueName'],
  },
  {
    id: 'master_category',
    page: 'MasterCategoryPage',
    title: 'Master Category',
    routeKeys: ['master_category_management', 'category_code'],
    urls: { fetchAll: 'master-category/getAll', create: 'master-category/create', update: 'master-category/update', delete: 'master-category/delete' },
    columns: [
      { key: 'categoryCode', label: 'Category Code' },
      { key: 'categoryName', label: 'Category Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'categoryCode', label: 'Category Code', required: true, lockOnEdit: true },
      { key: 'categoryName', label: 'Category Name', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', categoryCode: 'CAT1', categoryName: 'General', status: 'Y' }],
    idKeys: ['id', 'categoryCode'],
  },
  {
    id: 'athkar',
    page: 'AthkarManagementPage',
    title: 'Athkar Management',
    routeKeys: ['athkar_management'],
    urls: { fetchAll: 'athkar/getAll', create: 'athkar/create', update: 'athkar/update', delete: 'athkar/delete' },
    columns: [
      { key: 'athkarCode', label: 'Code' },
      { key: 'titleEn', label: 'Title (EN)' },
      { key: 'titleAr', label: 'Title (AR)' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'athkarCode', label: 'Code', required: true, lockOnEdit: true },
      { key: 'titleEn', label: 'Title (English)', required: true },
      { key: 'titleAr', label: 'Title (Arabic)' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', athkarCode: 'AT1', titleEn: 'Morning', titleAr: 'صباح', content: '', status: 'Y' }],
    idKeys: ['id', 'athkarCode'],
  },
  {
    id: 'stories',
    page: 'StoriesManagementPage',
    title: 'Stories Management',
    routeKeys: ['stories_management', 'story_report'],
    urls: { fetchAll: 'stories/getAll', create: 'stories/create', update: 'stories/update', delete: 'stories/delete' },
    columns: [
      { key: 'storyCode', label: 'Code' },
      { key: 'storyTitle', label: 'Title' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'storyCode', label: 'Story Code', required: true, lockOnEdit: true },
      { key: 'storyTitle', label: 'Title', required: true },
      { key: 'mediaUrl', label: 'Media URL' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', storyCode: 'ST1', storyTitle: 'Welcome Story', mediaUrl: '', status: 'Y' }],
    idKeys: ['id', 'storyCode'],
  },
  {
    id: 'onboarding_mgmt',
    page: 'OnboardingManagementPage',
    title: 'Onboarding Management',
    routeKeys: ['onboarding_management', 'onboarding_product_configuration'],
    urls: { fetchAll: 'onboarding-mgmt/getAll', create: 'onboarding-mgmt/create', update: 'onboarding-mgmt/update', delete: 'onboarding-mgmt/delete' },
    columns: [
      { key: 'stepCode', label: 'Step Code' },
      { key: 'stepName', label: 'Step Name' },
      { key: 'sequence', label: 'Sequence' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'stepCode', label: 'Step Code', required: true, lockOnEdit: true },
      { key: 'stepName', label: 'Step Name', required: true },
      { key: 'sequence', label: 'Sequence' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', stepCode: 'KYC', stepName: 'KYC Verification', sequence: '1', status: 'Y' }],
    idKeys: ['id', 'stepCode'],
  },
  {
    id: 'employment_masters',
    page: 'EmploymentMastersPage',
    title: 'Employment Masters',
    routeKeys: ['employment_masters'],
    urls: { fetchAll: 'employment-master/getAll', create: 'employment-master/create', update: 'employment-master/update', delete: 'employment-master/delete' },
    columns: [
      { key: 'employerCode', label: 'Code' },
      { key: 'employerName', label: 'Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'employerCode', label: 'Employer Code', required: true, lockOnEdit: true },
      { key: 'employerName', label: 'Employer Name', required: true },
      { key: 'countryCode', label: 'Country Code' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', employerCode: 'EMP1', employerName: 'QNB Group', countryCode: 'QA', status: 'Y' }],
    idKeys: ['id', 'employerCode'],
  },
  {
    id: 'notification_template',
    page: 'NotificationTemplatePage',
    title: 'Notification Template',
    routeKeys: ['notification_template', 'notification/messages-campaign', 'notification/customer-segment'],
    urls: { fetchAll: 'notification-template/getAll', create: 'notification-template/save', update: 'notification-template/save', delete: 'notification-template/delete' },
    columns: [
      { key: 'templateCode', label: 'Code' },
      { key: 'templateName', label: 'Name' },
      { key: 'channel', label: 'Channel' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'templateCode', label: 'Template Code', required: true, lockOnEdit: true },
      { key: 'templateName', label: 'Template Name', required: true },
      { key: 'channel', label: 'Channel' },
      { key: 'body', label: 'Body', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', templateCode: 'OTP', templateName: 'OTP SMS', channel: 'SMS', body: 'Your OTP is {{otp}}', status: 'Y' }],
    idKeys: ['id', 'templateCode'],
  },
  {
    id: 'sector',
    page: 'SectorPage',
    title: 'Sector',
    routeKeys: ['sector'],
    urls: { fetchAll: 'sector/getAll', create: 'sector/create', update: 'sector/update', delete: 'sector/delete' },
    columns: [
      { key: 'sectorCode', label: 'Sector Code' },
      { key: 'sectorName', label: 'Sector Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'sectorCode', label: 'Sector Code', required: true, lockOnEdit: true },
      { key: 'sectorName', label: 'Sector Name', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', sectorCode: 'FIN', sectorName: 'Finance', status: 'Y' }],
    idKeys: ['id', 'sectorCode'],
  },
  {
    id: 'mccg',
    page: 'MccgPage',
    title: 'MCCG',
    routeKeys: ['mccg'],
    urls: { fetchAll: 'mccg/getAll', create: 'mccg/create', update: 'mccg/update', delete: 'mccg/delete' },
    columns: [
      { key: 'mccgCode', label: 'MCCG Code' },
      { key: 'mccgName', label: 'Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'mccgCode', label: 'MCCG Code', required: true, lockOnEdit: true },
      { key: 'mccgName', label: 'Name', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', mccgCode: 'MCCG1', mccgName: 'Retail', status: 'Y' }],
    idKeys: ['id', 'mccgCode'],
  },
  {
    id: 'favorite',
    page: 'FavoritePage',
    title: 'Favorite',
    routeKeys: ['favorite', 'favorite_list'],
    urls: { fetchAll: 'favorite/getAll', create: 'favorite/create', update: 'favorite/update', delete: 'favorite/delete' },
    columns: [
      { key: 'favoriteCode', label: 'Code' },
      { key: 'favoriteName', label: 'Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'favoriteCode', label: 'Favorite Code', required: true, lockOnEdit: true },
      { key: 'favoriteName', label: 'Name', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', favoriteCode: 'FAV1', favoriteName: 'Quick Transfer', status: 'Y' }],
    idKeys: ['id', 'favoriteCode'],
  },
  {
    id: 'widget_cfg',
    page: 'WidgetConfigPage',
    title: 'Widget Configuration',
    routeKeys: ['widget'],
    urls: { fetchAll: 'widget/getAll', create: 'widget/create', update: 'widget/update', delete: 'widget/delete' },
    columns: [
      { key: 'widgetCode', label: 'Code' },
      { key: 'widgetName', label: 'Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'widgetCode', label: 'Widget Code', required: true, lockOnEdit: true },
      { key: 'widgetName', label: 'Widget Name', required: true },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', widgetCode: 'W1', widgetName: 'Balance', status: 'Y' }],
    idKeys: ['id', 'widgetCode'],
  },
  {
    id: 'risk',
    page: 'RiskManagementPage',
    title: 'Risk Management',
    routeKeys: ['risk_mangement'],
    urls: { fetchAll: 'risk/getAll', create: 'risk/create', update: 'risk/update', delete: 'risk/delete' },
    columns: [
      { key: 'riskCode', label: 'Risk Code' },
      { key: 'riskName', label: 'Name' },
      { key: 'threshold', label: 'Threshold' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'riskCode', label: 'Risk Code', required: true, lockOnEdit: true },
      { key: 'riskName', label: 'Name', required: true },
      { key: 'threshold', label: 'Threshold' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', riskCode: 'R1', riskName: 'High Value Transfer', threshold: '50000', status: 'Y' }],
    idKeys: ['id', 'riskCode'],
  },
  {
    id: 'eipo',
    page: 'EipoCompanyConfigPage',
    title: 'eIPO Company Configuration',
    routeKeys: ['eIPO_company_configuration'],
    urls: { fetchAll: 'eipo-company/getAll', create: 'eipo-company/create', update: 'eipo-company/update', delete: 'eipo-company/delete' },
    columns: [
      { key: 'companyCode', label: 'Company Code' },
      { key: 'companyName', label: 'Company Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'companyCode', label: 'Company Code', required: true, lockOnEdit: true },
      { key: 'companyName', label: 'Company Name', required: true },
      { key: 'isin', label: 'ISIN' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', companyCode: 'QNB', companyName: 'QNB', isin: 'QA0000000000', status: 'Y' }],
    idKeys: ['id', 'companyCode'],
  },
  {
    id: 'product_content',
    page: 'ProductContentPage',
    title: 'Product Content Management',
    routeKeys: ['product_content_management', 'products _management'],
    urls: { fetchAll: 'product-content/getAll', create: 'product-content/save', update: 'product-content/save', delete: 'product-content/delete' },
    columns: [
      { key: 'productCode', label: 'Product Code' },
      { key: 'titleEn', label: 'Title (EN)' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'productCode', label: 'Product Code', required: true, lockOnEdit: true },
      { key: 'titleEn', label: 'Title (English)', required: true },
      { key: 'titleAr', label: 'Title (Arabic)' },
      { key: 'content', label: 'Content', type: 'textarea' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', productCode: 'SAV', titleEn: 'Savings', titleAr: 'توفير', content: '', status: 'Y' }],
    idKeys: ['id', 'productCode'],
  },
  {
    id: 'report_template',
    page: 'ReportTemplatePage',
    title: 'Report Template Maintenance',
    routeKeys: ['report_template_maintanance', 'template_creation'],
    urls: { fetchAll: 'report-template/getAll', create: 'report-template/save', update: 'report-template/save', delete: 'report-template/delete' },
    columns: [
      { key: 'templateCode', label: 'Code' },
      { key: 'templateName', label: 'Name' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'templateCode', label: 'Template Code', required: true, lockOnEdit: true },
      { key: 'templateName', label: 'Template Name', required: true },
      { key: 'format', label: 'Format', defaultValue: 'PDF' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', templateCode: 'RPT1', templateName: 'Statement', format: 'PDF', status: 'Y' }],
    idKeys: ['id', 'templateCode'],
  },
  {
    id: 'change_password_cfg',
    page: 'ChangePasswordConfigPage',
    title: 'Change Password Configuration',
    routeKeys: ['change_password'],
    urls: { fetchAll: 'change-password-cfg/getAll', create: 'change-password-cfg/save', update: 'change-password-cfg/save', delete: 'change-password-cfg/delete' },
    columns: [
      { key: 'policyCode', label: 'Policy Code' },
      { key: 'minLength', label: 'Min Length' },
      { key: 'status', label: 'Status', statusChip: true },
    ],
    fields: [
      { key: 'policyCode', label: 'Policy Code', required: true, lockOnEdit: true },
      { key: 'minLength', label: 'Min Length', required: true },
      { key: 'requireSpecial', label: 'Require Special', type: 'status' },
      { key: 'status', label: 'Status', type: 'status' },
    ],
    seed: [{ id: '1', policyCode: 'PWD1', minLength: '8', requireSpecial: 'Y', status: 'Y' }],
    idKeys: ['id', 'policyCode'],
  },
]

function pageSrc(m) {
  return `import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/${m.id}Service'

const columns = ${JSON.stringify(m.columns, null, 2)}

const fields = ${JSON.stringify(m.fields, null, 2)}

export default function ${m.page}() {
  return (
    <GenericCrudPage
      title="${m.title}"
      service={service}
      columns={columns}
      fields={fields}
    />
  )
}
`
}

function serviceSrc(m) {
  return `import { createCrudService } from '@/features/common/crud/createCrudService'

/** ${m.title} — SoftFetch CRUD (inferred BO paths; deepen when Flutter datasource available). */
const service = createCrudService({
  name: '${m.id}',
  urls: ${JSON.stringify(m.urls, null, 2)},
  seed: ${JSON.stringify(m.seed, null, 2)},
  idKeys: ${JSON.stringify(m.idKeys)},
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
`
}

function testSrc(m) {
  return `import { describe, it, expect } from 'vitest'
import service from '../${m.id}Service'

describe('${m.id}Service', () => {
  it('exposes ${m.title} endpoints', () => {
    expect(service.urls.fetchAll).toBe('${m.urls.fetchAll}')
    expect(service.urls.create || service.urls.update).toBeTruthy()
  })
})
`
}

const routeMap = {}
for (const m of modules) {
  fs.writeFileSync(path.join(ocPages, `${m.page}.jsx`), pageSrc(m))
  fs.writeFileSync(path.join(ocServices, `${m.id}Service.js`), serviceSrc(m))
  fs.writeFileSync(path.join(ocTests, `${m.id}Service.test.js`), testSrc(m))
  for (const rk of m.routeKeys) routeMap[rk] = m.page
}

fs.writeFileSync(
  path.join(root, 'scripts/other_config_route_map.json'),
  JSON.stringify({ modules: modules.map((m) => ({ id: m.id, page: m.page, routeKeys: m.routeKeys })), routeMap }, null, 2),
)

console.log(`Generated ${modules.length} other_config modules, ${Object.keys(routeMap).length} route keys`)
