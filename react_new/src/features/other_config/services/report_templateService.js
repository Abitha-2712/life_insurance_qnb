import { apiRequest } from '@/core/api/client'
import { createCrudService } from '@/features/common/crud/createCrudService'

function normalizeSegments(value) {
  if (Array.isArray(value)) {
    return value
      .map((s) => {
        if (typeof s === 'string') return { segmentNameEN: s, txnId: 0 }
        return {
          txnId: s?.txnId ?? 0,
          segmentNameEN: s?.segmentNameEN || s?.segmentCode || s?.name || '',
        }
      })
      .filter((s) => s.segmentNameEN)
  }
  return String(value || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((segmentNameEN) => ({ txnId: 0, segmentNameEN }))
}

function mapReportTemplateRow(row) {
  const segments = normalizeSegments(row.segmentName || row.segments || row.segment)
  return {
    ...row,
    id: String(row.id ?? row.templateCode ?? ''),
    reportName: row.reportName || row.templateName || row.templateCode || '',
    reportTitleEn: row.reportTitleEn || row.titleEn || '',
    reportTitleAr: row.reportTitleAr || row.titleAr || '',
    headerImage: row.headerImage || '',
    footerImage: row.footerImage || '',
    headerImageName: row.headerImageName || '',
    footerImageName: row.footerImageName || '',
    allCustomer: row.allCustomer === true || String(row.allCustomer).toLowerCase() === 'true' || row.allCustomer === 'Yes',
    allCustomerLabel: row.allCustomer === true || String(row.allCustomer).toLowerCase() === 'true' ? 'Yes' : 'No',
    segmentName: segments,
    segmentLabel: segments.map((s) => s.segmentNameEN).join(', '),
    status: row.status || 'Y',
  }
}

function buildBody(form) {
  return {
    id: form.id ? Number(form.id) || form.id : undefined,
    reportName: form.reportName || '',
    segmentName: normalizeSegments(form.segmentLabel || form.segmentName),
    allCustomer: form.allCustomer === true || form.allCustomer === 'Y' || form.allCustomer === 'Yes',
    reportTitleEn: form.reportTitleEn || '',
    reportTitleAr: form.reportTitleAr || '',
    headerImage: form.headerImage || null,
    footerImage: form.footerImage || null,
    headerImageName: form.headerImageName || '',
    footerImageName: form.footerImageName || '',
    status: form.status || 'Y',
  }
}

const service = createCrudService({
  name: 'report_template',
  base: 'data',
  urls: {
    fetchAll: 'report-template/getAll',
    create: 'report-template/add',
    update: 'report-template/update',
    delete: 'report-template/delete',
  },
  idKeys: ['id', 'templateCode', 'reportName'],
  mapRow: mapReportTemplateRow,
  buildCreateBody: (form) => {
    const body = buildBody(form)
    delete body.id
    return body
  },
  buildUpdateBody: (form) => buildBody(form),
  buildDeleteBody: (id, row) => ({ id: row?.id ?? Number(id) ?? id }),
})

export async function fetchSegmentList() {
  const res = await apiRequest('customerSeg/getSegmentList', {
    base: 'data',
    method: 'GET',
  })
  const raw = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
      ? res.data.data
      : []
  return raw
    .filter((e) => String(e.segmentStatus || '').toUpperCase() === 'ACTIVE')
    .map((e) => ({
      value: String(e.segmentNameEN || e.segmentCode || e.txnId || ''),
      label: String(e.segmentNameEN || e.segmentCode || e.txnId || ''),
      txnId: e.txnId ?? 0,
    }))
    .filter((o) => o.value)
}

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service, mapReportTemplateRow }
export default service
