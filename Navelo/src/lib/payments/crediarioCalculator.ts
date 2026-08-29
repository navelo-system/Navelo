import { CrediarioSettings } from "@/lib/sync/crediarioSettings"

export interface OverdueCalculationResult {
  fine: number
  interest: number
  toSettle: number
  daysLate: number
  isOverdue: boolean
}

/**
 * Converte string percentual formatada em número (ex: "2,50" ou "% 2,50" -> 2.5)
 */
export function parsePercentRate(rateStr?: string | number): number {
  if (typeof rateStr === "number") return isNaN(rateStr) ? 0 : rateStr
  if (!rateStr) return 0
  const clean = rateStr.replace(/[^\d.,]/g, "").replace(",", ".")
  const parsed = parseFloat(clean)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Calcula juros, multa e total a liquidar para um título de crediário em atraso.
 */
export function calculateReceivableOverdueCharges(
  originalValue: number,
  dueDate: Date | null | undefined,
  referenceDate: Date = new Date(),
  settings?: CrediarioSettings
): OverdueCalculationResult {
  const safeValue = Math.max(0, originalValue || 0)
  if (!dueDate || safeValue === 0 || !settings) {
    return {
      fine: 0,
      interest: 0,
      toSettle: safeValue,
      daysLate: 0,
      isOverdue: false,
    }
  }

  // Compara apenas dia/mês/ano para evitar distorções de fuso/horário
  const dueMidnight = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
  const refMidnight = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate())

  const diffMs = refMidnight.getTime() - dueMidnight.getTime()
  const daysLate = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))

  const graceDays = Math.max(0, settings.graceDays || 0)
  const isOverdue = daysLate > 0

  // Se estiver dentro do prazo ou dentro dos dias de carência, não incidem encargos
  if (daysLate <= graceDays) {
    return {
      fine: 0,
      interest: 0,
      toSettle: safeValue,
      daysLate,
      isOverdue,
    }
  }

  // 1. Multa fixa sobre o valor original
  const fineRatePercent = parsePercentRate(settings.fineRate)
  const fine = Math.round(safeValue * (fineRatePercent / 100) * 100) / 100

  // 2. Juros sobre o período de atraso
  const monthlyRatePercent = parsePercentRate(settings.interestRate)
  const monthlyRate = monthlyRatePercent / 100
  const dailyRate = monthlyRate / 30

  let interest = 0
  if (dailyRate > 0) {
    if (settings.interestType === "Composto") {
      // Juros Compostos: M = C * (1 + i)^n - C
      const compoundFactor = Math.pow(1 + dailyRate, daysLate)
      interest = Math.round(safeValue * (compoundFactor - 1) * 100) / 100
    } else {
      // Juros Simples: J = C * i * n
      interest = Math.round(safeValue * (dailyRate * daysLate) * 100) / 100
    }
  }

  const toSettle = Math.round((safeValue + fine + interest) * 100) / 100

  return {
    fine,
    interest,
    toSettle,
    daysLate,
    isOverdue: true,
  }
}
