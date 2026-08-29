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
    const { apiKey, value, description, customer } = body

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json(
        { ok: false, error: "Chave de API não informada." },
        { status: 400 }
      )
    }

    if (!value || typeof value !== "number" || value <= 0) {
      return NextResponse.json(
        { ok: false, error: "Valor da cobrança inválido." },
        { status: 400 }
      )
    }

    const baseUrl = getBaseUrl(apiKey.trim())
    const headers = {
      access_token: apiKey.trim(),
      "Content-Type": "application/json",
      "User-Agent": "Navelo-PDV/1.0",
    }

    // 1. Criar ou Obter Cliente Padrão caso não seja passado
    let customerId = customer
    if (!customerId) {
      const custResp = await fetch(`${baseUrl}/customers?limit=1`, {
        method: "GET",
        headers,
        cache: "no-store",
      })
      if (custResp.ok) {
        const custData = await custResp.json()
        if (custData.data && custData.data.length > 0) {
          customerId = custData.data[0].id
        }
      }
      if (!customerId) {
        // Criar cliente consumidor
        const createCustResp = await fetch(`${baseUrl}/customers`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: "Consumidor Final",
            cpfCnpj: "00000000000",
          }),
        })
        if (createCustResp.ok) {
          const newCust = await createCustResp.json()
          customerId = newCust.id
        }
      }
    }

    // 2. Criar Cobrança PIX
    const today = new Date().toISOString().split("T")[0]
    const paymentPayload = {
      customer: customerId,
      billingType: "PIX",
      value: value,
      dueDate: today,
      description: description || "Venda PDV Navelo",
    }

    const payResp = await fetch(`${baseUrl}/payments`, {
      method: "POST",
      headers,
      body: JSON.stringify(paymentPayload),
    })

    if (!payResp.ok) {
      const errText = await payResp.text()
      return NextResponse.json(
        { ok: false, error: "Erro ao criar cobrança no Asaas.", details: errText },
        { status: payResp.status }
      )
    }

    const payment = await payResp.json()
    const paymentId = payment.id

    // 3. Obter QR Code Pix
    const qrResp = await fetch(`${baseUrl}/payments/${paymentId}/pixQrCode`, {
      method: "GET",
      headers,
      cache: "no-store",
    })

    let qrCodeData = null
    if (qrResp.ok) {
      qrCodeData = await qrResp.json()
    }

    return NextResponse.json({
      ok: true,
      paymentId,
      value: payment.value,
      status: payment.status,
      encodedImage: qrCodeData?.encodedImage ?? null,
      payload: qrCodeData?.payload ?? null,
      expirationDate: qrCodeData?.expirationDate ?? null,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erro desconhecido"
    return NextResponse.json(
      { ok: false, error: "Erro ao processar cobrança Pix no Asaas.", details: errorMsg },
      { status: 500 }
    )
  }
}
