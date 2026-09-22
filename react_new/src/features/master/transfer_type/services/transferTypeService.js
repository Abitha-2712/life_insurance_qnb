import { createCrudService } from '@/features/common/crud/createCrudService'
import { transferTypeUrls } from '@/core/api/urls/transfer_typeUrls'

const service = createCrudService({
  base: 'bo',
  name: 'transfer_type',
  urls: {
    fetchAll: transferTypeUrls.fetchAll,
    create: transferTypeUrls.create,
    update: transferTypeUrls.update,
    delete: transferTypeUrls.delete,
  },
  idKeys: ['id', 'transferTypeKey'],
  mapRow: (row) => {
    const isInactive = ['N', 'NO', 'INACTIVE', '0', 'FALSE', 'IAC', 'INACT'].includes(
      String(row.status || '').toUpperCase().trim(),
    )
    return {
      ...row,
      id: row.id != null ? row.id : (row.transferTypeKey || ''),
      transferTypeKey: row.transferTypeKey || '',
      transferTypeValue: row.transferTypeValue || '',
      status: isInactive ? 'INACTIVE' : 'ACTIVE',
    }
  },
  buildCreateBody: (form) => {
    const isAct = ['Y', 'YES', 'ACT', 'ACTIVE', '1', 'TRUE', 'ENABLED'].includes(
      String(form.status || '').toUpperCase().trim(),
    )
    return {
      transferTypeKey: form.transferTypeKey,
      transferTypeValue: form.transferTypeValue,
      status: isAct ? 'ACT' : 'IAC',
    }
  },
  buildUpdateBody: (form) => {
    const isAct = ['Y', 'YES', 'ACT', 'ACTIVE', '1', 'TRUE', 'ENABLED'].includes(
      String(form.status || '').toUpperCase().trim(),
    )
    return {
      id: form.id != null ? Number(form.id) : undefined,
      transferTypeKey: form.transferTypeKey,
      transferTypeValue: form.transferTypeValue,
      status: isAct ? 'ACT' : 'IAC',
    }
  },
  buildDeleteBody: (id, row) => ({ id: Number(row?.id ?? id) }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
