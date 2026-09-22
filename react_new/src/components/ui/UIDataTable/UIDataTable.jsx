import { useEffect, useMemo, useRef, useState } from 'react'
import { softfetchImageSrc } from '@/core/utils/softfetchImageSrc'
import UICheckBox from '@/components/ui/UICheckBox/UICheckBox'
import UIText from '@/components/ui/UIText/UIText'
import { t } from '@/core/i18n/t'
import FilterDropdown from './FilterDropdown'
import HoverActionIcon, {
  IconDelete,
  IconEdit,
  IconEye,
} from './HoverActionIcon'
import StatusChip from './StatusChip'
import {
  PAGE_SIZE_OPTIONS,
  RowActionType,
  filterRows,
  getRowAction,
  rowHasAction,
  sortRows,
  uniqueColumnValues,
} from './utils'
import './UIDataTable.css'

function SearchIcon() {
  return (
    <svg className="ui-dt-search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.75" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16.6 16.6L21 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

/** Icons.view_array_outlined — column visibility */
function ViewArrayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="10" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="16.5" y="5" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SortIndicator({ active, ascending }) {
  if (!active) return null
  return (
    <span className="ui-dt-sort-active" aria-hidden="true">
      {ascending ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 19V5M12 5l-5 5M12 5l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M12 19l-5-5M12 19l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}

/** Shared filter glyph — public/assets/svg/filter-svgrepo-com.svg */
const FILTER_ICON_SRC = '/assets/svg/filter-svgrepo-com.svg'

function FilterFunnelIcon() {
  return (
    <span
      className="ui-dt-filter-icon"
      style={{ maskImage: `url(${FILTER_ICON_SRC})`, WebkitMaskImage: `url(${FILTER_ICON_SRC})` }}
      aria-hidden="true"
    />
  )
}

function CircleCheck({ checked }) {
  return (
    <span className={`ui-dt-column-check${checked ? ' is-on' : ''}`} aria-hidden="true">
      {checked ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 12.5l4 4 8-9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  )
}

function pageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i)
  const pages = new Set([0, total - 1, current, current - 1, current + 1])
  const list = Array.from(pages)
    .filter((p) => p >= 0 && p < total)
    .sort((a, b) => a - b)
  const out = []
  let prev = null
  for (const p of list) {
    if (prev != null && p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }
  return out
}

function PaginationBar({
  showingFrom,
  showingTo,
  totalCount,
  rowsPerPage,
  safePage,
  pageCount,
  onRowsPerPage,
  onGoToPage,
}) {
  return (
    <div className="ui-dt-pager-bar">
      <span className="ui-dt-showing">
        {t('Showing', 'Showing')} {showingFrom}-{showingTo} {t('of', 'of')} {totalCount}
      </span>
      <div className="ui-dt-pager">
        <span className="ui-dt-rpp-label">{t('Rows_per_page', 'Rows per page:')}</span>
        <select
          className="ui-dt-rpp"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPage(Number(e.target.value))}
          aria-label={t('Rows_per_page', 'Rows per page:')}
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="ui-dt-page-nav"
          disabled={safePage <= 0}
          onClick={() => onGoToPage(safePage - 1)}
          aria-label={t('Previous', 'Previous')}
        >
          <ChevronLeftIcon />
        </button>
        {pageNumbers(safePage, pageCount).map((item, i) =>
          item === '…' ? (
            <span key={`e-${i}`} className="ui-dt-page-ellipsis">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`ui-dt-page-num${item === safePage ? ' is-active' : ''}`}
              onClick={() => onGoToPage(item)}
            >
              {item + 1}
            </button>
          ),
        )}
        <button
          type="button"
          className="ui-dt-page-nav"
          disabled={safePage >= pageCount - 1}
          onClick={() => onGoToPage(safePage + 1)}
          aria-label={t('Next', 'Next')}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  )
}

function UIDataTable({
  columns = [],
  rows,
  data,
  rowKey = 'id',
  title,
  titleDatatableText,
  subtitle,
  subTitleDatatableText,
  showSearchBox = true,
  showColumnSelector = true,
  searchPlaceholder,
  pageSize: pageSizeProp = 10,
  rowActions,
  onView,
  onModify,
  onDelete,
  onExecute,
  onRenew,
  onInlineEdit,
  actionsRender,
  filterableColumns,
  columnFilterOptions,
  multiSelect = false,
  onMultiSelectChange,
  onRowSelect,
  onCheckBoxRowSelected,
  onMultiCheckBoxRowSelected,
  serverSide = false,
  isServerSidePagination = false,
  serverPage,
  serverCurrentPage,
  serverRowsPerPage,
  serverTotalCount,
  serverTotalPages,
  serverShowingFrom,
  serverShowingTo,
  onPaginationChange,
  onPaginationChanged,
  controller,
  actionColumnName,
  emptyLabel,
  showTopPagination = true,
}) {
  const tableRows = rows ?? data ?? []
  const headerTitle = title ?? titleDatatableText
  const headerSubtitle = subtitle ?? subTitleDatatableText
  const serverMode = serverSide || isServerSidePagination
  const onPageChange = onPaginationChange || onPaginationChanged

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(pageSizeProp || 10)
  const [sortKey, setSortKey] = useState(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [columnSelections, setColumnSelections] = useState({})
  const [filterOpenKey, setFilterOpenKey] = useState(null)
  const [selectedKeys, setSelectedKeys] = useState(() => new Set())
  const [hiddenColumns, setHiddenColumns] = useState(() => new Set())
  const [columnMenuOpen, setColumnMenuOpen] = useState(false)
  const filterAnchors = useRef({})
  const columnMenuRef = useRef(null)

  useEffect(() => {
    if (serverMode && serverRowsPerPage != null) {
      setRowsPerPage(serverRowsPerPage)
    }
  }, [serverMode, serverRowsPerPage])

  useEffect(() => {
    if (serverMode && (serverCurrentPage != null || serverPage != null)) {
      const p = (serverCurrentPage ?? serverPage) - 1
      if (p >= 0) setPage(p)
    }
  }, [serverMode, serverCurrentPage, serverPage])

  useEffect(() => {
    if (!columnMenuOpen) return undefined
    function onDoc(e) {
      if (columnMenuRef.current?.contains(e.target)) return
      setColumnMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [columnMenuOpen])

  useEffect(() => {
    if (!controller || typeof controller._bind !== 'function') return undefined
    controller._bind({
      resetPagination: () => setPage(0),
      clearSearch: () => {
        setSearch('')
        setPage(0)
      },
      clearFilters: () => {
        setColumnSelections({})
        setFilterOpenKey(null)
        setPage(0)
      },
      clearSorting: () => {
        setSortKey(null)
        setSortAsc(true)
      },
      clearSelections: () => {
        setSelectedKeys(new Set())
        onMultiSelectChange?.(new Set())
        onMultiCheckBoxRowSelected?.(new Set())
      },
      clearGroups: () => {},
    })
    return () => controller._bind({})
  }, [controller, onMultiSelectChange, onMultiCheckBoxRowSelected])

  const filterableSet = useMemo(() => {
    // Flutter: null/undefined → all columns filterable. Empty array → none.
    if (filterableColumns == null) return null
    const list = Array.isArray(filterableColumns)
      ? filterableColumns
      : Array.from(filterableColumns)
    return new Set(list)
  }, [filterableColumns])

  const visibleColumns = useMemo(
    () => columns.filter((col) => !hiddenColumns.has(col.key)),
    [columns, hiddenColumns],
  )

  function isColumnFilterable(col) {
    if (col?.filterable === false) return false
    if (filterableSet == null) return true
    return filterableSet.has(col.key)
  }

  function isColumnFiltered(key) {
    const sel = columnSelections[key]
    return Boolean(sel && sel.size > 0 && !sel.has('ALL'))
  }

  const processed = useMemo(() => {
    if (serverMode) return tableRows
    const filtered = filterRows(tableRows, columns, search, columnSelections)
    return sortRows(filtered, sortKey, sortAsc)
  }, [serverMode, tableRows, columns, search, columnSelections, sortKey, sortAsc])

  const totalCount = serverMode
    ? Number(serverTotalCount ?? tableRows.length)
    : processed.length

  const pageCount = serverMode
    ? Math.max(
        1,
        Number((serverTotalPages ?? Math.ceil(totalCount / rowsPerPage)) || 1),
      )
    : Math.max(1, Math.ceil(processed.length / rowsPerPage) || 1)

  const safePage = Math.min(page, pageCount - 1)

  const pageRows = useMemo(() => {
    if (serverMode) return tableRows
    const start = safePage * rowsPerPage
    return processed.slice(start, start + rowsPerPage)
  }, [serverMode, tableRows, processed, safePage, rowsPerPage])

  const showingFrom =
    serverShowingFrom != null
      ? serverShowingFrom
      : totalCount === 0
        ? 0
        : safePage * rowsPerPage + 1
  const showingTo =
    serverShowingTo != null
      ? serverShowingTo
      : Math.min((safePage + 1) * rowsPerPage, totalCount)

  function emitPagination(nextPage, nextSize) {
    onPageChange?.(nextPage + 1, nextSize)
  }

  function goToPage(next) {
    const clamped = Math.max(0, Math.min(next, pageCount - 1))
    setPage(clamped)
    if (serverMode) emitPagination(clamped, rowsPerPage)
  }

  function changeRowsPerPage(value) {
    setRowsPerPage(value)
    setPage(0)
    if (serverMode) emitPagination(0, value)
  }

  function toggleSort(key) {
    if (sortKey === key) {
      setSortAsc((v) => !v)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  function getRowId(row, index) {
    const id = row?.[rowKey]
    return id != null ? String(id) : `row-${index}`
  }

  function toggleSelectAll(checked) {
    if (!checked) {
      setSelectedKeys(new Set())
      onMultiSelectChange?.(new Set())
      onMultiCheckBoxRowSelected?.(new Set())
      return
    }
    const next = new Set(pageRows.map((row, i) => getRowId(row, i)))
    setSelectedKeys(next)
    const selectedRows = pageRows.filter((row, i) => next.has(getRowId(row, i)))
    onMultiSelectChange?.(next)
    onMultiCheckBoxRowSelected?.(new Set(selectedRows))
  }

  function toggleSelectRow(row, index, checked) {
    const id = getRowId(row, index)
    const next = new Set(selectedKeys)
    if (checked) next.add(id)
    else next.delete(id)
    setSelectedKeys(next)
    onRowSelect?.(row)
    onCheckBoxRowSelected?.(checked ? row : null)
    const selectedRows = pageRows.filter((r, i) => next.has(getRowId(r, i)))
    onMultiSelectChange?.(next)
    onMultiCheckBoxRowSelected?.(new Set(selectedRows))
  }

  function toggleColumnVisibility(key) {
    setHiddenColumns((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else {
        // Keep at least one column visible
        if (columns.length - next.size <= 1) return prev
        next.add(key)
      }
      return next
    })
  }

  const allPageSelected =
    pageRows.length > 0 && pageRows.every((row, i) => selectedKeys.has(getRowId(row, i)))

  const hasBuiltInActions =
    rowHasAction(rowActions, RowActionType.view) ||
    rowHasAction(rowActions, RowActionType.modify) ||
    rowHasAction(rowActions, RowActionType.delete) ||
    rowHasAction(rowActions, RowActionType.execute) ||
    rowHasAction(rowActions, RowActionType.renew) ||
    rowHasAction(rowActions, RowActionType.inlineEdit)

  const showActions = Boolean(actionsRender || hasBuiltInActions)
  const colSpan =
    visibleColumns.length + (showActions ? 1 : 0) + (multiSelect ? 1 : 0)

  function renderActions(row) {
    if (actionsRender) return actionsRender(row)
    return (
      <div className="ui-dt-actions">
        {rowHasAction(rowActions, RowActionType.view) ? (
          <HoverActionIcon
            tooltip={getRowAction(rowActions, RowActionType.view)?.hoverMessage || t('View', 'View')}
            color={getRowAction(rowActions, RowActionType.view)?.color}
            onClick={() => onView?.(row)}
          >
            <IconEye />
          </HoverActionIcon>
        ) : null}
        {rowHasAction(rowActions, RowActionType.modify) ? (
          <HoverActionIcon
            tooltip={
              getRowAction(rowActions, RowActionType.modify)?.hoverMessage || t('Edit', 'Edit')
            }
            color={getRowAction(rowActions, RowActionType.modify)?.color}
            onClick={() => onModify?.(row)}
          >
            <IconEdit />
          </HoverActionIcon>
        ) : null}
        {rowHasAction(rowActions, RowActionType.inlineEdit) ? (
          <HoverActionIcon
            tooltip={t('Inline_Edit', 'Inline Edit')}
            onClick={() => onInlineEdit?.(row)}
          >
            <IconEdit />
          </HoverActionIcon>
        ) : null}
        {rowHasAction(rowActions, RowActionType.execute) ? (
          <HoverActionIcon tooltip={t('Execute', 'Execute')} onClick={() => onExecute?.(row)}>
            <IconEye />
          </HoverActionIcon>
        ) : null}
        {rowHasAction(rowActions, RowActionType.renew) ? (
          <HoverActionIcon tooltip={t('Renew', 'Renew')} onClick={() => onRenew?.(row)}>
            <IconEdit />
          </HoverActionIcon>
        ) : null}
        {rowHasAction(rowActions, RowActionType.delete) ? (
          <HoverActionIcon
            danger
            tooltip={
              getRowAction(rowActions, RowActionType.delete)?.hoverMessage || t('Delete', 'Delete')
            }
            color={getRowAction(rowActions, RowActionType.delete)?.color}
            onClick={() => onDelete?.(row)}
          >
            <IconDelete />
          </HoverActionIcon>
        ) : null}
      </div>
    )
  }

  function renderCell(col, row) {
    if (typeof col.render === 'function') return col.render(row)
    if (col.statusChip) {
      return <StatusChip status={row[col.key]} />
    }
    const value = row[col.key]
    if (value == null || value === '') return ''
    if (col.image) {
      const src = softfetchImageSrc(value, { mime: col.imageMime || 'image/png' })
      if (!src) return ''
      return (
        <img
          className="ui-dt-thumb"
          src={src}
          alt={col.label || col.key || ''}
          style={{
            width: col.imageWidth || 40,
            height: col.imageHeight || 40,
            objectFit: 'contain',
            borderRadius: 4,
          }}
        />
      )
    }
    return String(value)
  }

  const pagerProps = {
    showingFrom,
    showingTo,
    totalCount,
    rowsPerPage,
    safePage,
    pageCount,
    onRowsPerPage: changeRowsPerPage,
    onGoToPage: goToPage,
  }

  return (
    <div className="ui-data-table">
      {(headerTitle || headerSubtitle || showSearchBox || showColumnSelector) && (
        <div className="ui-dt-top">
          <div className="ui-dt-titles">
            {headerTitle ? <h3 className="ui-dt-title">{headerTitle}</h3> : null}
            {headerSubtitle ? (
              <UIText variant="b14Regular" className="ui-dt-subtitle">
                {headerSubtitle}
              </UIText>
            ) : null}
          </div>
          {showSearchBox || showColumnSelector ? (
            <div className="ui-dt-toolbar">
              {showSearchBox ? (
                <div className="ui-dt-search-wrap">
                  <div className="ui-dt-search-inner">
                    <SearchIcon />
                    <input
                      className="ui-dt-search"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(0)
                        setSortKey(null)
                      }}
                      placeholder={searchPlaceholder || t('Search', 'Search')}
                    />
                    {search ? (
                      <button
                        type="button"
                        className="ui-dt-search-clear"
                        aria-label={t('Clear', 'Clear')}
                        onClick={() => {
                          setSearch('')
                          setPage(0)
                          setSortKey(null)
                        }}
                      >
                        <ClearIcon />
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}
              {showColumnSelector ? (
                <div className="ui-dt-column-menu-wrap" ref={columnMenuRef}>
                  <button
                    type="button"
                    className={`ui-dt-column-btn${columnMenuOpen ? ' is-open' : ''}`}
                    aria-label={t('Columns', 'Columns')}
                    aria-expanded={columnMenuOpen}
                    onClick={() => setColumnMenuOpen((v) => !v)}
                  >
                    <ViewArrayIcon />
                  </button>
                  {columnMenuOpen ? (
                    <div className="ui-dt-column-menu" role="menu">
                      {columns.map((col) => {
                        const visible = !hiddenColumns.has(col.key)
                        return (
                          <button
                            key={col.key}
                            type="button"
                            role="menuitemcheckbox"
                            aria-checked={visible}
                            onClick={() => toggleColumnVisibility(col.key)}
                          >
                            <CircleCheck checked={visible} />
                            <span>{col.label || col.key}</span>
                          </button>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      )}

      {showTopPagination ? <PaginationBar {...pagerProps} /> : null}

      <div className="ui-dt-scroll">
        <table>
          <thead>
            <tr>
              {multiSelect ? (
                <th className="ui-dt-check-col">
                  <UICheckBox
                    checked={allPageSelected}
                    onChange={(checked) => toggleSelectAll(Boolean(checked))}
                  />
                </th>
              ) : null}
              {visibleColumns.map((col) => {
                const filterable = isColumnFilterable(col)
                const filtered = isColumnFiltered(col.key)
                const options =
                  columnFilterOptions?.[col.key] ||
                  uniqueColumnValues(tableRows, col.key)
                return (
                  <th key={col.key}>
                    <div className="ui-dt-th-inner">
                      <button
                        type="button"
                        className="ui-dt-th-sort"
                        onClick={() => toggleSort(col.key)}
                      >
                        <span>{col.label}</span>
                        <SortIndicator active={sortKey === col.key} ascending={sortAsc} />
                      </button>
                      {filterable ? (
                        <div
                          className="ui-dt-filter-wrap"
                          ref={(el) => {
                            filterAnchors.current[col.key] = el
                          }}
                        >
                          <button
                            type="button"
                            className={`ui-dt-filter-btn${filtered ? ' is-filtered' : ''}`}
                            aria-label={`${t('Filter', 'Filter')} ${col.label}`}
                            onClick={() =>
                              setFilterOpenKey((k) => (k === col.key ? null : col.key))
                            }
                          >
                            <FilterFunnelIcon />
                          </button>
                          <FilterDropdown
                            column={col.key}
                            columnLabel={col.label}
                            options={options}
                            selections={columnSelections[col.key]}
                            open={filterOpenKey === col.key}
                            onClose={() => setFilterOpenKey(null)}
                            anchorRef={{ current: filterAnchors.current[col.key] }}
                            onChange={(key, next) => {
                              setColumnSelections((prev) => ({ ...prev, [key]: next }))
                              setPage(0)
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </th>
                )
              })}
              {showActions ? (
                <th className="ui-dt-actions-head">
                  {actionColumnName || t('Actions', 'Actions')}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={colSpan}>
                  <UIText variant="b14Regular" className="ui-dt-empty">
                    {emptyLabel || t('No_Records', 'No records found')}
                  </UIText>
                </td>
              </tr>
            ) : (
              pageRows.map((row, index) => {
                const id = getRowId(row, index)
                return (
                  <tr key={id}>
                    {multiSelect ? (
                      <td className="ui-dt-check-col">
                        <UICheckBox
                          checked={selectedKeys.has(id)}
                          onChange={(checked) => toggleSelectRow(row, index, Boolean(checked))}
                        />
                      </td>
                    ) : null}
                    {visibleColumns.map((col) => (
                      <td key={col.key}>{renderCell(col, row)}</td>
                    ))}
                    {showActions ? (
                      <td className="ui-dt-actions-cell">{renderActions(row)}</td>
                    ) : null}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <PaginationBar {...pagerProps} />
    </div>
  )
}

export default UIDataTable
