// Este arquivo é gerado automaticamente pelo Supabase CLI:
// npx supabase gen types typescript --local > src/types/supabase.ts
//
// O stub abaixo permite compilar antes de ter o Supabase rodando localmente.
// Substitua pelo tipo gerado após rodar: npm run db:types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          full_name: string
          avatar_url: string | null
          role: 'lojista' | 'prestador' | 'fabricante' | 'admin'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          phone?: string | null
          full_name: string
          avatar_url?: string | null
          role: 'lojista' | 'prestador' | 'fabricante' | 'admin'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
        Relationships: []
      }
      shops: {
        Row: {
          id: string
          user_id: string
          name: string
          cnpj: string | null
          plan: 'starter' | 'growth' | 'enterprise'
          address_street: string | null
          address_city: string
          address_state: string
          address_zip: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          cnpj?: string | null
          plan?: 'starter' | 'growth' | 'enterprise'
          address_city: string
          address_state: string
          address_street?: string | null
          address_zip?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['shops']['Insert']>
        Relationships: []
      }
      service_providers: {
        Row: {
          id: string
          user_id: string
          cpf_cnpj: string
          cert_level: 'bronze' | 'prata' | 'ouro' | 'diamante'
          rating: number
          rating_count: number
          completion_rate: number
          radius_km: number
          is_available: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cpf_cnpj: string
          cert_level?: 'bronze' | 'prata' | 'ouro' | 'diamante'
          radius_km?: number
          rating?: number
          rating_count?: number
          completion_rate?: number
          is_available?: boolean
          is_active?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['service_providers']['Insert']>
        Relationships: []
      }
      service_orders: {
        Row: {
          id: string
          os_number: string
          shop_id: string
          provider_id: string | null
          status: 'draft' | 'open' | 'distributed' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
          service_type: 'installation' | 'repair' | 'removal' | 'inspection' | 'cleaning'
          title: string
          description: string | null
          address_full: string
          address_city: string
          address_state: string
          scheduled_date: string | null
          scheduled_time: string | null
          estimated_hours: number | null
          budget: number | null
          material_provided: boolean
          notes_internal: string | null
          notes_provider: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          shop_id: string
          service_type: 'installation' | 'repair' | 'removal' | 'inspection' | 'cleaning'
          title: string
          address_full: string
          address_city: string
          address_state: string
          material_provided?: boolean
          provider_id?: string | null
          status?: 'draft' | 'open' | 'distributed' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
          description?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          estimated_hours?: number | null
          budget?: number | null
          notes_internal?: string | null
          notes_provider?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
          os_number?: string
        }
        Update: Partial<Database['public']['Tables']['service_orders']['Insert']>
        Relationships: []
      }
      os_invitations: {
        Row: {
          id: string
          os_id: string
          provider_id: string
          status: 'pending' | 'accepted' | 'rejected' | 'expired'
          score: number
          sent_at: string
          responded_at: string | null
          message: string | null
        }
        Insert: {
          id?: string
          os_id: string
          provider_id: string
          score?: number
          status?: 'pending' | 'accepted' | 'rejected' | 'expired'
          sent_at?: string
          responded_at?: string | null
          message?: string | null
        }
        Update: Partial<Database['public']['Tables']['os_invitations']['Insert']>
        Relationships: []
      }
      ratings: {
        Row: {
          id: string
          os_id: string
          rater_id: string
          rated_id: string
          score: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          os_id: string
          rater_id: string
          rated_id: string
          score: number
          comment?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['ratings']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      calculate_provider_score: {
        Args: { provider_id: string; os_lat: number; os_lng: number }
        Returns: number
      }
    }
    Enums: {
      user_role: 'lojista' | 'prestador' | 'fabricante' | 'admin'
      os_status: 'draft' | 'open' | 'distributed' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed'
      service_type: 'installation' | 'repair' | 'removal' | 'inspection' | 'cleaning'
      cert_level: 'bronze' | 'prata' | 'ouro' | 'diamante'
    }
    CompositeTypes: Record<string, never>
  }
}
