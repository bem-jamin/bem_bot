import { PERIOD_LABELS } from '../lib/finance'
import type { PeriodMode, PeriodUnit } from '../lib/types'

const UNITS: PeriodUnit[] = ['second', 'hour', 'day', 'week', 'month', 'year']

interface Props {
  unit: PeriodUnit
  onUnit: (u: PeriodUnit) => void
  mode: PeriodMode
  onMode: (m: PeriodMode) => void
}

export function PeriodTabs({ unit, onUnit, mode, onMode }: Props) {
  const showModeToggle = unit !== 'second' && unit !== 'hour'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1 overflow-x-auto rounded-full bg-[var(--color-surface-solid)] p-1 border border-[var(--color-border)]">
        {UNITS.map((u) => (
          <button
            key={u}
            onClick={() => onUnit(u)}
            className="rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors"
            style={
              u === unit
                ? { background: 'var(--color-accent)', color: '#0a0e16' }
                : { color: 'var(--color-muted)' }
            }
          >
            {PERIOD_LABELS[u]}
          </button>
        ))}
      </div>

      <div
        className="flex gap-1 rounded-full bg-[var(--color-surface-solid)] p-1 border border-[var(--color-border)] transition-opacity"
        style={{ opacity: showModeToggle ? 1 : 0, pointerEvents: showModeToggle ? 'auto' : 'none' }}
      >
        <button
          onClick={() => onMode('soFar')}
          className="rounded-full px-4 py-1 text-xs font-semibold transition-colors"
          style={mode === 'soFar' ? { background: 'var(--color-surface-raised)', color: 'var(--color-ink)' } : { color: 'var(--color-faint)' }}
        >
          So far
        </button>
        <button
          onClick={() => onMode('total')}
          className="rounded-full px-4 py-1 text-xs font-semibold transition-colors"
          style={mode === 'total' ? { background: 'var(--color-surface-raised)', color: 'var(--color-ink)' } : { color: 'var(--color-faint)' }}
        >
          Total
        </button>
      </div>
    </div>
  )
}
