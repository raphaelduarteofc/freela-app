import { Suspense } from 'react'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { PageHeader, MetricsStrip } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { OSTable } from '@/components/orders/OSTable'
import { OSTableSkeleton } from '@/components/orders/OSTableSkeleton'
import { Plus } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Ordens de Serviço' }

async function getMetrics(shopId: string) {
  // Service role bypassa RLS — seguro, filtra por shopId explicitamente
  const serviceClient = await createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = serviceClient as any

  const [{ count: total }, { count: open }, { count: inProgress }, { count: completed }] =
    await Promise.all([
      db.from('service_orders').select('*', { count: 'exact', head: true }).eq('shop_id', shopId),
      db.from('service_orders').select('*', { count: 'exact', head: true }).eq('shop_id', shopId).eq('status', 'open'),
      db.from('service_orders').select('*', { count: 'exact', head: true }).eq('shop_id', shopId).eq('status', 'in_progress'),
      db.from('service_orders').select('*', { count: 'exact', head: true }).eq('shop_id', shopId).eq('status', 'completed'),
    ])

  return { total: total ?? 0, open: open ?? 0, inProgress: inProgress ?? 0, completed: completed ?? 0 }
}

async function getShop(userId: string) {
  const serviceClient = await createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = serviceClient as any
  const { data } = await db.from('shops').select('id').eq('user_id', userId).single()
  return data as { id: string } | null
}

export default async function LojistOrdemsPage() {
  // Auth via anon client para validar sessão
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const shop = await getShop(user.id)
  const metrics = shop ? await getMetrics(shop.id) : { total: 0, open: 0, inProgress: 0, completed: 0 }

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        title="Ordens de Serviço"
        description="Gerencie todas as OS da sua loja"
        actions={
          <Button size="md">
            <Plus size={15} strokeWidth={2} />
            Nova OS
          </Button>
        }
      />

      <MetricsStrip
        metrics={[
          { label: 'Total de OS', value: metrics.total },
          { label: 'Abertas', value: metrics.open, highlight: metrics.open > 0 },
          { label: 'Em Execução', value: metrics.inProgress },
          { label: 'Concluídas', value: metrics.completed },
        ]}
      />

      <div className="flex-1 p-6">
        <Suspense fallback={<OSTableSkeleton />}>
          {shop ? (
            <OSTable shopId={shop.id} />
          ) : (
            <div className="text-center py-20 text-ink-muted">
              <p className="text-body-1">Configure sua loja para começar</p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}
