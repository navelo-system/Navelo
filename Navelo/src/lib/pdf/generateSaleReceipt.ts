/**
 * generateSaleReceipt.ts
 * Gerador de PDF client-side para comprovantes de venda no formato térmico (80mm).
 * Adequado para impressoras de cupom / não fiscal (monocromático, fundo branco).
 */

/* eslint-disable max-lines-per-function, complexity */

export interface SaleReceiptPayment {
  method: string
  amount: number
}

export interface SaleReceiptItem {
  product_name?: string
  name?: string
  quantity: number
  unit_price?: number
  unitPrice?: number
  total_price?: number
  unit_measure?: string
}

export interface SaleReceiptData {
  id: string
  saleCode: string
  total: number
  subtotal?: number
  discount?: number
  payment_method?: string
  payments?: SaleReceiptPayment[]
  customer_name?: string
  created_at?: string
  items?: SaleReceiptItem[]
}

export interface CompanyData {
  name?: string
  trade_name?: string
  document?: string
  cnpj?: string
  ie?: string
  state_registration?: string
  address?: string
  address_street?: string
  street?: string
  address_number?: string
  number?: string
  address_complement?: string
  complement?: string
  address_neighborhood?: string
  neighborhood?: string
  address_city?: string
  city?: string
  address_state?: string
  state?: string
  address_cep?: string
  cep?: string
  phone?: string
  email?: string
  logo_url?: string
}

