import { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import { UIAddButton, UIMetricCardRow, UIText } from '@/components/ui'
import GenericCrudPage from '@/features/common/crud/GenericCrudPage'
import { t } from '@/core/i18n/t'
import productService from '@/features/apply_for_product/services/apply_for_productService'
import subProductService from '@/features/Apply_sub_product/services/Apply_sub_productService'
import mappingService from '../services/apply_product_subproductService'
import './ApplyProductSubproductPage.css'

const columns = [
  { key: 'productName', label: 'Product Name' },
  { key: 'subProductCode', label: 'Sub Product Code' },
  { key: 'nameEn', label: 'Name En' },
  { key: 'nameAr', label: 'Name Ar' },
  { key: 'status', label: 'Status', statusChip: true },
]

const fields = [
  { key: 'productName', label: 'Product Name', required: true },
  { key: 'subProductCode', label: 'Sub Product Code', required: true },
  { key: 'nameEn', label: 'Name En' },
  { key: 'nameAr', label: 'Name Ar' },
  { key: 'productId', label: 'Product Id' },
  { key: 'status', label: 'Status', type: 'status' },
]

/** Flutter ApplyProductSubproductPage — Total Products / Sub-Products / Segment Mappings */
export default function ApplyProductSubproductPage() {
  const [counts, setCounts] = useState({ products: 0, subProducts: 0, mappings: 0 })
  const actionsRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [products, subs, maps] = await Promise.allSettled([
        productService.fetchAll(),
        subProductService.fetchAll(),
        mappingService.fetchAll(),
      ])
      if (cancelled) return
      setCounts({
        products: products.status === 'fulfilled' ? (products.value?.data || []).length : 0,
        subProducts: subs.status === 'fulfilled' ? (subs.value?.data || []).length : 0,
        mappings: maps.status === 'fulfilled' ? (maps.value?.data || []).length : 0,
      })
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const metricCards = useMemo(
    () => [
      {
        key: 'products',
        title: t('Total_Products', 'Total Products'),
        subtitle: String(counts.products),
        backgroundColor: '#F1F6FF',
        numberColor: '#2563EB',
        iconColor: '#2563EB',
        borderColor: '#D6E7FF',
      },
      {
        key: 'subProducts',
        title: t('Total_Sub_Products', 'Total Sub-Products'),
        subtitle: String(counts.subProducts),
        backgroundColor: '#FFFFFF',
        numberColor: '#485363',
        iconColor: '#94A3B8',
        borderColor: '#E5E7EB',
      },
      {
        key: 'mappings',
        title: t('Segment_Mappings', 'Segment Mappings'),
        subtitle: String(counts.mappings),
        backgroundColor: '#FFF7EF',
        numberColor: '#EA8A2B',
        iconColor: '#EA8A2B',
        borderColor: '#FFEFD9',
      },
    ],
    [counts],
  )

  return (
    <Box className="apply-product-hub-page">
      <Box className="apply-product-hub-header">
        <Box>
          <UIText as="h2" variant="h24SemiBold">
            {t('Apply_Product_SubProduct', 'Apply Product & Sub-Product')}
          </UIText>
          <UIText as="p" variant="b14Regular" className="apply-product-hub-subtitle">
            {t(
              'Apply_Product_SubProduct_Subtitle',
              'Overview of products and their linked sub-products',
            )}
          </UIText>
        </Box>
        <UIAddButton
          label={t('Add_Mapping', 'Add Mapping')}
          onClick={() => actionsRef.current?.openAdd?.()}
        />
      </Box>

      <UIMetricCardRow cards={metricCards} />

      <UIText as="h3" variant="h18Bold" className="apply-product-hub-table-title">
        {t('Product_Segment_Mapping', 'Product & Sub-Product Mapping')}
      </UIText>

      <GenericCrudPage
        embedded
        hideAdd
        hideHeader
        actionsRef={actionsRef}
        onRowsChange={(rows) =>
          setCounts((prev) => ({
            ...prev,
            mappings: Array.isArray(rows) ? rows.length : 0,
          }))
        }
        title="Product Mapping"
        entityLabel="Mapping"
        addLabel="Add Mapping"
        listTitle="Product & Sub-Product Mapping"
        service={mappingService}
        columns={columns}
        fields={fields}
        enableStatusFilter={false}
      />
    </Box>
  )
}

