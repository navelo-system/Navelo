import type { SyncBackend, SyncBackendResult, SyncFetchResult, SyncRecordResult } from "@/lib/sync/syncBackend"

async function parseJson(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>
  } catch {
    return {}
  }
}

function httpError(status: number, body: Record<string, unknown>): SyncBackendResult {
  const message = typeof body.error === "string" ? body.error : `HTTP ${status}`
  return { error: { message } }
}

export function createLanSyncBackend(baseUrl: string): SyncBackend {
  return {
    kind: "local",
    async upsert(table, payload): Promise<SyncBackendResult> {
      const response = await fetch(`${baseUrl}/records/${encodeURIComponent(table)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPSERT", payload }),
      })
      const body = await parseJson(response)
      if (!response.ok) return httpError(response.status, body)
      return { error: null }
    },
    async remove(table, id): Promise<SyncBackendResult> {
      const response = await fetch(`${baseUrl}/records/${encodeURIComponent(table)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DELETE", payload: { id } }),
      })
      const body = await parseJson(response)
      if (!response.ok) return httpError(response.status, body)
      return { error: null }
    },
    async fetchTable(table, tenantId): Promise<SyncFetchResult> {
      const url = `${baseUrl}/records/${encodeURIComponent(table)}?tenant=${encodeURIComponent(tenantId)}`
      const response = await fetch(url, { method: "GET", cache: "no-store" })
      const body = await parseJson(response)
      if (!response.ok) {
        return { data: null, error: httpError(response.status, body).error }
      }
      const rows = Array.isArray(body.data) ? (body.data as Record<string, unknown>[]) : []
      return { data: rows, error: null }
    },
    async fetchById(table, id): Promise<SyncRecordResult> {
      const url = `${baseUrl}/records/${encodeURIComponent(table)}?id=${encodeURIComponent(id)}`
      const response = await fetch(url, { method: "GET", cache: "no-store" })
      const body = await parseJson(response)
      if (!response.ok) {
        return { data: null, error: httpError(response.status, body).error }
      }
      return { data: (body.data as Record<string, unknown> | null) || null, error: null }
    },
  }
}
