import { createCrudService } from '@/features/common/crud/createCrudService'
import { offerUrls } from '@/core/api/urls/offerUrls'

const service = createCrudService({
  name: 'discount_management',
  urls: {
    fetchAll: offerUrls.fetchAllOffer,
    create: offerUrls.addOffer,
    update: offerUrls.updateOffer,
    delete: offerUrls.deleteOfferManagement,
  },
  idKeys: ["id","discountCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.discountCode || row.code || ''),
    discountCode: row.discountCode || row.code || '',
    discountName: row.discountName || row.name || row.offerName || '',
    discountPercent: String(row.discountPercent ?? row.percent ?? ''),
    maxDiscountAmount: String(row.maxDiscountAmount ?? row.maxAmount ?? ''),
    currency: row.currency || 'QAR',
    startDate: row.startDate || '',
    endDate: row.endDate || '',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
