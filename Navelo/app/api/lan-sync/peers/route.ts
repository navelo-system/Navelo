import { NextRequest, NextResponse } from "next/server"
import { jsonLan, lanCorsHeaders } from "@/lib/sync/lanSyncCors"
import { listLanPeers, upsertLanPeer } from "@/lib/sync/lanHubStore"

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: lanCorsHeaders() })
}

export async function GET() {
  const peers = await listLanPeers()
  return jsonLan({ data: peers })
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { serial?: string; name?: string; lanIps?: string[] }
  if (!body.serial) return jsonLan({ error: "serial obrigatório" }, 400)
  await upsertLanPeer({
    serial: body.serial,
    name: body.name || body.serial,
    lanIps: Array.isArray(body.lanIps) ? body.lanIps : [],
    lastSeen: new Date().toISOString(),
  })
  const peers = await listLanPeers()
  return jsonLan({ ok: true, data: peers })
}
