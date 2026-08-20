"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Badge } from "@/components/store/base/Badge"
import { Input } from "@/components/store/base/Input"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { Modal } from "@/components/store/base/Modal"
import { Plus, Minus, ClipboardList, Trash2 } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import { useTenant } from "@/lib/context/TenantContext"
import { useProducts, useInventoryAudits, dal } from "@/lib/dal/hooks"
import { InventoryAuditEntity, InventoryAuditItem, Product } from "@/lib/dal/db"

export interface BalancoProduct {
  id: string
  name: string
  category: string
  systemStock: number
  counted: string
  diff?: number
}

export interface InventoryAuditTableProps {
  mode?: "history" | "resumo" | "novo"
  products?: BalancoProduct[]
  searchQuery?: string
  onCancel?: () => void
  onSave?: (products: BalancoProduct[]) => void
  onModeChange?: (mode: "history" | "resumo" | "novo") => void
  isFilterDrawerOpen?: boolean
  onCloseFilterDrawer?: () => void
}

const DEFAULT_SESSIONS: InventoryAuditEntity[] = [
  {
    id: "b1", company_id: "demo-tenant", date: "01/06/26 14:49", groups: "Todos os grupos selecionados", status: "Finalizado",
    created_at: new Date(2026, 5, 1, 14, 49).toISOString(),
    items: [
      { productId: "1", productName: "COCA COLA 2L", category: "BEBIDAS - REFRIGERANTE", systemStock: 20, countedStock: 0, diff: -20 },
      { productId: "2", productName: "COCA COLA LATA 350ML", category: "BEBIDAS - REFRIGERANTE", systemStock: 15, countedStock: 0, diff: -15 },
    ],
  },
  {
    id: "b2", company_id: "demo-tenant", date: "21/07/26 10:30", groups: "Bebidas, Lanches", status: "Pendente",
    created_at: new Date(2026, 6, 21, 10, 30).toISOString(),
    items: [
      { productId: "1", productName: "COCA COLA 2L", category: "BEBIDAS - REFRIGERANTE", systemStock: 20, countedStock: 25, diff: 5 },
    ],
  },
]

function AuditHistoryList({
  filteredSessions, onOpenResumo, onOpenNovo,
}: {
  filteredSessions: InventoryAuditEntity[]
  onOpenResumo: (s: InventoryAuditEntity) => void
  onOpenNovo: () => void
}) {
  const inv = UI_STRINGS.inventory
  return (
    <Box flex="1" position="relative" h="full" overflow="x-hidden y-auto">
      <Stack gap={2.5} w="full">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((ses) => (
            <Box
              key={ses.id} padding={5} bg="bg-white" radius="default" border borderColor="border-border"
              hoverBg="surface-sunken" cursor="pointer" onClick={() => onOpenResumo(ses)} w="full"
            >
              <Stack direction="row" align="center" justify="between" w="full">
                <Stack gap={1} align="start">
                  <Font variant="body-bold" text={ses.date} />
                  <Font variant="auxiliary" color="muted" text={`${inv.groupsLabel}: ${ses.groups}`} />
                </Stack>
                <Badge variant={ses.status === "Finalizado" ? "success" : "primary"} rounded="full" label={ses.status} />
              </Stack>
            </Box>
          ))
        ) : (
          <EmptyState icon={ClipboardList} title={inv.emptyBalancoTitle} subtitle={inv.emptyBalancoSubtitle} />
        )}
      </Stack>
      <Box position="fixed" bottom={6} right={6} zIndex="50">
        <Button variant="secondary-pill-icon" icon={Plus} onClick={onOpenNovo} />
      </Box>
    </Box>
  )
}

