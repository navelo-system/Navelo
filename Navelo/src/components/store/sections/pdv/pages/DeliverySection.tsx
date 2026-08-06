"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Tabs, TabsTrigger } from "@/components/store/base/Tabs"
import { Button } from "@/components/store/base/Button"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { DeliveryTimeline, DeliveryStatus } from "@/components/store/intermediary/DeliveryTimeline"
import { DeliveryOrdersList, DeliveryOrder } from "@/components/store/advanced/DeliveryOrdersList"
import { DeliveryClientFormScreen } from "@/components/store/advanced/DeliveryClientFormScreen"
import { DeliveryClientInfo } from "@/components/store/advanced/DeliveryCheckoutConfirmation"
import { PdvSection, CartItemType } from "@/components/store/sections/pdv/pages/PdvSection"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { Truck, Plus } from "lucide-react"
import { useTenant } from "@/lib/context/TenantContext"
import { useDeliveryOrders, dal, DeliveryOrderEntity } from "@/lib/dal"
import { ViewTransition } from "@/components/store/base/ViewTransition"

export interface DeliverySectionProps {
  setCustomActions?: (actions: React.ReactNode) => void
  setCustomTitle?: (title: string | null) => void
  setCustomBack?: (cb: (() => void) | null) => void
  onBackToDashboard?: () => void
}

