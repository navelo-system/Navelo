"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Grid } from "../../base/Grid"
import { Font } from "../../base/Font"
import { Button } from "../../base/Button"
import { EmptyState } from "../../intermediary/EmptyState"
import { DeliveryTimeline, DeliveryStatus } from "../../intermediary/DeliveryTimeline"
import { DeliveryForm } from "../../advanced/DeliveryForm"
import { DeliveryOrdersList, DeliveryOrder } from "../../advanced/DeliveryOrdersList"
import { Truck } from "lucide-react"

export const DeliverySection: React.FC = () => {
  const [orders, setOrders] = React.useState<DeliveryOrder[]>([
    { id: "8942", clientName: "Filipe Augusto", address: "Av. Paulista, 1000 - Cj 12 - São Paulo/SP", status: "preparing", estimatedTime: "25 min", total: 45.00, motoboy: "Carlos Silva" },
    { id: "8943", clientName: "Maria Eduarda", address: "Rua Augusta, 450 - Ap 31 - São Paulo/SP", status: "ready", estimatedTime: "10 min", total: 68.50, motoboy: "Pedro Souza" },
    { id: "8944", clientName: "José Alencar", address: "Rua Bela Cintra, 890 - Cerqueira César - São Paulo/SP", status: "confirmed", estimatedTime: "45 min", total: 32.00, motoboy: "Sem Motoboy" },
  ])

  const [selectedOrderId, setSelectedOrderId] = React.useState<string>("8942")

  const selectedOrder = orders.find((o) => o.id === selectedOrderId)

  const handleCreateOrder = (data: { clientName: string; address: string; total: number }) => {
    const newOrder: DeliveryOrder = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      clientName: data.clientName,
      address: data.address,
      status: "confirmed",
      estimatedTime: "30-40 min",
      total: data.total,
      motoboy: "Sem Motoboy",
    }

    setOrders((prev) => [newOrder, ...prev])
    setSelectedOrderId(newOrder.id)
  }

  const handleUpdateStatus = (status: DeliveryStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrderId ? { ...o, status } : o))
    )
  }


  return (
    <Stack gap={12} w="full">
      {/* Grade Principal: Pedidos à esquerda (1/3) e Detalhes/Timeline à direita (restante) (vertical no mobile, lado a lado no PC) */}
      <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch">
        
        {/* Painel Esquerdo (1/3 no PC, 100% no mobile) */}
        <Box w="full" className="md:w-1/3">
          <Stack gap={5}>
            {/* Novo Pedido */}
            <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
              <DeliveryForm onSubmit={handleCreateOrder} />
            </Box>

            {/* Busca e Lista de Rastreamento */}
            <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
              <DeliveryOrdersList
                orders={orders}
                selectedOrderId={selectedOrderId}
                onSelectOrder={setSelectedOrderId}
              />
            </Box>
          </Stack>
        </Box>

        {/* Painel Direito (Restante) - Timeline e Controle de Status */}
        <Box flex="1">
          <Stack gap={5}>
            {selectedOrder ? (
              <Stack gap={5} w="full">
                {/* Timeline real do pedido */}
                <DeliveryTimeline
                  status={selectedOrder.status}
                  estimatedTime={selectedOrder.estimatedTime}
                  motoboyName={selectedOrder.motoboy}
                  address={selectedOrder.address}
                />

                {/* Botões de Avanço de Status */}
                <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
                  <Stack gap={2.5}>
                    <Font variant="body-bold" text="Mudar Status do Pedido" />
                    <Grid cols={3} gap={2.5}>
                      <Button
                        variant={selectedOrder.status === "confirmed" ? "primary" : "outline"}
                        label="Confirmar"
                        onClick={() => handleUpdateStatus("confirmed")}
                      />
                      <Button
                        variant={selectedOrder.status === "preparing" ? "primary" : "outline"}
                        label="Preparando"
                        onClick={() => handleUpdateStatus("preparing")}
                      />
                      <Button
                        variant={selectedOrder.status === "ready" ? "primary" : "outline"}
                        label="Pronto"
                        onClick={() => handleUpdateStatus("ready")}
                      />
                      <Button
                        variant={selectedOrder.status === "dispatched" ? "primary" : "outline"}
                        label="Despachar"
                        onClick={() => handleUpdateStatus("dispatched")}
                      />
                      <Button
                        variant={selectedOrder.status === "delivered" ? "primary" : "outline"}
                        label="Entregar"
                        onClick={() => handleUpdateStatus("delivered")}
                      />
                    </Grid>
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
    </Stack>
  )
}
