"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Button } from "@/components/store/base/Button"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { DeliveryTimeline, DeliveryStatus } from "@/components/store/intermediary/DeliveryTimeline"
import { DeliveryOrdersList, DeliveryOrder as ListDeliveryOrder } from "@/components/store/advanced/DeliveryOrdersList"
import { DeliveryClientFormScreen } from "@/components/store/advanced/DeliveryClientFormScreen"
import { DeliveryRidersScreen } from "@/components/store/advanced/DeliveryRidersScreen"
import { DeliveryClientInfo } from "@/components/store/advanced/DeliveryCheckoutConfirmation"
import { PdvSection, CartItemType } from "@/components/store/sections/pdv/pages/PdvSection"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { Truck, Plus } from "lucide-react"
import { useTenant } from "@/lib/context/TenantContext"
import { useDeliveryOrders, dal, Rider, DeliveryRate, DeliveryOrder as DalDeliveryOrder } from "@/lib/dal"
import { ViewTransition } from "@/components/store/base/ViewTransition"
import { UI_STRINGS } from "@/constants/strings"

export interface DeliverySectionProps {
  setCustomActions?: (actions: React.ReactNode) => void
  setCustomTitle?: (title: string | null) => void
  setCustomBack?: (cb: (() => void) | null) => void
  onBackToDashboard?: () => void
}

export interface ExtendedDeliveryOrder extends ListDeliveryOrder {
  deliveryFee?: number
  subtotal?: number
  discount?: number
}

type DeliveryView = "list" | "order-detail" | "client-form" | "pos" | "riders-select"

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(false)
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const update = () => setIsDesktop(mediaQuery.matches)
    update()
    mediaQuery.addEventListener("change", update)
    return () => mediaQuery.removeEventListener("change", update)
  }, [])
  return isDesktop
}

interface DeliveryListViewProps {
  orders: ExtendedDeliveryOrder[]
  selectedOrderId: string
  selectedOrder: ExtendedDeliveryOrder | undefined
  searchQuery: string
  onSelectOrder: (id: string) => void
  onOpenNewOrder: () => void
  renderOrderTimeline: (order: ExtendedDeliveryOrder) => React.ReactNode
}

function DeliveryListView({
  orders, selectedOrderId, selectedOrder, searchQuery, onSelectOrder, onOpenNewOrder, renderOrderTimeline,
}: DeliveryListViewProps) {
  const s = UI_STRINGS.delivery
  if (orders.length === 0) {
    return (
      <Box w="full" h="full" position="relative">
        <EmptyState icon={Truck} title={s.emptyTitle} subtitle={s.emptySubtitle} />
        <Box position="fixed" bottom="24px" right="24px" zIndex="30">
          <Button variant="secondary-pill-icon" icon={Plus} onClick={onOpenNewOrder} />
        </Box>
      </Box>
    )
  }

  return (
    <Box w="full" h="full" minH="0" overflow="hidden" position="relative">
      <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" h="full">
        <Box w="w-full md:w-1/3" h="full" overflow="auto" flex="1" minH="0">
          <DeliveryOrdersList orders={orders} selectedOrderId={selectedOrderId} onSelectOrder={onSelectOrder} searchQuery={searchQuery} />
        </Box>
        <Box display="hidden md:flex" flex="1" h="full" minH="0" overflow="hidden" direction="col">
          {selectedOrder ? renderOrderTimeline(selectedOrder) : (
            <EmptyState icon={Truck} title={s.noOrderSelectedTitle} subtitle={s.noOrderSelectedSubtitle} />
          )}
        </Box>
      </Stack>
      <Box position="fixed" bottom="24px" right="24px" zIndex="30">
        <Button variant="secondary-pill-icon" icon={Plus} onClick={onOpenNewOrder} />
      </Box>
    </Box>
  )
}

interface SyncDeliveryListParams {
  s: typeof UI_STRINGS.delivery
  viewHistoryLength: number
  popView: () => void
  onBackRef: React.MutableRefObject<(() => void) | undefined>
  setCustomTitleRef: React.MutableRefObject<((t: string | null) => void) | undefined>
  setCustomBackRef: React.MutableRefObject<((cb: (() => void) | null) => void) | undefined>
  setCustomActionsRef: React.MutableRefObject<((a: React.ReactNode | null) => void) | undefined>
  searchQuery: string
  setSearchQuery: (q: string) => void
  isDesktop: boolean
  hasSelectedOrder: boolean
}

