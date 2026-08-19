/**
 * generateReceivablesReportPdf.ts
 * Gerador de PDF client-side para o relatório de Contas a Receber (formato A4).
 */


export interface ReceivableReportItem {
  client: string
  docNumber: string
  issueDate: string
  dueDate: string
  value: number
  fine: number
  interest: number
  toSettle: number
  status: string
}

export interface ReceivablesReportPdfData {
  title?: string
  periodText: string
  periodType: string
  clientFilter?: string
  deviceFilter?: string
  items: ReceivableReportItem[]
  totalToReceive: number
  totalSettled: number
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

export async function generateReceivablesReportPdf(
  data: ReceivablesReportPdfData,
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
  doc.text(data.title || "Contas a Receber", rightMargin, 26, { align: "right" })

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

  // Tipo de Período
  doc.setFont("helvetica", "bold")
  doc.text("Tipo de período:", margin, 47)
  doc.setFont("helvetica", "normal")
  doc.text(data.periodType || "Emissão", margin + 30, 47)

  // Cliente
  if (data.clientFilter) {
    doc.setFont("helvetica", "bold")
    doc.text("Cliente:", margin, 52)
    doc.setFont("helvetica", "normal")
    doc.text(data.clientFilter, margin + 16, 52)
  }

  // 3. Tabela de Contas a Receber
  const tableRows = (data.items || []).map((it) => [
    `${it.client}\n${it.docNumber}`,
    it.issueDate,
    it.dueDate,
    formatCurrency(it.value),
    formatCurrency(it.fine + it.interest),
    formatCurrency(it.toSettle),
  ])

  const totalToReceiveFormatted = formatCurrency(data.totalToReceive)
  const totalSettledFormatted = formatCurrency(data.totalSettled)

  autoTable(doc, {
    startY: data.clientFilter ? 57 : 52,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8,
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
    head: [["Cliente / Doc", "Emissão", "Vencimento", "Valor R$", "Multa/Juros", "A liquidar R$"]],
    body: tableRows,
    foot: [
      [
        `Total de registros: ${data.items?.length || 0}`,
        "",
        `Liquidado: ${totalSettledFormatted}`,
        "",
        "",
        `A receber: ${totalToReceiveFormatted}`,
      ],
    ],
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 26 },
      2: { cellWidth: 26 },
      3: { cellWidth: 26, halign: "right" },
      4: { cellWidth: 24, halign: "right" },
      5: { cellWidth: 28, halign: "right" },
    },
  })

  const blob = doc.output("blob")
  const dataUrl = doc.output("dataurlstring")
  const base64 = doc.output("datauristring").split(",")[1] || ""

  return { blob, base64, dataUrl }
}
