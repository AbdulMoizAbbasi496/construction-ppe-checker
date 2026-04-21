import React from 'react'

const STATUS_CONFIG = {
  COMPLIANT: {
    label: '✓ COMPLIANT',
    color: 'var(--compliant)',
    dimColor: 'var(--compliant-dim)',
    glow: 'var(--compliant-glow)',
    bg: 'rgba(34, 197, 94, 0.08)',
    border: 'rgba(34, 197, 94, 0.3)',
    desc: 'All detected personnel are wearing required PPE.',
  },
  'NON-COMPLIANT': {
    label: '✗ NON-COMPLIANT',
    color: 'var(--non-compliant)',
    dimColor: 'var(--non-compliant-dim)',
    glow: 'var(--non-compliant-glow)',
    bg: 'rgba(239, 68, 68, 0.08)',
    border: 'rgba(239, 68, 68, 0.3)',
    desc: 'PPE violations detected. Immediate action required.',
  },
  'NO-PERSON-DETECTED': {
    label: '— NO PERSON DETECTED',
    color: 'var(--no-person)',
    dimColor: '#334155',
    glow: 'transparent',
    bg: 'rgba(148, 163, 184, 0.06)',
    border: 'rgba(148, 163, 184, 0.2)',
    desc: 'No personnel found in the scene.',
  },
}

export default function ComplianceBadge({ status, complianceRate, size = 'large' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['NO-PERSON-DETECTED']
  const isLarge = size === 'large'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: isLarge ? '28px 36px' : '16px 20px',
        background: cfg.bg,
        border: `2px solid ${cfg.border}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: `0 0 32px ${cfg.glow}`,
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInUp 0.4s ease',
      }}
    >
      {/* Pulse ring for non-compliant */}
      {status === 'NON-COMPLIANT' && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--radius-lg)',
            border: `2px solid ${cfg.color}`,
            animation: 'pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Main label */}
      <div
        style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 700,
          fontSize: isLarge ? 28 : 18,
          color: cfg.color,
          letterSpacing: '0.06em',
          textShadow: `0 0 12px ${cfg.glow}`,
        }}
      >
        {cfg.label}
      </div>

      {/* Compliance rate bar */}
      {complianceRate !== undefined && status !== 'NO-PERSON-DETECTED' && (
        <div style={{ width: '100%', maxWidth: 240 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              color: 'var(--text-muted)',
              marginBottom: 4,
            }}
          >
            <span>Compliance Rate</span>
            <span style={{ color: cfg.color, fontWeight: 600 }}>
              {Math.round(complianceRate * 100)}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: 'var(--bg-input)',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.round(complianceRate * 100)}%`,
                background: cfg.color,
                borderRadius: 999,
                transition: 'width 0.8s ease',
                boxShadow: `0 0 8px ${cfg.glow}`,
              }}
            />
          </div>
        </div>
      )}

      {/* Description */}
      {isLarge && (
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-secondary)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          {cfg.desc}
        </p>
      )}
    </div>
  )
}
