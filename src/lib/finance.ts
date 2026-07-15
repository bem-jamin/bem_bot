import type { Frequency, PeriodMode, PeriodUnit, RecurringItem, Transaction } from './types'

// Average-duration constants so a "$X/month" recurring item contributes
// exactly $X to a trailing "last month" window, and similarly for years.
export const SECONDS_PER: Record<Frequency, number> = {
  second: 1,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2629746, // 365.2425 / 12 days
  year: 31556952, // 365.2425 days
}

export function signedRatePerSecond(item: RecurringItem): number {
  const sign = item.type === 'income' ? 1 : -1
  return (sign * item.amount) / SECONDS_PER[item.frequency]
}

export function netRatePerSecond(items: RecurringItem[], at: Date = new Date()): number {
  const nowMs = at.getTime()
  return items
    .filter((i) => i.active && new Date(i.startDate).getTime() <= nowMs)
    .reduce((sum, i) => sum + signedRatePerSecond(i), 0)
}

export function signedAmount(t: Transaction): number {
  return t.type === 'income' ? t.amount : -t.amount
}

/** Start-of-period boundary in local time, for "so far" mode. */
export function periodStart(unit: PeriodUnit, at: Date = new Date()): Date {
  const d = new Date(at)
  switch (unit) {
    case 'second':
      d.setMilliseconds(0)
      return d
    case 'hour':
      d.setMinutes(0, 0, 0)
      return d
    case 'day':
      d.setHours(0, 0, 0, 0)
      return d
    case 'week': {
      d.setHours(0, 0, 0, 0)
      const day = d.getDay() // 0 = Sunday
      const diff = (day === 0 ? -6 : 1) - day // back to Monday
      d.setDate(d.getDate() + diff)
      return d
    }
    case 'month': {
      d.setHours(0, 0, 0, 0)
      d.setDate(1)
      return d
    }
    case 'year': {
      d.setHours(0, 0, 0, 0)
      d.setMonth(0, 1)
      return d
    }
  }
}

export interface PeriodResult {
  total: number
  recurringPart: number
  transactionsPart: number
  windowStart: Date
  windowSeconds: number
}

/**
 * Compute the value shown for a given period unit + mode at instant `now`.
 * - soFar: accrual since the natural start of the unit (e.g. since midnight for "day").
 * - total: trailing window of fixed duration (e.g. last 24h for "day").
 */
export function computePeriod(
  unit: PeriodUnit,
  mode: PeriodMode,
  recurring: RecurringItem[],
  transactions: Transaction[],
  now: Date = new Date(),
): PeriodResult {
  const rate = netRatePerSecond(recurring, now)
  const windowStart = mode === 'soFar' ? periodStart(unit, now) : new Date(now.getTime() - SECONDS_PER[unit] * 1000)
  const windowSeconds = (now.getTime() - windowStart.getTime()) / 1000

  const recurringPart = rate * windowSeconds
  const startMs = windowStart.getTime()
  const nowMs = now.getTime()
  const transactionsPart = transactions
    .filter((t) => {
      const ts = new Date(t.timestamp).getTime()
      return ts >= startMs && ts <= nowMs
    })
    .reduce((sum, t) => sum + signedAmount(t), 0)

  return {
    total: recurringPart + transactionsPart,
    recurringPart,
    transactionsPart,
    windowStart,
    windowSeconds,
  }
}

/** Total expenses only (recurring + one-off) accrued since the start of the current calendar month. */
export function monthToDateExpenses(recurring: RecurringItem[], transactions: Transaction[], now: Date = new Date()): number {
  const start = periodStart('month', now)
  const seconds = (now.getTime() - start.getTime()) / 1000
  const expenseRate = recurring
    .filter((i) => i.active && i.type === 'expense' && new Date(i.startDate).getTime() <= now.getTime())
    .reduce((sum, i) => sum + i.amount / SECONDS_PER[i.frequency], 0)

  const startMs = start.getTime()
  const nowMs = now.getTime()
  const oneOff = transactions
    .filter((t) => t.type === 'expense' && new Date(t.timestamp).getTime() >= startMs && new Date(t.timestamp).getTime() <= nowMs)
    .reduce((sum, t) => sum + t.amount, 0)

  return expenseRate * seconds + oneOff
}

export const PERIOD_LABELS: Record<PeriodUnit, string> = {
  second: 'Second',
  hour: 'Hour',
  day: 'Day',
  week: 'Week',
  month: 'Month',
  year: 'Year',
}

export const TOTAL_LABELS: Record<PeriodUnit, string> = {
  second: 'this second',
  hour: 'last hour',
  day: 'last 24 hours',
  week: 'last 7 days',
  month: 'last 30 days',
  year: 'last 12 months',
}

export const SOFAR_LABELS: Record<PeriodUnit, string> = {
  second: 'this second',
  hour: 'so far this hour',
  day: 'so far today',
  week: 'so far this week',
  month: 'so far this month',
  year: 'so far this year',
}
