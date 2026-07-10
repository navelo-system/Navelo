"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { CartList } from "@/components/store/advanced/CartList"

// Types
import { CartItemType } from "@/components/store/sections/pdv/pages/PdvSection"

interface PdvCheckoutSidebarProps {
  cartItems: CartItemType[]
  discount: number
  total: number
  formatPrice: (value: number) => string
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onRemove: (id: string) => void
  onGoToPayment?: () => void
  onSaveComanda?: () => void
  hideActions?: boolean
  compactList?: boolean
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
  onSaveComanda,
  hideActions = false,
  compactList = false,
}) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

  return (
    <Stack gap={5} flex="1" className="min-h-0">
      <CartList
        items={cartItems}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
        hideHeader={compactList}
        flushContent={compactList}
      />

      {/* Totais do Cupom / Checkout */}
      <Box padding={5} bg="bg-surface" radius="default">
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

          {!hideActions && (
            <>
              <Box paddingY={1} />

              <Button
                variant="success-lg"
                fullWidth
                label="Pagamento"
                disabled={cartItems.length === 0}
                onClick={onGoToPayment}
              />
              {onSaveComanda && (
                <Button
                  variant="outline"
                  fullWidth
                  label="Salvar"
                  onClick={onSaveComanda}
                />
              )}
            </>
          )}
        </Stack>
      </Box>
    </Stack>
  )
}
