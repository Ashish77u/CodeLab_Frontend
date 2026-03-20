import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, token, refreshToken) => set({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
      }),

      logout: () => set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      }),

      updateUser: (updatedFields) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedFields } : null
      })),

      getToken: () => get().token,
      getUser:  () => get().user,
    }),
    {
      name: 'sourcevault-auth',
      partialize: (state) => ({
        user:            state.user,
        token:           state.token,
        refreshToken:    state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)