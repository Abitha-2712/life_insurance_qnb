import { apiRequest } from '@/core/api/client'
import { createCrudService } from '@/features/common/crud/createCrudService'
import { pushNotificationUrls } from '@/core/api/urls/push_notificationUrls'
import { campaignMessagesUrls } from '@/core/api/urls/campaign_messagesUrls'

const service = createCrudService({
  name: 'push_notification',
  base: 'data',
  urls: {
    fetchAll: pushNotificationUrls.getSubscribedCustomers,
    create: campaignMessagesUrls.campaignSave,
    update: pushNotificationUrls.getHistoryByCustomerId,
    delete: pushNotificationUrls.getHistoryByCustomerId,
  },
  idKeys: ['id', 'customerId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.customerId || ''),
    customerId: row.customerId || row.cif || '',
    deviceToken: row.deviceToken || row.token || '',
    platform: row.platform || row.os || '',
    status: row.status || 'Y',
  }),
})

export async function fetchHistoryByCustomerId(customerId) {
  return apiRequest(pushNotificationUrls.getHistoryByCustomerId, {
    method: 'POST',
    body: { customerId },
  })
}

export async function fetchCampaignCategories() {
  return apiRequest(campaignMessagesUrls.campaignCategories, { method: 'POST', body: {} })
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
