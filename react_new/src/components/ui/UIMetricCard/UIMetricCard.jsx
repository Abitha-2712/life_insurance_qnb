import './UIMetricCard.css'

/**
 * Flutter `UiMetricCard` — title + large count + corner icon.
 */
function UIMetricCard({
  title,
  subtitle = '0',
  icon = null,
  backgroundColor = '#F1F6FF',
  numberColor = '#2563EB',
  iconColor = '#2563EB',
  iconBackgroundColor,
  borderColor = '#D6E7FF',
  onClick,
  className = '',
  selected = false,
}) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={['ui-metric-card', selected ? 'is-selected' : '', className]
        .filter(Boolean)
        .join(' ')}
      style={{
        backgroundColor,
        borderColor,
        color: numberColor,
      }}
      onClick={onClick}
    >
      <span className="ui-metric-card-title">{title}</span>
      <span className="ui-metric-card-value" style={{ color: numberColor }}>
        {subtitle}
      </span>
      {icon ? (
        <span
          className="ui-metric-card-icon"
          style={{
            color: iconColor,
            backgroundColor: iconBackgroundColor || 'transparent',
          }}
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
    </Tag>
  )
}

/**
 * Flutter `UiMetricCardRow` — equal-width metric cards.
 */
export function UIMetricCardRow({ cards = [], className = '' }) {
  return (
    <div className={['ui-metric-card-row', className].filter(Boolean).join(' ')}>
      {cards.map((card) => (
        <UIMetricCard key={card.key || card.title} {...card} />
      ))}
    </div>
  )
}

export default UIMetricCard
