import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'oci_user',
  base: 'data',
  urls: {
    fetchAll: 'oci-user/getAll',
    create: 'oci-user/save',
    update: 'oci-user/save',
    delete: 'oci-user/delete',
  },
  idKeys: ["id","userId","ociUserId"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.userId || row.ociUserId || ''),
    userId: row.userId || row.ociUserId || '',
    userName: row.userName || row.name || row.displayName || '',
    email: row.email || row.emailId || '',
    role: row.role || row.userRole || '',
    department: row.department || row.dept || '',
    notifyEmail: row.notifyEmail || row.emailNotify || 'N',
    notifySms: row.notifySms || row.smsNotify || 'N',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
