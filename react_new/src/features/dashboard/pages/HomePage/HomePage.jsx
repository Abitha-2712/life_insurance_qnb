import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Box from '@/components/layout/Box/Box'
import { UICard, UIDataTable, UILoader, UIText } from '@/components/ui'
import { t } from '@/core/i18n/t'
import {
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
  getDashboardPrefetchResult,
  getLoginAuditPrefetchResult,
  isDashboardPrefetchReady,
  prefetchDashboardHome,
  HARDCODED_RECENT_ACTIVITIES,
} from '@/features/dashboard/services/dashboardService'
import { boSvg } from '@/features/dashboard/menu/menuIconMaps'
import UISvgIcon from '@/components/ui/UISvgIcon/UISvgIcon'
import { homeMetricIcons } from '@/features/dashboard/pages/HomePage/homeMetricIcons'
import {
  PhoneAndroidIcon,
  LanguageIcon,
  AutorenewIcon,
  NorthEastIcon,
  SouthEastIcon,
  TrendingUpIcon,
  HistoryIcon,
  CheckIcon,
  CloseIcon,
  PriorityHighIcon,
  ChatBubbleOutlineIcon,
  ShieldOutlinedIcon,
  ShowChartIcon,
  GroupOutlinedIcon,
  LocalOfferOutlinedIcon,
  Inventory2OutlinedIcon,
  InfoOutlineIcon,
  CategoryOutlinedIcon,
  QUICK_ACTION_ICONS,
} from '@/features/dashboard/pages/HomePage/homeMaterialIcons'
import { DonutChart, StackedFailureBarChart } from '@/features/dashboard/pages/HomePage/homeCharts'
import {
  LoginAuditByHourView,
  LoginAuditDailyTableView,
  LoginAuditRecentEntries,
  LoginAuditSparkline,
  LoginAuditTrendView,
} from '@/features/dashboard/pages/HomePage/LoginAuditDetailViews'
import LoginAuditDatePicker, {
  buildLoginAuditRange,
} from '@/features/dashboard/pages/HomePage/LoginAuditDatePicker'
import './HomePage.css'

const QUICK_ACTIONS = [
  { key: 'faq', label: 'Create New FAQ', to: '/dashboard/faq_management' },
  { key: 'mfa', label: 'Add MFA Configuration', to: '/dashboard/mfa_management' },
  { key: 'product', label: 'Manage Products', to: '/dashboard/apply_product' },
  { key: 'user', label: 'Add User', to: '/dashboard/user_creation' },
]

function WidgetLoader({ minHeight = 120 }) {
  return (
    <Box className="home-widget-loader" style={{ minHeight }}>
      <UILoader />
    </Box>
  )
}

function MetricTile({ label, value, delta, icon: Icon, loading }) {
  return (
    <UICard className="home-metric-tile">
      {loading ? (
        <WidgetLoader minHeight={72} />
      ) : (
        <Box className="home-metric-tile-inner">
          <span className="home-metric-tile-icon" aria-hidden="true">
            {Icon ? <Icon size={22} /> : null}
          </span>
          <Box className="home-metric-tile-body">
            <UIText variant="b12Regular" className="home-metric-tile-label">
              {label}
            </UIText>
            <UIText variant="h20SemiBold" className="home-metric-tile-value">
              {value == null ? '' : String(value)}
            </UIText>
          </Box>
          {delta ? <span className="home-metric-pill">{delta}</span> : null}
        </Box>
      )}
    </UICard>
  )
}

function DualLineChart({ ibPoints = [], mbPoints = [], emptyLabel }) {
  const hasData = ibPoints.length > 0 || mbPoints.length > 0
  if (!hasData) {
    return (
      <Box className="home-chart-empty">
        <UIText variant="b13Regular">{emptyLabel}</UIText>
      </Box>
    )
  }
  const all = [...ibPoints, ...mbPoints]
  const max = Math.max(...all.map((p) => p.y), 1)
  const len = Math.max(ibPoints.length, mbPoints.length, 2)
  const w = 320
  const h = 160
  const toPath = (points) =>
    points
      .map((p, i) => {
        const x = (i / Math.max(len - 1, 1)) * (w - 20) + 10
        const y = h - 10 - (p.y / max) * (h - 30)
        return `${i === 0 ? 'M' : 'L'}${x},${y}`
      })
      .join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="home-line-chart" role="img">
      {ibPoints.length ? (
        <path d={toPath(ibPoints)} fill="none" stroke="var(--qnb-chart-ib)" strokeWidth="2" />
      ) : null}
      {mbPoints.length ? (
        <path d={toPath(mbPoints)} fill="none" stroke="var(--qnb-chart-mb)" strokeWidth="2" />
      ) : null}
    </svg>
  )
}

