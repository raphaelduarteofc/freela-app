// Fix: lucide-react 0.344.0 foi instalado sem arquivos .d.ts no node_modules.
// Esta declaração suprime o erro TS7016/TS2305 e mantém os imports funcionando.
// Para remover: npm install lucide-react@latest (versão com exports correto)

declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string
    absoluteStrokeWidth?: boolean
    strokeWidth?: number | string
    className?: string
  }

  export type LucideIcon = FC<LucideProps>

  // Todos os ícones usados no projeto Freela
  export const AlertCircle: LucideIcon
  export const ArrowLeft: LucideIcon
  export const ArrowRight: LucideIcon
  export const BarChart2: LucideIcon
  export const Bell: LucideIcon
  export const Calendar: LucideIcon
  export const Check: LucideIcon
  export const CheckCircle: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronLeft: LucideIcon
  export const ChevronRight: LucideIcon
  export const ChevronUp: LucideIcon
  export const Circle: LucideIcon
  export const ClipboardList: LucideIcon
  export const Clock: LucideIcon
  export const Copy: LucideIcon
  export const Edit: LucideIcon
  export const Eye: LucideIcon
  export const EyeOff: LucideIcon
  export const Filter: LucideIcon
  export const HelpCircle: LucideIcon
  export const Home: LucideIcon
  export const Info: LucideIcon
  export const LayoutDashboard: LucideIcon
  export const LayoutGrid: LucideIcon
  export const List: LucideIcon
  export const Loader: LucideIcon
  export const Loader2: LucideIcon
  export const Lock: LucideIcon
  export const LogOut: LucideIcon
  export const Mail: LucideIcon
  export const MapPin: LucideIcon
  export const Menu: LucideIcon
  export const MoreHorizontal: LucideIcon
  export const MoreVertical: LucideIcon
  export const Package: LucideIcon
  export const Phone: LucideIcon
  export const Plus: LucideIcon
  export const Search: LucideIcon
  export const Settings: LucideIcon
  export const Shield: LucideIcon
  export const Star: LucideIcon
  export const Trash: LucideIcon
  export const Trash2: LucideIcon
  export const TrendingUp: LucideIcon
  export const User: LucideIcon
  export const UserCircle: LucideIcon
  export const Users: LucideIcon
  export const Wallet: LucideIcon
  export const Wrench: LucideIcon
  export const X: LucideIcon
  export const XCircle: LucideIcon
  export const Zap: LucideIcon
}
