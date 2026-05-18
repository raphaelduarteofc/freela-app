'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Metadata } from 'next'

const registerSchema = z.object({
  full_name: z.string().min(3, 'Nome completo obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['lojista', 'prestador']),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'lojista' },
  })

  const selectedRole = watch('role')

  async function onSubmit(values: RegisterForm) {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.full_name,
          role: values.role,
        },
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        setServerError('Este e-mail já está cadastrado. Faça login.')
      } else {
        setServerError('Erro ao criar conta. Tente novamente.')
      }
      return
    }

    setSuccess(true)
    // Se confirmação de e-mail estiver desativada, redireciona direto
    setTimeout(() => router.push('/'), 2000)
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-brand-50 border-2 border-brand flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h2 className="text-title-1 text-ink font-semibold mb-2">Conta criada!</h2>
        <p className="text-body-1 text-ink-muted">
          Redirecionando para o sistema...
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display text-ink font-semibold">Criar conta</h1>
        <p className="mt-1 text-body-1 text-ink-muted">
          Comece a gerenciar suas ordens de serviço
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Tipo de conta */}
        <div>
          <p className="text-label text-ink-muted mb-2">Tipo de conta</p>
          <div className="grid grid-cols-2 gap-2">
            {(['lojista', 'prestador'] as const).map(role => (
              <label
                key={role}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedRole === role
                    ? 'border-brand bg-brand-50 text-brand-700'
                    : 'border-ink-border bg-white text-ink-muted hover:border-ink-soft'
                }`}
              >
                <input
                  type="radio"
                  value={role}
                  {...register('role')}
                  className="sr-only"
                />
                <span className="text-xl">{role === 'lojista' ? '🏪' : '🔧'}</span>
                <span className="text-label font-medium capitalize">
                  {role === 'lojista' ? 'Lojista' : 'Prestador'}
                </span>
                <span className="text-caption text-center leading-tight">
                  {role === 'lojista'
                    ? 'Abro OS para clientes'
                    : 'Executo serviços em campo'}
                </span>
              </label>
            ))}
          </div>
        </div>

        <Input
          label="Nome completo"
          type="text"
          placeholder="João Silva"
          leftIcon={<User size={15} />}
          error={errors.full_name?.message}
          autoComplete="name"
          {...register('full_name')}
        />

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
          placeholder="Mínimo 6 caracteres"
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
          autoComplete="new-password"
          {...register('password')}
        />

        <Input
          label="Confirmar senha"
          type={showPassword ? 'text' : 'password'}
          placeholder="Repita a senha"
          leftIcon={<Lock size={15} />}
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
          {...register('confirmPassword')}
        />

        {serverError && (
          <p className="text-body-2 text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-200">
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-body-2 text-ink-muted">
        Já tem conta?{' '}
        <Link href="/login" className="text-brand font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  )
}
