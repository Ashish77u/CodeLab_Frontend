import api from './axios'

export const authApi = {
  register: async (data) => {
    const res = await api.post('/auth/register', data)
    return res.data
  },
  login: async (data) => {
    const res = await api.post('/auth/login', data)
    return res.data
  },
  refreshToken: async (refreshToken) => {
    const res = await api.post('/auth/refresh-token', { refreshToken })
    return res.data
  },

//   verifyEmail: async (token) => {
//   return await api.get(`/auth/verify-email?token=${token}`)
// },

verifyEmail: async (token) => {
  const res = await api.get(`/auth/verify-email?token=${token}`)
  return res.data
},


}