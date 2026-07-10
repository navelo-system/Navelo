import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Avatar } from "@/components/store/base/Avatar"
import { Box } from "@/components/store/base/Box"
import { Minus, Plus, Trash2 } from "lucide-react"

export interface CartItemProps {
  id: string
  name: string
  quantity: number
  unitPrice: number
  image?: string
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
  image,
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

  return (
    <>
      <Box padding={0}>
      <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" gap={2.5}>
        {/* Product Info */}
        <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
          <Avatar image={image} fallback={name.substring(0, 2)} />
          <Stack gap={1} flex="1" minW="0">
            <Font variant="body-bold" text={name} truncate />
            <Font variant="description" text={formatPrice(unitPrice)} />
          </Stack>
        </Stack>

        {/* Controls and Total Wrap */}
        <Stack direction="row" align="center" justify="between" gap={5}>
          {/* Controls */}
          <Stack direction="row" align="center" gap={2.5}>
            {quantity === 1 ? (
              <Button variant="danger-icon-xs" icon={Trash2} onClick={() => onRemove(id)} />
            ) : (
              <Button variant="primary-icon-xs" icon={Minus} onClick={() => onDecrease(id)} />
            )}
            <Box padding={0} w="auto">
              <Font variant="body-bold" text={String(quantity)} />
            </Box>
            <Button variant="primary-icon-xs" icon={Plus} onClick={() => onIncrease(id)} />
          </Stack>

          {/* Line Total */}
          <Box padding={0} w="auto">
            <Font variant="body-bold" text={formatPrice(quantity * unitPrice)} align="right" />
          </Box>
        </Stack>
      </Stack>
      </Box>
      {!isLast && <Box h="h-[2px]" w="full" bg="bg-border" opacity="25" />}
    </>
  )
}
