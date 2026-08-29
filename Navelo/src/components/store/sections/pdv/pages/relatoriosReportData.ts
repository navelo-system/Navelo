import { CashMovement, DeliveryOrder, ReceivableEntity, Sale } from "@/lib/dal/db"

export interface ReportDetails {
  title: string
  description: string
  kpis: Array<{ title: string; value: string; subtitle: string }>
  headers: string[]
  rows: string[][]
}

export interface ReportAppliedFilters {
  startDate?: string
  endDate?: string
  client?: string
}

interface DateRange {
  startObj: Date | null
  endObj: Date | null
}

interface SaleLine {
  name: string
  quantity: number
  total: number
  unitPrice: number
  cost: number
}

function formatPrice(val?: number | null): string {
  const num = typeof val === "number" && !isNaN(val) ? val : 0
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num)
}

function parseBrDateSegments(clean: string, isEnd: boolean): Date | null {
  const brMatch = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/)
  if (!brMatch) return null
  const day = parseInt(brMatch[1], 10)
  const month = parseInt(brMatch[2], 10) - 1
  const year = parseInt(brMatch[3], 10)
  const hour = brMatch[4] !== undefined ? parseInt(brMatch[4], 10) : (isEnd ? 23 : 0)
  const min = brMatch[5] !== undefined ? parseInt(brMatch[5], 10) : (isEnd ? 59 : 0)
  const sec = brMatch[6] !== undefined ? parseInt(brMatch[6], 10) : (isEnd ? 59 : 0)
  return new Date(year, month, day, hour, min, sec)
}

export function parseBrDateTime(str?: string | Date | null, isEnd = false): Date | null {
  if (!str) return null
  if (str instanceof Date) return isNaN(str.getTime()) ? null : str
  const clean = String(str).trim()
  if (!clean) return null
  const parsed = parseBrDateSegments(clean, isEnd)
  if (parsed) return parsed
  const isoDate = new Date(clean)
  return isNaN(isoDate.getTime()) ? null : isoDate
}

