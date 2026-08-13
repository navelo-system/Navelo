"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Badge } from "@/components/store/base/Badge"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Filter, Check } from "lucide-react"
import { DeliveryStatus } from "@/components/store/intermediary/DeliveryTimeline"

export interface DeliveryOrderItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface DeliveryOrder {
  id: string
  clientName: string
  clientDocument?: string
  clientPhone?: string
  address: string
  status: DeliveryStatus
  estimatedTime: string
  total: number
  motoboy: string
  createdAt?: string
  origin?: string
  paymentMethod?: string
  deliveryType?: string
  items?: DeliveryOrderItem[]
}

export interface DeliveryOrdersListProps {
  orders: DeliveryOrder[]
  selectedOrderId: string
  onSelectOrder: (id: string) => void
  searchQuery?: string
}

const statusBadgeMap: Record<DeliveryStatus, { variant: "primary" | "secondary" | "success" | "outline" | "default"; label: string }> = {
  confirmed: { variant: "primary", label: "Aberto" },
  preparing: { variant: "secondary", label: "Em preparo" },
  ready: { variant: "success", label: "Pronto para retirar" },
  dispatched: { variant: "secondary", label: "Saiu para entrega" },
  delivered: { variant: "success", label: "Entregue" },
}

const ALL_STATUS_OPTIONS: { key: DeliveryStatus; label: string }[] = [
  { key: "confirmed", label: "Aberto" },
  { key: "preparing", label: "Em preparo" },
  { key: "ready", label: "Pronto para retirar / entregar" },
  { key: "dispatched", label: "Saiu para entrega" },
  { key: "delivered", label: "Entregue" },
]

export const DeliveryOrdersList: React.FC<DeliveryOrdersListProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  searchQuery = "",
}) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [selectedStatuses, setSelectedStatuses] = React.useState<DeliveryStatus[]>([])

  const handleToggleStatusFilter = (st: DeliveryStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
    )
  }

  const handleClearFilter = () => {
    setSelectedStatuses([])
  }

  const filtered = React.useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        (o.clientName || "").toLowerCase().includes((searchQuery || "").toLowerCase()) ||
        (o.id || "").includes(searchQuery || "") ||
        (o.address || "").toLowerCase().includes((searchQuery || "").toLowerCase())

      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(o.status)

      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, selectedStatuses])

  const getStatusCount = (st: DeliveryStatus) => {
    return orders.filter((o) => o.status === st).length
  }

  return (
    <Stack gap={2.5} w="full">
      {/* Header do painel de pedidos */}
      <Box paddingX={2.5} paddingY={2.5} w="full">
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body-bold" text="Pedidos" />
          <Box position="relative">
            <Button
              variant="secondary-icon-xs"
              icon={Filter}
              title="Filtrar por status"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            />

            {/* Menu suspenso de filtro de status (Print 3) */}
            {isFilterOpen && (
              <Box
                position="absolute"
                top="100%"
                right="0"
                zIndex="50"
                w="w-64"
                bg="bg-surface"
                radius="default"
                border={true}
                borderColor="border-border"
                padding={2.5}
              >
                <Stack gap={2.5} w="full">
                  <Font variant="body-sm-semibold" text="Filtrar por status" />
                  <Stack gap={1} w="full">
                    {ALL_STATUS_OPTIONS.map((opt) => {
                      const count = getStatusCount(opt.key)
                      const isChecked = selectedStatuses.includes(opt.key)
                      return (
                        <Box
                          key={opt.key}
                          padding={1}
                          cursor="pointer"
                          hoverBg="secondary/10"
                          radius="default"
                          onClick={() => handleToggleStatusFilter(opt.key)}
                          w="full"
                        >
                          <Stack direction="row" align="center" justify="between" w="full">
                            <Stack direction="row" align="center" gap={2.5}>
                              <Box
                                padding={1}
                                radius="default"
                                border={true}
                                borderColor={isChecked ? "border-brand-primary" : "border-border"}
                                bg={isChecked ? "bg-brand-primary" : "transparent"}
                              >
                                <Check size={12} className={isChecked ? "text-white" : "opacity-0"} />
                              </Box>
                              <Font variant="body-sm-medium" text={`${opt.label} (${count})`} />
                            </Stack>
                          </Stack>
                        </Box>
                      )
                    })}
                  </Stack>

                  <Box h="h-[2px]" bg="bg-border" w="full" />

                  <Stack direction="row" justify="between" gap={2.5} w="full">
                    <Button
                      variant="secondary-xs"
                      label="Limpar"
                      onClick={handleClearFilter}
                    />
                    <Button
                      variant="primary-xs"
                      label="Aplicar"
                      onClick={() => setIsFilterOpen(false)}
                    />
                  </Stack>
                </Stack>
              </Box>
            )}
          </Box>
        </Stack>
      </Box>

      {/* Lista de Pedidos */}
      <Box overflow="auto" w="full">
        <Stack gap={2.5} w="full">
          {filtered.map((ord) => {
            const isSelected = ord.id === selectedOrderId
            const statusInfo = statusBadgeMap[ord.status] || { variant: "default" as const, label: ord.status }
            const dateStr = ord.createdAt
              ? new Date(ord.createdAt).toLocaleDateString("pt-BR") + " " + new Date(ord.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
              : "07/08/2026 13:45"

            return (
              <Box
                key={ord.id}
                onClick={() => onSelectOrder(ord.id)}
                padding={2.5}
                bg="bg-surface"
                radius="default"
                border={true}
                borderColor={isSelected ? "border-brand-secondary" : "border-border"}
                w="full"
                hoverBg="secondary/10"
                cursor="pointer"
              >
                <Stack gap={1} align="start" w="full">
                  {/* Linha superior: Data/Hora e Badge de Status com relógio */}
                  <Stack direction="row" justify="between" align="center" w="full">
                    <Font variant="auxiliary" color="muted" text={dateStr} align="left" />
                    <Stack direction="row" align="center" gap={1}>
                      <Badge
                        variant={statusInfo.variant}
                        label={`${statusInfo.label} ⏱ ${ord.estimatedTime || "1 hora"}`}
                      />
                    </Stack>
                  </Stack>

                  {/* Nome do Cliente */}
                  <Font variant="body-bold" text={ord.clientName} align="left" />

                  {/* Endereço */}
                  <Font
                    variant="auxiliary"
                    color="muted"
                    text={ord.address}
                    align="left"
                    truncate={true}
                  />
                </Stack>
              </Box>
            )
          })}
        </Stack>
      </Box>
    </Stack>
  )
}
