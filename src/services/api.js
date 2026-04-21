import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 300_000, // 5 min for video
})

export async function checkHealth() {
  const { data } = await api.get('/health')
  return data
}

export async function predictImage(file, confidence) {
  const form = new FormData()
  form.append('file', file)
  if (confidence !== undefined && confidence !== null) {
    form.append('confidence', confidence)
  }
  const { data } = await api.post('/predict-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function predictVideo(file, confidence, onProgress) {
  const form = new FormData()
  form.append('file', file)
  if (confidence !== undefined && confidence !== null) {
    form.append('confidence', confidence)
  }
  const { data } = await api.post('/predict-video', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    },
  })
  return data
}

export function getOutputVideoUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${BASE_URL}${path}`
}

export default api
