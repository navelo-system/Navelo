"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Button } from "@/components/store/base/Button"
import { InventoryAuditTable, BalancoProduct } from "@/components/store/advanced/InventoryAuditTable"
import { InvoicesTable } from "@/components/store/advanced/InvoicesTable"
import { ManualMovementForm } from "@/components/store/advanced/ManualMovementForm"
import { ChevronRight, ClipboardList, FileText, PlusCircle, Upload, Check, Filter } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { useProducts, dal, Product } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { UI_STRINGS } from "@/constants/strings"

interface EstoqueSectionProps {
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

type EstoqueView = "menu" | "balanco" | "notas" | "entrada_manual"
type BalancoSubMode = "history" | "resumo" | "novo"

function useEstoqueScrollPreserver(estoqueView: EstoqueView) {
  const scrollPositions = React.useRef<Record<string, number>>({})

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = () => { scrollPositions.current[estoqueView] = window.scrollY }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [estoqueView])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const savedScroll = scrollPositions.current[estoqueView] || 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { window.scrollTo({ top: savedScroll, behavior: "instant" }) })
    })
  }, [estoqueView])
}

function resolveEstoqueTitle(
  view: EstoqueView,
  subMode: BalancoSubMode,
  s: typeof UI_STRINGS.inventory
): string | null {
  if (view === "balanco") {
    if (subMode === "resumo") return s.balancoSummaryTitle
    if (subMode === "novo") return s.balancoCardTitle
    return "Balanços de estoque"
  }
  if (view === "notas") return UI_STRINGS.fiscal.title
  if (view === "entrada_manual") return s.adjustStockButton
  return null
}

interface ResolveCustomActionsParams {
  estoqueView: EstoqueView
  balancoSubMode: BalancoSubMode
  invoiceSearchQuery: string
  setInvoiceSearchQuery: (q: string) => void
  setIsFilterDrawerOpen: (v: boolean) => void
  s: typeof UI_STRINGS.inventory
}

function resolveEstoqueCustomActions(p: ResolveCustomActionsParams): React.ReactNode | null {
  if (p.estoqueView === "notas") {
    return (
      <MobileHeaderSearch searchQuery={p.invoiceSearchQuery} onSearchQueryChange={p.setInvoiceSearchQuery} placeholder={p.s.searchInvoicesPlaceholder}>
        <Button variant="primary-pill-icon" icon={Filter} onClick={() => {}} />
      </MobileHeaderSearch>
    )
  }
  if (p.estoqueView === "balanco" && p.balancoSubMode === "history") {
    return (
      <Box display="block md:hidden">
        <Button variant="primary-pill-icon" icon={Filter} onClick={() => p.setIsFilterDrawerOpen(true)} />
      </Box>
    )
  }
  return null
}