function AuditHistoryView({
  filteredSessions, selectedPeriod, setSelectedPeriod, startDate, setStartDate,
  endDate, setEndDate, statusFilters, toggleStatus, isFilterDrawerOpen, onCloseFilterDrawer,
  onOpenResumo, onOpenNovo,
}: {
  filteredSessions: InventoryAuditEntity[]
  selectedPeriod: string; setSelectedPeriod: (v: string) => void
  startDate: string; setStartDate: (v: string) => void
  endDate: string; setEndDate: (v: string) => void
  statusFilters: { pendente: boolean; finalizado: boolean }
  toggleStatus: (k: "pendente" | "finalizado") => void
  isFilterDrawerOpen: boolean; onCloseFilterDrawer?: () => void
  onOpenResumo: (s: InventoryAuditEntity) => void; onOpenNovo: () => void
}) {
  const common = UI_STRINGS.common
  const statusOptions = [{ id: "pendente", label: "Pendente" }, { id: "finalizado", label: "Finalizado" }]
  const selectedStatusIds = [...(statusFilters.pendente ? ["pendente"] : []), ...(statusFilters.finalizado ? ["finalizado"] : [])]

  return (
    <Stack direction="col" mobileDirection="row" gap={5} w="full" h="full" align="stretch" flex="1" minH="0">
      <AuditHistoryList filteredSessions={filteredSessions} onOpenResumo={onOpenResumo} onOpenNovo={onOpenNovo} />
      <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
        <FilterPanel
          selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} startDate={startDate} onStartDateChange={setStartDate}
          endDate={endDate} onEndDateChange={setEndDate} statusOptions={statusOptions} selectedStatusIds={selectedStatusIds}
          onStatusToggle={(id) => toggleStatus(id as "pendente" | "finalizado")}
        />
      </Box>
      <Modal isOpen={isFilterDrawerOpen} onClose={onCloseFilterDrawer || (() => {})} title={common.filter} variant="sidebar">
        <FilterPanel
          hideTitle borderless selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod}
          startDate={startDate} onStartDateChange={setStartDate} endDate={endDate} onEndDateChange={setEndDate}
          statusOptions={statusOptions} selectedStatusIds={selectedStatusIds}
          onStatusToggle={(id) => toggleStatus(id as "pendente" | "finalizado")} onFilter={onCloseFilterDrawer}
        />
      </Modal>
    </Stack>
  )
}

