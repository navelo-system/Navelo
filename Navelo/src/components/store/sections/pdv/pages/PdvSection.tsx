"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Button } from "@/components/store/base/Button"
import { PdvCatalogToolbar, MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { Menu } from "lucide-react"
import { ViewTransition } from "@/components/store/base/ViewTransition"
import { ExitConfirmModal } from "@/components/store/sections/pdv/modals/ExitConfirmModal"
import { PdvCartDrawer } from "@/components/store/sections/pdv/modals/PdvCartDrawer"

import { PdvCatalog, MockProduct } from "@/components/store/advanced/PdvCatalog"
import { PdvCheckoutPayment } from "@/components/store/advanced/PdvCheckoutPayment"
import { PdvCheckoutReceipt } from "@/components/store/advanced/PdvCheckoutReceipt"
import { PdvCheckoutSidebar } from "@/components/store/advanced/PdvCheckoutSidebar"
import { PdvModals } from "@/components/store/advanced/PdvModals"

import { NegociacoesSection } from "@/components/store/sections/pdv/pages/NegociacoesSection"
import { ClientesSection } from "@/components/store/sections/pdv/pages/ClientesSection"
import { DevolucaoSection } from "@/components/store/sections/pdv/pages/DevolucaoSection"
import { TotaisEmCaixaSection } from "@/components/store/sections/pdv/pages/TotaisEmCaixaSection"
import { ContasAReceberSection } from "@/components/store/sections/pdv/pages/ContasAReceberSection"
import { PdvObservacaoModal } from "@/components/store/sections/pdv/modals/PdvObservacaoModal"
import { PdvSangriaModal } from "@/components/store/sections/pdv/modals/PdvSangriaModal"
import { SaleSuccessModal } from "@/components/store/sections/pdv/modals/SaleSuccessModal"
import { maskCurrency } from "@/lib/masks"

import { DeliveryClientInfo, DeliveryCheckoutConfirmation, DeliveryType, PaymentMoment } from "@/components/store/advanced/DeliveryCheckoutConfirmation"
import { UI_STRINGS } from "@/constants/strings"
import { DeliveryRatesScreen } from "@/components/store/advanced/DeliveryRatesScreen"
import { DeliveryRidersScreen } from "@/components/store/advanced/DeliveryRidersScreen"
import { Rider, DeliveryRate, useProducts, useCategories, useTabs, useDeliveryOrders, dal, db, Tab, DeliveryOrder, Product, Category } from "@/lib/dal"
import { useLiveQuery } from "dexie-react-hooks"
import { generateSaleReceiptPdf, sanitizeSaleFileName } from "@/lib/pdf/generateSaleReceipt"
import { useTenant } from "@/lib/context/TenantContext"

export interface CartItemType {
  id: string
  name: string
  quantity: number
  unitPrice: number
  image?: string
  stock?: number
  category?: string
}

export interface DeliveryOrderPayload {
  client: DeliveryClientInfo
  status: string
  deliveryType: DeliveryType
  paymentMoment: PaymentMoment
  items: CartItemType[]
  total: number
  subtotal: number
  discount: number
}

export interface DeliveryContextData {
  client: DeliveryClientInfo
  onConfirmDelivery: (orderData: DeliveryOrderPayload) => void
  onAlterClient?: () => void
  initialItems?: CartItemType[]
  initialDiscount?: number
  isEditing?: boolean
  onSaveEdits?: (items: CartItemType[], subtotal: number, discount: number, total: number) => void
}

interface PdvSectionProps {
  onBackToDashboard: () => void
  activeComandaId?: string | null
  onCloseComanda?: (id: string) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  setCustomTitle?: (title: string | null) => void
  deliveryContext?: DeliveryContextData | null
}

export type PdvSubView = "none" | "negociacoes" | "clientes" | "devolucao" | "totais-em-caixa" | "recebimentos" | "sangrias-suprimentos" | "rates-screen" | "riders-screen"

interface StockCommittedItem {
  id?: string
  productId?: string
  quantity?: number
}

function parseItemsList(items: unknown): unknown[] {
  if (Array.isArray(items)) return items
  if (typeof items !== "string") return []
  try {
    const parsed = JSON.parse(items)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function countItemInList(items: unknown, productId: string): number {
  const list = parseItemsList(items)
  let count = 0
  for (const item of list as StockCommittedItem[]) {
    const pId = item?.id || item?.productId
    if (pId === productId && typeof item?.quantity === "number") {
      count += item.quantity
    }
  }
  return count
}

function countCommittedFromTabs(
  dbTabs: Tab[] | undefined,
  activeComandaId: string | null | undefined,
  productId: string
): number {
  if (!Array.isArray(dbTabs)) return 0
  const batchIds = activeComandaId?.startsWith("batch:")
    ? activeComandaId.replace("batch:", "").split(",")
    : []
  let count = 0
  for (const tab of dbTabs) {
    const isCurrentTab = tab.id === activeComandaId || batchIds.includes(tab.id)
    if (tab.status === "OPEN" && !isCurrentTab) {
      count += countItemInList(tab.items, productId)
    }
  }
  return count
}

function countCommittedFromOrders(
  dbDeliveryOrders: DeliveryOrder[] | undefined,
  productId: string
): number {
  if (!Array.isArray(dbDeliveryOrders)) return 0
  let count = 0
  for (const order of dbDeliveryOrders) {
    if (order.status !== "delivered") {
      count += countItemInList(order.items, productId)
    }
  }
  return count
}

function useCommittedStockCalculator(
  dbTabs: Tab[] | undefined,
  dbDeliveryOrders: DeliveryOrder[] | undefined,
  activeComandaId?: string | null
) {
  const getCommittedStock = React.useCallback(
    (productId: string): number => {
      const fromTabs = countCommittedFromTabs(dbTabs, activeComandaId, productId)
      const fromOrders = countCommittedFromOrders(dbDeliveryOrders, productId)
      return fromTabs + fromOrders
    },
    [dbTabs, dbDeliveryOrders, activeComandaId]
  )

  const getEffectiveAvailableStock = React.useCallback(
    (productId: string, rawStock?: number) => {
      if (rawStock === undefined) return Infinity
      const committed = getCommittedStock(productId)
      return Math.max(0, rawStock - committed)
    },
    [getCommittedStock]
  )

  return { getEffectiveAvailableStock }
}

function resolveProductCategoryName(p: Product, categoryMap: Map<string, string>): string {
  if (p.category_id) {
    const match = categoryMap.get(p.category_id)
    if (match) return match
  }
  if (p.category) {
    const match = categoryMap.get(p.category.toLowerCase().trim())
    if (match) return match
    if (!p.category.includes("-")) return p.category.trim()
  }
  return "Geral"
}

function resolveProductBarcode(p: Product, idx: number): string {
  if (p.barcodes?.[0]) return p.barcodes[0]
  if (p.barcode) return p.barcode
  return `78900000000${idx}`
}

function mapProductToCatalog(
  p: Product,
  idx: number,
  categoryMap: Map<string, string>,
  getEffectiveAvailableStock: (id: string, stock?: number) => number
): MockProduct {
  const groupName = resolveProductCategoryName(p, categoryMap)
  const subgroupName = p.subgroup?.trim() || undefined
  const effectiveStock = getEffectiveAvailableStock(p.id, p.stock)
  const barcode = resolveProductBarcode(p, idx)

  return {
    id: p.id,
    name: p.name,
    category: groupName,
    subgroup: subgroupName,
    unitPrice: p.price || 0,
    unit: p.unit || "UN",
    stock: effectiveStock !== Infinity ? effectiveStock : (p.stock ?? 0),
    barcode,
    image: p.image_url || "",
  }
}

function usePdvCatalogData(
  dbProducts: Product[] | undefined,
  dbCategories: Category[] | undefined,
  getEffectiveAvailableStock: (id: string, stock?: number) => number
) {
  const categoryMap = React.useMemo(() => {
    const map = new Map<string, string>()
    if (dbCategories) {
      dbCategories.forEach((cat: Category) => {
        if (cat.name) {
          if (cat.id) map.set(cat.id, cat.name)
          map.set(cat.name.toLowerCase(), cat.name)
        }
      })
    }
    return map
  }, [dbCategories])

  const catalogProducts: MockProduct[] = React.useMemo(() => {
    if (!dbProducts || dbProducts.length === 0) return []
    return dbProducts.map((p: Product, idx: number) =>
      mapProductToCatalog(p, idx, categoryMap, getEffectiveAvailableStock)
    )
  }, [dbProducts, categoryMap, getEffectiveAvailableStock])

  return { catalogProducts }
}

function duplicateSingleCartItem(next: CartItemType[], item: CartItemType, catalogProducts: MockProduct[]) {
  if (!item.id) return
  const catalogItem = catalogProducts.find((p) => p.id === item.id)
  const effectiveStock = catalogItem?.stock
  const currentQty = next.find((c) => c.id === item.id)?.quantity ?? 0
  const available = effectiveStock === undefined || effectiveStock === Infinity
    ? item.quantity
    : Math.max(0, effectiveStock - currentQty)
  const qtyToAdd = Math.min(item.quantity, available)
  if (qtyToAdd <= 0) return

  const existingIdx = next.findIndex((c) => c.id === item.id)
  if (existingIdx >= 0) {
    next[existingIdx] = { ...next[existingIdx], quantity: next[existingIdx].quantity + qtyToAdd }
  } else {
    next.push({ id: item.id, name: item.name, quantity: qtyToAdd, unitPrice: item.unitPrice, image: item.image, stock: effectiveStock })
  }
}

function usePdvCartManager(
  catalogProducts: MockProduct[],
  initialItems?: CartItemType[]
) {
  const [cartItems, setCartItems] = React.useState<CartItemType[]>(initialItems || [])
  const [quantityMultiplier, setQuantityMultiplier] = React.useState(1)

  const enrichedCartItems: CartItemType[] = React.useMemo(() => {
    return cartItems.map((item) => {
      const catalogItem = catalogProducts.find((p) => p.id === item.id)
      return { ...item, stock: catalogItem?.stock ?? item.stock }
    })
  }, [cartItems, catalogProducts])

  const handleAddProduct = (prod: MockProduct) => {
    const catalogItem = catalogProducts.find((p) => p.id === prod.id)
    const effectiveStock = catalogItem?.stock ?? prod.stock

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === prod.id)
      const currentQty = existing ? existing.quantity : 0
      const newQty = currentQty + quantityMultiplier
      if (effectiveStock !== undefined && effectiveStock !== Infinity && newQty > effectiveStock) {
        return prev
      }
      if (existing) {
        return prev.map((item) =>
          item.id === prod.id ? { ...item, quantity: item.quantity + quantityMultiplier } : item
        )
      }
      return [...prev, { id: prod.id, name: prod.name, quantity: quantityMultiplier, unitPrice: prod.unitPrice, image: prod.image, stock: effectiveStock }]
    })
    setQuantityMultiplier(1)
  }

  const handleIncrease = (id: string) => {
    const catalogItem = catalogProducts.find((p) => p.id === id)
    const effectiveStock = catalogItem?.stock
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (effectiveStock !== undefined && effectiveStock !== Infinity && item.quantity + 1 > effectiveStock) {
            return item
          }
          return { ...item, quantity: item.quantity + 1 }
        }
        return item
      })
    )
  }

  const handleDecrease = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleDuplicateToCart = React.useCallback(
    (items: CartItemType[]) => {
      setCartItems((prev) => {
        const next = [...prev]
        items.forEach((item) => duplicateSingleCartItem(next, item, catalogProducts))
        return next
      })
    },
    [catalogProducts]
  )

  return {
    cartItems, setCartItems, enrichedCartItems,
    handleAddProduct, handleIncrease, handleDecrease, handleRemove, handleDuplicateToCart,
  }
}

