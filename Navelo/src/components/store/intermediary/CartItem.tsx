import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Avatar } from "@/components/store/base/Avatar"
import { Box } from "@/components/store/base/Box"
import { Button } from "@/components/store/base/Button"
import { Trash2 } from "lucide-react"
import { QuantityControl } from "@/components/store/intermediary/QuantityControl"

export interface CartItemProps {
  id: string
  name: string
  quantity: number
  unitPrice: number
  unit?: string
  image?: string
  stock?: number
  isLast?: boolean
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onRemove: (id: string) => void
}

export const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  quantity,
  unitPrice,
  unit,
  image,
  stock,
  isLast,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const isDecimalOrKg = (unit || "").trim().toUpperCase() === "KG" || !Number.isInteger(quantity)
  const formattedWeight = quantity.toLocaleString("pt-BR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }) + (unit ? ` ${unit}` : "")

  return (
    <>
      <Box padding={0}>
        <Stack direction="row" align="center" justify="between" gap={2.5}>
          {/* Product Info */}
          <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
            <Avatar image={image} fallback={name.substring(0, 2)} />
            <Stack gap={1} flex="1" minW="0">
              <Font variant="body" text={name} truncate />
              <Font variant="description" text={formatPrice(unitPrice)} />
            </Stack>
          </Stack>

          {/* Controls stacked on top of Line Total */}
          <Box shrink="0">
            <Stack direction="col" align="end" gap={1}>
              {/* Controls */}
              {isDecimalOrKg ? (
                <Stack direction="row" align="center" gap={2.5} justify="end">
                  <Font variant="body-bold" text={formattedWeight} align="right" />
                  <Button
                    variant="danger-icon-xs"
                    icon={Trash2}
                    onClick={() => onRemove(id)}
                  />
                </Stack>
              ) : (
                <QuantityControl
                  quantity={quantity}
                  stock={stock}
                  onIncrease={() => onIncrease(id)}
                  onDecrease={() => onDecrease(id)}
                  onRemove={() => onRemove(id)}
                  stopPropagation={false}
                />
              )}

              {/* Line Total */}
              <Box padding={0} w="auto">
                <Font variant="body-bold" text={formatPrice(quantity * unitPrice)} align="right" />
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Box>
      {!isLast && <Box h="h-[2px]" w="full" bg="bg-border" opacity="25" />}
    </>
  )
}
