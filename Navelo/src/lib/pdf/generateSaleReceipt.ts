/**
 * generateSaleReceipt.ts
 * Gerador de PDF client-side para comprovantes de venda no formato térmico (80mm).
 * Adequado para impressoras de cupom / não fiscal (monocromático, fundo branco).
 */
import type { jsPDF } from "jspdf"
import type autoTableType from "jspdf-autotable"

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

interface LayoutBounds {
  pageW: number
  marginX: number
  contentW: number
  centerX: number
}

interface JsPdfWithAutoTable extends jsPDF {
  lastAutoTable?: { finalY: number }
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

function getCompanyAddressSegments(c: CompanyData): string[] {
  const street = c.address_street || c.street
  if (!street) return []
  const num = c.address_number || c.number
  const comp = c.address_complement || c.complement
  const neigh = c.address_neighborhood || c.neighborhood
  const city = c.address_city || c.city
  const uf = c.address_state || c.state
  return [street, num, comp, neigh, city, uf].filter(Boolean) as string[]
}

function formatCompanyFullAddress(c?: CompanyData): string {
  if (!c) return ""
  if (c.address) return c.address
  const parts = getCompanyAddressSegments(c)
  return parts.join(", ")
}

function parseSaleReceiptItems(rawItems?: SaleReceiptItem[] | string): SaleReceiptItem[] {
  if (Array.isArray(rawItems)) return rawItems
  if (typeof rawItems === "string") {
    try {
      const parsed = JSON.parse(rawItems)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

function getCorporateSubtitle(trade?: string, name?: string): string | null {
  if (!trade || !name) return null
  return name !== trade ? name : null
}

function getCompanyDocumentNumbers(company?: CompanyData) {
  const cnpj = company?.cnpj || company?.document || ""
  const ie = company?.ie || company?.state_registration || ""
  return { cnpj, ie }
}

function getCompanyTitles(company?: CompanyData) {
  const trade = company?.trade_name
  const name = company?.name
  return {
    companyTitle: (trade || name || "COMPROVANTE DE VENDA").toUpperCase(),
    corporateSubtitle: getCorporateSubtitle(trade, name),
    ...getCompanyDocumentNumbers(company),
  }
}

function renderCompanyHeaderTitles(doc: jsPDF, company: CompanyData | undefined, b: LayoutBounds, startY: number): number {
  let y = startY
  const { companyTitle, corporateSubtitle, cnpj, ie } = getCompanyTitles(company)

  doc.setTextColor(0, 0, 0)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9.5)
  doc.text(companyTitle, b.centerX, y, { align: "center" })
  y += 3.8

  if (corporateSubtitle) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(6.5)
    doc.text(corporateSubtitle, b.centerX, y, { align: "center" })
    y += 3.2
  }

  const docParts = [...(cnpj ? [`CNPJ: ${cnpj}`] : []), ...(ie ? [`IE: ${ie}`] : [])]
  if (docParts.length > 0) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.text(docParts.join("  "), b.centerX, y, { align: "center" })
    y += 3.2
  }

  return y
}

function renderCompanyHeaderContacts(doc: jsPDF, company: CompanyData | undefined, b: LayoutBounds, startY: number): number {
  let y = startY
  const fullAddress = formatCompanyFullAddress(company)
  const cep = company?.address_cep || company?.cep
  const phone = company?.phone

  if (fullAddress) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(6.5)
    const splitAddress = doc.splitTextToSize(fullAddress, b.contentW)
    doc.text(splitAddress, b.centerX, y, { align: "center" })
    const lineCount = Array.isArray(splitAddress) ? splitAddress.length : 1
    y += lineCount * 3.0
  }

  const contactParts = [...(cep ? [`CEP: ${cep}`] : []), ...(phone ? [`Tel: ${phone}`] : [])]
  if (contactParts.length > 0) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(6.5)
    doc.text(contactParts.join(" • "), b.centerX, y, { align: "center" })
    y += 3.5
  }

  return y
}

function renderReceiptHeader(
  doc: jsPDF,
  company: CompanyData | undefined,
  sale: SaleReceiptData,
  b: LayoutBounds
): number {
  let y = renderCompanyHeaderTitles(doc, company, b, 6)
  y = renderCompanyHeaderContacts(doc, company, b, y)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text("-".repeat(56), b.centerX, y, { align: "center" })
  y += 3.5

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.text("NÃO É UM DOCUMENTO FISCAL", b.centerX, y, { align: "center" })
  y += 4

  const saleCode = formatSaleNumber(sale.saleCode)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.text(`VENDA ${saleCode}`, b.marginX, y)
  return y + 2.5
}

interface TableRenderOptions {
  doc: jsPDF
  autoTable: typeof autoTableType
  b: LayoutBounds
  startY: number
}

