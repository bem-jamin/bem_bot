export type Frequency = 'second' | 'hour' | 'day' | 'week' | 'month' | 'year'

export type EntryType = 'income' | 'expense'

export interface RecurringItem {
  id: string
  name: string
  amount: number // always positive, sign comes from `type`
  type: EntryType
  frequency: Frequency
  startDate: string // ISO timestamp
  category?: string
  active: boolean
}

export interface Transaction {
  id: string
  name: string
  amount: number // always positive, sign comes from `type`
  type: EntryType
  timestamp: string // ISO timestamp
  category?: string
}

export interface Budget {
  monthlyLimit: number | null
}

export type PeriodUnit = 'second' | 'hour' | 'day' | 'week' | 'month' | 'year'

export type PeriodMode = 'soFar' | 'total'
