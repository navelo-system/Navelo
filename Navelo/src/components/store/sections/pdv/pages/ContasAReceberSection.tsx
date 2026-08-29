"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Modal } from "@/components/store/base/Modal"
import { Icon } from "@/components/store/base/Icon"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { SaleExportModal } from "@/components/store/sections/pdv/modals/SaleExportModal"
import { generateReceivablesReportPdf } from "@/lib/pdf/generateReceivablesReportPdf"
import { useSales, useDeliveryOrders, Sale, TabEntity, Customer, DeliveryOrder } from "@/lib/dal"
import { db } from "@/lib/dal/db"
import { useLiveQuery } from "dexie-react-hooks"
import { useTenant } from "@/lib/context/TenantContext"
import { PackageSearch, Filter, Calendar, FileText, FileSpreadsheet } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import { calculateReceivableOverdueCharges } from "@/lib/payments/crediarioCalculator"
import { loadCrediarioSettings, CREDIARIO_SETTINGS_EVENT, CrediarioSettings } from "@/lib/sync/crediarioSettings"

export interface ContasAReceberSectionProps {
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

interface ReceivableAccount {
  id: string
  saleId?: string
  type: "TAB" | "CREDIARIO" | "DELIVERY"
  client: string
  docNumber?: string
  issueDate: Date
  issueDateFormatted: string
  dueDate?: Date
  dueDateFormatted?: string
  settlementDate?: Date | null
  settlementDateFormatted?: string
  value: number
  fine: number
  interest: number
  toSettle: number
  status: "PENDING" | "SETTLED"
  device?: string
}

function formatPrice(val: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
}

function formatDateBr(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  const day = pad(d.getDate())
  const month = pad(d.getMonth() + 1)
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

function formatDateTimeBr(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  const day = pad(d.getDate())
  const month = pad(d.getMonth() + 1)
  const year = d.getFullYear()
  const hours = pad(d.getHours())
  const mins = pad(d.getMinutes())
  return `${day}/${month}/${year} ${hours}:${mins}`
}

function parseBrDateSegments(clean: string, isEnd: boolean): Date | null {
  const brMatch = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}))?$/)
  if (!brMatch) return null
  const day = parseInt(brMatch[1], 10)
  const month = parseInt(brMatch[2], 10) - 1
  const year = parseInt(brMatch[3], 10)
  const hour = brMatch[4] !== undefined ? parseInt(brMatch[4], 10) : (isEnd ? 23 : 0)
  const min = brMatch[5] !== undefined ? parseInt(brMatch[5], 10) : (isEnd ? 59 : 0)
  const sec = isEnd ? 59 : 0
  return new Date(year, month, day, hour, min, sec)
}

function parseBrDateTime(str: string, isEnd = false): Date | null {
  if (!str || !str.trim()) return null
  const clean = str.trim()
  const parsed = parseBrDateSegments(clean, isEnd)
  if (parsed) return parsed
  const isoDate = new Date(clean)
  return isNaN(isoDate.getTime()) ? null : isoDate
}

function getPeriodDates(period: string): { start: string; end: string } {
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)

  if (period === "7D") {
    start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    start.setHours(0, 0, 0, 0)
  } else if (period === "1M") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 0, 0, 0)
  } else if (period === "3M") {
    start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate(), 0, 0, 0)
  } else if (period === "6M") {
    start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate(), 0, 0, 0)
  } else if (period === "1A") {
    start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), 0, 0, 0)
  }
  return { start: formatDateTimeBr(start), end: formatDateTimeBr(end) }
}

interface SaleExtraData {
  is_receivable?: boolean
  due_date?: string
  is_settled?: boolean
  settled_at?: string
  doc_number?: string
  fine?: number
  interest?: number
  device?: string
  terminal?: string
}

function isSaleReceivable(sale: Sale): boolean {
  const method = (sale.payment_method || "").toLowerCase()
  const extra = sale as unknown as SaleExtraData
  return method.includes("crediário") || method.includes("crediario") ||
    method.includes("prazo") || method.includes("boleto") ||
    sale.status === "PENDING" || Boolean(extra.is_receivable)
}