function formatDateBr(raw?: string | Date | null): string {
  if (!raw) return "-"
  const d = parseBrDateTime(raw)
  if (!d) {
    if (typeof raw === "string" && /^\d{1,2}\/\d{1,2}\/\d{4}/.test(raw)) return raw
    return "-"
  }
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function inDateRange(dateStr: string | undefined, range: DateRange): boolean {
  const d = parseBrDateTime(dateStr) || new Date()
  if (range.startObj && d < range.startObj) return false
  if (range.endObj && d > range.endObj) return false
  return true
}

function saleLineFromUnknown(item: Record<string, unknown>): SaleLine {
  return {
    name: String(item.product_name || item.name || "Produto"),
    quantity: Number(item.quantity || 1),
    total: Number(item.total_price ?? item.total ?? item.price ?? 0),
    unitPrice: Number(item.unit_price ?? item.price ?? 0),
    cost: Number(item.cost_price || 0),
  }
}

function saleItems(sale: Sale): SaleLine[] {
  return (sale.items || []).map((item) => saleLineFromUnknown(item as Record<string, unknown>))
}

function saleOperatorName(sale: Sale): string {
  const extra = sale as Sale & { operator_name?: string }
  return extra.operator_name || sale.operator_id || "Operador"
}

function saleHasTab(sale: Sale): boolean {
  const extra = sale as Sale & { tab_id?: string }
  return Boolean(extra.tab_id) || (sale.payment_method || "").toLowerCase().includes("comanda")
}

function buildExtrato(defaultMock: ReportDetails, sales: Sale[]): ReportDetails {
  const total = sales.reduce((acc, s) => acc + (s.total || 0), 0)
  return {
    ...defaultMock,
    kpis: [
      { title: "Faturamento Bruto", value: formatPrice(total), subtitle: "Vendas totais" },
      { title: "Vendas Totais", value: String(sales.length), subtitle: "No período" },
    ],
    rows: sales.map((s) => [
      s.id.slice(0, 8), formatDateBr(s.created_at), s.customer_name || "Consumidor Final", s.payment_method || "-", formatPrice(s.total || 0),
    ]),
  }
}

function buildCaixaTotais(defaultMock: ReportDetails, cash: CashMovement[]): ReportDetails {
  const saldoCorrente = cash.reduce((acc, c) => acc + (c.amount || 0), 0)
  const suprimentos = cash.filter((c) => c.type === "SUPPLY").reduce((acc, c) => acc + (c.amount || 0), 0)
  const sangrias = cash.filter((c) => c.type === "BLEED").reduce((acc, c) => acc + Math.abs(c.amount || 0), 0)
  return {
    ...defaultMock,
    kpis: [
      { title: "Saldo Corrente", value: formatPrice(saldoCorrente), subtitle: "No período" },
      { title: "Aporte / Suprimento", value: formatPrice(suprimentos), subtitle: "Total inserido" },
      { title: "Sangrias / Retiradas", value: formatPrice(sangrias), subtitle: "Total retirado" },
    ],
    rows: cash.map((c) => [
      c.type === "SUPPLY" ? "Suprimento" : c.type === "BLEED" ? "Sangria" : c.type || "Movimento",
      c.operator_name || "Admin",
      formatDateBr(c.created_at),
      formatPrice(c.amount || 0),
    ]),
  }
}

function buildCaixaPagamentos(defaultMock: ReportDetails, sales: Sale[]): ReportDetails {
  const methodMap = new Map<string, { count: number; total: number }>()
  sales.forEach((s) => {
    const method = s.payment_method || "Indefinido"
    const curr = methodMap.get(method) || { count: 0, total: 0 }
    methodMap.set(method, { count: curr.count + 1, total: curr.total + (s.total || 0) })
  })
  const rows: string[][] = []
  methodMap.forEach((val, key) => rows.push([key, String(val.count), formatPrice(val.total)]))
  return { ...defaultMock, kpis: [], rows }
}

function buildCrediario(defaultMock: ReportDetails, receivables: ReceivableEntity[]): ReportDetails {
  const pending = receivables.filter((r) => r.status === "PENDING")
  const totalAberto = pending.reduce((acc, r) => acc + (r.value || 0), 0)
  return {
    ...defaultMock,
    kpis: [
      { title: "Saldo a Receber", value: formatPrice(totalAberto), subtitle: "Total em aberto" },
      { title: "Contas em Aberto", value: String(pending.length), subtitle: "Pendentes no período" },
    ],
    rows: receivables.map((r) => [
      r.customer_name || "Avulso", formatDateBr(r.due_date || r.created_at), r.status === "PENDING" ? "Aberto" : "Liquidado", formatPrice(r.value || 0),
    ]),
  }
}

function buildVendasProduto(defaultMock: ReportDetails, sales: Sale[]): ReportDetails {
  const itemMap = new Map<string, { count: number; total: number }>()
  sales.forEach((s) => {
    saleItems(s).forEach((i) => {
      const curr = itemMap.get(i.name) || { count: 0, total: 0 }
      itemMap.set(i.name, { count: curr.count + i.quantity, total: curr.total + i.total })
    })
  })
  const rows: string[][] = []
  let totalItens = 0
  let faturamento = 0
  itemMap.forEach((val, key) => {
    rows.push([key, "Diversos", `${val.count} UN`, formatPrice(val.total)])
    totalItens += val.count
    faturamento += val.total
  })
  return {
    ...defaultMock,
    kpis: [
      { title: "Itens Vendidos", value: `${totalItens} UN`, subtitle: "No período" },
      { title: "Faturamento Produtos", value: formatPrice(faturamento), subtitle: "Total" },
    ],
    rows,
  }
}

function buildComissoes(defaultMock: ReportDetails, sales: Sale[]): ReportDetails {
  const opMap = new Map<string, { name: string; count: number; total: number }>()
  sales.forEach((s) => {
    const key = s.operator_id || "sem-operador"
    const name = saleOperatorName(s)
    const curr = opMap.get(key) || { name, count: 0, total: 0 }
    opMap.set(key, { name: curr.name || name, count: curr.count + 1, total: curr.total + (s.total || 0) })
  })
  const rows: string[][] = []
  let totalComissoes = 0
  opMap.forEach((val) => {
    const ticket = val.count > 0 ? val.total / val.count : 0
    const comissao = val.total * 0.10
    totalComissoes += comissao
    rows.push([val.name, formatPrice(val.total), formatPrice(ticket), formatPrice(comissao)])
  })
  const avgTicket = sales.length > 0 ? sales.reduce((a, s) => a + (s.total || 0), 0) / sales.length : 0
  return {
    ...defaultMock,
    kpis: [
      { title: "Total Comissões", value: formatPrice(totalComissoes), subtitle: "Soma de todas as comissões (10%)" },
      { title: "Vendedores Ativos", value: String(opMap.size), subtitle: "Usuários com venda no período" },
      { title: "Ticket Médio", value: formatPrice(avgTicket), subtitle: "Média geral de vendas" },
    ],
    rows,
  }
}

function buildEvolucao(defaultMock: ReportDetails, sales: Sale[]): ReportDetails {
  const hourMap = new Map<string, { count: number; total: number }>()
  sales.forEach((s) => {
    const d = parseBrDateTime(s.created_at) || new Date()
    const h = d.getHours()
    const label = `${String(h).padStart(2, "0")}:00 - ${String(h + 1).padStart(2, "0")}:00`
    const curr = hourMap.get(label) || { count: 0, total: 0 }
    hourMap.set(label, { count: curr.count + 1, total: curr.total + (s.total || 0) })
  })
  const rows: string[][] = []
  let pico = { label: "-", total: 0 }
  hourMap.forEach((val, key) => {
    const ticket = val.count > 0 ? val.total / val.count : 0
    rows.push([key, String(val.count), formatPrice(val.total), formatPrice(ticket)])
    if (val.total > pico.total) pico = { label: key, total: val.total }
  })
  rows.sort((a, b) => a[0].localeCompare(b[0]))
  const totalVendas = sales.reduce((a, s) => a + (s.total || 0), 0)
  return {
    ...defaultMock,
    kpis: [
      { title: "Pico de Faturamento", value: formatPrice(pico.total), subtitle: pico.label },
      { title: "Vendas Totais", value: String(sales.length), subtitle: "Pedidos emitidos" },
      { title: "Faturamento Total", value: formatPrice(totalVendas), subtitle: "No período" },
    ],
    rows,
  }
}

function buildMargem(defaultMock: ReportDetails, sales: Sale[]): ReportDetails {
  const itemMap = new Map<string, { qty: number; revenue: number; cost: number }>()
  sales.forEach((s) => {
    saleItems(s).forEach((i) => {
      const curr = itemMap.get(i.name) || { qty: 0, revenue: 0, cost: 0 }
      itemMap.set(i.name, {
        qty: curr.qty + i.quantity,
        revenue: curr.revenue + (i.unitPrice * i.quantity),
        cost: curr.cost + (i.cost * i.quantity),
      })
    })
  })
  const rows: string[][] = []
  let totalRevenue = 0
  let totalCost = 0
  itemMap.forEach((val, key) => {
    totalRevenue += val.revenue
    totalCost += val.cost
    const margin = val.revenue > 0 ? ((val.revenue - val.cost) / val.revenue * 100).toFixed(1) + "%" : "N/A"
    rows.push([key, `${val.qty} UN`, formatPrice(val.revenue), formatPrice(val.cost > 0 ? val.cost / val.qty : 0), margin])
  })
  const avgMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue * 100).toFixed(1) + "%" : "N/A"
  return {
    ...defaultMock,
    kpis: [
      { title: "Faturamento", value: formatPrice(totalRevenue), subtitle: "Soma de vendas" },
      { title: "Custo de Mercadoria", value: formatPrice(totalCost), subtitle: "Soma dos custos registrados" },
      { title: "Margem Bruta Média", value: avgMargin, subtitle: "Percentual médio de lucro" },
    ],
    rows,
  }
}