function syncDeliveryListHeader(p: SyncDeliveryListParams) {
  p.setCustomTitleRef.current?.(p.s.title)
  if (p.viewHistoryLength > 1) {
    p.setCustomBackRef.current?.(() => p.popView)
  } else if (p.onBackRef.current) {
    const backCb = p.onBackRef.current
    p.setCustomBackRef.current?.(() => backCb)
  } else {
    p.setCustomBackRef.current?.(null)
  }
  p.setCustomActionsRef.current?.(
    <MobileHeaderSearch searchQuery={p.searchQuery} onSearchQueryChange={p.setSearchQuery} placeholder={p.s.searchPlaceholder}>
      {p.isDesktop && p.hasSelectedOrder ? <Button variant="primary-icon-print" title={p.s.printOrderTitle} /> : null}
    </MobileHeaderSearch>
  )
}

interface SyncDeliveryDetailParams {
  selectedOrder: ExtendedDeliveryOrder | undefined
  s: typeof UI_STRINGS.delivery
  popView: () => void
  setCustomTitleRef: React.MutableRefObject<((t: string | null) => void) | undefined>
  setCustomBackRef: React.MutableRefObject<((cb: (() => void) | null) => void) | undefined>
  setCustomActionsRef: React.MutableRefObject<((a: React.ReactNode | null) => void) | undefined>
}

function syncDeliveryDetailHeader(p: SyncDeliveryDetailParams) {
  p.setCustomTitleRef.current?.(p.selectedOrder?.clientName || "Pedido")
  p.setCustomBackRef.current?.(() => p.popView)
  p.setCustomActionsRef.current?.(p.selectedOrder ? <Button variant="primary-icon-print" title={p.s.printOrderTitle} /> : null)
}

interface DeliveryHeaderSyncOptions {
  viewMode: DeliveryView
  selectedOrder: ExtendedDeliveryOrder | undefined
  searchQuery: string
  setSearchQuery: (q: string) => void
  isDesktop: boolean
  hasSelectedOrder: boolean
  viewHistoryLength: number
  popView: () => void
  onBackToDashboard?: () => void
  setCustomTitle?: (t: string | null) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomActions?: (a: React.ReactNode | null) => void
}

function useDeliveryHeaderSync(opts: DeliveryHeaderSyncOptions) {
  const {
    viewMode, selectedOrder, searchQuery, setSearchQuery, isDesktop,
    hasSelectedOrder, viewHistoryLength, popView, onBackToDashboard,
    setCustomTitle, setCustomBack, setCustomActions,
  } = opts

  const s = UI_STRINGS.delivery
  const onBackRef = React.useRef(onBackToDashboard)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomActionsRef = React.useRef(setCustomActions)

  React.useEffect(() => {
    onBackRef.current = onBackToDashboard; setCustomTitleRef.current = setCustomTitle
    setCustomBackRef.current = setCustomBack; setCustomActionsRef.current = setCustomActions
  })

  React.useEffect(() => {
    if (viewMode === "list") {
      syncDeliveryListHeader({ s, viewHistoryLength, popView, onBackRef, setCustomTitleRef, setCustomBackRef, setCustomActionsRef, searchQuery, setSearchQuery, isDesktop, hasSelectedOrder })
    } else if (viewMode === "order-detail") {
      syncDeliveryDetailHeader({ selectedOrder, s, popView, setCustomTitleRef, setCustomBackRef, setCustomActionsRef })
    }
    return () => {
      if (viewMode === "list" || viewMode === "order-detail") setCustomActionsRef.current?.(null)
    }
  }, [viewMode, searchQuery, isDesktop, hasSelectedOrder, selectedOrder, viewHistoryLength, popView, s, setSearchQuery])
}

interface DeliveryOrderItemInput {
  id?: string
  name?: string
  quantity?: number
  unitPrice?: number
  unit_price?: number
  totalPrice?: number
  total_price?: number
}

