import type { ReactElement } from 'react'

export type Screen = 'home' | 'recurring' | 'transactions' | 'budget'

const ITEMS: { id: Screen; label: string; icon: ReactElement }[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <path d="M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    id: 'recurring',
    label: 'Recurring',
    icon: (
      <path
        d="M4 12a8 8 0 0 1 13.66-5.66M20 12a8 8 0 0 1-13.66 5.66M17 3v4h-4M7 21v-4h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: 'transactions',
    label: 'Log',
    icon: <path d="M5 4h14v16l-3-2-2 2-2-2-2 2-2-2-3 2V4Zm3 5h8M8 12h8M8 15h5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    id: 'budget',
    label: 'Budget',
    icon: (
      <path
        d="M4 19V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm4-5 2.5-3L13 14l3.5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
]

interface Props {
  screen: Screen
  onChange: (s: Screen) => void
}

export function BottomNav({ screen, onChange }: Props) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-[var(--color-border)] bg-[#0a0e16]/90 backdrop-blur-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto flex max-w-md justify-around px-2 py-2">
        {ITEMS.map((item) => {
          const active = item.id === screen
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex flex-col items-center gap-1 px-4 py-1 transition-colors"
              style={{ color: active ? 'var(--color-accent)' : 'var(--color-faint)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {item.icon}
              </svg>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
