import { createCrudService } from '@/features/common/crud/createCrudService'

/** Flutter onboarding_management_url — customerOnboarding/getAll (data.customers) */
const service = createCrudService({
  name: 'onboarding_mgmt',
  base: 'data',
  urls: {
    fetchAll: 'customerOnboarding/getAll',
    create: 'customerOnboarding/getAll',
    update: 'customerOnboarding/getAll',
    delete: 'customerOnboarding/getAll',
  },
  idKeys: ['stateId', 'customerId', 'id'],
  mapRow: (row) => ({
    ...row,
    id: String(row.stateId || row.customerId || row.id || ''),
    customerId: row.customerId || '',
    mobileNumber: row.mobileNumber || row.mobile || '',
    qatarIdNo: row.qatarIdNo || row.qid || '',
    onboardingStatus: row.onboardingStatus || row.status || '',
    currentStep: row.currentStep || row.step || '',
    status: row.onboardingStatus || row.status || '',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
