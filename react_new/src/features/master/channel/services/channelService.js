import { createCrudService } from '@/features/common/crud/createCrudService'
import { channelUrls } from '@/core/api/urls/channelUrls'

/**
 * Master Channel CRUD — Flutter channel_url (WFC bko-channel/*).
 * AUTH probe OK: POST wfc/bko-channel/fetchAll.
 * Dropdown channel/list is a separate GET on data/bo — see fetchChannelDropdown.
 */
import { apiRequest } from '@/core/api/client'

const service = createCrudService({
  name: 'channel',
  base: 'wfc',
  urls: {
    fetchAll: channelUrls.fetchAllChannel,
    create: channelUrls.postChannel,
    update: channelUrls.postChannel,
    delete: channelUrls.deleteChannel,
  },
  idKeys: ['id', 'channelCode'],
})

/** i18/banner dropdown — GET channel/list (POST => 405). */
export async function fetchChannelDropdown() {
  return apiRequest('channel/list', { base: 'data', method: 'GET' })
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export default service