export const DeliverySection: React.FC<DeliverySectionProps> = ({
  setCustomActions,
  setCustomTitle,
  setCustomBack,
  onBackToDashboard,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"

  // Pilha de histórico de navegação interna do Delivery
  const [viewHistory, setViewHistory] = React.useState<("list" | "client-form" | "pos")[]>(["list"])
  const viewMode = viewHistory[viewHistory.length - 1] || "list"

  const pushView = React.useCallback((newView: "list" | "client-form" | "pos") => {
    setViewHistory((prev) => [...prev, newView])
  }, [])

  const popView = React.useCallback(() => {
    setViewHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }, [])

  // Pedidos reais obtidos da DAL via Dexie
  const rawOrders = useDeliveryOrders(tenantId)
  const orders: DeliveryOrder[] = React.useMemo(() => {
    if (!Array.isArray(rawOrders)) return []
    return rawOrders.map((o: DeliveryOrderEntity) => ({
      id: o.id,
      clientName: o.client_name,
      address: o.address,
      status: o.status as DeliveryStatus,
      estimatedTime: o.estimated_time || "30-45 min",
      total: o.total,
      motoboy: o.motoboy || "Sem Motoboy",
    }))
  }, [rawOrders])

  const [selectedOrderId, setSelectedOrderId] = React.useState<string>("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedClient, setSelectedClient] = React.useState<DeliveryClientInfo | null>(null)

  // Atualiza selectedOrderId quando a lista de pedidos carregar
  const [prevOrders, setPrevOrders] = React.useState(orders)
  if (orders !== prevOrders) {
    setPrevOrders(orders)
    if (orders.length > 0) {
      if (!selectedOrderId || !orders.some((o) => o.id === selectedOrderId)) {
        setSelectedOrderId(orders[0].id)
      }
    } else {
      setSelectedOrderId("")
    }
  }

  // Refs estáveis para callbacks do Header para evitar loops de render
  const onBackRef = React.useRef(onBackToDashboard)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomActionsRef = React.useRef(setCustomActions)

  React.useEffect(() => {
    onBackRef.current = onBackToDashboard
  }, [onBackToDashboard])

  React.useEffect(() => {
    setCustomTitleRef.current = setCustomTitle
  }, [setCustomTitle])

  React.useEffect(() => {
    setCustomBackRef.current = setCustomBack
  }, [setCustomBack])

  React.useEffect(() => {
    setCustomActionsRef.current = setCustomActions
  }, [setCustomActions])

  // Header no modo listagem
  React.useEffect(() => {
    if (viewMode === "list") {
      setCustomTitleRef.current?.("Delivery")
      if (viewHistory.length > 1) {
        setCustomBackRef.current?.(() => popView)
      } else if (onBackRef.current) {
        setCustomBackRef.current?.(() => () => onBackRef.current?.())
      } else {
        setCustomBackRef.current?.(null)
      }
      setCustomActionsRef.current?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder="Buscar por cliente ou ID..."
        />
      )
    }

    return () => {
      if (viewMode === "list") {
        setCustomActionsRef.current?.(null)
      }
    }
  }, [viewMode, searchQuery, viewHistory.length, popView])

  const selectedOrder = orders.find((o) => o.id === selectedOrderId)

  const handleOpenNewOrder = () => {
    setSelectedClient(null)
    pushView("client-form")
  }

  const handleSelectClient = (client: DeliveryClientInfo) => {
    setSelectedClient(client)
    pushView("pos")
  }

  const handleUpdateStatus = async (status: DeliveryStatus) => {
    if (!selectedOrderId) return
    try {
      await dal.deliveryOrders.update({
        id: selectedOrderId,
        status,
        company_id: tenantId,
        tenant_id: tenantId,
      })
    } catch (err) {
      console.error("Erro ao atualizar status do pedido de delivery:", err)
    }
  }

  const handleConfirmDeliveryOrder = async (orderData: {
    status: string
    deliveryType: string
    paymentMoment: string
    client: DeliveryClientInfo
    items: CartItemType[]
    total: number
    subtotal: number
    discount: number
  }) => {
    const orderId = Math.floor(1000 + Math.random() * 9000).toString()

    const deliveryStatus: DeliveryStatus = orderData.status.includes("Confirmado")
      ? "confirmed"
      : "preparing"

    // 1. Registra o pedido de delivery no Dexie
    try {
      await dal.deliveryOrders.create({
        id: orderId,
        tenant_id: tenantId,
        company_id: tenantId,
        client_name: orderData.client.name,
        address: orderData.client.address || "Endereço não informado",
        status: deliveryStatus,
        estimated_time: "30-45 min",
        total: orderData.total,
        motoboy: "Sem Motoboy",
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      console.error("Erro ao registrar pedido de delivery na DAL:", err)
    }

    // 2. Registra a venda no Dexie para persistência multi-tenant isolada
    const saleId = `sale-${Date.now()}`
    try {
      await dal.sales.create({
        id: saleId,
        tenant_id: tenantId,
        company_id: tenantId,
        items: orderData.items.map((it) => ({
          productId: it.id,
          productName: it.name,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          totalPrice: it.quantity * it.unitPrice,
        })),
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        total: orderData.total,
        paymentMethod: `Delivery (${orderData.paymentMoment})`,
        status: "COMPLETED",
        customer_name: orderData.client.name,
        customer_id: orderData.client.customerId,
      })
    } catch (err) {
      console.error("Erro ao registrar venda do delivery na DAL:", err)
    }

    setSelectedOrderId(orderId)
    setViewHistory(["list"])
  }

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
          onBackToDashboard={popView}
          setCustomActions={setCustomActions}
          setCustomTitle={setCustomTitle}
          setCustomBack={setCustomBack}
          deliveryContext={{
            client: selectedClient || { name: "Cliente Delivery", phone: "", address: "" },
            onAlterClient: () => pushView("client-form"),
            onConfirmDelivery: handleConfirmDeliveryOrder,
          }}
        />
      )}

      {viewMode === "list" && (
        orders.length === 0 ? (
          <Box w="full" h="full" position="relative">
            <EmptyState
              icon={Truck}
              title="Nenhum pedido de delivery"
              subtitle="Clique no botão + abaixo para iniciar um novo pedido pelo caixa."
            />

            {/* Botão FAB fixo no canto inferior direito para adicionar novo pedido */}
            <Box position="fixed" bottom={6} right={6} zIndex="50">
              <Button
                variant="secondary-pill-icon"
                icon={Plus}
                onClick={handleOpenNewOrder}
              />
            </Box>
          </Box>
        ) : (
          <Box w="full" overflow="auto" position="relative">
            {/* Layout lado a lado: Lista de pedidos à esquerda (1/3) e Timeline/Detalhes à direita */}
            <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch">
              {/* Painel Esquerdo: Lista de Pedidos */}
              <Box w="w-full md:w-1/3">
                <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
                  <DeliveryOrdersList
                    orders={orders}
                    selectedOrderId={selectedOrderId}
                    onSelectOrder={setSelectedOrderId}
                    searchQuery={searchQuery}
                  />
                </Box>
              </Box>

              {/* Painel Direito: Timeline do Pedido Selecionado */}
              <Box flex="1">
                <Stack gap={5} w="full">
                  {selectedOrder ? (
                    <Stack gap={5} w="full">
                      <DeliveryTimeline
                        orderId={selectedOrder.id}
                        status={selectedOrder.status}
                        estimatedTime={selectedOrder.estimatedTime}
                        motoboyName={selectedOrder.motoboy}
                        address={selectedOrder.address}
                      />

                      {/* Controle de Status */}
                      <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
                        <Stack gap={2.5}>
                          <Font variant="body-bold" text="Mudar Status do Pedido" />
                          <Box w="full" overflow="auto">
                            <Tabs
                              value={selectedOrder.status}
                              onValueChange={(val) => handleUpdateStatus(val as DeliveryStatus)}
                            >
                              <Stack direction="row" gap={2.5}>
                                <TabsTrigger value="confirmed">Confirmar</TabsTrigger>
                                <TabsTrigger value="preparing">Preparando</TabsTrigger>
                                <TabsTrigger value="ready">Pronto</TabsTrigger>
                                <TabsTrigger value="dispatched">Despachar</TabsTrigger>
                                <TabsTrigger value="delivered">Entregar</TabsTrigger>
                              </Stack>
                            </Tabs>
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  ) : (
                    <EmptyState
                      icon={Truck}
                      title="Sem pedido selecionado"
                      subtitle="Selecione um pedido de delivery para rastrear."
                    />
                  )}
                </Stack>
              </Box>
            </Stack>

            {/* Botão FAB fixo no canto inferior direito para adicionar novo pedido */}
            <Box position="fixed" bottom={6} right={6} zIndex="50">
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
