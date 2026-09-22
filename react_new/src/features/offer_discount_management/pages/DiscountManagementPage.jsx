import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/discountService'

const columns = [
  { key: 'offerId', label: 'Offer Id' },
  { key: 'partnerName', label: 'Partner Name' },
  { key: 'offerTitle', label: 'Offer Title' },
  { key: 'offerDescription', label: 'Offer Description' },
  { key: 'productName', label: 'Product Name' },
  { key: 'offerTag', label: 'Offer Tag' },
]

const fields = [
  { key: 'offerId', label: 'Offer Id', required: true },
  { key: 'partnerName', label: 'Partner Name' },
  { key: 'offerTitle', label: 'Offer Title' },
  { key: 'offerDescription', label: 'Offer Description' },
  { key: 'productName', label: 'Product Name' },
  { key: 'offerTag', label: 'Offer Tag' },
]

export default function DiscountManagementPage() {
  return (
    <GenericCrudPage
      title="Discount Management"
      service={service}
      columns={columns}
      fields={fields} enableStatusFilter={false}
    />
  )
}
