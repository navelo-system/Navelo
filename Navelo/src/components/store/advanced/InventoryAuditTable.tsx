"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Badge } from "@/components/store/base/Badge"
import { Input } from "@/components/store/base/Input"
import { Icon } from "@/components/store/base/Icon"
import { Checkbox } from "@/components/store/base/Checkbox"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { Modal } from "@/components/store/base/Modal"
import { Warning } from "@/components/store/base/Warning"
import { Numpad } from "@/components/store/intermediary/Numpad"
import { Plus, Minus, ClipboardList, Trash2, Check, Package, Filter, AlertTriangle } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { UI_STRINGS } from "@/constants/strings"
import { useTenant } from "@/lib/context/TenantContext"
import { useProducts, useInventoryAudits, useCategories, dal } from "@/lib/dal/hooks"
import { InventoryAuditEntity, InventoryAuditItem, Product, Category } from "@/lib/dal/db"

export interface BalancoProduct {
  id: string
  name: string
  category: string
  systemStock: number
  counted: string
  diff?: number
}

export type AuditTableMode = "history" | "resumo" | "novo" | "grupos" | "sem_contagem"

export interface InventoryAuditTableProps {
  mode?: AuditTableMode
  products?: BalancoProduct[]
  searchQuery?: string
  onCancel?: () => void
  onSave?: (products: BalancoProduct[]) => void
  onModeChange?: (mode: AuditTableMode) => void
  isFilterDrawerOpen?: boolean
  onCloseFilterDrawer?: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

interface SaveAuditParams {
  addedItems: InventoryAuditItem[]
  dbProducts: Product[] | undefined
  tenantId: string
  status: "Pendente" | "Finalizado"
  groupsSummary?: string
  existingSessionId?: string
}

function AuditHistoryList({
  filteredSessions, onSelectSession, onOpenNovo,
}: {
  filteredSessions: InventoryAuditEntity[]
  onSelectSession: (s: InventoryAuditEntity) => void
  onOpenNovo: () => void
}) {
  const inv = UI_STRINGS.inventory
  return (
    <Box flex="1" position="relative" h="full" overflow="x-hidden y-auto">
      {filteredSessions.length > 0 ? (
        <Box display="flex" direction="col" w="full">
          {filteredSessions.map((ses, idx) => {
            const isPendente = ses.status === "Pendente"
            const badgeVariant = isPendente ? "warning" : "success"
            const statusLabel = isPendente ? inv.statusPendente : inv.statusFinalizado
            return (
              <Box key={ses.id}>
                <Box
                  padding={2.5} radius="none"
                  hoverBg="secondary/10" cursor="pointer" onClick={() => onSelectSession(ses)} w="full"
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack gap={0} align="start" flex="1" minW="0">
                      <Font variant="body-bold" text={ses.date} />
                      <Font variant="auxiliary" color="muted" text={`${inv.groupsLabel}: ${ses.groups}`} />
                    </Stack>
                    <Badge variant={badgeVariant} rounded="full" label={statusLabel} />
                  </Stack>
                </Box>
                {idx < filteredSessions.length - 1 && <Box borderBottom borderColor="border-border" w="full" />}
              </Box>
            )
          })}
        </Box>
      ) : (
        <EmptyState icon={ClipboardList} title={inv.emptyBalancoTitle} subtitle={inv.emptyBalancoSubtitle} />
      )}
      <Box position="fixed" bottom={6} right={6} zIndex="50">
        <Button variant="secondary-pill-icon" icon={Plus} onClick={onOpenNovo} />
      </Box>
    </Box>
  )
}

function AuditHistoryView({
  filteredSessions, selectedPeriod, onPeriodChange, startDate, setStartDate,
  endDate, setEndDate, statusFilters, toggleStatus, isFilterDrawerOpen, onCloseFilterDrawer,
  onSelectSession, onOpenNovo, onFilter,
}: {
  filteredSessions: InventoryAuditEntity[]
  selectedPeriod: string; onPeriodChange: (v: string) => void
  startDate: string; setStartDate: (v: string) => void
  endDate: string; setEndDate: (v: string) => void
  statusFilters: { pendente: boolean; finalizado: boolean }
  toggleStatus: (k: "pendente" | "finalizado") => void
  isFilterDrawerOpen: boolean; onCloseFilterDrawer?: () => void
  onSelectSession: (s: InventoryAuditEntity) => void; onOpenNovo: () => void
  onFilter: () => void
}) {
  const common = UI_STRINGS.common
  const inv = UI_STRINGS.inventory
  const statusOptions = [{ id: "pendente", label: inv.statusPendente }, { id: "finalizado", label: inv.statusFinalizado }]
  const selectedStatusIds = [...(statusFilters.pendente ? ["pendente"] : []), ...(statusFilters.finalizado ? ["finalizado"] : [])]

  return (
    <Stack direction="col" mobileDirection="row" gap={5} w="full" h="full" align="stretch" flex="1" minH="0">
      <AuditHistoryList filteredSessions={filteredSessions} onSelectSession={onSelectSession} onOpenNovo={onOpenNovo} />
      <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
        <FilterPanel
          selectedPeriod={selectedPeriod} onPeriodChange={onPeriodChange} startDate={startDate} onStartDateChange={setStartDate}
          endDate={endDate} onEndDateChange={setEndDate} statusOptions={statusOptions} selectedStatusIds={selectedStatusIds}
          onStatusToggle={(id) => toggleStatus(id as "pendente" | "finalizado")} onFilter={onFilter}
        />
      </Box>
      <Modal isOpen={isFilterDrawerOpen} onClose={onCloseFilterDrawer || (() => {})} title={common.filter} variant="sidebar">
        <FilterPanel
          hideTitle borderless selectedPeriod={selectedPeriod} onPeriodChange={onPeriodChange}
          startDate={startDate} onStartDateChange={setStartDate} endDate={endDate} onEndDateChange={setEndDate}
          statusOptions={statusOptions} selectedStatusIds={selectedStatusIds}
          onStatusToggle={(id) => toggleStatus(id as "pendente" | "finalizado")}
          onFilter={() => { onFilter(); onCloseFilterDrawer?.() }}
        />
      </Modal>
    </Stack>
  )
}

function AuditProductSearchDropdown({
  isOpen,
  filteredProducts,
  onSelect,
  noProductsLabel,
}: {
  isOpen: boolean
  filteredProducts: Product[]
  onSelect: (p: Product) => void
  noProductsLabel: string
}) {
  if (!isOpen) return null

  return (
    <Box
      position="absolute"
      top="100%"
      left={0}
      w="full"
      zIndex="50"
      bg="bg-surface"
      radius="default"
      border
      borderColor="border-border"
      shadow="default"
      maxH="60"
      overflow="x-hidden y-auto"
    >
      {filteredProducts.length > 0 ? (
        <Box display="flex" direction="col" w="full">
          {filteredProducts.map((p, idx) => (
            <Box key={p.id}>
              <Box
                padding={2.5}
                hoverBg="secondary/10"
                cursor="pointer"
                onClick={() => onSelect(p)}
                w="full"
              >
                <Stack direction="row" align="center" gap={2.5} w="full">
                  <Icon icon={Package} size={16} color="primary" />
                  <Font variant="body-sm-medium" text={`${p.name} (Estoque: ${p.stock ?? 0})`} />
                </Stack>
              </Box>
              {idx < filteredProducts.length - 1 && (
                <Box borderBottom borderColor="border-border" w="full" />
              )}
            </Box>
          ))}
        </Box>
      ) : (
        <Box padding={5} display="flex" align="center" justify="center" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Package} size={16} color="muted" />
            <Font variant="body-sm-medium" color="muted" text={noProductsLabel} />
          </Stack>
        </Box>
      )}
    </Box>
  )
}

