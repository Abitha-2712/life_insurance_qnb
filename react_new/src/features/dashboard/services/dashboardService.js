import { apiRequest, isApiSuccess } from '@/core/api/client'
import { dashboardUrls } from '@/core/api/urls/dashboardUrls'
import AuthService from '@/core/auth/AuthService'

function payloadData(data) {
  if (!data || typeof data !== 'object') return null
  if (data.data !== undefined) return data.data
  return data
}

function listFromPayload(data) {
  const inner = payloadData(data)
  if (!inner) return []
  if (Array.isArray(inner)) return inner
  if (Array.isArray(inner.content)) return inner.content
  if (Array.isArray(inner.result)) return inner.result
  if (Array.isArray(inner.list)) return inner.list
  if (Array.isArray(inner.items)) return inner.items
  if (Array.isArray(inner.records)) return inner.records
  if (Array.isArray(inner.topFiveTransactions)) return inner.topFiveTransactions
  if (Array.isArray(inner.transferInfo)) return inner.transferInfo
  // Nested { data: [...] } after unwrap
  if (inner.data && Array.isArray(inner.data)) return inner.data
  return []
}

function countFromListPayload(data) {
  if (!data || typeof data !== 'object') return 0
  if (data?.status?.code && data.status.code !== '000000' && !isApiSuccess(data)) {
    return 0
  }
  if (typeof data?.totalElements === 'number') return data.totalElements
  if (typeof data?.totalCount === 'number') return data.totalCount
  if (typeof data?.count === 'number') return data.count
  const inner = payloadData(data)
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    if (typeof inner.totalElements === 'number') return inner.totalElements
    if (typeof inner.totalCount === 'number') return inner.totalCount
    if (typeof inner.count === 'number') return inner.count
  }
  return listFromPayload(data).length
}

function dateRangeDays(days = 7) {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - (days - 1))
  const fmt = (d) => d.toISOString().slice(0, 10)
  return { fromDate: fmt(from), toDate: fmt(to), startDate: fmt(from), endDate: fmt(to) }
}

/** Flutter login audit DateFormat('dd-MM-yyyy') — default last 7 inclusive days */
function loginAuditDateRange(days = 7) {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - (days - 1))
  const pad = (n) => String(n).padStart(2, '0')
  const fmt = (d) =>
    `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`
  return {
    fromDate: fmt(from),
    toDate: fmt(to),
    year: to.getFullYear(),
    periodDays: days,
  }
}

function resolveLoginAuditRange(range) {
  if (range?.fromDate && range?.toDate) {
    const year =
      Number(String(range.toDate).slice(-4)) ||
      range.year ||
      new Date().getFullYear()
    return {
      fromDate: range.fromDate,
      toDate: range.toDate,
      year,
      periodDays: Number(range.periodDays) || 7,
    }
  }
  return loginAuditDateRange(7)
}

/** Row1 — User Count — Flutter GET login/unique-logins */
export async function fetchUniqueLogins() {
  const res = await apiRequest(dashboardUrls.uniqueLogins, { method: 'GET' })
  const ok = res.ok && isApiSuccess(res.data)
  const rows = ok ? listFromPayload(res.data) : []
  if (!rows.length) {
    return { ok: false, cards: [], raw: res.data }
  }
  const cards = []
  const tones = ['orange', 'blue', 'green', 'purple']
  rows.slice(0, 2).forEach((row, idx) => {
    const month = row.month ?? ''
    const mb = row.mobile_banking || row.mobileBanking || {}
    const ib = row.internet_banking || row.internetBanking || {}
    cards.push({
      label: 'Active Mobile Banking',
      month,
      value: mb.count ?? '',
      percentage: mb.percentage ?? '',
      increased: String(mb.isIncreased || 'N').toUpperCase() === 'Y',
      tone: tones[idx * 2],
      channel: 'mb',
    })
    cards.push({
      label: 'Active Internet Banking',
      month,
      value: ib.count ?? '',
      percentage: ib.percentage ?? '',
      increased: String(ib.isIncreased || 'N').toUpperCase() === 'Y',
      tone: tones[idx * 2 + 1],
      channel: 'ib',
    })
  })
  return { ok: true, cards, raw: res.data }
}

