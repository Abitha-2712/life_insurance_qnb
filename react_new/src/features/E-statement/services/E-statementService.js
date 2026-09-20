import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'E-statement',
  urls: {
    fetchAll: 'e-statement/getAll',
    create: 'e-statement/save',
    update: 'e-statement/save',
    delete: 'e-statement/delete',
  },
  idKeys: ["id","templateCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.templateCode || row.code || ''),
    templateCode: row.templateCode || row.code || '',
    templateName: row.templateName || row.englishLabel || row.name || '',
    templateNameAr: row.templateNameAr || row.arabicLabel || '',
    productCode: row.productCode || row.product || '',
    format: row.format || row.fileFormat || 'PDF',
    frequency: row.frequency || 'MONTHLY',
    language: row.language || row.lang || 'EN',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
