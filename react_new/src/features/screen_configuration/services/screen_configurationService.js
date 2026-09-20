import { createCrudService } from '@/features/common/crud/createCrudService'
import { themeConfigUrls } from '@/core/api/urls/theme_configUrls'
import { apiRequest } from '@/core/api/client'

/** Flutter theme_config_url — theme/config|font on dataurl. */
const service = createCrudService({
  name: 'screen_configuration',
  base: 'bo',
  urls: {
    fetchAll: themeConfigUrls.fetchAllTheme,
    create: themeConfigUrls.manageTheme,
    update: themeConfigUrls.manageTheme,
    delete: themeConfigUrls.manageTheme,
  },
  idKeys: ['id', 'themeCode', 'code'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.themeCode || row.code || ''),
    themeCode: row.themeCode || row.code || '',
    themeName: row.themeName || row.name || row.englishLabel || '',
    themeNameAr: row.themeNameAr || row.arabicLabel || '',
    primaryColor: row.primaryColor || row.primary || '',
    secondaryColor: row.secondaryColor || row.secondary || '',
    fontFamily: row.fontFamily || row.font || '',
    isDefault: row.isDefault || row.defaultTheme || 'N',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export async function fetchFonts() {
  return apiRequest(themeConfigUrls.fetchAllFont, { base: 'bo', method: 'POST', body: {} })
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
