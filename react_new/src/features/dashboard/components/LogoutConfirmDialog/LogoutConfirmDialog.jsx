import { createPortal } from 'react-dom'
import Box from '@/components/layout/Box/Box'
import { UIButton, UICard, UIText } from '@/components/ui'
import assetPath from '@/core/config/assetPath'
import { t } from '@/core/i18n/t'
import './LogoutConfirmDialog.css'

/**
 * Flutter logout confirmation — portaled to document.body so sidebar
 * overflow:hidden never clips it, and DevTools-narrow viewports stay correct.
 */
function LogoutConfirmDialog({ open = false, onCancel, onConfirm }) {
  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="bo-logout-backdrop"
      role="presentation"
      onClick={() => onCancel?.()}
    >
      <UICard
        className="bo-logout-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bo-logout-title"
        onClick={(e) => e.stopPropagation()}
      >
        <UIText as="h2" id="bo-logout-title" variant="h24SemiBold">
          {t('Log_Out?', 'Log Out?')}
        </UIText>
        <img
          src={assetPath.image.loggingOut}
          alt=""
          className="bo-logout-img"
        />
        <UIText variant="b16Regular">
          {t('Are_You_sure_want_logout', 'Are you sure you want to logout?')}
        </UIText>
        <Box className="bo-logout-actions">
          <UIButton variant="outline" type="button" onClick={() => onCancel?.()}>
            {t('Cancel', 'Cancel')}
          </UIButton>
          <UIButton variant="primary" type="button" onClick={() => onConfirm?.()}>
            {t('Log_Out', 'Log Out')}
          </UIButton>
        </Box>
      </UICard>
    </div>,
    document.body,
  )
}

export default LogoutConfirmDialog