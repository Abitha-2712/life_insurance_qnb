import { createCrudService } from '@/features/common/crud/createCrudService'

/** Card Spend — Flutter: dataurl + card-spend-category/getAll?page=&size= */
const service = createCrudService({
  name: 'card_spend',
  base: 'data',
  urls: {
    fetchAll: 'card-spend-category/getAll?page=0&size=50',
    create: 'card-spend-category/create',
    update: 'card-spend-category/update',
    delete: 'card-spend-category/delete',
  },
  idKeys: ['id', 'mccCode'],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service