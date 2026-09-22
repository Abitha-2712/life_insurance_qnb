import { createCrudService } from '@/features/common/crud/createCrudService'

/** Apple Pay — Flutter: dataurl + apple-pay/* */
const service = createCrudService({
  name: 'apple_pay',
  base: 'data',
  urls: {
    fetchAll: 'apple-pay/getAll',
    create: 'apple-pay/create',
    update: 'apple-pay/update',
    delete: 'apple-pay/delete',
  },
  idKeys: ['id', 'configKey'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.configKey || ''),
    configKey: row.configKey || row.key || '',
    configValue: row.configValue || row.value || '',
    merchantId: row.merchantId || '',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service