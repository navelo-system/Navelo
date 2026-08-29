import { NextRequest, NextResponse } from "next/server"
import { jsonLan, lanCorsHeaders } from "@/lib/sync/lanSyncCors"
import { hubDelete, hubGetById, hubList, hubUpsert, isAllowedLanTable } from "@/lib/sync/lanHubStore"

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: lanCorsHeaders() })
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ table: string }> }
) {
  const { table } = await context.params
  if (!isAllowedLanTable(table)) return jsonLan({ error: "Tabela não permitida" }, 400)

  const id = req.nextUrl.searchParams.get("id")
  if (id) {
    const row = await hubGetById(table, id)
    return jsonLan({ data: row })
  }

  const tenant = req.nextUrl.searchParams.get("tenant") || ""
  const rows = await hubList(table, tenant)
  return jsonLan({ data: rows })
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ table: string }> }
) {
  const { table } = await context.params
  if (!isAllowedLanTable(table)) return jsonLan({ error: "Tabela não permitida" }, 400)

  const body = (await req.json()) as { action?: string; payload?: Record<string, unknown> }
  const payload = body.payload || {}
  const action = body.action || "UPSERT"

  try {
    if (action === "DELETE") {
      const id = String(payload.id || "")
      if (!id) return jsonLan({ error: "id obrigatório" }, 400)
      await hubDelete(table, id)
      return jsonLan({ ok: true })
    }
    await hubUpsert(table, payload)
    return jsonLan({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Falha no hub local"
    return jsonLan({ error: message }, 500)
  }
}
