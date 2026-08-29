import { promises as fs } from "fs"
import path from "path"
import { supabase } from "@/lib/supabase/client"

const ALLOWED_TABLES = new Set([
  "categories", "products", "branches", "customers", "sales", "sale_items",
  "tabs", "delivery_orders", "users", "cash_registers", "cash_movements",
  "suppliers", "units", "print_points", "riders", "delivery_rates",
  "restaurant_tables", "receivables", "inventory_audits", "manual_stock_entries",
  "companies", "platform_settings",
])

type TableMap = Record<string, Record<string, unknown>>

export interface LanHubPeer {
  serial: string
  name: string
  lanIps: string[]
  lastSeen: string
}

type HubFile = {
  hostId: string
  tables: Record<string, TableMap>
  peers: Record<string, LanHubPeer>
}

let writeChain = Promise.resolve()

function storePath() {
  return path.join(process.cwd(), ".data", "lan-hub.json")
}

export function isAllowedLanTable(table: string): boolean {
  return ALLOWED_TABLES.has(table)
}

async function readStore(): Promise<HubFile> {
  try {
    const raw = await fs.readFile(storePath(), "utf8")
    const parsed = JSON.parse(raw) as HubFile
    return {
      hostId: parsed.hostId || crypto.randomUUID(),
      tables: parsed.tables || {},
      peers: parsed.peers || {},
    }
  } catch {
    return { hostId: crypto.randomUUID(), tables: {}, peers: {} }
  }
}

async function writeStore(store: HubFile) {
  const dir = path.dirname(storePath())
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(storePath(), JSON.stringify(store), "utf8")
}

function runExclusive<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeChain.then(fn, fn)
  writeChain = next.then(() => undefined, () => undefined)
  return next
}

function matchesTenant(record: Record<string, unknown>, tenantId: string): boolean {
  const companyId = record.company_id
  const rowTenant = record.tenant_id
  if (companyId == null && rowTenant == null) return true
  return companyId === tenantId || rowTenant === tenantId
}

export async function hubList(table: string, tenantId: string): Promise<Record<string, unknown>[]> {
  const store = await readStore()
  const rows = Object.values(store.tables[table] || {})
  return rows.filter((row) => matchesTenant(row, tenantId))
}

export async function hubGetById(table: string, id: string): Promise<Record<string, unknown> | null> {
  const store = await readStore()
  return store.tables[table]?.[id] || null
}

export async function hubUpsert(table: string, payload: Record<string, unknown>, replicate = true): Promise<void> {
  const id = String(payload.id || "")
  if (!id) throw new Error("payload.id é obrigatório")
  await runExclusive(async () => {
    const store = await readStore()
    if (!store.tables[table]) store.tables[table] = {}
    store.tables[table][id] = payload
    await writeStore(store)
  })
  if (replicate) void replicateUpsert(table, payload)
}

export async function hubDelete(table: string, id: string): Promise<void> {
  await runExclusive(async () => {
    const store = await readStore()
    if (store.tables[table]) delete store.tables[table][id]
    await writeStore(store)
  })
  void replicateDelete(table, id)
}

async function replicateUpsert(table: string, payload: Record<string, unknown>) {
  try {
    await supabase.from(table).upsert(payload)
  } catch (err) {
    console.warn(`[LanHub] Falha ao replicar upsert ${table}:`, err)
  }
}

async function replicateDelete(table: string, id: string) {
  try {
    await supabase.from(table).delete().eq("id", id)
  } catch (err) {
    console.warn(`[LanHub] Falha ao replicar delete ${table}:`, err)
  }
}

const STALE_PEER_MS = 45000

export async function getHubHealthPayload() {
  await ensureHubHydrated()
  return runExclusive(async () => {
    const store = await readStore()
    if (!store.hostId) store.hostId = crypto.randomUUID()
    await writeStore(store)
    return { ok: true as const, service: "navelo-lan-hub", hostId: store.hostId }
  })
}

export async function ensureHubHydrated() {
  const store = await readStore()
  const hasRows = Object.values(store.tables).some((table) => Object.keys(table).length > 0)
  if (hasRows) return
  const tables = Array.from(ALLOWED_TABLES)
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*").limit(400)
    if (error || !data) continue
    for (const row of data as Record<string, unknown>[]) {
      if (row.id) await hubUpsert(table, row, false)
    }
  }
}

export async function upsertLanPeer(peer: LanHubPeer) {
  await runExclusive(async () => {
    const store = await readStore()
    store.peers[peer.serial] = { ...peer, lastSeen: new Date().toISOString() }
    await writeStore(store)
  })
}

export async function listLanPeers(): Promise<LanHubPeer[]> {
  const store = await readStore()
  const now = Date.now()
  return Object.values(store.peers || {}).filter((peer) => {
    const seen = new Date(peer.lastSeen).getTime()
    return Number.isFinite(seen) && now - seen < STALE_PEER_MS
  })
}
