import { createCrudService } from '@/features/common/crud/createCrudService'

/** Flutter OffersCategoryDatasource — dataurl + /offers-category/* */
const service = createCrudService({
  name: 'offers_category',
  base: 'data',
  urls: {
    fetchAll: 'offers-category/getAll?page=0&size=50',
    create: 'offers-category/create',
    update: 'offers-category/update',
    delete: 'offers-category/delete',
  },
  idKeys: ['id'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id ?? ''),
    categoryKey: row.categoryKey || '',
    categoryLabelEn: row.categoryLabelEn || '',
    categoryLabelAr: row.categoryLabelAr || '',
    categoryIcon: row.categoryIcon || '',
    status: row.status || 'ACT',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