function PdvSubViewRouter({
  subView, setSubView, setCustomBack, setCustomTitle, setCustomActions,
  negociacoesClientFilter, setNegociacoesClientFilter, isSelectingClientForNegociacoes,
  setIsSelectingClientForNegociacoes, setSelectedCustomerName, handleDuplicateToCart,
  setSelectedRate, setSelectedRider,
}: {
  subView: PdvSubView
  setSubView: (v: PdvSubView) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  negociacoesClientFilter: string | null
  setNegociacoesClientFilter: (v: string | null) => void
  isSelectingClientForNegociacoes: boolean
  setIsSelectingClientForNegociacoes: (v: boolean) => void
  setSelectedCustomerName: (v: string | null) => void
  handleDuplicateToCart: (items: CartItemType[]) => void
  setSelectedRate: (r: DeliveryRate | null) => void
  setSelectedRider: (r: Rider | null) => void
}) {
  if (subView === "negociacoes") {
    return (
      <NegociacoesSection
        setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions}
        onBack={() => { setNegociacoesClientFilter(null); setSubView("none") }}
        initialClientFilter={negociacoesClientFilter || undefined}
        onDuplicateToCart={(items) => { handleDuplicateToCart(items); setNegociacoesClientFilter(null); setSubView("none") }}
      />
    )
  }
  if (subView === "clientes") {
    return (
      <ClientesSection
        setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions}
        onBack={() => { setIsSelectingClientForNegociacoes(false); setSubView("none") }}
        onSelectClient={(client) => {
          setSelectedCustomerName(client.name)
          if (isSelectingClientForNegociacoes) {
            setIsSelectingClientForNegociacoes(false); setNegociacoesClientFilter(client.name); setSubView("negociacoes")
          } else {
            setSubView("none")
          }
        }}
      />
    )
  }
  if (subView === "devolucao") return <DevolucaoSection setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} onBack={() => setSubView("none")} />
  if (subView === "totais-em-caixa") return <TotaisEmCaixaSection setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} onBack={() => setSubView("none")} />
  if (subView === "recebimentos") return <ContasAReceberSection onBackToDashboard={() => setSubView("none")} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} />
  if (subView === "sangrias-suprimentos") return <NegociacoesSection title={UI_STRINGS.sangrias.sectionTitle} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} onBack={() => setSubView("none")} />
  if (subView === "rates-screen") return <DeliveryRatesScreen setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} onBack={() => setSubView("none")} onSelectRate={(r) => { setSelectedRate(r); setSubView("none") }} />
  if (subView === "riders-screen") return <DeliveryRidersScreen setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions} onBack={() => setSubView("none")} onSelectRider={(r) => { setSelectedRider(r); setSubView("none") }} />
  return null
}

async function updateProductStocks(cartItems: CartItemType[]) {
  const promises = cartItems.map(async (item: CartItemType) => {
    const dbProduct = await dal.products.getById(item.id)
    if (dbProduct) {
      const currentStock = dbProduct.stock ?? 0
      const newStock = Math.max(0, currentStock - item.quantity)
      await dal.products.update({ ...dbProduct, stock: newStock })
    }
  })
  await Promise.all(promises)
}

interface UploadSaleReceiptPdfOptions {
  saleId: string
  saleNum: string
  total: number
  subtotal: number
  discount: number
  paymentMethodsStr: string
  customerName?: string
  createdAt: string
  cartItems: CartItemType[]
  companyData: unknown
  tenantId: string
}

async function uploadSaleReceiptPdf(opts: UploadSaleReceiptPdfOptions) {
  const { saleId, saleNum, total, subtotal, discount, paymentMethodsStr, customerName, createdAt, cartItems, companyData, tenantId } = opts
  try {
    const saleReceiptData = {
      id: saleId, saleCode: `#${saleNum}`, total, subtotal, discount,
      payment_method: paymentMethodsStr, customer_name: customerName, created_at: createdAt,
      items: cartItems.map((item) => ({ name: item.name, quantity: item.quantity, unitPrice: item.unitPrice, total_price: item.quantity * item.unitPrice })),
    }
    const { base64 } = await generateSaleReceiptPdf(saleReceiptData, companyData as Parameters<typeof generateSaleReceiptPdf>[1])
    const cleanName = sanitizeSaleFileName(`Negociacao_${saleNum}_${saleId}`)
    const fileName = `${cleanName}.pdf`
    const response = await fetch("/api/upload-receipt", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdfBase64: base64, fileName, tenantId }),
    })
    if (response.ok) {
      const res = (await response.json()) as { publicUrl?: string }
      return res.publicUrl || null
    }
  } catch {
    // Offline or network fallback
  }
  return null
}

function resolveComandaTitle(activeComandaId: string, dbTabs?: Tab[]): string {
  if (activeComandaId.startsWith("batch:")) return "Finalizar Atendimentos"
  if (activeComandaId.startsWith("avulso-") || !Array.isArray(dbTabs)) return "Nao selecionado"
  const activeTab = dbTabs.find((t) => t.id === activeComandaId)
  if (!activeTab) return "Nao selecionado"
  return activeTab.customer_name || activeTab.label || (activeTab.code ? `Comanda #${activeTab.code}` : "Nao selecionado")
}

