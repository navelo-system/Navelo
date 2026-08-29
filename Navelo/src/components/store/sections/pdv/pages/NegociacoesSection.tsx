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
import { FileText, Filter, Calendar, User, DollarSign, FileSpreadsheet } from "lucide-react"
import { useSales, useDeliveryOrders, useProducts, Sale, Product, DeliveryOrder, dal } from "@/lib/dal"
import { db } from "@/lib/dal/db"
import { useLiveQuery } from "dexie-react-hooks"
import { useTenant } from "@/lib/context/TenantContext"
import { CartItemType } from "@/components/store/sections/pdv/pages/PdvSection"
import { generateSaleReceiptPdf, sanitizeSaleFileName } from "@/lib/pdf/generateSaleReceipt"
import { generateSalesReportPdf } from "@/lib/pdf/generateSalesReportPdf"
import { UI_STRINGS } from "@/constants/strings"
import { useTenantRestrictions } from "@/lib/sync/restrictionsSettings"
import { SupervisorAuthModal } from "@/components/store/sections/pdv/modals/SupervisorAuthModal"
import { useAppNavigation } from "@/lib/navigation/NavigationContext"

export interface NegociacoesSectionProps {
  title?: string
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack: () => void
  initialClientFilter?: string
  onDuplicateToCart?: (items: CartItemType[]) => void
}

import {
  RawSaleItem,
  parseSaleItems,
  getSaleCode,
  resolveSaleItemDisplay,
  SaleDetailModal,
  NegotiationsModalsContainer,
} from "@/components/store/sections/pdv/sales/SaleDetailModal"

function formatPrice(val: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Agora"
  try {
    const d = new Date(dateStr)
    return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
  } catch {
    return dateStr
  }
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

function parseBrDateTimeParts(match: RegExpMatchArray, isEnd: boolean): Date {
  const day = parseInt(match[1], 10)
  const month = parseInt(match[2], 10) - 1
  const year = parseInt(match[3], 10)
  const hour = match[4] !== undefined ? parseInt(match[4], 10) : (isEnd ? 23 : 0)
  const min = match[5] !== undefined ? parseInt(match[5], 10) : (isEnd ? 59 : 0)
  return new Date(year, month, day, hour, min, isEnd ? 59 : 0)
}

function parseBrDateTime(str: string, isEnd = false): Date | null {
  if (!str?.trim()) return null
  const clean = str.trim()
  const brMatch = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}))?$/)
  if (brMatch) return parseBrDateTimeParts(brMatch, isEnd)
  const iso = new Date(clean)
  return isNaN(iso.getTime()) ? null : iso
}

function getPeriodDates(period: string): { start: string; end: string } {
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  const monthsMap: Record<string, number> = { "1M": 1, "3M": 3, "6M": 6, "1A": 12 }
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)

  if (period === "7D") {
    start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    start.setHours(0, 0, 0, 0)
  } else if (monthsMap[period]) {
    start = new Date(now.getFullYear(), now.getMonth() - monthsMap[period], now.getDate(), 0, 0, 0)
  }
  return { start: formatDateTimeBr(start), end: formatDateTimeBr(end) }
}



interface SaleFilters {
  cliente: string
  usuario: string
  dispositivo: string
  mesa: string
  startDate: string
  endDate: string
}

function matchDateFilter(createdAt?: string, startObj?: Date | null, endObj?: Date | null): boolean {
  if (!createdAt) return true
  const saleTime = new Date(createdAt).getTime()
  if (startObj && saleTime < startObj.getTime()) return false
  if (endObj && saleTime > endObj.getTime()) return false
  return true
}

function matchCustomerFilter(customerName?: string, clientTerm?: string): boolean {
  if (!clientTerm) return true
  const lowerCust = (customerName || "").toLowerCase().trim()
  if (lowerCust === "nao selecionado" || lowerCust === "venda avulsa") return false
  return lowerCust.includes(clientTerm)
}

function matchUserFilter(sale: Sale, userTerm?: string): boolean {
  if (!userTerm) return true
  const uName = ((sale as unknown as { user_name?: string }).user_name || "").toLowerCase()
  return uName.includes(userTerm)
}

