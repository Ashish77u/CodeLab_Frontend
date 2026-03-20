import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { projectApi } from '../api/projectApi'
import toast from 'react-hot-toast'

const schema = z.object({
  title:       z.string().min(3, 'Min 3 characters').max(100),
  description: z.string().min(20, 'Min 20 characters'),
  about:       z.string().min(10, 'Min 10 characters'),
  tags:        z.string().min(1, 'Add at least one tag'),
})

export default function UploadProjectPage() {
  const navigate = useNavigate()
  const [coverImage, setCoverImage] = useState(null)
  const [zipFile, setZipFile] = useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  const { getRootProps: getCoverProps, getInputProps: getCoverInput } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    onDrop: files => setCoverImage(files[0])
  })

  const { getRootProps: getZipProps, getInputProps: getZipInput } = useDropzone({
    accept: { 'application/zip': ['.zip'] },
    maxFiles: 1,
    onDrop: files => setZipFile(files[0])
  })

  const mutation = useMutation({
    mutationFn: projectApi.upload,
    onSuccess: (data) => {
      toast.success('Project uploaded!')
      navigate(`/projects/${data.id}`)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Upload failed')
    }
  })

  const onSubmit = (data) => {
    if (!coverImage) { toast.error('Cover image is required'); return }
    if (!zipFile)    { toast.error('ZIP file is required'); return }

    const formData = new FormData()
    formData.append('title',       data.title)
    formData.append('description', data.description)
    formData.append('about',       data.about)
    formData.append('tags',        data.tags)
    formData.append('coverImage',  coverImage)
    formData.append('zipFile',     zipFile)
    mutation.mutate(formData)
  }

  const inputStyle = (hasError) => ({
    width: '100%', padding: '10px 14px', background: '#111120',
    border: `1px solid ${hasError ? '#ff4444' : '#2a2a3a'}`,
    borderRadius: 8, color: '#e8e8f0', fontSize: 14,
    fontFamily: 'DM Sans, sans-serif', outline: 'none',
  })

  const dropStyle = {
    border: '2px dashed #2a2a3a', borderRadius: 10,
    padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
    background: '#0d0d1a', color: '#445', fontSize: 13,
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{
        fontFamily: 'Syne, sans-serif', fontSize: 32,
        fontWeight: 800, color: '#e8e8f0', marginBottom: 8
      }}>Upload Project</h1>
      <p style={{ color: '#445', fontSize: 14, marginBottom: 36 }}>
        Share your source code with the community
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Title */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>
            Project Title *
          </label>
          <input {...register('title')}
            placeholder="e.g. Spring Boot REST API with JWT"
            style={inputStyle(!!errors.title)} />
          {errors.title && <p style={{ color: '#ff4444', fontSize: 11, marginTop: 4 }}>
            {errors.title.message}</p>}
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>
            Tags * (comma-separated)
          </label>
          <input {...register('tags')}
            placeholder="java,spring-boot,rest-api"
            style={inputStyle(!!errors.tags)} />
          {errors.tags && <p style={{ color: '#ff4444', fontSize: 11, marginTop: 4 }}>
            {errors.tags.message}</p>}
        </div>

        {/* Description */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>
            Short Description *
          </label>
          <textarea {...register('description')} rows={3}
            placeholder="Brief description shown on project cards..."
            style={{ ...inputStyle(!!errors.description), resize: 'vertical' }} />
          {errors.description && <p style={{ color: '#ff4444', fontSize: 11, marginTop: 4 }}>
            {errors.description.message}</p>}
        </div>

        {/* About */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>
            About * (detailed info shown on project page)
          </label>
          <textarea {...register('about')} rows={5}
            placeholder="Tech stack used, features, how to run locally..."
            style={{ ...inputStyle(!!errors.about), resize: 'vertical' }} />
          {errors.about && <p style={{ color: '#ff4444', fontSize: 11, marginTop: 4 }}>
            {errors.about.message}</p>}
        </div>

        {/* Cover Image */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>
            Cover Image * (JPG, PNG, WEBP — max 5MB)
          </label>
          <div {...getCoverProps()} style={dropStyle}>
            <input {...getCoverInput()} />
            {coverImage
              ? <p style={{ color: '#00ff88' }}>✓ {coverImage.name}</p>
              : <p>Drag & drop cover image, or click to select</p>
            }
          </div>
        </div>

        {/* ZIP File */}
        <div style={{ marginBottom: 36 }}>
          <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>
            Project ZIP File * (max 50MB)
          </label>
          <div {...getZipProps()} style={dropStyle}>
            <input {...getZipInput()} />
            {zipFile
              ? <p style={{ color: '#00ff88' }}>
                  ✓ {zipFile.name} ({(zipFile.size / 1024 / 1024).toFixed(1)}MB)
                </p>
              : <p>Drag & drop your .zip file, or click to select</p>
            }
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={mutation.isPending} style={{
          width: '100%', padding: 14,
          background: mutation.isPending ? '#1a1a2e' : '#00ff88',
          border: 'none', borderRadius: 10,
          color: mutation.isPending ? '#555' : '#000',
          fontSize: 16, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          {mutation.isPending ? 'Uploading...' : 'Upload Project'}
        </button>
      </form>
    </div>
  )
}