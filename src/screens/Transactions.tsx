import { useMemo, useState } from 'react'
import { useStore } from '../lib/store'
import { uid } from '../lib/storage'
import type { EntryType } from '../lib/types'
import { formatAUD } from '../lib/format'
import { Sheet } from '../components/Sheet'

const emptyForm = { name: '', amount: '', type: 'expense' as EntryType }

export function Transactions() {
  const { transactions, setTransactions } = useStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const grouped = useMemo(() => groupByDay(transactions), [transactions])

  function save() {
    const amount = parseFloat(form.amount)
    if (!form.name.trim() || !Number.isFinite(amount) || amount <= 0) return
    setTransactions((prev) => [
      { id: uid(), name: form.name.trim(), amount, type: form.type, timestamp: new Date().toISOString() },
      ...prev,
    ])
    setForm(emptyForm)
    setOpen(false)
  }

  function remove(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="flex flex-col gap-6 px-5 pt-8 pb-28">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--color-ink)]">Transactions</h1>
        <button
          onClick={() => setOpen(true)}
          className="rounded-full px-4 py-2 text-sm font-semibold"
          style={{ background: 'var(--color-accent)', color: '#0a0e16' }}
        >
          + Add
        </button>
      </div>

      {grouped.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-10 text-center text-xs text-[var(--color-faint)]">
          No transactions logged yet. Tap "+ Add" to log a one-off income or expense.
        </div>
      ) : (
        grouped.map(([day, items]) => (
          <section key={day} className="flex flex-col gap-2">
            <h2 className="text-xs font-semibold text-[var(--color-faint)]">{day}</h2>
            <div className="flex flex-col gap-2">
              {items.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-medium text-[var(--color-ink)]">{t.name}</div>
                    <div className="text-xs text-[var(--color-faint)]">
                      {new Date(t.timestamp).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="tabular text-sm font-semibold"
                      style={{ color: t.type === 'income' ? 'var(--color-income)' : 'var(--color-expense)' }}
                    >
                      {t.type === 'income' ? '+' : '−'}
                      {formatAUD(t.amount)}
                    </div>
                    <button onClick={() => remove(t.id)} className="text-xs text-[var(--color-faint)]">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      <Sheet open={open} onClose={() => setOpen(false)} title="Log transaction">
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-muted)]">Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Coffee, Freelance payment"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-[var(--color-muted)]">Amount (AUD)</span>
            <input
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              inputMode="decimal"
              placeholder="0.00"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
            />
          </label>

          <div className="flex gap-2">
            {(['income', 'expense'] as EntryType[]).map((t) => (
              <button
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className="flex-1 rounded-xl border py-2.5 text-sm font-semibold capitalize transition-colors"
                style={
                  form.type === t
                    ? {
                        borderColor: t === 'income' ? 'var(--color-income)' : 'var(--color-expense)',
                        background: t === 'income' ? 'var(--color-income-dim)' : 'var(--color-expense-dim)',
                        color: t === 'income' ? 'var(--color-income)' : 'var(--color-expense)',
                      }
                    : { borderColor: 'var(--color-border)', color: 'var(--color-faint)' }
                }
              >
                {t}
              </button>
            ))}
          </div>

          <button onClick={save} className="mt-2 rounded-xl py-3 text-sm font-bold" style={{ background: 'var(--color-accent)', color: '#0a0e16' }}>
            Log transaction
          </button>
        </div>
      </Sheet>
    </div>
  )
}

function groupByDay(transactions: ReturnType<typeof useStore>['transactions']) {
  const sorted = [...transactions].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  const map = new Map<string, typeof sorted>()
  for (const t of sorted) {
    const key = new Date(t.timestamp).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(t)
  }
  return Array.from(map.entries())
}