function resolveActiveClientOrTitle(
  deliveryClientName?: string,
  activeComandaId?: string | null,
  dbTabs?: Tab[],
  selectedCustomerName?: string | null
): string {
  if (deliveryClientName) return deliveryClientName
  if (activeComandaId) return resolveComandaTitle(activeComandaId, dbTabs)
  if (selectedCustomerName) return selectedCustomerName
  return "Nao selecionado"
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

interface PdvHeaderSyncParams {
  step: "negociacao" | "pagamento" | "recibo" | "delivery-confirm"
  subView: PdvSubView
  cartItemsLength: number
  activeClientOrTitle: string
  searchQuery: string
  setSearchQuery: (q: string) => void
  onBackToDashboardRef: React.MutableRefObject<() => void>
  setIsExitConfirmOpen: (v: boolean) => void
  setIsSidebarOpen: (v: boolean) => void
  setIsDiscountModalOpen: (v: boolean) => void
  setStep: (s: "negociacao" | "pagamento" | "recibo" | "delivery-confirm") => void
  setExitConfirmMode?: (mode: "save-and-exit" | "cancel-operation") => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function usePdvHeaderSync(params: PdvHeaderSyncParams) {
  const {
    step, subView, cartItemsLength, activeClientOrTitle, searchQuery,
    setSearchQuery, onBackToDashboardRef, setIsExitConfirmOpen, setIsSidebarOpen,
    setIsDiscountModalOpen, setStep, setExitConfirmMode, setCustomBack, setCustomTitle, setCustomActions,
  } = params

  React.useEffect(() => {
    if (subView !== "none") return
    const title = activeClientOrTitle === "Nao selecionado" || !activeClientOrTitle ? "Caixa" : activeClientOrTitle
    setCustomTitle?.(title)

    if (step === "negociacao") {
      setCustomBack?.(() => () => {
        setExitConfirmMode?.("save-and-exit")
        if (cartItemsLength === 0) onBackToDashboardRef.current(); else setIsExitConfirmOpen(true)
      })
      return
    }
    if (step === "recibo") {
      setCustomBack?.(() => () => setStep("pagamento"))
      return
    }
    setCustomBack?.(() => () => setStep("negociacao"))
  }, [step, subView, setCustomBack, setCustomTitle, cartItemsLength, activeClientOrTitle, onBackToDashboardRef, setIsExitConfirmOpen, setStep, setExitConfirmMode])

  React.useEffect(() => {
    if (subView !== "none") return
    if (step === "negociacao") {
      setCustomActions?.(
        <MobileHeaderSearch searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} placeholder={UI_STRINGS.pdv.searchPlaceholder}>
          <Button variant="primary-pill-icon" icon={Menu} onClick={() => setIsSidebarOpen(true)} />
        </MobileHeaderSearch>
      )
      return
    }
    if (step === "pagamento") {
      setCustomActions?.(<Button variant="ghost-primary" label={UI_STRINGS.pdv.discountShortcutLabel} onClick={() => setIsDiscountModalOpen(true)} />)
      return
    }
    setCustomActions?.(null)
  }, [step, subView, searchQuery, setCustomActions, setIsSidebarOpen, setIsDiscountModalOpen, setSearchQuery])
}

function PdvCatalogLayout({
  searchQuery, setSearchQuery, viewMode, setViewModeState,
  setIsCartDrawerOpen, catalogProducts, handleAddProduct, activeCategory,
  setActiveCategory, filteredProducts, categories, enrichedCartItems,
  handleIncrease, handleDecrease, handleRemove, discount, total,
  onGoToPayment, activeComandaId, handleSaveComandaAndExit, deliveryContext,
  cartItems, subtotal,
}: {
  searchQuery: string; setSearchQuery: (q: string) => void
  viewMode: "grade" | "lista"; setViewModeState: (m: "grade" | "lista") => void
  setIsCartDrawerOpen: (v: boolean) => void
  catalogProducts: MockProduct[]; handleAddProduct: (p: MockProduct) => void
  activeCategory: string; setActiveCategory: (c: string) => void
  filteredProducts: MockProduct[]; categories: string[]
  enrichedCartItems: CartItemType[]
  handleIncrease: (id: string) => void; handleDecrease: (id: string) => void
  handleRemove: (id: string) => void; discount: number; total: number
  onGoToPayment: () => void; activeComandaId?: string | null
  handleSaveComandaAndExit: () => void; deliveryContext?: DeliveryContextData | null
  cartItems: CartItemType[]; subtotal: number
}) {
  return (
    <Stack gap={5} w="full" flex="1" minH="0">
      <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0">
        <Box display="flex" flex="1" w="full" direction="col" minH="0">
          <Stack gap={5} w="full" flex="1" minH="0" overflow="hidden">
            <Box w="full">
              <PdvCatalogToolbar
                searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} viewMode={viewMode} onViewModeChange={setViewModeState}
                onOpenCart={() => setIsCartDrawerOpen(true)}
                onBarcodeScanned={(code: string) => {
                  const prod = catalogProducts.find((p) => p.barcode === code || p.id === code)
                  if (prod) handleAddProduct(prod)
                }}
              />
            </Box>
            <PdvCatalog
              activeCategory={activeCategory} onActiveCategoryChange={setActiveCategory}
              filteredProducts={filteredProducts} onAddProduct={handleAddProduct}
              categories={categories} viewMode={viewMode} cartItems={enrichedCartItems}
              onIncrease={handleIncrease} onDecrease={handleDecrease} onRemove={handleRemove}
            />
            <Box display="block md:hidden" h="h-16" shrink="0" />
          </Stack>
        </Box>
        <Box display="hidden md:flex" w="1/4" direction="col" minH="0">
          <PdvCheckoutSidebar
            cartItems={enrichedCartItems} discount={discount} total={total} formatPrice={formatPrice}
            onIncrease={handleIncrease} onDecrease={handleDecrease} onRemove={handleRemove}
            onGoToPayment={onGoToPayment}
            onSaveComanda={activeComandaId ? handleSaveComandaAndExit : undefined}
            onSaveDeliveryOrder={deliveryContext?.isEditing && deliveryContext?.onSaveEdits ? () => deliveryContext.onSaveEdits?.(cartItems, subtotal, discount, total) : undefined}
            submitLabel={deliveryContext?.isEditing ? "Salvar alterações" : undefined}
          />
        </Box>
      </Stack>
    </Stack>
  )
}

function PdvCashModals({
  isObservationModalOpen, setIsObservationModalOpen, observationText,
  setObservationText, activeComandaId, isSangriaModalOpen, setIsSangriaModalOpen,
  sangriaModalMode, setPendingSangriaAmount, setSangriaModalMode,
  setIsSangriaObsModalOpen, isSangriaObsModalOpen, pendingSangriaAmount,
  handleSaveSangriaMovement, isSuccessModalOpen, setIsSuccessModalOpen, handleResetCaixaState,
  lastCompletedSaleData, setStep,
}: {
  isObservationModalOpen: boolean; setIsObservationModalOpen: (v: boolean) => void
  observationText: string; setObservationText: (o: string) => void
  activeComandaId?: string | null; isSangriaModalOpen: boolean; setIsSangriaModalOpen: (v: boolean) => void
  sangriaModalMode: "sangria" | "suprimento"; setPendingSangriaAmount: (a: number) => void
  setSangriaModalMode: (m: "sangria" | "suprimento") => void; setIsSangriaObsModalOpen: (v: boolean) => void
  isSangriaObsModalOpen: boolean; pendingSangriaAmount: number; handleSaveSangriaMovement: (obs: string) => void
  isSuccessModalOpen: boolean; setIsSuccessModalOpen: (v: boolean) => void; handleResetCaixaState: () => void
  lastCompletedSaleData: { total: number; change: number; paymentMethod: string; customerName: string } | null
  setStep: (s: "negociacao" | "pagamento" | "recibo" | "delivery-confirm") => void
}) {
  return (
    <>
      <PdvObservacaoModal
        isOpen={isObservationModalOpen} onClose={() => setIsObservationModalOpen(false)}
        initialObservation={observationText}
        onSaveObservation={async (obs: string) => {
          setObservationText(obs)
          if (activeComandaId && !activeComandaId.startsWith("avulso-")) {
            const existingTab = await db.tabs.get(activeComandaId)
            if (existingTab) await dal.tabs.update({ ...existingTab, observation: obs })
          }
        }}
      />
      <PdvSangriaModal
        isOpen={isSangriaModalOpen} onClose={() => setIsSangriaModalOpen(false)} mode={sangriaModalMode} cashAvailable={39.00}
        onConfirmSangria={(amount: number, mode: "sangria" | "suprimento") => { setPendingSangriaAmount(amount); setSangriaModalMode(mode); setIsSangriaModalOpen(false); setIsSangriaObsModalOpen(true) }}
      />
      <PdvObservacaoModal
        isOpen={isSangriaObsModalOpen} onClose={() => { setIsSangriaObsModalOpen(false); setPendingSangriaAmount(0) }}
        title={sangriaModalMode === "suprimento" ? "Suprimento" : "Sangria"}
        description={`Você está fazendo ${sangriaModalMode === "suprimento" ? "um suprimento" : "uma sangria"} de ${formatPrice(pendingSangriaAmount)}.`}
        placeholder={UI_STRINGS.common.observation} initialObservation="" onSaveObservation={handleSaveSangriaMovement}
      />
      <SaleSuccessModal
        isOpen={isSuccessModalOpen} onClose={handleResetCaixaState}
        total={lastCompletedSaleData?.total || 0} change={lastCompletedSaleData?.change || 0}
        paymentMethod={lastCompletedSaleData?.paymentMethod} customerName={lastCompletedSaleData?.customerName}
        formatPrice={formatPrice} onPrintReceipt={() => { setIsSuccessModalOpen(false); setStep("recibo") }}
      />
    </>
  )
}

interface PdvModalsManagerProps {
  isCartDrawerOpen: boolean; setIsCartDrawerOpen: (v: boolean) => void
  enrichedCartItems: CartItemType[]; discount: number; total: number
  handleIncrease: (id: string) => void; handleDecrease: (id: string) => void
  handleRemove: (id: string) => void; onGoToPayment: () => void
  activeComandaId?: string | null; handleSaveComandaAndExit: () => void
  isChangeModalOpen: boolean; setIsChangeModalOpen: (v: boolean) => void
  amountDue: number; setPayments: React.Dispatch<React.SetStateAction<{ method: string; amount: number }[]>>
  isCardModalOpen: boolean; setIsCardModalOpen: (v: boolean) => void
  handleLaunchPayment: (m: string, a: number) => void; isDiscountModalOpen: boolean
  setIsDiscountModalOpen: (v: boolean) => void; setDiscount: (d: number) => void
  isSidebarOpen: boolean; setIsSidebarOpen: (v: boolean) => void
  onBackToDashboard: () => void; launchAmount: number; subtotal: number
  handleSidebarNavigate: (v: "negociacoes" | "clientes" | "devolucao" | "totais-em-caixa" | "recebimentos" | "sangrias-suprimentos" | "ultimas-negociacoes") => void
  setIsObservationModalOpen: (v: boolean) => void; setSangriaModalMode: (m: "sangria" | "suprimento") => void
  setIsSangriaModalOpen: (v: boolean) => void; activeClientOrTitle: string
  showOutOfStockProducts: boolean; handleToggleShowOutOfStock: (v: boolean) => void
  cartItems: CartItemType[]; onBackToDashboardRef: React.MutableRefObject<() => void>
  setIsExitConfirmOpen: (v: boolean) => void; isObservationModalOpen: boolean
  observationText: string; setObservationText: (o: string) => void
  isSangriaModalOpen: boolean; sangriaModalMode: "sangria" | "suprimento"
  setPendingSangriaAmount: (a: number) => void; setIsSangriaObsModalOpen: (v: boolean) => void
  isSangriaObsModalOpen: boolean; pendingSangriaAmount: number
  handleSaveSangriaMovement: (obs: string) => void; isSuccessModalOpen: boolean
  setIsSuccessModalOpen: (v: boolean) => void; handleResetCaixaState: () => void
  lastCompletedSaleData: { total: number; change: number; paymentMethod: string; customerName: string } | null
  setStep: (s: "negociacao" | "pagamento" | "recibo" | "delivery-confirm") => void
  onCancelOperationClick?: () => void
}

