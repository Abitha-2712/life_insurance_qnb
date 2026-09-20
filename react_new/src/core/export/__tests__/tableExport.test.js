import { describe, it, expect } from 'vitest'
import {
  prepareTableExportData,
  serializeExportCellValue,
} from '../tableExport.js'

describe('tableExport', () => {
  it('serializes nested and null cells', () => {
    expect(serializeExportCellValue(null)).toBe('')
    expect(serializeExportCellValue({ label: 'Active' })).toBe('Active')
    expect(serializeExportCellValue(['a', 'b'])).toBe('a\nb')
  })

  it('prepareTableExportData maps keys to labels', () => {
    const prepared = prepareTableExportData({
      columns: [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'actions', label: 'Actions' },
      ],
      data: [{ code: 'C1', name: 'One' }],
    })
    expect(prepared.columns).toEqual(['Code', 'Name'])
    expect(prepared.data[0]).toEqual({ Code: 'C1', Name: 'One' })
  })
})
