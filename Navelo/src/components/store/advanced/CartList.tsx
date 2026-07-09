import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { CartItem } from "../intermediary/CartItem"
import { EmptyState } from "../intermediary/EmptyState"
import { ShoppingCart } from "lucide-react"

export interface CartListItemType {
  id: string
  name: string
  quantity: number
  unitPrice: number
  image?: string
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
  return (
    <Box padding={0} bg="bg-surface" radius="default" flex="1" display="flex" direction="col" overflow="hidden">
      {/* Header */}
      <Box padding={5} bg="bg-surface">
        <Font variant="h3" text="Carrinho" />
      </Box>
      <Box h="h-[2px]" w="full" bg="bg-border" opacity="25" />

      {/* Items List (Scrollable) */}
      <Box flex="1" overflow="x-hidden y-auto" padding={5}>
        <Stack gap={5}>
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="Carrinho vazio"
              subtitle="Adicione produtos ao carrinho para iniciar uma venda."
            />
          ) : (
            items.map((item, idx) => (
              <CartItem
                key={item.id}
                {...item}
                isLast={idx === items.length - 1}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onRemove={onRemove}
              />
            ))
          )}
        </Stack>
      </Box>

    </Box>
  )
}