/** Row1 — Daily Active Users — POST login/count/hour-wise?channelId=ALL */
export async function fetchLiveUsers(channelId = 'ALL') {
  const path = `${dashboardUrls.liveUsersCount}?channelId=${encodeURIComponent(channelId)}`
  const res = await apiRequest(path, { method: 'POST', body: {} })
  const ok = res.ok && isApiSuccess(res.data)
  const data = payloadData(res.data) || {}
  const ib = Array.isArray(data.IB) ? data.IB : []
  const mb = Array.isArray(data.MB) ? data.MB : []
  return {
    ok,
    ibPoints: ib.map((r, i) => ({ x: i, y: Number(r.count ?? 0), time: r.time })),
    mbPoints: mb.map((r, i) => ({ x: i, y: Number(r.count ?? 0), time: r.time })),
    totalCount: Number(data.totalCount ?? 0),
    percentage: Number(data.percentage ?? 0),
    raw: res.data,
  }
}

async function fetchCountOnData(path) {
  const res = await apiRequest(path, { base: 'data', method: 'POST', body: {} })
  if (!res.ok && !isApiSuccess(res.data)) return 0
  return countFromListPayload(res.data)
}

export async function fetchMetricsCounts() {
  const [faqs, products, subProducts, offers] = await Promise.allSettled([
    fetchCountOnData(dashboardUrls.faqGetAll),
    fetchCountOnData(dashboardUrls.productGetAll),
    fetchCountOnData(dashboardUrls.subProductGetAll),
    (async () => {
      const res = await apiRequest(dashboardUrls.offerGetAll, {
        base: 'data',
        method: 'POST',
        body: {},
      })
      if (!res.ok && !isApiSuccess(res.data)) return 0
      const list = listFromPayload(res.data)
      return list.filter((o) => {
        const status = String(o.offerStatus || o.status || '')
          .toUpperCase()
          .trim()
        return (
          status === 'ACTIVE' ||
          status === 'ACT' ||
          status === 'Y' ||
          status === 'YES' ||
          status === 'ENABLED' ||
          status === 'A'
        )
      }).length
    })(),
  ])
  // Flutter row2_metrics.dart hardcodes change badges (list APIs have no %)
  return {
    faqs: faqs.status === 'fulfilled' ? faqs.value : 0,
    products: products.status === 'fulfilled' ? products.value : 0,
    subProducts: subProducts.status === 'fulfilled' ? subProducts.value : 0,
    offers: offers.status === 'fulfilled' ? offers.value : 0,
    faqsDelta: '+12%',
    productsDelta: '+100%',
    subProductsDelta: '+15%',
    offersDelta: '+5%',
  }
}

