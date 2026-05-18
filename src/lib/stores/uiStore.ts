import { create } from 'zustand'

interface UIStore {
  // Slide-over para detalhe da OS
  selectedOSId: string | null
  setSelectedOSId: (id: string | null) => void

  // Modal de criar OS
  createOSOpen: boolean
  setCreateOSOpen: (open: boolean) => void

  // Toast notifications
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error' | 'warning'
}

export const useUIStore = create<UIStore>((set) => ({
  selectedOSId: null,
  setSelectedOSId: (id) => set({ selectedOSId: id }),

  createOSOpen: false,
  setCreateOSOpen: (open) => set({ createOSOpen: open }),

  toasts: [],
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id),
  })),
}))
