import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Users, Clock } from "lucide-react"

export type TableStatus = "free" | "occupied" | "closing"

export interface TableCardProps {
  tableNumber: string | number
  status: TableStatus
  capacity?: number
  time?: string
  onClick?: () => void
}

const statusConfig = {
  free: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    textColor: "success" as const,
    label: "Livre",
    accent: "bg-emerald-500",
  },
  occupied: {
    bg: "bg-brand-primary/10",
    border: "border-brand-primary/30",
    textColor: "primary" as const,
    label: "Ocupada",
    accent: "bg-brand-primary",
  },
  closing: {
    bg: "bg-brand-secondary/10",
    border: "border-brand-secondary/30",
    textColor: "brand-secondary" as const,
    label: "Fechando",
    accent: "bg-brand-secondary",
  },
}

export const TableCard: React.FC<TableCardProps> = ({
  tableNumber,
  status,
  capacity,
  time,
  onClick,
}) => {
  const config = statusConfig[status]

  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      position="relative"
      w="full"
      radius="default"
      border
      borderColor={config.border}
      bg={config.bg}
      overflow="hidden"
      cursor="pointer"
    >
      {/* Top Accent Line */}
      <Box position="absolute" top={0} left={0} right={0} h="h-1" bg={config.accent} />

      <Box padding={5}>
        <Stack gap={2.5}>
          <Stack direction="row" align="start" justify="between" gap={2.5}>
            <Stack gap={0}>
              <Font variant="h3" text={String(tableNumber)} color={config.textColor} />
              <Font variant="body-bold" text={config.label} color={config.textColor} />
            </Stack>

            {capacity && (
              <Stack direction="row" align="center" gap={1}>
                <Users size={14} color="var(--text-muted)" />
                <Font variant="description" text={String(capacity)} />
              </Stack>
            )}
          </Stack>

          {time && status !== "free" && (
            <>
              <Box h="h-[2px]" w="full" bg={config.border} />
              <Box paddingY={2.5}>
                <Stack direction="row" align="center" gap={1}>
                  <Clock size={14} color="var(--text-muted)" />
                  <Font variant="description" text={time} />
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  )
}
