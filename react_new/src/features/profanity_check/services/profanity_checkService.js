import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'profanity_check',
  urls: {
    fetchAll: 'profanity/getAll',
    create: 'profanity/save',
    update: 'profanity/save',
    delete: 'profanity/delete',
  },
  idKeys: ["id","word"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.word || ''),
    word: row.word || row.term || row.profanityWord || '',
    severity: row.severity || row.level || 'MEDIUM',
    language: row.language || row.lang || 'EN',
    category: row.category || '',
    action: row.action || row.actionType || 'BLOCK',
    replacement: row.replacement || row.mask || '****',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
