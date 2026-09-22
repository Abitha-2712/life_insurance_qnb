import { createCrudService } from '@/features/common/crud/createCrudService'
import { ruleManagementUrls } from '@/core/api/urls/rule_managementUrls'

const service = createCrudService({
  base: 'wfc',
  name: 'rule_management',
  urls: {
    fetchAll: ruleManagementUrls.allRule,
    create: ruleManagementUrls.addRule,
    update: ruleManagementUrls.editRule,
    delete: ruleManagementUrls.deleteRule,
  },
  idKeys: ["id","ruleCode","ruleId"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.ruleCode || row.ruleId || ''),
    ruleCode: row.ruleCode || row.code || '',
    ruleName: row.ruleName || row.name || row.englishLabel || '',
    ruleNameAr: row.ruleNameAr || row.arabicLabel || '',
    ruleType: row.ruleType || row.type || '',
    priority: String(row.priority ?? ''),
    expression: row.expression || row.ruleExpression || row.condition || '',
    description: row.description || row.desc || '',
    status: row.status || 'Y',
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
