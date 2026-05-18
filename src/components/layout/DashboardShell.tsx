'use client'

import { useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

interface DashboardShellProps {
  user: User
  children: React.ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} onSignOut={handleSignOut} />

      {/* Main content */}
      <main className="flex-1 ml-sidebar overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
