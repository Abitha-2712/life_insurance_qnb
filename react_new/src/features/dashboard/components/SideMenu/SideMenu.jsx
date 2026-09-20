import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Box from '@/components/layout/Box/Box'
import UISvgIcon from '@/components/ui/UISvgIcon/UISvgIcon'
import UIText from '@/components/ui/UIText/UIText'
import AuthService from '@/core/auth/AuthService'
import { t } from '@/core/i18n/t'
import { groupProductsByCategory } from '@/features/dashboard/menu/menuCategories'
import assetPath from '@/core/config/assetPath'
import {
  boSvg,
  resolveProductIcon,
  resolveSubProductIcon,
} from '@/features/dashboard/menu/menuIconMaps'
import {
  findBestMatch,
  loadRecentSearches,
  saveRecentSearch,
  searchSuggestions,
} from '@/features/dashboard/menu/menuSearch'
import routes from '@/app/routes'
import LogoutConfirmDialog from '@/features/dashboard/components/LogoutConfirmDialog/LogoutConfirmDialog'
import './SideMenu.css'

function pathActive(pathname, target) {
  if (!target) return false
  if (target === '/dashboard') return pathname === '/dashboard' || pathname === '/dashboard/'
  return pathname === target || pathname.startsWith(`${target}/`)
}

function initialsFromUser(user = {}) {
  const raw = user.userName || user.userId || user.firstName || 'U'
  const parts = String(raw).trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return String(raw).slice(0, 2).toUpperCase()
}

function MenuIcon({ src, size = 20, active = false }) {
  return (
    <UISvgIcon
      src={src}
      size={size}
      alt=""
      className={['side-menu-icon', active ? 'is-active' : ''].filter(Boolean).join(' ')}
    />
  )
}

