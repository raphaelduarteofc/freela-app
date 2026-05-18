'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StatusBadge, ServiceTypeBadge } from '@/components/ui/badge'
import { formatDate, truncate } from '@/lib/utils'
import { MapPin, Calendar, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ServiceOrder } from '@/types'

interface OSTableProps {
  shopId: string
  onSelect?: (os: ServiceOrder) => void
}

export function OSTable({ shopId, onSelect }: OSTableProps) {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data } = await supabase
        .from('service_orders')
        .select(`
          *,
          provider:service_providers(
            id, rating, cert_level,
            user:users(full_name, avatar_url)
          )
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false })
        .limit(50)

      setOrders((data as ServiceOrder[]) ?? [])
      setLoading(false)
    }

    load()

    // Realtime subscription
    const channel = supabase
      .channel(`os-${shopId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_orders', filter: `shop_id=eq.${shopId}` },
        () => load(),
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [shopId])

  if (loading) return <OSTableSkeleton />

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-full bg-ink-surface border-2 border-dashed border-ink-border flex items-center justify-center mb-4">
          <span className="text-xl">📋</span>
        </div>
        <p className="text-title-2 text-ink">Nenhuma OS ainda</p>
        <p className="text-body-2 text-ink-muted mt-1">Crie sua primeira ordem de serviço</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-ink-border shadow-card overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-ink-border bg-ink-surface">
            <th className="table-dense text-left text-label font-medium text-ink-muted">OS</th>
            <th className="table-dense text-left text-label font-medium text-ink-muted">Título</th>
            <th className="table-dense text-left text-label font-medium text-ink-muted">Tipo</th>
            <th className="table-dense text-left text-label font-medium text-ink-muted">Status</th>
            <th className="table-dense text-left text-label font-medium text-ink-muted">Prestador</th>
            <th className="table-dense text-left text-label font-medium text-ink-muted">Data</th>
            <th className="table-dense text-left text-label font-medium text-ink-muted">Local</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {orders.map((os) => (
            <tr
              key={os.id}
              className={cn('os-row', onSelect && 'cursor-pointer')}
              onClick={() => onSelect?.(os)}
            >
              <td className="table-dense">
                <span className="id-mono">{os.os_number}</span>
              </td>
              <td className="table-dense">
                <span className="text-body-1 text-ink font-medium">
                  {truncate(os.title, 40)}
                </span>
              </td>
              <td className="table-dense">
                <ServiceTypeBadge type={os.service_type} />
              </td>
              <td className="table-dense">
                <StatusBadge status={os.status} size="sm" />
              </td>
              <td className="table-dense">
                {os.provider ? (
                  <span className="text-body-2 text-ink-soft">
                    {(os.provider as { user?: { full_name: string } })?.user?.full_name ?? '—'}
                  </span>
                ) : (
                  <span className="text-body-2 text-ink-subtle">—</span>
                )}
              </td>
              <td className="table-dense">
                {os.scheduled_date ? (
                  <span className="flex items-center gap-1 text-body-2 text-ink-soft">
                    <Calendar size={12} strokeWidth={1.5} />
                    {formatDate(os.scheduled_date)}
                  </span>
                ) : (
                  <span className="text-body-2 text-ink-subtle">—</span>
                )}
              </td>
              <td className="table-dense">
                <span className="flex items-center gap-1 text-body-2 text-ink-soft">
                  <MapPin size={12} strokeWidth={1.5} />
                  {os.address_city}
                </span>
              </td>
              <td className="table-dense text-ink-subtle">
                <ChevronRight size={14} strokeWidth={1.5} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Skeleton
export function OSTableSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-ink-border shadow-card overflow-hidden">
      <div className="p-4 border-b border-ink-border bg-ink-surface" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-4 p-3 border-b border-ink-border last:border-b-0 animate-pulse">
          <div className="h-4 w-24 bg-ink-border rounded" />
          <div className="h-4 flex-1 bg-ink-border rounded" />
          <div className="h-4 w-20 bg-ink-border rounded" />
          <div className="h-4 w-20 bg-ink-border rounded" />
          <div className="h-4 w-32 bg-ink-border rounded" />
        </div>
      ))}
    </div>
  )
}
