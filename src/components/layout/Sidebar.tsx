'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid, ClipboardList, Users, BarChart2,
  Settings, ChevronDown, LogOut, HelpCircle,
  Package, Star, Wallet, Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserAvatar } from '@/components/ui/avatar'
import type { User, UserRole } from '@/types'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  badge?: number
}

function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case 'lojista':
      return [
        { href: '/lojista/orders',    label: 'Ordens de Serviço', icon: <ClipboardList size={16} strokeWidth={1.5} /> },
        { href: '/lojista/providers', label: 'Prestadores',        icon: <Users size={16} strokeWidth={1.5} /> },
        { href: '/lojista/analytics', label: 'Relatórios',         icon: <BarChart2 size={16} strokeWidth={1.5} /> },
        { href: '/lojista/settings',  label: 'Configurações',      icon: <Settings size={16} strokeWidth={1.5} /> },
      ]
    case 'prestador':
      return [
        { href: '/prestador/my-orders',    label: 'Minhas OS',       icon: <ClipboardList size={16} strokeWidth={1.5} /> },
        { href: '/prestador/profile',      label: 'Meu Perfil',      icon: <Star size={16} strokeWidth={1.5} /> },
        { href: '/prestador/availability', label: 'Disponibilidade',  icon: <LayoutGrid size={16} strokeWidth={1.5} /> },
        { href: '/prestador/earnings',     label: 'Financeiro',      icon: <Wallet size={16} strokeWidth={1.5} /> },
      ]
    case 'fabricante':
      return [
        { href: '/fabricante/dashboard', label: 'Dashboard',      icon: <LayoutGrid size={16} strokeWidth={1.5} /> },
        { href: '/fabricante/orders',    label: 'Ordens',          icon: <ClipboardList size={16} strokeWidth={1.5} /> },
        { href: '/fabricante/reports',   label: 'Relatórios',      icon: <BarChart2 size={16} strokeWidth={1.5} /> },
      ]
    case 'admin':
      return [
        { href: '/admin/orders',    label: 'Ordens',      icon: <ClipboardList size={16} strokeWidth={1.5} /> },
        { href: '/admin/users',     label: 'Usuários',    icon: <Users size={16} strokeWidth={1.5} /> },
        { href: '/admin/analytics', label: 'Analytics',   icon: <BarChart2 size={16} strokeWidth={1.5} /> },
      ]
  }
}

interface SidebarProps {
  user: User
  onSignOut: () => void
}

export function Sidebar({ user, onSignOut }: SidebarProps) {
  const pathname = usePathname()
  const navItems = getNavItems(user.role)

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-sidebar flex-col border-r border-ink-border bg-ink-surface">
      {/* Logo */}
      <div className="flex h-14 items-center px-4 border-b border-ink-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand">
            <Package size={14} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-title-2 text-ink font-semibold tracking-tight">Freela</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('sidebar-link', isActive && 'active')}
            >
              {item.icon}
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-brand text-white text-caption px-1">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-ink-border p-2 space-y-0.5">
        <button className="sidebar-link w-full text-left">
          <HelpCircle size={16} strokeWidth={1.5} />
          <span>Ajuda</span>
        </button>

        <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/60 transition-colors cursor-default group">
          <UserAvatar src={user.avatar_url} name={user.full_name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-label font-medium text-ink truncate">{user.full_name}</p>
            <p className="text-caption text-ink-muted truncate">{user.email}</p>
          </div>
          <button
            onClick={onSignOut}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 hover:text-red-600"
            title="Sair"
          >
            <LogOut size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </aside>
  )
}