function mapDeliveryItem(it: DeliveryOrderItemInput, idx: number) {
  const quantity = it.quantity ?? 1
  const unitPrice = it.unitPrice ?? it.unit_price ?? 0
  const totalPrice = it.totalPrice ?? it.total_price ?? (quantity * unitPrice)
  return { id: it.id || String(idx), name: it.name || "Item", quantity, unitPrice, totalPrice }
}

function parseDeliveryOrderItems(items: unknown): NonNullable<ListDeliveryOrder["items"]> {
  if (Array.isArray(items) && items.length > 0) {
    return (items as DeliveryOrderItemInput[]).map(mapDeliveryItem)
  }
  return [
    { id: "1", name: "ÁGUA COM GÁS", quantity: 1, unitPrice: 6.0, totalPrice: 6.0 },
    { id: "2", name: "ÁGUA SEM GÁS", quantity: 1, unitPrice: 3.0, totalPrice: 3.0 },
    { id: "3", name: "ÁGUA TÔNICA 350ML", quantity: 1, unitPrice: 6.0, totalPrice: 6.0 },
  ]
}

function resolveOrderAmounts(o: DalDeliveryOrder, computedItemsSubtotal: number) {
  const totalNum = typeof o.total === "number" && !isNaN(o.total) ? o.total : (parseFloat(String(o.total)) || 0)
  const subtotal = typeof o.subtotal === "number" ? o.subtotal : computedItemsSubtotal
  const discount = typeof o.discount === "number" ? o.discount : 0
  const deliveryFee = typeof o.delivery_fee === "number" ? o.delivery_fee : 10.0
  return { total: totalNum, subtotal, discount, deliveryFee }
}

function resolveOrderClientDetails(o: DalDeliveryOrder) {
  return {
    clientName: o.client_name || "Cliente Desconhecido",
    clientDocument: o.client_document || "101.389.219-46",
    clientPhone: o.client_phone || "(41) 998364028",
    address: o.address || "Endereço não informado",
    motoboy: o.motoboy || "Entregador não selecionado",
    origin: o.origin || "Pedido realizado no Aplicativo",
    paymentMethod: o.payment_method || "Cobrança na Entrega - Dinheiro",
    deliveryType: o.delivery_type || "Entrega no endereço",
  }
}

function parseSingleDeliveryOrder(o: DalDeliveryOrder): ExtendedDeliveryOrder {
  const parsedItems = parseDeliveryOrderItems(o.items)
  const computedItemsSubtotal = parsedItems.reduce((acc, it) => acc + (it.totalPrice || it.quantity * it.unitPrice || 0), 0)
  const amounts = resolveOrderAmounts(o, computedItemsSubtotal)
  const clientDetails = resolveOrderClientDetails(o)

  return {
    id: o.id || "",
    ...clientDetails,
    status: (o.status as DeliveryStatus) || "confirmed",
    estimatedTime: o.estimated_time || "1 hora",
    ...amounts,
    createdAt: o.created_at,
    items: parsedItems,
  }
}

function useDeliveryOrdersList(rawOrders?: DalDeliveryOrder[]) {
  const orders: ExtendedDeliveryOrder[] = React.useMemo(() => {
    if (!Array.isArray(rawOrders)) return []
    return rawOrders.map(parseSingleDeliveryOrder)
  }, [rawOrders])
  return { orders }
}

interface DeliveryOperationsParams {
  tenantId: string
  rawOrders?: DalDeliveryOrder[]
  effectiveSelectedOrderId: string
  editingOrderId: string | null
  setEditingOrderId: (id: string | null) => void
  setSelectedOrderId: (id: string) => void
  popView: () => void
  pushView: (v: DeliveryView) => void
  setViewHistory: React.Dispatch<React.SetStateAction<DeliveryView[]>>
  isDesktopRef: React.MutableRefObject<boolean>
  orders: ExtendedDeliveryOrder[]
  viewMode: DeliveryView
}