function resolveReceivableSettlement(isSettled: boolean, extra: SaleExtraData, due: Date): Date | null {
  if (!isSettled) return null
  return extra.settled_at ? new Date(extra.settled_at) : due
}

function resolveReceivableDates(sale: Sale, extra: SaleExtraData) {
  const issue = sale.created_at ? new Date(sale.created_at) : new Date()
  const due = extra.due_date ? new Date(extra.due_date) : new Date(issue.getTime() + 30 * 24 * 60 * 60 * 1000)
  const isSettled = sale.status === "SETTLED" || Boolean(extra.is_settled)
  const settlement = resolveReceivableSettlement(isSettled, extra, due)
  return { issue, due, isSettled, settlement }
}

function resolveCustomerDoc(sale: Sale, customerMap?: Map<string, Customer>): string {
  if (sale.customer_id && customerMap?.has(sale.customer_id)) {
    const cust = customerMap.get(sale.customer_id)
    if (cust?.document) return cust.document
  }
  const extra = sale as unknown as SaleExtraData
  return extra.doc_number || ""
}

interface ResolveReceivableDocParams {
  sale: Sale
  extra: SaleExtraData
  idx: number
  totalCount: number
  customerMap?: Map<string, Customer>
}

function resolveReceivableDocAndClient(p: ResolveReceivableDocParams) {
  const { sale, extra, idx, totalCount, customerMap } = p
  const clientName = sale.customer_name && sale.customer_name !== "Nao selecionado" ? sale.customer_name : "Cliente Avulso"
  const custDoc = resolveCustomerDoc(sale, customerMap)
  const docNum = custDoc || extra.doc_number || `019.${totalCount - idx}-1/1`
  return { docNum, clientName }
}

