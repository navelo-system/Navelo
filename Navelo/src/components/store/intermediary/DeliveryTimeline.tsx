import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { CheckCircle2, ChefHat, Package, Bike, MapPin, Clock, LucideIcon } from "lucide-react"

export type DeliveryStatus = "confirmed" | "preparing" | "ready" | "dispatched" | "delivered"

export interface TimelineStepProps {
  step: { key: string; label: string; icon: LucideIcon }
  isActive: boolean
  isCompleted: boolean
  isPending: boolean
  isLast: boolean
  idx: number
  activeIndex: number
}

export function TimelineStep({ step, isActive, isCompleted, isLast }: TimelineStepProps) {
  // Reduces complexity by mapping state to styles
  const state = isActive ? "active" : isCompleted ? "completed" : "pending"
  
  type StyleEntry = {
    bg: string
    border: string
    iconColor: "white" | "success" | "muted"
    fontVar: "body-bold" | "auxiliary"
    fontColor: "primary" | "foreground" | "muted"
  }

  const styles: Record<"active" | "completed" | "pending", StyleEntry> = {
    active: { bg: "bg-brand-primary", border: "border-brand-primary", iconColor: "white", fontVar: "body-bold", fontColor: "primary" },
    completed: { bg: "bg-emerald-500/10", border: "border-emerald-500/80", iconColor: "success", fontVar: "auxiliary", fontColor: "foreground" },
    pending: { bg: "bg-surface-sunken", border: "border-border", iconColor: "muted", fontVar: "auxiliary", fontColor: "muted" },
  }
  
  const current = styles[state]

  return (
    <Stack align="center" gap={2.5} flex="1">
      <Box position="relative" w="full">
        <Stack align="center" gap={2.5}>
          {/* Visual Circle Indicator */}
          <Box
            padding={2.5}
            radius="full"
            border
            bg={current.bg}
            borderColor={current.border}
            zIndex="10"
          >
            <Icon icon={step.icon} size={16} color={current.iconColor} />
          </Box>
  
          {/* Text Label */}
          <Box paddingY={2.5}>
            <Font
              variant={current.fontVar}
              color={current.fontColor}
              text={step.label}
              align="center"
            />
          </Box>
        </Stack>
  
        {/* Connector Line (except for last step) */}
        {!isLast && (
          <Box
            position="absolute"
            top="18px"
            left="calc(50% + 20px)"
            w="min-[450px]:w-[calc(100%-40px)] w-[calc(100%-40px)]"
            h="h-[2px]"
            zIndex="0"
            bg={isCompleted ? "bg-brand-success" : "bg-border"}
          />
        )}
      </Box>
    </Stack>
  )
}

export interface DeliveryTimelineProps {
  status: DeliveryStatus
  motoboyName?: string
  estimatedTime?: string
  address?: string
}

const STEPS = [
  { key: "confirmed", label: "Confirmado", icon: CheckCircle2 },
  { key: "preparing", label: "Preparando", icon: ChefHat },
  { key: "ready", label: "Pronto", icon: Package },
  { key: "dispatched", label: "Em Rota", icon: Bike },
  { key: "delivered", label: "Entregue", icon: MapPin },
]

const STATUS_INDEX: Record<DeliveryStatus, number> = {
  confirmed: 0,
  preparing: 1,
  ready: 2,
  dispatched: 3,
  delivered: 4,
}

export const DeliveryTimeline: React.FC<DeliveryTimelineProps> = ({
  status,
  motoboyName = "Carlos Silva",
  estimatedTime = "25 min",
  address = "Av. Paulista, 1000 - Cj 12 - São Paulo/SP",
}) => {
  const activeIndex = STATUS_INDEX[status]

  return (
    <Box padding={5} bg="bg-surface" radius="default">
      <Stack gap={5}>
        <Stack direction="row" align="center" justify="between" gap={5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Clock} color="primary" size={18} />
            <Font variant="body-bold" text={`Entrega Estimada: ${estimatedTime}`} />
          </Stack>
          <Font variant="description" text="Pedido #8942" />
        </Stack>

        <Box h="h-[2px]" w="full" bg="bg-border" opacity="25" />

        <Box w="full" overflow="auto">
          <Box paddingY={5} w="w-full" minW="w-[450px]">
            <Stack direction="row" align="start" justify="between" gap={0}>
              {STEPS.map((step, idx) => {
              const isCompleted = idx < activeIndex
              const isActive = idx === activeIndex
              const isPending = idx > activeIndex
  
              return (
                <TimelineStep 
                  key={step.key}
                  step={step}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  isPending={isPending}
                  isLast={idx === STEPS.length - 1}
                  idx={idx}
                  activeIndex={activeIndex}
                />
              )
            })}
            </Stack>
          </Box>
        </Box>

        <Box h="h-[2px]" w="full" bg="bg-border" opacity="25" />

        <Stack gap={2.5}>
          <Stack direction="row" align="center" justify="between" gap={5}>
            <Stack gap={0}>
              <Font variant="auxiliary" text="Entregador Parceiro" />
              <Font variant="body-medium" text={motoboyName} />
            </Stack>
            <Stack align="end" gap={0}>
              <Font variant="auxiliary" text="Canal de Origem" />
              <Font variant="body-bold" text="iFood Delivery" color="danger" />
            </Stack>
          </Stack>

          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={MapPin} size={16} color="secondary" />
            <Font variant="description" text={address} truncate={true} />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
