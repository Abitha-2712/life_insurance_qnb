import { createCrudService } from '@/features/common/crud/createCrudService'

/** Google Pay — Flutter: dataurl + googlepay/bin/* */
const service = createCrudService({
  name: 'google_pay',
  base: 'data',
  urls: {
    fetchAll: 'googlepay/bin/getAll',
    create: 'googlepay/bin/create',
    update: 'googlepay/bin/update',
    delete: 'googlepay/bin/delete',
  },
  idKeys: ['id', 'configKey', 'bin'],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service