function AuditNovoProductSelector({
  productSearch, setProductSearch, isDropdownOpen, setIsDropdownOpen,
  countQuantity, setCountQuantity, availableProducts, selectedProduct, onSelectProduct, onAddItem,
}: {
  productSearch: string; setProductSearch: (v: string) => void
  isDropdownOpen: boolean; setIsDropdownOpen: (v: boolean) => void
  countQuantity: number; setCountQuantity: React.Dispatch<React.SetStateAction<number>>
  availableProducts: Product[]
  selectedProduct: { id: string; name: string; category: string; stock: number } | null
  onSelectProduct: (p: Product) => void
  onAddItem: () => void
}) {
  const inv = UI_STRINGS.inventory
  const common = UI_STRINGS.common

  return (
    <Box flex="1" position="relative" h="full">
      <Stack gap={5} w="full">
        <Box position="relative" w="full">
          <Input
            variant="outlined-label" label={inv.productFieldLabel} placeholder={inv.searchProductPlaceholder}
            value={productSearch} onChange={(e) => { setProductSearch(e.target.value); setIsDropdownOpen(true) }}
            onFocus={() => setIsDropdownOpen(true)}
          />
          <Font variant="auxiliary" color="muted" text={inv.searchProductHelp} />

          {isDropdownOpen && availableProducts.length > 0 && (
            <Box position="absolute" top="full" left={0} right={0} bg="bg-white" border borderColor="border-border" radius="default" zIndex="50" overflow="auto" maxH="96">
              <Stack gap={0} w="full">
                {availableProducts.map((p) => (
                  <Box key={p.id} padding={2.5} hoverBg="surface-sunken" cursor="pointer" onClick={() => onSelectProduct(p)} borderBottom borderColor="border-border" w="full">
                    <Stack direction="row" justify="between" align="center" w="full">
                      <Stack gap={1} align="start">
                        <Font variant="body-bold" text={p.name} />
                        <Font variant="auxiliary" color="muted" text={p.category || "Geral"} />
                      </Stack>
                      <Font variant="auxiliary" color="muted" text={`Estoque: ${p.stock ?? 0}`} />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        <Stack direction="row" align="center" gap={2.5} w="full">
          <Button variant="secondary-pill-icon" icon={Minus} title={inv.decreaseQuantity} onClick={() => setCountQuantity((prev) => prev - 1)} />
          <Box flex="1">
            <Input variant="outlined-label" label={inv.quantityFieldLabel} type="number" value={countQuantity.toString()} onChange={(e) => setCountQuantity(parseInt(e.target.value) || 0)} />
          </Box>
          <Button variant="secondary-pill-icon" icon={Plus} title={inv.increaseQuantity} onClick={() => setCountQuantity((prev) => prev + 1)} />
        </Stack>

        <Button variant="primary" label={common.add} fullWidth disabled={!selectedProduct} onClick={onAddItem} />
      </Stack>
    </Box>
  )
}

function AuditNovoItemsList({
  addedItems, onRemoveItem, onFinish,
}: {
  addedItems: InventoryAuditItem[]
  onRemoveItem: (id: string) => void
  onFinish: () => void
}) {
  const inv = UI_STRINGS.inventory
  const common = UI_STRINGS.common

  return (
    <Box flex="1" position="relative" h="full" display="flex" direction="col" justify="between">
      <Stack gap={5} w="full">
        <Stack gap={1} align="start" w="full">
          <Stack direction="row" gap={2.5} align="center">
            <Font variant="body-bold" text={inv.groupsLabel} />
            <Button variant="ghost" label={inv.changeGroup} onClick={() => {}} />
          </Stack>
          <Font variant="auxiliary" color="muted" text={inv.allGroupsSelected} />
        </Stack>

        <Font variant="body-bold" text={inv.productsSectionTitle} />

        {addedItems.length === 0 ? (
          <EmptyState icon={ClipboardList} title={inv.noProductsAddedTitle} subtitle={inv.noProductsAddedSubtitle} />
        ) : (
          <Box w="full" maxH="96" overflow="x-hidden y-auto">
            <Stack gap={2.5} w="full">
              {addedItems.map((item) => {
                const isNeg = item.diff < 0
                const isPos = item.diff > 0
                return (
                  <Box key={item.productId} padding={2.5} bg="bg-white" radius="default" border borderColor="border-border" w="full">
                    <Stack direction="row" align="center" justify="between" w="full">
                      <Stack gap={1} align="start">
                        <Font variant="body-bold" text={item.productName.toUpperCase()} />
                        <Font variant="auxiliary" color="muted" text={`Estoque atual: ${item.systemStock} → Contagem: ${item.countedStock}`} />
                      </Stack>
                      <Stack direction="row" gap={2.5} align="center">
                        <Font variant="body-bold" color={isNeg ? "danger" : isPos ? "primary" : "muted"} text={`${isPos ? "+" : ""}${item.diff} UN`} />
                        <Button variant="danger-icon-xs" icon={Trash2} title={inv.removeItemTitle} onClick={() => onRemoveItem(item.productId)} />
                      </Stack>
                    </Stack>
                  </Box>
                )
              })}
            </Stack>
          </Box>
        )}
      </Stack>

      <Box padding={2.5} w="full">
        <Button variant="primary" label={common.continue} fullWidth disabled={addedItems.length === 0} onClick={onFinish} />
      </Box>
    </Box>
  )
}

function AuditNovoView({
  addedItems, productSearch, setProductSearch, isDropdownOpen, setIsDropdownOpen,
  selectedProduct, countQuantity, setCountQuantity, availableProducts,
  onSelectProduct, onAddItem, onRemoveItem, onFinish,
}: {
  addedItems: InventoryAuditItem[]
  productSearch: string; setProductSearch: (v: string) => void
  isDropdownOpen: boolean; setIsDropdownOpen: (v: boolean) => void
  selectedProduct: { id: string; name: string; category: string; stock: number } | null
  countQuantity: number; setCountQuantity: React.Dispatch<React.SetStateAction<number>>
  availableProducts: Product[]
  onSelectProduct: (p: Product) => void
  onAddItem: () => void; onRemoveItem: (id: string) => void; onFinish: () => void
}) {
  return (
    <Stack direction="col" mobileDirection="row" gap={5} w="full" h="full" align="stretch" flex="1" minH="0">
      <AuditNovoItemsList addedItems={addedItems} onRemoveItem={onRemoveItem} onFinish={onFinish} />
      <Box display="hidden md:block" w="w-[1px]" h="full" bg="bg-border" />
      <AuditNovoProductSelector
        productSearch={productSearch} setProductSearch={setProductSearch}
        isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}
        countQuantity={countQuantity} setCountQuantity={setCountQuantity}
        availableProducts={availableProducts} selectedProduct={selectedProduct}
        onSelectProduct={onSelectProduct} onAddItem={onAddItem}
      />
    </Stack>
  )
}

function AuditResumoView({ selectedSession }: { selectedSession: InventoryAuditEntity | null }) {
  const inv = UI_STRINGS.inventory
  return (
    <Stack gap={5} w="full" overflow="x-hidden y-auto" flex="1">
      <Stack direction="row" justify="between" align="center" w="full">
        <Font variant="body-bold" color="muted" text={UI_STRINGS.products.title} />
        <Font variant="body-bold" color="muted" text={inv.differenceHeader} />
      </Stack>

      <Box display="flex" direction="col" w="full" bg="bg-white" radius="default" border borderColor="border-border">
        {selectedSession?.items && selectedSession.items.length > 0 ? (
          selectedSession.items.map((item, idx) => {
            const isNeg = item.diff < 0
            const isPos = item.diff > 0
            return (
              <Box key={item.productId || idx}>
                <Box padding={2.5} w="full">
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack gap={1} align="start">
                      <Font variant="body-bold" text={item.productName.toUpperCase()} />
                      <Font variant="auxiliary" color="muted" text={item.category.toUpperCase()} />
                    </Stack>
                    <Stack gap={1} align="end">
                      <Font variant="body-bold" color={isNeg ? "danger" : isPos ? "primary" : "muted"} text={`${isPos ? "+" : ""}${item.diff} UN`} />
                      <Font variant="auxiliary" color="muted" text={`Estoque: ${item.systemStock} > ${item.countedStock} UN`} />
                    </Stack>
                  </Stack>
                </Box>
                {idx < (selectedSession?.items?.length ?? 0) - 1 && <Box h="h-[1px]" w="full" bg="bg-border" />}
              </Box>
            )
          })
        ) : (
          <EmptyState icon={ClipboardList} title={inv.noItemsInAuditTitle} subtitle={inv.noItemsInAuditSubtitle} />
        )}
      </Box>
    </Stack>
  )
}

function formatAuditDateTime(now: Date): string {
  const day = String(now.getDate()).padStart(2, "0")
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const yr = String(now.getFullYear()).slice(-2)
  const hr = String(now.getHours()).padStart(2, "0")
  const min = String(now.getMinutes()).padStart(2, "0")
  return `${day}/${month}/${yr} ${hr}:${min}`
}

function matchesSearchQuery(ses: InventoryAuditEntity, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return ses.date.toLowerCase().includes(q) || ses.groups.toLowerCase().includes(q)
}

function filterAuditSessions(
  allAudits: InventoryAuditEntity[],
  statusFilters: { pendente: boolean; finalizado: boolean },
  searchQuery: string
): InventoryAuditEntity[] {
  return allAudits.filter((ses) => {
    if (!statusFilters.pendente && ses.status === "Pendente") return false
    if (!statusFilters.finalizado && ses.status === "Finalizado") return false
    return matchesSearchQuery(ses, searchQuery)
  })
}

function filterAvailableProducts(products: Product[] | undefined, search: string): Product[] {
  if (!products) return []
  const q = search.toLowerCase()
  return products.filter((p) => p.name.toLowerCase().includes(q) || (p.barcode && p.barcode.includes(q)))
}

async function finishAuditAndSync(
  addedItems: InventoryAuditItem[],
  dbProducts: Product[] | undefined,
  tenantId: string
): Promise<InventoryAuditEntity> {
  const now = new Date()
  const newAuditSession: InventoryAuditEntity = {
    id: crypto.randomUUID(), company_id: tenantId, tenant_id: tenantId,
    date: formatAuditDateTime(now), groups: UI_STRINGS.inventory.allGroupsSelected, status: "Finalizado",
    items: addedItems, created_at: now.toISOString(),
  }
  await Promise.all(
    addedItems.map(async (item) => {
      const dbProd = dbProducts?.find((p) => p.id === item.productId)
      if (dbProd) await dal.products.update({ ...dbProd, stock: item.countedStock })
    })
  )
  await dal.inventoryAudits.create(newAuditSession)
  return newAuditSession
}

function useInventoryAuditState(tenantId: string) {
  const dbProducts = useProducts(tenantId)
  const dbInventoryAudits = useInventoryAudits(tenantId)

  const [selectedSession, setSelectedSession] = React.useState<InventoryAuditEntity | null>(null)
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>("3M")
  const [startDate, setStartDate] = React.useState("20/05/2026 00:00")
  const [endDate, setEndDate] = React.useState("18/08/2026 23:59")
  const [statusFilters, setStatusFilters] = React.useState({ pendente: true, finalizado: true })
  const [addedItems, setAddedItems] = React.useState<InventoryAuditItem[]>([])
  const [productSearch, setProductSearch] = React.useState("")
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<{ id: string; name: string; category: string; stock: number } | null>(null)
  const [countQuantity, setCountQuantity] = React.useState<number>(0)

  React.useEffect(() => {
    if (dbInventoryAudits && dbInventoryAudits.length === 0) {
      DEFAULT_SESSIONS.forEach((ses) => {
        dal.inventoryAudits.create({ ...ses, company_id: tenantId, tenant_id: tenantId }).catch(() => {})
      })
    }
  }, [dbInventoryAudits, tenantId])

  const handleAddItem = () => {
    if (!selectedProduct) return
    const diff = countQuantity - selectedProduct.stock
    const newItem: InventoryAuditItem = {
      productId: selectedProduct.id, productName: selectedProduct.name, category: selectedProduct.category,
      systemStock: selectedProduct.stock, countedStock: countQuantity, diff,
    }
    setAddedItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === selectedProduct?.id)
      if (idx >= 0) { const copy = [...prev]; copy[idx] = newItem; return copy }
      return [...prev, newItem]
    })
    setSelectedProduct(null); setProductSearch(""); setCountQuantity(0)
  }

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct({ id: p.id, name: p.name, category: p.category || "Geral", stock: p.stock ?? 0 })
    setProductSearch(p.name); setCountQuantity(p.stock ?? 0); setIsDropdownOpen(false)
  }

  const handleResetNovoForm = () => {
    setAddedItems([]); setProductSearch(""); setSelectedProduct(null); setCountQuantity(0)
  }

  return {
    dbProducts, dbInventoryAudits, selectedSession, setSelectedSession,
    selectedPeriod, setSelectedPeriod, startDate, setStartDate, endDate, setEndDate,
    statusFilters, setStatusFilters, addedItems, setAddedItems, productSearch, setProductSearch,
    isDropdownOpen, setIsDropdownOpen, selectedProduct, setSelectedProduct, countQuantity, setCountQuantity,
    handleAddItem, handleSelectProduct, handleResetNovoForm,
  }
}

