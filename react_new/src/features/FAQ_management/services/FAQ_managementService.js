import { createCrudService } from '@/features/common/crud/createCrudService'
import { faqManagementUrls } from '@/core/api/urls/faq_managementUrls'

const service = createCrudService({
  name: 'FAQ_management',
  base: 'data',
  urls: {
    fetchAll: faqManagementUrls.getall,
    create: faqManagementUrls.save,
    update: faqManagementUrls.update,
    delete: faqManagementUrls.delte || faqManagementUrls.delete,
  },
  idKeys: ['id', 'faqCode', 'faqId'],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.faqCode || row.faqId || ''),
    faqCode: row.faqCode || row.code || '',
    question: row.question || row.questionEn || row.englishLabel || '',
    questionAr: row.questionAr || row.arabicLabel || '',
    answer: row.answer || row.answerEn || '',
    answerAr: row.answerAr || '',
    category: row.category || row.categoryCode || '',
    channel: row.channel || 'ALL',
    sequence: String(row.sequence ?? row.seq ?? ''),
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
