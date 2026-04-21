import React from 'react'

export default function ConfidenceSlider({ value, onChange }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '14px 18px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <label
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Confidence Threshold
        </label>
        <span
          className="mono"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--brand-orange)',
            background: 'rgba(249,115,22,0.1)',
            padding: '2px 8px',
            borderRadius: 4,
          }}
        >
          {Math.round(value * 100)}%
        </span>
      </div>

      <input
        type="range"
        min={0.05}
        max={0.95}
        step={0.05}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', cursor: 'pointer' }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: 'var(--text-muted)',
          marginTop: 4,
        }}
      >
        <span>Low (more detections)</span>
        <span>High (fewer detections)</span>
      </div>
    </div>
  )
}
