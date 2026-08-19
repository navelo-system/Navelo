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
    id: "b1",
    company_id: "demo-tenant",
    date: "01/06/26 14:49",
    groups: "Todos os grupos selecionados",
    status: "Finalizado",
    created_at: new Date(2026, 5, 1, 14, 49).toISOString(),
    items: [
      { productId: "1", productName: "COCA COLA 2L", category: "BEBIDAS - REFRIGERANTE", systemStock: 20, countedStock: 0, diff: -20 },
      { productId: "2", productName: "COCA COLA LATA 350ML", category: "BEBIDAS - REFRIGERANTE", systemStock: 15, countedStock: 0, diff: -15 },
    ],
  },
  {
    id: "b2",
    company_id: "demo-tenant",
    date: "21/07/26 10:30",
    groups: "Bebidas, Lanches",
    status: "Pendente",
    created_at: new Date(2026, 6, 21, 10, 30).toISOString(),
    items: [
      { productId: "1", productName: "COCA COLA 2L", category: "BEBIDAS - REFRIGERANTE", systemStock: 20, countedStock: 25, diff: 5 },
    ],
  },
]

function AuditHistoryList({
  filteredSessions,
  onOpenResumo,
  onOpenNovo,
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
              key={ses.id}
              padding={5}
              bg="bg-white"
              radius="default"
              border
              borderColor="border-border"
              hoverBg="surface-sunken"
              cursor="pointer"
              onClick={() => onOpenResumo(ses)}
              w="full"
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
  filteredSessions,
  selectedPeriod, setSelectedPeriod,
  startDate, setStartDate,
  endDate, setEndDate,
  statusFilters, toggleStatus,
  isFilterDrawerOpen, onCloseFilterDrawer,
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
  const statusOptions = [
    { id: "pendente", label: "Pendente" },
    { id: "finalizado", label: "Finalizado" },
  ]
  const selectedStatusIds = [
    ...(statusFilters.pendente ? ["pendente"] : []),
    ...(statusFilters.finalizado ? ["finalizado"] : []),
  ]

  return (
    <Stack direction="col" mobileDirection="row" gap={5} w="full" h="full" align="stretch" flex="1" minH="0">
      <AuditHistoryList filteredSessions={filteredSessions} onOpenResumo={onOpenResumo} onOpenNovo={onOpenNovo} />
      <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
        <FilterPanel
          selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod}
          startDate={startDate} onStartDateChange={setStartDate}
          endDate={endDate} onEndDateChange={setEndDate}
          statusOptions={statusOptions} selectedStatusIds={selectedStatusIds}
          onStatusToggle={(id) => toggleStatus(id as "pendente" | "finalizado")}
        />
      </Box>
      <Modal isOpen={isFilterDrawerOpen} onClose={onCloseFilterDrawer || (() => {})} title={common.filter} variant="sidebar">
        <FilterPanel
          hideTitle borderless
          selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod}
          startDate={startDate} onStartDateChange={setStartDate}
          endDate={endDate} onEndDateChange={setEndDate}
          statusOptions={statusOptions} selectedStatusIds={selectedStatusIds}
          onStatusToggle={(id) => toggleStatus(id as "pendente" | "finalizado")}
          onFilter={onCloseFilterDrawer}
        />
      </Modal>
    </Stack>
  )
}

function AuditNovoProductSelector({
  productSearch, setProductSearch,
  isDropdownOpen, setIsDropdownOpen,
  countQuantity, setCountQuantity,
  availableProducts, selectedProduct,
  onSelectProduct, onAddItem,
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
            variant="outlined-label"
            label={inv.productFieldLabel}
            placeholder={inv.searchProductPlaceholder}
            value={productSearch}
            onChange={(e) => {
              setProductSearch(e.target.value)
              setIsDropdownOpen(true)
            }}
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
            <Input
              variant="outlined-label"
              label={inv.quantityFieldLabel}
              type="number"
              value={countQuantity.toString()}
              onChange={(e) => setCountQuantity(parseInt(e.target.value) || 0)}
            />
          </Box>
          <Button variant="secondary-pill-icon" icon={Plus} title={inv.increaseQuantity} onClick={() => setCountQuantity((prev) => prev + 1)} />
        </Stack>

        <Button variant="primary" label={common.add} fullWidth disabled={!selectedProduct} onClick={onAddItem} />
      </Stack>
    </Box>
  )
}