function PdvModalsManager({
  isCartDrawerOpen, setIsCartDrawerOpen, enrichedCartItems, discount, total,
  handleIncrease, handleDecrease, handleRemove, onGoToPayment, activeComandaId,
  handleSaveComandaAndExit, isChangeModalOpen, setIsChangeModalOpen, amountDue,
  setPayments, isCardModalOpen, setIsCardModalOpen, handleLaunchPayment,
  isDiscountModalOpen, setIsDiscountModalOpen, setDiscount, isSidebarOpen,
  setIsSidebarOpen, onBackToDashboard, launchAmount, subtotal, handleSidebarNavigate,
  setIsObservationModalOpen, setSangriaModalMode, setIsSangriaModalOpen,
  activeClientOrTitle, showOutOfStockProducts, handleToggleShowOutOfStock,
  cartItems, onBackToDashboardRef, setIsExitConfirmOpen, isObservationModalOpen,
  observationText, setObservationText, isSangriaModalOpen, sangriaModalMode,
  setPendingSangriaAmount, setIsSangriaObsModalOpen, isSangriaObsModalOpen,
  pendingSangriaAmount, handleSaveSangriaMovement, isSuccessModalOpen,
  setIsSuccessModalOpen, handleResetCaixaState, lastCompletedSaleData, setStep,
  onCancelOperationClick,
}: PdvModalsManagerProps) {
  return (
    <>
      <PdvCartDrawer
        isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)}
        cartItems={enrichedCartItems} discount={discount} total={total} formatPrice={formatPrice}
        onIncrease={handleIncrease} onDecrease={handleDecrease} onRemove={handleRemove}
        onGoToPayment={onGoToPayment} onSaveComanda={activeComandaId ? handleSaveComandaAndExit : undefined}
      />
      <PdvModals
        isChangeModalOpen={isChangeModalOpen} onCloseChangeModal={() => setIsChangeModalOpen(false)}
        amountDue={amountDue} onConfirmChangePayment={(amount: number) => { setPayments((prev) => [...prev, { method: "Dinheiro", amount }]); setIsChangeModalOpen(false) }}
        isCardModalOpen={isCardModalOpen} onCloseCardModal={() => setIsCardModalOpen(false)}
        formatPrice={formatPrice} onLaunchPayment={handleLaunchPayment}
        isDiscountModalOpen={isDiscountModalOpen} onCloseDiscountModal={() => setIsDiscountModalOpen(false)}
        onOpenDiscountModal={() => setIsDiscountModalOpen(true)} discount={discount} onChangeDiscount={setDiscount}
        isSidebarOpen={isSidebarOpen} onCloseSidebar={() => setIsSidebarOpen(false)} onBackToDashboard={onBackToDashboard}
        launchAmount={launchAmount} subtotal={subtotal} onNavigate={handleSidebarNavigate}
        onOpenObservationModal={() => setIsObservationModalOpen(true)}
        onOpenSangriaModal={(mode = "sangria") => { setSangriaModalMode(mode); setIsSangriaModalOpen(true) }}
        customerName={activeClientOrTitle}
        observationText={observationText}
        showOutOfStockProducts={showOutOfStockProducts}
        onToggleShowOutOfStock={handleToggleShowOutOfStock}
        hasCartItems={cartItems.length > 0}
        onCancelOperation={onCancelOperationClick || (() => { setIsSidebarOpen(false); if (cartItems.length === 0) onBackToDashboardRef.current(); else setIsExitConfirmOpen(true) })}
      />
      <PdvCashModals
        isObservationModalOpen={isObservationModalOpen} setIsObservationModalOpen={setIsObservationModalOpen}
        observationText={observationText} setObservationText={setObservationText} activeComandaId={activeComandaId}
        isSangriaModalOpen={isSangriaModalOpen} setIsSangriaModalOpen={setIsSangriaModalOpen}
        sangriaModalMode={sangriaModalMode} setPendingSangriaAmount={setPendingSangriaAmount}
        setSangriaModalMode={setSangriaModalMode} setIsSangriaObsModalOpen={setIsSangriaObsModalOpen}
        isSangriaObsModalOpen={isSangriaObsModalOpen} pendingSangriaAmount={pendingSangriaAmount}
        handleSaveSangriaMovement={handleSaveSangriaMovement} isSuccessModalOpen={isSuccessModalOpen}
        setIsSuccessModalOpen={setIsSuccessModalOpen} handleResetCaixaState={handleResetCaixaState}
        lastCompletedSaleData={lastCompletedSaleData} setStep={setStep}
      />
    </>
  )
}

function usePdvCatalogState(
  catalogProducts: MockProduct[],
  categories: string[]
) {
  const [activeCategory, setActiveCategory] = React.useState("Todos")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewModeState] = React.useState<"grade" | "lista">("grade")

  const effectiveCategory = activeCategory !== "Todos" && !categories.includes(activeCategory) ? "Todos" : activeCategory
  const filteredProducts = React.useMemo(() => {
    return catalogProducts.filter((prod: MockProduct) => {
      const matchesFilter = effectiveCategory === "Todos" || prod.category.toLowerCase() === effectiveCategory.toLowerCase() || (prod.subgroup && prod.subgroup.toLowerCase() === effectiveCategory.toLowerCase())
      return matchesFilter && prod.name.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [catalogProducts, effectiveCategory, searchQuery])

  return { activeCategory, setActiveCategory, searchQuery, setSearchQuery, viewMode, setViewModeState, filteredProducts }
}

function applyActiveTabState(
  activeTab: Tab,
  setCartItems: React.Dispatch<React.SetStateAction<CartItemType[]>>,
  setObservationText: React.Dispatch<React.SetStateAction<string>>
) {
  if (Array.isArray(activeTab.items)) {
    setCartItems(activeTab.items as unknown as CartItemType[])
  }
  setObservationText((activeTab as unknown as { observation?: string }).observation || "")
}

interface PdvComandaTabSyncOptions {
  activeComandaId: string | null | undefined
  dbTabs: Tab[] | undefined
  setCartItems: React.Dispatch<React.SetStateAction<CartItemType[]>>
  setObservationText: React.Dispatch<React.SetStateAction<string>>
  setStep?: (step: "negociacao" | "pagamento" | "recibo" | "delivery-confirm") => void
}

function mergeBatchCart(tabs: Tab[]): CartItemType[] {
  const mergedCart: CartItemType[] = []
  tabs.forEach((tab) => {
    if (Array.isArray(tab.items)) {
      (tab.items as unknown as CartItemType[]).forEach((item) => {
        if (!item?.id) return
        const existing = mergedCart.find((m) => m.id === item.id)
        if (existing) {
          existing.quantity += item.quantity
        } else {
          mergedCart.push({ ...item })
        }
      })
    }
  })
  return mergedCart
}

function usePdvComandaTabSync(opts: PdvComandaTabSyncOptions) {
  const { activeComandaId, dbTabs, setCartItems, setObservationText, setStep } = opts
  const syncedRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!activeComandaId || activeComandaId.startsWith("avulso-") || !Array.isArray(dbTabs) || dbTabs.length === 0) {
      return
    }
    if (syncedRef.current === activeComandaId) return

    if (activeComandaId.startsWith("batch:")) {
      const ids = activeComandaId.replace("batch:", "").split(",")
      const selectedTabs = dbTabs.filter((t: Tab) => ids.includes(t.id))
      const mergedCart = mergeBatchCart(selectedTabs)
      setCartItems(mergedCart)
      setStep?.("pagamento")
      syncedRef.current = activeComandaId
      return
    }

    const activeTab = dbTabs.find((t: Tab) => t.id === activeComandaId)
    if (activeTab) {
      applyActiveTabState(activeTab, setCartItems, setObservationText)
      syncedRef.current = activeComandaId
    }
  }, [activeComandaId, dbTabs, setCartItems, setObservationText, setStep])
}

