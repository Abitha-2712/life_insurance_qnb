import './UITextArea.css'

function UITextArea({
  label,
  value = '',
  onChange,
  error,
  required = false,
  readOnly = false,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <label className={['ui-textarea-field', className].filter(Boolean).join(' ')}>
      {label ? (
        <span className="ui-textarea-label">
          {label}
          {required ? ' *' : ''}
        </span>
      ) : null}
      <textarea
        className={['ui-textarea', error ? 'is-error' : ''].filter(Boolean).join(' ')}
        value={value}
        rows={rows}
        readOnly={readOnly}
        disabled={disabled}
        onChange={onChange}
        {...props}
      />
      {error ? <span className="ui-textarea-error">{error}</span> : null}
    </label>
  )
}

export default UITextArea
