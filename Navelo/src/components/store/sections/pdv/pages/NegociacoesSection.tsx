"use client"

/* eslint-disable max-lines-per-function, complexity, max-depth, react-hooks/set-state-in-effect, @typescript-eslint/no-explicit-any */

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
import { useSales, useProducts, Sale, dal } from "@/lib/dal"
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

interface NegociacoesSectionProps {
  title?: string
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack: () => void
  initialClientFilter?: string
  onDuplicateToCart?: (items: CartItemType[]) => void
}

function parseSaleItems(items: any): any[] {
  if (Array.isArray(items)) return items
  if (typeof items === "string") {
    try {
      const parsed = JSON.parse(items)
      if (Array.isArray(parsed)) return parsed
    } catch {
      return []
    }
  }
  return []
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

function parseBrDateTime(str: string, isEnd = false): Date | null {
  if (!str || !str.trim()) return null
  const clean = str.trim()
  const brMatch = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}))?$/)
  if (brMatch) {
    const day = parseInt(brMatch[1], 10)
    const month = parseInt(brMatch[2], 10) - 1
    const year = parseInt(brMatch[3], 10)
    const hour = brMatch[4] !== undefined ? parseInt(brMatch[4], 10) : (isEnd ? 23 : 0)
    const min = brMatch[5] !== undefined ? parseInt(brMatch[5], 10) : (isEnd ? 59 : 0)
    const sec = isEnd ? 59 : 0
    return new Date(year, month, day, hour, min, sec)
  }
  const isoDate = new Date(clean)
  if (!isNaN(isoDate.getTime())) {
    return isoDate
  }
  return null
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
  return {
    start: formatDateTimeBr(start),
    end: formatDateTimeBr(end),
  }
}

