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
    text: "text-emerald-600",
    label: "Livre",
    accent: "bg-emerald-500",
  },
  occupied: {
    bg: "bg-brand-primary/10",
    border: "border-brand-primary/30",
    text: "text-brand-primary",
    label: "Ocupada",
    accent: "bg-brand-primary",
  },
  closing: {
    bg: "bg-brand-secondary/10",
    border: "border-brand-secondary/30",
    text: "text-brand-secondary",
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
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-primary rounded-[5px] border-2 ${config.border} ${config.bg} overflow-hidden`}
    >
      {/* Top Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${config.accent}`} />
      
      <Box padding={5}>
        <Stack direction="row" align="start" justify="between" gap={2.5}>
          <Stack gap={0}>
            <Font variant="h3" text={String(tableNumber)} className={config.text} />
            <Font variant="body-bold" text={config.label} className={config.text} />
          </Stack>
          
          {capacity && (
            <Stack direction="row" align="center" gap={1} className="text-text-muted">
              <Users size={14} />
              <Font variant="description" text={String(capacity)} />
            </Stack>
          )}
        </Stack>
 
        {time && status !== "free" && (
          <div className="mt-4 pt-4 border-t-2 border-border/50">
            <Stack direction="row" align="center" gap={1} className="text-text-muted">
              <Clock size={14} />
              <Font variant="description" text={time} />
            </Stack>
          </div>
        )}
      </Box>
    </button>
  )
}
