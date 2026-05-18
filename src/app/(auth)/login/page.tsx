'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values: LoginForm) {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setServerError(
        error.message.includes('Invalid login credentials')
          ? 'E-mail ou senha incorretos'
          : 'Erro ao entrar. Tente novamente.'
      )
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display text-ink font-semibold">Entrar</h1>
        <p className="mt-1 text-body-1 text-ink-muted">
          Acesse sua conta Freela
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="E-mail"
          type="email"
          placeholder="seunome@empresa.com"
          leftIcon={<Mail size={15} />}
          error={errors.email?.message}
          autoComplete="email"
          {...register('email')}
        />

        <Input
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          leftIcon={<Lock size={15} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-ink transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          error={errors.password?.message}
          autoComplete="current-password"
          {...register('password')}
        />

        {serverError && (
          <p className="text-body-2 text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-200">
            {serverError}
          </p>
        )}

        <div className="flex items-center justify-end">
          <Link href="/reset-password" className="text-body-2 text-brand hover:underline">
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-body-2 text-ink-muted">
        Não tem conta?{' '}
        <Link href="/register" className="text-brand font-medium hover:underline">
          Cadastrar
        </Link>
      </p>
    </div>
  )
}
