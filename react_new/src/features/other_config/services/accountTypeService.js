import { createCrudService } from '@/features/common/crud/createCrudService'
import { accountTypeUrls } from '@/core/api/urls/account_typeUrls'

const service = createCrudService({
  name: 'account_type',
  base: 'data',
  urls: {
    fetchAll: accountTypeUrls.fetchAll,
    create: accountTypeUrls.create,
    update: accountTypeUrls.update,
    delete: accountTypeUrls.delete,
  },
  idKeys: ['id', 'typeCode', 'accountTypeCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.typeCode || row.accountTypeCode || ''),
    typeCode: row.typeCode || row.accountTypeCode || '',
    typeName: row.typeName || row.englishLabel || '',
    typeNameAr: row.typeNameAr || row.arabicLabel || '',
    classCode: row.classCode || row.accountClassCode || '',
    status: row.status || 'Y',
  }),
})
export default service
