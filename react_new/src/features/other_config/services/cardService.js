import { createCrudService } from '@/features/common/crud/createCrudService'

/** Card Management Ã¢â‚¬â€ Flutter CardBinUrl: card-bin/getAll + card-bin/manage */
const service = createCrudService({
  name: 'card',
  base: 'bo',
  urls: {
    fetchAll: 'card-bin/getAll',
    create: 'card-bin/manage',
    update: 'card-bin/manage',
    delete: 'card-bin/manage',
  },
  idKeys: ['id', 'code', 'cardProductCode', 'bin'],
  mapRow: (row) => ({
    ...row,
    id: row.id != null ? String(row.id) : row.code || row.bin || row.cardProductCode,
    code: row.code || row.cardProductCode || '',
    bin: row.bin || row.cardProductName || '',
    productType: row.productType || row.cardProductName || '',
    cardType: row.cardType || '',
    issuance: row.issuance || row.issuanceType || '',
    provider: row.provider || row.cardProvider || '',
    minRange: row.minRange != null ? String(row.minRange) : row.min ?? '',
    maxRange: row.maxRange != null ? String(row.maxRange) : row.max ?? '',
    cardArtUrl: row.cardArtUrl || row.cardArtURL || row.artUrl || '',
    imageName: row.imageName || row.fileName || '',
    image: row.image || row.imageBase64 || row.cardImage || '',
    status:
      row.status === true ||
      row.status === 'Y' ||
      String(row.status || '').toUpperCase() === 'ACTIVE'
        ? 'Y'
        : row.status === false ||
            row.status === 'N' ||
            String(row.status || '').toUpperCase() === 'INACTIVE'
          ? 'N'
          : row.status || 'Y',
  }),
  buildCreateBody: (form) => ({
    action: 'ADD',
    ...form,
  }),
  buildUpdateBody: (form) => ({
    action: 'EDIT',
    ...form,
  }),
  buildDeleteBody: (id, row) => ({
    action: 'DELETE',
    id: row?.id ?? id,
  }),
})

export const fetchAll = () => service.fetchAll()
export const save = (p) => service.save(p)
export const remove = (id, row) => service.remove(id, row)
export { service }
export default service