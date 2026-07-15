import { createContext, useContext, type ReactNode } from 'react'
import { useLocalStorage } from './storage'
import type { Budget, RecurringItem, Transaction } from './types'

interface StoreValue {
  recurring: RecurringItem[]
  setRecurring: (updater: RecurringItem[] | ((prev: RecurringItem[]) => RecurringItem[])) => void
  transactions: Transaction[]
  setTransactions: (updater: Transaction[] | ((prev: Transaction[]) => Transaction[])) => void
  budget: Budget
  setBudget: (updater: Budget | ((prev: Budget) => Budget)) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [recurring, setRecurring] = useLocalStorage<RecurringItem[]>('flow.recurring', [])
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('flow.transactions', [])
  const [budget, setBudget] = useLocalStorage<Budget>('flow.budget', { monthlyLimit: null })

  return (
    <StoreContext.Provider value={{ recurring, setRecurring, transactions, setTransactions, budget, setBudget }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
