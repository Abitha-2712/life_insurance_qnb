import { createCrudService } from '@/features/common/crud/createCrudService'

/**
 * Stories management — Flutter dataurl.
 * AUTH probe: POST data/story-management/get-all => 000000
 * (do NOT use stories/getAll — returns G-00001)
 */
const service = createCrudService({
  name: 'stories',
  base: 'data',
  urls: {
    fetchAll: 'story-management/get-all',
    create: 'story-management/manage',
    update: 'story-management/manage',
    delete: 'story-management/manage',
  },
  idKeys: ['id', 'storyCode', 'txnId'],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