function buildTaxas(defaultMock: ReportDetails, sales: Sale[]): ReportDetails {
  const tabSales = sales.filter(saleHasTab)
  const rows = tabSales.map((s) => {
    const consumo = s.subtotal || s.total || 0
    const taxa = consumo * 0.10
    return [`Comanda #${s.id.slice(0, 4)}`, formatPrice(consumo), formatPrice(taxa), formatPrice(consumo + taxa)]
  })
  const totalTaxas = tabSales.reduce((a, s) => a + (s.subtotal || s.total || 0) * 0.10, 0)
  return {
    ...defaultMock,
    kpis: [
      { title: "Total Taxas", value: formatPrice(totalTaxas), subtitle: "Soma arrecadada (10%)" },
      { title: "Comandas Com Taxa", value: String(tabSales.length), subtitle: "Comandas participantes" },
      { title: "Média por Comanda", value: tabSales.length > 0 ? formatPrice(totalTaxas / tabSales.length) : "R$ 0,00", subtitle: "Média de taxa" },
    ],
    rows,
  }
}

function buildDeliveries(defaultMock: ReportDetails, deliveries: DeliveryOrder[], range: DateRange): ReportDetails {
  const filtered = deliveries.filter((d) => inDateRange(d.created_at, range) && d.status === "delivered")
  const totalFee = filtered.reduce((a, d) => a + (d.delivery_fee || 0), 0)
  const avgFee = filtered.length > 0 ? totalFee / filtered.length : 0
  return {
    ...defaultMock,
    kpis: [
      { title: "Entregas Concluídas", value: String(filtered.length), subtitle: "Total no período" },
      { title: "Taxa Média", value: formatPrice(avgFee), subtitle: "Média paga por entrega" },
      { title: "Total Taxas", value: formatPrice(totalFee), subtitle: "Soma das taxas de entrega" },
    ],
    rows: filtered.map((d) => [`#${d.id.slice(0, 4)}`, d.motoboy || "Entregador", d.client_name, formatPrice(d.delivery_fee || 0), "Finalizado"]),
  }
}

