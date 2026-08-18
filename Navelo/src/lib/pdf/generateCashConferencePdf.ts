/**
 * generateCashConferencePdf.ts
 * Gerador de PDF client-side para o relatório de Conferência de Caixa (formato A4).
 */

/* eslint-disable max-lines-per-function, complexity */

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
  doc.text("Conferência de Caixa", rightMargin, 26, { align: "right" })

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
  doc.text(data.periodText || "a partir de abertura do caixa", margin + 16, 42)

  // Forma de Pagamento
  doc.setFont("helvetica", "bold")
  doc.text("Forma de Pagamento:", margin, 47)
  doc.setFont("helvetica", "normal")
  doc.text(data.paymentMethod, margin + 37, 47)

  // 3. Tabela de Operações
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

  const blob = doc.output("blob")
  const dataUrl = doc.output("dataurlstring")
  const base64 = doc.output("datauristring").split(",")[1] || ""

  return { blob, base64, dataUrl }
}
