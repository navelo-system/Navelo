import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Button } from "../base/Button"
import { Minus, Plus, Trash2 } from "lucide-react"

export interface CartListItemType {
  id: string
  name: string
  quantity: number
  unitPrice: number
}

export interface CartListProps {
  items: CartListItemType[]
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onRemove: (id: string) => void
}

export const CartList: React.FC<CartListProps> = ({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const total = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Box padding={0} bg="bg-surface" border borderColor="border-border" radius="default" className="flex flex-col h-full max-h-[600px]">
      {/* Header */}
      <Box padding={5} borderBottom borderColor="border-border" bg="bg-surface-sunken">
        <Font variant="h4" text="Carrinho" />
      </Box>

      {/* Items List (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 ? (
          <Stack align="center" justify="center" className="h-full opacity-50">
            <Font variant="body-medium" text="Carrinho vazio" />
          </Stack>
        ) : (
          items.map((item) => (
            <Stack key={item.id} direction="row" align="center" justify="between" gap={5} className="group">
              {/* Product Info */}
              <Stack gap={1} className="flex-1">
                <Font variant="body-bold" text={item.name} className="truncate" />
                <Font variant="description" text={formatPrice(item.unitPrice)} />
              </Stack>
              
              {/* Controls */}
              <Stack direction="row" align="center" gap={2.5}>
                {item.quantity === 1 ? (
                  <Button variant="outline-danger-icon-xs" icon={Trash2} onClick={() => onRemove(item.id)} />
                ) : (
                  <Button variant="outline-icon-xs" icon={Minus} onClick={() => onDecrease(item.id)} />
                )}
                <div className="w-6 text-center">
                  <Font variant="body-bold" text={String(item.quantity)} />
                </div>
                <Button variant="outline-icon-xs" icon={Plus} onClick={() => onIncrease(item.id)} />
              </Stack>

              {/* Line Total */}
              <div className="w-20 text-right">
                <Font variant="body-bold" text={formatPrice(item.quantity * item.unitPrice)} />
              </div>
            </Stack>
          ))
        )}
      </div>

      {/* Footer / Total */}
      <Box padding={5} borderTop borderColor="border-border" bg="bg-surface-sunken">
        <Stack direction="row" align="center" justify="between" gap={5}>
          <Font variant="body-bold" text="Total" />
          <Font variant="h3" text={formatPrice(total)} className="text-brand-primary" />
        </Stack>
      </Box>
    </Box>
  )
}
