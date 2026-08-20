"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Modal } from "@/components/store/base/Modal"
import { Icon } from "@/components/store/base/Icon"
import { Avatar } from "@/components/store/base/Avatar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { FileText, Filter, Calendar, User, DollarSign, Share2, Trash2, ChevronDown, ChevronUp, Package, FileSpreadsheet } from "lucide-react"
import { useSales, useProducts, Sale, Product, dal } from "@/lib/dal"
import { db } from "@/lib/dal/db"
import { useLiveQuery } from "dexie-react-hooks"
import { useTenant } from "@/lib/context/TenantContext"
import { CartItemType } from "@/components/store/sections/pdv/pages/PdvSection"
import { SaleShareModal } from "@/components/store/sections/pdv/modals/SaleShareModal"
import { SaleLinkModal } from "@/components/store/sections/pdv/modals/SaleLinkModal"
import { SaleExportModal } from "@/components/store/sections/pdv/modals/SaleExportModal"
import { generateSaleReceiptPdf, sanitizeSaleFileName } from "@/lib/pdf/generateSaleReceipt"
import { generateSalesReportPdf } from "@/lib/pdf/generateSalesReportPdf"
import { UI_STRINGS } from "@/constants/strings"

export interface NegociacoesSectionProps {
  title?: string
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack: () => void
  initialClientFilter?: string
  onDuplicateToCart?: (items: CartItemType[]) => void
}

interface RawSaleItem {
  id?: string
  product_id?: string
  productId?: string
  product_name?: string
  name?: string
  title?: string
  productName?: string
  description?: string
  unit_price?: number
  unitPrice?: number
  price?: number
  unit_val?: number
  quantity?: number
  qty?: number
  amount?: number
  count?: number
  total_price?: number
  totalPrice?: number
  total?: number
  image?: string
  image_url?: string
  imageUrl?: string
  unit?: string
  unidade?: string
  category?: string
  product?: { id?: string; name?: string; product_name?: string; price?: number; unit_price?: number; image_url?: string; unit?: string }
}

interface SaleItemDisplay {
  name: string
  unitPrice: number
  qty: number
  totalPrice: number
  image?: string
  unit: string
}

function parseSaleItems(items: unknown): RawSaleItem[] {
  if (Array.isArray(items)) return items as RawSaleItem[]
  if (typeof items === "string") {
    try {
      const parsed = JSON.parse(items)
      if (Array.isArray(parsed)) return parsed as RawSaleItem[]
    } catch {
      return []
    }
  }
  return []
}

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

