"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Badge } from "@/components/store/base/Badge"
import { Input } from "@/components/store/base/Input"
import { Icon } from "@/components/store/base/Icon"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { Numpad } from "@/components/store/intermediary/Numpad"
import { Modal } from "@/components/store/base/Modal"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { FornecedoresSection, GruposSubgruposSection, UnidadesSection } from "@/components/store/sections/pdv/settings"
import { Plus, Minus, Trash2, Package, X, Filter, ChevronRight, Disc, Circle } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import { useTenant } from "@/lib/context/TenantContext"
import { useProducts, useManualStockEntries, dal, Product, Supplier, ManualStockEntryEntity, ManualStockEntryItem } from "@/lib/dal"

export type ManualEntryMode = "history" | "novo" | "custos" | "select_supplier" | "select_group" | "select_subgroup" | "select_unit"

export interface ManualStockEntriesTableProps {
  onCancel: () => void
  onSuccess?: (msg: string) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

interface HeaderSyncOptions {
  mode: ManualEntryMode
  handleRequestBack: () => void
  setIsFilterDrawerOpen: (v: boolean) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function formatBRL(val: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
}

function parseCurrency(val: string): number {
  const clean = val.replace(/[^\d,.-]/g, "").replace(".", "").replace(",", ".")
  return parseFloat(clean) || 0
}

function ManualEntryHistoryList({
  entries,
  onOpenNovo,
  onSelectEntry,
}: {
  entries: ManualStockEntryEntity[]
  onOpenNovo: () => void
  onSelectEntry: (entry: ManualStockEntryEntity) => void
}) {
  const inv = UI_STRINGS.inventory
  return (
    <Box flex="1" position="relative" h="full" overflow="x-hidden y-auto">
      {entries.length > 0 ? (
        <Box display="flex" direction="col" w="full">
          {entries.map((entry, idx) => {
            const isPendente = entry.status === "Pendente"
            return (
              <Box key={entry.id}>
                <Box
                  padding={2.5}
                  radius="none"
                  hoverBg="secondary/10"
                  cursor="pointer"
                  onClick={() => onSelectEntry(entry)}
                  w="full"
                >
                  <Stack direction="row" align="center" justify="between" w="full">
                    <Stack gap={1} align="start" flex="1" minW="0">
                      <Font variant="auxiliary" color="muted" text={entry.date} />
                      <Font variant="body" text={entry.supplier_name || inv.noSupplierSelected} />
                    </Stack>
                    <Stack direction="row" align="center" gap={2.5}>
                      <Font variant="body-bold" text={formatBRL(entry.total)} />
                      <Badge
                        variant={isPendente ? "warning" : "success"}
                        rounded="full"
                        label={isPendente ? inv.statusPendente : inv.statusFinalizado}
                      />
                    </Stack>
                  </Stack>
                </Box>
                {idx < entries.length - 1 && <Box h="h-[2px]" w="full" bg="bg-border" />}
              </Box>
            )
          })}
        </Box>
      ) : (
        <EmptyState icon={Package} title={inv.emptyManualEntriesTitle} />
      )}
      <Box position="fixed" bottom={6} right={6} zIndex="50">
        <Button variant="secondary-pill-icon" icon={Plus} onClick={onOpenNovo} />
      </Box>
    </Box>
  )
}

function ManualEntryHistoryView({
  entries,
  supplierFilter,
  setSupplierFilter,
  selectedPeriod,
  onPeriodChange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isFilterDrawerOpen,
  onCloseFilterDrawer,
  onOpenNovo,
  onSelectEntry,
  onFilter,
}: {
  entries: ManualStockEntryEntity[]
  supplierFilter: string
  setSupplierFilter: (v: string) => void
  selectedPeriod: string
  onPeriodChange: (v: string) => void
  startDate: string
  setStartDate: (v: string) => void
  endDate: string
  setEndDate: (v: string) => void
  isFilterDrawerOpen: boolean
  onCloseFilterDrawer: () => void
  onOpenNovo: () => void
  onSelectEntry: (entry: ManualStockEntryEntity) => void
  onFilter: () => void
}) {
  const inv = UI_STRINGS.inventory
  const common = UI_STRINGS.common

  const renderSupplierFilter = () => (
    <Stack gap={1} w="full">
      <Font variant="body-sm-semibold" text={inv.supplierLabel} />
      <Input
        placeholder={inv.supplierFilterPlaceholder}
        value={supplierFilter}
        onChange={(e) => setSupplierFilter(e.target.value)}
      />
    </Stack>
  )

  return (
    <Stack direction="col" mobileDirection="row" gap={5} w="full" h="full" align="stretch" flex="1" minH="0">
      <ManualEntryHistoryList entries={entries} onOpenNovo={onOpenNovo} onSelectEntry={onSelectEntry} />
      <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
        <FilterPanel
          selectedPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          onFilter={onFilter}
        >
          {renderSupplierFilter()}
        </FilterPanel>
      </Box>
      <Modal isOpen={isFilterDrawerOpen} onClose={onCloseFilterDrawer} title={common.filter} variant="sidebar">
        <FilterPanel
          hideTitle
          borderless
          selectedPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          onFilter={() => { onFilter(); onCloseFilterDrawer() }}
        >
          {renderSupplierFilter()}
        </FilterPanel>
      </Modal>
    </Stack>
  )
}

function ProductSearchDropdown({
  isOpen,
  filteredProducts,
  onSelect,
}: {
  isOpen: boolean
  filteredProducts: Product[]
  onSelect: (p: Product) => void
}) {
  if (!isOpen) return null
  const common = UI_STRINGS.common

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
              <Box padding={2.5} hoverBg="secondary/10" cursor="pointer" onClick={() => onSelect(p)} w="full">
                <Stack direction="row" align="center" gap={2.5} w="full">
                  <Icon icon={Package} size={16} color="primary" />
                  <Font variant="body-sm-medium" text={`${p.name} (${formatBRL(p.cost_price || 0)})`} />
                </Stack>
              </Box>
              {idx < filteredProducts.length - 1 && <Box borderBottom borderColor="border-border" w="full" />}
            </Box>
          ))}
        </Box>
      ) : (
        <Box padding={5} display="flex" align="center" justify="center" w="full">
          <Font variant="body-sm-medium" color="muted" text={common.noResultsFound} />
        </Box>
      )}
    </Box>
  )
}

