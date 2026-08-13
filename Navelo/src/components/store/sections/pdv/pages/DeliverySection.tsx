"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Button } from "@/components/store/base/Button"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { DeliveryTimeline, DeliveryStatus } from "@/components/store/intermediary/DeliveryTimeline"
import { DeliveryOrdersList, DeliveryOrder } from "@/components/store/advanced/DeliveryOrdersList"
import { DeliveryClientFormScreen } from "@/components/store/advanced/DeliveryClientFormScreen"
import { DeliveryRidersScreen } from "@/components/store/advanced/DeliveryRidersScreen"
import { DeliveryClientInfo } from "@/components/store/advanced/DeliveryCheckoutConfirmation"
import { PdvSection, CartItemType } from "@/components/store/sections/pdv/pages/PdvSection"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { Truck, Plus, Printer } from "lucide-react"
import { useTenant } from "@/lib/context/TenantContext"
import { useDeliveryOrders, dal, Rider, DeliveryRate } from "@/lib/dal"
import { ViewTransition } from "@/components/store/base/ViewTransition"

export interface DeliverySectionProps {
  setCustomActions?: (actions: React.ReactNode) => void
  setCustomTitle?: (title: string | null) => void
  setCustomBack?: (cb: (() => void) | null) => void
  onBackToDashboard?: () => void
}

