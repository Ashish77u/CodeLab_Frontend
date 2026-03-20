import api from './axios'

export const projectApi = {
  getAll: async (page = 0, size = 12) => {
    const res = await api.get(`/projects?page=${page}&size=${size}`)
    return res.data
  },

  getById: async (id) => {
    const res = await api.get(`/projects/${id}`)
    return res.data
  },

  getByUsername: async (username, page = 0, size = 12) => {
    const res = await api.get(`/projects/user/${username}?page=${page}&size=${size}`)
    return res.data
  },

  search: async (query, page = 0, size = 12) => {
    const res = await api.get(
      `/projects/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`
    )
    return res.data
  },

  upload: async (formData) => {
    const res = await api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  delete: async (id) => {
    await api.delete(`/projects/${id}`)
  },

  // download: async (id, filename) => {
  //   const res = await api.get(`/projects/${id}/download`, {
  //     responseType: 'blob',
  //   })
  //   const url = window.URL.createObjectURL(new Blob([res.data]))
  //   const link = document.createElement('a')
  //   link.href = url
  //   link.setAttribute('download', filename || 'project.zip')
  //   document.body.appendChild(link)
  //   link.click()
  //   link.remove()
  //   window.URL.revokeObjectURL(url)
  // },
download: async (id, filename) => {
  const res = await api.get(`/projects/${id}/download`)
  const downloadUrl = res.data.downloadUrl

  // Open Cloudinary URL directly — browser handles download
  const link = document.createElement('a')
  link.href = downloadUrl
  link.setAttribute('download', filename || 'project.zip')
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  link.remove()
},

  // Get all unique tags
  getAllTags: async () => {
    const res = await api.get('/projects/tags')
    return res.data
  },
}