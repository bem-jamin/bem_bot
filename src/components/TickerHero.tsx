import { useMemo } from 'react'
import { computePeriod, netRatePerSecond, SOFAR_LABELS, TOTAL_LABELS } from '../lib/finance'
import { splitTickerValue, formatRate } from '../lib/format'
import { useLiveClock } from '../lib/useLiveClock'
import type { PeriodMode, PeriodUnit, RecurringItem, Transaction } from '../lib/types'

interface Props {
  unit: PeriodUnit
  mode: PeriodMode
  recurring: RecurringItem[]
  transactions: Transaction[]
}

export function TickerHero({ unit, mode, recurring, transactions }: Props) {
  const now = useLiveClock()

  const isRateOnly = unit === 'second' || unit === 'hour'

  const rate = useMemo(() => netRatePerSecond(recurring, now), [recurring, now])

  const period = useMemo(
    () => (isRateOnly ? null : computePeriod(unit, mode, recurring, transactions, now)),
    [isRateOnly, unit, mode, recurring, transactions, now],
  )

  const value = isRateOnly ? (unit === 'second' ? rate : rate * 3600) : (period?.total ?? 0)
  const { negative, main, extraDigits } = splitTickerValue(value, isRateOnly ? 4 : 3)
  const positive = value >= 0

  const label = isRateOnly
    ? unit === 'second'
      ? 'right now, per second'
      : "this hour's rate"
    : mode === 'soFar'
      ? SOFAR_LABELS[unit]
      : TOTAL_LABELS[unit]

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      <div
        className="flex items-baseline justify-center gap-0.5 tabular transition-colors duration-300"
        style={{ color: positive ? 'var(--color-income)' : 'var(--color-expense)' }}
      >
        <span className="text-3xl font-semibold sm:text-4xl">{negative ? '−' : ''}</span>
        <span className="text-5xl font-bold tracking-tight sm:text-6xl">{main}</span>
        <span className="text-xl font-semibold opacity-40 sm:text-2xl">{extraDigits}</span>
      </div>
      <div className="text-sm font-medium text-[var(--color-muted)]">{label}</div>
      {!isRateOnly && (
        <div className="tabular text-xs text-[var(--color-faint)]">
          {formatRate(rate, 'second', 4)}/s · {formatRate(rate, 'hour', 2)}/hr
        </div>
      )}
    </div>
  )
}
