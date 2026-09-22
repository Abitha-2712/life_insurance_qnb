import { createCrudService } from '@/features/common/crud/createCrudService'


const service = createCrudService({
  name: 'data_cleansing',
  base: 'bo',
  urls: {
    fetchAll: 'data-cleansing/get-all',
    create: 'data-cleansing/run',
    update: 'data-cleansing/run',
    delete: 'data-cleansing/run',
  },
  idKeys: ["id","jobCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.jobCode || row.code || ''),
    jobCode: row.jobCode || row.code || '',
    jobName: row.jobName || row.name || row.englishLabel || '',
    targetTable: row.targetTable || row.tableName || '',
    lastRun: row.lastRun || row.lastExecuted || '-',
    lastStatus: row.lastStatus || row.runStatus || 'IDLE',
    recordsProcessed: String(row.recordsProcessed ?? row.processed ?? ''),
    schedule: row.schedule || 'MANUAL',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)

export async function runJob(jobCode) {
  return service.save({ id: jobCode, jobCode, action: 'RUN' })
}
export { service }
export default service
