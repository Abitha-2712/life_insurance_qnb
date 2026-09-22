import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'release_management',
  base: 'data',
  urls: {
    fetchAll: 'release-management/get-all',
    create: 'release-management/create',
    update: 'release-management/create',
    delete: 'release-management/delete',
  },
  idKeys: ["id","version","releaseId"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.releaseId || row.version || ''),
    version: row.version || row.releaseVersion || '',
    platform: row.platform || row.os || '',
    releaseDate: row.releaseDate || row.date || '',
    releaseNotes: row.releaseNotes || row.notes || row.description || '',
    releaseNotesAr: row.releaseNotesAr || '',
    forceUpdate: row.forceUpdate || 'N',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