function AuditQuantityAdjuster({
  countQuantity,
  setCountQuantity,
  label,
  decreaseTitle,
  increaseTitle,
}: {
  countQuantity: number
  setCountQuantity: React.Dispatch<React.SetStateAction<number>>
  label: string
  decreaseTitle: string
  increaseTitle: string
}) {
  return (
    <Stack direction="row" align="center" gap={2.5} w="full">
      <Button
        variant="secondary-pill-icon"
        icon={Minus}
        title={decreaseTitle}
        onClick={() => setCountQuantity((prev) => prev - 1)}
      />
      <Box flex="1">
        <Input
          variant="outlined-label-centered"
          label={label}
          type="number"
          value={countQuantity.toString()}
          onChange={(e) => setCountQuantity(parseInt(e.target.value, 10) || 0)}
        />
      </Box>
      <Button
        variant="secondary-pill-icon"
        icon={Plus}
        title={increaseTitle}
        onClick={() => setCountQuantity((prev) => prev + 1)}
      />
    </Stack>
  )
}

function AuditNovoProductSelector({
  countQuantity, setCountQuantity, availableProducts, selectedProduct, onSelectProduct, onAddItem,
  searchQuery, onSearchQueryChange,
}: {
  countQuantity: number; setCountQuantity: React.Dispatch<React.SetStateAction<number>>
  availableProducts: Product[]
  selectedProduct: { id: string; name: string; category: string; stock: number } | null
  onSelectProduct: (p: Product) => void
  onAddItem: () => void
  searchQuery: string
  onSearchQueryChange: (q: string) => void
}) {
  const inv = UI_STRINGS.inventory
  const common = UI_STRINGS.common
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery.trim()) return availableProducts
    const q = searchQuery.toLowerCase()
    return availableProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.barcode && p.barcode.toLowerCase().includes(q))
    )
  }, [availableProducts, searchQuery])

  const handleSelect = (p: Product) => {
    onSelectProduct(p)
    setIsOpen(false)
  }

  return (
    <Box ref={containerRef} position="relative" bg="bg-white" padding={5} radius="default" h="fit-content" w="full">
      <Stack gap={5} w="full">
        <Stack gap={1} w="full">
          <Font variant="body-sm-semibold" text={inv.productFieldLabel} />
          <Box position="relative" w="full">
            <Input
              variant="bordered"
              placeholder={inv.searchProductPlaceholder}
              value={searchQuery}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                onSearchQueryChange(e.target.value)
                setIsOpen(true)
              }}
            />

            <AuditProductSearchDropdown
              isOpen={isOpen}
              filteredProducts={filteredProducts}
              onSelect={handleSelect}
              noProductsLabel={inv.noProductsAvailable}
            />
          </Box>
          <Font variant="auxiliary" color="muted" text={inv.searchProductHelp} />
        </Stack>

        <AuditQuantityAdjuster
          countQuantity={countQuantity}
          setCountQuantity={setCountQuantity}
          label={inv.quantityFieldLabel}
          decreaseTitle={inv.decreaseQuantity}
          increaseTitle={inv.increaseQuantity}
        />

        <Button variant="primary" label={common.add} fullWidth disabled={!selectedProduct} onClick={onAddItem} />
      </Stack>
    </Box>
  )
}

function AuditNovoItemsList({
  addedItems, onRemoveItem, onContinue, onOpenGrupos, groupsSummary,
}: {
  addedItems: InventoryAuditItem[]
  onRemoveItem: (id: string) => void
  onContinue: () => void
  onOpenGrupos: () => void
  groupsSummary: string
}) {
  const inv = UI_STRINGS.inventory

  return (
    <Box flex="1" position="relative" display="flex" direction="col" justify="between" h="full" w="full">
      <Stack gap={5} w="full">
        <Stack gap={1} align="start" w="full">
          <Stack direction="row" gap={2.5} align="center">
            <Font variant="body-bold" text={inv.groupsLabel} />
            <Button variant="ghost" label={inv.changeGroup} onClick={onOpenGrupos} />
          </Stack>
          <Font variant="auxiliary" color="muted" text={groupsSummary} />
        </Stack>

        <Font variant="body-bold" text={inv.productsSectionTitle} />

        {addedItems.length === 0 ? (
          <EmptyState icon={ClipboardList} title={inv.noProductsAddedTitle} subtitle={inv.noProductsAddedSubtitle} />
        ) : (
          <Box w="full" maxH="96" overflow="x-hidden y-auto">
            <Box display="flex" direction="col" w="full">
              {addedItems.map((item, idx) => {
                const isNeg = item.diff < 0
                const isPos = item.diff > 0
                return (
                  <Box key={item.productId}>
                    <Box padding={2.5} w="full">
                      <Stack direction="row" align="center" justify="between" w="full">
                        <Stack gap={0} align="start" flex="1" minW="0">
                          <Font variant="body-sm-medium" text={item.productName.toUpperCase()} />
                          <Font variant="auxiliary" color="muted" text={`Estoque atual: ${item.systemStock} → Contagem: ${item.countedStock}`} />
                        </Stack>
                        <Stack direction="row" gap={2.5} align="center">
                          <Font variant="body-bold" color={isNeg ? "danger" : isPos ? "primary" : "muted"} text={`${isPos ? "+" : ""}${item.diff} UN`} />
                          <Button variant="danger-icon-xs" icon={Trash2} title={inv.removeItemTitle} onClick={() => onRemoveItem(item.productId)} />
                        </Stack>
                      </Stack>
                    </Box>
                    {idx < addedItems.length - 1 && <Box borderBottom borderColor="border-border" w="full" />}
                  </Box>
                )
              })}
            </Box>
          </Box>
        )}
      </Stack>

      <Button
        variant="primary"
        label={inv.continueButton}
        fullWidth
        onClick={onContinue}
      />
    </Box>
  )
}

function AuditNovoView({
  addedItems, selectedProduct, countQuantity, setCountQuantity, availableProducts,
  onSelectProduct, onAddItem, onRemoveItem, onContinue,
  onOpenGrupos, groupsSummary,
  searchQuery, onSearchQueryChange,
}: {
  addedItems: InventoryAuditItem[]
  selectedProduct: { id: string; name: string; category: string; stock: number } | null
  countQuantity: number; setCountQuantity: React.Dispatch<React.SetStateAction<number>>
  availableProducts: Product[]
  onSelectProduct: (p: Product) => void
  onAddItem: () => void; onRemoveItem: (id: string) => void
  onContinue: () => void
  onOpenGrupos: () => void; groupsSummary: string
  searchQuery: string
  onSearchQueryChange: (q: string) => void
}) {
  return (
    <Stack direction="col" mobileDirection="row" gap={5} w="full" h="full" align="stretch" flex="1" minH="0">
      <Box order="2" mdOrder="1" mdFlex="1" position="relative" display="flex" direction="col" w="full">
        <AuditNovoItemsList
          addedItems={addedItems}
          onRemoveItem={onRemoveItem}
          onContinue={onContinue}
          onOpenGrupos={onOpenGrupos}
          groupsSummary={groupsSummary}
        />
      </Box>
      <Box order="1" mdOrder="2" mdFlex="1" position="relative" w="full">
        <AuditNovoProductSelector
          countQuantity={countQuantity} setCountQuantity={setCountQuantity}
          availableProducts={availableProducts} selectedProduct={selectedProduct}
          onSelectProduct={onSelectProduct} onAddItem={onAddItem}
          searchQuery={searchQuery} onSearchQueryChange={onSearchQueryChange}
        />
      </Box>
    </Stack>
  )
}

export interface GroupOptionItem {
  id: string
  name: string
  subgroupsText: string
}