export interface ExtendedDeliveryOrder extends DeliveryOrder {
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

export const DeliverySection: React.FC<DeliverySectionProps> = ({
  setCustomActions,
  setCustomTitle,
  setCustomBack,
  onBackToDashboard,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const isDesktop = useIsDesktop()
  const isDesktopRef = React.useRef(isDesktop)

  React.useEffect(() => {
    isDesktopRef.current = isDesktop
  }, [isDesktop])

  // Pilha de histórico de navegação interna do Delivery
  const [viewHistory, setViewHistory] = React.useState<DeliveryView[]>(["list"])
  const viewMode = viewHistory[viewHistory.length - 1] || "list"

  const pushView = React.useCallback((newView: DeliveryView) => {
    setViewHistory((prev) => [...prev, newView])
  }, [])

  const popView = React.useCallback(() => {
    setViewHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }, [])

  // Pedidos reais obtidos da DAL via Dexie
  const rawOrders = useDeliveryOrders(tenantId)
  const orders: ExtendedDeliveryOrder[] = React.useMemo(() => {
    if (!Array.isArray(rawOrders)) return []
    return rawOrders.map((o: any) => {
      const parsedItems = Array.isArray(o.items) ? o.items : [
        { id: "1", name: "ÁGUA COM GÁS", quantity: 1, unitPrice: 6.0, totalPrice: 6.0 },
        { id: "2", name: "ÁGUA SEM GÁS", quantity: 1, unitPrice: 3.0, totalPrice: 3.0 },
        { id: "3", name: "ÁGUA TÔNICA 350ML", quantity: 1, unitPrice: 6.0, totalPrice: 6.0 },
      ]
      const computedItemsSubtotal = parsedItems.reduce((acc: number, it: any) => acc + (it.totalPrice || (it.quantity * it.unitPrice) || 0), 0)

      return {
        id: o.id || "",
        clientName: o.client_name || o.clientName || o.client || "Cliente Desconhecido",
        clientDocument: o.client_document || o.clientDocument || "101.389.219-46",
        clientPhone: o.client_phone || o.clientPhone || "(41) 998364028",
        address: o.address || "Endereço não informado",
        status: (o.status as DeliveryStatus) || "confirmed",
        estimatedTime: o.estimated_time || o.estimatedTime || "1 hora",
        total: typeof o.total === "number" && !isNaN(o.total) ? o.total : (parseFloat(o.total) || 0),
        subtotal: typeof o.subtotal === "number" ? o.subtotal : computedItemsSubtotal,
        discount: typeof o.discount === "number" ? o.discount : 0,
        deliveryFee: typeof o.delivery_fee === "number" ? o.delivery_fee : (o.deliveryFee ?? 10.0),
        motoboy: o.motoboy || "Entregador não selecionado",
        createdAt: o.created_at || o.createdAt,
        origin: o.origin || "Pedido realizado no Aplicativo",
        paymentMethod: o.payment_method || o.paymentMethod || "Cobrança na Entrega - Dinheiro",
        deliveryType: o.delivery_type || o.deliveryType || "Entrega no endereço",
        items: parsedItems,
      }
    })
  }, [rawOrders])

  const [selectedOrderId, setSelectedOrderId] = React.useState<string>("")
  const [editingOrderId, setEditingOrderId] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedClient, setSelectedClient] = React.useState<DeliveryClientInfo | null>(null)

  React.useEffect(() => {
    if (orders.length === 0) {
      setSelectedOrderId("")
      return
    }
    if (!isDesktop) return
    setSelectedOrderId((current) => {
      if (current && orders.some((o) => o.id === current)) return current
      return orders[0].id
    })
  }, [orders, isDesktop])

  React.useEffect(() => {
    if (isDesktop && viewMode === "order-detail") {
      setViewHistory(["list"])
    }
  }, [isDesktop, viewMode])

  // Refs estáveis para callbacks do Header para evitar loops de render
  const onBackRef = React.useRef(onBackToDashboard)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomActionsRef = React.useRef(setCustomActions)
  const selectedOrderIdRef = React.useRef(selectedOrderId)

  React.useEffect(() => {
    onBackRef.current = onBackToDashboard
    setCustomTitleRef.current = setCustomTitle
    setCustomBackRef.current = setCustomBack
    setCustomActionsRef.current = setCustomActions
    selectedOrderIdRef.current = selectedOrderId
  }, [onBackToDashboard, setCustomTitle, setCustomBack, setCustomActions, selectedOrderId])

  const selectedOrder = orders.find((o) => o.id === selectedOrderId)

  const handleSelectOrder = React.useCallback((id: string) => {
    setSelectedOrderId(id)
    if (!isDesktopRef.current) {
      pushView("order-detail")
    }
  }, [pushView])

  // Header no modo listagem com botão de impressora em tamanho normal primário
  React.useEffect(() => {
    if (viewMode === "list") {
      setCustomTitleRef.current?.("Delivery")
      if (viewHistory.length > 1) {
        setCustomBackRef.current?.(() => popView)
      } else if (onBackRef.current) {
        const backCb = onBackRef.current
        setCustomBackRef.current?.(() => backCb)
      } else {
        setCustomBackRef.current?.(null)
      }
      setCustomActionsRef.current?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder="Buscar por cliente ou ID..."
        >
          {isDesktop && selectedOrderIdRef.current ? (
            <Button variant="primary-icon" icon={Printer} title="Imprimir" />
          ) : null}
        </MobileHeaderSearch>
      )
    } else if (viewMode === "order-detail") {
      setCustomTitleRef.current?.(selectedOrder?.clientName || "Pedido")
      setCustomBackRef.current?.(() => popView)
      setCustomActionsRef.current?.(
        selectedOrder ? (
          <Button variant="primary-icon" icon={Printer} title="Imprimir" />
        ) : null
      )
    }

    return () => {
      if (viewMode === "list" || viewMode === "order-detail") {
        setCustomActionsRef.current?.(null)
      }
    }
  }, [viewMode, searchQuery, selectedOrderId, selectedOrder?.clientName, isDesktop, viewHistory.length, popView])

  const handleOpenNewOrder = () => {
    setEditingOrderId(null)
    setSelectedClient(null)
    pushView("client-form")
  }

  const handleStartEditOrder = () => {
    if (!selectedOrder) return
    setEditingOrderId(selectedOrder.id)
    setSelectedClient({
      name: selectedOrder.clientName,
      phone: selectedOrder.clientPhone,
      address: selectedOrder.address,
      document: selectedOrder.clientDocument,
    })
    pushView("pos")
  }

  const handleSelectClient = (client: DeliveryClientInfo) => {
    setSelectedClient(client)
    pushView("pos")
  }

  const handleUpdateStatus = async (status: DeliveryStatus) => {
    if (!selectedOrderId) return

    try {
      const orderToUpdate = rawOrders ? rawOrders.find((o) => o.id === selectedOrderId) : undefined
      if (orderToUpdate) {
        await dal.deliveryOrders.update({
          ...orderToUpdate,
          status,
        })
      }
    } catch (err) {
      console.error("Erro ao atualizar status do pedido de delivery:", err)
    }
  }

