import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/user_name_rulesService'

const columns = [
  { key: 'id', label: 'Id' },
  { key: 'ruleName', label: 'Rule Name' },
  { key: 'ruleDescription', label: 'Rule Description' },
  { key: 'userMsgEn', label: 'User Msg En' },
  { key: 'userMsgAr', label: 'User Msg Ar' },
  { key: 'value', label: 'Value' },
]

const fields = [
  { key: 'id', label: 'Id', required: true },
  { key: 'ruleName', label: 'Rule Name' },
  { key: 'ruleDescription', label: 'Rule Description' },
  { key: 'userMsgEn', label: 'User Msg En' },
  { key: 'userMsgAr', label: 'User Msg Ar' },
  { key: 'value', label: 'Value' },
]

export default function UsernameRulesPage() {
  return (
    <GenericCrudPage
      title="Username Rules"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
