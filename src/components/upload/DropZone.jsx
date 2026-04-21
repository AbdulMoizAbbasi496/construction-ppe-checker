import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

export default function DropZone({ accept, onFile, label, hint, disabled }) {
  const [hover, setHover] = useState(false)

  const onDrop = useCallback(
    (accepted) => {
      if (accepted.length > 0) onFile(accepted[0])
    },
    [onFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    disabled,
  })

  const active = isDragActive || hover

  return (
    <div
      {...getRootProps()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: `2px dashed ${active ? 'var(--brand-orange)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        background: active
          ? 'rgba(249,115,22,0.06)'
          : 'var(--bg-input)',
        padding: '52px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition)',
        boxShadow: active ? 'var(--shadow-glow-orange)' : 'none',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
      }}
    >
      <input {...getInputProps()} />

      {/* Icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: active ? 'rgba(249,115,22,0.15)' : 'var(--bg-card)',
          border: `2px solid ${active ? 'var(--brand-orange)' : 'var(--border)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          transition: 'all var(--transition)',
          boxShadow: active ? '0 0 16px rgba(249,115,22,0.3)' : 'none',
        }}
      >
        {isDragActive ? '📂' : '📁'}
      </div>

      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 18,
            fontWeight: 600,
            color: active ? 'var(--brand-orange)' : 'var(--text-primary)',
            transition: 'color var(--transition)',
          }}
        >
          {isDragActive ? 'Drop it here!' : label || 'Drag & Drop or Click to Upload'}
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          {hint}
        </p>
      </div>
    </div>
  )
}
