"use client"

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Button } from "../../base/Button"
import { CartList } from "../../advanced/CartList"
import { ShoppingCart } from "lucide-react"

// Types
import { CartItemType } from "./PdvSection"

interface PdvCheckoutSidebarProps {
  cartItems: CartItemType[]
  discount: number
  total: number
  formatPrice: (value: number) => string
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onRemove: (id: string) => void
  onGoToPayment: () => void
}

export const PdvCheckoutSidebar: React.FC<PdvCheckoutSidebarProps> = ({
  cartItems,
  discount,
  total,
  formatPrice,
  onIncrease,
  onDecrease,
  onRemove,
  onGoToPayment,
}) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

  return (
    <Stack gap={5}>
      <CartList
        items={cartItems}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
      />

      {/* Totais do Cupom / Checkout */}
      <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
        <Stack gap={2.5}>
          <Stack direction="row" justify="between" align="center">
            <Font variant="description" color="muted" text="Subtotal" />
            <Font variant="description" text={formatPrice(subtotal)} />
          </Stack>
          <Stack direction="row" justify="between" align="center">
            <Font variant="description" color="muted" text="Desconto na venda" />
            <Font variant="description" color="danger" text={`- ${formatPrice(discount)}`} />
          </Stack>
          <Stack direction="row" justify="between" align="center">
            <Font variant="body-bold" text="Total" />
            <Font variant="body-bold" color="success" text={formatPrice(total)} />
          </Stack>
          
          <Box paddingY={1} />

          <Button
            variant="success-lg"
            fullWidth
            label="F9 - Pagamento"
            icon={ShoppingCart}
            disabled={cartItems.length === 0}
            onClick={onGoToPayment}
          />
        </Stack>
      </Box>
    </Stack>
  )
}
