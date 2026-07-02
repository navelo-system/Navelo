import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Badge } from "../base/Badge"
import { Button } from "../base/Button"
import { Clock, ChefHat, CheckCircle2 } from "lucide-react"

export interface OrderItem {
  id: string
  name: string
  quantity: number
  notes?: string
}

export interface OrderCardProps {
  orderId: string
  tableNumber?: string | number
  status: "queue" | "preparing" | "done"
  time: string
  items: OrderItem[]
  onAction?: (action: string) => void
}

export function OrderCard({ orderId, tableNumber, status, time, items, onAction }: OrderCardProps) {
  const statusConfig = {
    queue: { label: "Na Fila", color: "default" as const, action: "Preparar", actionIcon: ChefHat, actionVariant: "primary" as const },
    preparing: { label: "Preparando", color: "primary" as const, action: "Pronto", actionIcon: CheckCircle2, actionVariant: "outline-success" as const },
    done: { label: "Pronto", color: "success" as const, action: "Entregar", actionIcon: undefined, actionVariant: "outline-success" as const }
  }
  const config = statusConfig[status]

  return (
    <Box padding={5} bg="bg-surface" radius="default">
      <Stack gap={5}>
        {/* Header */}
        <Stack direction="row" align="center" justify="between" gap={2.5}>
          <Stack gap={1}>
            <Font variant="h4" text={`Pedido #${orderId}`} />
            {tableNumber && <Font variant="description" text={`Mesa ${tableNumber}`} />}
          </Stack>
          <Stack align="end" gap={2.5}>
            <Badge variant="outline" label={config.label} />
            <Stack direction="row" align="center" gap={1} className={status === "queue" && parseInt(time.split(":")[0]) > 10 ? "text-red-500 animate-pulse" : "text-text-muted"}>
              <Clock size={14} />
              <Font variant="body-bold" text={time} />
            </Stack>
          </Stack>
        </Stack>

        {/* Divider */}
        <div className="h-[2px] bg-border w-full" />

        {/* Items */}
        <Stack gap={2.5}>
          {items.map((item) => (
            <Box key={item.id} padding={2.5} border borderColor="border-border" radius="default">
              <Stack direction="row" gap={2.5}>
                <Font variant="body-bold" text={`${item.quantity}x`} className="text-brand-primary" />
                <Stack gap={1} className="flex-1">
                  <Font variant="body-medium" text={item.name} />
                  {item.notes && <Font variant="description" text={item.notes} color="brand-secondary" />}
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>

        {/* Action */}
        <Button 
          variant={config.actionVariant} 
          fullWidth 
          label={config.action} 
          icon={config.actionIcon}
          onClick={() => onAction && onAction(status)} 
        />
      </Stack>
    </Box>
  )
}
