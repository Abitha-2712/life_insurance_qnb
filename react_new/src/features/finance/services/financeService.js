import { createCrudService } from '@/features/common/crud/createCrudService'

/** Flutter salary-advance-finance-config */
export const salaryAdvanceService = createCrudService({
  name: 'salary_advance',
  base: 'data',
  urls: {
    fetchAll: 'salary-advance-finance-config/getAll',
    create: 'salary-advance-finance-config/manage',
    update: 'salary-advance-finance-config/manage',
    delete: 'salary-advance-finance-config/manage',
  },
  idKeys: ['id', 'productCode', 'productId', 'code'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.productCode || row.productId || row.code || ''),
    segment: row.segment || '',
    productId: String(row.productId ?? row.productCode ?? ''),
    operatorId: String(row.operatorId ?? ''),
    instrumentId: String(row.instrumentId ?? ''),
    paymentId: String(row.paymentId ?? row.paymentMethodId ?? ''),
    collectionMethodId: String(row.collectionMethodId ?? ''),
    term: String(row.term ?? ''),
    period: row.period || 'Month(s)',
    installment: String(row.installment ?? ''),
    profitRateType: row.profitRateType || '',
    profitRate: String(row.profitRate ?? row.interestRate ?? ''),
    moveNext: row.moveNext || 'Yes',
    minAmount: String(row.minAmount ?? row.min ?? ''),
    maxAmount: String(row.maxAmount ?? row.max ?? ''),
    currency: row.currency || 'QAR',
    status: row.status || 'Y',
  }),
})

/** Flutter salary-advance-fee-config */
export const salaryAdvanceFeeService = createCrudService({
  name: 'salary_advance_fee',
  base: 'data',
  urls: {
    fetchAll: 'salary-advance-fee-config/getAll',
    create: 'salary-advance-fee-config/manage',
    update: 'salary-advance-fee-config/manage',
    delete: 'salary-advance-fee-config/manage',
  },
  idKeys: ['id'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id ?? ''),
    fee: String(row.fee ?? row.feeAmount ?? ''),
    min: String(row.min ?? row.minAmount ?? ''),
    max: String(row.max ?? row.maxAmount ?? ''),
    status: row.status || 'Y',
  }),
})

const service = salaryAdvanceService
export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
