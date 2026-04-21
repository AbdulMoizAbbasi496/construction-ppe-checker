import React, { useState, useCallback } from 'react'
import DropZone from '../components/upload/DropZone'
import ConfidenceSlider from '../components/upload/ConfidenceSlider'
import ComplianceBadge from '../components/results/ComplianceBadge'
import DetectionSummary from '../components/results/DetectionSummary'
import { predictImage } from '../services/api'

const ACCEPT = { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp'] }

export default function ImagePage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [confidence, setConfidence] = useState(0.25)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFile = useCallback((f) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
    setError(null)
  }, [])

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const data = await predictImage(file, confidence)
      setResult(data)
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Inference failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!result?.processed_image) return
    const link = document.createElement('a')
    link.href = `data:image/jpeg;base64,${result.processed_image}`
    link.download = `ppe_result_${Date.now()}.jpg`
    link.click()
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Image Analysis</h1>
          <p style={styles.subtitle}>Upload an image to check PPE compliance</p>
        </div>
        {result && (
          <button onClick={handleReset} style={styles.resetBtn}>
            ↩ New Image
          </button>
        )}
      </header>

      <div style={styles.grid}>
        {/* Left column */}
        <div style={styles.left}>
          {!file ? (
            <DropZone
              accept={ACCEPT}
              onFile={handleFile}
              label="Drop your image here"
              hint="JPEG, PNG, WebP, BMP — max 20 MB"
            />
          ) : (
            <div style={styles.previewCard}>
              <div style={styles.previewLabel}>
                {result ? 'Processed Output' : 'Preview'}
              </div>
              <img
                src={
                  result?.processed_image
                    ? `data:image/jpeg;base64,${result.processed_image}`
                    : preview
                }
                alt="preview"
                style={styles.previewImg}
              />
              <div style={styles.previewFooter}>
                <span style={styles.fileName}>{file.name}</span>
                <span style={styles.fileSize}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          )}

          {/* Controls */}
          {file && (
            <div style={styles.controls}>
              <ConfidenceSlider value={confidence} onChange={setConfidence} />

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  style={{
                    ...styles.analyzeBtn,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading ? (
                    <>
                      <span style={styles.spinner} /> Analyzing…
                    </>
                  ) : (
                    '⚡ Analyze PPE'
                  )}
                </button>

                {result?.processed_image && (
                  <button onClick={handleDownload} style={styles.downloadBtn}>
                    ↓ Download
                  </button>
                )}
              </div>
            </div>
          )}

          {error && (
            <div style={styles.errorBox}>
              <span>⚠ {error}</span>
            </div>
          )}
        </div>

        {/* Right column — results */}
        {result && (
          <div style={styles.right}>
            <ComplianceBadge
              status={result.status}
              complianceRate={result.compliance_rate}
            />
            <DetectionSummary
              summary={result.summary}
              detections={result.detections}
              inferenceMs={result.inference_time_ms}
            />
          </div>
        )}

        {!result && !file && (
          <div style={styles.emptyRight}>
            <div style={styles.emptyIcon}>🔍</div>
            <p style={styles.emptyText}>
              Upload an image to see<br />compliance results here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 28, minHeight: '100%' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 32, marginBottom: 4 },
  subtitle: { color: 'var(--text-muted)', fontSize: 14 },
  resetBtn: {
    padding: '8px 16px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-secondary)',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all var(--transition)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 28,
    alignItems: 'start',
  },
  left: { display: 'flex', flexDirection: 'column', gap: 16 },
  right: { display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeInUp 0.4s ease' },
  previewCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  previewLabel: {
    padding: '10px 16px',
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--border)',
    fontWeight: 500,
  },
  previewImg: {
    width: '100%',
    display: 'block',
    maxHeight: 420,
    objectFit: 'contain',
    background: '#000',
  },
  previewFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 16px',
    fontSize: 12,
    color: 'var(--text-muted)',
    borderTop: '1px solid var(--border)',
  },
  fileName: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' },
  fileSize: { fontFamily: 'JetBrains Mono, monospace', flexShrink: 0 },
  controls: { display: 'flex', flexDirection: 'column', gap: 12 },
  analyzeBtn: {
    flex: 1,
    padding: '12px 24px',
    background: 'var(--brand-orange)',
    color: '#fff',
    fontFamily: 'Rajdhani, sans-serif',
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: '0.05em',
    borderRadius: 'var(--radius)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 4px 16px rgba(249,115,22,0.3)',
    transition: 'all var(--transition)',
  },
  spinner: {
    display: 'inline-block',
    width: 14,
    height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  downloadBtn: {
    padding: '12px 18px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-primary)',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all var(--transition)',
  },
  errorBox: {
    padding: '12px 16px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 'var(--radius)',
    color: 'var(--non-compliant)',
    fontSize: 13,
  },
  emptyRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    minHeight: 300,
    background: 'var(--bg-card)',
    border: '1px dashed var(--border)',
    borderRadius: 'var(--radius-lg)',
  },
  emptyIcon: { fontSize: 40, opacity: 0.4 },
  emptyText: { color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', lineHeight: 1.8 },
}
