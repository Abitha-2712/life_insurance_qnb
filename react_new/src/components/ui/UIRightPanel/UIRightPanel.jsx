import { useEffect } from 'react'
import UIText from '@/components/ui/UIText/UIText'
import './UIRightPanel.css'

/**
 * Flutter `showRightPanel` — centered rounded popup (not a docked drawer).
 * @param {{ open?: boolean, title?: string, onClose?: () => void, children?: import('react').ReactNode, width?: number, className?: string }} props
 */
function UIRightPanel({
  open = false,
  title,
  onClose,
  children,
  width = 520,
  className = '',
}) {
  useEffect(() => {
    if (!open) return undefined
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className={['ui-right-panel-backdrop', className].filter(Boolean).join(' ')}
      onClick={() => onClose?.()}
      role="presentation"
    >
      <aside
        className="ui-right-panel"
        style={{ width: `min(${width}px, calc(100vw - 48px))` }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Panel'}
      >
        {title ? (
          <div className="ui-right-panel-head">
            <UIText as="h3" variant="h20SemiBold" className="ui-right-panel-title">
              {title}
            </UIText>
            <button
              type="button"
              className="ui-right-panel-close"
              onClick={() => onClose?.()}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        ) : null}
        <div className="ui-right-panel-body">{children}</div>
      </aside>
    </div>
  )
}

export default UIRightPanel
