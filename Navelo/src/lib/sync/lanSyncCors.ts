import { NextResponse } from "next/server"

export function lanCorsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }
}

export function jsonLan(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: lanCorsHeaders() })
}