function SimpleLineChart({ points = [], emptyLabel }) {
  if (!points.length) {
    return (
      <Box className="home-chart-empty">
        <UIText variant="b13Regular">{emptyLabel}</UIText>
      </Box>
    )
  }
  const max = Math.max(...points.map((p) => p.y), 1)
  const w = 320
  const h = 140
  const path = points
    .map((p, i) => {
      const x = (i / Math.max(points.length - 1, 1)) * (w - 20) + 10
      const y = h - 10 - (p.y / max) * (h - 30)
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="home-line-chart" role="img">
      <path d={path} fill="none" stroke="var(--qnb-green-bar)" strokeWidth="2" />
    </svg>
  )
}

/** Flutter RecentActivityHelper — icon chrome by category kind. */
function activityIconFor(kind = '') {
  const k = String(kind).toLowerCase()
  if (k.includes('offer')) {
    return { Icon: LocalOfferOutlinedIcon, color: '#60A5FA', bg: '#DCEEFB' }
  }
  if (k.includes('category')) {
    return { Icon: CategoryOutlinedIcon, color: '#A78BFA', bg: '#EDE9FE' }
  }
  if (k.includes('channel')) {
    return { Icon: ShowChartIcon, color: '#60A5FA', bg: '#DCEEFB' }
  }
  if (k.includes('product')) {
    return { Icon: Inventory2OutlinedIcon, color: '#60A5FA', bg: '#DCEEFB' }
  }
  if (k.includes('user') || k.includes('member') || k.includes('team') || k.includes('people')) {
    return { Icon: GroupOutlinedIcon, color: '#34D399', bg: '#D1FAE5' }
  }
  if (k.includes('mfa') || k.includes('security') || k.includes('otp')) {
    return { Icon: ShieldOutlinedIcon, color: '#A78BFA', bg: '#EDE9FE' }
  }
  if (k.includes('faq') || k.includes('chat') || k.includes('message')) {
    return { Icon: ChatBubbleOutlineIcon, color: '#60A5FA', bg: '#DCEEFB' }
  }
  return { Icon: InfoOutlineIcon, color: '#9CA3AF', bg: '#F3F4F6' }
}

function LoginAuditCard({ title, category, icon, range }) {
  const cached = getLoginAuditPrefetchResult(category, range)
  const [view, setView] = useState('trend')
  const [loading, setLoading] = useState(() => !cached)
  const [graph, setGraph] = useState(() => cached?.graph ?? null)
  const [logs, setLogs] = useState(() => cached?.logs?.entries || [])

  useEffect(() => {
    if (!range?.fromDate || !range?.toDate) return undefined
    const ready = getLoginAuditPrefetchResult(category, range)
    if (ready) {
      setGraph(ready.graph)
      setLogs(ready.logs?.entries || [])
      setLoading(false)
      return undefined
    }
    let cancelled = false
    setLoading(true)
    ;(async () => {
      try {
        const [g, l] = await Promise.all([
          fetchLoginAuditGraph(category, range),
          fetchLoginAuditLogs(category, 0, 5, range),
        ])
        if (cancelled) return
        setGraph(g)
        setLogs(l.entries || [])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [category, range?.fromDate, range?.toDate])

  const successRate = Number(graph?.successRate ?? 0)
  const priorDelta = Number(graph?.priorDelta ?? 0)
  const isDown = priorDelta < 0
  const dailySeries = graph?.dailySeries || []
  const categories =
    graph?.categories?.length
      ? graph.categories
      : category === 'FO'
        ? ['login', 'biometriclogin']
        : ['auth-server']
  const recentRows = (graph?.recentEntries?.length ? graph.recentEntries : logs) || []
  const periodDays = Number(range?.periodDays || graph?.range?.periodDays || 7)
  const alert = graph?.alert

  return (
    <UICard className="home-audit-card">
      <Box className="home-audit-head">
        <span className="home-audit-icon-well" aria-hidden="true">
          {category === 'FO' ? (
            <PhoneAndroidIcon size={22} />
          ) : (
            <UISvgIcon src={icon} size={22} alt="" />
          )}
        </span>
        <UIText variant="b14SemiBold">{title}</UIText>
      </Box>

      {loading ? (
        <WidgetLoader minHeight={280} />
      ) : (
        <>
          <Box className="home-audit-categories">
            <UIText variant="b12Regular" className="home-audit-categories-label">
              {t('Categories', 'Categories:')}
            </UIText>
            <Box className="home-audit-tags">
              {categories.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </Box>
          </Box>

          {alert?.visible && alert.message ? (
            <Box
              className={`home-audit-alert home-audit-alert--${alert.severity || 'info'}`}
              role="status"
            >
              <UIText variant="b12Regular">{alert.message}</UIText>
            </Box>
          ) : null}

          <Box className="home-audit-success-panel">
            <Box className="home-audit-success-copy">
              <UIText variant="b12Bold" className="home-audit-success-label">
                {t('SUCCESS_RATE', 'SUCCESS RATE')}
              </UIText>
              <Box className="home-audit-success-row">
                <UIText variant="h28Bold" className="home-audit-success-value">
                  {`${successRate.toFixed(1)}%`}
                </UIText>
                <span className={isDown ? 'home-audit-delta is-down' : 'home-audit-delta is-up'}>
                  {isDown ? '↓' : '↑'} {Math.abs(priorDelta).toFixed(1)} pts
                </span>
              </Box>
              <UIText variant="b12Regular" className="home-audit-success-sub">
                {t('vs_prior_n_day', 'vs prior {n}-day period').replace('{n}', String(periodDays))}
              </UIText>
            </Box>
            <LoginAuditSparkline values={graph?.sparkline || []} />
          </Box>

          <Box className="home-audit-stats">
            <Box>
              <UIText variant="b11Regular" className="home-muted">
                {t('TOTAL_ATTEMPTS', 'TOTAL ATTEMPTS')}
              </UIText>
              <UIText variant="h18Bold">{graph?.totalAttempts ?? 0}</UIText>
            </Box>
            <Box>
              <UIText variant="b11Regular" className="home-muted">
                {t('SUCCESS', 'SUCCESS')}
              </UIText>
              <UIText variant="h18Bold" className="home-audit-stat-ok">
                {graph?.successCount ?? 0}
              </UIText>
            </Box>
            <Box>
              <UIText variant="b11Regular" className="home-muted">
                {t('FAILED', 'FAILED')}
              </UIText>
              <UIText variant="h18Bold" className="home-audit-stat-fail">
                {graph?.failedCount ?? 0}
              </UIText>
            </Box>
          </Box>

          <Box className="home-audit-toggles">
            {[
              { id: 'trend', label: t('Trend', 'Trend') },
              { id: 'hour', label: t('By_hour', 'By hour') },
              { id: 'table', label: t('Table', 'Table') },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={view === opt.id ? 'is-active' : ''}
                onClick={() => setView(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </Box>

          <Box className="home-audit-tab-body">
            {view === 'hour' ? (
              <LoginAuditByHourView
                hourlySeries={graph?.hourlySeries || []}
                year={graph?.range?.year}
              />
            ) : view === 'table' ? (
              <LoginAuditDailyTableView dailySeries={dailySeries} />
            ) : (
              <LoginAuditTrendView dailySeries={dailySeries} targetRate={97} />
            )}
          </Box>

          <LoginAuditRecentEntries entries={recentRows} />
        </>
      )}
    </UICard>
  )
}

const HOME_LOADING_KEYS = [
  'unique',
  'live',
  'metrics',
  'activity',
  'incidents',
  'topTxn',
  'failures',
  'transfer',
  'onboard',
  'txnMetric',
]

function emptyHomeLoading(ready) {
  return Object.fromEntries(HOME_LOADING_KEYS.map((k) => [k, !ready]))
}

function HomePage() {
  const prefetchedReady = isDashboardPrefetchReady()
  const [tab, setTab] = useState('home')
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(() => emptyHomeLoading(prefetchedReady))
  const [userCards, setUserCards] = useState(
    () => getDashboardPrefetchResult('unique')?.cards || [],
  )
  const [live, setLive] = useState(
    () => getDashboardPrefetchResult('live') || { ok: false, ibPoints: [], mbPoints: [] },
  )
  const [metrics, setMetrics] = useState(
    () =>
      getDashboardPrefetchResult('metrics') || {
        faqs: 0,
        products: 0,
        subProducts: 0,
        offers: 0,
        faqsDelta: '+12%',
        productsDelta: '+100%',
        subProductsDelta: '+15%',
        offersDelta: '+5%',
      },
  )
  const [activity, setActivity] = useState(() => {
    const cached = getDashboardPrefetchResult('activity')?.items
    return cached?.length ? cached : HARDCODED_RECENT_ACTIVITIES
  })
  const [incidents, setIncidents] = useState(
    () =>
      getDashboardPrefetchResult('incidents') || {
        pendingRequest: 0,
        pendingApproval: 0,
        rejected: 0,
      },
  )
  const [txns, setTxns] = useState(() => getDashboardPrefetchResult('topTxn')?.items || [])
  const failuresPrefetch = getDashboardPrefetchResult('failures')
  const [failures, setFailures] = useState(() => failuresPrefetch?.items || [])
  const [failureBars, setFailureBars] = useState(() => failuresPrefetch?.bars || [])
  const [failuresOk, setFailuresOk] = useState(() =>
    failuresPrefetch ? Boolean(failuresPrefetch.ok) : true,
  )
  const [transferRows, setTransferRows] = useState(
    () => getDashboardPrefetchResult('transfer')?.rows || [],
  )
  const onboardPrefetch = getDashboardPrefetchResult('onboard')
  const [onboarding, setOnboarding] = useState(() =>
    onboardPrefetch?.ok ? onboardPrefetch : null,
  )
  const txnPrefetch = getDashboardPrefetchResult('txnMetric')
  const [txnRows, setTxnRows] = useState(() => txnPrefetch?.rows || [])
  const [txnTotal, setTxnTotal] = useState(() => txnPrefetch?.total || 0)
  const [auditRange, setAuditRange] = useState(() => buildLoginAuditRange('last7Days'))

  const markLoaded = useCallback((key) => {
    setLoading((prev) => (prev[key] ? { ...prev, [key]: false } : prev))
  }, [])

  useEffect(() => {
    let cancelled = false

    const applyCached = () => {
      const unique = getDashboardPrefetchResult('unique')
      const liveData = getDashboardPrefetchResult('live')
      const metricsData = getDashboardPrefetchResult('metrics')
      const activityData = getDashboardPrefetchResult('activity')
      const incidentsData = getDashboardPrefetchResult('incidents')
      const topTxn = getDashboardPrefetchResult('topTxn')
      const failuresData = getDashboardPrefetchResult('failures')
      const transfer = getDashboardPrefetchResult('transfer')
      const onboard = getDashboardPrefetchResult('onboard')
      const txnMetric = getDashboardPrefetchResult('txnMetric')

      if (unique) setUserCards(unique.cards || [])
      if (liveData) setLive(liveData)
      if (metricsData) setMetrics(metricsData)
      if (activityData) {
        setActivity(
          activityData.items?.length
            ? activityData.items
            : HARDCODED_RECENT_ACTIVITIES,
        )
      }
      if (incidentsData) setIncidents(incidentsData)
      if (topTxn) setTxns(topTxn.items || [])
      if (failuresData) {
        setFailures(failuresData.items || [])
        setFailureBars(failuresData.bars || [])
        setFailuresOk(Boolean(failuresData.ok))
      }
      if (transfer) setTransferRows(transfer.rows || [])
      if (onboard) setOnboarding(onboard.ok ? onboard : null)
      if (txnMetric) {
        setTxnRows(txnMetric.rows || [])
        setTxnTotal(txnMetric.total || 0)
      }
      setLoading(emptyHomeLoading(true))
    }

    // Login already finished loading — hydrate only, no network.
    if (isDashboardPrefetchReady()) {
      applyCached()
      return undefined
    }

    prefetchDashboardHome({ auditRange })

    const run = async (key, task, apply) => {
      try {
        const cached = getDashboardPrefetchResult(key)
        const data = cached !== undefined ? cached : await task()
        if (!cancelled && data != null) apply(data)
      } catch {
        /* keep prior/empty widget state */
      } finally {
        if (!cancelled) markLoaded(key)
      }
    }

    run('unique', fetchUniqueLogins, (data) => setUserCards(data.cards || []))
    run('live', () => fetchLiveUsers('ALL'), setLive)
    run('metrics', fetchMetricsCounts, setMetrics)
    run('activity', fetchRecentActivity, (data) =>
      setActivity(data.items?.length ? data.items : HARDCODED_RECENT_ACTIVITIES),
    )
    run('incidents', fetchPendingIncidentCounts, setIncidents)
    run('topTxn', () => fetchTopTransactions('ALL'), (data) => setTxns(data.items || []))
    run('failures', () => fetchTopFailures('ALL'), (data) => {
      setFailures(data.items || [])
      setFailureBars(data.bars || [])
      setFailuresOk(Boolean(data.ok))
    })
    run('transfer', fetchTransferViewCount, (data) => setTransferRows(data.rows || []))
    run('onboard', fetchOnboardingCounts, (data) => setOnboarding(data?.ok ? data : null))
    run('txnMetric', fetchTxnMetrics, (data) => {
      setTxnRows(data.rows || [])
      setTxnTotal(data.total || 0)
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-once; login cache is the source of truth
  }, [markLoaded])

  async function handleUserCountRefresh() {
    if (refreshing) return
    setRefreshing(true)
    setLoading((prev) => ({ ...prev, unique: true, live: true }))
    try {
      const [unique, liveUsers] = await Promise.all([
        fetchUniqueLogins(),
        fetchLiveUsers('ALL'),
      ])
      setUserCards(unique.cards || [])
      setLive(liveUsers)
    } finally {
      setLoading((prev) => ({ ...prev, unique: false, live: false }))
      setRefreshing(false)
    }
  }

  const kpiTiles = useMemo(
    () => [
      {
        key: 'faqs',
        label: t('Total_FAQs', 'Total FAQs'),
        value: metrics.faqs,
        delta: metrics.faqsDelta,
        icon: homeMetricIcons.faqs,
      },
      {
        key: 'products',
        label: t('Products', 'Products'),
        value: metrics.products,
        delta: metrics.productsDelta,
        icon: homeMetricIcons.products,
      },
      {
        key: 'subProducts',
        label: t('Sub_Products', 'Sub Products'),
        value: metrics.subProducts,
        delta: metrics.subProductsDelta,
        icon: homeMetricIcons.subProducts,
      },
      {
        key: 'offers',
        label: t('Active_Offers', 'Active Offers'),
        value: metrics.offers,
        delta: metrics.offersDelta,
        icon: homeMetricIcons.offers,
      },
    ],
    [metrics],
  )

  const failureYear = new Date().getFullYear()

  return (
    <Box className="home-page">
      <Box className="home-tabs">
        {[
          { id: 'home', label: t('Home', 'Home') },
          { id: 'ib', label: t('Internet_Banking', 'Internet Banking') },
          { id: 'mb', label: t('Mobile_Banking', 'Mobile Banking') },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? 'is-active' : ''}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </Box>

      {tab !== 'home' ? (
        <UICard className="home-placeholder-tab">
          <UIText variant="b14Regular">
            {t('Channel_dashboard_soon', 'Channel dashboard coming soon.')}
          </UIText>
        </UICard>
      ) : (
        <Box className="home-rows">
          {/* Row1 — User Count + DAU */}
          <Box className="home-row home-row-2 home-row-tall">
            <UICard className="home-panel home-panel-tall">
              <Box className="home-panel-head">
                <UIText variant="h16SemiBold" className="home-panel-title">
                  {t('User_Count', 'User Count')}
                </UIText>
                <button
                  type="button"
                  className={`home-refresh-btn${refreshing ? ' is-active' : ''}`}
                  onClick={handleUserCountRefresh}
                  disabled={refreshing}
                >
                  <AutorenewIcon size={16} />
                  <span>{refreshing ? t('Refreshing', 'Refreshing…') : t('Refresh', 'Refresh')}</span>
                </button>
              </Box>
              {loading.unique ? (
                <WidgetLoader minHeight={180} />
              ) : (
                <Box className="home-user-count-grid">
                  {userCards.length ? (
                    userCards.map((card, i) => {
                      const ChannelIcon = card.channel === 'ib' ? LanguageIcon : PhoneAndroidIcon
                      return (
                        <Box key={i} className={`home-user-card tone-${card.tone}`}>
                          <Box className="home-user-card-top">
                            <span className={`home-user-card-icon tone-${card.tone}`}>
                              <ChannelIcon size={20} />
                            </span>
                            {card.month ? (
                              <span className="home-user-card-month-chip">{card.month}</span>
                            ) : null}
                          </Box>
                          <UIText variant="b12Medium" className="home-user-card-label">
                            {t(card.label, card.label)}
                          </UIText>
                          <Box className="home-user-card-bottom">
                            <UIText variant="h20SemiBold" className="home-user-card-value">
                              {card.value}
                            </UIText>
                            {card.percentage ? (
                              <span
                                className={`home-trend-pill ${card.increased ? 'is-up' : 'is-down'}`}
                              >
                                {card.increased ? (
                                  <NorthEastIcon size={12} />
                                ) : (
                                  <SouthEastIcon size={12} />
                                )}
                                {card.percentage}
                              </span>
                            ) : null}
                          </Box>
                        </Box>
                      )
                    })
                  ) : (
                    <UIText variant="b13Regular" className="home-muted">
                      {t('Unable_to_fetch_data', 'Unable to fetch data.')}
                    </UIText>
                  )}
                </Box>
              )}
            </UICard>

            <UICard className="home-panel home-panel-tall">
              <Box className="home-panel-head">
                <UIText variant="h16SemiBold">{t('Daily_Active_Users', 'Daily Active Users')}</UIText>
                <Box className="home-legend">
                  <span className="dot blue" /> {t('Internet_Banking', 'Internet Banking')}
                  <span className="dot pink" /> {t('Mobile_Banking', 'Mobile Banking')}
                </Box>
              </Box>
              {loading.live ? (
                <WidgetLoader minHeight={180} />
              ) : (
                <DualLineChart
                  ibPoints={live.ibPoints}
                  mbPoints={live.mbPoints}
                  emptyLabel={t('Unable_to_fetch_data', 'Unable to fetch data.')}
                />
              )}
            </UICard>
          </Box>

          <Box className="home-kpi-row">
            {kpiTiles.map((tile) => (
              <MetricTile
                key={tile.key}
                label={tile.label}
                value={tile.value}
                delta={tile.delta}
                icon={tile.icon}
                loading={loading.metrics}
              />
            ))}
          </Box>

          {/* Row2 — Quick Actions + Recent Activity */}
          <Box className="home-row home-row-2">
            <UICard className="home-panel">
              <Box className="home-section-title">
                <TrendingUpIcon size={18} />
                <UIText variant="h16SemiBold">{t('Quick_Actions', 'Quick Actions')}</UIText>
              </Box>
              <Box className="home-quick-list">
                {QUICK_ACTIONS.map((action) => {
                  const meta = QUICK_ACTION_ICONS[action.key]
                  const Icon = meta?.Icon
                  return (
                    <Link key={action.key} to={action.to} className="home-quick-item">
                      <span
                        className="home-quick-icon"
                        style={{ color: meta?.color || '#0D59F2' }}
                      >
                        {Icon ? <Icon size={20} /> : null}
                      </span>
                      <UIText variant="b13Medium">{t(action.label, action.label)}</UIText>
                      <span className="home-quick-arrow">
                        <NorthEastIcon size={14} />
                      </span>
                    </Link>
                  )
                })}
              </Box>
            </UICard>

            <UICard className="home-panel home-activity-card">
              <Box className="home-activity-header">
                <span className="home-activity-header-icon" aria-hidden="true">
                  <HistoryIcon size={24} />
                </span>
                <UIText variant="b14SemiBold" className="home-activity-title">
                  {t('Recent_Activity', 'Recent Activity')}
                </UIText>
              </Box>
              {loading.activity ? (
                <WidgetLoader minHeight={160} />
              ) : (
                <Box className="home-activity-list">
                  {(activity.length ? activity : HARDCODED_RECENT_ACTIVITIES).map(
                    (item, i, list) => {
                      const meta = activityIconFor(item.kind)
                      const Icon = meta.Icon
                      return (
                        <Box key={`${item.title}-${i}`}>
                          <Box className="home-activity-item">
                            <span
                              className="home-activity-icon-well"
                              style={{ background: meta.bg, color: meta.color }}
                            >
                              <Icon size={24} />
                            </span>
                            <Box className="home-activity-copy">
                              <UIText variant="b14SemiBold" className="home-activity-item-title">
                                {item.title}
                              </UIText>
                              {item.timeLabel ? (
                                <UIText variant="b12Regular" className="home-activity-time">
                                  {item.timeLabel}
                                </UIText>
                              ) : null}
                            </Box>
                          </Box>
                          {i < list.length - 1 ? (
                            <span className="home-activity-divider" aria-hidden="true" />
                          ) : null}
                        </Box>
                      )
                    },
                  )}
                </Box>
              )}
            </UICard>
          </Box>

          {/* Row3 — Incidents + Transaction Distribution */}
          <Box className="home-row home-row-2">
            <UICard className="home-panel">
              <UIText variant="h16SemiBold">{t('Customer_Incidents', 'Customer Incidents')}</UIText>
              <UIText variant="b12Regular" className="home-incident-sub">
                {t('Last_24_hours', 'Last 24 hours')}
              </UIText>
              {loading.incidents ? (
                <WidgetLoader minHeight={160} />
              ) : (
                <Box className="home-incident-list">
                  {[
                    {
                      key: 'req',
                      label: t('Pending_Request', 'Pending Request'),
                      value: incidents.pendingRequest,
                      tone: 'green',
                      Icon: CheckIcon,
                    },
                    {
                      key: 'apr',
                      label: t('Pending_Approval', 'Pending Approval'),
                      value: incidents.pendingApproval,
                      tone: 'red',
                      Icon: CloseIcon,
                    },
                    {
                      key: 'rej',
                      label: t('Requests_Rejects', 'Requests Rejects'),
                      value: incidents.rejected,
                      tone: 'blue',
                      Icon: PriorityHighIcon,
                    },
                  ].map((row) => (
                    <Box key={row.key} className={`home-incident-row tone-${row.tone}`}>
                      <Box className="home-incident-left">
                        <span className={`home-incident-icon tone-${row.tone}`}>
                          <span className="home-incident-icon-inner">
                            <row.Icon size={16} />
                          </span>
                        </span>
                        <UIText variant="b13Medium">{row.label}</UIText>
                      </Box>
                      <UIText variant="h18Bold" className={`home-incident-value tone-${row.tone}`}>
                        {row.value}
                      </UIText>
                    </Box>
                  ))}
                </Box>
              )}
            </UICard>

            <UICard className="home-panel">
              <UIText variant="h16SemiBold">
                {t('Transaction_Distribution', 'Transaction Distribution')}
              </UIText>
              {loading.topTxn ? <WidgetLoader minHeight={180} /> : <DonutChart items={txns} />}
            </UICard>
          </Box>

          {/* Row4 — Service Failure + Top Failure Rate */}
          <Box className="home-row home-row-fail">
            <UICard className="home-panel home-fail-chart-panel">
              <Box className="home-panel-head">
                <UIText variant="h16SemiBold">
                  {t('Service_Failure_Latency', 'Service Failure & Latency')}
                </UIText>
                <Box className="home-legend home-fail-legend">
                  <span className="dot green" /> {t('Info', 'Info')}
                  <span className="dot amber" /> {t('Warning', 'Warning')}
                  <span className="dot red" /> {t('Error', 'Error')}
                </Box>
              </Box>
              {loading.failures ? (
                <WidgetLoader minHeight={200} />
              ) : !failuresOk ? (
                <Box className="home-chart-empty">
                  <UIText variant="h16SemiBold">{t('No_Content', 'No Content')}</UIText>
                  <UIText variant="b13Regular" className="home-muted">
                    {t(
                      'Unable_to_load_data_try_again',
                      'Unable to load data. Try again after sometime.',
                    )}
                  </UIText>
                </Box>
              ) : failureBars.length ? (
                <StackedFailureBarChart bars={failureBars} />
              ) : (
                <Box className="home-chart-empty">
                  <UIText variant="b13Regular" className="home-muted">
                    {t('No_data', 'No data')}
                  </UIText>
                </Box>
              )}
            </UICard>

            <UICard className="home-panel home-fail-rate-panel">
              <UIText variant="h16SemiBold">{t('Top_Failure_Rate', 'Top Failure Rate')}</UIText>
              <UIText variant="b12Regular" className="home-muted">
                {t('Based_on_year', 'Based on {year}').replace('{year}', String(failureYear))}
              </UIText>
              {loading.failures ? (
                <WidgetLoader minHeight={160} />
              ) : !failuresOk ? (
                <UIText variant="h16SemiBold" className="home-fail-empty">
                  {t('No_Data_Found', 'No Data Found')}
                </UIText>
              ) : (
                <Box className="home-fail-rate-list">
                  {failures.length ? (
                    failures.map((item, i) => (
                      <Box key={i} className="home-fail-rate-row">
                        <UIText variant="b13Medium" className="home-fail-rate-label">
                          {item.label}
                        </UIText>
                        <span className="home-fail-rate-pill">
                          {item.percentage != null ? item.percentage : item.value}
                        </span>
                      </Box>
                    ))
                  ) : (
                    <UIText variant="h16SemiBold" className="home-fail-empty">
                      {t('No_Data_Found', 'No Data Found')}
                    </UIText>
                  )}
                </Box>
              )}
            </UICard>
          </Box>

          <Box className="home-row home-row-2">
            <UICard className="home-panel">
              <UIText variant="h16SemiBold">
                {t('Within_Account_Transfer', 'Within Account Transfer View')}
              </UIText>
              {loading.transfer ? (
                <WidgetLoader minHeight={140} />
              ) : transferRows.length ? (
                <Box className="home-donut-list">
                  {transferRows.slice(0, 6).map((row, i) => (
                    <Box key={i} className="home-donut-row">
                      <UIText variant="b12Medium">
                        {row.label} ({row.role})
                      </UIText>
                      <UIText variant="b12Bold">
                        ✓{row.success ?? 0} / ✗{row.failure ?? 0}
                      </UIText>
                    </Box>
                  ))}
                </Box>
              ) : (
                <UIText variant="b13Regular" className="home-muted">
                  {t('Unable_to_fetch_data', 'Unable to fetch data.')}
                </UIText>
              )}
            </UICard>
            <UICard className="home-panel">
              <UIText variant="h16SemiBold">{t('Onboarding', 'Onboarding')}</UIText>
              {loading.onboard ? (
                <WidgetLoader minHeight={140} />
              ) : onboarding ? (
                <Box className="home-donut-list">
                  {[
                    [t('Registered', 'Registered'), onboarding.registered],
                    [t('Started', 'Started'), onboarding.started],
                    [t('Broken', 'Broken'), onboarding.broken],
                    [t('Completed', 'Completed'), onboarding.completed],
                  ].map(([label, value]) => (
                    <Box key={label} className="home-donut-row">
                      <UIText variant="b12Medium">{label}</UIText>
                      <UIText variant="b12Bold">{value}</UIText>
                    </Box>
                  ))}
                </Box>
              ) : (
                <UIText variant="b13Regular" className="home-muted">
                  {t('Unable_to_fetch_data', 'Unable to fetch data.')}
                </UIText>
              )}
            </UICard>
          </Box>

          <UICard className="home-panel">
            <Box className="home-panel-head">
              <UIText variant="h16SemiBold">
                {t('Service_Report', 'Service Report')}
              </UIText>
              <UIText variant="b12Medium" className="home-muted">
                {t('Total', 'Total')}: {loading.txnMetric ? '…' : txnTotal}
              </UIText>
            </Box>
            {loading.txnMetric ? (
              <WidgetLoader minHeight={180} />
            ) : (
              <Box className="home-txn-table">
                <UIDataTable
                  columns={[
                    { key: 'serviceType', label: t('Service_Type', 'Service Type') },
                    { key: 'total', label: t('Total', 'Total') },
                    { key: 'success', label: t('Success', 'Success') },
                    { key: 'failure', label: t('Failure', 'Failure') },
                  ]}
                  rows={txnRows}
                  rowKey="serviceType"
                  showSearchBox={false}
                  showTopPagination={false}
                  pageSize={5}
                  emptyLabel={t('No_data', 'No data')}
                />
              </Box>
            )}
          </UICard>

          <Box className="home-audit-section">
            <Box className="home-audit-section-head">
              <UIText as="h2" variant="h20SemiBold">
                {t('Login_audit', 'Login audit')}
              </UIText>
              <LoginAuditDatePicker value={auditRange} onChange={setAuditRange} />
            </Box>
            <Box className="home-row home-row-2">
              <LoginAuditCard
                title={t('Front_office_logins', 'Front office logins')}
                category="FO"
                icon={boSvg.monitor}
                range={auditRange}
              />
              <LoginAuditCard
                title={t('Back_office_logins', 'Back office logins')}
                category="BO"
                icon={boSvg.monitor}
                range={auditRange}
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default HomePage
