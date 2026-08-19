/**
 * generateSalesReportPdf.ts
 * Gerador de PDF client-side para o relatório de Vendas / Negociações (formato A4).
 */


export interface SalesReportItem {
  code: string
  date: string
  client: string
  total: number
}

export interface SalesReportPdfData {
  title?: string
  periodText: string
  statusText?: string
  typeText?: string
  items: SalesReportItem[]
  totalAmount: number
}

export interface CompanyInfo {
  name?: string
  trade_name?: string
}

function formatCurrency(val: number): string {
  return (val || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function formatCurrentDateTime(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const day = pad(d.getDate())
  const month = pad(d.getMonth() + 1)
  const year = d.getFullYear()
  const hours = pad(d.getHours())
  const mins = pad(d.getMinutes())
  return `${day}/${month}/${year} ${hours}:${mins}`
}

export async function generateSalesReportPdf(
  data: SalesReportPdfData,
  company?: CompanyInfo
): Promise<{ blob: Blob; base64: string; dataUrl: string }> {
  const { default: jsPDF } = await import("jspdf")
  const { default: autoTable } = await import("jspdf-autotable")

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = 210
  const margin = 14
  const rightMargin = pageWidth - margin

  // 1. Cabeçalho Superior Direito
  const companyName = company?.trade_name || company?.name || "NAVELO PDV"
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text(companyName.toUpperCase(), rightMargin, 18, { align: "right" })

  doc.setFontSize(16)
  doc.text(data.title || "Vendas", rightMargin, 26, { align: "right" })

  // Linha Divisória Superior
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.6)
  doc.line(margin, 30, rightMargin, 30)

  // Data de Impressão
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(50, 50, 50)
  doc.text(`Data de impressão: ${formatCurrentDateTime()}`, rightMargin, 35, { align: "right" })

  // 2. Metadados do Relatório (Lado Esquerdo)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9.5)

  // Período
  doc.setFont("helvetica", "bold")
  doc.text("Período:", margin, 42)
  doc.setFont("helvetica", "normal")
  doc.text(data.periodText || "Todos", margin + 16, 42)

  // Situação da venda
  doc.setFont("helvetica", "bold")
  doc.text("Situação da venda:", margin, 47)
  doc.setFont("helvetica", "normal")
  doc.text(data.statusText || "Ativa", margin + 35, 47)

  // Tipo de venda
  doc.setFont("helvetica", "bold")
  doc.text("Tipo de venda:", margin, 52)
  doc.setFont("helvetica", "normal")
  doc.text(data.typeText || "Qualquer", margin + 27, 52)

  // 3. Tabela de Vendas
  const tableRows = (data.items || []).map((it) => [
    it.code,
    it.date,
    it.client,
    formatCurrency(it.total),
  ])

  const totalFormatted = formatCurrency(data.totalAmount)
  const totalCount = data.items?.length || 0

  autoTable(doc, {
    startY: 57,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8.5,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.25,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      lineWidth: 0.35,
      lineColor: [0, 0, 0],
    },
    footStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      lineWidth: 0.35,
      lineColor: [0, 0, 0],
    },
    head: [["Venda", "Data", "Cliente", "Total R$"]],
    body: tableRows,
    foot: [
      [
        `Qtd. de vendas: ${totalCount}`,
        "",
        "",
        totalFormatted,
      ],
    ],
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 42 },
      2: { cellWidth: "auto" },
      3: { cellWidth: 38, halign: "right" },
    },
  })

  const blob = doc.output("blob")
  const dataUrl = doc.output("dataurlstring")
  const base64 = doc.output("datauristring").split(",")[1] || ""

  return { blob, base64, dataUrl }
}
