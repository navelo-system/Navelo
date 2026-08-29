import { supabase } from "@/lib/supabase/client"
import type { SyncBackend, SyncBackendResult, SyncFetchResult, SyncRecordResult } from "@/lib/sync/syncBackend"

const TENANT_OR_FILTER = (tenantId: string) =>
  `company_id.eq.${tenantId},tenant_id.eq.${tenantId},company_id.eq.tenant-36383365000190,tenant_id.eq.tenant-36383365000190,company_id.eq.tenant-11111111111111,tenant_id.eq.tenant-11111111111111,company_id.is.null`

function toError(message: string | undefined): SyncBackendResult {
  return { error: message ? { message } : null }
}

export function createCloudSyncBackend(): SyncBackend {
  return {
    kind: "cloud",
    async upsert(table, payload): Promise<SyncBackendResult> {
      const { error } = await supabase.from(table).upsert(payload)
      return toError(error?.message)
    },
    async remove(table, id): Promise<SyncBackendResult> {
      const { error } = await supabase.from(table).delete().eq("id", id)
      return toError(error?.message)
    },
    async fetchTable(table, tenantId): Promise<SyncFetchResult> {
      const { data, error } = await supabase.from(table).select("*").or(TENANT_OR_FILTER(tenantId))
      return {
        data: (data as Record<string, unknown>[] | null) || null,
        error: error ? { message: error.message } : null,
      }
    },
    async fetchById(table, id): Promise<SyncRecordResult> {
      const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle()
      return {
        data: (data as Record<string, unknown> | null) || null,
        error: error ? { message: error.message } : null,
      }
    },
  }
}
