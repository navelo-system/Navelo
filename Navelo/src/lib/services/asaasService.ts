export interface ValidateAsaasKeyResult {
  ok: boolean
  error?: string
  totalBalance?: number
  availableBalance?: number
  environment?: "sandbox" | "production"
}

export interface CreateAsaasPixResult {
  ok: boolean
  error?: string
  paymentId?: string
  encodedImage?: string
  payload?: string
  expirationDate?: string
  status?: string
}

export async function validateAsaasKey(apiKey: string): Promise<ValidateAsaasKeyResult> {
  try {
    const response = await fetch("/api/asaas/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey }),
    })

    const data = await response.json()
    if (!response.ok || !data.ok) {
      return {
        ok: false,
        error: data.error || "Chave de API inválida ou sem permissão de acesso no Asaas.",
      }
    }

    return {
      ok: true,
      totalBalance: data.totalBalance,
      availableBalance: data.availableBalance,
      environment: data.environment,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao conectar com o serviço Asaas"
    return { ok: false, error: msg }
  }
}

export async function createAsaasPixCharge(params: {
  apiKey: string
  value: number
  description?: string
}): Promise<CreateAsaasPixResult> {
  try {
    const response = await fetch("/api/asaas/pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    })

    const data = await response.json()
    if (!response.ok || !data.ok) {
      return {
        ok: false,
        error: data.error || "Erro ao gerar cobrança Pix no Asaas.",
      }
    }

    return {
      ok: true,
      paymentId: data.paymentId,
      encodedImage: data.encodedImage,
      payload: data.payload,
      expirationDate: data.expirationDate,
      status: data.status,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erro ao gerar cobrança Pix"
    return { ok: false, error: msg }
  }
}