interface AuditTableRouterProps {
  mode: string
  filteredSessions: InventoryAuditEntity[]
  s: ReturnType<typeof useInventoryAuditState>
  availableProducts: Product[]
  isFilterDrawerOpen: boolean
  onCloseFilterDrawer?: () => void
  onModeChange?: (mode: "history" | "resumo" | "novo") => void
  onFinishAudit: () => void
}

function AuditTableRouter(p: AuditTableRouterProps) {
  if (p.mode === "novo") {
    return (
      <AuditNovoView
        addedItems={p.s.addedItems} productSearch={p.s.productSearch} setProductSearch={p.s.setProductSearch}
        isDropdownOpen={p.s.isDropdownOpen} setIsDropdownOpen={p.s.setIsDropdownOpen} selectedProduct={p.s.selectedProduct}
        countQuantity={p.s.countQuantity} setCountQuantity={p.s.setCountQuantity} availableProducts={p.availableProducts}
        onSelectProduct={p.s.handleSelectProduct} onAddItem={p.s.handleAddItem}
        onRemoveItem={(id) => p.s.setAddedItems((prev) => prev.filter((i) => i.productId !== id))}
        onFinish={p.onFinishAudit}
      />
    )
  }
  if (p.mode === "resumo") {
    return <AuditResumoView selectedSession={p.s.selectedSession} />
  }
  return (
    <AuditHistoryView
      filteredSessions={p.filteredSessions} selectedPeriod={p.s.selectedPeriod} setSelectedPeriod={p.s.setSelectedPeriod}
      startDate={p.s.startDate} setStartDate={p.s.setStartDate} endDate={p.s.endDate} setEndDate={p.s.setEndDate}
      statusFilters={p.s.statusFilters} toggleStatus={(k) => p.s.setStatusFilters((prev) => ({ ...prev, [k]: !prev[k] }))}
      isFilterDrawerOpen={p.isFilterDrawerOpen} onCloseFilterDrawer={p.onCloseFilterDrawer}
      onOpenResumo={(ses) => { p.s.setSelectedSession(ses); p.onModeChange?.("resumo") }}
      onOpenNovo={() => { p.s.handleResetNovoForm(); p.onModeChange?.("novo") }}
    />
  )
}

