import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Box from '@/components/layout/Box/Box'
import AuthService from '@/core/auth/AuthService'
import IdleSessionGuard from '@/core/auth/IdleSessionGuard'
import { t } from '@/core/i18n/t'
import routes from '@/app/routes'
import BoAppBar from '@/features/dashboard/components/BoAppBar/BoAppBar'
import SideMenu from '@/features/dashboard/components/SideMenu/SideMenu'
import { fetchAccessControlMenu, getPrefetchedMenu, isMenuPrefetchReady, prefetchAccessControlMenu } from '@/features/dashboard/services/menuService'
import './DashboardShell.css'

function resolveBreadcrumbs(pathname, products = []) {
  for (const product of products) {
    if (
      String(product.productCode).toLowerCase() === 'dashboard' &&
      (pathname === '/dashboard' || pathname === '/dashboard/')
    ) {
      return [t('Dashboard', 'Dashboard')]
    }
    for (const sub of product.subProducts || []) {
      if (pathname === sub.subProductUrl || pathname.startsWith(`${sub.subProductUrl}/`)) {
        const crumbs = [
          t(product.productDesc, product.productDesc),
          t(sub.subProductDesc, sub.subProductDesc),
        ]
        for (const child of sub.childMenus || []) {
          if (pathname === child.childMenuUrl) {
            crumbs.push(t(child.childMenuDesc, child.childMenuDesc))
            return crumbs
          }
        }
        return crumbs
      }
      for (const child of sub.childMenus || []) {
        if (pathname === child.childMenuUrl) {
          return [
            t(product.productDesc, product.productDesc),
            t(sub.subProductDesc, sub.subProductDesc),
            t(child.childMenuDesc, child.childMenuDesc),
          ]
        }
      }
    }
  }
  if (pathname.startsWith('/dashboard/city')) {
    return [t('Masters', 'Masters'), t('City', 'City')]
  }
  if (pathname.startsWith('/dashboard/') && pathname !== '/dashboard') {
    const leaf = pathname.split('/').filter(Boolean).pop()
    return [t('Dashboard', 'Dashboard'), leaf]
  }
  return [t('Dashboard', 'Dashboard')]
}

function DashboardShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  /** User override — auto-collapse must not fight a manual expand forever. */
  const userCollapsedRef = useRef(null)
  /** Flutter tablet/web breakpoint — also covers docked DevTools shrinking the viewport. */
  const AUTO_COLLAPSE_WIDTH = 1200
  const [products, setProducts] = useState(() => getPrefetchedMenu() || [])
  const [menuLoading, setMenuLoading] = useState(() => !isMenuPrefetchReady())
  const [menuError, setMenuError] = useState('')
  const [fontScale, setFontScale] = useState(100)
  const [customizerOpen, setCustomizerOpen] = useState(false)

  const loadMenu = useCallback(async (force = false) => {
    if (!force && isMenuPrefetchReady()) {
      const cached = getPrefetchedMenu()
      if (cached?.length) {
        setProducts(cached)
        setMenuLoading(false)
        setMenuError('')
        return
      }
    }
    setMenuLoading(true)
    setMenuError('')
    try {
      // force → fresh network call; otherwise reuse / start login prefetch
      const list = force
        ? await fetchAccessControlMenu()
        : await prefetchAccessControlMenu()
      setProducts(list)
      setMenuError('')
    } catch (err) {
      setProducts([])
      setMenuError(err?.message || t('Menu_load_failed', 'Failed to load menu'))
    } finally {
      setMenuLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMenu(false)
  }, [loadMenu])

  /* Flutter compact mode when width is tight (DevTools docked, small window). */
  useEffect(() => {
    function applyWidth() {
      const narrow = window.innerWidth < AUTO_COLLAPSE_WIDTH
      if (!narrow) {
        userCollapsedRef.current = null
        setCollapsed(false)
        return
      }
      if (userCollapsedRef.current != null) {
        setCollapsed(userCollapsedRef.current)
        return
      }
      setCollapsed(true)
    }
    applyWidth()
    window.addEventListener('resize', applyWidth)
    return () => window.removeEventListener('resize', applyWidth)
  }, [])

  function setCollapsedByUser(next) {
    const value = typeof next === 'function' ? next(collapsed) : next
    userCollapsedRef.current = value
    setCollapsed(value)
  }

  /** Flutter onMenuPressed — collapse rail after nav when viewport is narrow. */
  function handleMenuPressed() {
    if (window.innerWidth >= AUTO_COLLAPSE_WIDTH) return
    userCollapsedRef.current = true
    setCollapsed(true)
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--qnb-app-font-scale', `${fontScale / 100}`)
  }, [fontScale])

  const breadcrumbs = useMemo(
    () => resolveBreadcrumbs(location.pathname, products),
    [location.pathname, products],
  )
  const title = breadcrumbs[breadcrumbs.length - 1] || t('Dashboard', 'Dashboard')

  function handleLogout() {
    AuthService.logout()
    navigate(routes.login, { replace: true })
  }

  return (
    <Box className="dashboard-shell">
      <IdleSessionGuard enabled />
      <Box className="dashboard-shell-body">
        <SideMenu
          products={products}
          collapsed={collapsed}
          loading={menuLoading}
          error={menuError}
          onCollapse={() => setCollapsedByUser((v) => !v)}
          onMenuPressed={handleMenuPressed}
          onLogout={handleLogout}
        />
        <Box className="dashboard-shell-main">
          <BoAppBar
            title={title}
            breadcrumbs={breadcrumbs}
            onMenuToggle={() => setCollapsedByUser((v) => !v)}
            fontScale={fontScale}
            onFontScaleChange={setFontScale}
            onRefresh={() => loadMenu(true)}
            customizerOpen={customizerOpen}
            onCustomizerToggle={() => setCustomizerOpen((v) => !v)}
            onLogout={handleLogout}
          />
          <Box className="dashboard-shell-content">
            <Outlet context={{ products, reloadMenu: loadMenu }} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardShell
