/**
 * Shared PDF / Excel table export — Flutter `pdf_excel_export.dart` +
 * `export_value_serializer.dart` parity (web download).
 */
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const INTERNAL_ROW_KEYS = new Set(['_data', '_rowKey', '__rowKey'])

/** Serialize a cell for PDF/Excel (full value, no truncation). */
export function serializeExportCellValue(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) {
    return value
      .map(serializeExportCellValue)
      .filter((line) => String(line).trim())
      .join('\n')
  }
  if (typeof value === 'object') {
    if (value.label != null) return serializeExportCellValue(value.label)
    if (value.name != null) return serializeExportCellValue(value.name)
    if (value.value != null) return serializeExportCellValue(value.value)
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

function normalizeFileName(name, ext) {
  const raw = String(name || 'export').trim() || 'export'
  const base = raw.replace(/\.(pdf|xlsx|csv)$/i, '')
  return `${base}.${ext}`
}

function triggerDownload(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1500)
}

/**
 * Normalize column defs to `{ key, label }`.
 * Accepts string headers or `{ key, label }` objects (UIDataTable columns).
 */
export function normalizeExportColumns(columns = [], excludeColumns = []) {
  const exclude = new Set(
    (excludeColumns || []).map((c) => String(c).toLowerCase()),
  )
  return (columns || [])
    .map((col) => {
      if (typeof col === 'string') {
        return { key: col, label: col }
      }
      const key = col?.key ?? col?.id ?? col?.field ?? ''
      const label = col?.label ?? col?.header ?? key
      return { key: String(key), label: String(label || key) }
    })
    .filter((col) => {
      if (!col.key) return false
      if (INTERNAL_ROW_KEYS.has(col.key)) return false
      const k = col.key.toLowerCase()
      const l = col.label.toLowerCase()
      if (exclude.has(k) || exclude.has(l)) return false
      if (k === 'actions' || l === 'actions') return false
      return true
    })
}

/**
 * Flutter `prepareTableExportData` — resolve headers + row maps keyed by header label.
 * @returns {{ columns: string[], data: Record<string, string>[] }}
 */
export function prepareTableExportData({
  columns = [],
  data = [],
  excludeColumns = [],
} = {}) {
  const defs = normalizeExportColumns(columns, excludeColumns)
  const headers = defs.map((d) => d.label)

  const exportData = (data || []).map((row) => {
    const source =
      row && typeof row === 'object' ? { ...(row._data || {}), ...row } : {}
    const out = {}
    defs.forEach((def) => {
      out[def.label] = serializeExportCellValue(
        source[def.key] ?? source[def.label],
      )
    })
    return out
  })

  return { columns: headers, data: exportData }
}

function resolvePrepared({ columns, data, excludeColumns }) {
  const first = columns?.[0]
  if (first && typeof first === 'object') {
    return prepareTableExportData({ columns, data, excludeColumns })
  }
  // Already header strings + maps keyed by header (Flutter prepared shape).
  return {
    columns: (columns || []).map(String),
    data: (data || []).map((row) => {
      const out = {}
      for (const col of columns || []) {
        out[col] = serializeExportCellValue(row?.[col])
      }
      return out
    }),
  }
}

/**
 * Flutter `exportTableToExcel` — build .xlsx and download in the browser.
 */
export function exportTableToExcel({
  columns = [],
  data = [],
  fileName = 'export.xlsx',
  title,
  excludeColumns = [],
} = {}) {
  const prepared = resolvePrepared({ columns, data, excludeColumns })
  if (!prepared.columns.length) {
    throw new Error('No columns available for Excel export.')
  }
  if (!prepared.data.length) {
    throw new Error('No data available in the table.')
  }

  const sheetRows = []
  if (title && String(title).trim()) {
    sheetRows.push([String(title).trim()])
  }
  sheetRows.push(prepared.columns)
  for (const row of prepared.data) {
    sheetRows.push(prepared.columns.map((col) => row[col] ?? ''))
  }

  const ws = XLSX.utils.aoa_to_sheet(sheetRows)
  ws['!cols'] = prepared.columns.map(() => ({ wch: 28 }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([out], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  triggerDownload(blob, normalizeFileName(fileName, 'xlsx'))
  return prepared.data.length
}

/**
 * Flutter table PDF — title + autoTable + download.
 */
export async function exportTableToPdf({
  title = 'Export',
  columns = [],
  data = [],
  fileName = 'export.pdf',
  excludeColumns = [],
  orientation = 'landscape',
} = {}) {
  const prepared = resolvePrepared({ columns, data, excludeColumns })
  if (!prepared.columns.length) {
    throw new Error('No columns available for PDF export.')
  }
  if (!prepared.data.length) {
    throw new Error('No data available in the table.')
  }

  const doc = new jsPDF({
    orientation: orientation === 'portrait' ? 'portrait' : 'landscape',
    unit: 'pt',
    format: 'a4',
  })

  const marginX = 28
  doc.setFontSize(14)
  doc.setTextColor(19, 23, 32)
  doc.text(String(title || 'Export'), marginX, 36)

  autoTable(doc, {
    startY: 48,
    head: [prepared.columns],
    body: prepared.data.map((row) =>
      prepared.columns.map((col) => row[col] ?? ''),
    ),
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: 'linebreak',
      valign: 'top',
      textColor: [19, 23, 32],
    },
    headStyles: {
      fillColor: [13, 89, 242],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    margin: { left: marginX, right: marginX, top: 48, bottom: 28 },
  })

  const blob = doc.output('blob')
  triggerDownload(blob, normalizeFileName(fileName, 'pdf'))
  return prepared.data.length
}

export default {
  serializeExportCellValue,
  normalizeExportColumns,
  prepareTableExportData,
  exportTableToExcel,
  exportTableToPdf,
}