function mapCategoriesToGroupOptions(
  categories: Category[] | undefined,
  noSubgroupLabel: string,
  addedNames: Set<string>
): GroupOptionItem[] {
  if (!categories || categories.length === 0) return []
  const options: GroupOptionItem[] = []
  for (const c of categories) {
    addedNames.add(c.name.toUpperCase())
    const subsText = c.subgroups && c.subgroups.length > 0 ? c.subgroups.join(", ") : noSubgroupLabel
    options.push({ id: c.id, name: c.name.toUpperCase(), subgroupsText: subsText })
  }
  return options
}

function mapProductsToGroupOptions(
  products: Product[] | undefined,
  noSubgroupLabel: string,
  addedNames: Set<string>
): GroupOptionItem[] {
  if (!products || products.length === 0) return []
  const options: GroupOptionItem[] = []
  for (const p of products) {
    if (p.category && !addedNames.has(p.category.toUpperCase())) {
      addedNames.add(p.category.toUpperCase())
      options.push({ id: `cat-${p.category}`, name: p.category.toUpperCase(), subgroupsText: noSubgroupLabel })
    }
  }
  return options
}

export function buildGroupOptions(
  categories: Category[] | undefined,
  products: Product[] | undefined,
  noGroupLabel: string,
  noSubgroupLabel: string
): GroupOptionItem[] {
  const addedNames = new Set<string>()
  const catOpts = mapCategoriesToGroupOptions(categories, noSubgroupLabel, addedNames)
  const prodOpts = mapProductsToGroupOptions(products, noSubgroupLabel, addedNames)
  return [...catOpts, ...prodOpts, { id: "sem-grupo", name: noGroupLabel, subgroupsText: "" }]
}

export function formatSelectedGroupsSummary(
  selectedIds: string[],
  allOptions: GroupOptionItem[],
  inv: typeof UI_STRINGS.inventory
): string {
  if (selectedIds.length === 0) return "Nenhum grupo selecionado"
  if (selectedIds.length === allOptions.length) return inv.allGroupsSelected
  if (selectedIds.length === 1) {
    const found = allOptions.find((o) => o.id === selectedIds[0])
    return found ? found.name : `1 ${inv.groupsCountSelected}`
  }
  if (selectedIds.length === 2) {
    const o1 = allOptions.find((o) => o.id === selectedIds[0])
    const o2 = allOptions.find((o) => o.id === selectedIds[1])
    if (o1 && o2) return `${o1.name}, ${o2.name}`
  }
  return `${selectedIds.length} ${inv.groupsCountSelected}`
}

function AuditGroupsItemRow({
  item, isSelected, onToggle,
}: {
  item: GroupOptionItem
  isSelected: boolean
  onToggle: () => void
}) {
  return (
    <Box padding={2.5} radius="none" hoverBg="secondary/10" cursor="pointer" onClick={onToggle} w="full">
      <Stack direction="row" align="center" gap={2.5} w="full">
        <Checkbox checked={isSelected} onChange={onToggle} />
        <Stack gap={0} align="start" flex="1" minW="0">
          <Font variant="body-sm-medium" text={item.name} />
          {item.subgroupsText ? <Font variant="auxiliary" color="muted" text={item.subgroupsText} /> : null}
        </Stack>
      </Stack>
    </Box>
  )
}

function AuditGroupsSelectionView({
  allOptions, selectedGroupIds, onToggleGroup, onToggleSelectAll, searchQuery,
}: {
  allOptions: GroupOptionItem[]
  selectedGroupIds: string[]
  onToggleGroup: (id: string) => void
  onToggleSelectAll: () => void
  searchQuery: string
}) {
  const inv = UI_STRINGS.inventory
  const isAllSelected = allOptions.length > 0 && selectedGroupIds.length === allOptions.length

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return allOptions
    const q = searchQuery.toLowerCase()
    return allOptions.filter((opt) => opt.name.toLowerCase().includes(q) || opt.subgroupsText.toLowerCase().includes(q))
  }, [allOptions, searchQuery])

  return (
    <Box flex="1" position="relative" h="full" display="flex" direction="col" overflow="x-hidden y-auto">
      <Stack gap={2.5} w="full">
        <Box padding={2.5} w="full">
          <Font variant="description" color="muted" text={inv.groupsSelectionDescription} />
        </Box>

        <Box display="flex" direction="col" w="full">
          <Box padding={2.5} radius="none" hoverBg="secondary/10" cursor="pointer" onClick={onToggleSelectAll} w="full">
            <Stack direction="row" align="center" gap={2.5} w="full">
              <Checkbox checked={isAllSelected} onChange={onToggleSelectAll} />
              <Font variant="body-sm-medium" text={inv.selectAll} />
            </Stack>
          </Box>
          <Box borderBottom borderColor="border-border" w="full" />

          {filteredOptions.map((opt, idx) => {
            const isSelected = selectedGroupIds.includes(opt.id)
            return (
              <Box key={opt.id}>
                <AuditGroupsItemRow item={opt} isSelected={isSelected} onToggle={() => onToggleGroup(opt.id)} />
                {idx < filteredOptions.length - 1 && <Box borderBottom borderColor="border-border" w="full" />}
              </Box>
            )
          })}
        </Box>
      </Stack>
    </Box>
  )
}

function AuditResumoItemsList({ items }: { items?: InventoryAuditItem[] }) {
  const inv = UI_STRINGS.inventory
  if (!items || items.length === 0) {
    return <EmptyState icon={ClipboardList} title={inv.noItemsInAuditTitle} subtitle={inv.noItemsInAuditSubtitle} />
  }

  return (
    <Box display="flex" direction="col" w="full">
      {items.map((item, idx) => {
        const isNeg = item.diff < 0
        const isPos = item.diff > 0
        return (
          <Box key={item.productId || idx}>
            <Box padding={2.5} w="full">
              <Stack direction="row" align="center" justify="between" w="full">
                <Stack gap={0} align="start">
                  <Font variant="body-sm-medium" text={item.productName.toUpperCase()} />
                  <Font variant="auxiliary" color="muted" text={item.category.toUpperCase()} />
                </Stack>
                <Stack gap={0} align="end">
                  <Font variant="body-bold" color={isNeg ? "danger" : isPos ? "primary" : "muted"} text={`${isPos ? "+" : ""}${item.diff} UN`} />
                  <Font variant="auxiliary" color="muted" text={`Estoque: ${item.systemStock} > ${item.countedStock} UN`} />
                </Stack>
              </Stack>
            </Box>
            {idx < items.length - 1 && <Box borderBottom borderColor="border-border" w="full" />}
          </Box>
        )
      })}
    </Box>
  )
}

function AuditResumoActions({
  selectedSession,
  onApplyChanges,
  onDeleteSession,
}: {
  selectedSession: InventoryAuditEntity
  onApplyChanges?: (s: InventoryAuditEntity) => void
  onDeleteSession?: (s: InventoryAuditEntity) => void
}) {
  const inv = UI_STRINGS.inventory
  return (
    <Stack direction="row" gap={2.5} w="full" justify="end">
      {onDeleteSession && (
        <Button
          variant="outline"
          label={inv.deleteAuditButton}
          onClick={() => onDeleteSession(selectedSession)}
        />
      )}
      {onApplyChanges && (
        <Button
          variant="primary"
          label={inv.applyChangesButton}
          onClick={() => onApplyChanges(selectedSession)}
        />
      )}
    </Stack>
  )
}

