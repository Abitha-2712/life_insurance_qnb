import { createCrudService } from '@/features/common/crud/createCrudService'

function mapFollowUsRow(row) {
  return {
    ...row,
    id: String(row.followUsId ?? row.id ?? ''),
    followUsId: row.followUsId ?? row.id,
    rowNumber: String(row.rowNumber ?? row.sequence ?? ''),
    englishName: row.englishName || row.displayName || '',
    arabicName: row.arabicName || row.displayNameAr || '',
    englishLink: row.englishLink || row.url || '',
    arabicLink: row.arabicLink || '',
    groupInEnglish: row.groupInEnglish || '',
    groupInArabic: row.groupInArabic || '',
    imageName: row.imageName || '',
    imageBase64: row.imageBase64 || row.image || '',
    status: row.status || 'Y',
  }
}

function buildBody(form, { includeId = false } = {}) {
  const body = {
    englishName: form.englishName || '',
    arabicName: form.arabicName || '',
    englishLink: form.englishLink || '',
    arabicLink: form.arabicLink || '',
    groupInEnglish: form.groupInEnglish || '',
    groupInArabic: form.groupInArabic || '',
    status: form.status || 'Y',
    rowNumber: Number(form.rowNumber) || 0,
    imageName: form.imageName || '',
    imageBase64: form.imageBase64 || '',
  }
  if (includeId) {
    body.followUsId = Number(form.followUsId || form.id) || form.followUsId || form.id
  }
  return body
}

/** Flutter FollowUsDatasource — Manage Links (link_configuration) */
const service = createCrudService({
  name: 'follow_us',
  base: 'data',
  urls: {
    fetchAll: 'followus/getAll',
    create: 'followus/create',
    update: 'followus/update',
    delete: 'followus/delete',
  },
  idKeys: ['followUsId', 'id'],
  mapRow: mapFollowUsRow,
  buildCreateBody: (form) => buildBody(form),
  buildUpdateBody: (form) => buildBody(form, { includeId: true }),
  buildDeleteBody: (id, row) => ({
    followUsId: Number(row?.followUsId || row?.id || id) || id,
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
