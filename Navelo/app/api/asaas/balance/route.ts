import { NextRequest, NextResponse } from "next/server"

function getBaseUrl(apiKey: string): string {
  if (apiKey.startsWith("$aact_hmlg_")) {
    return "https://api-sandbox.asaas.com/v3"
  }
  return "https://api.asaas.com/v3"
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { apiKey } = body

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json(
        { ok: false, error: "Chave de API não informada." },
        { status: 400 }
      )
    }

    const baseUrl = getBaseUrl(apiKey.trim())
    const response = await fetch(`${baseUrl}/finance/balance`, {
      method: "GET",
      headers: {
        access_token: apiKey.trim(),
        "Content-Type": "application/json",
        "User-Agent": "Navelo-PDV/1.0",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json(
        {
          ok: false,
          error: "Chave de API inválida ou sem permissão de acesso no Asaas.",
          details: errText,
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      ok: true,
      totalBalance: data.totalBalance ?? 0,
      availableBalance: data.availableBalance ?? 0,
      environment: apiKey.startsWith("$aact_hmlg_") ? "sandbox" : "production",
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erro desconhecido"
    return NextResponse.json(
      { ok: false, error: "Erro de conexão com o servidor do Asaas.", details: errorMsg },
      { status: 500 }
    )
  }
}