function formatRelativeTime(dateString) {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return String(dateString)
    const now = Date.now()
    const diffMs = now - date.getTime()
    const mins = Math.floor(diffMs / 60000)
    const hours = Math.floor(diffMs / 3600000)
    const days = Math.floor(diffMs / 86400000)
    if (days > 0) return `${days} ${days === 1 ? 'day' : 'days'} ago`
    if (hours > 0) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    if (mins > 0) return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`
    return 'Just now'
  } catch {
    return String(dateString)
  }
}

/**
 * Flutter RecentActivityHelper.getActivityDisplay — categoryCode → title + kind.
 */
export function mapRecentActivityDisplay(categoryCode = '') {
  const code = String(categoryCode).toLowerCase()
  if (code.includes('offer')) return { title: 'New offer created', kind: 'offer' }
  if (code.includes('category')) {
    return { title: 'Category configuration updated', kind: 'category' }
  }
  if (code.includes('channel')) {
    return { title: 'Channel configuration updated', kind: 'channel' }
  }
  if (code.includes('product')) return { title: 'New product added', kind: 'product' }
  if (code.includes('user') || code.includes('member')) {
    return { title: 'New team member joined', kind: 'user' }
  }
  if (code.includes('mfa') || code.includes('security')) {
    return { title: 'MFA configuration updated', kind: 'mfa' }
  }
  if (code.includes('faq')) return { title: 'New FAQ created', kind: 'faq' }
  return { title: 'Activity updated', kind: 'default' }
}

/** Flutter RecentActivityCard._buildHardcodedActivities — empty / error fallback */
export const HARDCODED_RECENT_ACTIVITIES = [
  { title: 'New FAQ created', timeLabel: '2 hours ago', kind: 'faq' },
  { title: 'MFA configuration updated', timeLabel: '5 hours ago', kind: 'mfa' },
  { title: 'New product added', timeLabel: '1 day ago', kind: 'product' },
  { title: 'New team member joined', timeLabel: '2 days ago', kind: 'user' },
]

/** Recent activity — Flutter POST recent-activity/Activity-Log on baseUrl (BO) */
export async function fetchRecentActivity() {
  const userId = AuthService.getUserId()
  try {
    const res = await apiRequest(dashboardUrls.recentActivity, {
      base: 'bo',
      method: 'POST',
      body: {},
      headers: userId ? { userId } : {},
    })
    if (!res.ok || !isApiSuccess(res.data)) {
      return { ok: false, items: HARDCODED_RECENT_ACTIVITIES }
    }
    const list = listFromPayload(res.data)
    if (!list.length) {
      return { ok: true, items: HARDCODED_RECENT_ACTIVITIES }
    }
    return {
      ok: true,
      items: list.slice(0, 4).map((item) => {
        const display = mapRecentActivityDisplay(item.categoryCode)
        return {
          title: display.title,
          timeLabel: formatRelativeTime(item.reqDate) || String(item.reqDate || ''),
          customerId: item.customerId || '',
          kind: display.kind,
        }
      }),
    }
  } catch {
    return { ok: false, items: HARDCODED_RECENT_ACTIVITIES }
  }
}


/**
 * Customer incidents — Flutter DashboardDatasourceImpl.getPendingReqCount
 * posts GraphQL to baseUrlWFC + 'graphql'. Root gateway
 * `https://…:8444/graphql` is Flutter graphqlDio. REST count is last resort.
 */
export async function fetchPendingIncidentCounts() {
  const mutationBody = {
    query:
      'mutation callGenericMutation($request: GenericApiRequest!) { callGenericMutation(request: $request) { status { code description } data } }',
    variables: {
      request: { serviceName: 'workflowCounts' },
    },
  }

  function parseCounts(res) {
    let raw = payloadData(res.data) || {}
    const gqlData =
      res.data?.data?.callGenericMutation?.data ||
      res.data?.callGenericMutation?.data
    if (gqlData && typeof gqlData === 'object') raw = gqlData
    if (typeof raw === 'string') {
      try {
        raw = JSON.parse(raw)
      } catch {
        raw = {}
      }
    }
    return {
      pendingRequest: Number(raw.totalPendingRequestCount ?? 0),
      pendingApproval: Number(raw.totalPendingApprovalCount ?? 0),
      rejected: Number(raw.totalRejectedCount ?? raw.requestsRejects ?? 0),
      hasAny:
        raw.totalPendingRequestCount != null ||
        raw.totalPendingApprovalCount != null ||
        raw.totalRejectedCount != null ||
        raw.requestsRejects != null,
    }
  }

  try {
    // 1) Flutter dashboard parity: WFC + graphql
    let res = await apiRequest(dashboardUrls.graphql, {
      base: 'wfc',
      method: 'POST',
      body: mutationBody,
    })
    if (res.ok && isApiSuccess(res.data)) {
      const counts = parseCounts(res)
      if (counts.hasAny) return counts
    }

    // 2) Flutter graphqlDio host: /graphql on gateway root
    res = await apiRequest('', {
      base: 'graphql',
      method: 'POST',
      body: mutationBody,
    })
    if (res.ok && isApiSuccess(res.data)) {
      const counts = parseCounts(res)
      if (counts.hasAny) return counts
    }

    // 3) REST fallback from DashboardUrl.pendingRequestCount
    res = await apiRequest(dashboardUrls.pendingRequestCount, {
      base: 'bo',
      method: 'POST',
      body: {},
    })
    if (res.ok && isApiSuccess(res.data)) {
      return parseCounts(res)
    }
  } catch {
    /* fall through */
  }
  return { pendingRequest: 0, pendingApproval: 0, rejected: 0 }
}

/** Transaction distribution — POST transfer/topFiveTransactions?channelId=ALL */
export async function fetchTopTransactions(channelId = 'ALL') {
  const path = `${dashboardUrls.topFiveTransactions}?channelId=${encodeURIComponent(channelId)}`
  const body =
    channelId === 'ALL'
      ? { functionalId: 'BESTPERTXN' }
      : { functionalId: 'TOP5TXN' }
  const res = await apiRequest(path, { method: 'POST', body })
  const ok = res.ok && isApiSuccess(res.data)
  const data = payloadData(res.data) || {}
  const list = Array.isArray(data.topFiveTransactions)
    ? data.topFiveTransactions
    : listFromPayload(res.data)
  return {
    ok,
    items: list.map((item) => ({
      label: item.transferDesc || item.transferType || item.name || '',
      value: item.count ?? item.txnCount ?? '',
    })),
  }
}

/** Service failure — POST transfer/topFailureTransactions */
export async function fetchTopFailures(channelId = 'ALL') {
  // Flutter row4 uses startDate 2024-12-18 through today
  const endDate = new Date().toISOString().slice(0, 10)
  const path = `${dashboardUrls.topFailureTransactions}?channelId=${encodeURIComponent(channelId)}`
  const res = await apiRequest(path, {
    method: 'POST',
    body: {
      unit: 'PRD',
      startDate: '2024-12-18',
      endDate,
    },
  })
  const ok = res.ok && isApiSuccess(res.data)
  const data = payloadData(res.data) || {}
  const block = data.serviceFailureAndLatency || data.serviceLatency || data
  const failures = Array.isArray(block.failedTransactionRate)
    ? block.failedTransactionRate
    : []
  const sliced = failures.slice(0, 5)
  return {
    ok,
    legend: block.legend || null,
    bars: sliced.map((f) => ({
      label: f.categoryDesc || f.categoryCode || '',
      info: Number.parseInt(String(f.info ?? 0), 10) || 0,
      warning: Number.parseInt(String(f.warning ?? 0), 10) || 0,
      error: Number.parseInt(String(f.error ?? 0), 10) || 0,
    })),
    items: sliced.map((f) => ({
      label: f.categoryDesc || f.categoryCode || '',
      value: f.failureCount ?? f.total ?? '',
      percentage:
        f.failurePercentage != null && f.failurePercentage !== ''
          ? String(f.failurePercentage)
          : null,
    })),
  }
}

/** Transfer view — GET transfer/viewCount */
export async function fetchTransferViewCount() {
  const res = await apiRequest(dashboardUrls.transferViewCount, { method: 'GET' })
  const ok = res.ok
  const data = payloadData(res.data) || {}
  const roles = Array.isArray(data.categoryCodes) ? data.categoryCodes : []
  const rows = []
  roles.forEach((role) => {
    ;(role.data || []).forEach((item) => {
      rows.push({
        role: role.role,
        label: item.categoryCodeDesc || item.categoryCode,
        success: item.categoryCodeData?.successCount ?? item.successCount,
        failure: item.categoryCodeData?.failureCount ?? item.failureCount,
      })
    })
  })
  return { ok, rows, raw: data }
}

/** Onboarding — GET onboarding/onboarding-counts */
export async function fetchOnboardingCounts() {
  const res = await apiRequest(dashboardUrls.onboardingCount, { method: 'GET' })
  const ok = res.ok && (isApiSuccess(res.data) || res.ok)
  const data = payloadData(res.data) || res.data || {}
  return {
    ok,
    registered: Number(data.registeredCount ?? 0),
    started: Number(data.startedCount ?? 0),
    broken: Number(data.brokenCount ?? 0),
    completed: Number(data.completedCount ?? 0),
  }
}

/** Txn analysis — POST transfer/txnMetrics */
export async function fetchTxnMetrics() {
  const range = dateRangeDays(7)
  // Flutter row6 + TransactionDatasource.getTransactionMetrix (baseUrl / bo)
  const res = await apiRequest(dashboardUrls.txnMetrics, {
    base: 'bo',
    method: 'POST',
    headers: { channel: 'MB', unit: 'PRD', 'Accept-Language': 'en' },
    body: {
      startDate: range.startDate,
      endDate: range.endDate,
      type: 'ALL',
      filter: {
        channels: ['RIB', 'RMB', 'IB', 'MB'],
        serviceTypes: [
          'ONBOARDING',
          'CARD',
          'ACCOUNTS',
          'COMMON',
          'LOAN',
          'LOGIN',
          'TRANSFERS',
        ],
      },
    },
  })
  const ok = res.ok && isApiSuccess(res.data)
  const data = payloadData(res.data) || {}
  const analysis = data.transactionAnalysis || data
  const services = Array.isArray(analysis.services) ? analysis.services : []
  const rows = services.map((s) => {
    const success = Number(s.successCount ?? 0)
    const failure = Number(s.failureCount ?? 0)
    return {
      serviceType: s.serviceType || '',
      total: String(success + failure),
      success: String(success),
      failure: String(failure),
      successRate: s.successRate,
      failureRate: s.failureRate,
      channelBreakdown: s.channelBreakdown || [],
    }
  })
  const total =
    Number(analysis.totalTransactions ?? 0) ||
    rows.reduce((sum, r) => sum + Number(r.total || 0), 0)
  return { ok, total, rows }
}

/** Login audit FO/BO — Flutter LoginAuditDatasource; host :8443/backoffice-service */
export async function fetchLoginAuditGraph(category = 'FO', rangeInput) {
  const range = resolveLoginAuditRange(rangeInput)
  const res = await apiRequest(dashboardUrls.loginAuditGraph, {
    base: 'service',
    method: 'POST',
    headers: { 'Accept-Language': 'en' },
    body: {
      category,
      fromDate: range.fromDate,
      toDate: range.toDate,
    },
  })
  const ok = res.ok && isApiSuccess(res.data)
  const data = payloadData(res.data) || {}
  const summary = data.summary || {}
  const alert = summary.alert || {}
  const daily = Array.isArray(data.dailySeries) ? data.dailySeries : []
  const hourly = Array.isArray(data.hourlySeries) ? data.hourlySeries : []
  const recent = Array.isArray(data.recentEntries) ? data.recentEntries : []

  return {
    ok,
    range,
    title: data.title || '',
    categories: data.categories || [],
    fromDate: data.fromDate || range.fromDate,
    toDate: data.toDate || range.toDate,
    successRate: Number(summary.successRate ?? 0),
    totalAttempts: Number(summary.totalCount ?? 0),
    successCount: Number(summary.successCount ?? 0),
    failedCount: Number(summary.failureCount ?? 0),
    priorDelta: Number(summary.priorPeriodDeltaPts ?? 0),
    daysBelowTarget: Number(summary.daysBelowTarget ?? 0),
    sparkline: Array.isArray(summary.sparklineValues) ? summary.sparklineValues : [],
    alert: {
      visible: Boolean(alert.visible),
      message: alert.message || '',
      severity: alert.severity || 'info',
    },
    dailySeries: daily.map((p, i) => ({
      x: i,
      y: Number(p.successRate ?? p.value ?? 0),
      label: p.date || p.day || '',
      date: p.date || p.day || '',
      success: Number(p.success ?? 0),
      failed: Number(p.failed ?? 0),
      total: Number(p.total ?? (Number(p.success ?? 0) + Number(p.failed ?? 0))),
      successRate: Number(p.successRate ?? 0),
    })),
    hourlySeries: hourly.map((p) => ({
      hour: String(p.hour || ''),
      attempts: Number(p.attempts ?? 0),
      success: Number(p.success ?? 0),
      failed: Number(p.failed ?? 0),
      successRate: Number(p.successRate ?? 0),
    })),
    recentEntries: recent.map(mapLoginAuditEntry),
  }
}

function mapLoginAuditEntry(row = {}) {
  const status = String(row.resultStatus || row.status || '').toUpperCase()
  return {
    username: row.username || row.customerId || row.userId || '',
    action: row.action || '',
    feature: row.feature || '',
    requestDate: row.requestDate || row.date || '',
    requestTime: row.requestTime || row.time || '',
    categoryCode: row.categoryCode || row.category || '',
    channelId: row.channelId || row.channel || '',
    ipAddress: row.ipAddress || '',
    unitId: row.unitId || '',
    devices: row.devices || row.device || '',
    resultStatus: row.resultStatus || row.status || '',
    isSuccess: status === 'SUCCESS' || status === 'S',
    message:
      row.message ||
      [row.username, row.categoryCode || row.action, row.resultStatus].filter(Boolean).join(' · ') ||
      '',
    time: row.requestTime || row.time || row.timestamp || row.createdAt || '',
  }
}

export async function fetchLoginAuditLogs(category = 'FO', page = 0, size = 5, rangeInput) {
  const range = resolveLoginAuditRange(rangeInput)
  const res = await apiRequest(dashboardUrls.loginAuditRecentLogs, {
    base: 'service',
    method: 'POST',
    headers: { 'Accept-Language': 'en' },
    body: {
      category,
      fromDate: range.fromDate,
      toDate: range.toDate,
      page,
      size,
    },
  })
  const ok = res.ok && isApiSuccess(res.data)
  const data = payloadData(res.data)
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.entries)
        ? data.entries
        : listFromPayload(res.data)
  return {
    ok,
    range,
    totalCount: Number(data?.totalCount ?? list.length),
    entries: list.map(mapLoginAuditEntry),
  }
}