function AuditNovoItemsList({
  addedItems,
  onRemoveItem,
  onFinish,
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

export function InventoryAuditTable({
  mode = "history",
  searchQuery = "",
  onModeChange,
  isFilterDrawerOpen = false,
  onCloseFilterDrawer,
}: InventoryAuditTableProps) {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "demo-tenant"
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

  const allAudits = dbInventoryAudits && dbInventoryAudits.length > 0 ? dbInventoryAudits : DEFAULT_SESSIONS

  const filteredSessions = allAudits.filter((s) => {
    if (!statusFilters.pendente && s.status === "Pendente") return false
    if (!statusFilters.finalizado && s.status === "Finalizado") return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!s.date.toLowerCase().includes(q) && !s.groups.toLowerCase().includes(q)) return false
    }
    return true
  })

  const handleFinishAudit = async () => {
    if (addedItems.length === 0) return
    const now = new Date()
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getFullYear()).slice(-2)} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

    const newAuditSession: InventoryAuditEntity = {
      id: crypto.randomUUID(), company_id: tenantId, tenant_id: tenantId,
      date: formattedDate, groups: UI_STRINGS.inventory.allGroupsSelected, status: "Finalizado",
      items: addedItems, created_at: now.toISOString(),
    }

    await Promise.all(
      addedItems.map(async (item) => {
        const dbProd = dbProducts?.find((p) => p.id === item.productId)
        if (dbProd) await dal.products.update({ ...dbProd, stock: item.countedStock })
      })
    )

    await dal.inventoryAudits.create(newAuditSession)
    setSelectedSession(newAuditSession)
    onModeChange?.("resumo")
  }

  const availableProducts = (dbProducts || []).filter(
    (p) => p.name.toLowerCase().includes(productSearch.toLowerCase()) || (p.barcode && p.barcode.includes(productSearch))
  )

  return (
    <Box position="relative" w="full" h="full" display="flex" direction="col" flex="1" minH="0">
      {mode === "history" && (
        <AuditHistoryView
          filteredSessions={filteredSessions} selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod}
          startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}
          statusFilters={statusFilters} toggleStatus={(k) => setStatusFilters((prev) => ({ ...prev, [k]: !prev[k] }))}
          isFilterDrawerOpen={isFilterDrawerOpen} onCloseFilterDrawer={onCloseFilterDrawer}
          onOpenResumo={(ses) => { setSelectedSession(ses); onModeChange?.("resumo") }}
          onOpenNovo={() => { setAddedItems([]); setProductSearch(""); setSelectedProduct(null); setCountQuantity(0); onModeChange?.("novo") }}
        />
      )}
      {mode === "novo" && (
        <AuditNovoView
          addedItems={addedItems} productSearch={productSearch} setProductSearch={setProductSearch}
          isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} selectedProduct={selectedProduct}
          countQuantity={countQuantity} setCountQuantity={setCountQuantity} availableProducts={availableProducts}
          onSelectProduct={(p) => {
            setSelectedProduct({ id: p.id, name: p.name, category: p.category || "Geral", stock: p.stock ?? 0 })
            setProductSearch(p.name); setCountQuantity(p.stock ?? 0); setIsDropdownOpen(false)
          }}
          onAddItem={() => {
            if (!selectedProduct) return
            const diff = countQuantity - selectedProduct.stock
            const newItem: InventoryAuditItem = {
              productId: selectedProduct.id, productName: selectedProduct.name, category: selectedProduct.category,
              systemStock: selectedProduct.stock, countedStock: countQuantity, diff,
            }
            setAddedItems((prev) => {
              const idx = prev.findIndex((i) => i.productId === selectedProduct.id)
              if (idx >= 0) {
                const copy = [...prev]
                copy[idx] = newItem
                return copy
              }
              return [...prev, newItem]
            })
            setSelectedProduct(null); setProductSearch(""); setCountQuantity(0)
          }}
          onRemoveItem={(id) => setAddedItems((prev) => prev.filter((i) => i.productId !== id))}
          onFinish={handleFinishAudit}
        />
      )}
      {mode === "resumo" && <AuditResumoView selectedSession={selectedSession} />}
    </Box>
  )
}
