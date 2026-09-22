import { createCrudService } from '@/features/common/crud/createCrudService'
import { passwordConfigurationUrls } from '@/core/api/urls/password_configurationUrls'

const service = createCrudService({
  name: 'password_configurations',
  base: 'data',
  urls: {
    fetchAll: passwordConfigurationUrls.fetchAllPasswordConfiguration,
    create: passwordConfigurationUrls.createPasswordConfiguration,
    update: passwordConfigurationUrls.updatePasswordConfiguration,
    delete: passwordConfigurationUrls.deletePasswordConfiguration,
  },
  idKeys: ["id","configCode"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.configCode || ''),
    configCode: row.configCode || row.code || '',
    configName: row.configName || row.englishLabel || row.name || '',
    minLength: String(row.minLength ?? '8'),
    maxLength: String(row.maxLength ?? '64'),
    requireUpper: row.requireUpper || row.upper || 'Y',
    requireLower: row.requireLower || row.lower || 'Y',
    requireDigit: row.requireDigit || row.digit || 'Y',
    requireSpecial: row.requireSpecial || row.special || 'Y',
    historyCount: String(row.historyCount ?? row.history ?? ''),
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
