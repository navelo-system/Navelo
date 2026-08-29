import {
  isLanSyncConfigured,
  loadDeviceSyncSettings,
  resolveLanSyncBaseUrl,
} from "@/lib/sync/deviceSyncSettings"

export const LAN_HUB_ACTIVE_EVENT = "navelo-lan-hub-active"
const CANDIDATES_KEY = "navelo_lan_hub_candidates"

let activeLanBaseUrl = ""
let lastAnnouncedUrl = ""

export function getActiveLanHubBaseUrl(): string {
  if (activeLanBaseUrl) return activeLanBaseUrl
  return resolveLanSyncBaseUrl(loadDeviceSyncSettings().serverIp)
}

function isPrivateIp(ip: string): boolean {
  return ip.startsWith("10.") || ip.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
}

function readCachedCandidates(): string[] {
  if (typeof window === "undefined") return []
  try {
    const parsed = JSON.parse(localStorage.getItem(CANDIDATES_KEY) || "[]") as unknown
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []
  } catch {
    return []
  }
}

function writeCachedCandidates(urls: string[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(CANDIDATES_KEY, JSON.stringify(Array.from(new Set(urls))))
}

let lanIpCache: { at: number; ips: string[] } = { at: 0, ips: [] }

export async function discoverLocalLanIps(): Promise<string[]> {
  if (typeof RTCPeerConnection === "undefined") return []
  if (Date.now() - lanIpCache.at < 30000) return lanIpCache.ips
  const ips = new Set<string>()
  const pc = new RTCPeerConnection({ iceServers: [] })
  pc.createDataChannel("navelo-lan")
  pc.onicecandidate = (event) => {
    const line = event.candidate?.candidate || ""
    const match = /([0-9]{1,3}(?:\.[0-9]{1,3}){3})/.exec(line)
    if (match && isPrivateIp(match[1])) ips.add(match[1])
  }
  await pc.setLocalDescription(await pc.createOffer())
  await new Promise((resolve) => setTimeout(resolve, 700))
  pc.close()
  lanIpCache = { at: Date.now(), ips: Array.from(ips) }
  return lanIpCache.ips
}

export async function probeHealth(baseUrl: string, timeoutMs = 2500): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`${baseUrl}/health`, { method: "GET", signal: controller.signal, cache: "no-store" })
    if (!response.ok) return false
    const body = (await response.json()) as { ok?: boolean }
    return body.ok === true
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

function collectCandidateUrls(extraLanIps: string[]): string[] {
  const settings = loadDeviceSyncSettings()
  const urls = [
    resolveLanSyncBaseUrl(settings.serverIp),
    resolveLanSyncBaseUrl("127.0.0.1:3000"),
    resolveLanSyncBaseUrl("localhost:3000"),
    ...readCachedCandidates(),
    ...extraLanIps.map((ip) => resolveLanSyncBaseUrl(`${ip}:3000`)),
  ]
  return Array.from(new Set(urls.filter(Boolean)))
}

function announceActiveUrl(baseUrl: string) {
  if (baseUrl === lastAnnouncedUrl) return
  lastAnnouncedUrl = baseUrl
  if (typeof window !== "undefined") window.dispatchEvent(new Event(LAN_HUB_ACTIVE_EVENT))
}

export async function scanSubnetForHub(): Promise<string | null> {
  const localIps = await discoverLocalLanIps()
  const immediate = collectCandidateUrls(localIps)

  for (const base of immediate) {
    if (await probeHealth(base, 1200)) {
      activeLanBaseUrl = base
      writeCachedCandidates([base, ...immediate])
      announceActiveUrl(base)
      return base
    }
  }

  const subnetCandidates: string[] = []
  for (const ip of localIps) {
    const parts = ip.split(".")
    if (parts.length === 4) {
      const prefix = `${parts[0]}.${parts[1]}.${parts[2]}`
      for (let i = 1; i <= 254; i++) {
        const candidate = resolveLanSyncBaseUrl(`${prefix}.${i}:3000`)
        if (!immediate.includes(candidate)) {
          subnetCandidates.push(candidate)
        }
      }
    }
  }

  const batchSize = 25
  for (let i = 0; i < subnetCandidates.length; i += batchSize) {
    const chunk = subnetCandidates.slice(i, i + batchSize)
    const results = await Promise.all(
      chunk.map(async (url) => {
        const ok = await probeHealth(url, 800)
        return ok ? url : null
      })
    )
    const found = results.find((url): url is string => Boolean(url))
    if (found) {
      activeLanBaseUrl = found
      writeCachedCandidates([found, ...immediate])
      announceActiveUrl(found)
      return found
    }
  }

  activeLanBaseUrl = ""
  return null
}

export async function refreshLanHubLocation(): Promise<string | null> {
  if (!isLanSyncConfigured()) return null
  const localIps = await discoverLocalLanIps()
  const candidates = collectCandidateUrls(localIps)
  for (const base of candidates) {
    if (await probeHealth(base, 1500)) {
      activeLanBaseUrl = base
      writeCachedCandidates([base, ...candidates])
      announceActiveUrl(base)
      return base
    }
  }
  return scanSubnetForHub()
}

export async function sendLanHeartbeat() {
  const base = getActiveLanHubBaseUrl()
  if (!base) return
  const settings = loadDeviceSyncSettings()
  const lanIps = await discoverLocalLanIps()
  try {
    const response = await fetch(`${base}/peers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serial: settings.deviceSerial, name: settings.deviceName, lanIps }),
    })
    const body = (await response.json()) as { data?: Array<{ lanIps?: string[] }> }
    const peerIps = (body.data || []).flatMap((peer) => peer.lanIps || [])
    writeCachedCandidates(collectCandidateUrls([...lanIps, ...peerIps]))
  } catch {
    activeLanBaseUrl = ""
  }
}

export function startLanHubWatchdog(): () => void {
  if (typeof window === "undefined" || !isLanSyncConfigured()) return () => {}
  let stopped = false
  const tick = async () => {
    if (stopped) return
    await refreshLanHubLocation()
    await sendLanHeartbeat()
  }
  void tick()
  const id = window.setInterval(() => { void tick() }, 8000)
  return () => {
    stopped = true
    window.clearInterval(id)
  }
}