function ProductSearchField({
  search,
  setSearch,
  isDropdownOpen,
  setIsDropdownOpen,
  filteredProducts,
  onSelectProduct,
  onClearProduct,
  onOpenQuickRegister,
}: {
  search: string
  setSearch: (s: string) => void
  isDropdownOpen: boolean
  setIsDropdownOpen: (v: boolean) => void
  filteredProducts: Product[]
  onSelectProduct: (p: Product) => void
  onClearProduct: () => void
  onOpenQuickRegister: () => void
}) {
  const inv = UI_STRINGS.inventory
  return (
    <Box position="relative" w="full">
      <Stack gap={1} w="full">
        <Stack direction="row" align="center" gap={2.5} w="full">
          <Box flex="1" position="relative">
            <Input
              variant="outlined-label"
              label={inv.productFieldLabel}
              placeholder={inv.searchProductPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setIsDropdownOpen(true) }}
              onFocus={() => setIsDropdownOpen(true)}
              iconRight={search ? X : undefined}
              onIconRightClick={onClearProduct}
            />
            <ProductSearchDropdown isOpen={isDropdownOpen} filteredProducts={filteredProducts} onSelect={onSelectProduct} />
          </Box>
          <Button
            variant="primary-pill-icon"
            icon={Plus}
            title={inv.registerProductTitle}
            onClick={onOpenQuickRegister}
          />
        </Stack>
        <Font variant="auxiliary" color="muted" text={inv.searchProductHelp} />
      </Stack>
    </Box>
  )
}

function ProductQuantityStepper({
  quantity,
  setQuantity,
}: {
  quantity: number
  setQuantity: React.Dispatch<React.SetStateAction<number>>
}) {
  const inv = UI_STRINGS.inventory
  return (
    <Input
      variant="outlined-counter"
      label={inv.quantityFieldLabel}
      value={quantity}
      onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
      onIncrement={() => setQuantity((q) => q + 1)}
    />
  )
}

function buildManualEntryItem(product: Product, costStr: string, qty: number): ManualStockEntryItem {
  const numericCost = parseCurrency(costStr)
  const cleanQty = Math.max(1, qty)
  return {
    productId: product.id,
    productName: product.name,
    quantity: cleanQty,
    costPrice: numericCost,
    oldCostPrice: product.cost_price || 0,
    otherCosts: product.other_costs || 0,
    margin: product.margin || 100,
    salePrice: product.price || numericCost * 2,
    totalCost: numericCost * cleanQty,
    category: product.category,
    subgroup: product.subgroup,
    imageUrl: product.image_url,
  }
}

interface QuickModalProductParams {
  description: string
  group: string
  subgroup?: string
  unit: string
  barcode: string
  costPrice: number
  tenantId: string
}

function buildProductFromQuickModal(p: QuickModalProductParams): Product {
  return {
    id: `prod-${Date.now()}`,
    name: p.description.trim().toUpperCase(),
    category_id: p.group.trim() || "Geral",
    category: p.group.trim() || "Geral",
    subgroup: p.subgroup?.trim() || undefined,
    unit: p.unit.trim() || "UN",
    barcode: p.barcode.trim() || undefined,
    cost_price: p.costPrice,
    price: p.costPrice > 0 ? p.costPrice * 2 : 0,
    stock: 0,
    active: true,
    company_id: p.tenantId,
    tenant_id: p.tenantId,
  }
}

export interface QuickProductFormState {
  name: string
  group: string
  subgroup: string
  unit: string
  barcode: string
  costPrice: string
  quantity: number
}

function QuickProductClassFields({
  formState,
  onOpenGroupSelection,
  onOpenSubgroupSelection,
  onOpenUnitSelection,
  onBarcodeChange,
}: {
  formState: QuickProductFormState
  onOpenGroupSelection: () => void
  onOpenSubgroupSelection: () => void
  onOpenUnitSelection: () => void
  onBarcodeChange: (val: string) => void
}) {
  const inv = UI_STRINGS.inventory
  return (
    <>
      <Grid cols={2} gap={2.5}>
        <Box cursor="pointer" onClick={(e) => { e.stopPropagation(); onOpenGroupSelection() }} w="full">
          <Input variant="outlined-label" label={inv.groupLabel} value={formState.group} readOnly iconRight={ChevronRight} />
        </Box>
        <Box cursor="pointer" onClick={(e) => { e.stopPropagation(); onOpenSubgroupSelection() }} w="full">
          <Input variant="outlined-label" label={inv.subgroupLabel} value={formState.subgroup} readOnly iconRight={ChevronRight} />
        </Box>
      </Grid>
      <Grid cols={2} gap={2.5}>
        <Box cursor="pointer" onClick={(e) => { e.stopPropagation(); onOpenUnitSelection() }} w="full">
          <Input variant="outlined-label" label={inv.unitLabel} value={formState.unit} readOnly iconRight={ChevronRight} />
        </Box>
        <Input
          variant="outlined-label"
          label={inv.barcodeLabel}
          value={formState.barcode}
          onChange={(e) => onBarcodeChange(e.target.value)}
        />
      </Grid>
    </>
  )
}

function QuickProductModalFormFields({
  formState,
  setFormState,
  onOpenGroupSelection,
  onOpenSubgroupSelection,
  onOpenUnitSelection,
}: {
  formState: QuickProductFormState
  setFormState: React.Dispatch<React.SetStateAction<QuickProductFormState>>
  onOpenGroupSelection: () => void
  onOpenSubgroupSelection: () => void
  onOpenUnitSelection: () => void
}) {
  const inv = UI_STRINGS.inventory
  return (
    <Stack gap={5} w="full">
      <Input
        variant="outlined-label"
        label={inv.productNameLabel}
        value={formState.name}
        onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
        required
      />
      <QuickProductClassFields
        formState={formState}
        onOpenGroupSelection={onOpenGroupSelection}
        onOpenSubgroupSelection={onOpenSubgroupSelection}
        onOpenUnitSelection={onOpenUnitSelection}
        onBarcodeChange={(val) => setFormState((prev) => ({ ...prev, barcode: val }))}
      />
      <Grid cols={2} gap={2.5}>
        <Input
          variant="outlined-label"
          label={inv.costPriceLabel}
          value={formState.costPrice}
          onChange={(e) => setFormState((prev) => ({ ...prev, costPrice: e.target.value }))}
        />
        <ProductQuantityStepper
          quantity={formState.quantity}
          setQuantity={(updater) =>
            setFormState((prev) => ({
              ...prev,
              quantity: typeof updater === "function" ? updater(prev.quantity) : updater,
            }))
          }
        />
      </Grid>
    </Stack>
  )
}