function SideMenu({
  products = [],
  collapsed = false,
  loading = false,
  error = '',
  onCollapse,
  onMenuPressed,
  onLogout,
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = AuthService.getUser()
  const [manualOpen, setManualOpen] = useState(() => new Set())
  const [manualClosed, setManualClosed] = useState(() => new Set())
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState(() => loadRecentSearches())
  const [logoutOpen, setLogoutOpen] = useState(false)
  const searchInputRef = useRef(null)

  const sections = useMemo(() => groupProductsByCategory(products), [products])

  const suggestions = useMemo(
    () => searchSuggestions(products, searchQuery, recentSearches),
    [products, searchQuery, recentSearches],
  )

  useEffect(() => {
    if (collapsed) {
      setIsSearchVisible(false)
    }
  }, [collapsed])

  useEffect(() => {
    if (isSearchVisible && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchVisible])

  const activeTrail = useMemo(() => {
    for (const product of products) {
      if (String(product.productCode).toLowerCase() === 'dashboard') {
        if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
          return { productCode: product.productCode }
        }
      }
      for (const sub of product.subProducts || []) {
        if (pathActive(location.pathname, sub.subProductUrl)) {
          return { productCode: product.productCode, subCode: sub.subProductCode }
        }
        for (const child of sub.childMenus || []) {
          if (pathActive(location.pathname, child.childMenuUrl)) {
            return {
              productCode: product.productCode,
              subCode: sub.subProductCode,
              childCode: child.childMenuCode,
            }
          }
        }
      }
    }
    return null
  }, [location.pathname, products])

  function isOpen(code) {
    if (manualClosed.has(code)) return false
    if (manualOpen.has(code)) return true
    if (activeTrail?.productCode === code) return true
    if (activeTrail && `${activeTrail.productCode}:${activeTrail.subCode}` === code) return true
    return false
  }

  function toggle(code) {
    const currentlyOpen = isOpen(code)
    setManualOpen((prev) => {
      const next = new Set(prev)
      if (currentlyOpen) next.delete(code)
      else next.add(code)
      return next
    })
    setManualClosed((prev) => {
      const next = new Set(prev)
      if (currentlyOpen) next.add(code)
      else next.delete(code)
      return next
    })
  }

  function expandProduct(productCode) {
    if (!productCode) return
    setManualOpen((prev) => {
      const next = new Set(prev)
      next.add(productCode)
      return next
    })
    setManualClosed((prev) => {
      const next = new Set(prev)
      next.delete(productCode)
      return next
    })
  }

  function expandSub(productCode, subCode) {
    expandProduct(productCode)
    if (!subCode) return
    const subKey = `${productCode}:${subCode}`
    setManualOpen((prev) => {
      const next = new Set(prev)
      next.add(subKey)
      return next
    })
    setManualClosed((prev) => {
      const next = new Set(prev)
      next.delete(subKey)
      return next
    })
  }

  function navigateAndMaybeCollapse(to) {
    if (to) navigate(to)
    onMenuPressed?.()
  }

  function onNavLinkClick() {
    onMenuPressed?.()
  }

  function performSearch(rawQuery) {
    const query = String(rawQuery || '').trim()
    if (!query) return

    const match = findBestMatch(products, query)
    if (!match) return

    const label = match.titles?.matched || query
    setRecentSearches(saveRecentSearch(label))

    if (match.type === 'child' && match.sub?.subProductCode) {
      expandSub(match.productCode, match.sub.subProductCode)
    } else {
      expandProduct(match.productCode)
    }

    const url = match.url || '/dashboard'
    navigate(url)
    setIsSearchVisible(false)
    onMenuPressed?.()
  }

  function openLogoutDialog() {
    setLogoutOpen(true)
  }

  function confirmLogout() {
    setLogoutOpen(false)
    if (onLogout) onLogout()
    else {
      AuthService.logout()
      navigate(routes.login, { replace: true })
    }
  }

  function toggleSearch() {
    setIsSearchVisible((v) => !v)
  }

  function closeSearch() {
    setIsSearchVisible(false)
  }

  return (
    <aside className={['side-menu', collapsed ? 'is-collapsed' : ''].filter(Boolean).join(' ')}>
      <Box className="side-menu-brand">
        <img
          src={assetPath.svg.dukhanLogoMark}
          alt=""
          className="side-menu-logo"
        />
        {!collapsed ? (
          <UIText as="span" variant="b14SemiBold" className="side-menu-brand-text">
            {t('Back_Office', 'Back Office')}
          </UIText>
        ) : null}
        {!collapsed ? (
          <button
            type="button"
            className="side-menu-search"
            aria-label={t('Search', 'Search')}
            aria-expanded={isSearchVisible}
            onClick={toggleSearch}
          >
            <svg className="side-menu-search-glyph" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </Box>

      {!collapsed && isSearchVisible ? (
        <Box className="side-menu-search-panel">
          <Box className="side-menu-search-row">
            <input
              ref={searchInputRef}
              type="search"
              className="side-menu-search-input"
              placeholder={t('Search_menu_or_sub_menu', 'Search menu or sub-menu')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const top = suggestions[0]
                  performSearch(top?.text || searchQuery)
                } else if (e.key === 'Escape') {
                  closeSearch()
                }
              }}
            />
            <button
              type="button"
              className="side-menu-search-close"
              aria-label={t('Close', 'Close')}
              onClick={closeSearch}
            >
              ×
            </button>
          </Box>
          {suggestions.length ? (
            <ul className="side-menu-search-suggestions">
              {suggestions.map((item) => (
                <li key={`${item.type}:${item.productCode}:${item.text}`}>
                  <button
                    type="button"
                    className="side-menu-search-suggestion"
                    onClick={() => performSearch(item.text)}
                  >
                    <span className="side-menu-search-suggestion-text">{item.text}</span>
                    {item.fromRecent ? (
                      <span className="side-menu-search-suggestion-meta">
                        {t('Recent', 'Recent')}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : searchQuery.trim() ? (
            <UIText variant="b12Regular" className="side-menu-search-empty">
              {t('No_matches', 'No matches')}
            </UIText>
          ) : null}
        </Box>
      ) : null}

      <nav className="side-menu-nav" aria-label={t('Dashboard', 'Dashboard')}>
        {loading ? (
          <UIText variant="b12Regular" className="side-menu-status">
            {t('Loading', 'Loading…')}
          </UIText>
        ) : null}
        {!loading && error ? (
          <UIText variant="b12Regular" className="side-menu-status">
            {error}
          </UIText>
        ) : null}
        {!loading && !error && !products.length ? (
          <UIText variant="b12Regular" className="side-menu-status">
            {t('No_menu_items', 'No menu items')}
          </UIText>
        ) : null}

        {sections.map((section) => (
          <Box key={section.key || 'root'} className="side-menu-section">
            {section.label && !collapsed ? (
              <UIText as="p" variant="b11Medium" className="side-menu-section-label">
                {section.label}
              </UIText>
            ) : null}

            {section.products.map((product) => {
              const isDashboard = String(product.productCode).toLowerCase() === 'dashboard'
              const open = isOpen(product.productCode)
              const productActive = isDashboard
                ? location.pathname === '/dashboard' || location.pathname === '/dashboard/'
                : activeTrail?.productCode === product.productCode
              const productIcon =
                product.iconSvg ||
                resolveProductIcon(product.productCode, product.productDesc)

              if (isDashboard) {
                return (
                  <button
                    key={product.productCode}
                    type="button"
                    className={[
                      'side-menu-product',
                      'is-leaf',
                      productActive ? 'is-active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => navigateAndMaybeCollapse(routes.dashboard)}
                  >
                    <MenuIcon src={productIcon} size={20} active={productActive} />
                    {!collapsed ? (
                      <UIText as="span" variant="b14Medium" className="side-menu-label">
                        {t(product.productDesc, product.productDesc)}
                      </UIText>
                    ) : null}
                  </button>
                )
              }

              const hasSubs = (product.subProducts || []).length > 0

              return (
                <Box className="side-menu-group" key={product.productCode}>
                  <button
                    type="button"
                    className={[
                      'side-menu-product',
                      open ? 'is-open' : '',
                      productActive ? 'is-active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      if (hasSubs) toggle(product.productCode)
                    }}
                  >
                    <MenuIcon src={productIcon} size={20} active={productActive} />
                    {!collapsed ? (
                      <>
                        <UIText as="span" variant="b14Medium" className="side-menu-label">
                          {t(product.productDesc, product.productDesc)}
                        </UIText>
                        {hasSubs ? (
                          <UISvgIcon
                            src={open ? boSvg.chevronDown : boSvg.chevronRight}
                            size={14}
                            alt=""
                            className="side-menu-chevron-icon"
                          />
                        ) : null}
                      </>
                    ) : null}
                  </button>

                  {open && !collapsed && hasSubs ? (
                    <Box className="side-menu-subs">
                      {(product.subProducts || []).map((sub) => {
                        const hasChildren = (sub.childMenus || []).length > 0
                        const subKey = `${product.productCode}:${sub.subProductCode}`
                        const subOpen = isOpen(subKey)
                        const subActive = pathActive(location.pathname, sub.subProductUrl)
                        const subIcon =
                          sub.iconSvg ||
                          resolveSubProductIcon(sub.subProductCode, sub.subProductDesc)

                        if (hasChildren) {
                          return (
                            <Box key={sub.subProductCode}>
                              <button
                                type="button"
                                className={[
                                  'side-menu-sub',
                                  subActive ? 'is-active' : '',
                                ]
                                  .filter(Boolean)
                                  .join(' ')}
                                onClick={() => toggle(subKey)}
                              >
                                <MenuIcon src={subIcon} size={18} active={subActive} />
                                <UIText as="span" variant="b13Medium" className="side-menu-label">
                                  {t(sub.subProductDesc, sub.subProductDesc)}
                                </UIText>
                                <UISvgIcon
                                  src={subOpen ? boSvg.chevronDown : boSvg.chevronRight}
                                  size={12}
                                  alt=""
                                  className="side-menu-chevron-icon"
                                />
                              </button>
                              {subOpen ? (
                                <Box className="side-menu-children">
                                  {sub.childMenus.map((child) => (
                                    <NavLink
                                      key={child.childMenuCode}
                                      to={child.childMenuUrl}
                                      onClick={onNavLinkClick}
                                      className={({ isActive }) =>
                                        ['side-menu-child', isActive ? 'is-active' : '']
                                          .filter(Boolean)
                                          .join(' ')
                                      }
                                    >
                                      <MenuIcon src={boSvg.helpCircle} size={16} />
                                      <UIText as="span" variant="b12Regular">
                                        {t(child.childMenuDesc, child.childMenuDesc)}
                                      </UIText>
                                    </NavLink>
                                  ))}
                                </Box>
                              ) : null}
                            </Box>
                          )
                        }

                        return (
                          <NavLink
                            key={sub.subProductCode}
                            to={sub.subProductUrl}
                            end={sub.subProductUrl === '/dashboard'}
                            onClick={onNavLinkClick}
                            className={({ isActive }) =>
                              ['side-menu-sub', isActive ? 'is-active' : '']
                                .filter(Boolean)
                                .join(' ')
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <MenuIcon src={subIcon} size={18} active={isActive} />
                                <UIText as="span" variant="b13Medium" className="side-menu-label">
                                  {t(sub.subProductDesc, sub.subProductDesc)}
                                </UIText>
                              </>
                            )}
                          </NavLink>
                        )
                      })}
                    </Box>
                  ) : null}
                </Box>
              )
            })}
          </Box>
        ))}
      </nav>

      <Box className="side-menu-footer">
        {!collapsed ? (
          <Box className="side-menu-user">
            <span className="side-menu-avatar">{initialsFromUser(user)}</span>
            <Box className="side-menu-user-text">
              <UIText as="span" variant="b13Medium" className="side-menu-user-id">
                {user.userId || user.userName || '—'}
              </UIText>
              <UIText as="span" variant="b11Regular" className="side-menu-user-name">
                {user.userName || user.firstName || ''}
              </UIText>
            </Box>
            <button
              type="button"
              className="side-menu-logout"
              aria-label={t('Log_Out', 'Log Out')}
              onClick={openLogoutDialog}
            >
              <MenuIcon src={boSvg.logOut} size={18} />
            </button>
          </Box>
        ) : (
          <button
            type="button"
            className="side-menu-logout"
            aria-label={t('Log_Out', 'Log Out')}
            onClick={openLogoutDialog}
          >
            <MenuIcon src={boSvg.logOut} size={18} />
          </button>
        )}

        <button type="button" className="side-menu-collapse" onClick={() => onCollapse?.()}>
          <MenuIcon src={collapsed ? boSvg.chevronRight : boSvg.chevronLeft} size={16} />
          {!collapsed ? (
            <UIText as="span" variant="b12Medium" className="side-menu-collapse-label">
              {t('Collapse', 'Collapse')}
            </UIText>
          ) : null}
        </button>
      </Box>
      <LogoutConfirmDialog
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
      />
    </aside>
  )
}

export default SideMenu