function matchDeviceFilter(sale: Sale, deviceTerm?: string): boolean {
  if (!deviceTerm) return true
  const dName = ((sale as unknown as { device?: string }).device || "").toLowerCase()
  return dName.includes(deviceTerm)
}

function matchTableFilter(sale: Sale, mesaTerm?: string): boolean {
  if (!mesaTerm) return true
  const tName = String((sale as unknown as { table_number?: string }).table_number || "").toLowerCase()
  return tName.includes(mesaTerm)
}

function matchSaleFilter(sale: Sale, filters: SaleFilters, startObj: Date | null, endObj: Date | null): boolean {
  if (!matchDateFilter(sale.created_at, startObj, endObj)) return false
  if (!matchCustomerFilter(sale.customer_name, filters.cliente)) return false
  if (!matchUserFilter(sale, filters.usuario)) return false
  if (!matchDeviceFilter(sale, filters.dispositivo)) return false
  return matchTableFilter(sale, filters.mesa)
}

function resolveDeliveryPaymentMethod(o: DeliveryOrder): string {
  if (o.payment_method) return o.payment_method
  return o.payment_moment === "advance" ? "Pagamento Antecipado" : "Cobrança na Entrega"
}

function resolveDeliverySaleStatus(o: DeliveryOrder): "COMPLETED" | "PENDING" {
  if (o.payment_moment === "advance" || o.status === "delivered") return "COMPLETED"
  return "PENDING"
}

function mapDeliveryToSale(o: DeliveryOrder): Sale {
  return {
    id: `delivery-${o.id}`,
    company_id: o.company_id,
    tenant_id: o.tenant_id,
    customer_name: o.client_name || "Cliente Delivery",
    total: o.total || 0,
    subtotal: o.subtotal ?? o.total ?? 0,
    discount: o.discount ?? 0,
    payment_method: resolveDeliveryPaymentMethod(o),
    status: resolveDeliverySaleStatus(o),
    created_at: o.created_at || new Date().toISOString(),
    items: (o.items || []) as unknown as Sale["items"],
  }
}

function useCombinedSales(dbSales?: Sale[], dbDeliveryOrders?: DeliveryOrder[]): Sale[] {
  return React.useMemo(() => {
    const list: Sale[] = [...(dbSales || [])]
    ;(dbDeliveryOrders || []).forEach((o) => {
      if (o.status === "canceled") return
      const isCompleted = o.payment_moment === "advance" || o.status === "delivered"
      if (isCompleted) {
        list.push(mapDeliveryToSale(o))
      }
    })
    return list
  }, [dbSales, dbDeliveryOrders])
}

function useFilteredSales(salesList: Sale[], filters: SaleFilters) {
  return React.useMemo(() => {
    if (!salesList || salesList.length === 0) return []
    const startObj = parseBrDateTime(filters.startDate, false)
    const endObj = parseBrDateTime(filters.endDate, true)
    const clientTerm = filters.cliente.trim().toLowerCase()
    const userTerm = filters.usuario.trim().toLowerCase()
    const deviceTerm = filters.dispositivo.trim().toLowerCase()
    const mesaTerm = filters.mesa.trim().toLowerCase()
    const normalizedFilters = { cliente: clientTerm, usuario: userTerm, dispositivo: deviceTerm, mesa: mesaTerm, startDate: filters.startDate, endDate: filters.endDate }

    return salesList
      .filter((s: Sale) => matchSaleFilter(s, normalizedFilters, startObj, endObj))
      .sort((a: Sale, b: Sale) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
  }, [salesList, filters])
}



function NegotiationFilterInputs({
  cliente, setCliente,
  usuario, setUsuario,
  dispositivo, setDispositivo,
  mesa, setMesa,
}: {
  cliente: string; setCliente: (v: string) => void
  usuario: string; setUsuario: (v: string) => void
  dispositivo: string; setDispositivo: (v: string) => void
  mesa: string; setMesa: (v: string) => void
}) {
  const s = UI_STRINGS.negotiations
  return (
    <>
      <Input label={UI_STRINGS.reports.clientLabel} placeholder={UI_STRINGS.reports.clientLabel} value={cliente} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCliente(e.target.value)} />
      <Input label={UI_STRINGS.reports.userLabel} placeholder={UI_STRINGS.reports.userLabel} value={usuario} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsuario(e.target.value)} />
      <Input label={UI_STRINGS.reports.deviceLabel} placeholder={UI_STRINGS.reports.deviceLabel} value={dispositivo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDispositivo(e.target.value)} />
      <Input label={s.tabFilterLabel} placeholder={s.tabFilterPlaceholder} value={mesa} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMesa(e.target.value)} />
    </>
  )
}

