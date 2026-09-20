import { createCrudService } from '@/features/common/crud/createCrudService'
import { accountClassUrls } from '@/core/api/urls/account_classUrls'

const service = createCrudService({
  name: 'account_class',
  base: 'data',
  urls: {
    fetchAll: accountClassUrls.fetchAllAccountClass,
    create: accountClassUrls.addAccountClass,
    update: accountClassUrls.updateAccountClass,
    delete: accountClassUrls.deleteAccountClass,
  },
  idKeys: ['id', 'classCode', 'accountClassCode'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.classCode || row.accountClassCode || ''),
    classCode: row.classCode || row.accountClassCode || '',
    className: row.className || row.englishLabel || '',
    classNameAr: row.classNameAr || row.arabicLabel || '',
    segmentCode: row.segmentCode || '',
    status: row.status || 'Y',
  }),
})
export default service