function useDeliveryOperations(p: DeliveryOperationsParams) {
  const {
    tenantId, rawOrders, effectiveSelectedOrderId, editingOrderId, setEditingOrderId,
    setSelectedOrderId, popView, setViewHistory, isDesktopRef, orders, viewMode,
  } = p

  const handleUpdateStatus = async (status: DeliveryStatus) => {
    if (!effectiveSelectedOrderId) return
    const orderToUpdate = rawOrders?.find((o) => o.id === effectiveSelectedOrderId)
    if (orderToUpdate) await dal.deliveryOrders.update({ ...orderToUpdate, status })
  }

  const handleAssignMotoboy = async (rider: Rider) => {
    if (!effectiveSelectedOrderId) return
    const orderToUpdate = rawOrders?.find((o) => o.id === effectiveSelectedOrderId)
    if (orderToUpdate) await dal.deliveryOrders.update({ ...orderToUpdate, motoboy: rider.name })
    popView()
  }

  const handleDeleteOrder = async (id: string) => {
    await dal.deliveryOrders.delete(id, tenantId)
    if (effectiveSelectedOrderId === id) {
      const remaining = orders.filter((o) => o.id !== id)
      setSelectedOrderId(remaining.length > 0 && isDesktopRef.current ? remaining[0].id : "")
      if (!isDesktopRef.current && viewMode === "order-detail") popView()
    }
  }

  const handleSaveOrderEdits = async (updatedItems: CartItemType[], newSubtotal: number, newDiscount: number) => {
    if (!editingOrderId) return
    const existing = rawOrders?.find((o) => o.id === editingOrderId)
    if (existing) {
      const computedFee = existing.delivery_fee ?? 10.0
      const finalTotal = Math.max(0, newSubtotal + computedFee - newDiscount)
      await dal.deliveryOrders.update({
        ...existing,
        items: updatedItems.map((it) => ({ id: it.id, name: it.name, quantity: it.quantity, unitPrice: it.unitPrice, totalPrice: it.quantity * it.unitPrice })),
        subtotal: newSubtotal, discount: newDiscount, total: finalTotal,
      })
    }
    setEditingOrderId(null)
    setViewHistory(["list"])
  }

  const handleConfirmDeliveryOrder = async (orderData: {
    status: string; deliveryType: string; paymentMoment: string
    client: DeliveryClientInfo; rider?: Rider | null; rate?: DeliveryRate | null
    items: CartItemType[]; total: number; subtotal: number; discount: number
  }) => {
    const orderId = Math.floor(1000 + Math.random() * 9000).toString()
    const motoboyName = orderData.rider?.name || "Entregador não selecionado"
    const deliveryFee = orderData.rate?.fee ?? 10.0
    const finalTotal = Math.max(0, orderData.subtotal + deliveryFee - orderData.discount)

    await dal.deliveryOrders.create({
      id: orderId, tenant_id: tenantId, company_id: tenantId, client_name: orderData.client.name,
      client_document: orderData.client.document || "101.389.219-46", client_phone: orderData.client.phone || "(41) 998364028",
      address: orderData.client.address || "Endereço não informado", status: "confirmed", estimated_time: "1 hora",
      subtotal: orderData.subtotal, discount: orderData.discount, delivery_fee: deliveryFee, total: finalTotal, motoboy: motoboyName,
      created_at: new Date().toISOString(), items: orderData.items.map((it) => ({ id: it.id, name: it.name, quantity: it.quantity, unitPrice: it.unitPrice, totalPrice: it.quantity * it.unitPrice })),
    })

    await Promise.all(orderData.items.map(async (item) => {
      const dbProduct = await dal.products.getById(item.id)
      if (dbProduct) {
        const currentStock = dbProduct.stock ?? 0
        await dal.products.update({ ...dbProduct, stock: Math.max(0, currentStock - item.quantity) })
      }
    }))

    setSelectedOrderId(orderId)
    setViewHistory(isDesktopRef.current ? ["list"] : ["list", "order-detail"])
  }

  return { handleUpdateStatus, handleAssignMotoboy, handleDeleteOrder, handleSaveOrderEdits, handleConfirmDeliveryOrder }
}

