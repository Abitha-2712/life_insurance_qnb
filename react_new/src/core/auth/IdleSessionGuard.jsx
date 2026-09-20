import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UIButton from '@/components/ui/UIButton/UIButton'
import UIText from '@/components/ui/UIText/UIText'
import assetPath from '@/core/config/assetPath'
import AuthService from '@/core/auth/AuthService'
import SessionTimeoutConfig from '@/core/auth/sessionTimeoutConfig'
import { apiRequest } from '@/core/api/client'
import { logoutUrls } from '@/core/api/urls/logoutUrls'
import { t } from '@/core/i18n/t'
import routes from '@/app/routes'
import './IdleSessionGuard.css'

/**
 * Flutter IdleSessionManager parity:
 * - Reset idle timer on mouse/key/scroll/click/touch
 * - After idleDuration → non-dismissible Session Timeout dialog
 * - Continue → reset idle timer; Log Out → logout API + clear session
 * - If still idle for bufferDuration after popup → force logout
 */
function IdleSessionGuard({ enabled = true }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const idleTimerRef = useRef(null)
  const bufferTimerRef = useRef(null)
  const openRef = useRef(false)
  const actionTakenRef = useRef(false)
  const loggingOutRef = useRef(false)

  const clearIdle = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = null
    }
  }, [])

  const clearBuffer = useCallback(() => {
    if (bufferTimerRef.current) {
      clearTimeout(bufferTimerRef.current)
      bufferTimerRef.current = null
    }
  }, [])

  const performForceLogout = useCallback(async () => {
    if (actionTakenRef.current || loggingOutRef.current) return
    actionTakenRef.current = true
    loggingOutRef.current = true
    clearBuffer()
    clearIdle()
    try {
      await apiRequest(logoutUrls.logoutUrl, {
        method: 'POST',
        base: 'bo',
        body: {},
      }).catch(() => null)
    } finally {
      AuthService.logout()
      setOpen(false)
      openRef.current = false
      navigate(routes.login, { replace: true })
      loggingOutRef.current = false
    }
  }, [clearBuffer, clearIdle, navigate])

  const showDialog = useCallback(() => {
    if (openRef.current) return
    openRef.current = true
    actionTakenRef.current = false
    setOpen(true)
    clearBuffer()
    bufferTimerRef.current = setTimeout(() => {
      performForceLogout()
    }, SessionTimeoutConfig.bufferDurationMs)
  }, [clearBuffer, performForceLogout])

  const resetIdle = useCallback(() => {
    if (!enabled || openRef.current) return
    clearIdle()
    idleTimerRef.current = setTimeout(() => {
      showDialog()
    }, SessionTimeoutConfig.idleDurationMs)
  }, [clearIdle, enabled, showDialog])

  const handleContinue = useCallback(() => {
    clearBuffer()
    actionTakenRef.current = false
    openRef.current = false
    setOpen(false)
    resetIdle()
  }, [clearBuffer, resetIdle])

  useEffect(() => {
    if (!enabled) {
      clearIdle()
      clearBuffer()
      openRef.current = false
      setOpen(false)
      return undefined
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'click', 'touchstart']
    const onActivity = () => resetIdle()
    for (const ev of events) {
      window.addEventListener(ev, onActivity, { passive: true })
    }
    resetIdle()

    return () => {
      for (const ev of events) {
        window.removeEventListener(ev, onActivity)
      }
      clearIdle()
      clearBuffer()
    }
  }, [enabled, resetIdle, clearIdle, clearBuffer])

  if (!open) return null

  const minutes = SessionTimeoutConfig.idleTimeoutMinutes
  const msg = t(
    'Idle_Session_Expiration_Message',
    'You have been idle for ##. Want to logout?',
  ).replace('##', `${minutes} minutes`)

  return (
    <div className="idle-session-backdrop" role="presentation">
      <div
        className="idle-session-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="idle-session-title"
      >
        <UIText as="h2" id="idle-session-title" variant="h18Bold" className="idle-session-title">
          {t('Idle_Session_Timeout', 'Session Timeout')}
        </UIText>
        <div className="idle-session-body">
          <img
            src={assetPath.image.loggingOut}
            alt=""
            width={50}
            height={50}
          />
          <UIText as="p" variant="b14Regular" className="idle-session-message">
            {msg}
          </UIText>
          <div className="idle-session-actions">
            <UIButton type="button" variant="outline" onClick={handleContinue}>
              {t('Continue', 'Continue')}
            </UIButton>
            <UIButton type="button" variant="primary" onClick={performForceLogout}>
              {t('Log_Out', 'Log Out')}
            </UIButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IdleSessionGuard