function AuditResumoHeader({
  date, groups, isPendente, statusLabel,
}: {
  date: string
  groups: string
  isPendente: boolean
  statusLabel: string
}) {
  const inv = UI_STRINGS.inventory
  return (
    <Stack direction="row" justify="between" align="center" w="full">
      <Stack gap={0} align="start">
        <Font variant="body-bold" text={date} />
        <Font variant="auxiliary" color="muted" text={`${inv.groupsLabel}: ${groups}`} />
      </Stack>
      <Badge
        variant={isPendente ? "warning" : "success"}
        rounded="full"
        label={statusLabel}
      />
    </Stack>
  )
}

function getUncountedProducts(
  dbProducts: Product[] | undefined,
  effectiveSelectedGroupIds: string[],
  allGroupOptions: GroupOptionItem[],
  addedItems: InventoryAuditItem[]
): Product[] {
  if (!dbProducts || dbProducts.length === 0) return []
  const addedIds = new Set(addedItems.map((i) => i.productId))
  const selectedGroupNames = new Set(
    allGroupOptions
      .filter((o) => effectiveSelectedGroupIds.includes(o.id))
      .map((o) => o.name.toUpperCase())
  )

  return dbProducts.filter((p) => {
    if (addedIds.has(p.id)) return false
    const catUpper = (p.category || "SEM GRUPO").toUpperCase()
    return selectedGroupNames.has(catUpper)
  })
}

function AuditQuantityValueDisplay({
  label,
  displayVal,
  isDanger,
  onIncrement,
  onDecrement,
}: {
  label: string
  displayVal: string
  isDanger: boolean
  onIncrement: () => void
  onDecrement: () => void
}) {
  return (
    <Stack gap={1} align="center" w="full">
      <Font variant="auxiliary" color="muted" text={label} align="center" />
      <Stack direction="row" align="center" justify="between" w="full">
        <Button variant="ghost" icon={Minus} onClick={onDecrement} />
        <Font variant="h1" color={isDanger ? "danger" : "primary"} text={displayVal} align="center" />
        <Button variant="ghost" icon={Plus} onClick={onIncrement} />
      </Stack>
    </Stack>
  )
}

function calculateStepAdjustment(rawDigits: string, isNegative: boolean, delta: number) {
  const currentNum = parseInt(rawDigits, 10) || 0
  const signed = isNegative ? -currentNum : currentNum
  const next = signed + delta
  return {
    nextIsNegative: next < 0,
    nextRawDigits: Math.abs(next).toString(),
  }
}

function AuditQuantityKeypadModal({
  product, isOpen, onClose, onAddAdjustment,
}: {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddAdjustment: (productId: string, adjustment: number) => void
}) {
  const [rawDigits, setRawDigits] = React.useState("0")
  const [isNegative, setIsNegative] = React.useState(false)
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)
  const inv = UI_STRINGS.inventory

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setRawDigits("0")
      setIsNegative(false)
    }
  }

  if (!product) return null

  const handleStep = (delta: number) => {
    const { nextIsNegative, nextRawDigits } = calculateStepAdjustment(rawDigits, isNegative, delta)
    setIsNegative(nextIsNegative)
    setRawDigits(nextRawDigits)
  }

  const handleKeyPress = (k: string) => {
    if (k === "back") {
      setRawDigits((prev) => (prev.length <= 1 ? "0" : prev.slice(0, -1)))
      return
    }
    if (rawDigits.length >= 6) return
    setRawDigits((prev) => (prev === "0" ? (k === "00" ? "0" : k) : prev + k))
  }

  const handleClose = () => {
    setRawDigits("0")
    setIsNegative(false)
    onClose()
  }

  const handleConfirm = () => {
    const val = parseInt(rawDigits, 10) || 0
    const diff = isNegative ? -val : val
    onAddAdjustment(product.id, diff)
    handleClose()
  }

  const displayVal = `${isNegative && rawDigits !== "0" ? "-" : ""}${rawDigits}`

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={product.name.toUpperCase()}
      variant="default"
      showCancelButton={true}
      successText={inv.modalAddButton}
      onSuccess={handleConfirm}
    >
      <Stack gap={5} w="full">
        <Stack gap={0} align="start" w="full">
          <Font variant="auxiliary" color="muted" text={product.category || inv.noSubgroupLabel} />
          <Font variant="auxiliary" color="muted" text={`Estoque: ${product.stock ?? 0} ${product.unit || "UN"}`} />
        </Stack>

        <AuditQuantityValueDisplay
          label={inv.modalQuantityLabel}
          displayVal={displayVal}
          isDanger={isNegative && rawDigits !== "0"}
          onIncrement={() => handleStep(1)}
          onDecrement={() => handleStep(-1)}
        />

        <Numpad onKeyPress={handleKeyPress} variant="ghost" />
      </Stack>
    </Modal>
  )
}

function AuditProdutosSemContagemView({
  uncountedProducts, groupsSummary, onZeroAll, onAddAdjustment, onContinue,
}: {
  uncountedProducts: Product[]
  groupsSummary: string
  onZeroAll: () => void
  onAddAdjustment: (productId: string, adjustment: number) => void
  onContinue: () => void
}) {
  const [selectedProductForModal, setSelectedProductForModal] = React.useState<Product | null>(null)
  const inv = UI_STRINGS.inventory

  if (uncountedProducts.length === 0) {
    return (
      <Box flex="1" position="relative" h="full" display="flex" direction="col" justify="between" w="full">
        <Box flex="1" display="flex" align="center" justify="center" w="full">
          <Stack align="center" gap={2.5}>
            <Icon icon={Check} size={48} color="success" />
            <Font variant="description" text={inv.allProductsCountedSuccess} align="center" />
          </Stack>
        </Box>
        <Button variant="primary" label={inv.continueButton} fullWidth onClick={onContinue} />
      </Box>
    )
  }

  const warningText = (
    <Stack gap={1} w="full">
      <Font variant="description" color="danger" text={inv.uncountedProductsBannerLine1} />
      <Font variant="description" color="danger" text={inv.uncountedProductsBannerLine2} />
      <Font variant="auxiliary" color="danger" text={`${inv.uncountedProductsBannerGroups} ${groupsSummary}`} />
    </Stack>
  )

  return (
    <Box flex="1" position="relative" h="full" display="flex" direction="col" justify="between" w="full">
      <Stack gap={5} w="full">
        <Warning
          variant="danger"
          icon={AlertTriangle}
          title={inv.uncountedProductsTitle}
          text={warningText}
          textButton={inv.zeroAllButton}
          onClick={onZeroAll}
        />

        <Stack direction="row" justify="between" align="center" w="full">
          <Font variant="body-bold" color="muted" text={inv.productsSectionTitle} />
          <Font variant="body-bold" color="muted" text={inv.stockHeader} />
        </Stack>

        <Box w="full" maxH="96" overflow="x-hidden y-auto">
          <Box display="flex" direction="col" w="full">
            {uncountedProducts.map((p, idx) => (
              <Box key={p.id}>
                <Box
                  padding={2.5} hoverBg="secondary/10" cursor="pointer"
                  onClick={() => setSelectedProductForModal(p)} w="full"
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack gap={0} align="start" flex="1" minW="0">
                      <Font variant="body-sm-medium" text={p.name.toUpperCase()} />
                      <Font variant="auxiliary" color="muted" text={p.category || inv.noSubgroupLabel} />
                    </Stack>
                    <Font variant="body-sm-medium" color="muted" text={`${p.stock ?? 0} UN`} />
                  </Stack>
                </Box>
                {idx < uncountedProducts.length - 1 && <Box borderBottom borderColor="border-border" w="full" />}
              </Box>
            ))}
          </Box>
        </Box>
      </Stack>

      <Button variant="primary" label={inv.continueButton} fullWidth onClick={onContinue} />

      <AuditQuantityKeypadModal
        product={selectedProductForModal}
        isOpen={Boolean(selectedProductForModal)}
        onClose={() => setSelectedProductForModal(null)}
        onAddAdjustment={onAddAdjustment}
      />
    </Box>
  )
}