interface DeliveryViewRouterProps {
  viewMode: DeliveryView
  selectedOrder: ExtendedDeliveryOrder | undefined
  selectedClient: DeliveryClientInfo | null
  setSelectedClient: (c: DeliveryClientInfo | null) => void
  editingOrderId: string | null
  setEditingOrderId: (id: string | null) => void
  popView: () => void
  pushView: (v: DeliveryView) => void
  orders: ExtendedDeliveryOrder[]
  effectiveSelectedOrderId: string
  searchQuery: string
  handleSelectOrder: (id: string) => void
  handleAssignMotoboy: (r: Rider) => Promise<void>
  handleSaveOrderEdits: (items: CartItemType[], subtotal: number, discount: number) => Promise<void>
  handleConfirmDeliveryOrder: (data: {
    status: string; deliveryType: string; paymentMoment: string
    client: DeliveryClientInfo; rider?: Rider | null; rate?: DeliveryRate | null
    items: CartItemType[]; total: number; subtotal: number; discount: number
  }) => Promise<void>
  handleDeleteOrder: (id: string) => Promise<void>
  handleUpdateStatus: (s: DeliveryStatus) => Promise<void>
  setCustomActions?: (actions: React.ReactNode) => void
  setCustomTitle?: (title: string | null) => void
  setCustomBack?: (cb: (() => void) | null) => void
}

function renderPdvDeliveryScreen(p: DeliveryViewRouterProps) {
  const { editingOrderId, selectedOrder, selectedClient, pushView, popView, setEditingOrderId, handleSaveOrderEdits, handleConfirmDeliveryOrder, setCustomActions, setCustomTitle, setCustomBack } = p
  return (
    <PdvSection
      onBackToDashboard={() => { setEditingOrderId(null); popView() }}
      setCustomActions={setCustomActions} setCustomTitle={setCustomTitle} setCustomBack={setCustomBack}
      deliveryContext={
        editingOrderId && selectedOrder
          ? { client: selectedClient || { name: selectedOrder.clientName, phone: selectedOrder.clientPhone, address: selectedOrder.address }, initialItems: (selectedOrder.items || []) as CartItemType[], initialDiscount: selectedOrder.discount || 0, isEditing: true, onSaveEdits: handleSaveOrderEdits, onConfirmDelivery: handleConfirmDeliveryOrder }
          : { client: selectedClient || { name: "Cliente Delivery", phone: "", address: "" }, onAlterClient: () => pushView("client-form"), onConfirmDelivery: handleConfirmDeliveryOrder }
      }
    />
  )
}

function DeliveryViewRouter(p: DeliveryViewRouterProps) {
  const {
    viewMode, selectedOrder, selectedClient, setSelectedClient, setEditingOrderId,
    popView, pushView, orders, effectiveSelectedOrderId, searchQuery, handleSelectOrder,
    handleAssignMotoboy, handleDeleteOrder, handleUpdateStatus, setCustomActions, setCustomTitle, setCustomBack,
  } = p

  const renderOrderTimeline = (order: ExtendedDeliveryOrder) => (
    <DeliveryTimeline
      orderId={order.id} status={order.status} clientName={order.clientName}
      clientDocument={order.clientDocument} clientPhone={order.clientPhone}
      motoboyName={order.motoboy} estimatedTime={order.estimatedTime} address={order.address}
      createdAt={order.createdAt} origin={order.origin} paymentMethod={order.paymentMethod}
      deliveryType={order.deliveryType} items={order.items} subtotal={order.subtotal}
      deliveryFee={order.deliveryFee} discount={order.discount} total={order.total}
      onDeleteOrder={handleDeleteOrder}
      onEditOrder={() => {
        setEditingOrderId(order.id)
        setSelectedClient({ name: order.clientName, phone: order.clientPhone, address: order.address, document: order.clientDocument })
        pushView("pos")
      }}
      onSelectMotoboy={() => pushView("riders-select")}
      onUpdateStatus={handleUpdateStatus}
    />
  )

  if (viewMode === "client-form") {
    return <DeliveryClientFormScreen onBack={popView} onSelectClient={(c) => { setSelectedClient(c); pushView("pos") }} initialClient={selectedClient} setCustomActions={setCustomActions} setCustomTitle={setCustomTitle} setCustomBack={setCustomBack} />
  }
  if (viewMode === "pos") return renderPdvDeliveryScreen(p)
  if (viewMode === "riders-select") {
    return <DeliveryRidersScreen onBack={popView} onSelectRider={handleAssignMotoboy} setCustomActions={setCustomActions} setCustomTitle={setCustomTitle} setCustomBack={setCustomBack} />
  }
  if (viewMode === "order-detail" && selectedOrder) {
    return <Box w="full" h="full" minH="0" overflow="hidden">{renderOrderTimeline(selectedOrder)}</Box>
  }
  return (
    <DeliveryListView
      orders={orders} selectedOrderId={effectiveSelectedOrderId} selectedOrder={selectedOrder}
      searchQuery={searchQuery} onSelectOrder={handleSelectOrder}
      onOpenNewOrder={() => { setEditingOrderId(null); setSelectedClient(null); pushView("client-form") }}
      renderOrderTimeline={renderOrderTimeline}
    />
  )
}

