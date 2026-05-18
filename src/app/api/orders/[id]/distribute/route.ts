import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

interface Params { params: { id: string } }

// POST /api/orders/:id/distribute — executa matching e envia convites
export async function POST(req: NextRequest, { params }: Params) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const body = await req.json().catch(() => ({}))
  const limit = body.limit ?? 5

  const { data: matches, error: matchErr } = await db
    .rpc('distribute_service_order', { p_os_id: params.id, p_limit: limit })

  if (matchErr) return NextResponse.json({ error: matchErr.message }, { status: 500 })
  if (!matches || matches.length === 0) {
    return NextResponse.json({ error: 'Nenhum prestador disponível na área' }, { status: 422 })
  }

  const serviceClient = await createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sdb = serviceClient as any

  const invitations = matches.map((m: { provider_id: string; score: number }) => ({
    os_id:       params.id,
    provider_id: m.provider_id,
    score:       m.score,
    status:      'pending',
  }))

  const { error: invErr } = await sdb
    .from('os_invitations')
    .insert(invitations)

  if (invErr) return NextResponse.json({ error: invErr.message }, { status: 500 })

  await sdb
    .from('service_orders')
    .update({ status: 'distributed', distributed_at: new Date().toISOString() })
    .eq('id', params.id)

  return NextResponse.json({
    message: `${matches.length} prestadores notificados`,
    matches,
  })
}
