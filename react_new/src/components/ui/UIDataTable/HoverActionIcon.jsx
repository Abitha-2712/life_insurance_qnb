import './HoverActionIcon.css'

/** Flutter HoverActionIcon — size 18, hover #10B981 @ 15% circle */
function HoverActionIcon({ children, onClick, tooltip, color, danger = false }) {
  return (
    <button
      type="button"
      className={`ui-hover-action${danger ? ' is-danger' : ''}`}
      onClick={onClick}
      title={tooltip || undefined}
      aria-label={tooltip || undefined}
      style={color ? { color } : undefined}
    >
      {children}
    </button>
  )
}

/** Icons.remove_red_eye_outlined */
export function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 6.5C7 6.5 2.73 9.61 1 14c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="12" cy="14" r="3.25" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  )
}

/** Icons.mode_edit_outline_outlined */
export function IconEdit() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.06 5.4l2.54 2.54M4 20.01v-2.99l10.06-10.06a1.5 1.5 0 0 1 2.12 0l.87.87a1.5 1.5 0 0 1 0 2.12L6.99 20.01H4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

/** Icons.delete_outline */
export function IconDelete() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 7h12M10 11v6M14 11v6M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export default HoverActionIcon
