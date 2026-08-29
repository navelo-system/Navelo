import { jsonLan, lanCorsHeaders } from "@/lib/sync/lanSyncCors"
import { getHubHealthPayload } from "@/lib/sync/lanHubStore"
import { NextResponse } from "next/server"

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: lanCorsHeaders() })
}

export async function GET() {
  const payload = await getHubHealthPayload()
  return jsonLan(payload)
}
