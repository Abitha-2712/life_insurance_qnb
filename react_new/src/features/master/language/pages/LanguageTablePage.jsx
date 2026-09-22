import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/languageService'

export default function LanguageTablePage() {
  return (
    <GenericCrudPage
      title="Language"
      service={service}
      columns={[
        { key: 'langCode', label: 'Code' },
        { key: 'langName', label: 'Name (English)' },
        { key: 'langNameAr', label: 'Name (Arabic)' },
        { key: 'status', label: 'Status', statusChip: true },
      ]}
      fields={[
        { key: 'langCode', label: 'Code', required: true, lockOnEdit: true },
        { key: 'langName', label: 'Name (English)', required: true },
        { key: 'langNameAr', label: 'Name (Arabic)' },
        { key: 'status', label: 'Status', type: 'status' },
      ]}
    />
  )
}
