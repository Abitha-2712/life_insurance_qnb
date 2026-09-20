import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/storiesService'

/** Flutter stories_management_table_page — SoftFetch images may be URL or base64 */
const columns = [
  { key: 'txnId', label: 'Id' },
  { key: 'storyName', label: 'Name' },
  { key: 'storyType', label: 'Type' },
  { key: 'storyNature', label: 'Nature' },
  { key: 'storyImageEnglish', label: 'Image EN', image: true },
  { key: 'storyImageArabic', label: 'Image AR', image: true },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'storyName', label: 'Story Name', required: true },
  { key: 'storyType', label: 'Story Type' },
  { key: 'storyNature', label: 'Story Nature' },
  { key: 'storyImageEnglish', label: 'Image EN (URL or base64)', type: 'textarea' },
  { key: 'storyImageArabic', label: 'Image AR (URL or base64)', type: 'textarea' },
  { key: 'priority', label: 'Priority' },
  { key: 'status', label: 'Status', type: 'status' },
]

export default function StoriesManagementPage() {
  return (
    <GenericCrudPage title="Stories Management" service={service} columns={columns} fields={fields} />
  )
}
