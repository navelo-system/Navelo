export interface ContaDigitalSettings {
  enabled: boolean
  apiKey: string
  environment: "production" | "sandbox"
  caixaPix: boolean
  catalogoCartao: boolean
  catalogoPix: boolean
  entregadorPix: boolean
  autoatendimentoPix: boolean
}

export const CONTA_DIGITAL_STORAGE_KEY = "navelo_digital_account_config"
export const CONTA_DIGITAL_SETTINGS_EVENT = "navelo-conta-digital-settings-changed"

export function createDefaultContaDigitalSettings(): ContaDigitalSettings {
  return {
    enabled: false,
    apiKey: "",
    environment: "production",
    caixaPix: false,
    catalogoCartao: false,
    catalogoPix: false,
    entregadorPix: false,
    autoatendimentoPix: false,
  }
}

function persistContaDigitalSettings(settings: ContaDigitalSettings, notify: boolean) {
  if (typeof window === "undefined") return
  localStorage.setItem(CONTA_DIGITAL_STORAGE_KEY, JSON.stringify(settings))
  if (notify) window.dispatchEvent(new Event(CONTA_DIGITAL_SETTINGS_EVENT))
}

export function loadContaDigitalSettings(): ContaDigitalSettings {
  if (typeof window === "undefined") return createDefaultContaDigitalSettings()
  const raw = localStorage.getItem(CONTA_DIGITAL_STORAGE_KEY)
  const defaultSettings = createDefaultContaDigitalSettings()
  if (!raw) {
    localStorage.setItem(CONTA_DIGITAL_STORAGE_KEY, JSON.stringify(defaultSettings))
    return defaultSettings
  }
  try {
    const parsed = JSON.parse(raw) as Partial<ContaDigitalSettings>
    const environment: "production" | "sandbox" =
      parsed.apiKey?.startsWith("$aact_hmlg_") ? "sandbox" : "production"

    return {
      ...defaultSettings,
      ...parsed,
      environment,
    }
  } catch {
    return defaultSettings
  }
}

export function saveContaDigitalSettings(settings: ContaDigitalSettings): void {
  persistContaDigitalSettings(settings, true)
}

export function patchContaDigitalSettings(patch: Partial<ContaDigitalSettings>): ContaDigitalSettings {
  const next = { ...loadContaDigitalSettings(), ...patch }
  persistContaDigitalSettings(next, true)
  return next
}
