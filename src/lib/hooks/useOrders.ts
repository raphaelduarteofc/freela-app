'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ServiceOrder, OSFilters } from '@/types'

interface UseOrdersResult {
  orders: ServiceOrder[]
  loading: boolean
  error: string | null
  refresh: () => void
  total: number
}

export function useOrders(shopId: string | undefined, filters?: OSFilters): UseOrdersResult {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const load = useCallback(async () => {
    if (!shopId) { setLoading(false); return }

    setLoading(true)
    setError(null)

    const supabase = createClient()
    let query = supabase
      .from('service_orders')
      .select(`
        *,
        provider:service_providers(
          id, rating, cert_level,
          user:users(id, full_name, avatar_url)
        )
      `, { count: 'exact' })
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })

    if (filters?.status?.length) query = query.in('status', filters.status)
    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,os_number.ilike.%${filters.search}%`
      )
    }

    const { data, error: err, count } = await query

    if (err) {
      setError(err.message)
    } else {
      setOrders((data as ServiceOrder[]) ?? [])
      setTotal(count ?? 0)
    }

    setLoading(false)
  }, [shopId, JSON.stringify(filters)])

  useEffect(() => {
    load()

    if (!shopId) return

    // Realtime
    const supabase = createClient()
    const channel = supabase
      .channel(`orders-${shopId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'service_orders',
        filter: `shop_id=eq.${shopId}`,
      }, () => load())
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [load, shopId])

  return { orders, loading, error, refresh: load, total }
}

// Hook para OS do prestador
export function useProviderOrders(providerId: string | undefined) {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!providerId) { setLoading(false); return }

    const supabase = createClient()

    async function load() {
      const { data } = await supabase
        .from('service_orders')
        .select('*, shop:shops(id, name, address_city)')
        .eq('provider_id', providerId as string)
        .in('status', ['accepted', 'in_progress', 'completed'])
        .order('scheduled_date', { ascending: true })

      setOrders((data as ServiceOrder[]) ?? [])
      setLoading(false)
    }

    load()
  }, [providerId])

  return { orders, loading }
}
