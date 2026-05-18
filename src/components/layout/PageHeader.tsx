import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 px-6 py-4 border-b border-ink-border bg-white', className)}>
      <div>
        <h1 className="text-title-1 text-ink">{title}</h1>
        {description && (
          <p className="mt-0.5 text-body-2 text-ink-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}

// Metrics strip abaixo do header
interface MetricItem {
  label: string
  value: string | number
  change?: { value: number; label: string }
  highlight?: boolean
}

interface MetricsStripProps {
  metrics: MetricItem[]
}

export function MetricsStrip({ metrics }: MetricsStripProps) {
  return (
    <div className="flex items-center gap-0 border-b border-ink-border bg-white">
      {metrics.map((m, i) => (
        <div
          key={i}
          className={cn(
            'flex-1 px-6 py-3 border-r border-ink-border last:border-r-0',
            m.highlight && 'bg-brand-50',
          )}
        >
          <p className="text-caption text-ink-muted">{m.label}</p>
          <p className={cn('text-title-2 text-ink tabular-nums', m.highlight && 'text-brand-700')}>
            {m.value}
          </p>
          {m.change && (
            <p className={cn(
              'text-caption',
              m.change.value >= 0 ? 'text-brand-600' : 'text-red-500',
            )}>
              {m.change.value >= 0 ? '↑' : '↓'} {Math.abs(m.change.value)}% {m.change.label}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
