import { createCrudService } from '@/features/common/crud/createCrudService'
import { manageUserUrls } from '@/core/api/urls/manage_userUrls'

const service = createCrudService({
  base: 'wfc',
  name: 'group_management',
  urls: {
    fetchAll: manageUserUrls.fetchAllGroups,
    create: manageUserUrls.saveGroup,
    update: manageUserUrls.saveGroup,
    delete: manageUserUrls.deleteGroup,
  },
  idKeys: ['id', 'groupCode', 'groupId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.groupCode || row.groupId || ''),
    groupCode: row.groupCode || row.code || '',
    groupName: row.groupName || row.name || row.englishLabel || '',
    status: row.status || 'Y',
  }),
})
export default service
