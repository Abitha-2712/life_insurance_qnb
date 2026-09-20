import { createCrudService } from '@/features/common/crud/createCrudService'
import { customerSegmentUrls } from '@/core/api/urls/customer_segmentUrls'

/** Flutter CustomerSegmentDatasource: GET customerSeg/getSegmentList on baseUrl (bo). */
const service = createCrudService({
  name: 'segment_access_management',
  base: 'bo',
  methodFetch: 'GET',
  urls: {
    fetchAll: customerSegmentUrls.getCustomerSegmentList,
    create: customerSegmentUrls.saveSegmentData,
    update: customerSegmentUrls.editSegmentData || customerSegmentUrls.saveSegmentData,
    delete: customerSegmentUrls.deleteSegments,
  },
  idKeys: ['id', 'segmentCode', 'segmentId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.segmentId || row.segmentCode || ''),
    segmentCode: row.segmentCode || '',
    segmentName: row.segmentName || row.englishLabel || row.name || '',
    segmentNameAr: row.segmentNameAr || row.arabicLabel || '',
    description: row.description || '',
    priority: row.priority ?? '',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service