/**
 * Login-time prefetch cache — fully resolved before navigate so HomePage
 * can hydrate with no post-login network wait.
 */
let dashboardPrefetch = null

function auditRangeKey(range) {
  const r = resolveLoginAuditRange(range)
  return `${r.fromDate}|${r.toDate}`
}

/** Drop cached / in-flight dashboard fetches (logout or forced refresh). */
export function clearDashboardPrefetch() {
  dashboardPrefetch = null
}

export function isDashboardPrefetchReady() {
  return Boolean(dashboardPrefetch?.ready)
}

/**
 * Kick off every home dashboard API in parallel (widgets + FO/BO login audit).
 * Resolves only after all calls settle. Safe to call multiple times.
 * @param {{ auditRange?: { fromDate: string, toDate: string, periodDays?: number } }} [options]
 */
export function prefetchDashboardHome(options = {}) {
  if (dashboardPrefetch?.promise) return dashboardPrefetch.promise

  const auditRange = resolveLoginAuditRange(options.auditRange)
  const tasks = {
    unique: fetchUniqueLogins(),
    live: fetchLiveUsers('ALL'),
    metrics: fetchMetricsCounts(),
    activity: fetchRecentActivity(),
    incidents: fetchPendingIncidentCounts(),
    topTxn: fetchTopTransactions('ALL'),
    failures: fetchTopFailures('ALL'),
    transfer: fetchTransferViewCount(),
    onboard: fetchOnboardingCounts(),
    txnMetric: fetchTxnMetrics(),
    auditFoGraph: fetchLoginAuditGraph('FO', auditRange),
    auditFoLogs: fetchLoginAuditLogs('FO', 0, 5, auditRange),
    auditBoGraph: fetchLoginAuditGraph('BO', auditRange),
    auditBoLogs: fetchLoginAuditLogs('BO', 0, 5, auditRange),
  }

  const promise = Promise.allSettled(
    Object.entries(tasks).map(async ([key, task]) => {
      try {
        return [key, await task]
      } catch {
        return [key, null]
      }
    }),
  ).then((settled) => {
    const results = {}
    for (const entry of settled) {
      if (entry.status !== 'fulfilled') continue
      const [key, value] = entry.value
      results[key] = value
    }
    if (dashboardPrefetch) {
      dashboardPrefetch.results = results
      dashboardPrefetch.ready = true
    }
    return results
  })

  dashboardPrefetch = {
    tasks,
    promise,
    results: null,
    ready: false,
    auditRangeKey: auditRangeKey(auditRange),
    startedAt: Date.now(),
  }
  return promise
}

