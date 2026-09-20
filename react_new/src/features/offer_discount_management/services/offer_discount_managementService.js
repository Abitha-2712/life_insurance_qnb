import { createCrudService } from '@/features/common/crud/createCrudService'
import { offerUrls } from '@/core/api/urls/offerUrls'

const service = createCrudService({
  name: 'offer_discount_management',
  base: 'data',
  urls: {
    fetchAll: offerUrls.fetchAllOffer,
    create: offerUrls.addOffer,
    update: offerUrls.updateOffer,
    delete: offerUrls.deleteOfferManagement,
  },
  idKeys: ["id","offerCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.offerCode || row.code || ''),
    offerCode: row.offerCode || row.code || '',
    offerName: row.offerName || row.name || row.englishLabel || '',
    offerNameAr: row.offerNameAr || row.arabicLabel || '',
    offerType: row.offerType || row.type || '',
    startDate: row.startDate || '',
    endDate: row.endDate || '',
    rewardKey: row.rewardKey || row.reward || '',
    description: row.description || '',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
