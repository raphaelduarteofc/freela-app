import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  OS_STATUS_LABEL,
  OS_STATUS_COLOR,
  OS_STATUS_DOT,
  CERT_LEVEL_LABEL,
  CERT_LEVEL_COLOR,
  SERVICE_TYPE_LABEL,
} from '@/lib/utils'
import type { OSStatus, CertLevel, ServiceType } from '@/types'

// --- Status Badge ---

interface StatusBadgeProps {
  status: OSStatus
  showDot?: boolean
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, showDot = true, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'status-badge',
        OS_STATUS_COLOR[status],
        size === 'sm' && 'text-caption px-1.5 py-0.5',
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', OS_STATUS_DOT[status])} />
      )}
      {OS_STATUS_LABEL[status]}
    </span>
  )
}

// --- Cert Badge ---

interface CertBadgeProps {
  level: CertLevel
  size?: 'sm' | 'md'
}

export function CertBadge({ level, size = 'md' }: CertBadgeProps) {
  const icons: Record<CertLevel, string> = {
    bronze: '🥉',
    prata:  '🥈',
    ouro:   '🥇',
    diamante: '💎',
  }

  return (
    <span
      className={cn(
        'status-badge',
        CERT_LEVEL_COLOR[level],
        size === 'sm' && 'text-caption px-1.5 py-0.5',
      )}
    >
      <span>{icons[level]}</span>
      {CERT_LEVEL_LABEL[level]}
    </span>
  )
}

// --- Service Type Badge ---

interface ServiceTypeBadgeProps {
  type: ServiceType
}

export function ServiceTypeBadge({ type }: ServiceTypeBadgeProps) {
  return (
    <span className="status-badge text-ink-soft bg-slate-100">
      {SERVICE_TYPE_LABEL[type]}
    </span>
  )
}

// --- Generic Badge ---

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
}

const badgeVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:   'text-ink-soft bg-slate-100',
  secondary: 'text-ink-muted bg-ink-surface border border-ink-border',
  success:   'text-brand-700 bg-brand-50',
  warning:   'text-amber-700 bg-amber-50',
  danger:    'text-red-700 bg-red-50',
  info:      'text-blue-700 bg-blue-50',
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn('status-badge', badgeVariants[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}
