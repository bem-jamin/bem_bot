const auFormatter = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatAUD(value: number): string {
  return auFormatter.format(value)
}

/**
 * Splits a currency value into the standard "$X.XX" part and extra
 * high-precision trailing digits, for the live ticking hero display.
 * e.g. 142.836421 -> { main: "$142.83", extraDigits: "6421" }
 */
export function splitTickerValue(value: number, extraPlaces = 4) {
  const negative = value < 0
  const abs = Math.abs(value)
  const main = auFormatter.format(abs)
  const scale = 10 ** extraPlaces
  const fullCents = Math.round(abs * scale)
  const extraDigits = String(fullCents % scale).padStart(extraPlaces, '0')
  return { negative, main, extraDigits }
}

export function formatRate(perSecond: number, unit: 'second' | 'hour', decimals = 4): string {
  const value = unit === 'second' ? perSecond : perSecond * 3600
  const sign = value >= 0 ? '+' : '-'
  return `${sign}$${Math.abs(value).toFixed(decimals)}`
}
