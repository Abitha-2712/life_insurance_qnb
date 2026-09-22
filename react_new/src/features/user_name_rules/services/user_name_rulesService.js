import { createCrudService } from '@/features/common/crud/createCrudService'
import { usernameRuleUrls } from '@/core/api/urls/username_ruleUrls'

const service = createCrudService({
  name: 'user_name_rules',
  base: 'data',
  urls: {
    fetchAll: usernameRuleUrls.fetchAllUsernameRuleUrl,
    create: usernameRuleUrls.addUrl,
    update: usernameRuleUrls.updateUsernameRuleUrl,
    delete: usernameRuleUrls.deleteUsername,
  },
  idKeys: ["id","ruleCode","code"],
  mapRow: (row) => ({
    ...row,
    id: String(row.id || row.ruleCode || row.code || ''),
    ruleCode: row.ruleCode || row.code || '',
    ruleName: row.ruleName || row.englishLabel || row.name || '',
    minLength: String(row.minLength ?? row.min ?? '8'),
    maxLength: String(row.maxLength ?? row.max ?? '32'),
    allowSpecial: row.allowSpecial || row.specialChars || 'N',
    allowNumeric: row.allowNumeric || row.numeric || 'Y',
    allowSpaces: row.allowSpaces || row.spaces || 'N',
    regexPattern: row.regexPattern || row.regex || '',
    status: row.status || 'Y',
  }),
  buildDeleteBody: (id, row) => ({ ...row, id, status: 'N' }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service