/** In-flight or settled promise for a home widget key, if login prefetch ran. */
export function getDashboardPrefetchTask(key) {
  return dashboardPrefetch?.tasks?.[key] ?? null
}

/** Resolved value from login prefetch (undefined if not ready / missing). */
export function getDashboardPrefetchResult(key) {
  if (!dashboardPrefetch?.ready) return undefined
  return dashboardPrefetch.results?.[key]
}

/**
 * Prefetched login-audit promises when the date range still matches login default.
 * @param {'FO'|'BO'} category
 * @param {{ fromDate?: string, toDate?: string }} range
 */
export function getLoginAuditPrefetch(category, range) {
  if (!dashboardPrefetch?.tasks) return null
  if (auditRangeKey(range) !== dashboardPrefetch.auditRangeKey) return null
  const prefix = category === 'BO' ? 'auditBo' : 'auditFo'
  const graph = dashboardPrefetch.tasks[`${prefix}Graph`]
  const logs = dashboardPrefetch.tasks[`${prefix}Logs`]
  if (!graph || !logs) return null
  return { graph, logs }
}

/**
 * Resolved FO/BO login-audit payload when prefetch finished for this range.
 * @param {'FO'|'BO'} category
 * @param {{ fromDate?: string, toDate?: string }} range
 */