function PdvStepContentRouter({
  step, setStep, deliveryContext, searchQuery, setSearchQuery, viewMode, setViewModeState,
  setIsCartDrawerOpen, catalogProducts, handleAddProduct, activeCategory, setActiveCategory,
  filteredProducts, categories, enrichedCartItems, handleIncrease, handleDecrease, handleRemove,
  discount, total, onGoToPayment, activeComandaId, handleSaveComandaAndExit, cartItems,
  subtotal, selectedRider, selectedRate, setSubView, setSelectedRider, setSelectedRate,
  setPendingDeliveryData, payments, totalPaid, amountDue, setIsDiscountModalOpen,
  handleLaunchPayment, handleRemovePayment, handleEditPayment, setIsChangeModalOpen,
  setIsCardModalOpen, handleFinalizeSale, paymentAmountInput, setPaymentAmountInput, launchAmount,
}: {
  step: "negociacao" | "pagamento" | "recibo" | "delivery-confirm"
  setStep: (s: "negociacao" | "pagamento" | "recibo" | "delivery-confirm") => void
  deliveryContext?: DeliveryContextData | null; searchQuery: string; setSearchQuery: (q: string) => void
  viewMode: "grade" | "lista"; setViewModeState: (m: "grade" | "lista") => void
  setIsCartDrawerOpen: (v: boolean) => void; catalogProducts: MockProduct[]
  handleAddProduct: (p: MockProduct) => void; activeCategory: string; setActiveCategory: (c: string) => void
  filteredProducts: MockProduct[]; categories: string[]
  enrichedCartItems: CartItemType[]; handleIncrease: (id: string) => void
  handleDecrease: (id: string) => void; handleRemove: (id: string) => void
  discount: number; total: number; onGoToPayment: () => void
  activeComandaId?: string | null; handleSaveComandaAndExit: () => void
  cartItems: CartItemType[]; subtotal: number
  selectedRider: Rider | null; selectedRate: DeliveryRate | null
  setSubView: (v: PdvSubView) => void; setSelectedRider: (r: Rider | null) => void
  setSelectedRate: (r: DeliveryRate | null) => void
  setPendingDeliveryData: (p: DeliveryOrderPayload | null) => void
  payments: { method: string; amount: number }[]; totalPaid: number
  amountDue: number; setIsDiscountModalOpen: (v: boolean) => void
  handleLaunchPayment: (m: string, a: number) => void
  handleRemovePayment: (idx: number) => void
  handleEditPayment: (idx: number, a: number) => void
  setIsChangeModalOpen: (v: boolean) => void; setIsCardModalOpen: (v: boolean) => void
  handleFinalizeSale: () => void; paymentAmountInput: string
  setPaymentAmountInput: (v: string) => void; launchAmount: number
}) {
  if (step === "negociacao") {
    return (
      <PdvCatalogLayout
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} viewMode={viewMode} setViewModeState={setViewModeState}
        setIsCartDrawerOpen={setIsCartDrawerOpen} catalogProducts={catalogProducts} handleAddProduct={handleAddProduct}
        activeCategory={activeCategory} setActiveCategory={setActiveCategory} filteredProducts={filteredProducts}
        categories={categories} enrichedCartItems={enrichedCartItems} handleIncrease={handleIncrease}
        handleDecrease={handleDecrease} handleRemove={handleRemove} discount={discount} total={total}
        onGoToPayment={onGoToPayment} activeComandaId={activeComandaId} handleSaveComandaAndExit={handleSaveComandaAndExit}
        deliveryContext={deliveryContext} cartItems={cartItems} subtotal={subtotal}
      />
    )
  }
  if (step === "delivery-confirm" && deliveryContext) {
    return (
      <DeliveryCheckoutConfirmation
        client={deliveryContext.client} rider={selectedRider} rate={selectedRate}
        onSelectRider={() => setSubView("riders-screen")} onClearRider={() => setSelectedRider(null)}
        onSelectRate={() => setSubView("rates-screen")} onClearRate={() => setSelectedRate(null)}
        onAlterClient={deliveryContext.onAlterClient} onCancel={() => setStep("negociacao")}
        onConfirmOrder={(data) => {
          if (data.paymentMoment === "advance") {
            setPendingDeliveryData({ ...data, items: cartItems, total, subtotal, discount }); setStep("pagamento")
          } else {
            deliveryContext.onConfirmDelivery({ ...data, items: cartItems, total, subtotal, discount })
          }
        }}
      />
    )
  }
  return (
    <PdvCheckoutPayment
      cartItems={cartItems} payments={payments} discount={discount} subtotal={subtotal} total={total} totalPaid={totalPaid} amountDue={amountDue} formatPrice={formatPrice}
      onOpenDiscountModal={() => setIsDiscountModalOpen(true)}
      onLaunchPayment={handleLaunchPayment} onRemovePayment={handleRemovePayment} onEditPayment={handleEditPayment}
      onOpenChangeModal={() => setIsChangeModalOpen(true)} onOpenCardModal={() => setIsCardModalOpen(true)}
      onFinalizeSale={handleFinalizeSale} onRemoveItem={handleRemove} onIncreaseItem={handleIncrease} onDecreaseItem={handleDecrease}
      paymentAmountInput={paymentAmountInput} onChangePaymentAmountInput={setPaymentAmountInput} launchAmount={launchAmount}
    />
  )
}

function usePdvPaymentStateManager(deliveryContext?: DeliveryContextData | null) {
  const [pendingDeliveryData, setPendingDeliveryData] = React.useState<DeliveryOrderPayload | null>(null)
  const [payments, setPayments] = React.useState<{ method: string; amount: number }[]>([])
  const [discount, setDiscount] = React.useState(deliveryContext?.initialDiscount || 0)
  const [paymentAmountInput, setPaymentAmountInput] = React.useState("")
  const [isChangeModalOpen, setIsChangeModalOpen] = React.useState(false)
  const [isCardModalOpen, setIsCardModalOpen] = React.useState(false)
  const [isDiscountModalOpen, setIsDiscountModalOpen] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false)
  const [isExitConfirmOpen, setIsExitConfirmOpen] = React.useState(false)
  const [isObservationModalOpen, setIsObservationModalOpen] = React.useState(false)
  const [isSangriaModalOpen, setIsSangriaModalOpen] = React.useState(false)
  const [isSangriaObsModalOpen, setIsSangriaObsModalOpen] = React.useState(false)
  const [sangriaModalMode, setSangriaModalMode] = React.useState<"sangria" | "suprimento">("sangria")
  const [pendingSangriaAmount, setPendingSangriaAmount] = React.useState<number>(0)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false)
  const [exitConfirmMode, setExitConfirmMode] = React.useState<"save-and-exit" | "cancel-operation">("save-and-exit")
  const [lastCompletedSaleData, setLastCompletedSaleData] = React.useState<{ total: number; change: number; paymentMethod: string; customerName: string } | null>(null)

  return {
    pendingDeliveryData, setPendingDeliveryData, payments, setPayments, discount, setDiscount,
    paymentAmountInput, setPaymentAmountInput, isChangeModalOpen, setIsChangeModalOpen,
    isCardModalOpen, setIsCardModalOpen, isDiscountModalOpen, setIsDiscountModalOpen,
    isSidebarOpen, setIsSidebarOpen, isCartDrawerOpen, setIsCartDrawerOpen,
    isExitConfirmOpen, setIsExitConfirmOpen, isObservationModalOpen, setIsObservationModalOpen,
    isSangriaModalOpen, setIsSangriaModalOpen, isSangriaObsModalOpen, setIsSangriaObsModalOpen,
    sangriaModalMode, setSangriaModalMode, pendingSangriaAmount, setPendingSangriaAmount,
    isSuccessModalOpen, setIsSuccessModalOpen, lastCompletedSaleData, setLastCompletedSaleData,
    exitConfirmMode, setExitConfirmMode,
  }
}

interface PdvCheckoutOperationsParams {
  tenantId: string
  pm: ReturnType<typeof usePdvPaymentStateManager>
  cartItems: CartItemType[]
  subtotal: number
  total: number
  totalPaid: number
  activeClientOrTitle: string
  observationText: string
  dbCompany: unknown
  deliveryContext?: DeliveryContextData | null
  activeComandaId?: string | null
  onCloseComanda?: (id: string) => void
  setCartItems: React.Dispatch<React.SetStateAction<CartItemType[]>>
  setObservationText: React.Dispatch<React.SetStateAction<string>>
  setSearchQuery: (q: string) => void
  setStep: (s: "negociacao" | "pagamento" | "recibo" | "delivery-confirm") => void
  setSubView: (v: PdvSubView) => void
  setSelectedCustomerName: (n: string | null) => void
  onBackToDashboardRef: React.MutableRefObject<() => void>
}

async function resetOrDeleteSingleTab(tabId: string, tenantId: string) {
  if (!tabId || tabId.startsWith("avulso-")) return
  const existing = await db.tabs.get(tabId)
  if (existing?.is_fixed) {
    await dal.tabs.update({ ...existing, items: [], total: 0, observation: undefined, status: "OPEN" })
  } else {
    await dal.tabs.delete(tabId, tenantId).catch(() => {})
  }
}

async function resetOrDeleteComanda(activeComandaId: string, tenantId: string) {
  if (activeComandaId.startsWith("batch:")) {
    const ids = activeComandaId.replace("batch:", "").split(",")
    await Promise.all(ids.map((id) => resetOrDeleteSingleTab(id, tenantId)))
    return
  }
  await resetOrDeleteSingleTab(activeComandaId, tenantId)
}

