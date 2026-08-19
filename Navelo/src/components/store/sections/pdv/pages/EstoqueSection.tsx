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
import {
  ChevronRight,
  ClipboardList,
  FileText,
  PlusCircle,
  Upload,
  Check,
  Filter
} from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { useProducts, dal } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { UI_STRINGS } from "@/constants/strings"

interface EstoqueSectionProps {
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

export const EstoqueSection: React.FC<EstoqueSectionProps> = ({
  setCustomBack,
  setCustomTitle,
  setCustomActions
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id

  const dbProducts = useProducts(tenantId)

  const [estoqueView, setEstoqueView] = React.useState<"menu" | "balanco" | "notas" | "entrada_manual">("menu")
  const [balancoSubMode, setBalancoSubMode] = React.useState<"history" | "resumo" | "novo">("history")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)
  const s = UI_STRINGS.inventory

  const scrollPositions = React.useRef<Record<string, number>>({})

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = () => {
      scrollPositions.current[estoqueView] = window.scrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [estoqueView])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const savedScroll = scrollPositions.current[estoqueView] || 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScroll, behavior: "instant" })
      })
    })
  }, [estoqueView])

  // Produtos para o Balanço a partir do IndexedDB
  const balancoProducts: BalancoProduct[] = React.useMemo(() => {
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        name: p.name.toUpperCase(),
        category: p.category_id || "Geral",
        systemStock: p.stock ?? 0,
        counted: ""
      }))
    }
    return []
  }, [dbProducts])

  // Mock de dados para as Notas Fiscais
  const [invoices] = React.useState([
    { id: "1", number: "000.124.982", supplier: "Distribuidora de Bebidas Aliança Ltda", value: 1250.00, key: "3526 0712 3456 7800 0190 5500 1000 0123 4510 0234 5678", status: "Importada" },
    { id: "2", number: "000.125.102", supplier: "Hortifruti Central de Alimentos", value: 480.90, key: "3526 0798 7654 3200 0180 5500 1000 0123 4510 0234 1122", status: "Processando" },
  ])

  const [successMsg, setSuccessMsg] = React.useState("")
  const [invoiceSearchQuery, setInvoiceSearchQuery] = React.useState("")

  React.useEffect(() => {
    if (estoqueView !== "menu") {
      setCustomBack?.(() => () => {
        setSuccessMsg("")
        if (estoqueView === "balanco" && balancoSubMode !== "history") {
          setBalancoSubMode("history")
        } else {
          setEstoqueView("menu")
        }
      })
    } else {
      setCustomBack?.(null)
    }

    if (estoqueView === "balanco") {
      if (balancoSubMode === "resumo") {
        setCustomTitle?.(s.balancoSummaryTitle)
      } else if (balancoSubMode === "novo") {
        setCustomTitle?.(s.balancoCardTitle)
      } else {
        setCustomTitle?.("Balanços de estoque")
      }
    } else if (estoqueView === "notas") {
      setCustomTitle?.(UI_STRINGS.fiscal.title)
    } else if (estoqueView === "entrada_manual") {
      setCustomTitle?.(s.adjustStockButton)
    } else {
      setCustomTitle?.(null)
    }

    if (estoqueView === "notas") {
      setCustomActions?.(
        <MobileHeaderSearch
          searchQuery={invoiceSearchQuery}
          onSearchQueryChange={setInvoiceSearchQuery}
          placeholder={s.searchInvoicesPlaceholder}
        >
          <Button
            variant="primary-pill-icon"
            icon={Filter}
            onClick={() => { }}
          />
        </MobileHeaderSearch>
      )
    } else if (estoqueView === "balanco" && balancoSubMode === "history") {
      setCustomActions?.(
        <Box display="block md:hidden">
          <Button
            variant="primary-pill-icon"
            icon={Filter}
            onClick={() => setIsFilterDrawerOpen(true)}
          />
        </Box>
      )
    } else {
      setCustomActions?.(null)
    }

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [estoqueView, balancoSubMode, invoiceSearchQuery, setCustomBack, setCustomTitle, setCustomActions, s.title, s.adjustStockButton, s.balancoSummaryTitle, s.balancoCardTitle, s.searchInvoicesPlaceholder])

  const handleUploadXml = () => {
    setSuccessMsg("Upload de XML de nota fiscal realizado com sucesso (Simulado).")
  }

  const handleSaveManualMovement = async (data: { productId: string; type: string; qty: string; reason: string }) => {
    const existing = dbProducts?.find((p) => p.id === data.productId)
    if (existing) {
      const delta = parseFloat(data.qty) || 0
      const current = existing.stock ?? 0
      const nextStock = data.type === "Entrada" ? current + delta : current - delta
      await dal.products.update({
        ...existing,
        stock: nextStock
      })
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

        {estoqueView === "menu" && (
          /* ================= MENU PRINCIPAL DO ESTOQUE ================= */
          <Stack gap={2.5} w="full">
            {/* Balanço de estoque */}
            <Box
              onClick={() => { setSuccessMsg(""); setEstoqueView("balanco") }}
              padding={5}
              bg="bg-surface"
              radius="default"
              border={true}
              borderColor="border-border"
              w="full"
              hoverBg="primary/10"
              cursor="pointer"
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" gap={5} flex="1">
                  <Icon icon={ClipboardList} variant="circular-secondary" />
                  <Stack gap={1} align="start" w="full">
                    <Font variant="body-bold" text={s.balancoCardTitle} align="left" />
                    <Font variant="auxiliary" color="muted" text={s.balancoCardDesc} align="left" />
                  </Stack>
                </Stack>
                <Icon icon={ChevronRight} size={20} color="muted" />
              </Stack>
            </Box>

            {/* Notas Fiscais */}
            <Box
              onClick={() => { setSuccessMsg(""); setEstoqueView("notas") }}
              padding={5}
              bg="bg-surface"
              radius="default"
              border={true}
              borderColor="border-border"
              w="full"
              hoverBg="primary/10"
              cursor="pointer"
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" gap={5} flex="1">
                  <Icon icon={FileText} variant="circular-secondary" />
                  <Stack gap={1} align="start" w="full">
                    <Font variant="body-bold" text={s.invoicesCardTitle} align="left" />
                    <Font variant="auxiliary" color="muted" text={s.invoicesCardDesc} align="left" />
                  </Stack>
                </Stack>
                <Icon icon={ChevronRight} size={20} color="muted" />
              </Stack>
            </Box>

            {/* Entrada Manual */}
            <Box
              onClick={() => { setSuccessMsg(""); setEstoqueView("entrada_manual") }}
              padding={5}
              bg="bg-surface"
              radius="default"
              border={true}
              borderColor="border-border"
              w="full"
              hoverBg="primary/10"
              cursor="pointer"
            >
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" gap={5} flex="1">
                  <Icon icon={PlusCircle} variant="circular-secondary" />
                  <Stack gap={1} align="start" w="full">
                    <Font variant="body-bold" text={s.manualMovementCardTitle} align="left" />
                    <Font variant="auxiliary" color="muted" text={s.manualMovementCardDesc} align="left" />
                  </Stack>
                </Stack>
                <Icon icon={ChevronRight} size={20} color="muted" />
              </Stack>
            </Box>
          </Stack>
        )}

        {estoqueView === "balanco" && (
          /* ================= SUB-SEÇÃO: BALANÇO DE ESTOQUE ================= */
          <InventoryAuditTable
            mode={balancoSubMode}
            searchQuery=""
            onCancel={() => setEstoqueView("menu")}
            onModeChange={(mode) => setBalancoSubMode(mode)}
            isFilterDrawerOpen={isFilterDrawerOpen}
            onCloseFilterDrawer={() => setIsFilterDrawerOpen(false)}
          />
        )}

        {estoqueView === "notas" && (
          /* ================= SUB-SEÇÃO: NOTAS FISCAIS ================= */
          <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
            <InvoicesTable invoices={filteredInvoices} />

            {/* Botão FAB fixo no canto inferior direito */}
            <Box position="fixed" bottom="24px" right="24px" zIndex="30">
              <Button
                variant="secondary-pill-icon"
                icon={Upload}
                onClick={handleUploadXml}
              />
            </Box>
          </Box>
        )}

        {estoqueView === "entrada_manual" && (
          /* ================= SUB-SEÇÃO: ENTRADA MANUAL ================= */
          <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
            <ManualMovementForm
              products={balancoProducts}
              onCancel={() => setEstoqueView("menu")}
              onSubmit={handleSaveManualMovement}
            />
          </Box>
        )}
      </Stack>
    </Box>
  )
}
