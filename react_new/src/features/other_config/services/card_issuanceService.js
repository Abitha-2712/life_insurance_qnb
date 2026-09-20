import { createCrudService } from '@/features/common/crud/createCrudService'

/** Flutter InstantCreditCardDescriptionUrl / PreApproved tab */
export const preApprovedInstantCreditService = createCrudService({
  name: 'preapproved_instant_credit',
  base: 'data',
  urls: {
    fetchAll: 'instant-credit-card/getAll',
    create: 'instant-credit-card/manage',
    update: 'instant-credit-card/manage',
    delete: 'instant-credit-card/manage',
  },
  idKeys: ['id', 'issuanceCode', 'rimNumber'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.issuanceCode || row.rimNumber || ''),
    rimNumber: row.rimNumber || row.RIM || '',
    salaryAccount: row.salaryAccount || '',
    salaryAccountType: row.salaryAccountType || '',
    salaryQar: row.salaryQar ?? row.salary ?? '',
    seenStatus: row.seenStatus || '',
    appliedToOffer: row.appliedToOffer || row.appliedToTheOffer || '',
    status: row.status || 'Y',
  }),
})

/** Flutter SalaryMatrixUrl */
export const salaryMatrixService = createCrudService({
  name: 'salary_matrix',
  base: 'data',
  urls: {
    fetchAll: 'salary-matrix/getAll',
    create: 'salary-matrix/manage',
    update: 'salary-matrix/manage',
    delete: 'salary-matrix/manage',
  },
  idKeys: ['id'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id ?? ''),
    cardType: row.cardType || '',
    issuer: row.issuer || '',
    minSalary: row.minSalaryQar ?? row.minSalary ?? '',
    maxSalary: row.maxSalaryQar ?? row.maxSalary ?? '',
    cardProduct: row.cardProduct || row.cardProductCode || '',
    regularProfileCode: row.regularProfileCode || '',
    staffProfileCode: row.staffProfileCode || '',
    creditLimit: row.creditLimitQar ?? row.creditLimit ?? '',
    status: row.status || 'Y',
  }),
})

/** Flutter PrepaidCardUrl */
export const prepaidCardService = createCrudService({
  name: 'prepaid_card',
  base: 'data',
  urls: {
    fetchAll: 'api/prepaid-card/get-all',
    create: 'api/prepaid-card/create',
    update: 'api/prepaid-card/update',
    delete: 'api/prepaid-card/delete',
  },
  idKeys: ['id', 'productCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.productCode || ''),
    productCode: row.productCode || '',
    productName: row.productName || '',
    englishMailDisclaimer: row.englishMailDisclaimer || '',
    arabicMailDisclaimer: row.arabicMailDisclaimer || '',
    profileCode: row.profileCode || '',
    minLoadAmount: row.minLoadAmount ?? '',
    issuerId: row.issuerId || row.issuerID || '',
    feesApplicable: row.feesApplicable ?? '',
    status: row.status || 'Y',
  }),
})

/** @deprecated */
const service = preApprovedInstantCreditService
export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
