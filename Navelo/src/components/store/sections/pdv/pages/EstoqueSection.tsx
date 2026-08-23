"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Button } from "@/components/store/base/Button"
import { InventoryAuditTable } from "@/components/store/advanced/InventoryAuditTable"
import { InvoicesTable } from "@/components/store/advanced/InvoicesTable"
import { ManualStockEntriesTable } from "@/components/store/advanced/ManualStockEntriesTable"
import { ChevronRight, ClipboardList, FileText, PlusCircle, Filter } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

interface EstoqueSectionProps {
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

type EstoqueView = "menu" | "balanco" | "notas" | "entrada_manual"
type BalancoSubMode = "history" | "resumo" | "novo" | "grupos" | "sem_contagem"

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
    if (subMode === "grupos") return s.groupsLabel
    if (subMode === "sem_contagem") return s.uncountedProductsTitle
    return "Balanços de estoque"
  }
  if (view === "notas") return s.invoicesTitle
  if (view === "entrada_manual") return s.adjustStockButton
  return null
}

interface ResolveCustomActionsParams {
  estoqueView: EstoqueView
  balancoSubMode: BalancoSubMode
  setIsFilterDrawerOpen: (v: boolean) => void
}

function resolveEstoqueCustomActions(p: ResolveCustomActionsParams): React.ReactNode | null {
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
  setBalancoSubMode: (m: BalancoSubMode) => void
  setEstoqueView: (v: EstoqueView) => void
  setIsFilterDrawerOpen: (v: boolean) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function useEstoqueHeaderSync(p: EstoqueHeaderSyncParams) {
  const {
    estoqueView, balancoSubMode,
    setBalancoSubMode, setEstoqueView, setIsFilterDrawerOpen,
    setCustomBack, setCustomTitle, setCustomActions,
  } = p

  const s = UI_STRINGS.inventory

  React.useEffect(() => {
    if (estoqueView === "balanco" || estoqueView === "notas" || estoqueView === "entrada_manual") {
      return
    }

    if (estoqueView !== "menu") {
      setCustomBack?.(() => () => {
        setEstoqueView("menu")
      })
    } else {
      setCustomBack?.(null)
    }

    setCustomTitle?.(resolveEstoqueTitle(estoqueView, balancoSubMode, s))
    setCustomActions?.(resolveEstoqueCustomActions({ estoqueView, balancoSubMode, setIsFilterDrawerOpen }))

    return () => { setCustomBack?.(null); setCustomTitle?.(null); setCustomActions?.(null) }
  }, [estoqueView, balancoSubMode, setCustomBack, setCustomTitle, setCustomActions, s, setBalancoSubMode, setEstoqueView, setIsFilterDrawerOpen])
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
    <Box onClick={onClick} padding={5} bg="bg-surface" radius="default" border borderColor="border-border" w="full" hoverBg="secondary/10" cursor="pointer">
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
      <EstoqueMenuItem icon={PlusCircle} title={s.manualEntriesTitle} desc={s.manualMovementCardDesc} onClick={() => onSelectView("entrada_manual")} />
    </Stack>
  )
}

export const EstoqueSection: React.FC<EstoqueSectionProps> = ({
  setCustomBack, setCustomTitle, setCustomActions,
}) => {
  const [estoqueView, setEstoqueView] = React.useState<EstoqueView>("menu")
  const [balancoSubMode, setBalancoSubMode] = React.useState<BalancoSubMode>("history")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)

  useEstoqueScrollPreserver(estoqueView)

  const [invoices] = React.useState([
    { id: "1", number: "000.124.982", supplier: "Distribuidora de Bebidas Aliança Ltda", value: 1250.00, key: "3526 0712 3456 7800 0190 5500 1000 0123 4510 0234 5678", status: "Importada" },
    { id: "2", number: "000.125.102", supplier: "Hortifruti Central de Alimentos", value: 480.90, key: "3526 0798 7654 3200 0180 5500 1000 0123 4510 0234 1122", status: "Processando" },
  ])

  useEstoqueHeaderSync({
    estoqueView, balancoSubMode,
    setBalancoSubMode, setEstoqueView, setIsFilterDrawerOpen,
    setCustomBack, setCustomTitle, setCustomActions,
  })

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <Stack gap={5} w="full" flex="1" minH="0" h="full">
        {estoqueView === "menu" && <EstoqueMenuGrid onSelectView={(v) => { setEstoqueView(v) }} />}
        {estoqueView === "balanco" && (
          <InventoryAuditTable
            mode={balancoSubMode} searchQuery="" onCancel={() => setEstoqueView("menu")}
            onModeChange={(mode) => setBalancoSubMode(mode)} isFilterDrawerOpen={isFilterDrawerOpen}
            onCloseFilterDrawer={() => setIsFilterDrawerOpen(false)}
            setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions}
          />
        )}
        {estoqueView === "notas" && (
          <InvoicesTable
            invoices={invoices}
            onCancel={() => setEstoqueView("menu")}
            onImportXml={() => {}}
            onImportSefaz={() => {}}
            setCustomBack={setCustomBack}
            setCustomTitle={setCustomTitle}
            setCustomActions={setCustomActions}
          />
        )}
        {estoqueView === "entrada_manual" && (
          <ManualStockEntriesTable
            onCancel={() => setEstoqueView("menu")}
            setCustomBack={setCustomBack}
            setCustomTitle={setCustomTitle}
            setCustomActions={setCustomActions}
          />
        )}
      </Stack>
    </Box>
  )
}
