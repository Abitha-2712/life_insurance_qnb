import { createCrudService } from '@/features/common/crud/createCrudService'
import { lookupTypeUrls } from '@/core/api/urls/lookup_typeUrls'

/** Flutter lookup_type_url — api/lookup/* on dataurl. */
const service = createCrudService({
  name: 'lookup_types',
  base: 'wfc',
  urls: {
    fetchAll: lookupTypeUrls.fetchAllLookupType,
    create: lookupTypeUrls.saveOrUpdateLookupType,
    update: lookupTypeUrls.saveOrUpdateLookupType,
    delete: lookupTypeUrls.deleteLookupType,
  },
  idKeys: ['id', 'lookupType', 'lookupTypeId'],
})
export default service