function QuickProductCreateModal({
  isOpen,
  onClose,
  tenantId,
  formState,
  setFormState,
  onOpenGroupSelection,
  onOpenSubgroupSelection,
  onOpenUnitSelection,
  onProductCreated,
}: {
  isOpen: boolean
  onClose: () => void
  tenantId: string
  formState: QuickProductFormState
  setFormState: React.Dispatch<React.SetStateAction<QuickProductFormState>>
  onOpenGroupSelection: () => void
  onOpenSubgroupSelection: () => void
  onOpenUnitSelection: () => void
  onProductCreated: (item: ManualStockEntryItem) => void
}) {
  const inv = UI_STRINGS.inventory

  const handleConfirm = async () => {
    if (!formState.name.trim()) return
    const numericCost = parseCurrency(formState.costPrice)
    const qty = Math.max(0, formState.quantity)
    const newProd = buildProductFromQuickModal({
      description: formState.name,
      group: formState.group,
      subgroup: formState.subgroup,
      unit: formState.unit,
      barcode: formState.barcode,
      costPrice: numericCost,
      tenantId,
    })
    await dal.products.create(newProd)
    if (qty > 0 || numericCost > 0) {
      onProductCreated(buildManualEntryItem(newProd, formState.costPrice, Math.max(1, qty)))
    }
    setFormState({
      name: "", group: "", subgroup: "", unit: "UN", barcode: "", costPrice: "0,00", quantity: 0,
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={inv.registerProductTitle}
      subtitle={inv.registerProductSubtitle}
      icon={Package}
      showCancelButton={true}
      cancelText={UI_STRINGS.common.cancel}
      cancelVariant="secondary"
      successText={UI_STRINGS.common.confirm}
      onSuccess={handleConfirm}
    >
      <QuickProductModalFormFields
        formState={formState}
        setFormState={setFormState}
        onOpenGroupSelection={onOpenGroupSelection}
        onOpenSubgroupSelection={onOpenSubgroupSelection}
        onOpenUnitSelection={onOpenUnitSelection}
      />
    </Modal>
  )
}

function useProductFormSelection(
  products: Product[],
  onAddItem: (item: ManualStockEntryItem) => void
) {
  const [search, setSearch] = React.useState("")
  const [selectedProd, setSelectedProd] = React.useState<Product | null>(null)
  const [costPrice, setCostPrice] = React.useState("0,00")
  const [quantity, setQuantity] = React.useState(1)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

  const filtered = React.useMemo(() => {
    if (!search.trim()) return products.slice(0, 10)
    const q = search.toLowerCase()
    return products.filter((p) => (p.name || "").toLowerCase().includes(q) || (p.barcode || "").includes(q))
  }, [products, search])

  const handleSelectProduct = (p: Product) => {
    setSelectedProd(p)
    setSearch(p.name)
    setCostPrice((p.cost_price || 0).toFixed(2).replace(".", ","))
    setIsDropdownOpen(false)
  }

  const handleClearProduct = () => {
    setSelectedProd(null)
    setSearch("")
    setCostPrice("0,00")
    setIsDropdownOpen(false)
  }

  const handleAdd = () => {
    if (!selectedProd) return
    onAddItem(buildManualEntryItem(selectedProd, costPrice, quantity))
    handleClearProduct()
    setQuantity(1)
  }

  return {
    search, setSearch, selectedProd, costPrice, setCostPrice,
    quantity, setQuantity, isDropdownOpen, setIsDropdownOpen,
    filtered, handleSelectProduct, handleClearProduct, handleAdd,
  }
}

function NovoEntryProductForm({
  products,
  tenantId,
  isQuickRegisterOpen,
  setIsQuickRegisterOpen,
  quickProdForm,
  setQuickProdForm,
  onOpenGroupSelection,
  onOpenSubgroupSelection,
  onOpenUnitSelection,
  onAddItem,
}: {
  products: Product[]
  tenantId: string
  isQuickRegisterOpen: boolean
  setIsQuickRegisterOpen: (v: boolean) => void
  quickProdForm: QuickProductFormState
  setQuickProdForm: React.Dispatch<React.SetStateAction<QuickProductFormState>>
  onOpenGroupSelection: () => void
  onOpenSubgroupSelection: () => void
  onOpenUnitSelection: () => void
  onAddItem: (it: ManualStockEntryItem) => void
}) {
  const inv = UI_STRINGS.inventory
  const common = UI_STRINGS.common
  const form = useProductFormSelection(products, onAddItem)

  return (
    <Box padding={5} bg="bg-surface" radius="default" border borderColor="border-border" w="full" h="fit-content">
      <Stack gap={5} w="full">
        <Font variant="h3" text={inv.addProductTitle} />
        <ProductSearchField
          search={form.search}
          setSearch={form.setSearch}
          isDropdownOpen={form.isDropdownOpen}
          setIsDropdownOpen={form.setIsDropdownOpen}
          filteredProducts={form.filtered}
          onSelectProduct={form.handleSelectProduct}
          onClearProduct={form.handleClearProduct}
          onOpenQuickRegister={() => setIsQuickRegisterOpen(true)}
        />
        <Grid cols={2} gap={2.5}>
          <Input
            variant="outlined-label"
            label={inv.costPriceLabel}
            value={form.costPrice}
            onChange={(e) => form.setCostPrice(e.target.value)}
          />
          <ProductQuantityStepper quantity={form.quantity} setQuantity={form.setQuantity} />
        </Grid>
        <Button variant="primary" label={common.add} onClick={form.handleAdd} disabled={!form.selectedProd} fullWidth />
      </Stack>
      <QuickProductCreateModal
        isOpen={isQuickRegisterOpen}
        onClose={() => setIsQuickRegisterOpen(false)}
        tenantId={tenantId}
        formState={quickProdForm}
        setFormState={setQuickProdForm}
        onOpenGroupSelection={onOpenGroupSelection}
        onOpenSubgroupSelection={onOpenSubgroupSelection}
        onOpenUnitSelection={onOpenUnitSelection}
        onProductCreated={onAddItem}
      />
    </Box>
  )
}

function formatCategoryHierarchy(category?: string, subgroup?: string): string {
  const cat = (category || "").trim().toUpperCase()
  const sub = (subgroup || "").trim().toUpperCase()
  if (cat && sub) return `${cat} > ${sub}`
  if (cat) return cat
  if (sub) return sub
  return ""
}

function NovoEntryItemRow({
  item,
  product,
  onRemove,
}: {
  item: ManualStockEntryItem
  product?: Product
  onRemove: () => void
}) {
  const category = item.category || product?.category
  const subgroup = item.subgroup || product?.subgroup
  const unit = product?.unit || "UN"
  const categoryHierarchy = formatCategoryHierarchy(category, subgroup)

  return (
    <Box padding={2.5} radius="none" hoverBg="secondary/10" w="full">
      <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
        <Stack gap={1} align="start" flex="1" minW="0">
          <Font variant="body" text={item.productName} />
          {categoryHierarchy ? (
            <Font variant="auxiliary" color="muted" truncate text={categoryHierarchy} />
          ) : null}
          <Font variant="auxiliary" color="muted" text={`${item.quantity} ${unit} x ${formatBRL(item.costPrice)}`} />
        </Stack>
        <Box shrink="0">
          <Stack direction="row" align="center" gap={2.5}>
            <Font variant="body-bold" text={formatBRL(item.totalCost)} />
            <Button variant="danger-pill-icon-xs" icon={Trash2} onClick={onRemove} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

function NovoEntryLeftColumn({
  selectedSupplier,
  items,
  totalCost,
  products,
  onOpenSupplierSelection,
  onRemoveItem,
  onGoToCosts,
}: {
  selectedSupplier: Supplier | null
  items: ManualStockEntryItem[]
  totalCost: number
  products: Product[]
  onOpenSupplierSelection: () => void
  onRemoveItem: (index: number) => void
  onGoToCosts: () => void
}) {
  const inv = UI_STRINGS.inventory
  const common = UI_STRINGS.common

  return (
    <Box flex="1" position="relative" display="flex" direction="col" justify="between" h="full" w="full">
      <Stack gap={5} w="full">
        <Stack gap={1} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Font variant="body-bold" text={inv.supplierLabel} />
            <Box cursor="pointer" onClick={onOpenSupplierSelection}>
              <Font variant="body-sm-semibold" color="primary" text={selectedSupplier ? inv.changeSupplierButton : inv.selectSupplierButton} />
            </Box>
          </Stack>
          <Font variant="auxiliary" color="muted" text={selectedSupplier ? selectedSupplier.name : inv.noSupplierSelected} />
        </Stack>

        <Font variant="body-bold" text={inv.productsSectionTitle} />

        {items.length === 0 ? (
          <EmptyState icon={Package} title={inv.emptyManualProductsTitle} />
        ) : (
          <Box w="full" maxH="96" overflow="x-hidden y-auto">
            <Box display="flex" direction="col" w="full">
              {items.map((item, idx) => (
                <Box key={`${item.productId}-${idx}`}>
                  <NovoEntryItemRow
                    item={item}
                    product={products.find((p) => p.id === item.productId)}
                    onRemove={() => onRemoveItem(idx)}
                  />
                  {idx < items.length - 1 && <Box h="h-[2px]" w="full" bg="bg-border" />}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Stack>

      <Box w="full" shrink="0">
        <Stack gap={2.5} w="full">
          <Stack direction="row" align="center" justify="between" w="full">
            <Font variant="body" text={common.total} />
            <Font variant="body-bold" text={formatBRL(totalCost)} />
          </Stack>
          <Button variant="primary" label={inv.costManagementButton} onClick={onGoToCosts} disabled={items.length === 0} fullWidth />
        </Stack>
      </Box>
    </Box>
  )
}

function CostRow({
  item,
  onUpdate,
}: {
  item: ManualStockEntryItem
  onUpdate: (updated: ManualStockEntryItem) => void
}) {
  const otherCosts = item.otherCosts || 0
  const effectiveCost = item.costPrice * (1 + otherCosts / 100)

  const handleMarginChange = (valStr: string) => {
    const isNegative = valStr.includes("-")
    const digits = valStr.replace(/\D/g, "")
    if (!digits) {
      onUpdate({ ...item, margin: 0, salePrice: effectiveCost })
      return
    }
    const num = (Number(digits) / 100) * (isNegative ? -1 : 1)
    const salePrice = effectiveCost * (1 + num / 100)
    onUpdate({ ...item, margin: num, salePrice: Math.max(0, salePrice) })
  }

  const handleSalePriceChange = (valStr: string) => {
    const digits = valStr.replace(/\D/g, "")
    if (!digits) {
      onUpdate({ ...item, salePrice: 0, margin: -100 })
      return
    }
    const salePrice = Number(digits) / 100
    const margin = effectiveCost > 0 ? ((salePrice - effectiveCost) / effectiveCost) * 100 : 0
    onUpdate({ ...item, salePrice, margin })
  }

  const marginDisplay = `% ${(item.margin ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const salePriceDisplay = (item.salePrice ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  return (
    <Box padding={2.5} w="full">
      <Grid cols={5} gap={2.5}>
        <Stack justify="center" h="full">
          <Font variant="body" text={item.productName} />
        </Stack>
        <Stack direction="row" align="center" gap={1} h="full">
          <Font variant="body" color="muted" text={formatBRL(item.oldCostPrice || 0)} />
          <Icon icon={ChevronRight} size={14} color="muted" />
          <Font variant="body-bold" color="primary" text={formatBRL(item.costPrice)} />
        </Stack>
        <Stack justify="center" h="full">
          <Font variant="body" color="muted" text={`${otherCosts.toFixed(2).replace(".", ",")}%`} />
        </Stack>
        <Input
          value={marginDisplay}
          onChange={(e) => handleMarginChange(e.target.value)}
        />
        <Input
          value={salePriceDisplay}
          onChange={(e) => handleSalePriceChange(e.target.value)}
        />
      </Grid>
    </Box>
  )
}

function MobileCostOptionCard({
  isSelected,
  onClick,
  label,
  value,
}: {
  isSelected: boolean
  onClick: () => void
  label: string
  value: string
}) {
  return (
    <Box
      padding={2.5}
      radius="default"
      bg={isSelected ? "bg-secondary/10" : undefined}
      cursor="pointer"
      onClick={onClick}
      w="full"
    >
      <Stack direction="row" align="center" gap={2.5} w="full">
        <Icon
          icon={isSelected ? Disc : Circle}
          size={20}
          color={isSelected ? "foreground" : "muted"}
        />
        <Stack gap={0} align="start" flex="1" minW="0">
          <Font variant="body-sm-medium" color="muted" text={label} />
          <Font variant="h3" text={value} />
        </Stack>
      </Stack>
    </Box>
  )
}

function computeKeypadNextDigits(rawDigits: string, key: string): string {
  if (key === "back") {
    return rawDigits.length > 1 ? rawDigits.slice(0, -1) : "0"
  }
  if (key === "00") {
    return rawDigits !== "0" && rawDigits.length < 9 ? `${rawDigits}00` : rawDigits
  }
  if (rawDigits === "0") {
    return key
  }
  return rawDigits.length < 9 ? `${rawDigits}${key}` : rawDigits
}

interface MobileCostEditContentProps {
  item: ManualStockEntryItem
  onClose: () => void
  onConfirm: (updated: ManualStockEntryItem) => void
}

function MobileCostEditContent({ item, onClose, onConfirm }: MobileCostEditContentProps) {
  const [fieldMode, setFieldMode] = React.useState<"price" | "margin">("price")
  const [salePrice, setSalePrice] = React.useState(item.salePrice || 0)
  const [margin, setMargin] = React.useState(item.margin || 0)
  const [rawDigits, setRawDigits] = React.useState(Math.round((item.salePrice || 0) * 100).toString())

  const inv = UI_STRINGS.inventory
  const effectiveCost = item.costPrice * (1 + (item.otherCosts || 0) / 100)

  const handleModeChange = (mode: "price" | "margin") => {
    setFieldMode(mode)
    setRawDigits(Math.round((mode === "price" ? salePrice : margin) * 100).toString())
  }

  const handleKeyPress = (key: string) => {
    const nextDigits = computeKeypadNextDigits(rawDigits, key)
    setRawDigits(nextDigits)
    const numVal = Number(nextDigits) / 100
    if (fieldMode === "price") {
      const newPrice = numVal
      const newMargin = effectiveCost > 0 ? ((newPrice - effectiveCost) / effectiveCost) * 100 : 0
      setSalePrice(newPrice)
      setMargin(newMargin)
    } else {
      const newMargin = numVal
      const newPrice = effectiveCost * (1 + newMargin / 100)
      setMargin(newMargin)
      setSalePrice(Math.max(0, newPrice))
    }
  }

  const handleSave = () => {
    onConfirm({ ...item, salePrice, margin })
    onClose()
  }

  const marginFormatted = `${margin.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`

  return (
    <Modal isOpen onClose={onClose} variant="numpad">
      <Box padding={5} w="full">
        <Stack gap={5} w="full">
          {/* Cabeçalho */}
          <Stack gap={1}>
            <Font variant="body-bold" text={item.productName} />
            <Font variant="description" color="muted" text={`${inv.costPricePrefix}${formatBRL(item.costPrice)}`} />
          </Stack>

          {/* Cards de seleção */}
          <Stack gap={2.5} w="full">
            <MobileCostOptionCard
              isSelected={fieldMode === "price"}
              onClick={() => handleModeChange("price")}
              label={inv.salePriceOptionLabel}
              value={formatBRL(salePrice)}
            />
            <MobileCostOptionCard
              isSelected={fieldMode === "margin"}
              onClick={() => handleModeChange("margin")}
              label={inv.marginOptionLabel}
              value={marginFormatted}
            />
          </Stack>

          {/* Teclado */}
          <Numpad onKeyPress={handleKeyPress} variant="ghost" />

          {/* Rodapé */}
          <Stack direction="row" justify="end" align="center" gap={2.5} w="full">
            <Button variant="ghost" label={UI_STRINGS.common.cancel} onClick={onClose} />
            <Button variant="ghost-primary" label={UI_STRINGS.common.confirm} onClick={handleSave} />
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )
}

function MobileCostEditModal({
  item,
  onClose,
  onConfirm,
}: {
  item: ManualStockEntryItem | null
  onClose: () => void
  onConfirm: (updated: ManualStockEntryItem) => void
}) {
  if (!item) return null
  return <MobileCostEditContent key={`${item.productId}-${item.costPrice}`} item={item} onClose={onClose} onConfirm={onConfirm} />
}

function CostManagementDesktopTable({
  items,
  onUpdateItem,
}: {
  items: ManualStockEntryItem[]
  onUpdateItem: (idx: number, updated: ManualStockEntryItem) => void
}) {
  const inv = UI_STRINGS.inventory
  return (
    <Box display="hidden md:block" w="full">
      <Stack gap={2.5} w="full">
        <Box padding={2.5} borderBottom borderColor="border-border" w="full">
          <Grid cols={5} gap={2.5}>
            <Font variant="body-bold" text={inv.productHeader} />
            <Font variant="body-bold" text={inv.costPriceHeader} />
            <Font variant="body-bold" text={inv.otherCostsHeader} />
            <Font variant="body-bold" text={inv.marginHeader} />
            <Font variant="body-bold" text={inv.salePriceHeader} />
          </Grid>
        </Box>
        <Box display="flex" direction="col" w="full">
          {items.map((item, idx) => (
            <Box key={`${item.productId}-${idx}`}>
              <CostRow item={item} onUpdate={(updated) => onUpdateItem(idx, updated)} />
              {idx < items.length - 1 && <Box h="h-[1px]" w="full" bg="bg-border" />}
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  )
}

function CostManagementMobileList({
  items,
  onSelectIndex,
}: {
  items: ManualStockEntryItem[]
  onSelectIndex: (idx: number) => void
}) {
  const inv = UI_STRINGS.inventory
  return (
    <Box display="block md:hidden" w="full">
      <Box display="flex" direction="col" w="full">
        {items.map((item, idx) => (
          <Box key={`${item.productId}-${idx}`}>
            <Box
              padding={2.5}
              radius="none"
              hoverBg="secondary/10"
              cursor="pointer"
              onClick={() => onSelectIndex(idx)}
              w="full"
            >
              <Stack direction="row" align="center" justify="between" w="full">
                <Stack gap={0} align="start" flex="1" minW="0">
                  <Font variant="body" text={item.productName} />
                  <Font variant="auxiliary" color="muted" text={`${inv.costPricePrefix}${formatBRL(item.costPrice)}`} />
                  <Font variant="auxiliary" color="muted" text={`${inv.otherCostsPrefix}${(item.otherCosts || 0).toFixed(2).replace(".", ",")}%`} />
                </Stack>
                <Stack gap={0} align="end">
                  <Font variant="body-bold" text={formatBRL(item.salePrice || 0)} />
                  <Font variant="auxiliary" color="muted" text={`${inv.marginPrefix}${(item.margin || 0).toFixed(2).replace(".", ",")}%`} />
                </Stack>
              </Stack>
            </Box>
            {idx < items.length - 1 && <Box h="h-[1px]" w="full" bg="bg-border" />}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function CostManagementView({
  items,
  onUpdateItem,
  onFinalize,
}: {
  items: ManualStockEntryItem[]
  onUpdateItem: (idx: number, updated: ManualStockEntryItem) => void
  onFinalize: () => void
}) {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
  const inv = UI_STRINGS.inventory
  const editingItem = editingIndex !== null ? items[editingIndex] : null

  return (
    <Stack gap={5} w="full" h="full" flex="1" minH="0" justify="between">
      <Box flex="1" minH="0" overflow="x-hidden y-auto" w="full">
        <CostManagementDesktopTable items={items} onUpdateItem={onUpdateItem} />
        <CostManagementMobileList items={items} onSelectIndex={setEditingIndex} />
      </Box>

      <Button variant="primary" label={inv.finalizeButton} onClick={onFinalize} fullWidth />

      <MobileCostEditModal
        item={editingItem}
        onClose={() => setEditingIndex(null)}
        onConfirm={(updated) => {
          if (editingIndex !== null) {
            onUpdateItem(editingIndex, updated)
          }
        }}
      />
    </Stack>
  )
}

function renderHeaderActions(params: {
  mode: ManualEntryMode
  onOpenFilter: () => void
}) {
  const { mode, onOpenFilter } = params
  if (mode === "history") {
    return (
      <Box display="block md:hidden">
        <Button variant="primary-pill-icon" icon={Filter} onClick={onOpenFilter} />
      </Box>
    )
  }
  return null
}

function getHeaderTitle(mode: ManualEntryMode, inv: typeof UI_STRINGS.inventory): string {
  if (mode === "history") return inv.manualEntriesTitle
  if (mode === "novo") return inv.manualEntryTitle
  return inv.costManagementTitle
}

function useManualStockSyncHeader(opts: HeaderSyncOptions) {
  const {
    mode, handleRequestBack, setIsFilterDrawerOpen,
    setCustomBack, setCustomTitle, setCustomActions,
  } = opts
  const inv = UI_STRINGS.inventory

  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)
  const handleRequestBackRef = React.useRef(handleRequestBack)
  const setIsFilterDrawerOpenRef = React.useRef(setIsFilterDrawerOpen)

  React.useEffect(() => {
    setCustomBackRef.current = setCustomBack
    setCustomTitleRef.current = setCustomTitle
    setCustomActionsRef.current = setCustomActions
    handleRequestBackRef.current = handleRequestBack
    setIsFilterDrawerOpenRef.current = setIsFilterDrawerOpen
  })

  React.useEffect(() => {
    setCustomBackRef.current?.(() => () => handleRequestBackRef.current())
    setCustomTitleRef.current?.(getHeaderTitle(mode, inv))
    setCustomActionsRef.current?.(
      renderHeaderActions({
        mode,
        onOpenFilter: () => setIsFilterDrawerOpenRef.current(true),
      })
    )
  }, [mode, inv])

  React.useEffect(() => {
    return () => {
      setCustomBackRef.current?.(null)
      setCustomTitleRef.current?.(null)
      setCustomActionsRef.current?.(null)
    }
  }, [])
}

interface PersistManualEntryParams {
  tenantId: string
  entryId: string
  items: ManualStockEntryItem[]
  supplier: Supplier | null
  products: Product[]
}

async function persistManualEntry(params: PersistManualEntryParams) {
  const { tenantId, entryId, items, supplier, products } = params
  const total = items.reduce((sum, item) => sum + item.totalCost, 0)
  const now = new Date()
  const dateStr = `${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`

  const updatePromises = items.map((item) => {
    const existing = products.find((p) => p.id === item.productId)
    if (!existing) return Promise.resolve()
    const nextStock = (existing.stock ?? 0) + item.quantity
    return dal.products.update({
      ...existing,
      stock: nextStock,
      cost_price: item.costPrice,
      price: item.salePrice ?? existing.price,
      margin: item.margin ?? existing.margin,
      other_costs: item.otherCosts ?? existing.other_costs,
    })
  })

  await Promise.all(updatePromises)

  const entity: ManualStockEntryEntity = {
    id: entryId,
    company_id: tenantId,
    tenant_id: tenantId,
    date: dateStr,
    supplier_id: supplier?.id,
    supplier_name: supplier?.name || "Sem fornecedor informado",
    total,
    status: "Finalizado",
    items,
    created_at: now.toISOString(),
  }

  const existing = await dal.manualStockEntries.getById(entryId)
  if (existing) {
    await dal.manualStockEntries.update(entity)
  } else {
    await dal.manualStockEntries.create(entity)
  }
}

function NovoEntryView({
  selectedSupplier,
  items,
  totalCost,
  products,
  tenantId,
  isQuickRegisterOpen,
  setIsQuickRegisterOpen,
  quickProdForm,
  setQuickProdForm,
  onOpenSupplierSelection,
  onOpenGroupSelection,
  onOpenSubgroupSelection,
  onOpenUnitSelection,
  onRemoveItem,
  onGoToCosts,
  onAddItem,
}: {
  selectedSupplier: Supplier | null
  items: ManualStockEntryItem[]
  totalCost: number
  products: Product[]
  tenantId: string
  isQuickRegisterOpen: boolean
  setIsQuickRegisterOpen: (v: boolean) => void
  quickProdForm: QuickProductFormState
  setQuickProdForm: React.Dispatch<React.SetStateAction<QuickProductFormState>>
  onOpenSupplierSelection: () => void
  onOpenGroupSelection: () => void
  onOpenSubgroupSelection: () => void
  onOpenUnitSelection: () => void
  onRemoveItem: (idx: number) => void
  onGoToCosts: () => void
  onAddItem: (it: ManualStockEntryItem) => void
}) {
  return (
    <Stack direction="col" mobileDirection="row" gap={5} w="full" h="full" align="stretch" flex="1" minH="0">
      <Box order="2" mdOrder="1" mdFlex="1" position="relative" display="flex" direction="col" justify="between" h="full" w="full">
        <NovoEntryLeftColumn
          selectedSupplier={selectedSupplier}
          items={items}
          totalCost={totalCost}
          products={products}
          onOpenSupplierSelection={onOpenSupplierSelection}
          onRemoveItem={onRemoveItem}
          onGoToCosts={onGoToCosts}
        />
      </Box>
      <Box order="1" mdOrder="2" mdFlex="1" position="relative" w="full">
        <NovoEntryProductForm
          products={products}
          tenantId={tenantId}
          isQuickRegisterOpen={isQuickRegisterOpen}
          setIsQuickRegisterOpen={setIsQuickRegisterOpen}
          quickProdForm={quickProdForm}
          setQuickProdForm={setQuickProdForm}
          onOpenGroupSelection={onOpenGroupSelection}
          onOpenSubgroupSelection={onOpenSubgroupSelection}
          onOpenUnitSelection={onOpenUnitSelection}
          onAddItem={onAddItem}
        />
      </Box>
    </Stack>
  )
}

interface ManualStockSubViewRouterProps {
  mode: ManualEntryMode
  setMode: (m: ManualEntryMode) => void
  setIsQuickRegisterOpen: (v: boolean) => void
  setQuickProdForm: React.Dispatch<React.SetStateAction<QuickProductFormState>>
  setSelectedSupplier: (s: Supplier | null) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function renderManualStockSubView(props: ManualStockSubViewRouterProps) {
  const {
    mode, setMode, setIsQuickRegisterOpen, setQuickProdForm, setSelectedSupplier,
    setCustomBack, setCustomTitle, setCustomActions,
  } = props

  if (mode === "select_supplier") {
    return (
      <FornecedoresSection
        onCancel={() => setMode("novo")}
        onSelectSupplier={(s: { id?: string; name: string }) => { setSelectedSupplier(s as Supplier); setMode("novo") }}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
      />
    )
  }
  if (mode === "select_group") {
    return (
      <GruposSubgruposSection
        onCancel={() => { setIsQuickRegisterOpen(true); setMode("novo") }}
        onSelectGroup={(g: { id?: string; name: string }) => { setQuickProdForm((p) => ({ ...p, group: g.name })); setIsQuickRegisterOpen(true); setMode("novo") }}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
      />
    )
  }
  if (mode === "select_subgroup") {
    return (
      <GruposSubgruposSection
        onCancel={() => { setIsQuickRegisterOpen(true); setMode("novo") }}
        onSelectSubgroup={(sub: string, g: { id?: string; name: string }) => { setQuickProdForm((p) => ({ ...p, subgroup: sub, group: p.group || g.name })); setIsQuickRegisterOpen(true); setMode("novo") }}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
      />
    )
  }
  if (mode === "select_unit") {
    return (
      <UnidadesSection
        onCancel={() => { setIsQuickRegisterOpen(true); setMode("novo") }}
        onSelectUnit={(u: { id?: string; name: string }) => { setQuickProdForm((p) => ({ ...p, unit: u.name })); setIsQuickRegisterOpen(true); setMode("novo") }}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
      />
    )
  }
  return null
}

function useManualStockTableState(tenantId: string) {
  const rawProducts = useProducts(tenantId)
  const products = React.useMemo(() => (Array.isArray(rawProducts) ? rawProducts : []), [rawProducts])
  const rawEntries = useManualStockEntries(tenantId)
  const entries = React.useMemo(() => (Array.isArray(rawEntries) ? rawEntries : []), [rawEntries])

  const [mode, setMode] = React.useState<ManualEntryMode>("history")
  const [selectedSupplier, setSelectedSupplier] = React.useState<Supplier | null>(null)
  const [items, setItems] = React.useState<ManualStockEntryItem[]>([])
  const [supplierFilter, setSupplierFilter] = React.useState("")
  const [selectedPeriod, setSelectedPeriod] = React.useState("3M")
  const [startDate, setStartDate] = React.useState("23/05/2026 00:00")
  const [endDate, setEndDate] = React.useState("21/08/2026 23:59")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const [isQuickRegisterOpen, setIsQuickRegisterOpen] = React.useState(false)
  const [quickProdForm, setQuickProdForm] = React.useState<QuickProductFormState>({
    name: "", group: "", subgroup: "", unit: "UN", barcode: "", costPrice: "0,00", quantity: 0,
  })

  const [activeEntryId, setActiveEntryId] = React.useState<string | null>(null)

  const filteredEntries = React.useMemo(() => {
    if (!supplierFilter.trim()) return entries
    const q = supplierFilter.toLowerCase()
    return entries.filter((e) => (e.supplier_name || "").toLowerCase().includes(q))
  }, [entries, supplierFilter])

  const totalCost = React.useMemo(() => items.reduce((sum, it) => sum + it.totalCost, 0), [items])

  return {
    products, entries, filteredEntries, totalCost,
    mode, setMode, selectedSupplier, setSelectedSupplier,
    items, setItems, supplierFilter, setSupplierFilter,
    selectedPeriod, setSelectedPeriod, startDate, setStartDate,
    endDate, setEndDate, isFilterDrawerOpen, setIsFilterDrawerOpen,
    isDiscardModalOpen, setIsDiscardModalOpen,
    isQuickRegisterOpen, setIsQuickRegisterOpen,
    quickProdForm, setQuickProdForm,
    activeEntryId, setActiveEntryId,
  }
}

function ManualStockActiveView({
  s,
  tenantId,
  handleFinalize,
  onSelectEntry,
}: {
  s: ReturnType<typeof useManualStockTableState>
  tenantId: string
  handleFinalize: () => Promise<void>
  onSelectEntry: (entry: ManualStockEntryEntity) => void
}) {
  if (s.mode === "history") {
    return (
      <ManualEntryHistoryView
        entries={s.filteredEntries} supplierFilter={s.supplierFilter} setSupplierFilter={s.setSupplierFilter}
        selectedPeriod={s.selectedPeriod} onPeriodChange={s.setSelectedPeriod} startDate={s.startDate}
        setStartDate={s.setStartDate} endDate={s.endDate} setEndDate={s.setEndDate} isFilterDrawerOpen={s.isFilterDrawerOpen}
        onCloseFilterDrawer={() => s.setIsFilterDrawerOpen(false)} onOpenNovo={() => { s.setActiveEntryId(null); s.setItems([]); s.setSelectedSupplier(null); s.setMode("novo") }}
        onSelectEntry={onSelectEntry}
        onFilter={() => {}}
      />
    )
  }
  if (s.mode === "novo") {
    return (
      <NovoEntryView
        selectedSupplier={s.selectedSupplier} items={s.items} totalCost={s.totalCost} products={s.products}
        tenantId={tenantId} isQuickRegisterOpen={s.isQuickRegisterOpen} setIsQuickRegisterOpen={s.setIsQuickRegisterOpen}
        quickProdForm={s.quickProdForm} setQuickProdForm={s.setQuickProdForm}
        onOpenSupplierSelection={() => s.setMode("select_supplier")}
        onOpenGroupSelection={() => {
          s.setIsQuickRegisterOpen(false)
          setTimeout(() => s.setMode("select_group"), 50)
        }}
        onOpenSubgroupSelection={() => {
          s.setIsQuickRegisterOpen(false)
          setTimeout(() => s.setMode("select_subgroup"), 50)
        }}
        onOpenUnitSelection={() => {
          s.setIsQuickRegisterOpen(false)
          setTimeout(() => s.setMode("select_unit"), 50)
        }}
        onRemoveItem={(idx) => s.setItems((prev) => prev.filter((_, i) => i !== idx))}
        onGoToCosts={() => s.setMode("custos")} onAddItem={(it) => s.setItems((prev) => [...prev, it])}
      />
    )
  }
  if (s.mode === "custos") {
    return (
      <CostManagementView
        items={s.items}
        onUpdateItem={(idx, updated) => s.setItems((prev) => prev.map((it, i) => (i === idx ? updated : it)))}
        onFinalize={handleFinalize}
      />
    )
  }
  return null
}

interface ManualStockHandlersParams {
  s: ReturnType<typeof useManualStockTableState>
  tenantId: string
  onCancel: () => void
}

function useManualStockHandlers({ s, tenantId, onCancel }: ManualStockHandlersParams) {
  const isDirty = Boolean(s.items.length > 0 || s.selectedSupplier !== null)

  const handleRequestBack = React.useCallback(() => {
    if (s.mode === "custos") {
      s.setMode("novo")
    } else if (s.mode === "novo") {
      if (isDirty) {
        s.setIsDiscardModalOpen(true)
      } else {
        s.setMode("history")
      }
    } else {
      onCancel()
    }
  }, [s, isDirty, onCancel])

  const handleConfirmDiscard = React.useCallback(() => {
    s.setIsDiscardModalOpen(false)
    s.setItems([])
    s.setSelectedSupplier(null)
    s.setActiveEntryId(null)
    s.setMode("history")
  }, [s])

  const handleFinalize = async () => {
    if (s.items.length === 0) return
    const entryId = s.activeEntryId || `entry-${Date.now()}`
    await persistManualEntry({ tenantId, entryId, items: s.items, supplier: s.selectedSupplier, products: s.products })
    s.setIsDiscardModalOpen(false)
    s.setItems([])
    s.setSelectedSupplier(null)
    s.setActiveEntryId(null)
    s.setMode("history")
  }

  const handleSelectEntry = (entry: ManualStockEntryEntity) => {
    s.setActiveEntryId(entry.id)
    s.setItems(entry.items || [])
    s.setSelectedSupplier(
      entry.supplier_id
        ? {
            id: entry.supplier_id,
            name: entry.supplier_name || "",
            company_id: tenantId,
            document: "",
          }
        : null
    )
    s.setMode("novo")
  }

  return {
    handleRequestBack,
    handleConfirmDiscard,
    handleFinalize,
    handleSelectEntry,
  }
}

export function ManualStockEntriesTable({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}: ManualStockEntriesTableProps) {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "11111111-1111-1111-1111-111111111111"
  const s = useManualStockTableState(tenantId)

  const {
    handleRequestBack,
    handleConfirmDiscard,
    handleFinalize,
    handleSelectEntry,
  } = useManualStockHandlers({ s, tenantId, onCancel })

  useManualStockSyncHeader({
    mode: s.mode,
    handleRequestBack,
    setIsFilterDrawerOpen: s.setIsFilterDrawerOpen,
    setCustomBack,
    setCustomTitle,
    setCustomActions,
  })

  const subView = renderManualStockSubView({
    mode: s.mode, setMode: s.setMode, setIsQuickRegisterOpen: s.setIsQuickRegisterOpen,
    setQuickProdForm: s.setQuickProdForm, setSelectedSupplier: s.setSelectedSupplier,
    setCustomBack, setCustomTitle, setCustomActions,
  })
  if (subView) return subView

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <ManualStockActiveView s={s} tenantId={tenantId} handleFinalize={handleFinalize} onSelectEntry={handleSelectEntry} />
      <DiscardChangesModal
        isOpen={s.isDiscardModalOpen}
        onClose={() => s.setIsDiscardModalOpen(false)}
        onConfirmDiscard={handleConfirmDiscard}
      />
    </Box>
  )
}
