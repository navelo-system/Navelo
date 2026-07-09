"use client"

import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Input } from "../base/Input"
import { Badge } from "../base/Badge"
import { Font } from "../base/Font"
import { Search } from "lucide-react"
import { DeliveryStatus } from "../intermediary/DeliveryTimeline"

export interface DeliveryOrder {
  id: string
  clientName: string
  address: string
  status: DeliveryStatus
  estimatedTime: string
  total: number
  motoboy: string
}

export interface DeliveryOrdersListProps {
  orders: DeliveryOrder[]
  selectedOrderId: string
  onSelectOrder: (id: string) => void
}

const statusBadgeMap: Record<DeliveryStatus, { variant: "primary" | "secondary" | "success" | "outline" | "default"; label: string }> = {
  confirmed: { variant: "primary", label: "Confirmado" },
  preparing: { variant: "secondary", label: "Preparando" },
  ready: { variant: "success", label: "Pronto" },
  dispatched: { variant: "outline", label: "Em Rota" },
  delivered: { variant: "success", label: "Entregue" },
}

export const DeliveryOrdersList: React.FC<DeliveryOrdersListProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filtered = orders.filter((o) =>
    o.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.id.includes(searchQuery)
  )

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Stack gap={5}>
      <Input
        placeholder="Buscar por cliente ou ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={Search}
      />

      <Box overflow="auto">
        <Stack gap={2.5}>
          {filtered.map((ord) => {
            const isSelected = ord.id === selectedOrderId
            const statusInfo = statusBadgeMap[ord.status] || { variant: "default" as const, label: ord.status }
            return (
              <Box
                key={ord.id}
                as="button"
                onClick={() => onSelectOrder(ord.id)}
                padding={2.5}
                bg={isSelected ? "bg-brand-primary/10" : "bg-surface"}
                radius="default"
                border={true}
                borderColor={isSelected ? "border-brand-primary" : "border-border"}
                w="full"
                hoverBg="surface-sunken"
              >
                <Stack gap={1} align="start" w="full">
                  <Stack direction="row" justify="between" align="center" w="full">
                    <Font variant="body-bold" text={`#${ord.id} - ${ord.clientName}`} align="left" />
                    <Font variant="body-sm-semibold" color="secondary" text={formatPrice(ord.total)} />
                  </Stack>
                  <Font variant="auxiliary" color="muted" text={ord.address} align="left" />
                  <Stack direction="row" justify="between" align="center" w="full">
                    <Font variant="sub-tiny" color="muted" text={`Estimativa: ${ord.estimatedTime}`} align="left" />
                    <Badge variant={statusInfo.variant} label={statusInfo.label} />
                  </Stack>
                </Stack>
              </Box>
            )
          })}
        </Stack>
      </Box>
    </Stack>
  )
}
