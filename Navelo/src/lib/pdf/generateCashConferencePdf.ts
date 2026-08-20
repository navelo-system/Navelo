/**
 * generateCashConferencePdf.ts
 * Gerador de PDF client-side para o relatório de Conferência de Caixa (formato A4).
 */
import type { jsPDF } from "jspdf"
import type autoTableType from "jspdf-autotable"

export interface CashConferenceOperation {
  date: string
  description: string
  total: number
}

export interface CashConferencePdfData {
  paymentMethod: string
  periodText: string
  operations: CashConferenceOperation[]
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

function renderCashConferenceHeader(doc: jsPDF, rightMargin: number, margin: number, company?: CompanyInfo) {
  const companyName = company?.trade_name || company?.name || "NAVELO PDV"
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text(companyName.toUpperCase(), rightMargin, 18, { align: "right" })

  doc.setFontSize(16)
  doc.text("Conferência de Caixa", rightMargin, 26, { align: "right" })

  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.6)
  doc.line(margin, 30, rightMargin, 30)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  doc.setTextColor(50, 50, 50)
  doc.text(`Data de impressão: ${formatCurrentDateTime()}`, rightMargin, 35, { align: "right" })
}

function renderCashConferenceMeta(doc: jsPDF, margin: number, data: CashConferencePdfData) {
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(9.5)

  doc.setFont("helvetica", "bold")
  doc.text("Período:", margin, 42)
  doc.setFont("helvetica", "normal")
  doc.text(data.periodText || "a partir de abertura do caixa", margin + 16, 42)

  doc.setFont("helvetica", "bold")
  doc.text("Forma de Pagamento:", margin, 47)
  doc.setFont("helvetica", "normal")
  doc.text(data.paymentMethod, margin + 37, 47)
}

function renderCashConferenceTable(doc: jsPDF, autoTable: typeof autoTableType, margin: number, data: CashConferencePdfData) {
  const tableRows = (data.operations || []).map((op) => [
    op.date,
    op.description,
    formatCurrency(op.total),
  ])

  const totalFormatted = formatCurrency(data.totalAmount)
  const totalCount = data.operations?.length || 0

  autoTable(doc, {
    startY: 52,
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
    head: [["Data", "Descrição da operação", "Total R$"]],
    body: tableRows,
    foot: [
      [
        "",
        `Qtd. de operações no período: ${totalCount}`,
        totalFormatted,
      ],
    ],
    columnStyles: {
      0: { cellWidth: 42 },
      1: { cellWidth: "auto" },
      2: { cellWidth: 42, halign: "right" },
    },
  })
}

export async function generateCashConferencePdf(
  data: CashConferencePdfData,
  company?: CompanyInfo
): Promise<{ blob: Blob; base64: string; dataUrl: string }> {
  const { default: jsPDF } = await import("jspdf")
  const { default: autoTable } = await import("jspdf-autotable")

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const margin = 14
  const rightMargin = 210 - margin

  renderCashConferenceHeader(doc, rightMargin, margin, company)
  renderCashConferenceMeta(doc, margin, data)
  renderCashConferenceTable(doc, autoTable, margin, data)

  const blob = doc.output("blob")
  const dataUrl = doc.output("dataurlstring")
  const base64 = doc.output("datauristring").split(",")[1] || ""

  return { blob, base64, dataUrl }
}
