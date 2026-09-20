import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import service from '../services/cardService'

/** Flutter CardsTablePage columns + CardsForm fields */
const columns = [
  { key: 'id', label: 'Id' },
  { key: 'code', label: 'Code' },
  { key: 'imageName', label: 'Image Name' },
  { key: 'bin', label: 'Bin' },
  { key: 'productType', label: 'Product Type' },
  { key: 'cardType', label: 'Card Type' },
  { key: 'issuance', label: 'Issuance' },
  { key: 'provider', label: 'Provider' },
  { key: 'minRange', label: 'Min Range' },
  { key: 'maxRange', label: 'Max Range' },
  { key: 'cardArtUrl', label: 'Card ART URL' },
  { key: 'image', label: 'Image', image: true },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'code', label: 'Code', required: true, maxLength: 15, inputMode: 'numeric' },
  { key: 'bin', label: 'BIN', required: true, maxLength: 15, inputMode: 'numeric' },
  { key: 'productType', label: 'Product Type', required: true, maxLength: 30 },
  {
    key: 'cardType',
    label: 'Card Type',
    required: true,
    type: 'select',
    hintText: 'Select Card Type',
    options: [
      { value: 'Credit', label: 'Credit' },
      { value: 'Debit', label: 'Debit' },
      { value: 'Prepaid', label: 'Prepaid' },
    ],
  },
  {
    key: 'issuance',
    label: 'Issuance',
    required: true,
    type: 'select',
    hintText: 'Select Issuance',
    options: [
      { value: 'Electron', label: 'Electron' },
      { value: 'Platinum', label: 'Platinum' },
      { value: 'Infinite', label: 'Infinite' },
      { value: 'Gold', label: 'Gold' },
      { value: 'Corporate', label: 'Corporate' },
      { value: 'MC Platinum', label: 'MC Platinum' },
      { value: 'MC WoldEmb', label: 'MC WoldEmb' },
      { value: 'MC WorldSignia', label: 'MC WorldSignia' },
    ],
  },
  {
    key: 'provider',
    label: 'Provider',
    required: true,
    type: 'select',
    hintText: 'Select Provider',
    options: [
      { value: 'Visa', label: 'Visa' },
      { value: 'Mastercard', label: 'Mastercard' },
      { value: 'Other', label: 'Other' },
    ],
  },
  { key: 'minRange', label: 'Min Range', required: true },
  { key: 'maxRange', label: 'Max Range', required: true },
  { key: 'cardArtUrl', label: 'Card ART URL' },
  { key: 'status', label: 'Status', type: 'switch', defaultValue: 'Y' },
]

export default function CardManagementPage() {
  return (
    <GenericCrudPage
      title="Card Management"
      entityLabel="Card"
      listTitle="Card Management List"
      addLabel="Add Card Management"
      service={service}
      columns={columns}
      fields={fields}
      enableStatusFilter
    />
  )
}
