import UIText from '@/components/ui/UIText/UIText'
import './UIInput.css'

function UIInput({
  label,
  className = '',
  type = 'text',
  error,
  leftAdornment,
  rightAdornment,
  inputClassName = '',
  readOnly = false,
  disabled = false,
  required = false,
  showRequiredStar = false,
  helperText,
  ...props
}) {
  const wrapClass = [
    'ui-input-control-wrap',
    leftAdornment ? 'has-left' : '',
    rightAdornment ? 'has-right' : '',
    error ? 'has-error' : '',
    readOnly ? 'is-readonly' : '',
    disabled ? 'is-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <label
      className={['ui-input-field', className, disabled ? 'is-disabled' : '']
        .filter(Boolean)
        .join(' ')}
    >
      {label ? (
        <UIText as="span" variant="b14Medium" className="ui-input-label">
          {label}
          {required || showRequiredStar ? <span className="ui-input-required">*</span> : null}
        </UIText>
      ) : null}
      <span className={wrapClass}>
        {leftAdornment ? (
          <span className="ui-input-adornment ui-input-adornment-left">{leftAdornment}</span>
        ) : null}
        <input
          className={['ui-input-control', inputClassName].filter(Boolean).join(' ')}
          type={type}
          readOnly={readOnly}
          disabled={disabled}
          required={required}
          {...props}
        />
        {rightAdornment ? (
          <span className="ui-input-adornment ui-input-adornment-right">{rightAdornment}</span>
        ) : null}
      </span>
      {error ? (
        <UIText as="span" variant="b12Regular" className="ui-input-error">
          {error}
        </UIText>
      ) : null}
      {helperText ? (
        <div className="ui-input-helper">
          <svg
            className="ui-input-helper-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>{helperText}</span>
        </div>
      ) : null}
    </label>
  )
}

export default UIInput
