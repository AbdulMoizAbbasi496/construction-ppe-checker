import React from 'react'
import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/',       icon: '⬡', label: 'Dashboard' },
  { to: '/image',  icon: '◈', label: 'Image Check' },
  { to: '/video',  icon: '▶', label: 'Video Check' },
]

export default function Sidebar({ health }) {
  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <span style={styles.logoIcon}>⚠</span>
        <div>
          <div style={styles.logoTitle}>PPE Guard</div>
          <div style={styles.logoSub}>Safety Compliance</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.navItemActive : {}),
            })}
          >
            <span style={styles.navIcon}>{icon}</span>
            <span>{label}</span>
            {({ isActive }) => isActive && <span style={styles.navIndicator} />}
          </NavLink>
        ))}
      </nav>

      {/* Status Indicator */}
      <div style={styles.statusBox}>
        <div style={styles.statusRow}>
          <span
            style={{
              ...styles.statusDot,
              background: health?.model_loaded ? 'var(--compliant)' : 'var(--non-compliant)',
              boxShadow: health?.model_loaded
                ? '0 0 8px var(--compliant)'
                : '0 0 8px var(--non-compliant)',
            }}
          />
          <span style={styles.statusLabel}>
            {health?.model_loaded ? 'Model Ready' : 'Model Offline'}
          </span>
        </div>
        <div style={styles.statusSub}>YOLOv8 · PPE Detection</div>
      </div>

      {/* Hazard stripe decoration */}
      <div style={styles.stripe} />
    </aside>
  )
}

const styles = {
  sidebar: {
    width: 220,
    minHeight: '100vh',
    background: 'var(--bg-panel)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '28px 20px 24px',
    borderBottom: '1px solid var(--border)',
  },
  logoIcon: {
    fontSize: 28,
    color: 'var(--brand-orange)',
    lineHeight: 1,
  },
  logoTitle: {
    fontFamily: 'Rajdhani, sans-serif',
    fontWeight: 700,
    fontSize: 18,
    color: 'var(--text-primary)',
    letterSpacing: '0.05em',
  },
  logoSub: {
    fontSize: 10,
    color: 'var(--text-muted)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginTop: 1,
  },
  nav: {
    padding: '16px 12px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 'var(--radius)',
    color: 'var(--text-secondary)',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all var(--transition)',
    position: 'relative',
  },
  navItemActive: {
    background: 'rgba(249, 115, 22, 0.12)',
    color: 'var(--brand-orange)',
    borderLeft: '3px solid var(--brand-orange)',
  },
  navIcon: {
    fontSize: 16,
    width: 20,
    textAlign: 'center',
  },
  navIndicator: {
    position: 'absolute',
    right: 10,
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--brand-orange)',
  },
  statusBox: {
    margin: '0 12px 16px',
    padding: '12px 14px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  statusSub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    paddingLeft: 16,
  },
  stripe: {
    height: 8,
    background: 'repeating-linear-gradient(90deg, var(--brand-orange) 0px, var(--brand-orange) 12px, #1a1e27 12px, #1a1e27 24px)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
}
