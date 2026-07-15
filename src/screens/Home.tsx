import { useState } from 'react'
import { TickerHero } from '../components/TickerHero'
import { PeriodTabs } from '../components/PeriodTabs'
import { useStore } from '../lib/store'
import type { PeriodMode, PeriodUnit } from '../lib/types'
import { formatAUD } from '../lib/format'
import { signedAmount } from '../lib/finance'

export function Home() {
  const { recurring, transactions } = useStore()
  const [unit, setUnit] = useState<PeriodUnit>('day')
  const [mode, setMode] = useState<PeriodMode>('soFar')

  const activeRecurring = recurring.filter((r) => r.active)
  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-8 px-5 pt-8">
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 shadow-[0_0_40px_-15px_rgba(96,165,250,0.25)]">
        <TickerHero unit={unit} mode={mode} recurring={recurring} transactions={transactions} />
        <div className="mt-6">
          <PeriodTabs unit={unit} onUnit={setUnit} mode={mode} onMode={setMode} />
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--color-muted)]">Active recurring</h2>
          <span className="text-xs text-[var(--color-faint)]">{activeRecurring.length}</span>
        </div>
        {activeRecurring.length === 0 ? (
          <EmptyRow text="No recurring income or expenses yet. Add one in the Recurring tab." />
        ) : (
          <div className="flex flex-col gap-2">
            {activeRecurring.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] px-4 py-3"
              >
                <div>
                  <div className="text-sm font-medium text-[var(--color-ink)]">{item.name}</div>
                  <div className="text-xs text-[var(--color-faint)] capitalize">{item.frequency}</div>
                </div>
                <div
                  className="tabular text-sm font-semibold"
                  style={{ color: item.type === 'income' ? 'var(--color-income)' : 'var(--color-expense)' }}
                >
                  {item.type === 'income' ? '+' : '−'}
                  {formatAUD(item.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3 pb-28">
        <h2 className="text-sm font-semibold text-[var(--color-muted)]">Recent activity</h2>
        {recentTx.length === 0 ? (
          <EmptyRow text="No one-off transactions logged yet." />
        ) : (
          <div className="flex flex-col gap-2">
            {recentTx.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] px-4 py-3"
              >
                <div>
                  <div className="text-sm font-medium text-[var(--color-ink)]">{t.name}</div>
                  <div className="text-xs text-[var(--color-faint)]">
                    {new Date(t.timestamp).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                <div
                  className="tabular text-sm font-semibold"
                  style={{ color: signedAmount(t) >= 0 ? 'var(--color-income)' : 'var(--color-expense)' }}
                >
                  {t.type === 'income' ? '+' : '−'}
                  {formatAUD(t.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-6 text-center text-xs text-[var(--color-faint)]">
      {text}
    </div>
  )
}
