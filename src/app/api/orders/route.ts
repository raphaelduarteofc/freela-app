import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { CreateOSForm } from '@/types'

// GET /api/orders — lista OS da loja
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { searchParams } = new URL(req.url)
  const status  = searchParams.get('status')
  const page    = parseInt(searchParams.get('page') ?? '1')
  const perPage = parseInt(searchParams.get('per_page') ?? '20')
  const search  = searchParams.get('search')

  const { data: shop } = await db
    .from('shops')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 })

  let query = db
    .from('service_orders')
    .select(`
      *,
      provider:service_providers(
        id, rating, cert_level,
        user:users(id, full_name, avatar_url)
      )
    `, { count: 'exact' })
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1)

  if (status) query = query.eq('status', status)

  if (search) {
    query = query.or(`title.ilike.%${search}%,address_city.ilike.%${search}%,os_number.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    data,
    count,
    page,
    per_page: perPage,
    total_pages: Math.ceil((count ?? 0) / perPage),
  })
}

// POST /api/orders — cria nova OS
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const body: CreateOSForm = await req.json()

  if (!body.title || !body.service_type || !body.address_full) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
  }

  const { data: shop } = await db
    .from('shops')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 })

  const { data, error } = await db
    .from('service_orders')
    .insert({
      shop_id: shop.id,
      service_type: body.service_type,
      title: body.title,
      description: body.description,
      address_full: body.address_full,
      address_city: body.address_city,
      address_state: body.address_state,
      scheduled_date: body.scheduled_date,
      scheduled_time: body.scheduled_time,
      estimated_hours: body.estimated_hours,
      budget: body.budget,
      material_provided: body.material_provided ?? false,
      notes_internal: body.notes_internal,
      status: 'draft',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data }, { status: 201 })
}
