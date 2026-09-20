import { createCrudService } from '@/features/common/crud/createCrudService'

function mapPersonaRow(row) {
  return {
    ...row,
    id: String(row.id ?? ''),
    personaNameEn: row.personaNameEn || row.nameEn || row.name || '',
    personaNameAr: row.personaNameAr || row.nameAr || '',
    priority: String(row.priority ?? ''),
    imageEn: row.imageEn || row.imageEnBase64 || '',
    imageAr: row.imageAr || row.imageArBase64 || '',
    imageEnName: row.imageEnName || '',
    imageArName: row.imageArName || '',
    urlEn: row.urlEn || '',
    urlAr: row.urlAr || '',
    status: row.status || 'Y',
  }
}

function buildBody(form, { includeId = false } = {}) {
  const body = {
    personaNameEn: form.personaNameEn || '',
    personaNameAr: form.personaNameAr || '',
    priority: Number(form.priority) || 0,
    status: form.status || 'Y',
  }
  if (includeId && form.id) body.id = Number(form.id) || form.id
  if (form.imageEn) body.imageEn = form.imageEn
  if (form.imageAr) body.imageAr = form.imageAr
  if (form.imageEnName) body.imageEnName = form.imageEnName
  if (form.imageArName) body.imageArName = form.imageArName
  if (form.urlEn) body.urlEn = form.urlEn
  if (form.urlAr) body.urlAr = form.urlAr
  return body
}

/** Flutter PersonaUrl — baseUrl (bo) */
const service = createCrudService({
  name: 'preference_persona',
  base: 'bo',
  urls: {
    fetchAll: 'persona/getAll',
    create: 'persona/create',
    update: 'persona/update',
    delete: 'persona/delete',
  },
  idKeys: ['id'],
  mapRow: mapPersonaRow,
  buildCreateBody: (form) => buildBody(form),
  buildUpdateBody: (form) => buildBody(form, { includeId: true }),
  buildDeleteBody: (id) => ({ id: Number(id) || id }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