function SaleListItemRow({
  sale,
  onSelect,
}: {
  sale: Sale
  onSelect: () => void
}) {
  const saleCode = `Venda #${getSaleCode(sale)}`

  return (
    <Box w="full" padding={2.5} hoverBg="secondary/10" radius="default" cursor="pointer" border borderColor="border/40" onClick={onSelect}>
      <Stack direction="row" justify="between" align="start" w="full">
        <Stack gap={1} flex="1" minW="0">
          <Font variant="body-sm-semibold" color="muted" text={saleCode} />
          <Stack direction="row" align="center" gap={1}>
            <Icon icon={Calendar} size={12} color="muted" />
            <Font variant="auxiliary" color="muted" text={formatDate(sale.created_at)} />
          </Stack>
          {sale.customer_name && sale.customer_name !== "Nao selecionado" && (
            <Stack direction="row" align="center" gap={1}>
              <Icon icon={User} size={12} color="muted" />
              <Font variant="auxiliary" color="muted" text={sale.customer_name} />
            </Stack>
          )}
          <Stack direction="row" align="center" gap={1}>
            <Icon icon={DollarSign} size={12} color="muted" />
            <Font variant="auxiliary" color="muted" text={`${sale.payment_method || "Dinheiro"} ${formatPrice(sale.total)}`} />
          </Stack>
        </Stack>
        <Stack align="end" gap={0}>
          <Font variant="body-bold" color="muted" text={formatPrice(sale.total)} />
          <Font variant="auxiliary" color="muted" text={`Venda: ${formatPrice(sale.total)}`} />
        </Stack>
      </Stack>
    </Box>
  )
}

