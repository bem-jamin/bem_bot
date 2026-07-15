import { useEffect, useState } from 'react'

/**
 * Returns a Date that updates on every animation frame, so consumers can
 * derive continuously-ticking values (the live money counter).
 */
export function useLiveClock(): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let raf: number
    const tick = () => {
      setNow(new Date())
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return now
}
