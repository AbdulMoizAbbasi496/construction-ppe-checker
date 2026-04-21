import React from 'react'

function StatCard({ icon, label, value, color, highlight }) {
  return (
    <div
      style={{
        background: highlight ? `rgba(${color}, 0.1)` : 'var(--bg-input)',
        border: `1px solid ${highlight ? `rgba(${color}, 0.3)` : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <div
          style={{
            fontSize: 22,
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            color: highlight ? `rgb(${color})` : 'var(--text-primary)',
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          {label}
        </div>
      </div>
    </div>
  )
}

export default function DetectionSummary({ summary, detections, inferenceMs }) {
  if (!summary) return null

  const stats = [
    { icon: '👷', label: 'Persons', value: summary.total_persons, color: '250,204,21', highlight: false },
    { icon: '⛑️', label: 'Hardhats', value: summary.hardhat_count, color: '34,197,94', highlight: summary.hardhat_count > 0 },
    { icon: '🦺', label: 'Safety Vests', value: summary.vest_count, color: '34,197,94', highlight: summary.vest_count > 0 },
    { icon: '🚫⛑️', label: 'No Hardhat', value: summary.no_hardhat_count, color: '239,68,68', highlight: summary.no_hardhat_count > 0 },
    { icon: '🚫🦺', label: 'No Vest', value: summary.no_vest_count, color: '239,68,68', highlight: summary.no_vest_count > 0 },
    { icon: '⚠️', label: 'Violations', value: summary.violation_count, color: '239,68,68', highlight: summary.violation_count > 0 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stat grid */}
      <div>
        <h3 style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
          Detection Summary
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 8,
          }}
        >
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* Detections list */}
      {detections && detections.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            All Detections
          </h3>
          <div
            style={{
              background: 'var(--bg-input)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Class', 'Confidence', 'Type'].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '8px 14px',
                        textAlign: 'left',
                        color: 'var(--text-muted)',
                        fontWeight: 500,
                        fontSize: 11,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detections.map((det, i) => {
                  const isViolation = det.class.startsWith('NO-')
                  const isPerson = det.class === 'Person'
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: i < detections.length - 1 ? '1px solid var(--border)' : 'none',
                        background: isViolation ? 'rgba(239,68,68,0.04)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '9px 14px', fontWeight: 500, color: isViolation ? 'var(--non-compliant)' : 'var(--text-primary)' }}>
                        {det.class}
                      </td>
                      <td style={{ padding: '9px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 4, background: 'var(--bg-card)', borderRadius: 999 }}>
                            <div
                              style={{
                                height: '100%',
                                width: `${Math.round(det.confidence * 100)}%`,
                                background: isViolation ? 'var(--non-compliant)' : 'var(--compliant)',
                                borderRadius: 999,
                              }}
                            />
                          </div>
                          <span className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 36 }}>
                            {(det.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '9px 14px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: 4,
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            background: isViolation
                              ? 'rgba(239,68,68,0.15)'
                              : isPerson
                              ? 'rgba(250,204,21,0.12)'
                              : 'rgba(34,197,94,0.12)',
                            color: isViolation
                              ? 'var(--non-compliant)'
                              : isPerson
                              ? 'var(--brand-yellow)'
                              : 'var(--compliant)',
                          }}
                        >
                          {isViolation ? 'VIOLATION' : isPerson ? 'PERSON' : 'PPE'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inference time */}
      {inferenceMs !== undefined && (
        <div
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>⚡</span>
          <span className="mono">Inference: {inferenceMs.toFixed(1)} ms</span>
        </div>
      )}
    </div>
  )
}