function NegotiationsListView({
  filteredSales,
  totalAmount,
  onSelectSale,
  onOpenExport,
}: {
  filteredSales: Sale[]
  totalAmount: number
  onSelectSale: (s: Sale) => void
  onOpenExport: () => void
}) {
  const s = UI_STRINGS.negotiations
  return (
    <Stack direction="col" gap={2.5} flex="1" w="full" h="full" minH="0">
      <Box flex="1" w="full" h="full" bg="bg-surface" padding={5} radius="default" direction="col" justify="start" minH="0" overflow="hidden">
        {filteredSales.length === 0 ? (
          <Box w="full" h="full" direction="col" align="center" justify="center">
            <EmptyState icon={FileText} title={s.emptyTitle} subtitle={s.emptySubtitle} />
          </Box>
        ) : (
          <Stack gap={0} w="full" overflow="auto" flex="1">
            {filteredSales.map((sale: Sale) => (
              <SaleListItemRow key={sale.id} sale={sale} onSelect={() => onSelectSale(sale)} />
            ))}
          </Stack>
        )}
      </Box>

      <Box w="full" bg="bg-surface" padding={5} radius="default">
        <Stack direction="row" justify="between" align="center" w="full">
          <Stack gap={1}>
            <Font variant="auxiliary" color="muted" text={s.salesQuantityLabel} />
            <Font variant="h3" text={String(filteredSales.length)} />
          </Stack>
          <Stack direction="row" align="center" gap={5}>
            <Stack align="end" gap={1}>
              <Font variant="auxiliary" color="muted" text={s.totalAmountLabel} />
              <Font variant="h3" color="primary" text={formatPrice(totalAmount)} />
            </Stack>
            <Button variant="primary-pill-icon" icon={FileSpreadsheet} title={s.exportSalesModalTitle} onClick={onOpenExport} />
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}



function buildDuplicatedCartItems(sale: Sale, productMap: Map<string, Product>): CartItemType[] {
  const saleItems = parseSaleItems(sale.items)
  return saleItems
    .map((item: RawSaleItem) => {
      const disp = resolveSaleItemDisplay(item, productMap)
      const itemProductId = item.product_id || item.productId || item.id || ""
      return {
        id: itemProductId,
        name: disp.name,
        unitPrice: disp.unitPrice,
        quantity: disp.qty,
        image: disp.image,
        category: item.category || productMap.get(itemProductId)?.category,
      } as CartItemType
    })
    .filter((i: CartItemType) => Boolean(i.name))
}

function exportSalesCsv(filteredSales: Sale[]) {
  const headers = ["Venda", "Data", "Cliente", "Forma de Pagamento", "Total (R$)"]
  const rows = filteredSales.map((sale: Sale) => {
    const code = getSaleCode(sale)
    const date = formatDate(sale.created_at)
    const client = sale.customer_name && sale.customer_name !== "Nao selecionado" ? sale.customer_name : "-"
    const payment = sale.payment_method || "Dinheiro"
    const total = (sale.total || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    return [code, date, `"${client.replace(/"/g, '""')}"`, payment, total].join(";")
  })
  const csvContent = `\uFEFF${[headers.join(";"), ...rows].join("\n")}`
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `Vendas_${Date.now()}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

interface ExportSalesPdfOptions {
  filteredSales: Sale[]
  totalAmount: number
  startDate: string
  endDate: string
  reportTitle: string
  companyData?: unknown
}

function exportSalesPdf(opts: ExportSalesPdfOptions) {
  const { filteredSales, totalAmount, startDate, endDate, reportTitle, companyData } = opts
  const salesData = {
    title: reportTitle,
    periodText: `${startDate} até ${endDate}`,
    statusText: "Ativa",
    typeText: "Qualquer",
    items: filteredSales.map((sale: Sale) => ({
      code: getSaleCode(sale),
      date: formatDate(sale.created_at),
      client: sale.customer_name && sale.customer_name !== "Nao selecionado" ? sale.customer_name : "",
      total: sale.total || 0,
    })),
    totalAmount,
  }
  generateSalesReportPdf(salesData, companyData as Parameters<typeof generateSalesReportPdf>[1]).then(({ blob }) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Relatorio_${reportTitle.replace(/\s+/g, "_")}_${Date.now()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  })
}

function buildSaleReceiptPayload(sale: Sale, productMap: Map<string, Product>) {
  const saleCode = getSaleCode(sale)
  const parsedItems = parseSaleItems(sale.items)
  return {
    id: sale.id, saleCode, total: sale.total, subtotal: sale.subtotal || sale.total,
    discount: sale.discount || 0, payment_method: sale.payment_method,
    customer_name: sale.customer_name, created_at: sale.created_at,
    items: parsedItems.map((item: RawSaleItem) => {
      const disp = resolveSaleItemDisplay(item, productMap)
      return {
        product_name: disp.name,
        quantity: disp.qty,
        unit_price: disp.unitPrice,
        total_price: disp.totalPrice,
      }
    }),
  }
}

async function uploadPdfReceipt(base64: string, fileName: string, tenantId: string): Promise<string | null> {
  try {
    const response = await fetch("/api/upload-receipt", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfBase64: base64, fileName, tenantId }),
    })
    if (!response.ok) return null
    const res = (await response.json()) as { publicUrl?: string }
    return res.publicUrl || null
  } catch {
    return null
  }
}



function useSaleReceiptPdfManager(
  tenantId: string,
  dbCompany: unknown,
  productMap: Map<string, Product>,
  setSelectedSale: React.Dispatch<React.SetStateAction<Sale | null>>
) {
  const generatePdf = async (sale: Sale): Promise<string | null> => {
    try {
      const saleReceiptData = buildSaleReceiptPayload(sale, productMap)
      const { base64, blob } = await generateSaleReceiptPdf(saleReceiptData, dbCompany || undefined)
      const fileName = `Negociacao_${sanitizeSaleFileName(saleReceiptData.saleCode)}_${sanitizeSaleFileName(sale.id)}.pdf`
      const uploadedUrl = await uploadPdfReceipt(base64, fileName, tenantId)
      if (uploadedUrl) {
        await dal.sales.update({ ...sale, pdf_url: uploadedUrl })
        setSelectedSale((prev) => (prev && prev.id === sale.id ? { ...prev, pdf_url: uploadedUrl } : prev))
        return uploadedUrl
      }
      return URL.createObjectURL(blob)
    } catch {
      return null
    }
  }

  const printSale = async (sale: Sale | null) => {
    if (!sale) return
    if (sale.pdf_url) { window.open(sale.pdf_url, "_blank", "noopener,noreferrer"); return }
    const url = await generatePdf(sale)
    if (url) window.open(url, "_blank", "noopener,noreferrer")
  }

  return { generatePdf, printSale }
}

function useNegotiationFilterState(initialClientFilter?: string) {
  const initialPeriodDates = React.useMemo(() => getPeriodDates("Hoje"), [])
  const [period, setPeriod] = React.useState("Hoje")
  const [startDate, setStartDate] = React.useState(initialPeriodDates.start)
  const [endDate, setEndDate] = React.useState(initialPeriodDates.end)
  const [cliente, setCliente] = React.useState(initialClientFilter || "")
  const [usuario, setUsuario] = React.useState("")
  const [dispositivo, setDispositivo] = React.useState("")
  const [mesa, setMesa] = React.useState("")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)

  const [appliedFilters, setAppliedFilters] = React.useState({
    cliente: initialClientFilter || "",
    usuario: "",
    dispositivo: "",
    mesa: "",
    startDate: initialPeriodDates.start,
    endDate: initialPeriodDates.end,
  })

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    const { start, end } = getPeriodDates(newPeriod)
    setStartDate(start)
    setEndDate(end)
  }

  const handleApplyFilters = () => {
    setAppliedFilters({
      cliente,
      usuario,
      dispositivo,
      mesa,
      startDate,
      endDate,
    })
  }

  return {
    period, startDate, setStartDate, endDate, setEndDate,
    cliente, setCliente, usuario, setUsuario, dispositivo, setDispositivo, mesa, setMesa,
    isFilterDrawerOpen, setIsFilterDrawerOpen, appliedFilters, handlePeriodChange, handleApplyFilters,
  }
}

interface NegSupervisorOptions {
  restrictions: ReturnType<typeof useTenantRestrictions>
  isSupervisorOrAdmin: boolean
  printSale: (s: Sale | null) => void
  selectedSale: Sale | null
  setIsDeleteConfirmOpen: (v: boolean) => void
}

function useNegotiationsSupervisorActions(opts: NegSupervisorOptions) {
  const { restrictions, isSupervisorOrAdmin, printSale, selectedSale, setIsDeleteConfirmOpen } = opts
  const [isSupervisorAuthOpen, setIsSupervisorAuthOpen] = React.useState(false)
  const [pendingSupervisorAction, setPendingSupervisorAction] = React.useState<{ action: () => void; title: string } | null>(null)

  const handlePrintRequest = () => {
    if (!restrictions.reimpressao && !isSupervisorOrAdmin) {
      setPendingSupervisorAction({ action: () => printSale(selectedSale), title: "Reimpressão de ticket" })
      setIsSupervisorAuthOpen(true)
      return
    }
    printSale(selectedSale)
  }

  const handleDeleteRequest = () => {
    if (restrictions.cancelamento && !isSupervisorOrAdmin) {
      setPendingSupervisorAction({ action: () => setIsDeleteConfirmOpen(true), title: "Exclusão de negociação" })
      setIsSupervisorAuthOpen(true)
      return
    }
    setIsDeleteConfirmOpen(true)
  }

  const handleAuthorized = () => {
    if (pendingSupervisorAction) pendingSupervisorAction.action()
    setIsSupervisorAuthOpen(false)
    setPendingSupervisorAction(null)
  }

  const handleCloseSupervisor = () => {
    setIsSupervisorAuthOpen(false)
    setPendingSupervisorAction(null)
  }

  return {
    isSupervisorAuthOpen,
    pendingSupervisorAction,
    handlePrintRequest,
    handleDeleteRequest,
    handleAuthorized,
    handleCloseSupervisor,
  }
}

function useNegotiationQueries(tenantId: string) {
  const dbSales = useSales(tenantId)
  const dbDeliveryOrders = useDeliveryOrders(tenantId)
  const dbProducts = useProducts(tenantId)
  const dbCompany = useLiveQuery(async () => (tenantId ? await db.companies.get(tenantId) : null), [tenantId])

  const productMap = React.useMemo(() => {
    const map = new Map<string, Product>()
    if (dbProducts?.length) {
      dbProducts.forEach((p: Product) => {
        if (p.id) map.set(p.id, p)
        if (p.name) map.set(p.name.toLowerCase().trim(), p)
      })
    }
    return map
  }, [dbProducts])

  return { dbSales, dbDeliveryOrders, dbCompany, productMap }
}

function useNegotiationsHeaderSync({
  title,
  sTitle,
  onBack,
  onOpenFilterDrawer,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}: {
  title?: string
  sTitle: string
  onBack?: () => void
  onOpenFilterDrawer: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}) {
  const onBackRef = React.useRef(onBack)
  React.useEffect(() => { onBackRef.current = onBack }, [onBack])
  const onFilterDrawerRef = React.useRef(onOpenFilterDrawer)
  React.useEffect(() => { onFilterDrawerRef.current = onOpenFilterDrawer })

  React.useEffect(() => {
    setCustomTitle?.(title || sTitle)
    setCustomBack?.(() => () => onBackRef.current?.())
    setCustomActions?.(
      <Box display="block md:hidden">
        <Button variant="primary-pill-icon" icon={Filter} onClick={() => onFilterDrawerRef.current()} />
      </Box>
    )
    return () => { setCustomTitle?.(null); setCustomBack?.(null); setCustomActions?.(null) }
  }, [setCustomBack, setCustomTitle, setCustomActions, title, sTitle])
}

function useNegotiationsStateBundle(initialClientFilter?: string) {
  const f = useNegotiationFilterState(initialClientFilter)
  const [selectedSale, setSelectedSale] = React.useState<Sale | null>(null)
  const [isAccordionOpen, setIsAccordionOpen] = React.useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false)
  const [linkModalUrl, setLinkModalUrl] = React.useState("")
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false)

  return {
    f,
    selectedSale, setSelectedSale,
    isAccordionOpen, setIsAccordionOpen,
    isDeleteConfirmOpen, setIsDeleteConfirmOpen,
    isShareModalOpen, setIsShareModalOpen,
    isLinkModalOpen, setIsLinkModalOpen,
    linkModalUrl, setLinkModalUrl,
    isExportModalOpen, setIsExportModalOpen,
  }
}

function isUserSupervisorOrAdmin(role?: string) {
  if (!role) return false
  const r = role.toUpperCase()
  return r.includes("ADMIN") || r.includes("SUPERVISOR") || r.includes("GERENTE")
}

function NegotiationsMainLayout({
  filteredSales,
  totalFilteredSales,
  f,
  selectedSale,
  setSelectedSale,
  isAccordionOpen,
  setIsAccordionOpen,
  setIsShareModalOpen,
  setIsExportModalOpen,
  productMap,
  handleDuplicate,
  sup,
}: {
  filteredSales: Sale[]
  totalFilteredSales: number
  f: ReturnType<typeof useNegotiationFilterState>
  selectedSale: Sale | null
  setSelectedSale: (s: Sale | null) => void
  isAccordionOpen: boolean
  setIsAccordionOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsShareModalOpen: (v: boolean) => void
  setIsExportModalOpen: (v: boolean) => void
  productMap: Map<string, Product>
  handleDuplicate: () => void
  sup: ReturnType<typeof useNegotiationsSupervisorActions>
}) {
  return (
    <Stack direction="col" gap={5} w="full" flex="1" minH="0">
      <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0" h="full">
        <NegotiationsListView filteredSales={filteredSales} totalAmount={totalFilteredSales} onSelectSale={(sale: Sale) => { setSelectedSale(sale); setIsAccordionOpen(false) }} onOpenExport={() => setIsExportModalOpen(true)} />
        <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
          <FilterPanel title={UI_STRINGS.common.filter} selectedPeriod={f.period} onPeriodChange={f.handlePeriodChange} startDate={f.startDate} onStartDateChange={f.setStartDate} endDate={f.endDate} onEndDateChange={f.setEndDate} onFilter={f.handleApplyFilters}>
            <NegotiationFilterInputs cliente={f.cliente} setCliente={f.setCliente} usuario={f.usuario} setUsuario={f.setUsuario} dispositivo={f.dispositivo} setDispositivo={f.setDispositivo} mesa={f.mesa} setMesa={f.setMesa} />
          </FilterPanel>
        </Box>
        <Modal isOpen={f.isFilterDrawerOpen} onClose={() => f.setIsFilterDrawerOpen(false)} title={UI_STRINGS.common.filter} variant="sidebar">
          <FilterPanel hideTitle borderless selectedPeriod={f.period} onPeriodChange={f.handlePeriodChange} startDate={f.startDate} onStartDateChange={f.setStartDate} endDate={f.endDate} onEndDateChange={f.setEndDate} onFilter={() => { f.handleApplyFilters(); f.setIsFilterDrawerOpen(false) }}>
            <NegotiationFilterInputs cliente={f.cliente} setCliente={f.setCliente} usuario={f.usuario} setUsuario={f.setUsuario} dispositivo={f.dispositivo} setDispositivo={f.setDispositivo} mesa={f.mesa} setMesa={f.setMesa} />
          </FilterPanel>
        </Modal>
        <SaleDetailModal selectedSale={selectedSale} onClose={() => setSelectedSale(null)} productMap={productMap} isAccordionOpen={isAccordionOpen} onToggleAccordion={() => setIsAccordionOpen((prev) => !prev)} onDuplicate={handleDuplicate} onDeleteRequest={sup.handleDeleteRequest} onShareRequest={() => setIsShareModalOpen(true)} onPrintRequest={sup.handlePrintRequest} />
      </Stack>
    </Stack>
  )
}

function useNegotiationsModalsActions({
  selectedSale,
  generatePdf,
  filteredSales,
  totalFilteredSales,
  appliedFilters,
  reportTitle,
  dbCompany,
}: {
  selectedSale: Sale | null
  generatePdf: (s: Sale) => Promise<string | null>
  filteredSales: Sale[]
  totalFilteredSales: number
  appliedFilters: { startDate: string; endDate: string }
  reportTitle: string
  dbCompany: unknown
}) {
  const handleGeneratePdf = React.useCallback(() => (selectedSale ? generatePdf(selectedSale) : Promise.resolve(null)), [selectedSale, generatePdf])
  const handleExportPdf = React.useCallback(() => {
    exportSalesPdf({ filteredSales, totalAmount: totalFilteredSales, startDate: appliedFilters.startDate, endDate: appliedFilters.endDate, reportTitle, companyData: dbCompany })
  }, [filteredSales, totalFilteredSales, appliedFilters, reportTitle, dbCompany])
  const handleExportCsv = React.useCallback(() => { exportSalesCsv(filteredSales) }, [filteredSales])

  return { handleGeneratePdf, handleExportPdf, handleExportCsv }
}

function NegotiationsModalsBundle({
  state,
  tenantId,
  tenantCtx,
  actions,
  sup,
}: {
  state: ReturnType<typeof useNegotiationsStateBundle>
  tenantId: string
  tenantCtx?: ReturnType<typeof useTenant>
  actions: ReturnType<typeof useNegotiationsModalsActions>
  sup: ReturnType<typeof useNegotiationsSupervisorActions>
}) {
  const { selectedSale, setSelectedSale, isDeleteConfirmOpen, setIsDeleteConfirmOpen, isShareModalOpen, setIsShareModalOpen, isLinkModalOpen, setIsLinkModalOpen, linkModalUrl, setLinkModalUrl, isExportModalOpen, setIsExportModalOpen } = state
  const opName = tenantCtx?.currentUser?.name || "Operador"
  const actTitle = sup.pendingSupervisorAction?.title || "Reimpressão / Exclusão"

  return (
    <>
      <NegotiationsModalsContainer
        selectedSale={selectedSale} setSelectedSale={setSelectedSale} isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen} isShareModalOpen={isShareModalOpen} setIsShareModalOpen={setIsShareModalOpen}
        isLinkModalOpen={isLinkModalOpen} setIsLinkModalOpen={setIsLinkModalOpen} linkModalUrl={linkModalUrl} setLinkModalUrl={setLinkModalUrl}
        isExportModalOpen={isExportModalOpen} setIsExportModalOpen={setIsExportModalOpen} onGeneratePdf={actions.handleGeneratePdf}
        onExportPdf={actions.handleExportPdf} onExportCsv={actions.handleExportCsv}
      />
      <SupervisorAuthModal
        isOpen={sup.isSupervisorAuthOpen} onClose={sup.handleCloseSupervisor} onAuthorized={sup.handleAuthorized}
        tenantId={tenantId} operatorName={opName} actionTitle={actTitle} resource="Negociações"
      />
    </>
  )
}

export const NegociacoesSection: React.FC<NegociacoesSectionProps> = ({
  title, setCustomBack, setCustomTitle, setCustomActions, onBack, initialClientFilter, onDuplicateToCart,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const { dbSales, dbDeliveryOrders, dbCompany, productMap } = useNegotiationQueries(tenantId)
  const s = UI_STRINGS.negotiations

  const { currentRoute, navigate, goBack } = useAppNavigation()
  const routeSaleId = currentRoute.view === "vendas" && currentRoute.entityId ? currentRoute.entityId : null

  const state = useNegotiationsStateBundle(initialClientFilter)
  const { f, setSelectedSale, isAccordionOpen, setIsAccordionOpen, setIsShareModalOpen, setIsExportModalOpen } = state

  const allSales = useCombinedSales(dbSales, dbDeliveryOrders)

  const selectedSale = React.useMemo(() => {
    if (routeSaleId && allSales.length > 0) {
      return allSales.find((s) => s.id === routeSaleId) || state.selectedSale
    }
    return state.selectedSale
  }, [routeSaleId, allSales, state.selectedSale])

  const handleSetSelectedSale: React.Dispatch<React.SetStateAction<Sale | null>> = React.useCallback(
    (action: React.SetStateAction<Sale | null>) => {
      setSelectedSale((prev) => {
        const next = typeof action === "function" ? action(prev) : action
        if (next) {
          navigate(`#vendas/${next.id}`)
        } else if (routeSaleId) {
          goBack("#vendas")
        }
        return next
      })
    },
    [navigate, goBack, routeSaleId, setSelectedSale]
  )

  const { generatePdf, printSale } = useSaleReceiptPdfManager(tenantId, dbCompany, productMap, setSelectedSale)

  useNegotiationsHeaderSync({
    title, sTitle: s.title, onBack, onOpenFilterDrawer: () => f.setIsFilterDrawerOpen(true),
    setCustomBack, setCustomTitle, setCustomActions,
  })

  const filteredSales = useFilteredSales(allSales, f.appliedFilters)
  const totalFilteredSales = React.useMemo(() => filteredSales.reduce((acc: number, sale: Sale) => acc + (sale.total || 0), 0), [filteredSales])

  const restrictions = useTenantRestrictions(tenantId)
  const isSupervisorOrAdmin = React.useMemo(() => isUserSupervisorOrAdmin(tenantCtx?.currentUser?.role), [tenantCtx?.currentUser?.role])

  const sup = useNegotiationsSupervisorActions({
    restrictions, isSupervisorOrAdmin, printSale, selectedSale, setIsDeleteConfirmOpen: state.setIsDeleteConfirmOpen,
  })

  const handleDuplicate = React.useCallback(() => {
    if (!selectedSale || !onDuplicateToCart) return
    const items = buildDuplicatedCartItems(selectedSale, productMap)
    if (items.length > 0) {
      onDuplicateToCart(items)
      handleSetSelectedSale(null)
    }
  }, [selectedSale, onDuplicateToCart, productMap, handleSetSelectedSale])

  const actions = useNegotiationsModalsActions({
    selectedSale, generatePdf, filteredSales, totalFilteredSales, appliedFilters: f.appliedFilters, reportTitle: title || s.title, dbCompany,
  })

  return (
    <>
      <NegotiationsMainLayout
        filteredSales={filteredSales} totalFilteredSales={totalFilteredSales} f={f}
        selectedSale={selectedSale} setSelectedSale={handleSetSelectedSale} isAccordionOpen={isAccordionOpen}
        setIsAccordionOpen={setIsAccordionOpen} setIsShareModalOpen={setIsShareModalOpen}
        setIsExportModalOpen={setIsExportModalOpen} productMap={productMap} handleDuplicate={handleDuplicate} sup={sup}
      />
      <NegotiationsModalsBundle state={{ ...state, selectedSale, setSelectedSale: handleSetSelectedSale }} tenantId={tenantId} tenantCtx={tenantCtx} actions={actions} sup={sup} />
    </>
  )
}