function AuditResumoFinalView({
  items, onSaveDraft, onFinalize,
}: {
  items: InventoryAuditItem[]
  onSaveDraft: () => void
  onFinalize: () => void
}) {
  const inv = UI_STRINGS.inventory

  return (
    <Box flex="1" position="relative" h="full" display="flex" direction="col" justify="between">
      <Stack gap={5} w="full">
        <Stack direction="row" justify="between" align="center" w="full">
          <Font variant="body-bold" color="muted" text={inv.productsSectionTitle} />
          <Font variant="body-bold" color="muted" text={inv.differenceHeader} />
        </Stack>

        <Box w="full" maxH="96" overflow="x-hidden y-auto">
          <Box display="flex" direction="col" w="full">
            {items.map((item, idx) => {
              const isNeg = item.diff < 0
              const isPos = item.diff > 0
              return (
                <Box key={item.productId || idx}>
                  <Box padding={2.5} w="full">
                    <Stack direction="row" align="center" justify="between" w="full">
                      <Stack gap={0} align="start" flex="1" minW="0">
                        <Font variant="body-sm-medium" text={item.productName.toUpperCase()} />
                        <Font variant="auxiliary" color="muted" text={item.category || inv.noSubgroupLabel} />
                        <Font variant="auxiliary" color="muted" text={`Estoque: ${item.systemStock} → ${item.countedStock} UN`} />
                      </Stack>
                      <Font
                        variant="body-bold"
                        color={isNeg ? "danger" : isPos ? "primary" : "muted"}
                        text={`${isPos ? "+" : ""}${item.diff} UN`}
                      />
                    </Stack>
                  </Box>
                  {idx < items.length - 1 && <Box borderBottom borderColor="border-border" w="full" />}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Stack>

      <Stack direction="row" gap={2.5} w="full">
        <Button variant="secondary" label={inv.saveButton} fullWidth onClick={onSaveDraft} />
        <Button variant="primary" label={inv.finalizeButton} fullWidth onClick={onFinalize} />
      </Stack>
    </Box>
  )
}

function AuditDiscardModal({
  isOpen, onClose, onDiscard, onSaveDraft,
}: {
  isOpen: boolean
  onClose: () => void
  onDiscard: () => void
  onSaveDraft: () => void
}) {
  const inv = UI_STRINGS.inventory

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={inv.discardAuditTitle}
      variant="bottom"
      customActions={
        <Stack direction="row" align="center" gap={5}>
          <Button type="button" variant="ghost" label={inv.discardButton} onClick={onDiscard} />
          <Box h="h-6" w="w-[1px]" bg="bg-border" opacity="50" />
          <Button type="button" variant="ghost" label={inv.cancelButton} onClick={onClose} />
          <Box h="h-6" w="w-[1px]" bg="bg-border" opacity="50" />
          <Button type="button" variant="ghost-secondary" label={inv.saveDraftOption} onClick={onSaveDraft} />
        </Stack>
      }
    >
      {null}
    </Modal>
  )
}

function AuditResumoView({
  selectedSession,
  onApplyChanges,
  onDeleteSession,
}: {
  selectedSession: InventoryAuditEntity | null
  onApplyChanges?: (s: InventoryAuditEntity) => void
  onDeleteSession?: (s: InventoryAuditEntity) => void
}) {
  const inv = UI_STRINGS.inventory
  const isPendente = selectedSession?.status === "Pendente"
  const statusLabel = isPendente ? inv.statusPendente : inv.statusFinalizado

  return (
    <Stack gap={5} w="full" overflow="x-hidden y-auto" flex="1">
      <AuditResumoHeader
        date={selectedSession?.date || ""}
        groups={selectedSession?.groups || ""}
        isPendente={Boolean(isPendente)}
        statusLabel={statusLabel}
      />

      <Stack direction="row" justify="between" align="center" w="full">
        <Font variant="body-bold" color="muted" text={UI_STRINGS.products.title} />
        <Font variant="body-bold" color="muted" text={inv.differenceHeader} />
      </Stack>

      <AuditResumoItemsList items={selectedSession?.items} />

      {isPendente && selectedSession && (
        <AuditResumoActions
          selectedSession={selectedSession}
          onApplyChanges={onApplyChanges}
          onDeleteSession={onDeleteSession}
        />
      )}
    </Stack>
  )
}

function parseAuditDate(ses: InventoryAuditEntity): Date | null {
  if (ses.created_at) {
    const d = new Date(ses.created_at)
    if (!isNaN(d.getTime())) return d
  }
  if (ses.date) {
    const match = ses.date.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s+(\d{1,2}):(\d{1,2}))?$/)
    if (match) {
      const day = parseInt(match[1], 10)
      const month = parseInt(match[2], 10) - 1
      let year = parseInt(match[3], 10)
      if (year < 100) year += 2000
      const hour = match[4] !== undefined ? parseInt(match[4], 10) : 0
      const min = match[5] !== undefined ? parseInt(match[5], 10) : 0
      return new Date(year, month, day, hour, min, 0)
    }
  }
  return null
}

function parseCustomDateParts(match: RegExpMatchArray, isEnd: boolean): Date {
  const day = parseInt(match[1], 10)
  const month = parseInt(match[2], 10) - 1
  let year = parseInt(match[3], 10)
  if (year < 100) year += 2000
  const hour = match[4] !== undefined ? parseInt(match[4], 10) : (isEnd ? 23 : 0)
  const min = match[5] !== undefined ? parseInt(match[5], 10) : (isEnd ? 59 : 0)
  return new Date(year, month, day, hour, min, isEnd ? 59 : 0)
}

function parseFilterDate(str: string, isEnd = false): Date | null {
  if (!str?.trim()) return null
  const clean = str.trim()
  const match = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:\s+(\d{1,2}):(\d{1,2}))?$/)
  if (match) return parseCustomDateParts(match, isEnd)
  const iso = new Date(clean)
  return isNaN(iso.getTime()) ? null : iso
}

