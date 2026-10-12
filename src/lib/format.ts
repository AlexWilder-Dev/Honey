/** £9.50, £13, £14.95 */
export function money(n: number) {
  const pence = Math.round(n * 100)
  return pence % 100 === 0 ? `£${pence / 100}` : `£${(pence / 100).toFixed(2)}`
}

export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`