function getSaleCode(sale: Sale): string {
  const customCode = (sale as unknown as { code?: string | number }).code
  if (customCode) return String(customCode).padStart(4, "0")
  if (sale.id) {
    const parts = sale.id.split("-")
    const last = parts[parts.length - 1]
    return last.slice(-4).toUpperCase()
  }
  return "0001"
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

function useFilteredSales(dbSales: ReturnType<typeof useSales>, filters: SaleFilters) {
  return React.useMemo(() => {
    if (!dbSales || dbSales.length === 0) return []
    const startObj = parseBrDateTime(filters.startDate, false)
    const endObj = parseBrDateTime(filters.endDate, true)
    const clientTerm = filters.cliente.trim().toLowerCase()
    const userTerm = filters.usuario.trim().toLowerCase()
    const deviceTerm = filters.dispositivo.trim().toLowerCase()
    const mesaTerm = filters.mesa.trim().toLowerCase()
    const normalizedFilters = { cliente: clientTerm, usuario: userTerm, dispositivo: deviceTerm, mesa: mesaTerm, startDate: filters.startDate, endDate: filters.endDate }

    return dbSales
      .filter((s: Sale) => matchSaleFilter(s, normalizedFilters, startObj, endObj))
      .sort((a: Sale, b: Sale) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
  }, [dbSales, filters])
}

function resolveItemName(item: RawSaleItem, matchedProd?: Product | null): string {
  if (item.product_name) return item.product_name
  if (item.name) return item.name
  if (item.title) return item.title
  if (item.productName) return item.productName
  if (item.description) return item.description
  return matchedProd?.name || "Item"
}

function resolveItemPrice(item: RawSaleItem, matchedProd?: Product | null): number {
  if (item.unit_price !== undefined) return item.unit_price
  if (item.unitPrice !== undefined) return item.unitPrice
  if (item.price !== undefined) return item.price
  if (item.unit_val !== undefined) return item.unit_val
  return matchedProd?.price || 0
}

function resolveItemQuantity(item: RawSaleItem): number {
  if (item.quantity !== undefined) return item.quantity
  if (item.qty !== undefined) return item.qty
  if (item.amount !== undefined) return item.amount
  if (item.count !== undefined) return item.count
  return 1
}

function resolveItemImage(item: RawSaleItem, matchedProd?: Product | null): string | undefined {
  if (item.image) return item.image
  if (item.image_url) return item.image_url
  if (item.imageUrl) return item.imageUrl
  return matchedProd?.image_url
}

function resolveItemUnit(item: RawSaleItem, matchedProd?: Product | null): string {
  if (item.unit) return item.unit
  if (item.unidade) return item.unidade
  return matchedProd?.unit || "UN"
}

function getItemProductId(item: RawSaleItem): string {
  if (item.product_id) return item.product_id
  if (item.productId) return item.productId
  if (item.id) return item.id
  return item.product?.id || ""
}

function resolveMatchedProduct(item: RawSaleItem, productMap: Map<string, Product>): Product | null {
  const pId = getItemProductId(item)
  if (pId && productMap.has(pId)) {
    return productMap.get(pId) || null
  }
  const rawName = item.product_name || item.name || ""
  if (rawName) {
    return productMap.get(rawName.toLowerCase().trim()) || null
  }
  return null
}

function resolveSaleItemDisplay(item: RawSaleItem, productMap: Map<string, Product>): SaleItemDisplay {
  const matchedProd = resolveMatchedProduct(item, productMap)
  const name = resolveItemName(item, matchedProd)
  const unitPrice = resolveItemPrice(item, matchedProd)
  const qty = resolveItemQuantity(item)
  const totalPrice = item.total_price ?? item.totalPrice ?? item.total ?? (unitPrice * qty)
  const image = resolveItemImage(item, matchedProd)
  const unit = resolveItemUnit(item, matchedProd)

  return { name, unitPrice, qty, totalPrice, image, unit }
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
    <Box w="full" padding={2.5} hoverBg="primary/10" radius="default" cursor="pointer" border borderColor="border/40" onClick={onSelect}>
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

function SaleDetailItemRow({ item, productMap }: { item: RawSaleItem; productMap: Map<string, Product> }) {
  const disp = resolveSaleItemDisplay(item, productMap)

  return (
    <Box padding={2.5} bg="bg-brand-primary/10" hoverBg="primary/10" radius="none" w="full" cursor="pointer">
      <Stack direction="row" align="center" justify="between" w="full">
        <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
          <Box w="w-10" h="h-10" bg="bg-surface-sunken" borderColor="border-border" border radius="default" shrink="0" overflow="hidden">
            {disp.image ? (
              <Box as="img" src={disp.image} alt={disp.name} w="full" h="full" objectFit="cover" />
            ) : (
              <Stack w="full" h="full" align="center" justify="center">
                <Icon icon={Package} size={20} color="muted" />
              </Stack>
            )}
          </Box>
          <Stack gap={1} align="start" flex="1" minW="0">
            <Font variant="body" text={disp.name} />
            <Font variant="auxiliary" color="muted" truncate text={`${disp.qty} ${disp.unit} x ${formatPrice(disp.unitPrice)}`} />
          </Stack>
        </Stack>
        <Box shrink="0">
          <Font variant="body" text={formatPrice(disp.totalPrice)} />
        </Box>
      </Stack>
    </Box>
  )
}

function SaleDetailCustomerBox({ customerName }: { customerName?: string }) {
  const s = UI_STRINGS.negotiations
  if (!customerName || customerName === "Nao selecionado" || customerName === "Venda Avulsa") return null
  return (
    <Box padding={2.5} bg="bg-brand-primary/10" radius="none" w="full">
      <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
        <Avatar fallback={customerName.substring(0, 2).toUpperCase()} />
        <Stack gap={1} align="start" flex="1" minW="0">
          <Font variant="body" text={customerName} />
          <Font variant="auxiliary" color="muted" text={s.registeredCustomerLabel} />
        </Stack>
      </Stack>
    </Box>
  )
}

function SaleDetailAccordionBox({
  sale,
  isAccordionOpen,
  onToggleAccordion,
}: {
  sale: Sale
  isAccordionOpen: boolean
  onToggleAccordion: () => void
}) {
  const s = UI_STRINGS.negotiations
  const saleItems = parseSaleItems(sale.items)
  const totalItemsCount = saleItems.reduce((acc: number, it: RawSaleItem) => acc + (it.quantity || it.qty || it.amount || 1), 0)

  return (
    <Box padding={2.5} bg="bg-brand-primary/10" radius="none" w="full" cursor="pointer" onClick={onToggleAccordion}>
      <Stack gap={2.5} w="full">
        <Stack direction="row" justify="between" align="center" w="full">
          <Stack gap={0}>
            <Font variant="auxiliary" color="muted" text={UI_STRINGS.pdv.cart.total} />
            <Font variant="auxiliary" color="muted" text={`Itens: ${totalItemsCount}`} />
          </Stack>
          <Stack direction="row" align="center" gap={2.5}>
            <Font variant="body-bold" color="primary" text={formatPrice(sale.total)} />
            <Icon icon={isAccordionOpen ? ChevronUp : ChevronDown} size={16} color="primary" />
          </Stack>
        </Stack>
        {isAccordionOpen && (
          <Box padding={1} w="full">
            <Stack gap={2.5} w="full">
              <Box border borderColor="border/30" w="full" />
              <Stack direction="row" justify="between" align="center" w="full">
                <Font variant="body-sm-medium" color="muted" text={s.saleLabel} />
                <Font variant="body-sm-medium" text={formatPrice(sale.total)} />
              </Stack>
              <Stack direction="row" justify="between" align="center" w="full">
                <Font variant="body-sm-medium" color="muted" text={`${sale.payment_method || UI_STRINGS.common.confirm}:`} />
                <Font variant="body-sm-medium" text={formatPrice(sale.total)} />
              </Stack>
              <Stack direction="row" justify="between" align="center" w="full">
                <Font variant="body-sm-medium" color="muted" text={s.totalPaidLabel} />
                <Font variant="body-sm-medium" text={formatPrice(sale.total)} />
              </Stack>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
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

function SaleDetailModal({
  selectedSale,
  onClose,
  productMap,
  isAccordionOpen,
  onToggleAccordion,
  onDuplicate,
  onDeleteRequest,
  onShareRequest,
  onPrintRequest,
}: {
  selectedSale: Sale | null
  onClose: () => void
  productMap: Map<string, Product>
  isAccordionOpen: boolean
  onToggleAccordion: () => void
  onDuplicate: () => void
  onDeleteRequest: () => void
  onShareRequest: () => void
  onPrintRequest: () => void
}) {
  const s = UI_STRINGS.negotiations
  if (!selectedSale) return null

  const parsedItems = parseSaleItems(selectedSale.items)

  return (
    <Modal
      isOpen={Boolean(selectedSale)} onClose={onClose}
      title={`Venda #${getSaleCode(selectedSale)}`}
      subtitle={s.detailSubtitle} icon={FileText} variant="default" showCancelButton
      successText="Duplicar pedido" onSuccess={onDuplicate}
    >
      <Stack gap={5} w="full">
        <SaleDetailCustomerBox customerName={selectedSale.customer_name} />
        <SaleDetailAccordionBox sale={selectedSale} isAccordionOpen={isAccordionOpen} onToggleAccordion={onToggleAccordion} />
        <Stack gap={2.5} w="full">
          <Font variant="body-bold" color="primary" text={s.productsInOrderTitle} />
          <Box maxH="240px" overflow="auto" w="full">
            <Stack gap={2.5} w="full">
              {parsedItems.length === 0 ? (
                <EmptyState icon={Package} title={s.noItemsDetailedTitle} subtitle={s.noItemsDetailedSubtitle} />
              ) : (
                parsedItems.map((item: RawSaleItem, idx: number) => (
                  <SaleDetailItemRow key={`${item.product_id || item.id || idx}-${idx}`} item={item} productMap={productMap} />
                ))
              )}
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" justify="center" align="center" gap={5} w="full">
          <Button variant="danger-pill-icon" icon={Trash2} onClick={onDeleteRequest} title={s.deleteNegotiationTitle} />
          <Button variant="secondary-pill-icon" icon={Share2} onClick={onShareRequest} title={s.shareNegotiationTitle} />
          <Button variant="primary-pill-icon-print" onClick={onPrintRequest} title={s.printReceiptTitle} />
        </Stack>
      </Stack>
    </Modal>
  )
}

function NegotiationsModalsContainer({
  selectedSale,
  setSelectedSale,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  isShareModalOpen,
  setIsShareModalOpen,
  isLinkModalOpen,
  setIsLinkModalOpen,
  linkModalUrl,
  setLinkModalUrl,
  isExportModalOpen,
  setIsExportModalOpen,
  onGeneratePdf,
  onExportPdf,
  onExportCsv,
}: {
  selectedSale: Sale | null
  setSelectedSale: (s: Sale | null) => void
  isDeleteConfirmOpen: boolean
  setIsDeleteConfirmOpen: (v: boolean) => void
  isShareModalOpen: boolean
  setIsShareModalOpen: (v: boolean) => void
  isLinkModalOpen: boolean
  setIsLinkModalOpen: (v: boolean) => void
  linkModalUrl: string
  setLinkModalUrl: (u: string) => void
  isExportModalOpen: boolean
  setIsExportModalOpen: (v: boolean) => void
  onGeneratePdf: () => Promise<string | null>
  onExportPdf: () => void
  onExportCsv: () => void
}) {
  const s = UI_STRINGS.negotiations
  return (
    <>
      <Modal
        isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)}
        title={s.deleteNegotiationTitle} subtitle={s.confirmDeleteNegotiationSubtitle}
        icon={Trash2} successText={s.confirmDeleteButton}
        onSuccess={async () => {
          setIsDeleteConfirmOpen(false)
          if (selectedSale) { await dal.sales.delete(selectedSale.id); setSelectedSale(null) }
        }}
        showCancelButton
      >
        <Font variant="body-sm-medium" text={s.deleteNegotiationParagraph} />
      </Modal>

      {selectedSale && (
        <SaleShareModal
          isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)}
          pdfUrl={selectedSale.pdf_url || null} saleName={`Venda #${getSaleCode(selectedSale)}`}
          onGeneratePdf={onGeneratePdf}
          onOpenLinkModal={(url: string) => { setLinkModalUrl(url); setIsLinkModalOpen(true) }}
        />
      )}

      {selectedSale && (
        <SaleLinkModal
          isOpen={isLinkModalOpen} onClose={() => setIsLinkModalOpen(false)}
          pdfUrl={linkModalUrl || selectedSale.pdf_url || ""} saleName={`Venda #${getSaleCode(selectedSale)}`}
        />
      )}

      <SaleExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} onExportPdf={onExportPdf} onExportCsv={onExportCsv} />
    </>
  )
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

export const NegociacoesSection: React.FC<NegociacoesSectionProps> = ({
  title, setCustomBack, setCustomTitle, setCustomActions, onBack, initialClientFilter, onDuplicateToCart,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const dbSales = useSales(tenantId)
  const dbProducts = useProducts(tenantId)
  const dbCompany = useLiveQuery(async () => (tenantId ? await db.companies.get(tenantId) : null), [tenantId])
  const s = UI_STRINGS.negotiations

  const productMap = React.useMemo(() => {
    const map = new Map<string, Product>()
    if (dbProducts?.length) dbProducts.forEach((p: Product) => { if (p.id) map.set(p.id, p); if (p.name) map.set(p.name.toLowerCase().trim(), p) })
    return map
  }, [dbProducts])

  const initialPeriodDates = React.useMemo(() => getPeriodDates("Hoje"), [])
  const [period, setPeriod] = React.useState("Hoje")
  const [startDate, setStartDate] = React.useState(initialPeriodDates.start)
  const [endDate, setEndDate] = React.useState(initialPeriodDates.end)
  const [cliente, setCliente] = React.useState(initialClientFilter || "")
  const [usuario, setUsuario] = React.useState("")
  const [dispositivo, setDispositivo] = React.useState("")
  const [mesa, setMesa] = React.useState("")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)
  const [selectedSale, setSelectedSale] = React.useState<Sale | null>(null)
  const [isAccordionOpen, setIsAccordionOpen] = React.useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false)
  const [linkModalUrl, setLinkModalUrl] = React.useState("")
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false)

  const { generatePdf, printSale } = useSaleReceiptPdfManager(tenantId, dbCompany, productMap, setSelectedSale)

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod); const { start, end } = getPeriodDates(newPeriod); setStartDate(start); setEndDate(end)
  }

  const onBackRef = React.useRef(onBack)
  React.useEffect(() => { onBackRef.current = onBack }, [onBack])

  const onFilterDrawerRef = React.useRef(() => setIsFilterDrawerOpen(true))
  React.useEffect(() => { onFilterDrawerRef.current = () => setIsFilterDrawerOpen(true) })

  React.useEffect(() => {
    setCustomTitle?.(title || s.title)
    setCustomBack?.(() => () => onBackRef.current?.())
    setCustomActions?.(
      <Box display="block md:hidden">
        <Button variant="primary-pill-icon" icon={Filter} onClick={() => onFilterDrawerRef.current()} />
      </Box>
    )
    return () => { setCustomTitle?.(null); setCustomBack?.(null); setCustomActions?.(null) }
  }, [setCustomBack, setCustomTitle, setCustomActions, title, s.title])

  const filters = React.useMemo(() => ({ cliente, usuario, dispositivo, mesa, startDate, endDate }), [cliente, usuario, dispositivo, mesa, startDate, endDate])
  const filteredSales = useFilteredSales(dbSales, filters)
  const totalFilteredSales = React.useMemo(() => filteredSales.reduce((acc: number, sale: Sale) => acc + (sale.total || 0), 0), [filteredSales])

  return (
    <>
      <Stack direction="col" gap={5} w="full" flex="1" minH="0">
        <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0" h="full">
          <NegotiationsListView filteredSales={filteredSales} totalAmount={totalFilteredSales} onSelectSale={(sale: Sale) => { setSelectedSale(sale); setIsAccordionOpen(false) }} onOpenExport={() => setIsExportModalOpen(true)} />
          <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
            <FilterPanel title={UI_STRINGS.common.filter} selectedPeriod={period} onPeriodChange={handlePeriodChange} startDate={startDate} onStartDateChange={setStartDate} endDate={endDate} onEndDateChange={setEndDate} onFilter={() => {}}>
              <NegotiationFilterInputs cliente={cliente} setCliente={setCliente} usuario={usuario} setUsuario={setUsuario} dispositivo={dispositivo} setDispositivo={setDispositivo} mesa={mesa} setMesa={setMesa} />
            </FilterPanel>
          </Box>
          <Modal isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} title={UI_STRINGS.common.filter} variant="sidebar">
            <FilterPanel hideTitle borderless selectedPeriod={period} onPeriodChange={handlePeriodChange} startDate={startDate} onStartDateChange={setStartDate} endDate={endDate} onEndDateChange={setEndDate} onFilter={() => setIsFilterDrawerOpen(false)}>
              <NegotiationFilterInputs cliente={cliente} setCliente={setCliente} usuario={usuario} setUsuario={setUsuario} dispositivo={dispositivo} setDispositivo={setDispositivo} mesa={mesa} setMesa={setMesa} />
            </FilterPanel>
          </Modal>
          <SaleDetailModal selectedSale={selectedSale} onClose={() => setSelectedSale(null)} productMap={productMap} isAccordionOpen={isAccordionOpen} onToggleAccordion={() => setIsAccordionOpen((prev) => !prev)} onDuplicate={() => { if (selectedSale && onDuplicateToCart) { const items = buildDuplicatedCartItems(selectedSale, productMap); if (items.length > 0) { onDuplicateToCart(items); setSelectedSale(null) } } }} onDeleteRequest={() => setIsDeleteConfirmOpen(true)} onShareRequest={() => setIsShareModalOpen(true)} onPrintRequest={() => printSale(selectedSale)} />
        </Stack>
      </Stack>
      <NegotiationsModalsContainer selectedSale={selectedSale} setSelectedSale={setSelectedSale} isDeleteConfirmOpen={isDeleteConfirmOpen} setIsDeleteConfirmOpen={setIsDeleteConfirmOpen} isShareModalOpen={isShareModalOpen} setIsShareModalOpen={setIsShareModalOpen} isLinkModalOpen={isLinkModalOpen} setIsLinkModalOpen={setIsLinkModalOpen} linkModalUrl={linkModalUrl} setLinkModalUrl={setLinkModalUrl} isExportModalOpen={isExportModalOpen} setIsExportModalOpen={setIsExportModalOpen} onGeneratePdf={() => (selectedSale ? generatePdf(selectedSale) : Promise.resolve(null))} onExportPdf={() => exportSalesPdf({ filteredSales, totalAmount: totalFilteredSales, startDate, endDate, reportTitle: title || s.title, companyData: dbCompany })} onExportCsv={() => exportSalesCsv(filteredSales)} />
    </>
  )
}