  const handleAssignMotoboy = async (rider: Rider) => {
    if (!selectedOrderId) return
    try {
      const orderToUpdate = rawOrders ? rawOrders.find((o) => o.id === selectedOrderId) : undefined
      if (orderToUpdate) {
        await dal.deliveryOrders.update({
          ...orderToUpdate,
          motoboy: rider.name,
        })
      }
      popView()
    } catch (err) {
      console.error("Erro ao atribuir motoboy:", err)
    }
  }

  const handleDeleteOrder = async (id: string) => {
    try {
      await dal.deliveryOrders.delete(id, tenantId || "demo-tenant")
      if (selectedOrderId === id) {
        const remaining = orders.filter((o) => o.id !== id)
        setSelectedOrderId(remaining.length > 0 && isDesktopRef.current ? remaining[0].id : "")
        if (!isDesktopRef.current && viewMode === "order-detail") {
          popView()
        }
      }
    } catch (err) {
      console.error("Erro ao deletar pedido de delivery na DAL:", err)
    }
  }

  const handleSaveOrderEdits = async (
    updatedItems: CartItemType[],
    newSubtotal: number,
    newDiscount: number
  ) => {
    if (!editingOrderId) return
    try {
      const existing = rawOrders ? rawOrders.find((o) => o.id === editingOrderId) : null
      if (existing) {
        const computedFee = existing.delivery_fee ?? 10.0
        const finalTotal = Math.max(0, newSubtotal + computedFee - newDiscount)
        await dal.deliveryOrders.update({
          ...existing,
          items: updatedItems.map((it) => ({
            id: it.id,
            name: it.name,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            totalPrice: it.quantity * it.unitPrice,
          })),
          subtotal: newSubtotal,
          discount: newDiscount,
          total: finalTotal,
        })
      }
    } catch (err) {
      console.error("Erro ao salvar alterações no pedido de delivery:", err)
    }

    setEditingOrderId(null)
    setViewHistory(["list"])
  }

  const handleConfirmDeliveryOrder = async (orderData: {
    status: string
    deliveryType: string
    paymentMoment: string
    client: DeliveryClientInfo
    rider?: Rider | null
    rate?: DeliveryRate | null
    items: CartItemType[]
    total: number
    subtotal: number
    discount: number
  }) => {
    const orderId = Math.floor(1000 + Math.random() * 9000).toString()

    // O status inicial de QUALQUER novo pedido de delivery é SEMPRE 'confirmed' ("Aberto")
    const deliveryStatus: DeliveryStatus = "confirmed"

    const motoboyName = orderData.rider?.name || "Entregador não selecionado"
    const deliveryFee = orderData.rate?.fee ?? 10.0
    const finalTotal = Math.max(0, orderData.subtotal + deliveryFee - orderData.discount)

    try {
      await dal.deliveryOrders.create({
        id: orderId,
        tenant_id: tenantId,
        company_id: tenantId,
        client_name: orderData.client.name,
        client_document: orderData.client.document || "101.389.219-46",
        client_phone: orderData.client.phone || "(41) 998364028",
        address: orderData.client.address || "Endereço não informado",
        status: deliveryStatus,
        estimated_time: "1 hora",
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        delivery_fee: deliveryFee,
        total: finalTotal,
        motoboy: motoboyName,
        created_at: new Date().toISOString(),
        items: orderData.items.map((it) => ({
          id: it.id,
          name: it.name,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          totalPrice: it.quantity * it.unitPrice,
        })),
      })

      for (const item of orderData.items) {
        const dbProduct = await dal.products.getById(item.id)
        if (dbProduct) {
          const currentStock = dbProduct.stock ?? 0
          const newStock = Math.max(0, currentStock - item.quantity)
          await dal.products.update({
            ...dbProduct,
            stock: newStock,
          })
        }
      }
    } catch (err) {
      console.error("Erro ao registrar pedido de delivery na DAL:", err)
    }

    setSelectedOrderId(orderId)
    setViewHistory(isDesktopRef.current ? ["list"] : ["list", "order-detail"])
  }