function formatValue(value: number): string {
  return (value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatDateTime(iso?: string): string {
  const d = iso ? new Date(iso) : new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const day = pad(d.getDate())
  const month = pad(d.getMonth() + 1)
  const year = d.getFullYear()
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  const seconds = pad(d.getSeconds())
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

function formatSaleNumber(saleCode: string): string {
  const cleaned = (saleCode || "")
    .replace(/^[#\s]+/, "")
    .replace(/^Negociação\s*/i, "")
    .replace(/^Venda\s*/i, "")
    .trim()
  return cleaned || "001"
}

export async function generateSaleReceiptPdf(
  sale: SaleReceiptData,
  company?: CompanyData
): Promise<{ blob: Blob; base64: string; dataUrl: string }> {
  const { default: jsPDF } = await import("jspdf")
  const { default: autoTable } = await import("jspdf-autotable")

  const rawItems = sale.items || []
  const items = Array.isArray(rawItems)
    ? rawItems
    : typeof rawItems === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(rawItems)
            return Array.isArray(parsed) ? parsed : []
          } catch {
            return []
          }
        })()
      : []
  const payments = sale.payments || []
  const hasMultiplePayments = payments.length > 0

  // Cálculo dinâmico da altura para formato contínuo de bobina térmica 80mm
  const estimatedHeight = Math.max(
    110,
    55 +
      items.length * 7 +
      (hasMultiplePayments ? payments.length * 5 : 6) +
      45
  )

  const doc = new jsPDF({
    unit: "mm",
    format: [80, estimatedHeight],
  })

  const pageW = doc.internal.pageSize.getWidth() // 80mm
  const marginX = 4
  const contentW = pageW - marginX * 2 // 72mm
  const centerX = pageW / 2

  let y = 6

  // ── 1. CABEÇALHO DA EMPRESA (100% DINÂMICO) ──────────────────────────────
  const companyTitle = (company?.trade_name || company?.name || "COMPROVANTE DE VENDA").toUpperCase()
  const corporateSubtitle =
    company?.trade_name && company?.name && company.name !== company.trade_name ? company.name : null
  const cnpj = company?.cnpj || company?.document || ""
  const ie = company?.ie || company?.state_registration || ""

  const street = company?.address_street || company?.street || ""
  const num = company?.address_number || company?.number || ""
  const comp = company?.address_complement || company?.complement || ""
  const neigh = company?.address_neighborhood || company?.neighborhood || ""
  const city = company?.address_city || company?.city || ""
  const uf = company?.address_state || company?.state || ""
  const cep = company?.address_cep || company?.cep || ""
  const phone = company?.phone || ""

  let fullAddress = company?.address || ""
  if (!fullAddress && street) {
    fullAddress = `${street}${num ? `, ${num}` : ""}${comp ? ` - ${comp}` : ""}${neigh ? `, ${neigh}` : ""}${city ? `, ${city}` : ""}${uf ? `-${uf}` : ""}`
  }

  doc.setTextColor(0, 0, 0)

  // Nome Principal da Empresa (Fantasia ou Razão Social)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9.5)
  doc.text(companyTitle, centerX, y, { align: "center" })
  y += 3.8

  // Razão Social Secundária (se existir e for diferente do nome fantasia)
  if (corporateSubtitle) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(6.5)
    doc.text(corporateSubtitle, centerX, y, { align: "center" })
    y += 3.2
  }

  // CNPJ e Inscrição Estadual
  if (cnpj || ie) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    const docParts: string[] = []
    if (cnpj) docParts.push(`CNPJ: ${cnpj}`)
    if (ie) docParts.push(`IE: ${ie}`)
    doc.text(docParts.join("  "), centerX, y, { align: "center" })
    y += 3.2
  }

  // Endereço
  if (fullAddress) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(6.5)
    const splitAddress = doc.splitTextToSize(fullAddress, contentW)
    doc.text(splitAddress, centerX, y, { align: "center" })
    y += (Array.isArray(splitAddress) ? splitAddress.length : 1) * 3.0
  }

  // CEP e Telefone
  const contactParts: string[] = []
  if (cep) contactParts.push(`CEP: ${cep}`)
  if (phone) contactParts.push(`Tel: ${phone}`)
  if (contactParts.length > 0) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(6.5)
    doc.text(contactParts.join(" • "), centerX, y, { align: "center" })
    y += 3.5
  }

  // Linha divisória simples
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text("-".repeat(56), centerX, y, { align: "center" })
  y += 3.5

  // NÃO É UM DOCUMENTO FISCAL
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.text("NÃO É UM DOCUMENTO FISCAL", centerX, y, { align: "center" })
  y += 4

  // VENDA {código}
  const saleCode = formatSaleNumber(sale.saleCode)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.text(`VENDA ${saleCode}`, marginX, y)
  y += 2.5

  // ── 2. TABELA DE PRODUTOS ───────────────────────────────────────────────
  const tableItems =
    items.length > 0
      ? items.map((item) => {
          const name = (item.product_name || item.name || "ITEM").toUpperCase()
          const qty = item.quantity ?? 1
          const unit = item.unit_price ?? item.unitPrice ?? 0
          const total = item.total_price ?? qty * unit
          const unitMeasure = (item.unit_measure || "UN").toUpperCase()

          return [
            name,
            String(qty),
            `${unitMeasure} X`,
            formatValue(unit),
            formatValue(total),
          ]
        })
      : [["NENHUM ITEM", "1", "UN X", "0,00", "0,00"]]

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 7,
      textColor: [0, 0, 0],
      cellPadding: { top: 0.8, right: 0.5, bottom: 0.8, left: 0.5 },
      lineWidth: 0,
    },
    headStyles: {
      fontStyle: "bold",
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255],
      fontSize: 7,
    },
    bodyStyles: {
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255],
    },
    head: [["Descrição", "Qtd", "Un", "Vl Unit", "Vl Total"]],
    body: tableItems,
    columnStyles: {
      0: { cellWidth: 29 },
      1: { cellWidth: 7, halign: "center" },
      2: { cellWidth: 10, halign: "center" },
      3: { cellWidth: 13, halign: "right" },
      4: { cellWidth: 13, halign: "right" },
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 2

  // Linha divisória
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text("-".repeat(56), centerX, y, { align: "center" })
  y += 3.5

  // ── 3. TOTAL ─────────────────────────────────────────────────────────────
  if (sale.discount && sale.discount > 0) {
    const subtotal = sale.subtotal || sale.total + sale.discount
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    doc.text("SUBTOTAL", marginX, y)
    doc.text(`R$ ${formatValue(subtotal)}`, pageW - marginX, y, { align: "right" })
    y += 3.5

    doc.text("DESCONTO", marginX, y)
    doc.text(`- R$ ${formatValue(sale.discount)}`, pageW - marginX, y, { align: "right" })
    y += 3.5
  }

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.text("TOTAL", marginX, y)
  doc.text(`R$ ${formatValue(sale.total)}`, pageW - marginX, y, { align: "right" })
  y += 3

  // Linha divisória
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text("-".repeat(56), centerX, y, { align: "center" })
  y += 2.5

  // ── 4. FORMA DE PAGAMENTO ────────────────────────────────────────────────
  const paymentRows: Array<[string, string]> = []

  if (hasMultiplePayments) {
    payments.forEach((p) => {
      paymentRows.push([p.method || "Dinheiro", formatValue(p.amount)])
    })
  } else if (sale.payment_method) {
    // Se for string com vírgulas ou método único
    const methods = sale.payment_method.split(",").map((m) => m.trim()).filter(Boolean)
    if (methods.length > 1) {
      methods.forEach((m) => {
        paymentRows.push([m, ""])
      })
      paymentRows[0][1] = formatValue(sale.total)
    } else {
      paymentRows.push([sale.payment_method, formatValue(sale.total)])
    }
  } else {
    paymentRows.push(["Dinheiro", formatValue(sale.total)])
  }

  autoTable(doc, {
    startY: y,
    margin: { left: marginX, right: marginX },
    theme: "plain",
    styles: {
      font: "helvetica",
      fontSize: 7,
      textColor: [0, 0, 0],
      cellPadding: { top: 0.8, right: 0.5, bottom: 0.8, left: 0.5 },
      lineWidth: 0,
    },
    headStyles: {
      fontStyle: "bold",
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255],
      fontSize: 7,
    },
    bodyStyles: {
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255],
    },
    head: [["Forma pagamento", "Valor pago"]],
    body: paymentRows,
    columnStyles: {
      0: { cellWidth: 44, halign: "left" },
      1: { cellWidth: 28, halign: "right" },
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 2

  // Linha divisória
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text("-".repeat(56), centerX, y, { align: "center" })
  y += 3.5

  // ── 5. RODAPÉ ────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold")
  doc.setFontSize(7.5)
  doc.text("NÃO É UM DOCUMENTO FISCAL", centerX, y, { align: "center" })
  y += 3.5

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text(`Data/Hora: ${formatDateTime(sale.created_at)}`, centerX, y, { align: "center" })
  y += 3.5

  doc.text("Obrigado, volte sempre!", centerX, y, { align: "center" })

  // ── 6. OUTPUT ────────────────────────────────────────────────────────────
  const blob = doc.output("blob")
  const dataUrl = doc.output("datauristring")
  const base64 = dataUrl.split(",")[1]

  return { blob, base64, dataUrl }
}

/**
 * Sanitiza o nome da negociação para uso como nome de arquivo.
 * Ex: "Negociação 016.7" → "Negociacao_016.7"
 */
export function sanitizeSaleFileName(saleName: string): string {
  return saleName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "")
}