export function getLoginAuditPrefetchResult(category, range) {
  if (!dashboardPrefetch?.ready) return null
  if (auditRangeKey(range) !== dashboardPrefetch.auditRangeKey) return null
  const prefix = category === 'BO' ? 'auditBo' : 'auditFo'
  return {
    graph: dashboardPrefetch.results?.[`${prefix}Graph`] ?? null,
    logs: dashboardPrefetch.results?.[`${prefix}Logs`] ?? null,
  }
}

/**
 * Block until every dashboard home API (and optional extras) have settled.
 * Called from login so the dashboard opens with data already loaded.
 */
export async function loadDashboardBeforeNavigate(options = {}) {
  return prefetchDashboardHome(options)
}

/** Single entry for HomePage — all dashboard services in parallel */
export async function loadDashboardHome() {
  await prefetchDashboardHome()
  const result = (key, fallback) => {
    const cached = getDashboardPrefetchResult(key)
    return cached !== undefined && cached !== null ? cached : fallback
  }

  return {
    unique: result('unique', { ok: false, cards: [] }),
    live: result('live', { ok: false, ibPoints: [], mbPoints: [] }),
    metrics: result('metrics', {
      faqs: 0,
      products: 0,
      subProducts: 0,
      offers: 0,
      faqsDelta: '+12%',
      productsDelta: '+100%',
      subProductsDelta: '+15%',
      offersDelta: '+5%',
    }),
    recent: result('activity', { ok: false, items: [] }),
    pending: result('incidents', { pendingRequest: 0, pendingApproval: 0, rejected: 0 }),
    topTxn: result('topTxn', { ok: false, items: [] }),
    topFail: result('failures', { ok: false, items: [], bars: [] }),
    transfer: result('transfer', { ok: false, rows: [] }),
    onboard: result('onboard', {
      ok: false,
      registered: 0,
      started: 0,
      broken: 0,
      completed: 0,
    }),
    txnMetric: result('txnMetric', { ok: false, rows: [], total: 0 }),
  }
}

export default {
  fetchUniqueLogins,
  fetchLiveUsers,
  fetchMetricsCounts,
  fetchRecentActivity,
  fetchPendingIncidentCounts,
  fetchTopTransactions,
  fetchTopFailures,
  fetchTransferViewCount,
  fetchOnboardingCounts,
  fetchTxnMetrics,
  fetchLoginAuditGraph,
  fetchLoginAuditLogs,
  mapRecentActivityDisplay,
  HARDCODED_RECENT_ACTIVITIES,
  prefetchDashboardHome,
  loadDashboardBeforeNavigate,
  clearDashboardPrefetch,
  isDashboardPrefetchReady,
  getDashboardPrefetchTask,
  getDashboardPrefetchResult,
  getLoginAuditPrefetch,
  getLoginAuditPrefetchResult,
  loadDashboardHome,
}