function usePdvCheckoutOperations(params: PdvCheckoutOperationsParams) {
  const {
    tenantId, pm, cartItems, subtotal, total, totalPaid, activeClientOrTitle,
    observationText, dbCompany, deliveryContext, activeComandaId, onCloseComanda,
    setCartItems, setObservationText, setSearchQuery, setStep, setSubView,
    setSelectedCustomerName, onBackToDashboardRef,
  } = params

  const handleSaveComandaAndExit = async () => {
    if (activeComandaId && !activeComandaId.startsWith("avulso-") && !activeComandaId.startsWith("batch:")) {
      const existingTab = await db.tabs.get(activeComandaId)
      if (existingTab) await dal.tabs.update({ ...existingTab, items: cartItems, total: subtotal, observation: observationText })
    }
    pm.setIsExitConfirmOpen(false); onBackToDashboardRef.current()
  }

  const handleDiscardOperationAndExit = async () => {
    if (activeComandaId) {
      await resetOrDeleteComanda(activeComandaId, tenantId)
    }
    setCartItems([]); pm.setPayments([]); pm.setDiscount(0); setObservationText(""); pm.setIsExitConfirmOpen(false); onBackToDashboardRef.current()
  }

  const handleFinalizeSale = async () => {
    const paymentMethodsStr = pm.payments.map((p) => p.method).join(", ") || "Dinheiro"
    const saleId = `sale-${Date.now()}`
    const saleNum = saleId.slice(-4)
    const createdAt = new Date().toISOString()
    const saleData = {
      id: saleId, company_id: tenantId, tenant_id: tenantId, total, subtotal, discount: pm.discount, status: "COMPLETED", payment_method: paymentMethodsStr,
      customer_name: activeClientOrTitle !== "Nao selecionado" ? activeClientOrTitle : undefined, observation: observationText.trim() || undefined, created_at: createdAt,
      items: cartItems.map((item: CartItemType) => ({ id: `si-${Date.now()}-${item.id}`, product_id: item.id, product_name: item.name, quantity: item.quantity, unit_price: item.unitPrice, total_price: item.quantity * item.unitPrice })),
    }
    await dal.sales.create(saleData)
    const uploadedPdf = await uploadSaleReceiptPdf({ saleId, saleNum, total, subtotal, discount: pm.discount, paymentMethodsStr, customerName: saleData.customer_name, createdAt, cartItems, companyData: dbCompany, tenantId })
    if (uploadedPdf) await dal.sales.update({ ...saleData, pdf_url: uploadedPdf })
    await updateProductStocks(cartItems)
    if (pm.pendingDeliveryData && deliveryContext) {
      deliveryContext.onConfirmDelivery({ ...pm.pendingDeliveryData, status: "Status do pedido: Aberto", paymentMoment: "advance", items: cartItems, total, subtotal, discount: pm.discount })
      pm.setPendingDeliveryData(null)
    }
    const calculatedChange = totalPaid > total ? totalPaid - total : 0
    pm.setLastCompletedSaleData({ total, change: calculatedChange, paymentMethod: paymentMethodsStr, customerName: activeClientOrTitle })
    pm.setIsSuccessModalOpen(true)
  }

  const handleResetCaixaState = async () => {
    if (activeComandaId && onCloseComanda) onCloseComanda(activeComandaId)
    if (activeComandaId) {
      await resetOrDeleteComanda(activeComandaId, tenantId)
    }
    setCartItems([]); pm.setPayments([]); pm.setDiscount(0); setStep("negociacao"); setSubView("none"); setSelectedCustomerName(null); setObservationText(""); setSearchQuery(""); pm.setIsSuccessModalOpen(false)
  }

  return { handleSaveComandaAndExit, handleDiscardOperationAndExit, handleFinalizeSale, handleResetCaixaState }
}

function usePdvProductsData(tenantId: string, activeComandaId?: string | null) {
  const dbProducts = useProducts(tenantId)
  const dbCategories = useCategories(tenantId)
  const dbTabs = useTabs(tenantId)
  const dbDeliveryOrders = useDeliveryOrders(tenantId)
  const dbCompany = useLiveQuery(async () => (tenantId ? await db.companies.get(tenantId) : null), [tenantId])

  const { getEffectiveAvailableStock } = useCommittedStockCalculator(dbTabs, dbDeliveryOrders, activeComandaId)
  const { catalogProducts } = usePdvCatalogData(dbProducts, dbCategories, getEffectiveAvailableStock)

  const [showOutOfStockProducts, setShowOutOfStockProducts] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pdv_show_out_of_stock_products")
      if (saved !== null) return saved === "true"
    }
    return true
  })

  const availableProducts = React.useMemo(() => catalogProducts.filter((p: MockProduct) => showOutOfStockProducts || (p.stock ?? 0) >= 1), [catalogProducts, showOutOfStockProducts])
  const categories = React.useMemo(() => {
    const set = new Set<string>()
    availableProducts.forEach((p: MockProduct) => { if (p.category && p.category !== "Geral") set.add(p.category); if (p.subgroup) set.add(p.subgroup) })
    const catList = Array.from(set)
    return catList.length === 0 ? (availableProducts.some((p: MockProduct) => p.category === "Geral") ? ["Todos", "Geral"] : ["Todos"]) : ["Todos", ...catList]
  }, [availableProducts])

  return { dbTabs, dbCompany, catalogProducts, availableProducts, categories, showOutOfStockProducts, setShowOutOfStockProducts }
}

function usePdvNavigationState() {
  const [step, setStep] = React.useState<"negociacao" | "pagamento" | "recibo" | "delivery-confirm">("negociacao")
  const [subView, setSubView] = React.useState<PdvSubView>("none")
  const [negociacoesClientFilter, setNegociacoesClientFilter] = React.useState<string | null>(null)
  const [isSelectingClientForNegociacoes, setIsSelectingClientForNegociacoes] = React.useState<boolean>(false)
  const [selectedRider, setSelectedRider] = React.useState<Rider | null>(null)
  const [selectedRate, setSelectedRate] = React.useState<DeliveryRate | null>(null)
  const [observationText, setObservationText] = React.useState("")
  const [selectedCustomerName, setSelectedCustomerName] = React.useState<string | null>(null)

  return {
    step, setStep, subView, setSubView, negociacoesClientFilter, setNegociacoesClientFilter,
    isSelectingClientForNegociacoes, setIsSelectingClientForNegociacoes,
    selectedRider, setSelectedRider, selectedRate, setSelectedRate,
    observationText, setObservationText, selectedCustomerName, setSelectedCustomerName,
  }
}

function usePdvSangriaManager(
  tenantId: string,
  tenantCtx: ReturnType<typeof useTenant>,
  pm: ReturnType<typeof usePdvPaymentStateManager>
) {
  const handleSaveSangriaMovement = async (obs: string) => {
    if (pm.pendingSangriaAmount > 0) {
      const movementId = crypto.randomUUID()
      const type: "SUPPLY" | "BLEED" = pm.sangriaModalMode === "suprimento" ? "SUPPLY" : "BLEED"
      const desc = obs.trim() || (pm.sangriaModalMode === "suprimento" ? "Suprimento manual" : "Sangria manual")
      const now = new Date().toISOString()
      const payload = { id: movementId, cash_register_id: tenantId, company_id: tenantId, tenant_id: tenantId, type, amount: pm.pendingSangriaAmount, description: desc, operator_name: tenantCtx?.currentUser?.name || "Administrador", created_at: now }
      await db.cash_movements.add(payload)
      await db.sync_queue.add({ id: crypto.randomUUID(), table: "cash_movements", action: "INSERT", tenant_id: tenantId, payload, created_at: now })
    }
    pm.setIsSangriaObsModalOpen(false)
    pm.setPendingSangriaAmount(0)
  }
  return { handleSaveSangriaMovement }
}

function usePdvSidebarNavigate(nav: ReturnType<typeof usePdvNavigationState>) {
  const handleSidebarNavigate = (view: "negociacoes" | "clientes" | "devolucao" | "totais-em-caixa" | "recebimentos" | "sangrias-suprimentos" | "ultimas-negociacoes") => {
    if (view === "ultimas-negociacoes") {
      const hasClient = nav.selectedCustomerName && nav.selectedCustomerName !== "Nao selecionado" && nav.selectedCustomerName !== "Venda Avulsa"
      nav.setNegociacoesClientFilter(hasClient ? nav.selectedCustomerName : null)
      nav.setIsSelectingClientForNegociacoes(!hasClient)
      nav.setSubView(hasClient ? "negociacoes" : "clientes")
      return
    }
    if (view === "negociacoes") {
      nav.setNegociacoesClientFilter(null)
      nav.setIsSelectingClientForNegociacoes(false)
      nav.setSubView("negociacoes")
      return
    }
    nav.setIsSelectingClientForNegociacoes(false)
    nav.setSubView(view)
  }
  return { handleSidebarNavigate }
}

function usePdvAmounts(cartItems: CartItemType[], pm: ReturnType<typeof usePdvPaymentStateManager>) {
  const subtotal = cartItems.reduce((acc: number, item: CartItemType) => acc + item.quantity * item.unitPrice, 0)
  const total = Math.max(0, subtotal - pm.discount)
  const totalPaid = pm.payments.reduce((acc: number, p: { amount: number }) => acc + p.amount, 0)
  const amountDue = Math.max(0, total - totalPaid)
  const parsedPaymentAmount = (Number(pm.paymentAmountInput.replace(/\D/g, "")) || 0) / 100 || amountDue
  const launchAmount = Math.min(parsedPaymentAmount, amountDue)

  const { setPaymentAmountInput } = pm
  React.useEffect(() => {
    const timer = setTimeout(() => { setPaymentAmountInput(amountDue > 0 ? maskCurrency(Math.round(amountDue * 100)) : "") }, 0)
    return () => clearTimeout(timer)
  }, [amountDue, setPaymentAmountInput])

  return { subtotal, total, totalPaid, amountDue, launchAmount }
}

