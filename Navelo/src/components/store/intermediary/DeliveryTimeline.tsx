import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Icon } from "../base/Icon"
import { CheckCircle2, ChefHat, Package, Bike, MapPin, Clock } from "lucide-react"

export type DeliveryStatus = "confirmed" | "preparing" | "ready" | "dispatched" | "delivered"

export interface DeliveryTimelineProps {
  status: DeliveryStatus
  motoboyName?: string
  estimatedTime?: string
  address?: string
}

export const DeliveryTimeline: React.FC<DeliveryTimelineProps> = ({
  status,
  motoboyName = "Carlos Silva",
  estimatedTime = "25 min",
  address = "Av. Paulista, 1000 - Cj 12 - São Paulo/SP",
}) => {
  const steps = [
    { key: "confirmed", label: "Confirmado", icon: CheckCircle2 },
    { key: "preparing", label: "Preparando", icon: ChefHat },
    { key: "ready", label: "Pronto", icon: Package },
    { key: "dispatched", label: "Em Rota", icon: Bike },
    { key: "delivered", label: "Entregue", icon: MapPin },
  ]

  const getStatusIndex = (current: DeliveryStatus) => {
    const indices: Record<DeliveryStatus, number> = {
      confirmed: 0,
      preparing: 1,
      ready: 2,
      dispatched: 3,
      delivered: 4,
    }
    return indices[current]
  }

  const activeIndex = getStatusIndex(status)

  return (
    <Box padding={5} bg="bg-surface" radius="default">
      <Stack gap={5}>
        {/* Timeline Header */}
        <Stack direction="row" align="center" justify="between" gap={5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Clock} color="primary" size={18} />
            <Font variant="body-bold" text={`Entrega Estimada: ${estimatedTime}`} />
          </Stack>
          <Font variant="description" text="Pedido #8942" />
        </Stack>

        <div className="h-[2px] bg-border w-full" />

        {/* Stepper Progress */}
        <Stack direction="row" align="center" justify="between" gap={2.5} className="py-4">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeIndex
            const isActive = idx === activeIndex
            const isPending = idx > activeIndex

            return (
              <Stack key={step.key} align="center" gap={2.5} className="flex-1 relative">
                {/* Visual Circle Indicator */}
                <Box
                  padding={2.5}
                  radius="full"
                  border
                  bg={isActive ? "bg-brand-primary" : isCompleted ? "bg-emerald-500/10" : "bg-surface-sunken"}
                  borderColor={isActive ? "border-brand-primary" : isCompleted ? "border-emerald-500/80" : "border-border"}
                >
                  <Icon
                    icon={step.icon}
                    size={16}
                    color={isActive ? "white" : isCompleted ? "success" : "muted"}
                  />
                </Box>

                {/* Text Label */}
                <Font
                  variant={isActive ? "body-bold" : "auxiliary"}
                  color={isActive ? "primary" : isCompleted ? "foreground" : "muted"}
                  text={step.label}
                  className="text-center"
                />

                {/* Connector Line (except for last step) */}
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-[calc(50%+24px)] w-[calc(100%-48px)] h-[2px] z-0 ${idx < activeIndex ? "bg-emerald-500" : "bg-border"
                      }`}
                  />
                )}
              </Stack>
            )
          })}
        </Stack>

        <div className="h-[2px] bg-border w-full" />

        {/* Delivery Details */}
        <Stack gap={2.5}>
          <Stack direction="row" align="center" justify="between" gap={5}>
            <Stack gap={0}>
              <Font variant="auxiliary" text="Entregador Parceiro" />
              <Font variant="body-medium" text={motoboyName} />
            </Stack>
            <Stack align="end" gap={0}>
              <Font variant="auxiliary" text="Canal de Origem" />
              <Font variant="body-bold" text="iFood Delivery" className="text-red-500" />
            </Stack>
          </Stack>

          <Stack direction="row" align="center" gap={2.5} className="mt-2">
            <Icon icon={MapPin} size={16} color="secondary" />
            <Font variant="description" text={address} className="truncate" />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
