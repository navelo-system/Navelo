import { createCloudSyncBackend } from "@/lib/sync/cloudSyncBackend"
import { createLanSyncBackend } from "@/lib/sync/lanSyncBackend"
import { isLanSyncConfigured } from "@/lib/sync/deviceSyncSettings"
import { getActiveLanHubBaseUrl } from "@/lib/sync/lanDiscovery"
import type { SyncBackend } from "@/lib/sync/syncBackend"

export function getSyncBackend(): SyncBackend {
  if (!isLanSyncConfigured()) return createCloudSyncBackend()
  return createLanSyncBackend(getActiveLanHubBaseUrl())
}

export function canFlushSyncQueue(): boolean {
  if (isLanSyncConfigured()) return true
  if (typeof navigator !== "undefined" && !navigator.onLine) return false
  return true
}
