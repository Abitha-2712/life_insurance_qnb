import { createCrudService } from '@/features/common/crud/createCrudService'
import { passwordPolicyUrls } from '@/core/api/urls/password_policyUrls'

const service = createCrudService({
  name: 'password_policy',
  base: 'wfc',
  urls: {
    fetchAll: passwordPolicyUrls.fetchAllPasswordPolicy,
    create: passwordPolicyUrls.addPasswordPolicy,
    update: passwordPolicyUrls.addPasswordPolicy,
    delete: passwordPolicyUrls.addPasswordPolicy,
  },
  idKeys: ["id","policyCode"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.policyCode || ''),
    policyCode: row.policyCode || row.code || '',
    policyName: row.policyName || row.englishLabel || row.name || '',
    minLength: String(row.minLength ?? '8'),
    maxAgeDays: String(row.maxAgeDays ?? row.maxAge ?? ''),
    lockoutAttempts: String(row.lockoutAttempts ?? row.maxAttempts ?? ''),
    lockoutMinutes: String(row.lockoutMinutes ?? row.lockoutDuration ?? ''),
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
