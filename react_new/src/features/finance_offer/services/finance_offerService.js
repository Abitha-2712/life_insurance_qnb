import { createCrudService } from '@/features/common/crud/createCrudService'

/** Flutter FinanceOfferUrl */
export const financeOfferService = createCrudService({
  name: 'finance_offer',
  base: 'data',
  urls: {
    fetchAll: 'finance-offer/get-all',
    create: 'finance-offer/create',
    update: 'finance-offer/update',
    delete: 'finance-offer/delete',
  },
  idKeys: ['id', 'offerCode', 'code'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.offerCode || row.code || ''),
    segment: row.segment || '',
    instrument: row.instrument || '',
    product: row.product || row.productCode || '',
    term: row.term || '',
    period: row.period || '',
    currency: row.currency || '',
    minAmount: row.minAmount ?? '',
    maxAmount: row.maxAmount ?? '',
    status: row.status || 'Y',
  }),
})

/** Flutter FinanceConfigurationUrl */
export const financeConfigurationService = createCrudService({
  name: 'finance_configuration',
  base: 'data',
  urls: {
    fetchAll: 'finance-configuration/get-all',
    create: 'finance-configuration/create',
    update: 'finance-configuration/update',
    delete: 'finance-configuration/delete',
  },
  idKeys: ['id'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id ?? ''),
    segment: row.segment || '',
    instrument: row.instrument || '',
    product: row.product || '',
    term: row.term || '',
    currency: row.currency || '',
    minAmount: row.minAmount ?? '',
    maxAmount: row.maxAmount ?? '',
    status: row.status || 'Y',
  }),
})

const service = financeOfferService
export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
