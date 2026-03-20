import api from './axios'

export const userApi = {
  getPublicProfile: async (username) => {
    const res = await api.get(`/users/${username}`)
    return res.data
  },

  getMyProfile: async () => {
    const res = await api.get('/users/me')
    return res.data
  },

  updateProfile: async (data) => {
    const res = await api.put('/users/me', data)
    return res.data
  },

  // uploadProfileImage: async (imageFile) => {
  //   const formData = new FormData()
  //   formData.append('image', imageFile)
  //   const res = await api.post('/users/me/profile-image', formData, {
  //     headers: { 'Content-Type': 'multipart/form-data' },
  //   })
  //   return res.data
  // },
  uploadProfileImage: async (imageFile) => {
  const formData = new FormData()
  formData.append('image', imageFile)
  const res = await api.post('/users/me/profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
},

  getUserProjects: async (username, page = 0, size = 12) => {
    const res = await api.get(`/users/${username}/projects?page=${page}&size=${size}`)
    return res.data
  },
}