function renderReceiptProductsTable(
  opts: TableRenderOptions,
  items: SaleReceiptItem[]
): number {
  const { doc, autoTable, b, startY } = opts
  const tableItems = items.length > 0
    ? items.map((item) => {
        const name = (item.product_name || item.name || "ITEM").toUpperCase()
        const qty = item.quantity ?? 1
        const unit = item.unit_price ?? item.unitPrice ?? 0
        const total = item.total_price ?? qty * unit
        const unitMeasure = (item.unit_measure || "UN").toUpperCase()
        return [name, String(qty), `${unitMeasure} X`, formatValue(unit), formatValue(total)]
      })
    : [["NENHUM ITEM", "1", "UN X", "0,00", "0,00"]]

  autoTable(doc, {
    startY,
    margin: { left: b.marginX, right: b.marginX },
    theme: "plain",
    styles: {
      font: "helvetica", fontSize: 7, textColor: [0, 0, 0],
      cellPadding: { top: 0.8, right: 0.5, bottom: 0.8, left: 0.5 }, lineWidth: 0,
    },
    headStyles: { fontStyle: "bold", textColor: [0, 0, 0], fillColor: [255, 255, 255], fontSize: 7 },
    bodyStyles: { textColor: [0, 0, 0], fillColor: [255, 255, 255] },
    head: [["Descrição", "Qtd", "Un", "Vl Unit", "Vl Total"]],
    body: tableItems,
    columnStyles: {
      0: { cellWidth: 29 }, 1: { cellWidth: 7, halign: "center" }, 2: { cellWidth: 10, halign: "center" },
      3: { cellWidth: 13, halign: "right" }, 4: { cellWidth: 13, halign: "right" },
    },
  })

  const pdfWithTable = doc as JsPdfWithAutoTable
  let y = (pdfWithTable.lastAutoTable?.finalY ?? startY) + 2
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text("-".repeat(56), b.centerX, y, { align: "center" })
  y += 3.5
  return y
}

function renderReceiptTotals(
  doc: jsPDF,
  sale: SaleReceiptData,
  b: LayoutBounds,
  startY: number
): number {
  let y = startY
  if (sale.discount && sale.discount > 0) {
    const subtotal = sale.subtotal || sale.total + sale.discount
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    doc.text("SUBTOTAL", b.marginX, y)
    doc.text(`R$ ${formatValue(subtotal)}`, b.pageW - b.marginX, y, { align: "right" })
    y += 3.5
    doc.text("DESCONTO", b.marginX, y)
    doc.text(`- R$ ${formatValue(sale.discount)}`, b.pageW - b.marginX, y, { align: "right" })
    y += 3.5
  }

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8.5)
  doc.text("TOTAL", b.marginX, y)
  doc.text(`R$ ${formatValue(sale.total)}`, b.pageW - b.marginX, y, { align: "right" })
  y += 3

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text("-".repeat(56), b.centerX, y, { align: "center" })
  return y + 2.5
}

function renderReceiptPaymentsTable(
  opts: TableRenderOptions,
  sale: SaleReceiptData
): number {
  const { doc, autoTable, b, startY } = opts
  const paymentRows: Array<[string, string]> = []
  if (sale.payments && sale.payments.length > 0) {
    sale.payments.forEach((p) => paymentRows.push([p.method || "Dinheiro", formatValue(p.amount)]))
  } else {
    paymentRows.push([sale.payment_method || "Dinheiro", formatValue(sale.total)])
  }

  autoTable(doc, {
    startY,
    margin: { left: b.marginX, right: b.marginX },
    theme: "plain",
    styles: {
      font: "helvetica", fontSize: 7, textColor: [0, 0, 0],
      cellPadding: { top: 0.8, right: 0.5, bottom: 0.8, left: 0.5 }, lineWidth: 0,
    },
    headStyles: { fontStyle: "bold", textColor: [0, 0, 0], fillColor: [255, 255, 255], fontSize: 7 },
    bodyStyles: { textColor: [0, 0, 0], fillColor: [255, 255, 255] },
    head: [["Forma pagamento", "Valor pago"]],
    body: paymentRows,
    columnStyles: { 0: { cellWidth: 44, halign: "left" }, 1: { cellWidth: 28, halign: "right" } },
  })

  const pdfWithTable = doc as JsPdfWithAutoTable
  let y = (pdfWithTable.lastAutoTable?.finalY ?? startY) + 2
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text("-".repeat(56), b.centerX, y, { align: "center" })
  y += 3.5
  return y
}

function renderReceiptFooter(
  doc: jsPDF,
  sale: SaleReceiptData,
  b: LayoutBounds,
  startY: number
): void {
  let y = startY
  doc.setFont("helvetica", "bold")
  doc.setFontSize(7.5)
  doc.text("NÃO É UM DOCUMENTO FISCAL", b.centerX, y, { align: "center" })
  y += 3.5

  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  doc.text(`Data/Hora: ${formatDateTime(sale.created_at)}`, b.centerX, y, { align: "center" })
  y += 3.5

  doc.text("Obrigado, volte sempre!", b.centerX, y, { align: "center" })
}

export async function generateSaleReceiptPdf(
  sale: SaleReceiptData,
  company?: CompanyData
): Promise<{ blob: Blob; base64: string; dataUrl: string }> {
  const { default: jsPDF } = await import("jspdf")
  const { default: autoTable } = await import("jspdf-autotable")

  const items = parseSaleReceiptItems(sale.items)
  const payments = sale.payments || []
  const hasMultiplePayments = payments.length > 0

  const estimatedHeight = Math.max(
    110,
    55 + items.length * 7 + (hasMultiplePayments ? payments.length * 5 : 6) + 45
  )

  const doc = new jsPDF({ unit: "mm", format: [80, estimatedHeight] })
  const pageW = doc.internal.pageSize.getWidth()
  const marginX = 4
  const bounds: LayoutBounds = { pageW, marginX, contentW: pageW - marginX * 2, centerX: pageW / 2 }

  let y = renderReceiptHeader(doc, company, sale, bounds)
  y = renderReceiptProductsTable({ doc, autoTable, b: bounds, startY: y }, items)
  y = renderReceiptTotals(doc, sale, bounds, y)
  y = renderReceiptPaymentsTable({ doc, autoTable, b: bounds, startY: y }, sale)
  renderReceiptFooter(doc, sale, bounds, y)

  const blob = doc.output("blob")
  const dataUrl = doc.output("datauristring")
  const base64 = dataUrl.split(",")[1] || ""

  return { blob, base64, dataUrl }
}

export function sanitizeSaleFileName(saleName: string): string {
  return saleName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "")
}