function formatFilterDateTime(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  return `${day}/${month}/${year} ${hours}:${minutes}`
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
  return { start: formatFilterDateTime(start), end: formatFilterDateTime(end) }
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

function matchesDateRange(ses: InventoryAuditEntity, startD: Date | null, endD: Date | null): boolean {
  if (!startD && !endD) return true
  const sesDate = parseAuditDate(ses)
  if (!sesDate) return true
  if (startD && sesDate.getTime() < startD.getTime()) return false
  if (endD && sesDate.getTime() > endD.getTime()) return false
  return true
}

function matchesStatusFilter(ses: InventoryAuditEntity, statusFilters: { pendente: boolean; finalizado: boolean }): boolean {
  if (!statusFilters.pendente && ses.status === "Pendente") return false
  if (!statusFilters.finalizado && ses.status === "Finalizado") return false
  return true
}

function filterAuditSessions(
  allAudits: InventoryAuditEntity[],
  filters: {
    statusFilters: { pendente: boolean; finalizado: boolean }
    searchQuery: string
    startDate?: string
    endDate?: string
  }
): InventoryAuditEntity[] {
  const startD = filters.startDate ? parseFilterDate(filters.startDate, false) : null
  const endD = filters.endDate ? parseFilterDate(filters.endDate, true) : null

  return allAudits.filter((ses) => {
    if (!matchesStatusFilter(ses, filters.statusFilters)) return false
    if (!matchesDateRange(ses, startD, endD)) return false
    return matchesSearchQuery(ses, filters.searchQuery)
  })
}

async function saveAuditSessionRecord(p: SaveAuditParams): Promise<InventoryAuditEntity> {
  const now = new Date()
  const auditSession: InventoryAuditEntity = {
    id: p.existingSessionId || crypto.randomUUID(),
    company_id: p.tenantId,
    tenant_id: p.tenantId,
    date: formatAuditDateTime(now),
    groups: p.groupsSummary || UI_STRINGS.inventory.allGroupsSelected,
    status: p.status,
    items: p.addedItems,
    created_at: now.toISOString(),
  }

  if (p.status === "Finalizado") {
    await Promise.all(
      p.addedItems.map(async (item) => {
        const dbProd = p.dbProducts?.find((prod) => prod.id === item.productId)
        if (dbProd) await dal.products.update({ ...dbProd, stock: item.countedStock })
      })
    )
  }

  if (p.existingSessionId) {
    await dal.inventoryAudits.update(auditSession)
  } else {
    await dal.inventoryAudits.create(auditSession)
  }

  return auditSession
}

function addItemToList(
  prev: InventoryAuditItem[],
  product: { id: string; name: string; category: string; stock: number },
  countQuantity: number
): InventoryAuditItem[] {
  const diff = countQuantity
  const newItem: InventoryAuditItem = {
    productId: product.id, productName: product.name, category: product.category,
    systemStock: product.stock, countedStock: product.stock + diff, diff,
  }
  const idx = prev.findIndex((i) => i.productId === product.id)
  if (idx >= 0) { const copy = [...prev]; copy[idx] = newItem; return copy }
  return [...prev, newItem]
}

function addAdjustmentToList(prev: InventoryAuditItem[], prod: Product, adjustment: number): InventoryAuditItem[] {
  const systemStock = prod.stock ?? 0
  const newItem: InventoryAuditItem = {
    productId: prod.id, productName: prod.name, category: prod.category || "Geral",
    systemStock, countedStock: systemStock + adjustment, diff: adjustment,
  }
  const idx = prev.findIndex((i) => i.productId === prod.id)
  if (idx >= 0) { const copy = [...prev]; copy[idx] = newItem; return copy }
  return [...prev, newItem]
}

function zeroAllProductsInList(prev: InventoryAuditItem[], uncountedList: Product[]): InventoryAuditItem[] {
  const copy = [...prev]
  for (const p of uncountedList) {
    const systemStock = p.stock ?? 0
    const item: InventoryAuditItem = {
      productId: p.id, productName: p.name, category: p.category || "Geral",
      systemStock, countedStock: 0, diff: -systemStock,
    }
    const idx = copy.findIndex((i) => i.productId === p.id)
    if (idx >= 0) copy[idx] = item
    else copy.push(item)
  }
  return copy
}

function useInventoryAuditState() {
  const initialPeriod = "1M"
  const initialDates = getPeriodDates(initialPeriod)
  const [selectedSession, setSelectedSession] = React.useState<InventoryAuditEntity | null>(null)
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>(initialPeriod)
  const [startDate, setStartDate] = React.useState(initialDates.start)
  const [endDate, setEndDate] = React.useState(initialDates.end)
  const [statusFilters, setStatusFilters] = React.useState<{ pendente: boolean; finalizado: boolean }>({ pendente: true, finalizado: true })
  const [addedItems, setAddedItems] = React.useState<InventoryAuditItem[]>([])
  const [selectedProduct, setSelectedProduct] = React.useState<{ id: string; name: string; category: string; stock: number } | null>(null)
  const [productSearchQuery, setProductSearchQuery] = React.useState("")
  const [countQuantity, setCountQuantity] = React.useState<number>(0)
  const [selectedGroupIds, setSelectedGroupIds] = React.useState<string[] | null>(null)
  const [groupSearchQuery, setGroupSearchQuery] = React.useState("")
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const [appliedFilters, setAppliedFilters] = React.useState({
    startDate: initialDates.start,
    endDate: initialDates.end,
    statusFilters: { pendente: true, finalizado: true },
  })

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    const { start, end } = getPeriodDates(period)
    setStartDate(start); setEndDate(end)
  }

  const handleApplyFilters = () => {
    setAppliedFilters({
      startDate,
      endDate,
      statusFilters,
    })
  }

  const handleAddItem = () => {
    if (!selectedProduct) return
    setAddedItems((prev) => addItemToList(prev, selectedProduct, countQuantity))
    setSelectedProduct(null); setProductSearchQuery(""); setCountQuantity(0)
  }

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct({ id: p.id, name: p.name, category: p.category || "Geral", stock: p.stock ?? 0 })
    setProductSearchQuery(p.name); setCountQuantity(0)
  }

  const handleAddAdjustment = (prod: Product, adjustment: number) => {
    setAddedItems((prev) => addAdjustmentToList(prev, prod, adjustment))
  }

  const handleZeroAll = (uncountedList: Product[]) => {
    setAddedItems((prev) => zeroAllProductsInList(prev, uncountedList))
  }

  const handleResetNovoForm = () => {
    setAddedItems([]); setSelectedProduct(null); setProductSearchQuery(""); setCountQuantity(0); setSelectedSession(null)
  }

  return {
    selectedSession, setSelectedSession, selectedPeriod, setSelectedPeriod, startDate, setStartDate,
    endDate, setEndDate, statusFilters, setStatusFilters, appliedFilters, addedItems, setAddedItems,
    selectedProduct, setSelectedProduct, productSearchQuery, setProductSearchQuery, countQuantity, setCountQuantity,
    selectedGroupIds, setSelectedGroupIds, groupSearchQuery, setGroupSearchQuery,
    isDiscardModalOpen, setIsDiscardModalOpen,
    handlePeriodChange, handleApplyFilters, handleAddItem, handleSelectProduct, handleAddAdjustment, handleZeroAll, handleResetNovoForm,
  }
}

interface AuditTableRouterProps {
  mode: AuditTableMode
  filteredSessions: InventoryAuditEntity[]
  s: ReturnType<typeof useInventoryAuditState>
  availableProducts: Product[]
  uncountedProducts: Product[]
  allGroupOptions: GroupOptionItem[]
  effectiveSelectedGroupIds: string[]
  groupsSummary: string
  isFilterDrawerOpen: boolean
  onCloseFilterDrawer?: () => void
  onModeChange?: (mode: AuditTableMode) => void
  onSaveDraft: () => void
  onApplyChanges: () => void
  onApplyPendingAudit: (s: InventoryAuditEntity) => void
  onDeleteAudit: (s: InventoryAuditEntity) => void
  onToggleGroup: (id: string) => void
  onToggleSelectAll: () => void
  onOpenNovo: () => void
  onSelectSession: (s: InventoryAuditEntity) => void
  onNovoContinue: () => void
  onSemContagemContinue: () => void
  onZeroAll: () => void
  onAddAdjustment: (productId: string, adjustment: number) => void
}

