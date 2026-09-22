import './UISwitch.css'

function UISwitch({
  checked = false,
  onChange,
  label,
  disabled = false,
  labelPosition = 'right',
}) {
  return (
    <label className={['ui-switch', disabled ? 'is-disabled' : ''].filter(Boolean).join(' ')}>
      {label && labelPosition === 'left' ? <span className="ui-switch-label">{label}</span> : null}
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="ui-switch-track" />
      {label && labelPosition === 'right' ? <span className="ui-switch-label">{label}</span> : null}
    </label>
  )
}

export default UISwitch
