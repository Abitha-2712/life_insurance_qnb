import { createCrudService } from '@/features/common/crud/createCrudService'
import { androidUrls } from '@/core/api/urls/androidUrls'

/** Android config — CSV androidUrls (android-config/*). No dedicated Flutter AutoRoute; PARTIAL. */
const service = createCrudService({
  name: 'android_config',
  urls: {
    fetchAll: androidUrls.fetchAllAndroid,
    create: androidUrls.manageAndroid,
    update: androidUrls.manageAndroid,
    delete: androidUrls.manageAndroid,
  },
  idKeys: ['id', 'configKey'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.configKey || ''),
    configKey: row.configKey || row.key || '',
    configValue: row.configValue || row.value || '',
    packageName: row.packageName || row.package || '',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