function AuditTableRouter(p: AuditTableRouterProps) {
  if (p.mode === "grupos") {
    return (
      <AuditGroupsSelectionView
        allOptions={p.allGroupOptions} selectedGroupIds={p.effectiveSelectedGroupIds}
        onToggleGroup={p.onToggleGroup} onToggleSelectAll={p.onToggleSelectAll}
        searchQuery={p.s.groupSearchQuery}
      />
    )
  }
  if (p.mode === "novo") {
    return (
      <AuditNovoView
        addedItems={p.s.addedItems} selectedProduct={p.s.selectedProduct} countQuantity={p.s.countQuantity}
        setCountQuantity={p.s.setCountQuantity} availableProducts={p.availableProducts}
        onSelectProduct={p.s.handleSelectProduct} onAddItem={p.s.handleAddItem}
        onRemoveItem={(id) => p.s.setAddedItems((prev) => prev.filter((i) => i.productId !== id))}
        onContinue={p.onNovoContinue} onOpenGrupos={() => p.onModeChange?.("grupos")} groupsSummary={p.groupsSummary}
        searchQuery={p.s.productSearchQuery} onSearchQueryChange={p.s.setProductSearchQuery}
      />
    )
  }
  if (p.mode === "sem_contagem") {
    return (
      <AuditProdutosSemContagemView
        uncountedProducts={p.uncountedProducts} groupsSummary={p.groupsSummary}
        onZeroAll={p.onZeroAll} onAddAdjustment={p.onAddAdjustment} onContinue={p.onSemContagemContinue}
      />
    )
  }
  if (p.mode === "resumo") {
    if (p.s.selectedSession && p.s.selectedSession.status === "Finalizado") {
      return <AuditResumoView selectedSession={p.s.selectedSession} onApplyChanges={p.onApplyPendingAudit} onDeleteSession={p.onDeleteAudit} />
    }
    return <AuditResumoFinalView items={p.s.addedItems} onSaveDraft={p.onSaveDraft} onFinalize={p.onApplyChanges} />
  }
  return (
    <AuditHistoryView
      filteredSessions={p.filteredSessions} selectedPeriod={p.s.selectedPeriod} onPeriodChange={p.s.handlePeriodChange}
      startDate={p.s.startDate} setStartDate={p.s.setStartDate} endDate={p.s.endDate} setEndDate={p.s.setEndDate}
      statusFilters={p.s.statusFilters} toggleStatus={(k) => p.s.setStatusFilters((prev) => ({ ...prev, [k]: !prev[k] }))}
      isFilterDrawerOpen={p.isFilterDrawerOpen} onCloseFilterDrawer={p.onCloseFilterDrawer}
      onSelectSession={p.onSelectSession} onOpenNovo={p.onOpenNovo} onFilter={p.s.handleApplyFilters}
    />
  )
}

interface AuditOperationsParams {
  s: ReturnType<typeof useInventoryAuditState>
  dbProducts: Product[] | undefined
  tenantId: string
  groupsSummary: string
  allGroupOptions: GroupOptionItem[]
  effectiveSelectedGroupIds: string[]
  uncountedProducts: Product[]
  onModeChange?: (mode: AuditTableMode) => void
}

function useAuditOperations(p: AuditOperationsParams) {
  const { s, dbProducts, tenantId, groupsSummary, allGroupOptions, effectiveSelectedGroupIds, uncountedProducts, onModeChange } = p

  const handleToggleGroup = (id: string) => {
    const current = effectiveSelectedGroupIds
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
    s.setSelectedGroupIds(next)
  }

  const handleToggleSelectAll = () => {
    const isAll = effectiveSelectedGroupIds.length === allGroupOptions.length
    s.setSelectedGroupIds(isAll ? [] : allGroupOptions.map((o) => o.id))
  }

  const handleOpenNovo = () => {
    s.handleResetNovoForm(); s.setSelectedGroupIds(allGroupOptions.map((o) => o.id)); onModeChange?.("novo")
  }

  const handleSelectSession = (ses: InventoryAuditEntity) => {
    s.setSelectedSession(ses)
    if (ses.status === "Pendente") {
      s.setAddedItems(ses.items || [])
      s.setSelectedProduct(null)
      s.setCountQuantity(0)
      onModeChange?.("novo")
    } else {
      onModeChange?.("resumo")
    }
  }

  const handleNovoContinue = () => {
    if (uncountedProducts.length > 0) onModeChange?.("sem_contagem")
    else onModeChange?.("resumo")
  }

  const handleSemContagemContinue = () => onModeChange?.("resumo")
  const handleZeroAll = () => s.handleZeroAll(uncountedProducts)

  const handleAddAdjustment = (productId: string, adjustment: number) => {
    const prod = dbProducts?.find((item) => item.id === productId)
    if (prod) s.handleAddAdjustment(prod, adjustment)
  }

  const handleSaveDraft = async () => {
    if (s.addedItems.length === 0) return
    const session = await saveAuditSessionRecord({
      addedItems: s.addedItems, dbProducts, tenantId, status: "Pendente", groupsSummary,
      existingSessionId: s.selectedSession?.id,
    })
    s.setSelectedSession(session); s.handleResetNovoForm(); onModeChange?.("history")
  }

  const handleApplyChanges = async () => {
    if (s.addedItems.length === 0) return
    const session = await saveAuditSessionRecord({
      addedItems: s.addedItems, dbProducts, tenantId, status: "Finalizado", groupsSummary,
      existingSessionId: s.selectedSession?.id,
    })
    s.setSelectedSession(session); s.handleResetNovoForm(); onModeChange?.("history")
  }

  const handleDiscard = () => {
    s.handleResetNovoForm(); s.setIsDiscardModalOpen(false); onModeChange?.("history")
  }

  const handleSaveDraftAndExit = async () => {
    await handleSaveDraft(); s.setIsDiscardModalOpen(false)
  }

  const handleApplyPendingAudit = async (ses: InventoryAuditEntity) => {
    const updated = await saveAuditSessionRecord({ addedItems: ses.items, dbProducts, tenantId, status: "Finalizado", groupsSummary: ses.groups, existingSessionId: ses.id })
    s.setSelectedSession(updated)
  }

  const handleDeleteAudit = async (ses: InventoryAuditEntity) => {
    await dal.inventoryAudits.delete(ses.id, tenantId); s.setSelectedSession(null); onModeChange?.("history")
  }

  return {
    handleToggleGroup, handleToggleSelectAll, handleOpenNovo, handleSelectSession, handleNovoContinue,
    handleSemContagemContinue, handleZeroAll, handleAddAdjustment,
    handleSaveDraft, handleApplyChanges, handleDiscard, handleSaveDraftAndExit,
    handleApplyPendingAudit, handleDeleteAudit,
  }
}

interface AuditHeaderSyncParams {
  mode: AuditTableMode
  groupSearchQuery: string
  setGroupSearchQuery: (q: string) => void
  inv: typeof UI_STRINGS.inventory
  hasUnsavedItems: boolean
  isHistoricalResumo: boolean
  hasUncounted: boolean
  onOpenDiscardModal: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onModeChange?: (mode: AuditTableMode) => void
  onCancel?: () => void
  onOpenFilterDrawer?: () => void
}

function resolveAuditBackHandler(
  mode: AuditTableMode,
  p: {
    hasUnsavedItems: boolean
    isHistoricalResumo: boolean
    hasUncounted: boolean
    onOpenDiscardModal: () => void
    onModeChange?: (mode: AuditTableMode) => void
    onCancel?: () => void
  }
): (() => void) | null {
  if (mode === "grupos" || mode === "sem_contagem") return () => p.onModeChange?.("novo")
  if (mode === "resumo") {
    return () => {
      if (p.isHistoricalResumo) p.onModeChange?.("history")
      else p.onModeChange?.(p.hasUncounted ? "sem_contagem" : "novo")
    }
  }
  if (mode === "novo") {
    return () => {
      if (p.hasUnsavedItems) p.onOpenDiscardModal()
      else p.onModeChange?.("history")
    }
  }
  if (mode === "history") {
    return () => p.onCancel?.()
  }
  return null
}

function resolveAuditTitle(mode: AuditTableMode, inv: typeof UI_STRINGS.inventory): string | null {
  if (mode === "grupos") return inv.groupsLabel
  if (mode === "sem_contagem") return inv.uncountedProductsTitle
  if (mode === "resumo") return inv.balancoSummaryTitle
  if (mode === "novo") return inv.balancoCardTitle
  if (mode === "history") return "Balanços de estoque"
  return null
}

