import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkHealth } from '../services/api'

const RULES = [
  { icon: '⛑️', rule: 'Hardhat required', note: 'Must be worn at all times on site' },
  { icon: '🦺', rule: 'Safety Vest required', note: 'High-visibility vest mandatory' },
  { icon: '😷', rule: 'Mask optional', note: 'Required in designated zones' },
]

const QUICK_LINKS = [
  { to: '/image', icon: '🖼', label: 'Image Analysis', desc: 'Check a photo for PPE violations' },
  { to: '/video', icon: '🎬', label: 'Video Analysis', desc: 'Process a video frame-by-frame' },
]

export default function Dashboard({ health }) {
  const navigate = useNavigate()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={styles.page}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div>
          <h1 style={styles.title}>Control Dashboard</h1>
          <p style={styles.subtitle}>Construction Site PPE Compliance Monitoring System</p>
        </div>
        <div style={styles.clock}>
          <div className="mono" style={styles.clockTime}>
            {time.toLocaleTimeString()}
          </div>
          <div style={styles.clockDate}>{time.toLocaleDateString()}</div>
        </div>
      </div>

      {/* Model status banner */}
      <div
        style={{
          ...styles.statusBanner,
          background: health?.model_loaded
            ? 'rgba(34,197,94,0.08)'
            : 'rgba(239,68,68,0.08)',
          border: `1px solid ${health?.model_loaded ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
        }}
      >
        <div
          style={{
            ...styles.statusDot,
            background: health?.model_loaded ? 'var(--compliant)' : 'var(--non-compliant)',
            boxShadow: health?.model_loaded
              ? '0 0 10px var(--compliant)'
              : '0 0 10px var(--non-compliant)',
          }}
        />
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>
            {health?.model_loaded
              ? 'YOLOv8 Model Loaded & Ready'
              : 'Model Not Loaded — Check Backend'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
            {health?.model_path || 'No model path available'}
          </div>
        </div>
        <div
          style={{
            marginLeft: 'auto',
            padding: '4px 12px',
            borderRadius: 4,
            background: health?.model_loaded
              ? 'rgba(34,197,94,0.15)'
              : 'rgba(239,68,68,0.15)',
            color: health?.model_loaded ? 'var(--compliant)' : 'var(--non-compliant)',
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          {health?.status?.toUpperCase() || 'UNKNOWN'}
        </div>
      </div>

      {/* Quick access */}
      <div>
        <h2 style={styles.sectionTitle}>Quick Access</h2>
        <div style={styles.quickGrid}>
          {QUICK_LINKS.map(({ to, icon, label, desc }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              style={styles.quickCard}
            >
              <span style={styles.quickIcon}>{icon}</span>
              <div style={styles.quickText}>
                <div style={styles.quickLabel}>{label}</div>
                <div style={styles.quickDesc}>{desc}</div>
              </div>
              <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 20 }}>→</span>
            </button>
          ))}
        </div>
      </div>

      {/* PPE Rules */}
      <div>
        <h2 style={styles.sectionTitle}>Compliance Rules</h2>
        <div style={styles.rulesGrid}>
          {RULES.map(({ icon, rule, note }) => (
            <div key={rule} style={styles.ruleCard}>
              <span style={{ fontSize: 28 }}>{icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{rule}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info strip */}
      <div style={styles.infoStrip}>
        <div style={styles.infoItem}>
          <span style={styles.infoIcon}>🎯</span>
          <span>YOLOv8 Object Detection</span>
        </div>
        <div style={styles.infoDivider} />
        <div style={styles.infoItem}>
          <span style={styles.infoIcon}>⚡</span>
          <span>Real-time Inference</span>
        </div>
        <div style={styles.infoDivider} />
        <div style={styles.infoItem}>
          <span style={styles.infoIcon}>🔒</span>
          <span>PPE Compliance Enforcement</span>
        </div>
        <div style={styles.infoDivider} />
        <div style={styles.infoItem}>
          <span style={styles.infoIcon}>📊</span>
          <span>Detailed Analytics</span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 28 },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 36, marginBottom: 4 },
  subtitle: { color: 'var(--text-muted)', fontSize: 14 },
  clock: { textAlign: 'right' },
  clockTime: { fontSize: 26, fontWeight: 500, color: 'var(--brand-orange)', letterSpacing: '0.05em' },
  clockDate: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  statusBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '16px 20px',
    borderRadius: 'var(--radius-lg)',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: 13,
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: 14,
    fontWeight: 500,
  },
  quickGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  quickCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '20px 22px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    cursor: 'pointer',
    transition: 'all var(--transition)',
    textAlign: 'left',
    color: 'inherit',
  },
  quickIcon: { fontSize: 32, flexShrink: 0 },
  quickText: { flex: 1 },
  quickLabel: { fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 18 },
  quickDesc: { fontSize: 12, color: 'var(--text-muted)', marginTop: 3 },
  rulesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 },
  ruleCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '18px 20px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
  },
  infoStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    padding: '14px 20px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: 'var(--text-secondary)',
  },
  infoIcon: { fontSize: 16 },
  infoDivider: {
    width: 1,
    height: 18,
    background: 'var(--border)',
  },
}
