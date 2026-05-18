import { Package } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-[440px] xl:w-[520px] flex-col bg-ink text-white p-10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
            <Package size={16} strokeWidth={2} />
          </div>
          <span className="text-title-1 font-semibold">Freela</span>
        </div>

        <div className="mt-auto mb-8">
          <blockquote className="text-display font-semibold leading-tight text-white/90">
            "Da venda até a instalação, tudo em um lugar só."
          </blockquote>
          <p className="mt-4 text-body-1 text-white/50">
            Conectamos lojas de pisos e revestimentos com os melhores prestadores de serviço da sua região.
          </p>
        </div>

        <div className="flex gap-6 text-body-2 text-white/40">
          <span>© 2024 Freela</span>
          <a href="#" className="hover:text-white/70 transition-colors">Privacidade</a>
          <a href="#" className="hover:text-white/70 transition-colors">Termos</a>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 bg-ink-surface">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
              <Package size={16} strokeWidth={2} />
            </div>
            <span className="text-title-1 font-semibold text-ink">Freela</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
