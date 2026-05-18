import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { OSStatus, CertLevel, ServiceType } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Formatação ---

function toDate(date: string | Date): Date {
  return typeof date === 'string' ? new Date(date) : date
}

export function formatDate(date: string | Date, pattern = 'dd/MM/yyyy') {
  const d = toDate(date)
  if (pattern === 'dd/MM/yyyy') {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(d)
  }
  // dd/MM/yyyy 'às' HH:mm
  if (pattern === "dd/MM/yyyy 'às' HH:mm") {
    const datePart = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(d)
    const timePart = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(d)
    return `${datePart} às ${timePart}`
  }
  // fallback
  return new Intl.DateTimeFormat('pt-BR').format(d)
}

export function formatDateTime(date: string | Date) {
  return formatDate(date, "dd/MM/yyyy 'às' HH:mm")
}

export function formatRelative(date: string | Date) {
  const d = toDate(date)
  const now = Date.now()
  const diffMs = now - d.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

  if (diffSec < 60)   return rtf.format(-diffSec,  'second')
  if (diffMin < 60)   return rtf.format(-diffMin,  'minute')
  if (diffHour < 24)  return rtf.format(-diffHour, 'hour')
  if (diffDay < 30)   return rtf.format(-diffDay,  'day')
  if (diffMonth < 12) return rtf.format(-diffMonth,'month')
  return rtf.format(-diffYear, 'year')
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatPercent(value: number, decimals = 1) {
  return `${(value * 100).toFixed(decimals)}%`
}

// --- OS Status ---

export const OS_STATUS_LABEL: Record<OSStatus, string> = {
  draft:       'Rascunho',
  open:        'Aberta',
  distributed: 'Distribuída',
  accepted:    'Aceita',
  in_progress: 'Em Execução',
  completed:   'Concluída',
  cancelled:   'Cancelada',
  disputed:    'Em Disputa',
}

export const OS_STATUS_COLOR: Record<OSStatus, string> = {
  draft:       'text-ink-muted    bg-slate-100',
  open:        'text-blue-700     bg-blue-50',
  distributed: 'text-purple-700   bg-purple-50',
  accepted:    'text-amber-700    bg-amber-50',
  in_progress: 'text-sky-700      bg-sky-50',
  completed:   'text-brand-700    bg-brand-50',
  cancelled:   'text-red-700      bg-red-50',
  disputed:    'text-orange-700   bg-orange-50',
}

export const OS_STATUS_DOT: Record<OSStatus, string> = {
  draft:       'bg-slate-400',
  open:        'bg-blue-500',
  distributed: 'bg-purple-500',
  accepted:    'bg-amber-500',
  in_progress: 'bg-sky-500',
  completed:   'bg-brand',
  cancelled:   'bg-red-500',
  disputed:    'bg-orange-500',
}

// --- Service Type ---

export const SERVICE_TYPE_LABEL: Record<ServiceType, string> = {
  installation: 'Instalação',
  repair:       'Reparo',
  removal:      'Retirada',
  inspection:   'Vistoria',
  cleaning:     'Limpeza',
}

// --- Cert Level ---

export const CERT_LEVEL_LABEL: Record<CertLevel, string> = {
  bronze:   'Bronze',
  prata:    'Prata',
  ouro:     'Ouro',
  diamante: 'Diamante',
}

export const CERT_LEVEL_COLOR: Record<CertLevel, string> = {
  bronze:   'text-amber-800  bg-amber-100',
  prata:    'text-slate-600  bg-slate-100',
  ouro:     'text-yellow-700 bg-yellow-50',
  diamante: 'text-sky-700    bg-sky-100',
}

// --- Misc ---

export function generateOSNumber(count: number) {
  const year = new Date().getFullYear()
  return `OS-${year}-${String(count).padStart(4, '0')}`
}

export function truncate(str: string, maxLen: number) {
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}
