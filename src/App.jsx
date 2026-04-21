import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/common/Sidebar'
import Dashboard from './pages/Dashboard'
import ImagePage from './pages/ImagePage'
import VideoPage from './pages/VideoPage'
import { checkHealth } from './services/api'

export default function App() {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    checkHealth()
      .then(setHealth)
      .catch(() => setHealth({ status: 'offline', model_loaded: false, model_path: '' }))

    // Poll every 30s
    const interval = setInterval(() => {
      checkHealth().then(setHealth).catch(() => {})
    }, 30_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar health={health} />
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-base)' }}>
        <Routes>
          <Route path="/" element={<Dashboard health={health} />} />
          <Route path="/image" element={<ImagePage />} />
          <Route path="/video" element={<VideoPage />} />
        </Routes>
      </main>
    </div>
  )
}
