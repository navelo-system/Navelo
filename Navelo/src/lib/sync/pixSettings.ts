export type PixKeyType = "CPF/CNPJ" | "Telefone" | "E-mail" | "Chave Aleatória"

export interface PixSettings {
  caixaEnabled: boolean
  catalogoEnabled: boolean
  keyType: PixKeyType
  pixKey: string
  beneficiaryName: string
  beneficiaryCity: string
  additionalInfo: string
}

export const PIX_SETTINGS_KEY = "navelo_pix_settings"
export const PIX_SETTINGS_EVENT = "navelo-pix-settings-changed"

export function createDefaultPixSettings(): PixSettings {
  return {
    caixaEnabled: true,
    catalogoEnabled: true,
    keyType: "CPF/CNPJ",
    pixKey: "",
    beneficiaryName: "",
    beneficiaryCity: "",
    additionalInfo: "",
  }
}

function persistPixSettings(settings: PixSettings, notify: boolean) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(PIX_SETTINGS_KEY, JSON.stringify(settings))
  if (notify) {
    window.dispatchEvent(new CustomEvent(PIX_SETTINGS_EVENT, { detail: settings }))
  }
}

export function loadPixSettings(): PixSettings {
  if (typeof window === "undefined") return createDefaultPixSettings()
  try {
    const raw = window.localStorage.getItem(PIX_SETTINGS_KEY)
    if (!raw) {
      const defaults = createDefaultPixSettings()
      persistPixSettings(defaults, false)
      return defaults
    }
    const parsed = JSON.parse(raw) as Partial<PixSettings>
    const defaults = createDefaultPixSettings()
    return {
      ...defaults,
      ...parsed,
    }
  } catch {
    return createDefaultPixSettings()
  }
}

export function savePixSettings(settings: PixSettings): void {
  persistPixSettings(settings, true)
}

export function patchPixSettings(patch: Partial<PixSettings>): PixSettings {
  const next = { ...loadPixSettings(), ...patch }
  persistPixSettings(next, true)
  return next
}
