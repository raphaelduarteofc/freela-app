import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export default async function Home() {
  // Auth via anon client (valida a sessão do usuário)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Service role bypassa RLS — seguro pois roda só no servidor
  // Necessário porque a policy admin tem recursão no RLS da tabela users
  const serviceClient = await createServiceClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = serviceClient as any
  const { data: profile } = await db
    .from('users')
    .select('role')
    .eq('id', user!.id)
    .single()

  if (!profile) redirect('/login')

  switch (profile.role) {
    case 'lojista':    redirect('/lojista/orders')
    case 'prestador':  redirect('/prestador/my-orders')
    case 'fabricante': redirect('/fabricante/dashboard')
    case 'admin':      redirect('/admin/orders')
    default:           redirect('/login')
  }
}
