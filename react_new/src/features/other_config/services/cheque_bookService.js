import { createCrudService } from '@/features/common/crud/createCrudService'

/** Flutter ChequeBookReasonUrl — dataurl + cheque-book-reason/* */
export const chequeBookReasonService = createCrudService({
  name: 'cheque_book_reason',
  base: 'data',
  urls: {
    fetchAll: 'cheque-book-reason/get-all',
    create: 'cheque-book-reason/add',
    update: 'cheque-book-reason/update',
    delete: 'cheque-book-reason/delete',
  },
  idKeys: ['id'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id ?? ''),
    englishReason: row.englishReason || '',
    arabicReason: row.arabicReason || '',
    orderId: row.orderId ?? '',
    status: row.status || 'ACT',
  }),
  buildCreateBody: (form) => ({
    englishReason: form.englishReason,
    arabicReason: form.arabicReason || '',
    status: form.status === 'Active' || form.status === 'Y' ? 'ACT' : form.status === 'Inactive' || form.status === 'N' ? 'IAC' : form.status || 'ACT',
    orderId: Number(form.orderId) || 0,
  }),
  buildUpdateBody: (form) => ({
    id: Number(form.id),
    englishReason: form.englishReason,
    arabicReason: form.arabicReason || '',
    status: form.status === 'Active' || form.status === 'Y' ? 'ACT' : form.status === 'Inactive' || form.status === 'N' ? 'IAC' : form.status || 'ACT',
    orderId: Number(form.orderId) || 0,
  }),
  buildDeleteBody: (id) => ({ id: Number(id) }),
})

/** Flutter ChequeBookConfigUrl — cheque-config/getAll */
export const chequeBookConfigService = createCrudService({
  name: 'cheque_book_config',
  base: 'data',
  urls: {
    fetchAll: 'cheque-config/getAll',
    create: 'cheque-config/action',
    update: 'cheque-config/action',
    delete: 'cheque-config/action',
  },
  idKeys: ['id', 'segmentTxnId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.segmentTxnId || ''),
    segmentName: row.segmentName || '',
    chequeLeaveNumbers: row.chequeLeaveNumbers ?? row.leaves ?? '',
    status: row.status || 'Y',
  }),
})

/** @deprecated prefer named exports */
const service = chequeBookConfigService
export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