interface EstoqueHeaderSyncParams {
  estoqueView: EstoqueView
  balancoSubMode: BalancoSubMode
  invoiceSearchQuery: string
  setInvoiceSearchQuery: (q: string) => void
  setSuccessMsg: (m: string) => void
  setBalancoSubMode: (m: BalancoSubMode) => void
  setEstoqueView: (v: EstoqueView) => void
  setIsFilterDrawerOpen: (v: boolean) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function useEstoqueHeaderSync(p: EstoqueHeaderSyncParams) {
  const {
    estoqueView, balancoSubMode, invoiceSearchQuery, setInvoiceSearchQuery,
    setSuccessMsg, setBalancoSubMode, setEstoqueView, setIsFilterDrawerOpen,
    setCustomBack, setCustomTitle, setCustomActions,
  } = p

  const s = UI_STRINGS.inventory

  React.useEffect(() => {
    if (estoqueView !== "menu") {
      setCustomBack?.(() => () => {
        setSuccessMsg("")
        if (estoqueView === "balanco" && balancoSubMode !== "history") setBalancoSubMode("history")
        else setEstoqueView("menu")
      })
    } else {
      setCustomBack?.(null)
    }

    setCustomTitle?.(resolveEstoqueTitle(estoqueView, balancoSubMode, s))
    setCustomActions?.(resolveEstoqueCustomActions({ estoqueView, balancoSubMode, invoiceSearchQuery, setInvoiceSearchQuery, setIsFilterDrawerOpen, s }))

    return () => { setCustomBack?.(null); setCustomTitle?.(null); setCustomActions?.(null) }
  }, [estoqueView, balancoSubMode, invoiceSearchQuery, setCustomBack, setCustomTitle, setCustomActions, s, setInvoiceSearchQuery, setSuccessMsg, setBalancoSubMode, setEstoqueView, setIsFilterDrawerOpen])
}

function EstoqueMenuItem({
  icon, title, desc, onClick,
}: {
  icon: typeof ClipboardList
  title: string
  desc: string
  onClick: () => void
}) {
  return (
    <Box onClick={onClick} padding={5} bg="bg-surface" radius="default" border borderColor="border-border" w="full" hoverBg="primary/10" cursor="pointer">
      <Stack direction="row" align="center" justify="between" w="full" gap={5}>
        <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" gap={5} flex="1">
          <Icon icon={icon} variant="circular-secondary" />
          <Stack gap={1} align="start" w="full">
            <Font variant="body-bold" text={title} align="left" />
            <Font variant="auxiliary" color="muted" text={desc} align="left" />
          </Stack>
        </Stack>
        <Icon icon={ChevronRight} size={20} color="muted" />
      </Stack>
    </Box>
  )
}

function EstoqueMenuGrid({
  onSelectView,
}: {
  onSelectView: (v: EstoqueView) => void
}) {
  const s = UI_STRINGS.inventory
  return (
    <Stack gap={2.5} w="full">
      <EstoqueMenuItem icon={ClipboardList} title={s.balancoCardTitle} desc={s.balancoCardDesc} onClick={() => onSelectView("balanco")} />
      <EstoqueMenuItem icon={FileText} title={s.invoicesCardTitle} desc={s.invoicesCardDesc} onClick={() => onSelectView("notas")} />
      <EstoqueMenuItem icon={PlusCircle} title={s.manualMovementCardTitle} desc={s.manualMovementCardDesc} onClick={() => onSelectView("entrada_manual")} />
    </Stack>
  )
}

function EstoqueInvoicesView({
  invoices, onUploadXml,
}: {
  invoices: { id: string; number: string; supplier: string; value: number; key: string; status: string }[]
  onUploadXml: () => void
}) {
  return (
    <Box padding={5} bg="bg-surface" radius="default" border borderColor="border-border">
      <InvoicesTable invoices={invoices} />
      <Box position="fixed" bottom="24px" right="24px" zIndex="30">
        <Button variant="secondary-pill-icon" icon={Upload} onClick={onUploadXml} />
      </Box>
    </Box>
  )
}

function mapProductToBalanco(p: Product): BalancoProduct {
  return { id: p.id, name: p.name.toUpperCase(), category: p.category_id || "Geral", systemStock: p.stock ?? 0, counted: "" }
}

export const EstoqueSection: React.FC<EstoqueSectionProps> = ({
  setCustomBack, setCustomTitle, setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbProducts = useProducts(tenantId)

  const [estoqueView, setEstoqueView] = React.useState<EstoqueView>("menu")
  const [balancoSubMode, setBalancoSubMode] = React.useState<BalancoSubMode>("history")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)
  const [successMsg, setSuccessMsg] = React.useState("")
  const [invoiceSearchQuery, setInvoiceSearchQuery] = React.useState("")

  useEstoqueScrollPreserver(estoqueView)

  const balancoProducts: BalancoProduct[] = React.useMemo(() => {
    return (dbProducts || []).map(mapProductToBalanco)
  }, [dbProducts])

  const [invoices] = React.useState([
    { id: "1", number: "000.124.982", supplier: "Distribuidora de Bebidas Aliança Ltda", value: 1250.00, key: "3526 0712 3456 7800 0190 5500 1000 0123 4510 0234 5678", status: "Importada" },
    { id: "2", number: "000.125.102", supplier: "Hortifruti Central de Alimentos", value: 480.90, key: "3526 0798 7654 3200 0180 5500 1000 0123 4510 0234 1122", status: "Processando" },
  ])

  useEstoqueHeaderSync({
    estoqueView, balancoSubMode, invoiceSearchQuery, setInvoiceSearchQuery,
    setSuccessMsg, setBalancoSubMode, setEstoqueView, setIsFilterDrawerOpen,
    setCustomBack, setCustomTitle, setCustomActions,
  })

  const handleSaveManualMovement = async (data: { productId: string; type: string; qty: string; reason: string }) => {
    const existing = dbProducts?.find((p) => p.id === data.productId)
    if (existing) {
      const delta = parseFloat(data.qty) || 0
      const current = existing.stock ?? 0
      const nextStock = data.type === "Entrada" ? current + delta : current - delta
      await dal.products.update({ ...existing, stock: nextStock })
    }
    setSuccessMsg(`Movimentação manual registrada: ${data.type} de ${data.qty} unidades para o produto selecionado.`)
    setEstoqueView("menu")
  }

  const filteredInvoices = invoices.filter((inv) =>
    inv.number.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
    inv.supplier.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
  )

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <Stack gap={5} w="full" flex="1" minH="0" h="full">
        {successMsg && (
          <Box padding={2.5} bg="bg-brand-success/10" radius="default" w="full">
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={Check} size={16} color="success" />
              <Font variant="body-xs-semibold" color="success" text={successMsg} />
            </Stack>
          </Box>
        )}
        {estoqueView === "menu" && <EstoqueMenuGrid onSelectView={(v) => { setSuccessMsg(""); setEstoqueView(v) }} />}
        {estoqueView === "balanco" && (
          <InventoryAuditTable
            mode={balancoSubMode} searchQuery="" onCancel={() => setEstoqueView("menu")}
            onModeChange={(mode) => setBalancoSubMode(mode)} isFilterDrawerOpen={isFilterDrawerOpen}
            onCloseFilterDrawer={() => setIsFilterDrawerOpen(false)}
          />
        )}
        {estoqueView === "notas" && <EstoqueInvoicesView invoices={filteredInvoices} onUploadXml={() => setSuccessMsg("Upload de XML de nota fiscal realizado com sucesso (Simulado).")} />}
        {estoqueView === "entrada_manual" && (
          <Box padding={5} bg="bg-surface" radius="default" border borderColor="border-border">
            <ManualMovementForm products={balancoProducts} onCancel={() => setEstoqueView("menu")} onSubmit={handleSaveManualMovement} />
          </Box>
        )}
      </Stack>
    </Box>
  )
}
