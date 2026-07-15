import type { ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Sheet({ open, onClose, title, children }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 flex max-h-[85dvh] w-full max-w-md flex-col overflow-y-auto rounded-t-3xl border-t border-[var(--color-border)] bg-[var(--color-surface-solid)] px-5 pt-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[var(--color-border)]" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-[var(--color-ink)]">{title}</h2>
          <button onClick={onClose} className="text-sm text-[var(--color-faint)]">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
