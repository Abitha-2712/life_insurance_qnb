import { createCrudService } from '@/features/common/crud/createCrudService'
import { languageUrls } from '@/core/api/urls/languageUrls.js'

/** Language — CSV bko-* URLs with english/arabic label mapping (city parity). */
const service = createCrudService({
  base: 'wfc',
  name: 'language',
  urls: {
    fetchAll: languageUrls.fetchAllLang,
    create: languageUrls.postLang,
    update: languageUrls.postLang,
    delete: languageUrls.deleteLang,
  },
  idKeys: ['id', 'langCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.langCode || ''),
    langCode: row.langCode || row.code || '',
    langName: row.englishLabel || row.langName || row.name || '',
    langNameAr: row.arabicLabel || row.langNameAr || row.nameAr || '',
    status: row.status || 'Y',
  }),
  buildCreateBody: (form) => ({
    langCode: form.langCode,
    englishLabel: form.langName,
    arabicLabel: form.langNameAr,
    status: form.status || 'Y',
  }),
  buildUpdateBody: (form) => ({
    id: form.id,
    langCode: form.langCode,
    englishLabel: form.langName,
    arabicLabel: form.langNameAr,
    status: form.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export default service
