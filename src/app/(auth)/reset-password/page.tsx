'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display text-ink font-semibold">Recuperar senha</h1>
        <p className="mt-1 text-body-1 text-ink-muted">
          Enviamos um link para o seu e-mail
        </p>
      </div>

      {sent ? (
        <div className="rounded-lg bg-brand-50 border border-brand-200 p-4 text-body-1 text-brand-700">
          Verifique sua caixa de entrada e siga as instruções no e-mail.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            placeholder="seunome@empresa.com"
            leftIcon={<Mail size={15} />}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Enviar link
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-body-2 text-ink-muted">
        <Link href="/login" className="text-brand font-medium hover:underline">
          Voltar ao login
        </Link>
      </p>
    </div>
  )
}
