import React, { useState, useCallback } from 'react'
import DropZone from '../components/upload/DropZone'
import ConfidenceSlider from '../components/upload/ConfidenceSlider'
import ComplianceBadge from '../components/results/ComplianceBadge'
import DetectionSummary from '../components/results/DetectionSummary'
import { predictVideo, getOutputVideoUrl } from '../services/api'

const ACCEPT = {
  'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm'],
}

export default function VideoPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [confidence, setConfidence] = useState(0.25)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
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
    setUploadProgress(0)
    try {
      const data = await predictVideo(file, confidence, setUploadProgress)
      setResult(data)
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Video inference failed')
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  const outputUrl = result ? getOutputVideoUrl(result.output_video_url) : null

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Video Analysis</h1>
          <p style={styles.subtitle}>Process a video for frame-by-frame PPE compliance</p>
        </div>
        {result && (
          <button onClick={handleReset} style={styles.resetBtn}>
            ↩ New Video
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
              label="Drop your video here"
              hint="MP4, AVI, MOV, MKV, WebM — max 500 MB"
            />
          ) : (
            <div style={styles.previewCard}>
              <div style={styles.previewLabel}>
                {result ? 'Processed Output' : 'Preview'}
              </div>
              <video
                key={outputUrl || preview}
                src={outputUrl || preview}
                controls
                style={styles.previewVideo}
              />
              <div style={styles.previewFooter}>
                <span style={styles.fileName}>{file.name}</span>
                <span style={styles.fileSize}>
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
            </div>
          )}

          {file && (
            <div style={styles.controls}>
              <ConfidenceSlider value={confidence} onChange={setConfidence} />

              {loading && uploadProgress > 0 && uploadProgress < 100 && (
                <div style={styles.progressWrap}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <span>Uploading…</span>
                    <span className="mono">{uploadProgress}%</span>
                  </div>
                  <div style={styles.progressTrack}>
                    <div style={{ ...styles.progressBar, width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {loading && uploadProgress >= 100 && (
                <div style={styles.processingBox}>
                  <span style={styles.spinner} />
                  <span>Processing video on server… this may take a while</span>
                </div>
              )}

              {!loading && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={handleAnalyze}
                    style={styles.analyzeBtn}
                  >
                    ⚡ Analyze Video
                  </button>
                  {outputUrl && (
                    <a
                      href={outputUrl}
                      download={`ppe_video_${Date.now()}.mp4`}
                      style={styles.downloadBtn}
                    >
                      ↓ Download
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <div style={styles.errorBox}>⚠ {error}</div>
          )}
        </div>

        {/* Right column */}
        {result ? (
          <div style={styles.right}>
            <ComplianceBadge
              status={result.status}
              complianceRate={result.compliance_rate}
            />

            {/* Video stats */}
            <div style={styles.statsGrid}>
              {[
                { label: 'Total Frames', value: result.total_frames, icon: '🎞' },
                { label: 'Processed', value: result.processed_frames, icon: '✅' },
                { label: 'Source FPS', value: result.fps.toFixed(1), icon: '⏱' },
                { label: 'Processing FPS', value: result.average_fps_processing.toFixed(1), icon: '⚡' },
                { label: 'Duration', value: `${result.duration_seconds.toFixed(1)}s`, icon: '🕐' },
                { label: 'Process Time', value: `${result.processing_time_seconds.toFixed(1)}s`, icon: '⏳' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={styles.statCard}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <div>
                    <div style={styles.statValue}>{value}</div>
                    <div style={styles.statLabel}>{label}</div>
                  </div>
                </div>
              ))}
            </div>

            <DetectionSummary summary={result.summary} />
          </div>
        ) : (
          !file && (
            <div style={styles.emptyRight}>
              <div style={{ fontSize: 40, opacity: 0.4 }}>🎬</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', lineHeight: 1.8 }}>
                Upload a video to see<br />compliance results here
              </p>
            </div>
          )
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
  previewVideo: {
    width: '100%',
    display: 'block',
    maxHeight: 360,
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
  progressWrap: {},
  progressTrack: {
    height: 6,
    background: 'var(--bg-input)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: 'var(--brand-orange)',
    borderRadius: 999,
    transition: 'width 0.3s ease',
    boxShadow: '0 0 8px rgba(249,115,22,0.5)',
  },
  processingBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    background: 'rgba(249,115,22,0.08)',
    border: '1px solid rgba(249,115,22,0.2)',
    borderRadius: 'var(--radius)',
    fontSize: 13,
    color: 'var(--brand-orange)',
  },
  spinner: {
    display: 'inline-block',
    width: 16,
    height: 16,
    border: '2px solid rgba(249,115,22,0.3)',
    borderTopColor: 'var(--brand-orange)',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  },
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
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(249,115,22,0.3)',
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
    display: 'inline-flex',
    alignItems: 'center',
  },
  errorBox: {
    padding: '12px 16px',
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 'var(--radius)',
    color: 'var(--non-compliant)',
    fontSize: 13,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 8,
  },
  statCard: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  statValue: {
    fontFamily: 'Rajdhani, sans-serif',
    fontWeight: 700,
    fontSize: 18,
    color: 'var(--text-primary)',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 10,
    color: 'var(--text-muted)',
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
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
}
