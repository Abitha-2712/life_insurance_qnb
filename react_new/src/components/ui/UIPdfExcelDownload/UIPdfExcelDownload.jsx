import { useMemo, useState } from 'react'
import Box from '@/components/layout/Box/Box'
import UICard from '@/components/ui/UICard/UICard'
import { useToast } from '@/components/ui/UIToast/ToastProvider'
import { t } from '@/core/i18n/t'
import {
  exportTableToExcel,
  exportTableToPdf,
  prepareTableExportData,
} from '@/core/export/tableExport'
import './UIPdfExcelDownload.css'

function PdfIcon({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M8.2 17.2V11.5h1.55c1.05 0 1.7.55 1.7 1.4 0 .82-.6 1.38-1.55 1.38H9.4v2.92H8.2zm1.2-3.95h.32c.42 0 .68-.22.68-.55 0-.34-.26-.53-.68-.53H9.4v1.08zM13.05 17.2c-.95 0-1.55-.7-1.55-1.85v-2c0-1.15.6-1.85 1.55-1.85.96 0 1.55.7 1.55 1.85v2c0 1.15-.59 1.85-1.55 1.85zm0-1.05c.35 0 .5-.32.5-.8v-2c0-.48-.15-.8-.5-.8s-.5.32-.5.8v2c0 .48.15.8.5.8zM16 17.2v-5.7h1.15V17.2H16z"
        fill="currentColor"
      />
    </svg>
  )
}

function ExcelIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path
        d="M8.4 11.4l2.1 2.85-2.15 2.95h1.35l1.45-2.05 1.45 2.05h1.35l-2.2-2.95 2.15-2.85h-1.35l-1.4 1.95-1.4-1.95H8.4z"
        fill="currentColor"
      />
    </svg>
  )
}

function Spinner({ size = 22 }) {
  return (
    <span className="ui-pdf-excel-spinner" style={{ width: size, height: size }} aria-hidden="true" />
  )
}

function slugFileBase(title) {
  return String(title || 'export')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '') || 'export'
}

/**
 * Flutter `UIPdfExcelDownload` — PDF + Excel toolbar for list / table pages.
 *
 * Place above the data table (right-aligned). Pass `columns` + `data` for
 * built-in export, or `onPdfPressed` / `onExcelPressed` for custom handlers.
 */
function UIPdfExcelDownload({
  title,
  columns,
  data,
  getExportData,
  pdfFileName,
  excelFileName,
  excludeColumns = [],
  pdfExcludeColumns = [],
  onPdfPressed,
  onExcelPressed,
  pdfTooltip = 'Download PDF',
  excelTooltip = 'Download Excel',
  alignToEnd = true,
  className = '',
}) {
  const toast = useToast()
  const [busyPdf, setBusyPdf] = useState(false)
  const [busyExcel, setBusyExcel] = useState(false)

  const resolvedPdfName = useMemo(
    () => pdfFileName || `${slugFileBase(title)}.pdf`,
    [pdfFileName, title],
  )
  const resolvedExcelName = useMemo(
    () => excelFileName || `${slugFileBase(title)}.xlsx`,
    [excelFileName, title],
  )

  const canPdf =
    Boolean(onPdfPressed) ||
    (Boolean(title) && Array.isArray(columns) && Array.isArray(data))
  const canExcel =
    Boolean(onExcelPressed) || (Array.isArray(columns) && Array.isArray(data))
  const busy = busyPdf || busyExcel

  async function resolveRows() {
    if (typeof getExportData === 'function') {
      const rows = await getExportData()
      if (Array.isArray(rows) && rows.length) return rows
      if (Array.isArray(data) && data.length) return data
      return []
    }
    return Array.isArray(data) ? data : []
  }

  async function handlePdf() {
    if (busy || !canPdf) return
    setBusyPdf(true)
    try {
      if (onPdfPressed) {
        await onPdfPressed()
        toast.success(t('PDF_downloaded', 'PDF downloaded.'))
        return
      }
      const rows = await resolveRows()
      if (!rows.length) {
        toast.error(t('No_data_available_table', 'No data available in the table.'))
        return
      }
      const prepared = prepareTableExportData({
        columns,
        data: rows,
        excludeColumns: [...excludeColumns, ...pdfExcludeColumns],
      })
      await exportTableToPdf({
        title: title || 'Export',
        columns: prepared.columns,
        data: prepared.data,
        fileName: resolvedPdfName,
      })
      toast.success(t('PDF_downloaded', 'PDF downloaded.'))
    } catch (err) {
      toast.error(
        err?.message || t('PDF_download_failed', 'PDF download failed. Please try again.'),
      )
    } finally {
      setBusyPdf(false)
    }
  }

  async function handleExcel() {
    if (busy || !canExcel) return
    setBusyExcel(true)
    try {
      if (onExcelPressed) {
        await onExcelPressed()
        toast.success(t('Excel_downloaded', 'Excel downloaded.'))
        return
      }
      const rows = await resolveRows()
      if (!rows.length) {
        toast.error(t('No_data_available_table', 'No data available in the table.'))
        return
      }
      const prepared = prepareTableExportData({
        columns,
        data: rows,
        excludeColumns,
      })
      exportTableToExcel({
        title,
        columns: prepared.columns,
        data: prepared.data,
        fileName: resolvedExcelName,
      })
      toast.success(t('Excel_downloaded', 'Excel downloaded.'))
    } catch (err) {
      toast.error(
        err?.message ||
          t('Excel_download_failed', 'Excel download failed. Please try again.'),
      )
    } finally {
      setBusyExcel(false)
    }
  }

  const card = (
    <UICard className="ui-pdf-excel-card">
      <Box className="ui-pdf-excel-row">
        <button
          type="button"
          className="ui-pdf-excel-btn"
          title={t('Download_PDF', pdfTooltip)}
          aria-label={t('Download_PDF', pdfTooltip)}
          disabled={!canPdf || busy}
          onClick={handlePdf}
        >
          {busyPdf ? <Spinner size={24} /> : <PdfIcon size={30} />}
        </button>
        <button
          type="button"
          className="ui-pdf-excel-btn"
          title={t('Download_Excel', excelTooltip)}
          aria-label={t('Download_Excel', excelTooltip)}
          disabled={!canExcel || busy}
          onClick={handleExcel}
        >
          {busyExcel ? <Spinner size={22} /> : <ExcelIcon size={28} />}
        </button>
      </Box>
    </UICard>
  )

  return (
    <Box
      className={['ui-pdf-excel-download', alignToEnd ? 'is-end' : '', className]
        .filter(Boolean)
        .join(' ')}
    >
      {card}
    </Box>
  )
}

export default UIPdfExcelDownload
