import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const BUCKET = "sale-receipts"

/**
 * POST /api/upload-receipt
 * Body: { pdfBase64: string, fileName: string, tenantId: string }
 * Retorna: { publicUrl: string }
 *
 * Usa a SUPABASE_SERVICE_ROLE_KEY exclusivamente server-side para garantir
 * que a key não seja exposta no bundle do browser.
 */
export async function POST(req: NextRequest) {
  try {
    const { pdfBase64, fileName, tenantId } = (await req.json()) as {
      pdfBase64: string
      fileName: string
      tenantId: string
    }

    if (!pdfBase64 || !fileName) {
      return NextResponse.json({ error: "pdfBase64 e fileName são obrigatórios" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Variáveis de ambiente do Supabase não configuradas" }, { status: 500 })
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    })

    // Decodifica o base64 para Uint8Array
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "")
    const binaryStr = atob(base64Data)
    const bytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }

    const storagePath = `${tenantId}/${fileName}`

    const { error: uploadError } = await adminClient.storage
      .from(BUCKET)
      .upload(storagePath, bytes, {
        contentType: "application/pdf",
        upsert: true,
        cacheControl: "3600",
      })

    if (uploadError) {
      console.error("[upload-receipt] Erro no upload:", uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: urlData } = adminClient.storage.from(BUCKET).getPublicUrl(storagePath)
    const publicUrl = urlData.publicUrl

    return NextResponse.json({ publicUrl })
  } catch (err) {
    console.error("[upload-receipt] Erro inesperado:", err)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
