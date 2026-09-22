import { createCrudService } from '@/features/common/crud/createCrudService'
import { accountClassUrls } from '@/core/api/urls/account_classUrls'

/** Other Configuration â€” CSV accountClassUrls (was SoftFetch account-class/* literals). */
const service = createCrudService({
  name: 'other_config',
  base: 'data',
  urls: {
    fetchAll: accountClassUrls.fetchAllAccountClass,
    create: accountClassUrls.addAccountClass,
    update: accountClassUrls.updateAccountClass,
    delete: accountClassUrls.deleteAccountClass,
  },
  idKeys: ['id', 'code', 'Id'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.code || row.classCode || ''),
    code: row.code || row.classCode || '',
    name: row.name || row.className || row.englishLabel || '',
    status: row.status || 'Y',
  }),
})

export function fetchAll() {
  return service.fetchAll()
}

export function save(payload) {
  return service.save(payload)
}

export function remove(id, row) {
  return service.remove(id, row)
}

export { service }
export default service
