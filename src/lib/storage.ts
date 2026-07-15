import { useCallback, useEffect, useState } from 'react'

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, fallback))

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or unavailable — ignore, in-memory state still works
    }
  }, [key, value])

  const update = useCallback((updater: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater))
  }, [])

  return [value, update] as const
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}
