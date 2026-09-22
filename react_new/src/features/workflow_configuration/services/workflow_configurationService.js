import { createCrudService } from '@/features/common/crud/createCrudService'

/** Workflow configuration â€” BO workflow config endpoints. */
const service = createCrudService({
  name: 'workflow_configuration',
  base: 'data',
  urls: {
    fetchAll: 'workflow/config/getAll',
    create: 'workflow/config/save',
    update: 'workflow/config/save',
    delete: 'workflow/config/delete',
  },
  idKeys: ['id', 'workflowCode'],
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
