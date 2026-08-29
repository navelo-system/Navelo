import { UI_STRINGS } from "@/constants/strings"

export type SyncServerEnvironment = "cloud" | "local"

export interface DeviceSyncSettings {
  enabled: boolean
  deviceName: string
  deviceSerial: string
  environment: SyncServerEnvironment
  serverIp: string
  autoDiscovery: boolean
  lastCheckAt: string | null
  lastDataUpdateAt: string | null
}

export const DEVICE_SYNC_STORAGE_KEY = "navelo_device_sync_settings"
export const DEVICE_SYNC_SETTINGS_EVENT = "navelo-sync-settings-changed"

function pad2(value: number): string {
  return String(value).padStart(2, "0")
}

export function formatSyncDateTime(iso: string | null): string {
  if (!iso) return UI_STRINGS.common.dash
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return UI_STRINGS.common.dash
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

function defaultNameFromSerial(serial: string): string {
  const hex = serial.replace(/-/g, "").slice(0, 8)
  const parsed = Number.parseInt(hex, 16)
  const n = Number.isNaN(parsed) ? 1 : (parsed % 90) + 10
  return `Dispositivo ${n}`
}

export function createDefaultDeviceSyncSettings(): DeviceSyncSettings {
  const deviceSerial = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `device-${Date.now()}`
  return {
    enabled: true,
    deviceName: defaultNameFromSerial(deviceSerial),
    deviceSerial,
    environment: "cloud",
    serverIp: "",
    autoDiscovery: true,
    lastCheckAt: null,
    lastDataUpdateAt: null,
  }
}

export interface ActiveDeviceSession {
  id: string
  name: string
  isCurrent?: boolean
  environment?: SyncServerEnvironment
  lastActiveAt?: string
}

export const ACTIVE_DEVICES_STORAGE_KEY = "navelo_registered_devices"

function updateActiveDevicesList(current: DeviceSyncSettings) {
  if (typeof window === "undefined") return
  try {
    let list: ActiveDeviceSession[] = []
    const raw = localStorage.getItem(ACTIVE_DEVICES_STORAGE_KEY)
    if (raw) {
      list = JSON.parse(raw)
    }
    const currentDeviceIndex = list.findIndex(
      (d) => d.id === current.deviceSerial || d.name === current.deviceName
    )
    const currentItem: ActiveDeviceSession = {
      id: current.deviceSerial,
      name: current.deviceName || "Dispositivo 1",
      isCurrent: true,
      environment: current.environment,
      lastActiveAt: new Date().toISOString(),
    }
    if (currentDeviceIndex >= 0) {
      list[currentDeviceIndex] = currentItem
    } else {
      list.unshift(currentItem)
    }
    localStorage.setItem(ACTIVE_DEVICES_STORAGE_KEY, JSON.stringify(list))
  } catch {}
}

export function getActiveDevices(): ActiveDeviceSession[] {
  const current = loadDeviceSyncSettings()
  if (typeof window === "undefined") {
    return [{ id: current.deviceSerial, name: current.deviceName || "Dispositivo 1", isCurrent: true }]
  }
  try {
    let list: ActiveDeviceSession[] = []
    const raw = localStorage.getItem(ACTIVE_DEVICES_STORAGE_KEY)
    if (raw) {
      list = JSON.parse(raw)
    }
    // Garante que o dispositivo atual reflete o nome configurado
    const foundIdx = list.findIndex((d) => d.id === current.deviceSerial)
    const currentItem: ActiveDeviceSession = {
      id: current.deviceSerial,
      name: current.deviceName || "Dispositivo 1",
      isCurrent: true,
      environment: current.environment,
      lastActiveAt: new Date().toISOString(),
    }
    if (foundIdx >= 0) {
      list[foundIdx] = currentItem
    } else {
      list.unshift(currentItem)
    }
    localStorage.setItem(ACTIVE_DEVICES_STORAGE_KEY, JSON.stringify(list))
    return list
  } catch {
    return [{ id: current.deviceSerial, name: current.deviceName || "Dispositivo 1", isCurrent: true }]
  }
}

function persistDeviceSyncSettings(settings: DeviceSyncSettings, notify: boolean) {
  if (typeof window === "undefined") return
  localStorage.setItem(DEVICE_SYNC_STORAGE_KEY, JSON.stringify(settings))
  updateActiveDevicesList(settings)
  if (notify) window.dispatchEvent(new Event(DEVICE_SYNC_SETTINGS_EVENT))
}

export function loadDeviceSyncSettings(): DeviceSyncSettings {
  if (typeof window === "undefined") return createDefaultDeviceSyncSettings()
  const raw = localStorage.getItem(DEVICE_SYNC_STORAGE_KEY)
  if (!raw) {
    const created = createDefaultDeviceSyncSettings()
    localStorage.setItem(DEVICE_SYNC_STORAGE_KEY, JSON.stringify(created))
    return created
  }
  try {
    const parsed = JSON.parse(raw) as Partial<DeviceSyncSettings>
    return { ...createDefaultDeviceSyncSettings(), ...parsed }
  } catch {
    return createDefaultDeviceSyncSettings()
  }
}

export function saveDeviceSyncSettings(settings: DeviceSyncSettings): void {
  const previous = loadDeviceSyncSettings()
  const shouldNotify =
    previous.enabled !== settings.enabled ||
    previous.environment !== settings.environment ||
    previous.serverIp !== settings.serverIp ||
    previous.autoDiscovery !== settings.autoDiscovery
  persistDeviceSyncSettings(settings, shouldNotify)
}

export function patchDeviceSyncSettings(patch: Partial<DeviceSyncSettings>): DeviceSyncSettings {
  const next = { ...loadDeviceSyncSettings(), ...patch }
  persistDeviceSyncSettings(next, false)
  return next
}

export function isDeviceSyncEnabled(): boolean {
  if (typeof window === "undefined") return true
  return loadDeviceSyncSettings().enabled
}

export function isLanSyncConfigured(): boolean {
  if (typeof window === "undefined") return false
  const settings = loadDeviceSyncSettings()
  return settings.environment === "local"
}

export function resolveLanSyncBaseUrl(serverIp: string): string {
  const raw = serverIp.trim()
  if (!raw) return ""
  let url = raw
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = url.includes(":") ? `http://${url}` : `http://${url}:3000`
  }
  const trimmed = url.replace(/\/$/, "")
  if (trimmed.includes("/api/lan-sync")) return trimmed
  return `${trimmed}/api/lan-sync`
}

export async function testLocalServerConnection(serverIp: string): Promise<boolean> {
  const base = resolveLanSyncBaseUrl(serverIp)
  if (!base) return false
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)
  try {
    const response = await fetch(`${base}/health`, { method: "GET", signal: controller.signal, cache: "no-store" })
    if (!response.ok) return false
    const body = (await response.json()) as { ok?: boolean }
    return body.ok === true
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}
