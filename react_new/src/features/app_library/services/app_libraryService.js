import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'app_library',
  urls: {
    fetchAll: 'app-library/getAll',
    create: 'app-library/save',
    update: 'app-library/save',
    delete: 'app-library/delete',
  },
  idKeys: ["id","libCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.libCode || row.code || ''),
    libCode: row.libCode || row.code || '',
    libName: row.libName || row.name || row.englishLabel || '',
    version: row.version || row.libVersion || '',
    platform: row.platform || '',
    packageName: row.packageName || row.package || '',
    repositoryUrl: row.repositoryUrl || row.repoUrl || '',
    description: row.description || '',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
