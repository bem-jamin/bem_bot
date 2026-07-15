import { useState, type ReactNode } from 'react'
import { useStore } from '../lib/store'
import { uid } from '../lib/storage'
import type { EntryType, Frequency, RecurringItem } from '../lib/types'
import { formatAUD } from '../lib/format'
import { Sheet } from '../components/Sheet'

const FREQUENCIES: Frequency[] = ['second', 'hour', 'day', 'week', 'month', 'year']

const emptyForm = {
  name: '',
  amount: '',
  type: 'income' as EntryType,
  frequency: 'month' as Frequency,
}

export function Recurring() {
  const { recurring, setRecurring } = useStore()
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  const income = recurring.filter((r) => r.type === 'income')
  const expenses = recurring.filter((r) => r.type === 'expense')

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setOpen(true)
  }

  function openEdit(item: RecurringItem) {
    setEditingId(item.id)
    setForm({ name: item.name, amount: String(item.amount), type: item.type, frequency: item.frequency })
    setOpen(true)
  }

  function save() {
    const amount = parseFloat(form.amount)
    if (!form.name.trim() || !Number.isFinite(amount) || amount <= 0) return

    if (editingId) {
      setRecurring((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, name: form.name.trim(), amount, type: form.type, frequency: form.frequency } : r)),
      )
    } else {
      const item: RecurringItem = {
        id: uid(),
        name: form.name.trim(),
        amount,
        type: form.type,
        frequency: form.frequency,
        startDate: new Date().toISOString(),
        active: true,
      }
      setRecurring((prev) => [item, ...prev])
    }
    setOpen(false)
  }

  function remove(id: string) {
    setRecurring((prev) => prev.filter((r) => r.id !== id))
    setOpen(false)
  }

  function toggleActive(id: string) {
    setRecurring((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)))
  }

  return (
    <div className="flex flex-col gap-8 px-5 pt-8 pb-28">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--color-ink)]">Recurring</h1>
        <button
          onClick={openNew}
          className="rounded-full px-4 py-2 text-sm font-semibold"
          style={{ background: 'var(--color-accent)', color: '#0a0e16' }}
        >
          + Add
        </button>
      </div>

      <Group title="Income" items={income} onEdit={openEdit} onToggle={toggleActive} accent="var(--color-income)" />
      <Group title="Expenses" items={expenses} onEdit={openEdit} onToggle={toggleActive} accent="var(--color-expense)" />

      <Sheet open={open} onClose={() => setOpen(false)} title={editingId ? 'Edit recurring item' : 'New recurring item'}>
        <div className="flex flex-col gap-4">
          <Field label="Name">
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Salary, Rent, Netflix"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
            />
          </Field>

          <Field label="Amount (AUD)">
            <input
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              inputMode="decimal"
              placeholder="0.00"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-3 py-2.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
            />
          </Field>

          <Field label="Type">
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
          </Field>

          <Field label="Frequency">
            <div className="grid grid-cols-3 gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f}
                  onClick={() => setForm((s) => ({ ...s, frequency: f }))}
                  className="rounded-xl border py-2 text-xs font-semibold capitalize transition-colors"
                  style={
                    form.frequency === f
                      ? { borderColor: 'var(--color-accent)', background: '#60a5fa26', color: 'var(--color-accent)' }
                      : { borderColor: 'var(--color-border)', color: 'var(--color-faint)' }
                  }
                >
                  {f}
                </button>
              ))}
            </div>
          </Field>

          <button onClick={save} className="mt-2 rounded-xl py-3 text-sm font-bold" style={{ background: 'var(--color-accent)', color: '#0a0e16' }}>
            {editingId ? 'Save changes' : 'Add recurring item'}
          </button>
          {editingId && (
            <button onClick={() => remove(editingId)} className="rounded-xl py-3 text-sm font-semibold" style={{ color: 'var(--color-expense)' }}>
              Delete
            </button>
          )}
        </div>
      </Sheet>
    </div>
  )
}

function Group({
  title,
  items,
  onEdit,
  onToggle,
  accent,
}: {
  title: string
  items: RecurringItem[]
  onEdit: (i: RecurringItem) => void
  onToggle: (id: string) => void
  accent: string
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-[var(--color-muted)]">{title}</h2>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-6 text-center text-xs text-[var(--color-faint)]">
          Nothing here yet.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-solid)] px-4 py-3"
              style={{ opacity: item.active ? 1 : 0.45 }}
            >
              <button className="flex-1 text-left" onClick={() => onEdit(item)}>
                <div className="text-sm font-medium text-[var(--color-ink)]">{item.name}</div>
                <div className="text-xs text-[var(--color-faint)] capitalize">every {item.frequency}</div>
              </button>
              <div className="flex items-center gap-3">
                <div className="tabular text-sm font-semibold" style={{ color: accent }}>
                  {formatAUD(item.amount)}
                </div>
                <button
                  onClick={() => onToggle(item.id)}
                  className="h-6 w-10 rounded-full border transition-colors"
                  style={{
                    borderColor: 'var(--color-border)',
                    background: item.active ? 'var(--color-accent)' : 'var(--color-surface-raised)',
                  }}
                  aria-label="toggle active"
                >
                  <div
                    className="h-4 w-4 rounded-full bg-white transition-transform"
                    style={{ transform: item.active ? 'translateX(19px)' : 'translateX(3px)' }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-[var(--color-muted)]">{label}</span>
      {children}
    </label>
  )
}
