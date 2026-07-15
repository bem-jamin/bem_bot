import { useMemo, useState } from 'react'
import { useStore } from '../lib/store'
import { monthToDateExpenses } from '../lib/finance'
import { formatAUD } from '../lib/format'
import { useLiveClock } from '../lib/useLiveClock'

export function Budget() {
  const { recurring, transactions, budget, setBudget } = useStore()
  const [draft, setDraft] = useState(budget.monthlyLimit != null ? String(budget.monthlyLimit) : '')
  const now = useLiveClock()

  const spent = useMemo(() => monthToDateExpenses(recurring, transactions, now), [recurring, transactions, now])
  const limit = budget.monthlyLimit
  const pct = limit && limit > 0 ? Math.min(100, (spent / limit) * 100) : null

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dayOfMonth = now.getDate()
  const expectedPct = (dayOfMonth / daysInMonth) * 100

  let barColor = 'var(--color-income)'
  if (pct !== null) {
    if (pct >= 100) barColor = 'var(--color-expense)'
    else if (pct > expectedPct + 10) barColor = '#fbbf24'
  }

  function saveLimit() {
    const value = parseFloat(draft)
    setBudget({ monthlyLimit: Number.isFinite(value) && value > 0 ? value : null })
  }

  return (
    <div className="flex flex-col gap-8 px-5 pt-8 pb-28">
      <h1 className="text-xl font-bold text-[var(--color-ink)]">Budget</h1>

      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-5">
        <div className="mb-1 text-xs font-medium text-[var(--color-muted)]">Spent this month</div>
        <div className="tabular text-3xl font-bold text-[var(--color-ink)]">{formatAUD(spent)}</div>
        {limit != null && (
          <div className="tabular mt-1 text-xs text-[var(--color-faint)]">
            of {formatAUD(limit)} budget · {formatAUD(Math.max(0, limit - spent))} remaining
          </div>
        )}

        {pct !== null && (
          <div className="mt-4">
            <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-surface-raised)]">
              <div
                className="h-full rounded-full transition-[width] duration-500"
                style={{ width: `${pct}%`, background: barColor }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-[var(--color-faint)]">
              <span>{pct.toFixed(1)}% used</span>
              <span>Day {dayOfMonth} of {daysInMonth}</span>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] p-5">
        <div className="mb-3 text-sm font-semibold text-[var(--color-ink)]">Monthly budget limit</div>
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            inputMode="decimal"
            placeholder="e.g. 2000"
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
          />
          <button onClick={saveLimit} className="rounded-xl px-4 py-2.5 text-sm font-bold" style={{ background: 'var(--color-accent)', color: '#0a0e16' }}>
            Save
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[var(--color-faint)]">
          Tracks all expense transactions and recurring expenses accrued since the start of this calendar month, ticking live as
          recurring costs accrue.
        </p>
      </div>
    </div>
  )
}
