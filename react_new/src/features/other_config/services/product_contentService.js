import { createCrudService } from '@/features/common/crud/createCrudService'

const service = createCrudService({
  name: 'product_content',
  base: 'data',
  urls: {
  "fetchAll": "product-content/getAll",
  "create": "product-content/save",
  "update": "product-content/save",
  "delete": "product-content/delete"
},
  idKeys: ["id","productCode"],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