function buildNfSales(defaultMock: ReportDetails, sales: Sale[]): ReportDetails {
  const totalNF = sales.reduce((a, s) => a + (s.total || 0), 0)
  return {
    ...defaultMock,
    kpis: [
      { title: "Notas Emitidas", value: String(sales.length), subtitle: "Vendas no período" },
      { title: "Valor Total", value: formatPrice(totalNF), subtitle: "Soma total de vendas" },
      { title: "Imposto Estimado", value: formatPrice(totalNF * 0.04), subtitle: "Alíquota estimada 4%" },
    ],
    rows: sales.map((s) => [
      s.id.replace(/-/g, " ").toUpperCase().slice(0, 40),
      formatDateBr(s.created_at),
      s.customer_name || "Consumidor Final",
      formatPrice(s.total || 0),
      "Autorizada",
    ]),
  }
}

export function computeReportDetails(opts: {
  selectedReport: string
  filters: ReportAppliedFilters
  sales: Sale[]
  cash: CashMovement[]
  receivables: ReceivableEntity[]
  deliveries: DeliveryOrder[]
  defaultMock: ReportDetails
}): ReportDetails {
  const range: DateRange = {
    startObj: parseBrDateTime(opts.filters.startDate, false),
    endObj: parseBrDateTime(opts.filters.endDate, true),
  }
  const client = opts.filters.client?.toLowerCase() || ""
  const sales = opts.sales.filter((s) => {
    if (!inDateRange(s.created_at, range)) return false
    if (client && s.customer_name && !s.customer_name.toLowerCase().includes(client)) return false
    return true
  })
  const cash = opts.cash.filter((c) => inDateRange(c.created_at, range))
  const receivables = opts.receivables.filter((r) => inDateRange(r.due_date || r.created_at, range))
  const mock = opts.defaultMock
  const builders: Record<string, () => ReportDetails> = {
    extrato: () => buildExtrato(mock, sales),
    "caixa-totais": () => buildCaixaTotais(mock, cash),
    "caixa-pagamentos": () => buildCaixaPagamentos(mock, sales),
    crediario: () => buildCrediario(mock, receivables),
    "vendas-produto": () => buildVendasProduto(mock, sales),
    comissoes: () => buildComissoes(mock, sales),
    evolucao: () => buildEvolucao(mock, sales),
    margem: () => buildMargem(mock, sales),
    taxas: () => buildTaxas(mock, sales),
    deliveries: () => buildDeliveries(mock, opts.deliveries, range),
    "nf-sales": () => buildNfSales(mock, sales),
  }
  return builders[opts.selectedReport]?.() ?? mock
}