function resolveAuditActions(
  mode: AuditTableMode,
  p: {
    groupSearchQuery: string
    setGroupSearchQuery: (q: string) => void
    inv: typeof UI_STRINGS.inventory
    hasUncounted: boolean
    onModeChange?: (mode: AuditTableMode) => void
    onOpenFilterDrawer?: () => void
  }
): React.ReactNode | null {
  if (mode === "history") {
    return (
      <Box display="block md:hidden">
        <Button variant="primary-pill-icon" icon={Filter} onClick={() => p.onOpenFilterDrawer?.()} />
      </Box>
    )
  }
  if (mode === "grupos") {
    return (
      <Stack direction="row" align="center" gap={2.5}>
        <MobileHeaderSearch searchQuery={p.groupSearchQuery} onSearchQueryChange={p.setGroupSearchQuery} placeholder={p.inv.searchGroupsPlaceholder} />
        <Button variant="primary-pill-icon" icon={Check} onClick={() => p.onModeChange?.("novo")} title={p.inv.confirmSelection} />
      </Stack>
    )
  }
  if (mode === "sem_contagem") {
    if (!p.hasUncounted) return null
    return <Button variant="ghost" label={p.inv.skipButton} onClick={() => p.onModeChange?.("resumo")} />
  }
  return null
}

function useAuditHeaderSync(p: AuditHeaderSyncParams) {
  const {
    mode, groupSearchQuery, setGroupSearchQuery, inv, hasUnsavedItems, isHistoricalResumo,
    hasUncounted, onOpenDiscardModal, setCustomBack, setCustomTitle, setCustomActions, onModeChange,
    onCancel, onOpenFilterDrawer,
  } = p

  const onModeChangeRef = React.useRef(onModeChange)
  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)
  const onOpenDiscardModalRef = React.useRef(onOpenDiscardModal)
  const onCancelRef = React.useRef(onCancel)
  const onOpenFilterDrawerRef = React.useRef(onOpenFilterDrawer)

  React.useEffect(() => {
    onModeChangeRef.current = onModeChange
    setCustomBackRef.current = setCustomBack
    setCustomTitleRef.current = setCustomTitle
    setCustomActionsRef.current = setCustomActions
    onOpenDiscardModalRef.current = onOpenDiscardModal
    onCancelRef.current = onCancel
    onOpenFilterDrawerRef.current = onOpenFilterDrawer
  })

  React.useEffect(() => {
    const backCb = resolveAuditBackHandler(mode, {
      hasUnsavedItems,
      isHistoricalResumo,
      hasUncounted,
      onOpenDiscardModal: () => onOpenDiscardModalRef.current?.(),
      onModeChange: onModeChangeRef.current,
      onCancel: onCancelRef.current,
    })
    setCustomBackRef.current?.(backCb ? () => backCb : null)
    setCustomTitleRef.current?.(resolveAuditTitle(mode, inv))
    setCustomActionsRef.current?.(resolveAuditActions(mode, {
      groupSearchQuery,
      setGroupSearchQuery,
      inv,
      hasUncounted,
      onModeChange: onModeChangeRef.current,
      onOpenFilterDrawer: onOpenFilterDrawerRef.current,
    }))
  }, [mode, groupSearchQuery, setGroupSearchQuery, inv, hasUnsavedItems, isHistoricalResumo, hasUncounted])
}

export function InventoryAuditTable(props: InventoryAuditTableProps) {
  const mode = props.mode || "history"
  const searchQuery = props.searchQuery || ""
  const isFilterDrawerOpen = props.isFilterDrawerOpen || false
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "demo-tenant"

  const dbProducts = useProducts(tenantId)
  const dbCategories = useCategories(tenantId)
  const dbInventoryAudits = useInventoryAudits(tenantId)
  const s = useInventoryAuditState()
  const inv = UI_STRINGS.inventory

  const allGroupOptions = React.useMemo(
    () => buildGroupOptions(dbCategories, dbProducts, inv.noGroupLabel, inv.noSubgroupLabel),
    [dbCategories, dbProducts, inv.noGroupLabel, inv.noSubgroupLabel]
  )

  const effectiveSelectedGroupIds = React.useMemo(
    () => (s.selectedGroupIds !== null ? s.selectedGroupIds : allGroupOptions.map((o) => o.id)),
    [s.selectedGroupIds, allGroupOptions]
  )

  const groupsSummary = React.useMemo(
    () => formatSelectedGroupsSummary(effectiveSelectedGroupIds, allGroupOptions, inv),
    [effectiveSelectedGroupIds, allGroupOptions, inv]
  )

  const uncountedProducts = React.useMemo(
    () => getUncountedProducts(dbProducts, effectiveSelectedGroupIds, allGroupOptions, s.addedItems),
    [dbProducts, effectiveSelectedGroupIds, allGroupOptions, s.addedItems]
  )

  const allAudits = React.useMemo(() => (Array.isArray(dbInventoryAudits) ? dbInventoryAudits : []), [dbInventoryAudits])
  const filteredSessions = React.useMemo(
    () => filterAuditSessions(allAudits, {
      statusFilters: s.appliedFilters.statusFilters,
      searchQuery,
      startDate: s.appliedFilters.startDate,
      endDate: s.appliedFilters.endDate,
    }),
    [allAudits, s.appliedFilters, searchQuery]
  )

  const availableProductsForSelector = uncountedProducts

  const ops = useAuditOperations({
    s, dbProducts, tenantId, groupsSummary, allGroupOptions, effectiveSelectedGroupIds, uncountedProducts, onModeChange: props.onModeChange,
  })

  useAuditHeaderSync({
    mode, groupSearchQuery: s.groupSearchQuery, setGroupSearchQuery: s.setGroupSearchQuery, inv,
    hasUnsavedItems: s.addedItems.length > 0, isHistoricalResumo: Boolean(s.selectedSession && s.selectedSession.status === "Finalizado"),
    hasUncounted: uncountedProducts.length > 0, onOpenDiscardModal: () => s.setIsDiscardModalOpen(true),
    setCustomBack: props.setCustomBack, setCustomTitle: props.setCustomTitle, setCustomActions: props.setCustomActions, onModeChange: props.onModeChange,
    onCancel: props.onCancel,
  })

  return (
    <Box position="relative" w="full" h="full" display="flex" direction="col" flex="1" minH="0">
      <AuditTableRouter
        mode={mode} filteredSessions={filteredSessions} s={s} availableProducts={availableProductsForSelector}
        uncountedProducts={uncountedProducts} allGroupOptions={allGroupOptions} effectiveSelectedGroupIds={effectiveSelectedGroupIds}
        groupsSummary={groupsSummary} isFilterDrawerOpen={isFilterDrawerOpen} onCloseFilterDrawer={props.onCloseFilterDrawer}
        onModeChange={props.onModeChange} onSaveDraft={ops.handleSaveDraft} onApplyChanges={ops.handleApplyChanges}
        onApplyPendingAudit={ops.handleApplyPendingAudit} onDeleteAudit={ops.handleDeleteAudit}
        onToggleGroup={ops.handleToggleGroup} onToggleSelectAll={ops.handleToggleSelectAll} onOpenNovo={ops.handleOpenNovo}
        onSelectSession={ops.handleSelectSession}
        onNovoContinue={ops.handleNovoContinue} onSemContagemContinue={ops.handleSemContagemContinue}
        onZeroAll={ops.handleZeroAll} onAddAdjustment={ops.handleAddAdjustment}
      />

      <AuditDiscardModal
        isOpen={s.isDiscardModalOpen}
        onClose={() => s.setIsDiscardModalOpen(false)}
        onDiscard={ops.handleDiscard}
        onSaveDraft={ops.handleSaveDraftAndExit}
      />
    </Box>
  )
}