function useCrediarioSettings(): CrediarioSettings {
  const [settings, setSettings] = React.useState<CrediarioSettings>(() => loadCrediarioSettings())
  React.useEffect(() => {
    const handleUpdate = () => setSettings(loadCrediarioSettings())
    window.addEventListener(CREDIARIO_SETTINGS_EVENT, handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener(CREDIARIO_SETTINGS_EVENT, handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [])
  return settings
}

function resolveReceivableSettlementDisplay(settlement: Date | null, isSettled: boolean, total: number) {
  const settlementDateFormatted = settlement ? formatDateBr(settlement) : undefined
  const toSettle = isSettled ? 0 : total
  const status: "PENDING" | "SETTLED" = isSettled ? "SETTLED" : "PENDING"
  return { settlementDateFormatted, toSettle, status }
}

function mapSaleToReceivable(
  sale: Sale,
  idx: number,
  totalCount: number,
  customerMap?: Map<string, Customer>,
  crediarioSettings?: CrediarioSettings
): ReceivableAccount | null {
  if (!isSaleReceivable(sale)) return null

  const extra = sale as unknown as SaleExtraData
  const { issue, due, isSettled, settlement } = resolveReceivableDates(sale, extra)
  const { docNum, clientName } = resolveReceivableDocAndClient({ sale, extra, idx, totalCount, customerMap })
  const { settlementDateFormatted, toSettle: baseToSettle, status } = resolveReceivableSettlementDisplay(settlement, isSettled, sale.total || 0)

  let fine = extra.fine || 0
  let interest = extra.interest || 0
  let toSettle = baseToSettle

  if (status === "PENDING" && due && crediarioSettings) {
    const calc = calculateReceivableOverdueCharges(sale.total || 0, due, new Date(), crediarioSettings)
    fine = calc.fine
    interest = calc.interest
    toSettle = calc.toSettle
  }

  return {
    id: sale.id,
    saleId: sale.id,
    type: "CREDIARIO",
    client: clientName,
    docNumber: docNum,
    issueDate: issue,
    issueDateFormatted: formatDateBr(issue),
    dueDate: due,
    dueDateFormatted: formatDateBr(due),
    settlementDate: settlement,
    settlementDateFormatted,
    value: sale.total || 0,
    fine,
    interest,
    toSettle,
    status,
    device: extra.device || extra.terminal || "",
  }
}

interface FilterParams {
  periodType: "Emissão" | "Vencimento" | "Liquidação"
  startObj: Date | null
  endObj: Date | null
  clientTerm: string
  deviceTerm: string
}

function matchDateRange(targetDate: Date | null, startObj: Date | null, endObj: Date | null): boolean {
  if (!targetDate) return false
  const tTime = targetDate.getTime()
  if (startObj && tTime < startObj.getTime()) return false
  if (endObj && tTime > endObj.getTime()) return false
  return true
}

function resolveTargetDate(acc: ReceivableAccount, periodType: "Emissão" | "Vencimento" | "Liquidação"): Date | null {
  if (periodType === "Vencimento") return acc.dueDate || acc.issueDate
  if (periodType === "Liquidação") return acc.settlementDate || null
  return acc.issueDate
}

function isPendingAndFilteredToday(acc: ReceivableAccount, p: FilterParams): boolean {
  if (acc.status !== "PENDING") return false
  if (!p.startObj || !p.endObj) return false
  return p.startObj.toDateString() === new Date().toDateString()
}

function matchTerms(acc: ReceivableAccount, clientTerm: string, deviceTerm: string): boolean {
  if (clientTerm && !acc.client.toLowerCase().includes(clientTerm)) return false
  if (deviceTerm && (!acc.device || !acc.device.toLowerCase().includes(deviceTerm))) return false
  return true
}

function filterReceivable(acc: ReceivableAccount, p: FilterParams): boolean {
  const targetDate = resolveTargetDate(acc, p.periodType)
  if (p.periodType === "Liquidação" && !targetDate) return false
  if (targetDate && !matchDateRange(targetDate, p.startObj, p.endObj) && !isPendingAndFilteredToday(acc, p)) {
    return false
  }
  return matchTerms(acc, p.clientTerm, p.deviceTerm)
}

function formatTabIdentifier(tab: TabEntity): string {
  const code = (tab.code || "").trim()
  const label = (tab.label || "").trim()
  if (code) return code.startsWith("#") ? code : `#${code}`
  if (label) return label
  return `#${tab.id}`
}

function resolveTabDisplayName(tab: TabEntity): string {
  const identifier = formatTabIdentifier(tab)
  const custName = tab.customer_name && tab.customer_name !== "Nao selecionado" ? tab.customer_name.trim() : ""
  if (custName) {
    return `Comanda ${identifier} • ${custName}`
  }
  return `Comanda ${identifier}`
}

function resolveTabDate(tab: TabEntity): Date {
  if (tab.updated_at) return new Date(tab.updated_at)
  if (tab.created_at) return new Date(tab.created_at)
  return new Date()
}

function mapTabToReceivable(tab: TabEntity): ReceivableAccount {
  const issue = resolveTabDate(tab)
  const issueDateFormatted = formatDateBr(issue)

  return {
    id: `tab-${tab.id}`,
    saleId: `tab-${tab.id}`,
    type: "TAB",
    client: resolveTabDisplayName(tab),
    issueDate: issue,
    issueDateFormatted,
    value: tab.total || 0,
    fine: 0,
    interest: 0,
    toSettle: tab.total || 0,
    status: "PENDING",
    device: "Comanda Aberta",
  }
}

function mapDeliveryToReceivable(order: DeliveryOrder): ReceivableAccount {
  const issue = order.created_at ? new Date(order.created_at) : new Date()
  const issueDateFormatted = formatDateBr(issue)
  const clientName = order.client_name ? `Delivery • ${order.client_name}` : `Delivery #${order.id}`
  const docNum = order.client_document || `Ped #${order.id}`

  return {
    id: `delivery-${order.id}`,
    saleId: `delivery-${order.id}`,
    type: "DELIVERY",
    client: clientName,
    docNumber: docNum,
    issueDate: issue,
    issueDateFormatted,
    value: order.total || 0,
    fine: 0,
    interest: 0,
    toSettle: order.total || 0,
    status: "PENDING",
    device: order.origin || "Pedido Delivery",
  }
}

function useReceivablesData(
  dbSales?: Sale[],
  dbTabs?: TabEntity[],
  dbCustomers?: Customer[],
  dbDeliveryOrders?: DeliveryOrder[],
  crediarioSettings?: CrediarioSettings
) {
  const customerMap = React.useMemo(() => {
    const map = new Map<string, Customer>()
    if (dbCustomers) {
      dbCustomers.forEach((c) => { map.set(c.id, c) })
    }
    return map
  }, [dbCustomers])

  const allAccounts: ReceivableAccount[] = React.useMemo(() => {
    const list: ReceivableAccount[] = []
    if (dbSales && dbSales.length > 0) {
      dbSales.forEach((sale, idx) => {
        const mapped = mapSaleToReceivable(sale, idx, dbSales.length, customerMap, crediarioSettings)
        if (mapped) list.push(mapped)
      })
    }
    if (dbTabs && dbTabs.length > 0) {
      dbTabs.forEach((tab) => {
        if ((tab.status === "OPEN" || !tab.status) && (tab.total || 0) > 0) {
          list.push(mapTabToReceivable(tab))
        }
      })
    }
    if (dbDeliveryOrders && dbDeliveryOrders.length > 0) {
      dbDeliveryOrders.forEach((o) => {
        const isPendingOnDelivery =
          o.payment_moment !== "advance" &&
          o.status !== "delivered" &&
          o.status !== "canceled"
        if (isPendingOnDelivery && (o.total || 0) > 0) {
          list.push(mapDeliveryToReceivable(o))
        }
      })
    }
    return list
  }, [dbSales, dbTabs, customerMap, dbDeliveryOrders, crediarioSettings])

  return { allAccounts }
}

function ReceivableRowItem({ acc }: { acc: ReceivableAccount }) {
  const s = UI_STRINGS.receivables

  if (acc.type === "TAB" || acc.type === "DELIVERY") {
    return (
      <Box padding={2.5} w="full">
        <Stack direction="row" justify="between" align="start" w="full">
          <Stack gap={1} flex="1" minW="0">
            <Font variant="body-sm-semibold" text={acc.client} />
            <Stack direction="row" align="center" gap={1}>
              <Icon icon={Calendar} size={12} color="muted" />
              <Font variant="auxiliary" color="muted" text={`${s.issueDatePrefix}${acc.issueDateFormatted}`} />
            </Stack>
          </Stack>
          <Stack align="end" gap={0}>
            <Font variant="body-bold" text={formatPrice(acc.value)} />
            <Font variant="auxiliary" color="muted" text={`${s.toSettlePrefix}${formatPrice(acc.toSettle)}`} />
          </Stack>
        </Stack>
      </Box>
    )
  }

  return (
    <Box padding={2.5} w="full">
      <Stack direction="row" justify="between" align="start" w="full">
        <Stack gap={1} flex="1" minW="0">
          <Font variant="body-sm-semibold" text={acc.client} />
          {acc.docNumber && (
            <Stack direction="row" align="center" gap={1}>
              <Icon icon={FileText} size={12} color="muted" />
              <Font variant="auxiliary" color="muted" text={`${s.docPrefix}${acc.docNumber}`} />
            </Stack>
          )}
          <Stack direction="row" align="center" gap={1}>
            <Icon icon={Calendar} size={12} color="muted" />
            <Font variant="auxiliary" color="muted" text={`${s.issueDatePrefix}${acc.issueDateFormatted}`} />
          </Stack>
          {acc.dueDateFormatted && (
            <Stack direction="row" align="center" gap={1}>
              <Icon icon={Calendar} size={12} color="muted" />
              <Font variant="auxiliary" color="muted" text={`${s.dueDatePrefix}${acc.dueDateFormatted}`} />
            </Stack>
          )}
        </Stack>
        <Stack align="end" gap={0}>
          <Font variant="body-bold" text={formatPrice(acc.value)} />
          <Font variant="auxiliary" color="muted" text={`${s.finePrefix}${formatPrice(acc.fine)}`} />
          <Font variant="auxiliary" color="muted" text={`${s.interestPrefix}${formatPrice(acc.interest)}`} />
          <Font variant="auxiliary" color="muted" text={`${s.toSettlePrefix}${formatPrice(acc.toSettle)}`} />
        </Stack>
      </Stack>
    </Box>
  )
}

function ReceivablesListView({ filteredAccounts }: { filteredAccounts: ReceivableAccount[] }) {
  const s = UI_STRINGS.receivables
  if (filteredAccounts.length === 0) {
    return (
      <Box flex="1" w="full" h="full" bg="bg-surface" padding={5} radius="default" direction="col" justify="center" align="center" minH="0">
        <EmptyState icon={PackageSearch} title={s.emptyTitle} subtitle={s.emptySubtitle} />
      </Box>
    )
  }
  return (
    <Box flex="1" w="full" h="full" bg="bg-surface" padding={5} radius="default" direction="col" overflow="x-hidden y-auto" minH="0">
      <Stack gap={0} w="full">
        {filteredAccounts.map((acc, idx) => (
          <React.Fragment key={acc.id}>
            {idx > 0 && <Box h="h-[1px]" bg="bg-border" w="full" />}
            <ReceivableRowItem acc={acc} />
          </React.Fragment>
        ))}
      </Stack>
    </Box>
  )
}

function ReceivablesBottomSummary({
  totalToReceive, totalSettled, onOpenExport,
}: {
  totalToReceive: number
  totalSettled: number
  onOpenExport: () => void
}) {
  const s = UI_STRINGS.receivables
  return (
    <Box w="full" bg="bg-surface" padding={5} radius="default">
      <Stack direction="row" justify="between" align="center" w="full">
        <Stack gap={1}>
          <Font variant="auxiliary" color="muted" text={s.toReceiveLabel} />
          <Font variant="h3" text={formatPrice(totalToReceive)} />
        </Stack>
        <Stack direction="row" align="center" gap={5}>
          <Stack align="end" gap={1}>
            <Font variant="auxiliary" color="muted" text={s.settledLabel} />
            <Font variant="h3" color="primary" text={formatPrice(totalSettled)} />
          </Stack>
          <Button variant="primary-pill-icon" icon={FileSpreadsheet} title={s.exportReceivablesModalTitle} onClick={onOpenExport} />
        </Stack>
      </Stack>
    </Box>
  )
}

function ReceivableFilterInputs({
  periodType, setPeriodType, cliente, setCliente, dispositivo, setDispositivo,
}: {
  periodType: "Emissão" | "Vencimento" | "Liquidação"
  setPeriodType: (p: "Emissão" | "Vencimento" | "Liquidação") => void
  cliente: string; setCliente: (c: string) => void
  dispositivo: string; setDispositivo: (d: string) => void
}) {
  const s = UI_STRINGS.receivables
  const periodTypes: Array<"Emissão" | "Vencimento" | "Liquidação"> = ["Emissão", "Vencimento", "Liquidação"]

  return (
    <>
      <Stack gap={2.5} w="full">
        <Font variant="auxiliary" color="muted" text={s.periodTypeLabel} />
        <Stack direction="row" wrap gap={2.5} w="full">
          {periodTypes.map((pt) => (
            <Button
              key={pt}
              variant={periodType === pt ? "primary-pill-xs" : "outline-pill-xs"}
              label={pt}
              onClick={() => setPeriodType(pt)}
              type="button"
            />
          ))}
        </Stack>
      </Stack>
      <Input label={s.clientLabel} placeholder={s.clientPlaceholder} value={cliente} onChange={(e) => setCliente(e.target.value)} />
      <Input label={s.deviceLabel} placeholder={s.devicePlaceholder} value={dispositivo} onChange={(e) => setDispositivo(e.target.value)} />
    </>
  )
}

function exportCsvFile(filteredAccounts: ReceivableAccount[]) {
  const headers = ["Cliente", "Documento", "Data Emissao", "Data Vencimento", "Data Liquidacao", "Valor (R$)", "Multa (R$)", "Juros (R$)", "Valor a Liquidar (R$)", "Situacao"]
  const rows = filteredAccounts.map((acc) => [
    `"${acc.client.replace(/"/g, '""')}"`,
    acc.docNumber || "-",
    acc.issueDateFormatted,
    acc.dueDateFormatted || "-",
    acc.settlementDateFormatted || "-",
    acc.value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    acc.fine.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    acc.interest.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    acc.toSettle.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    acc.status === "SETTLED" ? "Liquidada" : "Pendente",
  ].join(";"))

  const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `Contas_Receber_${Date.now()}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

interface ExportPdfParams {
  s: typeof UI_STRINGS.receivables
  startDate: string
  endDate: string
  periodType: "Emissão" | "Vencimento" | "Liquidação"
  cliente: string
  dispositivo: string
  filteredAccounts: ReceivableAccount[]
  totalToReceive: number
  totalSettled: number
  dbCompany: unknown
  tenantCtx: ReturnType<typeof useTenant>
}

async function exportPdfReport(p: ExportPdfParams) {
  const reportData = {
    title: p.s.title, periodText: `${p.startDate} até ${p.endDate}`, periodType: p.periodType,
    clientFilter: p.cliente.trim() || undefined, deviceFilter: p.dispositivo.trim() || undefined,
    items: p.filteredAccounts.map((acc) => ({
      client: acc.client, docNumber: acc.docNumber || "-", issueDate: acc.issueDateFormatted,
      dueDate: acc.dueDateFormatted || "-", value: acc.value, fine: acc.fine, interest: acc.interest,
      toSettle: acc.toSettle, status: acc.status === "SETTLED" ? "Liquidada" : "Pendente",
    })),
    totalToReceive: p.totalToReceive, totalSettled: p.totalSettled,
  }
  const companyData = p.dbCompany || (p.tenantCtx?.currentTenant as Parameters<typeof generateReceivablesReportPdf>[1]) || undefined
  const { blob } = await generateReceivablesReportPdf(reportData, companyData as Parameters<typeof generateReceivablesReportPdf>[1])
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `Relatorio_Contas_Receber_${Date.now()}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function useReceivableFilterState() {
  const initialDates = React.useMemo(() => getPeriodDates("Hoje"), [])
  const [period, setPeriod] = React.useState("Hoje")
  const [periodType, setPeriodType] = React.useState<"Emissão" | "Vencimento" | "Liquidação">("Emissão")
  const [startDate, setStartDate] = React.useState(initialDates.start)
  const [endDate, setEndDate] = React.useState(initialDates.end)
  const [cliente, setCliente] = React.useState("")
  const [dispositivo, setDispositivo] = React.useState("")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)

  const [appliedFilters, setAppliedFilters] = React.useState({
    periodType: "Emissão" as "Emissão" | "Vencimento" | "Liquidação",
    startDate: initialDates.start,
    endDate: initialDates.end,
    cliente: "",
    dispositivo: "",
  })

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    const { start, end } = getPeriodDates(newPeriod)
    setStartDate(start)
    setEndDate(end)
  }

  const handleApplyFilters = () => {
    setAppliedFilters({
      periodType,
      startDate,
      endDate,
      cliente,
      dispositivo,
    })
  }

  return {
    period, periodType, setPeriodType, startDate, setStartDate, endDate, setEndDate,
    cliente, setCliente, dispositivo, setDispositivo, isFilterDrawerOpen, setIsFilterDrawerOpen,
    appliedFilters, handlePeriodChange, handleApplyFilters,
  }
}

export const ContasAReceberSection: React.FC<ContasAReceberSectionProps> = ({
  setCustomBack, setCustomTitle, setCustomActions, onBackToDashboard,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const dbSales = useSales(tenantId)
  const dbDeliveryOrders = useDeliveryOrders(tenantId)
  const dbTabs = useLiveQuery(async () => (tenantId ? await db.tabs.where("tenant_id").equals(tenantId).toArray() : []), [tenantId])
  const dbCustomers = useLiveQuery(async () => (tenantId ? await db.customers.where("tenant_id").equals(tenantId).toArray() : []), [tenantId])
  const dbCompany = useLiveQuery(async () => (tenantId ? await db.companies.get(tenantId) : null), [tenantId])

  const s = UI_STRINGS.receivables
  const f = useReceivableFilterState()
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false)

  const onBackToDashboardRef = React.useRef(onBackToDashboard)
  React.useEffect(() => { onBackToDashboardRef.current = onBackToDashboard }, [onBackToDashboard])

  const onFilterDrawerRef = React.useRef(() => f.setIsFilterDrawerOpen(true))
  React.useEffect(() => { onFilterDrawerRef.current = () => f.setIsFilterDrawerOpen(true) })

  React.useEffect(() => {
    setCustomBack?.(() => () => onBackToDashboardRef.current())
    setCustomTitle?.(s.title)
    setCustomActions?.(
      <Box display="block md:hidden">
        <Button variant="primary-pill-icon" icon={Filter} onClick={() => onFilterDrawerRef.current()} />
      </Box>
    )
    return () => { setCustomBack?.(null); setCustomTitle?.(null); setCustomActions?.(null) }
  }, [setCustomBack, setCustomTitle, setCustomActions, s.title])

  const crediarioSettings = useCrediarioSettings()
  const { allAccounts } = useReceivablesData(dbSales, dbTabs, dbCustomers, dbDeliveryOrders, crediarioSettings)

  const filteredAccounts = React.useMemo(() => {
    const clientTerm = f.appliedFilters.cliente.trim().toLowerCase()
    const deviceTerm = f.appliedFilters.dispositivo.trim().toLowerCase()
    const startObj = parseBrDateTime(f.appliedFilters.startDate, false)
    const endObj = parseBrDateTime(f.appliedFilters.endDate, true)
    return allAccounts
      .filter((acc) => filterReceivable(acc, { periodType: f.appliedFilters.periodType, startObj, endObj, clientTerm, deviceTerm }))
      .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())
  }, [allAccounts, f.appliedFilters])

  const totalToReceive = React.useMemo(() => filteredAccounts.filter((a) => a.status === "PENDING").reduce((acc, curr) => acc + curr.toSettle, 0), [filteredAccounts])
  const totalSettled = React.useMemo(() => filteredAccounts.filter((a) => a.status === "SETTLED").reduce((acc, curr) => acc + curr.value, 0), [filteredAccounts])

  const handleExportPdf = () => exportPdfReport({
    s, startDate: f.appliedFilters.startDate, endDate: f.appliedFilters.endDate,
    periodType: f.appliedFilters.periodType, cliente: f.appliedFilters.cliente,
    dispositivo: f.appliedFilters.dispositivo, filteredAccounts, totalToReceive, totalSettled, dbCompany, tenantCtx,
  })

  return (
    <>
      <Stack direction="col" gap={5} w="full" flex="1" minH="0" h="full" overflow="hidden">
        <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0" h="full" overflow="hidden">
          <Stack direction="col" gap={5} flex="1" h="full" minH="0" overflow="hidden">
            <ReceivablesListView filteredAccounts={filteredAccounts} />
            <ReceivablesBottomSummary totalToReceive={totalToReceive} totalSettled={totalSettled} onOpenExport={() => setIsExportModalOpen(true)} />
          </Stack>

          <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
            <FilterPanel title={s.filtersPanelTitle} selectedPeriod={f.period} onPeriodChange={f.handlePeriodChange} startDate={f.startDate} onStartDateChange={f.setStartDate} endDate={f.endDate} onEndDateChange={f.setEndDate} onFilter={f.handleApplyFilters}>
              <ReceivableFilterInputs periodType={f.periodType} setPeriodType={f.setPeriodType} cliente={f.cliente} setCliente={f.setCliente} dispositivo={f.dispositivo} setDispositivo={f.setDispositivo} />
            </FilterPanel>
          </Box>

          <Modal isOpen={f.isFilterDrawerOpen} onClose={() => f.setIsFilterDrawerOpen(false)} title={s.filtersPanelTitle} variant="sidebar">
            <FilterPanel hideTitle borderless selectedPeriod={f.period} onPeriodChange={f.handlePeriodChange} startDate={f.startDate} onStartDateChange={f.setStartDate} endDate={f.endDate} onEndDateChange={f.setEndDate} onFilter={() => { f.handleApplyFilters(); f.setIsFilterDrawerOpen(false) }}>
              <ReceivableFilterInputs periodType={f.periodType} setPeriodType={f.setPeriodType} cliente={f.cliente} setCliente={f.setCliente} dispositivo={f.dispositivo} setDispositivo={f.setDispositivo} />
            </FilterPanel>
          </Modal>
        </Stack>
      </Stack>

      <SaleExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} onExportPdf={handleExportPdf} onExportCsv={() => exportCsvFile(filteredAccounts)} />
    </>
  )
}
