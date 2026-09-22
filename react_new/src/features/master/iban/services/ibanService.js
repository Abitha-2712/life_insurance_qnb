import { createCrudService } from '@/features/common/crud/createCrudService'
import { blockListUrls } from '@/core/api/urls/block_listUrls'

/** IBAN block list — Flutter block_list_url.dart (iban/blockedIbanList|modifyBlockIban). */
const service = createCrudService({
  base: 'bo',
  name: 'iban_blocklist',
  urls: {
    fetchAll: blockListUrls.blockIbanList,
    create: blockListUrls.blockIbanModify,
    update: blockListUrls.blockIbanModify,
    delete: blockListUrls.blockIbanModify,
  },
  idKeys: ['id', 'iban'],
  buildDeleteBody: (id, row) => ({ iban: row?.iban || id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
