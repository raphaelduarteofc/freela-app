import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Params { params: { id: string } }

// GET /api/orders/:id
export async function GET(req: NextRequest, { params }: Params) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data, error } = await db
    .from('service_orders')
    .select(`
      *,
      shop:shops(id, name, address_city),
      provider:service_providers(
        id, rating, cert_level, completion_rate,
        user:users(id, full_name, avatar_url, phone)
      ),
      invitations:os_invitations(
        id, status, score, sent_at, responded_at,
        provider:service_providers(
          id, rating, cert_level,
          user:users(id, full_name, avatar_url)
        )
      ),
      photos:os_photos(id, phase, storage_path, caption, created_at),
      rating:ratings(id, score, comment, created_at)
    `)
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })

  return NextResponse.json({ data })
}

// PATCH /api/orders/:id — atualiza status ou campos
export async function PATCH(req: NextRequest, { params }: Params) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const body = await req.json()

  const timestamps: Record<string, string> = {}
  if (body.status === 'distributed') timestamps.distributed_at = new Date().toISOString()
  if (body.status === 'accepted')    timestamps.accepted_at    = new Date().toISOString()
  if (body.status === 'in_progress') timestamps.started_at     = new Date().toISOString()
  if (body.status === 'completed')   timestamps.completed_at   = new Date().toISOString()
  if (body.status === 'cancelled')   timestamps.cancelled_at   = new Date().toISOString()

  const { data, error } = await db
    .from('service_orders')
    .update({ ...body, ...timestamps })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}

// DELETE /api/orders/:id — soft delete (cancel)
export async function DELETE(req: NextRequest, { params }: Params) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { error } = await db
    .from('service_orders')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ message: 'OS cancelada' })
}
