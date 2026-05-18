import { z } from 'zod'

export const createOSSchema = z.object({
  title: z
    .string()
    .min(5, 'Título deve ter pelo menos 5 caracteres')
    .max(120, 'Título muito longo'),
  service_type: z.enum(['installation', 'repair', 'removal', 'inspection', 'cleaning'], {
    required_error: 'Selecione o tipo de serviço',
  }),
  address_full: z.string().min(10, 'Endereço completo obrigatório'),
  address_city: z.string().min(2, 'Cidade obrigatória'),
  address_state: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
  scheduled_date: z.string().optional(),
  scheduled_time: z.string().optional(),
  estimated_hours: z.coerce.number().positive().optional(),
  budget: z.coerce.number().positive().optional(),
  material_provided: z.boolean().default(false),
  description: z.string().max(2000).optional(),
  notes_internal: z.string().max(1000).optional(),
})

export type CreateOSSchema = z.infer<typeof createOSSchema>

export const updateOSStatusSchema = z.object({
  status: z.enum(['draft', 'open', 'distributed', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed']),
  reason: z.string().optional(),
})

export const ratingSchema = z.object({
  score: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
})