function PdvMobileBottomBar({
  step, deliveryContext, cartItems, subtotal, discount, total, handleGoToPayment, activeComandaId, handleSaveComandaAndExit,
}: {
  step: string; deliveryContext?: DeliveryContextData | null; cartItems: CartItemType[]
  subtotal: number; discount: number; total: number; handleGoToPayment: () => void
  activeComandaId?: string | null; handleSaveComandaAndExit: () => void
}) {
  if (step !== "negociacao") return null
  return (
    <Box display="block md:hidden" position="fixed" bottom={0} left={0} right={0} w="full" zIndex="20">
      <Box w="full" bg="bg-background" paddingX={5} paddingY={2.5}>
        <Stack direction="row" gap={2.5} w="full">
          {deliveryContext?.isEditing && deliveryContext?.onSaveEdits ? (
            <Button variant="primary-lg" fullWidth label={UI_STRINGS.pdv.cart.saveChangesButton} disabled={cartItems.length === 0} onClick={() => deliveryContext.onSaveEdits?.(cartItems, subtotal, discount, total)} />
          ) : (
            <Button variant="primary-lg" fullWidth label={UI_STRINGS.pdv.cart.payButton} disabled={cartItems.length === 0} onClick={handleGoToPayment} />
          )}
          {activeComandaId && <Button variant="secondary-lg" fullWidth label={UI_STRINGS.pdv.cart.saveButton} onClick={handleSaveComandaAndExit} />}
        </Stack>
      </Box>
    </Box>
  )
}

function PdvModalsBundle({
  pm, enrichedCartItems, total, handleIncrease, handleDecrease, handleRemove,
  handleGoToPayment, activeComandaId, handleSaveComandaAndExit, handleDiscardOperationAndExit,
  amountDue, onBackToDashboard, launchAmount, subtotal, handleSidebarNavigate,
  activeClientOrTitle, prodData, cartItems, onBackToDashboardRef,
  observationText, setObservationText, handleSaveSangriaMovement,
  handleResetCaixaState, setStep,
}: {
  pm: ReturnType<typeof usePdvPaymentStateManager>
  enrichedCartItems: CartItemType[]; total: number
  handleIncrease: (id: string) => void; handleDecrease: (id: string) => void
  handleRemove: (id: string) => void; handleGoToPayment: () => void
  activeComandaId?: string | null; handleSaveComandaAndExit: () => void
  handleDiscardOperationAndExit: () => void
  amountDue: number; onBackToDashboard: () => void; launchAmount: number
  subtotal: number
  handleSidebarNavigate: (v: "negociacoes" | "clientes" | "devolucao" | "totais-em-caixa" | "recebimentos" | "sangrias-suprimentos" | "ultimas-negociacoes") => void
  activeClientOrTitle: string
  prodData: ReturnType<typeof usePdvProductsData>
  cartItems: CartItemType[]; onBackToDashboardRef: React.MutableRefObject<() => void>
  observationText: string; setObservationText: (o: string) => void
  handleSaveSangriaMovement: (obs: string) => void; handleResetCaixaState: () => void
  setStep: (s: "negociacao" | "pagamento" | "recibo" | "delivery-confirm") => void
}) {
  const handleCancelOperationClick = () => {
    pm.setIsSidebarOpen(false)
    pm.setExitConfirmMode("cancel-operation")
    if (cartItems.length === 0 && !activeComandaId) {
      onBackToDashboardRef.current()
    } else {
      pm.setIsExitConfirmOpen(true)
    }
  }

  return (
    <>
      <PdvModalsManager
        isCartDrawerOpen={pm.isCartDrawerOpen} setIsCartDrawerOpen={pm.setIsCartDrawerOpen}
        enrichedCartItems={enrichedCartItems} discount={pm.discount} total={total}
        handleIncrease={handleIncrease} handleDecrease={handleDecrease} handleRemove={handleRemove}
        onGoToPayment={handleGoToPayment} activeComandaId={activeComandaId}
        handleSaveComandaAndExit={handleSaveComandaAndExit} isChangeModalOpen={pm.isChangeModalOpen}
        setIsChangeModalOpen={pm.setIsChangeModalOpen} amountDue={amountDue} setPayments={pm.setPayments}
        isCardModalOpen={pm.isCardModalOpen} setIsCardModalOpen={pm.setIsCardModalOpen}
        handleLaunchPayment={(method: string, amount: number) => pm.setPayments((prev) => [...prev, { method, amount }])}
        isDiscountModalOpen={pm.isDiscountModalOpen} setIsDiscountModalOpen={pm.setIsDiscountModalOpen}
        setDiscount={pm.setDiscount} isSidebarOpen={pm.isSidebarOpen} setIsSidebarOpen={pm.setIsSidebarOpen}
        onBackToDashboard={onBackToDashboard} launchAmount={launchAmount} subtotal={subtotal}
        handleSidebarNavigate={handleSidebarNavigate} setIsObservationModalOpen={pm.setIsObservationModalOpen}
        setSangriaModalMode={pm.setSangriaModalMode} setIsSangriaModalOpen={pm.setIsSangriaModalOpen}
        activeClientOrTitle={activeClientOrTitle} showOutOfStockProducts={prodData.showOutOfStockProducts}
        handleToggleShowOutOfStock={(show) => { prodData.setShowOutOfStockProducts(show); if (typeof window !== "undefined") localStorage.setItem("pdv_show_out_of_stock_products", String(show)) }}
        cartItems={cartItems} onBackToDashboardRef={onBackToDashboardRef}
        setIsExitConfirmOpen={pm.setIsExitConfirmOpen} isObservationModalOpen={pm.isObservationModalOpen}
        observationText={observationText} setObservationText={setObservationText}
        isSangriaModalOpen={pm.isSangriaModalOpen} sangriaModalMode={pm.sangriaModalMode}
        setPendingSangriaAmount={pm.setPendingSangriaAmount} setIsSangriaObsModalOpen={pm.setIsSangriaObsModalOpen}
        isSangriaObsModalOpen={pm.isSangriaObsModalOpen} pendingSangriaAmount={pm.pendingSangriaAmount}
        handleSaveSangriaMovement={handleSaveSangriaMovement} isSuccessModalOpen={pm.isSuccessModalOpen}
        setIsSuccessModalOpen={pm.setIsSuccessModalOpen}
        handleResetCaixaState={handleResetCaixaState} lastCompletedSaleData={pm.lastCompletedSaleData} setStep={setStep}
        onCancelOperationClick={handleCancelOperationClick}
      />
      <ExitConfirmModal
        isOpen={pm.isExitConfirmOpen} onClose={() => pm.setIsExitConfirmOpen(false)}
        onConfirm={handleDiscardOperationAndExit}
        isComanda={Boolean(activeComandaId && !activeComandaId.startsWith("avulso-"))} onSave={handleSaveComandaAndExit}
        mode={pm.exitConfirmMode}
      />
    </>
  )
}