  const renderOrderTimeline = (order: ExtendedDeliveryOrder) => (
    <DeliveryTimeline
      orderId={order.id}
      status={order.status}
      clientName={order.clientName}
      clientDocument={order.clientDocument}
      clientPhone={order.clientPhone}
      motoboyName={order.motoboy}
      estimatedTime={order.estimatedTime}
      address={order.address}
      createdAt={order.createdAt}
      origin={order.origin}
      paymentMethod={order.paymentMethod}
      deliveryType={order.deliveryType}
      items={order.items}
      subtotal={order.subtotal}
      deliveryFee={order.deliveryFee}
      discount={order.discount}
      total={order.total}
      onDeleteOrder={handleDeleteOrder}
      onEditOrder={handleStartEditOrder}
      onSelectMotoboy={() => pushView("riders-select")}
      onUpdateStatus={handleUpdateStatus}
    />
  )

  return (
    <ViewTransition viewKey={viewMode} flex="1" minH="0">
      {viewMode === "client-form" && (
        <DeliveryClientFormScreen
          onBack={popView}
          onSelectClient={handleSelectClient}
          initialClient={selectedClient}
          setCustomActions={setCustomActions}
          setCustomTitle={setCustomTitle}
          setCustomBack={setCustomBack}
        />
      )}

      {viewMode === "pos" && (
        <PdvSection
          onBackToDashboard={() => {
            setEditingOrderId(null)
            popView()
          }}
          setCustomActions={setCustomActions}
          setCustomTitle={setCustomTitle}
          setCustomBack={setCustomBack}
          deliveryContext={
            editingOrderId && selectedOrder
              ? {
                  client: selectedClient || { name: selectedOrder.clientName, phone: selectedOrder.clientPhone, address: selectedOrder.address },
                  initialItems: (selectedOrder.items || []) as CartItemType[],
                  initialDiscount: selectedOrder.discount || 0,
                  isEditing: true,
                  onSaveEdits: handleSaveOrderEdits,
                  onConfirmDelivery: handleConfirmDeliveryOrder,
                }
              : {
                  client: selectedClient || { name: "Cliente Delivery", phone: "", address: "" },
                  onAlterClient: () => pushView("client-form"),
                  onConfirmDelivery: handleConfirmDeliveryOrder,
                }
          }
        />
      )}

      {viewMode === "riders-select" && (
        <DeliveryRidersScreen
          onBack={popView}
          onSelectRider={handleAssignMotoboy}
          setCustomActions={setCustomActions}
          setCustomTitle={setCustomTitle}
          setCustomBack={setCustomBack}
        />
      )}

      {viewMode === "order-detail" && selectedOrder && (
        <Box w="full" h="full" minH="0" overflow="hidden">
          {renderOrderTimeline(selectedOrder)}
        </Box>
      )}

      {viewMode === "list" && (
        orders.length === 0 ? (
          <Box w="full" h="full" position="relative">
            <EmptyState
              icon={Truck}
              title="Nenhum pedido de delivery"
              subtitle="Clique no botão + abaixo para iniciar um novo pedido pelo caixa."
            />

            <Box className="fab-fixed-bottom-right">
              <Button
                variant="secondary-pill-icon"
                icon={Plus}
                onClick={handleOpenNewOrder}
              />
            </Box>
          </Box>
        ) : (
          <Box w="full" h="full" minH="0" overflow="hidden" position="relative">
            <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" h="full">
              {/* Lista de pedidos — menu no mobile, coluna esquerda no desktop */}
              <Box w="w-full md:w-1/3" h="full" overflow="auto" flex="1" minH="0">
                <DeliveryOrdersList
                  orders={orders}
                  selectedOrderId={selectedOrderId}
                  onSelectOrder={handleSelectOrder}
                  searchQuery={searchQuery}
                />
              </Box>

              {/* Detalhes — split-view apenas no desktop */}
              <Box display="hidden md:flex" flex="1" h="full" minH="0" overflow="hidden" direction="col">
                {selectedOrder ? (
                  renderOrderTimeline(selectedOrder)
                ) : (
                  <EmptyState
                    icon={Truck}
                    title="Sem pedido selecionado"
                    subtitle="Selecione um pedido de delivery para visualizar os detalhes."
                  />
                )}
              </Box>
            </Stack>

            {/* Botão FAB fixo no canto inferior direito */}
            <Box className="fab-fixed-bottom-right">
              <Button
                variant="secondary-pill-icon"
                icon={Plus}
                onClick={handleOpenNewOrder}
              />
            </Box>
          </Box>
        )
      )}
    </ViewTransition>
  )
}
