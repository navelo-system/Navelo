import { loadDeviceSyncSettings } from "./deviceSyncSettings"

export interface IntegratedPaymentSettings {
  deviceName: string
  linkedPosList: string[]
}

export const INTEGRATED_PAYMENT_STORAGE_KEY = "navelo_integrated_payment_settings"
export const INTEGRATED_PAYMENT_SETTINGS_EVENT = "navelo-integrated-payment-settings-changed"

export function createDefaultIntegratedPaymentSettings(): IntegratedPaymentSettings {
  const syncSettings = loadDeviceSyncSettings()
  return {
    deviceName: syncSettings.deviceName || "Dispositivo",
    linkedPosList: [],
  }
}

function persistIntegratedPaymentSettings(settings: IntegratedPaymentSettings, notify: boolean) {
  if (typeof window === "undefined") return
  localStorage.setItem(INTEGRATED_PAYMENT_STORAGE_KEY, JSON.stringify(settings))
  if (notify) window.dispatchEvent(new Event(INTEGRATED_PAYMENT_SETTINGS_EVENT))
}

export function loadIntegratedPaymentSettings(): IntegratedPaymentSettings {
  if (typeof window === "undefined") return createDefaultIntegratedPaymentSettings()
  const defaultSettings = createDefaultIntegratedPaymentSettings()
  const raw = localStorage.getItem(INTEGRATED_PAYMENT_STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(INTEGRATED_PAYMENT_STORAGE_KEY, JSON.stringify(defaultSettings))
    return defaultSettings
  }
  try {
    const parsed = JSON.parse(raw) as Partial<IntegratedPaymentSettings>
    return {
      ...defaultSettings,
      ...parsed,
      deviceName: parsed.deviceName || defaultSettings.deviceName,
    }
  } catch {
    return defaultSettings
  }
}

export function saveIntegratedPaymentSettings(settings: IntegratedPaymentSettings): void {
  persistIntegratedPaymentSettings(settings, true)
}

export function patchIntegratedPaymentSettings(patch: Partial<IntegratedPaymentSettings>): IntegratedPaymentSettings {
  const next = { ...loadIntegratedPaymentSettings(), ...patch }
  persistIntegratedPaymentSettings(next, true)
  return next
}
