import { createCrudService } from '@/features/common/crud/createCrudService'
import { passwordConfigurationUrls } from '@/core/api/urls/password_configurationUrls'

/** Change Password Configuration â€” CSV passwordConfigurationUrls. */
const service = createCrudService({
  name: 'change_password_cfg',
  base: 'data',
  urls: {
    fetchAll: passwordConfigurationUrls.fetchAllPasswordConfiguration,
    create: passwordConfigurationUrls.createPasswordConfiguration,
    update: passwordConfigurationUrls.updatePasswordConfiguration,
    delete: passwordConfigurationUrls.deletePasswordConfiguration,
  },
  idKeys: ['id', 'policyCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.policyCode || ''),
    policyCode: row.policyCode || row.configCode || '',
    minLength: String(row.minLength ?? ''),
    requireSpecial: row.requireSpecial || 'N',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
