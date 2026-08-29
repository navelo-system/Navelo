export type CrediarioInterestType = "Simples" | "Composto"

export interface CrediarioSettings {
  interestType: CrediarioInterestType
  interestRate: string
  fineRate: string
  graceDays: number
}

export const CREDIARIO_SETTINGS_KEY = "navelo_crediario_settings"
export const CREDIARIO_SETTINGS_EVENT = "navelo-crediario-settings-changed"

export function createDefaultCrediarioSettings(): CrediarioSettings {
  return {
    interestType: "Simples",
    interestRate: "0,00",
    fineRate: "0,00",
    graceDays: 0,
  }
}

function persistCrediarioSettings(settings: CrediarioSettings, notify: boolean) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(CREDIARIO_SETTINGS_KEY, JSON.stringify(settings))
  if (notify) {
    window.dispatchEvent(new CustomEvent(CREDIARIO_SETTINGS_EVENT, { detail: settings }))
  }
}

export function loadCrediarioSettings(): CrediarioSettings {
  if (typeof window === "undefined") return createDefaultCrediarioSettings()
  try {
    const raw = window.localStorage.getItem(CREDIARIO_SETTINGS_KEY)
    if (!raw) {
      const defaults = createDefaultCrediarioSettings()
      persistCrediarioSettings(defaults, false)
      return defaults
    }
    const parsed = JSON.parse(raw) as Partial<CrediarioSettings>
    const defaults = createDefaultCrediarioSettings()
    return {
      ...defaults,
      ...parsed,
    }
  } catch {
    return createDefaultCrediarioSettings()
  }
}

export function saveCrediarioSettings(settings: CrediarioSettings): void {
  persistCrediarioSettings(settings, true)
}

export function patchCrediarioSettings(patch: Partial<CrediarioSettings>): CrediarioSettings {
  const next = { ...loadCrediarioSettings(), ...patch }
  persistCrediarioSettings(next, true)
  return next
}
