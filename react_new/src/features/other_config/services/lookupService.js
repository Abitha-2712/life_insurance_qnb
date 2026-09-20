import { createCrudService } from '@/features/common/crud/createCrudService'
import { lookupUrls } from '@/core/api/urls/lookupUrls'

/** Flutter lookup_url — lookup-feature/* on dataurl. */
const service = createCrudService({
  name: 'lookups',
  base: 'wfc',
  urls: {
    fetchAll: lookupUrls.fetchAllLookup,
    create: lookupUrls.addLookup,
    update: lookupUrls.updateLookup,
    delete: lookupUrls.deleteLookup,
  },
  idKeys: ['id', 'lookupCode', 'featureId'],
})
export default service