export function InventoryAuditTable(props: InventoryAuditTableProps) {
  const mode = props.mode || "history"
  const searchQuery = props.searchQuery || ""
  const isFilterDrawerOpen = props.isFilterDrawerOpen || false
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "demo-tenant"
  const s = useInventoryAuditState(tenantId)

  const allAudits = s.dbInventoryAudits && s.dbInventoryAudits.length > 0 ? s.dbInventoryAudits : DEFAULT_SESSIONS
  const filteredSessions = React.useMemo(() => filterAuditSessions(allAudits, s.statusFilters, searchQuery), [allAudits, s.statusFilters, searchQuery])
  const availableProducts = React.useMemo(() => filterAvailableProducts(s.dbProducts, s.productSearch), [s.dbProducts, s.productSearch])

  const handleFinishAudit = async () => {
    if (s.addedItems.length === 0) return
    const session = await finishAuditAndSync(s.addedItems, s.dbProducts, tenantId)
    s.setSelectedSession(session)
    props.onModeChange?.("resumo")
  }

  return (
    <Box position="relative" w="full" h="full" display="flex" direction="col" flex="1" minH="0">
      <AuditTableRouter
        mode={mode} filteredSessions={filteredSessions} s={s} availableProducts={availableProducts}
        isFilterDrawerOpen={isFilterDrawerOpen} onCloseFilterDrawer={props.onCloseFilterDrawer}
        onModeChange={props.onModeChange} onFinishAudit={handleFinishAudit}
      />
    </Box>
  )
}
