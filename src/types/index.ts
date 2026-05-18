// =====================================================
// FREELA — Core Types
// =====================================================

export type UserRole = 'lojista' | 'prestador' | 'fabricante' | 'admin'

export type OSStatus =
  | 'draft'
  | 'open'
  | 'distributed'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed'

export type ServiceType =
  | 'installation'
  | 'repair'
  | 'removal'
  | 'inspection'
  | 'cleaning'

export type CertLevel = 'bronze' | 'prata' | 'ouro' | 'diamante'

export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'expired'

// --- Entidades ---

export interface User {
  id: string
  email: string
  phone?: string
  full_name: string
  avatar_url?: string
  role: UserRole
  is_active: boolean
  created_at: string
}

export interface Shop {
  id: string
  user_id: string
  name: string
  cnpj?: string
  plan: 'starter' | 'growth' | 'enterprise'
  location?: { lat: number; lng: number }
  address_city: string
  address_state: string
  is_active: boolean
  created_at: string
}

export interface ServiceProvider {
  id: string
  user_id: string
  cpf_cnpj: string
  cert_level: CertLevel
  rating: number
  rating_count: number
  completion_rate: number
  radius_km: number
  location?: { lat: number; lng: number }
  is_available: boolean
  is_active: boolean
  created_at: string
  // Joined
  user?: User
}

export interface ServiceOrder {
  id: string
  os_number: string        // OS-2024-0001
  shop_id: string
  provider_id?: string
  status: OSStatus
  service_type: ServiceType
  title: string
  description?: string
  address_full: string
  address_city: string
  address_state: string
  location?: { lat: number; lng: number }
  scheduled_date?: string
  scheduled_time?: string
  estimated_hours?: number
  budget?: number
  material_provided: boolean
  notes_internal?: string
  notes_provider?: string
  created_at: string
  updated_at: string
  completed_at?: string
  // Joined
  shop?: Shop
  provider?: ServiceProvider
  rating?: Rating
  photos?: OSPhoto[]
}

export interface OSInvitation {
  id: string
  os_id: string
  provider_id: string
  status: InvitationStatus
  score: number
  sent_at: string
  responded_at?: string
  message?: string
  // Joined
  provider?: ServiceProvider
}

export interface OSExecution {
  id: string
  os_id: string
  provider_id: string
  check_in_at?: string
  check_out_at?: string
  check_in_location?: { lat: number; lng: number }
  check_out_location?: { lat: number; lng: number }
  notes?: string
}

export interface OSPhoto {
  id: string
  os_id: string
  uploader_id: string
  phase: 'before' | 'during' | 'after'
  storage_path: string
  public_url: string
  created_at: string
}

export interface Rating {
  id: string
  os_id: string
  rater_id: string
  rated_id: string
  score: number        // 1-5
  comment?: string
  created_at: string
}

// --- Dashboard ---

export interface DashboardMetrics {
  total_os: number
  open_os: number
  in_progress_os: number
  completed_os: number
  avg_rating: number
  completion_rate: number
  avg_response_time_hours: number
}

// --- Forms ---

export interface CreateOSForm {
  title: string
  service_type: ServiceType
  address_full: string
  address_city: string
  address_state: string
  scheduled_date?: string
  scheduled_time?: string
  estimated_hours?: number
  budget?: number
  material_provided: boolean
  description?: string
  notes_internal?: string
}

// --- Filtros ---

export interface OSFilters {
  status?: OSStatus[]
  service_type?: ServiceType[]
  date_from?: string
  date_to?: string
  city?: string
  search?: string
}

// --- Paginação ---

export interface PaginatedResult<T> {
  data: T[]
  count: number
  page: number
  per_page: number
  total_pages: number
}

// --- API Response ---

export interface ApiResponse<T = void> {
  data?: T
  error?: string
  message?: string
}
