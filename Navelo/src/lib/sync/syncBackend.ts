export interface SyncBackendResult {
  error: { message: string } | null
}

export interface SyncFetchResult {
  data: Record<string, unknown>[] | null
  error: { message: string } | null
}

export interface SyncRecordResult {
  data: Record<string, unknown> | null
  error: { message: string } | null
}

export interface SyncBackend {
  kind: "cloud" | "local"
  upsert(table: string, payload: Record<string, unknown>): Promise<SyncBackendResult>
  remove(table: string, id: string): Promise<SyncBackendResult>
  fetchTable(table: string, tenantId: string): Promise<SyncFetchResult>
  fetchById(table: string, id: string): Promise<SyncRecordResult>
}
