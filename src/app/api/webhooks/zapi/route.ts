import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// POST /api/webhooks/zapi — recebe eventos do Z-API (WhatsApp)
export async function POST(req: NextRequest) {
  const clientToken = req.headers.get('client-token')
  if (clientToken !== process.env.ZAPI_CLIENT_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { type, phone, text } = body

  if (type !== 'ReceivedCallback' || !text?.message) {
    return NextResponse.json({ ok: true })
  }

  const message = text.message.trim().toLowerCase()
  const phoneClean = phone?.replace(/\D/g, '')

  if (!phoneClean) return NextResponse.json({ ok: true })

  const supabase = await createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: user } = await db
    .from('users')
    .select('id')
    .eq('phone', phoneClean)
    .single()

  if (!user) return NextResponse.json({ ok: true })

  const { data: provider } = await db
    .from('service_providers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!provider) return NextResponse.json({ ok: true })

  const { data: invitation } = await db
    .from('os_invitations')
    .select('id, os_id')
    .eq('provider_id', provider.id)
    .eq('status', 'pending')
    .order('sent_at', { ascending: false })
    .limit(1)
    .single()

  if (!invitation) return NextResponse.json({ ok: true })

  if (message === '1' || message.includes('aceito') || message.includes('aceitar')) {
    await db
      .from('os_invitations')
      .update({ status: 'accepted', responded_at: new Date().toISOString() })
      .eq('id', invitation.id)

    await db
      .from('service_orders')
      .update({
        status: 'accepted',
        provider_id: provider.id,
        accepted_at: new Date().toISOString(),
      })
      .eq('id', invitation.os_id)

  } else if (message === '2' || message.includes('recuso') || message.includes('recusar')) {
    await db
      .from('os_invitations')
      .update({ status: 'rejected', responded_at: new Date().toISOString() })
      .eq('id', invitation.id)
  }

  return NextResponse.json({ ok: true })
}
