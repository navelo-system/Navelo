import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { CartItem } from "@/components/store/intermediary/CartItem"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
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
  hideHeader?: boolean
  flushContent?: boolean
}

export const CartList: React.FC<CartListProps> = ({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  hideHeader = false,
  flushContent = false,
}) => {
  return (
    <Box padding={0} bg="bg-surface" radius="default" flex="1" display="flex" direction="col" overflow="hidden">
      {!hideHeader && (
        <>
          <Box padding={5} bg="bg-surface">
            <Font variant="h3" text="Carrinho" />
          </Box>
          <Box h="h-[2px]" w="full" bg="bg-border" opacity="25" />
        </>
      )}

      <Box flex="1" overflow="x-hidden y-auto" padding={flushContent ? 0 : 5}>
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