export const NegociacoesSection: React.FC<NegociacoesSectionProps> = ({
  title,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
  onBack,
  initialClientFilter,
  onDuplicateToCart,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbSales = useSales(tenantId)
  const dbProducts = useProducts(tenantId)
  const dbCompany = useLiveQuery(async () => {
    if (!tenantId) return null
    return await db.companies.get(tenantId)
  }, [tenantId])
  const s = UI_STRINGS.negotiations

  // Mapa de produtos para resolução automática de imagens reais e dados de produtos
  const productMap = React.useMemo(() => {
    const map = new Map<string, any>()
    if (dbProducts && dbProducts.length > 0) {
      dbProducts.forEach((p) => {
        if (p.id) map.set(p.id, p)
        if (p.name) map.set(p.name.toLowerCase().trim(), p)
      })
    }
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

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    const { start, end } = getPeriodDates(newPeriod)
    setStartDate(start)
    setEndDate(end)
  }

  const onBackRef = React.useRef(onBack)
  React.useEffect(() => {
    onBackRef.current = onBack
  }, [onBack])

  React.useEffect(() => {
    setCustomTitle?.(title || s.title)
    setCustomBack?.(() => () => onBackRef.current())

    setCustomActions?.(
      <Box display="block md:hidden">
        <Button
          variant="primary-pill-icon"
          icon={Filter}
          onClick={() => setIsFilterDrawerOpen(true)}
        />
      </Box>
    )

    return () => {
      setCustomTitle?.(null)
      setCustomBack?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, title, s.title])

  React.useEffect(() => {
    if (initialClientFilter !== undefined) {
      setCliente(initialClientFilter)
    }
  }, [initialClientFilter])

  const filteredSales = React.useMemo(() => {
    if (!dbSales || dbSales.length === 0) return []
    const clientTerm = cliente.trim().toLowerCase()
    const userTerm = usuario.trim().toLowerCase()
    const deviceTerm = dispositivo.trim().toLowerCase()
    const mesaTerm = mesa.trim().toLowerCase()
    const startDateObj = parseBrDateTime(startDate, false)
    const endDateObj = parseBrDateTime(endDate, true)

    return dbSales
      .filter((sale) => {
        // Filtro por Data Inicial e Final
        if (sale.created_at) {
          const saleTime = new Date(sale.created_at).getTime()
          if (startDateObj && saleTime < startDateObj.getTime()) return false
          if (endDateObj && saleTime > endDateObj.getTime()) return false
        }
        // Filtro por Cliente
        if (clientTerm) {
          if (!sale.customer_name) return false
          const lowerCust = sale.customer_name.toLowerCase().trim()
          if (lowerCust === "nao selecionado" || lowerCust === "venda avulsa") return false
          if (!lowerCust.includes(clientTerm)) return false
        }
        // Filtro por Usuário/Operador
        if (userTerm) {
          const uName = ((sale as any).user_name || (sale as any).operator || (sale as any).operator_id || "").toLowerCase()
          if (!uName.includes(userTerm)) return false
        }
        // Filtro por Dispositivo/Terminal
        if (deviceTerm) {
          const dName = ((sale as any).device || (sale as any).device_name || (sale as any).terminal || "").toLowerCase()
          if (!dName.includes(deviceTerm)) return false
        }
        // Filtro por Mesa/Comanda
        if (mesaTerm) {
          const tableStr = String((sale as any).table_number || (sale as any).comanda_label || (sale as any).mesa || "").toLowerCase()
          if (!tableStr.includes(mesaTerm)) return false
        }
        return true
      })
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
  }, [dbSales, cliente, usuario, dispositivo, mesa, startDate, endDate])

  const totalFilteredSales = React.useMemo(() => {
    return filteredSales.reduce((acc, sale) => acc + (sale.total || 0), 0)
  }, [filteredSales])

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Agora"
    try {
      const d = new Date(dateStr)
      return d.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    } catch {
      return dateStr
    }
  }

  const handleDeleteSale = async () => {
    if (selectedSale) {
      await dal.sales.delete(selectedSale.id)
      setSelectedSale(null)
    }
  }

  const handleDeleteAndClose = async () => {
    setIsDeleteConfirmOpen(false)
    await handleDeleteSale()
  }

  const getSaleCode = (sale: Sale) => {
    if ((sale as any).code) return String((sale as any).code).padStart(3, "0")
    if (sale.id) {
      const parts = sale.id.split("-")
      const last = parts[parts.length - 1]
      return last.slice(0, 4).toUpperCase()
    }
    return "001"
  }

  // Gera o PDF sob demanda para uma venda específica
  const handleGeneratePdfForSale = async (sale: Sale): Promise<string | null> => {
    try {
      const saleCode = getSaleCode(sale)
      const parsedItems = parseSaleItems(sale.items)
      const saleReceiptData = {
        id: sale.id,
        saleCode,
        total: sale.total,
        subtotal: sale.subtotal || sale.total,
        discount: sale.discount || 0,
        payment_method: sale.payment_method,
        customer_name: sale.customer_name,
        created_at: sale.created_at,
        items: parsedItems.map((item: any) => ({
          product_name: item.product_name || item.name || productMap.get(item.product_id || item.productId || item.id)?.name || "Item",
          quantity: item.quantity ?? item.qty ?? item.amount ?? 1,
          unit_price: item.unit_price ?? item.unitPrice ?? item.price ?? productMap.get(item.product_id || item.productId || item.id)?.price ?? 0,
          total_price: item.total_price ?? ((item.quantity ?? 1) * (item.unit_price ?? item.unitPrice ?? 0)),
        })),
      }

      const companyData = dbCompany || (tenantCtx?.currentTenant as any) || undefined
      const { base64, blob } = await generateSaleReceiptPdf(saleReceiptData, companyData)
      const cleanCode = sanitizeSaleFileName(saleCode)
      const cleanId = sanitizeSaleFileName(sale.id)
      const fileName = `Negociacao_${cleanCode}_${cleanId}.pdf`

      try {
        const response = await fetch("/api/upload-receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pdfBase64: base64,
            fileName,
            tenantId: tenantId || "default",
          }),
        })
        if (response.ok) {
          const { publicUrl } = await response.json()
          if (publicUrl) {
            await dal.sales.update({ ...sale, pdf_url: publicUrl })
            setSelectedSale((prev) => (prev && prev.id === sale.id ? { ...prev, pdf_url: publicUrl } : prev))
            return publicUrl
          }
        }
      } catch (uploadErr) {
        console.warn("[Negociacoes] Falha no upload do PDF:", uploadErr)
      }

      const localUrl = URL.createObjectURL(blob)
      return localUrl
    } catch (err) {
      console.error("[Negociacoes] Erro ao gerar PDF da venda:", err)
      return null
    }
  }

  const handlePrintSale = async () => {
    if (!selectedSale) return
    if (selectedSale.pdf_url) {
      window.open(selectedSale.pdf_url, "_blank", "noopener,noreferrer")
      return
    }
    const url = await handleGeneratePdfForSale(selectedSale)
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  const handleExportPdf = async () => {
    const reportTitle = title || s.title
    const salesData = {
      title: reportTitle,
      periodText: `${startDate} até ${endDate}`,
      statusText: "Ativa",
      typeText: "Qualquer",
      items: filteredSales.map((sale) => {
        const code = getSaleCode(sale)
        const date = formatDate(sale.created_at)
        const client = sale.customer_name && sale.customer_name !== "Nao selecionado" ? sale.customer_name : ""
        return {
          code,
          date,
          client,
          total: sale.total || 0,
        }
      }),
      totalAmount: totalFilteredSales,
    }

    const companyData = dbCompany || (tenantCtx?.currentTenant as any) || undefined
    const { blob } = await generateSalesReportPdf(salesData, companyData)
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Relatorio_${reportTitle.replace(/\s+/g, "_")}_${Date.now()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportCsv = () => {
    const headers = ["Venda", "Data", "Cliente", "Forma de Pagamento", "Total (R$)"]
    const rows = filteredSales.map((sale) => {
      const code = getSaleCode(sale)
      const date = formatDate(sale.created_at)
      const client = sale.customer_name && sale.customer_name !== "Nao selecionado" ? sale.customer_name : "-"
      const payment = sale.payment_method || "Dinheiro"
      const total = (sale.total || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      return [code, date, `"${client.replace(/"/g, '""')}"`, payment, total].join(";")
    })
    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `Vendas_${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDuplicate = () => {
    const saleItems = parseSaleItems(selectedSale?.items)
    if (!selectedSale || saleItems.length === 0) return

    const items: CartItemType[] = saleItems
      .map((item: any) => {
        const itemProductId: string = item.product_id || item.productId || item.id || ""
        const rawName: string = item.product_name || item.name || item.title || item.productName || item.description || ""
        const finalName: string = rawName || productMap.get(itemProductId)?.name || "Item"
        const finalUnitPrice: number = item.unit_price ?? item.unitPrice ?? item.price ?? productMap.get(itemProductId)?.price ?? 0
        const finalQty: number = item.quantity ?? item.qty ?? item.amount ?? 1
        const finalImage: string | undefined = item.image || item.image_url || item.imageUrl || productMap.get(itemProductId)?.image_url

        return {
          id: itemProductId,
          name: finalName,
          unitPrice: finalUnitPrice,
          quantity: finalQty,
          image: finalImage,
          category: item.category || productMap.get(itemProductId)?.category,
        } as CartItemType
      })
      .filter((i) => Boolean(i.name))

    if (items.length > 0 && onDuplicateToCart) {
      onDuplicateToCart(items)
      setSelectedSale(null)
    }
  }

  const renderFilterInputs = () => (
    <>
      <Input
        label={UI_STRINGS.reports.clientLabel}
        placeholder={UI_STRINGS.reports.clientLabel}
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />

      <Input
        label={UI_STRINGS.reports.userLabel}
        placeholder={UI_STRINGS.reports.userLabel}
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />

      <Input
        label={UI_STRINGS.reports.deviceLabel}
        placeholder={UI_STRINGS.reports.deviceLabel}
        value={dispositivo}
        onChange={(e) => setDispositivo(e.target.value)}
      />

      <Input
        label={s.tabFilterLabel}
        placeholder={s.tabFilterPlaceholder}
        value={mesa}
        onChange={(e) => setMesa(e.target.value)}
      />
    </>
  )

  return (
    <>
      <Stack direction="col" gap={5} w="full" flex="1" minH="0">
        <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0" h="full">
        {/* Lado Esquerdo: Lista Minimalista + Card Fixo de Total Filtrado */}
        <Stack direction="col" gap={2.5} flex="1" w="full" h="full" minH="0">
          {/* Lista de Registros */}
          <Box flex="1" w="full" h="full" bg="bg-surface" padding={5} radius="default" direction="col" justify="start" minH="0" overflow="hidden">
            {filteredSales.length === 0 ? (
              <Box w="full" h="full" direction="col" align="center" justify="center">
                <EmptyState
                  icon={FileText}
                  title={s.emptyTitle}
                  subtitle={s.emptySubtitle}
                />
              </Box>
            ) : (
              <Stack gap={0} w="full" overflow="auto" flex="1">
                {filteredSales.map((sale, idx) => {
                  const saleNum = (filteredSales.length - idx).toString().padStart(3, "0")
                  const saleCode = `Nº ${saleNum}.${filteredSales.length - idx}`

                  return (
                    <Box
                      key={sale.id}
                      w="full"
                      padding={2.5}
                      hoverBg="primary/10"
                      radius="default"
                      cursor="pointer"
                      border
                      borderColor="border/40"
                      onClick={() => {
                        setSelectedSale(sale)
                        setIsAccordionOpen(false)
                      }}
                    >
                      <Stack direction="row" justify="between" align="start" w="full">
                        {/* Lado Esquerdo da linha */}
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

                        {/* Lado Direito da linha */}
                        <Stack align="end" gap={0}>
                          <Font variant="body-bold" color="muted" text={formatPrice(sale.total)} />
                          <Font variant="auxiliary" color="muted" text={`Venda: ${formatPrice(sale.total)}`} />
                        </Stack>
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            )}
          </Box>

          {/* Card Fixo no Canto Inferior Esquerdo: Quantidade e Total das negociações filtradas com Botão Exportar integrado */}
          <Box w="full" bg="bg-surface" padding={5} radius="default">
            <Stack direction="row" justify="between" align="center" w="full">
              <Stack gap={1}>
                <Font variant="auxiliary" color="muted" text={s.salesQuantityLabel} />
                <Font variant="h3" text={String(filteredSales.length)} />
              </Stack>
              <Stack direction="row" align="center" gap={5}>
                <Stack align="end" gap={1}>
                  <Font variant="auxiliary" color="muted" text={s.totalAmountLabel} />
                  <Font variant="h3" color="primary" text={formatPrice(totalFilteredSales)} />
                </Stack>
                <Button
                  variant="primary-pill-icon"
                  icon={FileSpreadsheet}
                  title={s.exportSalesModalTitle}
                  onClick={() => setIsExportModalOpen(true)}
                />
              </Stack>
            </Stack>
          </Box>
        </Stack>

        {/* Painel Direito Desktop: FilterPanel Inline */}
        <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
          <FilterPanel
            title={UI_STRINGS.common.filter}
            selectedPeriod={period}
            onPeriodChange={handlePeriodChange}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onFilter={() => {}}
          >
            {renderFilterInputs()}
          </FilterPanel>
        </Box>

        {/* Painel Drawer Mobile: FilterPanel dentro de Modal Sidebar */}
        <Modal
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          title={UI_STRINGS.common.filter}
          variant="sidebar"
        >
          <FilterPanel
            hideTitle
            borderless
            selectedPeriod={period}
            onPeriodChange={handlePeriodChange}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onFilter={() => setIsFilterDrawerOpen(false)}
          >
            {renderFilterInputs()}
          </FilterPanel>
        </Modal>

        {/* Modal de Detalhes da Venda no Estilo Padrão do Design System com Sanfona Animada */}
        <Modal
          isOpen={!!selectedSale}
          onClose={() => setSelectedSale(null)}
          title={selectedSale ? `Negociação ${getSaleCode(selectedSale)}` : "Detalhes da Negociação"}
          subtitle={s.detailSubtitle}
          icon={FileText}
          variant="default"
          showCancelButton
          successText="Duplicar pedido"
          onSuccess={handleDuplicate}
        >
          {selectedSale && (
            <Stack gap={5} w="full">
              {/* Box do Cliente (reutilizando a estrutura de item da tela de clientes) */}
              {selectedSale.customer_name &&
                selectedSale.customer_name !== "Nao selecionado" &&
                selectedSale.customer_name !== "Venda Avulsa" && (
                  <Box padding={2.5} bg="bg-brand-primary/10" radius="none" w="full">
                    <Stack direction="row" align="center" justify="between" w="full">
                      <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                        <Avatar fallback={selectedSale.customer_name.substring(0, 2).toUpperCase()} />
                        <Stack gap={1} align="start" flex="1" minW="0">
                          <Font variant="body" text={selectedSale.customer_name} />
                          <Font variant="auxiliary" color="muted" text={s.registeredCustomerLabel} />
                        </Stack>
                      </Stack>
                    </Stack>
                  </Box>
                )}

              {/* Box do Total com Sanfona (Accordion animado com bg-brand-primary/10) */}
              <Box
                padding={2.5}
                bg="bg-brand-primary/10"
                radius="none"
                w="full"
                cursor="pointer"
                onClick={() => setIsAccordionOpen((prev) => !prev)}
              >
                <Stack gap={2.5} w="full">
                  <Stack direction="row" justify="between" align="center" w="full">
                    <Stack gap={0}>
                      <Font variant="auxiliary" color="muted" text={UI_STRINGS.pdv.cart.total} />
                      <Font
                        variant="auxiliary"
                        color="muted"
                        text={`Itens: ${parseSaleItems(selectedSale.items).reduce((acc: number, it: any) => acc + (it.quantity || it.qty || it.amount || 1), 0)}`}
                      />
                    </Stack>
                    <Stack direction="row" align="center" gap={2.5}>
                      <Font variant="body-bold" color="primary" text={formatPrice(selectedSale.total)} />
                      <Icon icon={isAccordionOpen ? ChevronUp : ChevronDown} size={16} color="primary" />
                    </Stack>
                  </Stack>

                  {/* Conteúdo Expandido da Sanfona de Pagamentos com Animação Fluida */}
                  <Box
                    display="block"
                    w="full"
                    maxH={isAccordionOpen ? "96" : "0"}
                    overflow="hidden"
                    transition="all"
                    opacity={isAccordionOpen ? "100" : "0"}
                  >
                    <Box padding={1} w="full">
                      <Stack gap={2.5} w="full">
                        <Box border borderColor="border/30" w="full" />

                        <Stack direction="row" justify="between" align="center" w="full">
                          <Font variant="body-sm-medium" color="muted" text={s.saleLabel} />
                          <Font variant="body-sm-medium" text={formatPrice(selectedSale.total)} />
                        </Stack>

                        <Stack direction="row" justify="between" align="center" w="full">
                          <Font variant="body-sm-medium" color="muted" text={`${selectedSale.payment_method || UI_STRINGS.common.confirm}:`} />
                          <Font variant="body-sm-medium" text={formatPrice(selectedSale.total)} />
                        </Stack>

                        <Stack direction="row" justify="between" align="center" w="full">
                          <Font variant="body-sm-medium" color="muted" text={s.totalPaidLabel} />
                          <Font variant="body-sm-medium" text={formatPrice(selectedSale.total)} />
                        </Stack>
                      </Stack>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              {/* Lista de Produtos do Pedido (reutilizando a estrutura idêntica da tela de produtos) */}
              <Stack gap={2.5} w="full">
                <Font variant="body-bold" color="primary" text={s.productsInOrderTitle} />

                <Box maxH="240px" overflow="auto" w="full">
                  <Stack gap={2.5} w="full">
                    {(() => {
                      const saleItems = parseSaleItems(selectedSale.items)
                      if (saleItems.length === 0) {
                        return (
                          <EmptyState
                            icon={Package}
                            title={s.noItemsDetailedTitle}
                            subtitle={s.noItemsDetailedSubtitle}
                          />
                        )
                      }
                      return saleItems.map((item: any, idx: number) => {
                        const itemProductId = item.product_id || item.productId || item.id || item.product?.id
                        const rawName = item.product_name || item.name || item.title || item.productName || item.description || item.product?.name || item.product?.product_name || ""
                        const itemProductName = rawName.toLowerCase().trim()

                        const matchedProd = (itemProductId ? productMap.get(itemProductId) : null) || (itemProductName ? productMap.get(itemProductName) : null)

                        const finalName = rawName || matchedProd?.name || "Item"
                        const finalUnitPrice = item.unit_price ?? item.unitPrice ?? item.price ?? item.unit_val ?? matchedProd?.price ?? matchedProd?.unit_price ?? 0
                        const finalQty = item.quantity ?? item.qty ?? item.amount ?? item.count ?? 1
                        const finalTotalPrice = item.total_price ?? item.totalPrice ?? item.total ?? (finalUnitPrice * finalQty)
                        const finalImage = item.image || item.image_url || item.imageUrl || matchedProd?.image_url || (matchedProd as any)?.image
                        const finalUnit = item.unit || item.unidade || matchedProd?.unit || "UN"

                        return (
                          <Box
                            key={idx}
                            padding={2.5}
                            bg="bg-brand-primary/10"
                            hoverBg="primary/10"
                            radius="none"
                            w="full"
                            cursor="pointer"
                          >
                            <Stack direction="row" align="center" justify="between" w="full">
                              {/* Lado Esquerdo: Thumbnail (estilo ProdutosSection) + Nome e Detalhes */}
                              <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
                                <Box
                                  w="w-10"
                                  h="h-10"
                                  bg="bg-surface-sunken"
                                  borderColor="border-border"
                                  border={true}
                                  radius="default"
                                  shrink="0"
                                  overflow="hidden"
                                >
                                  {finalImage ? (
                                    <Box
                                      as="img"
                                      src={finalImage}
                                      alt={finalName}
                                      w="full"
                                      h="full"
                                      objectFit="cover"
                                    />
                                  ) : (
                                    <Stack w="full" h="full" align="center" justify="center">
                                      <Icon icon={Package} size={20} color="muted" />
                                    </Stack>
                                  )}
                                </Box>

                                <Stack gap={1} align="start" flex="1" minW="0">
                                  <Font variant="body" text={finalName} />
                                  <Font
                                    variant="auxiliary"
                                    color="muted"
                                    truncate={true}
                                    text={`${finalQty} ${finalUnit} x ${formatPrice(finalUnitPrice)}`}
                                  />
                                </Stack>
                              </Stack>

                              {/* Lado Direito: Valor Total do Item */}
                              <Box shrink="0">
                                <Stack gap={1} align="end">
                                  <Font variant="body" text={formatPrice(finalTotalPrice)} />
                                </Stack>
                              </Box>
                            </Stack>
                          </Box>
                        )
                      })
                    })()}
                  </Stack>
                </Box>
              </Stack>

              {/* 3 Botões de Ação no Rodapé (Lixeira, Seta de Compartilhamento, Impressora Primária) */}
              <Stack direction="row" justify="center" align="center" gap={5} w="full">
                <Button
                  variant="danger-pill-icon"
                  icon={Trash2}
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  title={s.deleteNegotiationTitle}
                />
                <Button
                  variant="secondary-pill-icon"
                  icon={Share2}
                  onClick={() => setIsShareModalOpen(true)}
                  title={s.shareNegotiationTitle}
                />
                <Button
                  variant="primary-pill-icon-print"
                  onClick={handlePrintSale}
                  title={s.printReceiptTitle}
                />
              </Stack>
            </Stack>
          )}
        </Modal>
      </Stack>
    </Stack>

    {/* Modal de Confirmação de Exclusão — irmão do modal de detalhes para evitar stacking context aninhado */}
    <Modal
      isOpen={isDeleteConfirmOpen}
      onClose={() => setIsDeleteConfirmOpen(false)}
      title={s.deleteNegotiationTitle}
      subtitle={s.confirmDeleteNegotiationSubtitle}
      icon={Trash2}
      successText={s.confirmDeleteButton}
      onSuccess={handleDeleteAndClose}
      showCancelButton
    >
      <Font variant="body-sm-medium" text={s.deleteNegotiationParagraph} />
    </Modal>

    {/* Modal de Opções de Compartilhamento (Bottom Sheet) */}
    {selectedSale && (
      <SaleShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        pdfUrl={selectedSale.pdf_url || null}
        saleName={`Negociação ${getSaleCode(selectedSale)}`}
        onGeneratePdf={() => handleGeneratePdfForSale(selectedSale)}
        onOpenLinkModal={(url) => {
          setLinkModalUrl(url)
          setIsLinkModalOpen(true)
        }}
      />
    )}

    {/* Modal de Link (QR Code + Copiar Link + WhatsApp) */}
    {selectedSale && (
      <SaleLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        pdfUrl={linkModalUrl || selectedSale.pdf_url || ""}
        saleName={`Negociação ${getSaleCode(selectedSale)}`}
      />
    )}

    {/* Modal de Exportação de Vendas (PDF A4 e CSV) */}
    <SaleExportModal
      isOpen={isExportModalOpen}
      onClose={() => setIsExportModalOpen(false)}
      onExportPdf={handleExportPdf}
      onExportCsv={handleExportCsv}
    />
    </>
  )
}