function PdvViewBody({
  nav, deliveryContext, searchQuery, setSearchQuery, viewMode, setViewModeState,
  pm, prodData, enrichedCartItems, handleIncrease, handleDecrease, handleRemove,
  total, handleGoToPayment, activeComandaId, handleSaveComandaAndExit, handleDiscardOperationAndExit, cartItems,
  subtotal, handleAddProduct, activeCategory, setActiveCategory, filteredProducts,
  onBackToDashboard, activeClientOrTitle, handleSidebarNavigate, handleSaveSangriaMovement,
  handleResetCaixaState, onBackToDashboardRef, totalPaid, amountDue, launchAmount,
  handleFinalizeSale,
}: {
  nav: ReturnType<typeof usePdvNavigationState>
  deliveryContext?: DeliveryContextData | null
  searchQuery: string; setSearchQuery: (q: string) => void
  viewMode: "grade" | "lista"; setViewModeState: (m: "grade" | "lista") => void
  pm: ReturnType<typeof usePdvPaymentStateManager>
  prodData: ReturnType<typeof usePdvProductsData>
  enrichedCartItems: CartItemType[]
  handleIncrease: (id: string) => void; handleDecrease: (id: string) => void
  handleRemove: (id: string) => void; total: number; handleGoToPayment: () => void
  activeComandaId?: string | null; handleSaveComandaAndExit: () => void
  handleDiscardOperationAndExit: () => void
  cartItems: CartItemType[]; subtotal: number; handleAddProduct: (p: MockProduct) => void
  activeCategory: string; setActiveCategory: (c: string) => void
  filteredProducts: MockProduct[]; onBackToDashboard: () => void
  activeClientOrTitle: string
  handleSidebarNavigate: (v: "negociacoes" | "clientes" | "devolucao" | "totais-em-caixa" | "recebimentos" | "sangrias-suprimentos" | "ultimas-negociacoes") => void
  handleSaveSangriaMovement: (obs: string) => void
  handleResetCaixaState: () => void
  onBackToDashboardRef: React.MutableRefObject<() => void>
  totalPaid: number; amountDue: number; launchAmount: number
  handleFinalizeSale: () => void
}) {
  return (
    <Stack gap={5} w="full" flex="1" minH="0" overflow="hidden">
      <ViewTransition viewKey={nav.step} flex="1" direction="col" minH="0" overflow="hidden">
        <PdvStepContentRouter
          step={nav.step} setStep={nav.setStep} deliveryContext={deliveryContext} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          viewMode={viewMode} setViewModeState={setViewModeState} setIsCartDrawerOpen={pm.setIsCartDrawerOpen} catalogProducts={prodData.catalogProducts}
          handleAddProduct={handleAddProduct} activeCategory={activeCategory} setActiveCategory={setActiveCategory}
          filteredProducts={filteredProducts} categories={prodData.categories} enrichedCartItems={enrichedCartItems} handleIncrease={handleIncrease}
          handleDecrease={handleDecrease} handleRemove={handleRemove} discount={pm.discount} total={total} onGoToPayment={handleGoToPayment}
          activeComandaId={activeComandaId} handleSaveComandaAndExit={handleSaveComandaAndExit} cartItems={cartItems} subtotal={subtotal}
          selectedRider={nav.selectedRider} selectedRate={nav.selectedRate} setSubView={nav.setSubView} setSelectedRider={nav.setSelectedRider}
          setSelectedRate={nav.setSelectedRate} setPendingDeliveryData={pm.setPendingDeliveryData} payments={pm.payments} totalPaid={totalPaid}
          amountDue={amountDue} setIsDiscountModalOpen={pm.setIsDiscountModalOpen}
          handleLaunchPayment={(method: string, amount: number) => pm.setPayments((prev) => [...prev, { method, amount }])}
          handleRemovePayment={(idx: number) => pm.setPayments((prev) => prev.filter((_, i) => i !== idx))}
          handleEditPayment={(idx: number, newAmount: number) => pm.setPayments((prev) => prev.map((p, i) => i === idx ? { ...p, amount: newAmount } : p))}
          setIsChangeModalOpen={pm.setIsChangeModalOpen} setIsCardModalOpen={pm.setIsCardModalOpen} handleFinalizeSale={handleFinalizeSale}
          paymentAmountInput={pm.paymentAmountInput} setPaymentAmountInput={pm.setPaymentAmountInput} launchAmount={launchAmount}
        />
      </ViewTransition>

      <PdvMobileBottomBar
        step={nav.step} deliveryContext={deliveryContext} cartItems={cartItems} subtotal={subtotal} discount={pm.discount}
        total={total} handleGoToPayment={handleGoToPayment} activeComandaId={activeComandaId} handleSaveComandaAndExit={handleSaveComandaAndExit}
      />

      <PdvModalsBundle
        pm={pm} enrichedCartItems={enrichedCartItems} total={total} handleIncrease={handleIncrease}
        handleDecrease={handleDecrease} handleRemove={handleRemove} handleGoToPayment={handleGoToPayment}
        activeComandaId={activeComandaId} handleSaveComandaAndExit={handleSaveComandaAndExit}
        handleDiscardOperationAndExit={handleDiscardOperationAndExit}
        amountDue={amountDue}
        onBackToDashboard={onBackToDashboard} launchAmount={launchAmount} subtotal={subtotal}
        handleSidebarNavigate={handleSidebarNavigate} activeClientOrTitle={activeClientOrTitle}
        prodData={prodData} cartItems={cartItems} onBackToDashboardRef={onBackToDashboardRef}
        observationText={nav.observationText} setObservationText={nav.setObservationText}
        handleSaveSangriaMovement={handleSaveSangriaMovement} handleResetCaixaState={handleResetCaixaState} setStep={nav.setStep}
      />
    </Stack>
  )
}

export const PdvSection: React.FC<PdvSectionProps> = ({
  onBackToDashboard, activeComandaId, onCloseComanda,
  setCustomBack, setCustomActions, setCustomTitle, deliveryContext,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const prodData = usePdvProductsData(tenantId, activeComandaId)
  const nav = usePdvNavigationState()
  const pm = usePdvPaymentStateManager(deliveryContext)
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery, viewMode, setViewModeState, filteredProducts } = usePdvCatalogState(prodData.availableProducts, prodData.categories)
  const { cartItems, setCartItems, enrichedCartItems, handleAddProduct, handleIncrease, handleDecrease, handleRemove, handleDuplicateToCart } = usePdvCartManager(prodData.catalogProducts, deliveryContext?.initialItems)

  usePdvComandaTabSync({
    activeComandaId,
    dbTabs: prodData.dbTabs,
    setCartItems,
    setObservationText: nav.setObservationText,
    setStep: nav.setStep,
  })

  const activeClientOrTitle = React.useMemo(() => resolveActiveClientOrTitle(deliveryContext?.client?.name, activeComandaId, prodData.dbTabs, nav.selectedCustomerName), [deliveryContext, activeComandaId, prodData.dbTabs, nav.selectedCustomerName])
  const { subtotal, total, totalPaid, amountDue, launchAmount } = usePdvAmounts(cartItems, pm)

  const onBackToDashboardRef = React.useRef(onBackToDashboard)
  React.useEffect(() => { onBackToDashboardRef.current = onBackToDashboard }, [onBackToDashboard])

  const { handleSaveComandaAndExit, handleDiscardOperationAndExit, handleFinalizeSale, handleResetCaixaState } = usePdvCheckoutOperations({
    tenantId, pm, cartItems, subtotal, total, totalPaid, activeClientOrTitle, observationText: nav.observationText, dbCompany: prodData.dbCompany,
    deliveryContext, activeComandaId, onCloseComanda, setCartItems, setObservationText: nav.setObservationText, setSearchQuery,
    setStep: nav.setStep, setSubView: nav.setSubView, setSelectedCustomerName: nav.setSelectedCustomerName, onBackToDashboardRef,
  })

  const { handleSaveSangriaMovement } = usePdvSangriaManager(tenantId, tenantCtx, pm)
  const { handleSidebarNavigate } = usePdvSidebarNavigate(nav)

  usePdvHeaderSync({
    step: nav.step, subView: nav.subView, cartItemsLength: cartItems.length, activeClientOrTitle,
    searchQuery, setSearchQuery, onBackToDashboardRef, setIsExitConfirmOpen: pm.setIsExitConfirmOpen,
    setIsSidebarOpen: pm.setIsSidebarOpen, setIsDiscountModalOpen: pm.setIsDiscountModalOpen, setStep: nav.setStep,
    setExitConfirmMode: pm.setExitConfirmMode, setCustomBack, setCustomTitle, setCustomActions,
  })

  if (nav.subView !== "none") {
    return (
      <PdvSubViewRouter
        subView={nav.subView} setSubView={nav.setSubView} setCustomBack={setCustomBack} setCustomTitle={setCustomTitle} setCustomActions={setCustomActions}
        negociacoesClientFilter={nav.negociacoesClientFilter} setNegociacoesClientFilter={nav.setNegociacoesClientFilter}
        isSelectingClientForNegociacoes={nav.isSelectingClientForNegociacoes} setIsSelectingClientForNegociacoes={nav.setIsSelectingClientForNegociacoes}
        setSelectedCustomerName={nav.setSelectedCustomerName} handleDuplicateToCart={handleDuplicateToCart}
        setSelectedRate={nav.setSelectedRate} setSelectedRider={nav.setSelectedRider}
      />
    )
  }

  if (nav.step === "recibo") {
    return (
      <ViewTransition viewKey={nav.step}>
        <PdvCheckoutReceipt
          cartItems={cartItems} payments={pm.payments}
          onCloseReceipt={() => {
            if (activeComandaId && onCloseComanda) onCloseComanda(activeComandaId)
            setCartItems([]); pm.setPayments([]); pm.setDiscount(0); nav.setStep("negociacao"); onBackToDashboard()
          }}
        />
      </ViewTransition>
    )
  }

  const handleGoToPayment = () => { if (deliveryContext) nav.setStep("delivery-confirm"); else nav.setStep("pagamento") }

  return (
    <PdvViewBody
      nav={nav} deliveryContext={deliveryContext} searchQuery={searchQuery} setSearchQuery={setSearchQuery}
      viewMode={viewMode} setViewModeState={setViewModeState} pm={pm} prodData={prodData}
      enrichedCartItems={enrichedCartItems} handleIncrease={handleIncrease} handleDecrease={handleDecrease}
      handleRemove={handleRemove} total={total} handleGoToPayment={handleGoToPayment} activeComandaId={activeComandaId}
      handleSaveComandaAndExit={handleSaveComandaAndExit} handleDiscardOperationAndExit={handleDiscardOperationAndExit} cartItems={cartItems} subtotal={subtotal}
      handleAddProduct={handleAddProduct} activeCategory={activeCategory} setActiveCategory={setActiveCategory}
      filteredProducts={filteredProducts} onBackToDashboard={onBackToDashboard} activeClientOrTitle={activeClientOrTitle}
      handleSidebarNavigate={handleSidebarNavigate} handleSaveSangriaMovement={handleSaveSangriaMovement}
      handleResetCaixaState={handleResetCaixaState} onBackToDashboardRef={onBackToDashboardRef} totalPaid={totalPaid}
      amountDue={amountDue} launchAmount={launchAmount} handleFinalizeSale={handleFinalizeSale}
    />
  )
}