export const DeliverySection: React.FC<DeliverySectionProps> = ({
  setCustomActions, setCustomTitle, setCustomBack, onBackToDashboard,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const isDesktop = useIsDesktop()
  const isDesktopRef = React.useRef(isDesktop)
  React.useEffect(() => { isDesktopRef.current = isDesktop }, [isDesktop])

  const [viewHistory, setViewHistory] = React.useState<DeliveryView[]>(["list"])
  const rawViewMode = viewHistory[viewHistory.length - 1] || "list"
  const viewMode = isDesktop && rawViewMode === "order-detail" ? "list" : rawViewMode

  const pushView = React.useCallback((newView: DeliveryView) => { setViewHistory((prev) => [...prev, newView]) }, [])
  const popView = React.useCallback(() => { setViewHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev)) }, [])

  const rawOrders = useDeliveryOrders(tenantId)
  const { orders } = useDeliveryOrdersList(rawOrders)

  const [selectedOrderId, setSelectedOrderId] = React.useState<string>("")
  const [editingOrderId, setEditingOrderId] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedClient, setSelectedClient] = React.useState<DeliveryClientInfo | null>(null)

  const effectiveSelectedOrderId = React.useMemo(() => {
    if (orders.length === 0) return ""
    if (selectedOrderId && orders.some((o) => o.id === selectedOrderId)) return selectedOrderId
    return isDesktop ? orders[0].id : ""
  }, [orders, selectedOrderId, isDesktop])

  const selectedOrder = orders.find((o) => o.id === effectiveSelectedOrderId)
  const handleSelectOrder = React.useCallback((id: string) => {
    setSelectedOrderId(id); if (!isDesktopRef.current) pushView("order-detail")
  }, [pushView])

  useDeliveryHeaderSync({
    viewMode, selectedOrder, searchQuery, setSearchQuery, isDesktop,
    hasSelectedOrder: Boolean(effectiveSelectedOrderId), viewHistoryLength: viewHistory.length,
    popView, onBackToDashboard, setCustomTitle, setCustomBack, setCustomActions,
  })

  const {
    handleUpdateStatus, handleAssignMotoboy, handleDeleteOrder, handleSaveOrderEdits, handleConfirmDeliveryOrder,
  } = useDeliveryOperations({
    tenantId, rawOrders, effectiveSelectedOrderId, editingOrderId, setEditingOrderId,
    setSelectedOrderId, popView, pushView, setViewHistory, isDesktopRef, orders, viewMode,
  })

  return (
    <ViewTransition viewKey={viewMode} flex="1" minH="0">
      <DeliveryViewRouter
        viewMode={viewMode} selectedOrder={selectedOrder} selectedClient={selectedClient} setSelectedClient={setSelectedClient}
        editingOrderId={editingOrderId} setEditingOrderId={setEditingOrderId} popView={popView} pushView={pushView}
        orders={orders} effectiveSelectedOrderId={effectiveSelectedOrderId} searchQuery={searchQuery}
        handleSelectOrder={handleSelectOrder} handleAssignMotoboy={handleAssignMotoboy} handleSaveOrderEdits={handleSaveOrderEdits}
        handleConfirmDeliveryOrder={handleConfirmDeliveryOrder} handleDeleteOrder={handleDeleteOrder} handleUpdateStatus={handleUpdateStatus}
        setCustomActions={setCustomActions} setCustomTitle={setCustomTitle} setCustomBack={setCustomBack}
      />
    </ViewTransition>
  )
}
