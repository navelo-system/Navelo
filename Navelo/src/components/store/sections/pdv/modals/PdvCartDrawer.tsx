"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { CartList } from "@/components/store/advanced/CartList"
import { SaveAll } from "lucide-react"
import { CartItemType } from "@/components/store/sections/pdv/pages/PdvSection"

interface PdvCartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItemType[]
  discount: number
  total: number
  formatPrice: (value: number) => string
  onIncrease: (id: string) => void
  onDecrease: (id: string) => void
  onRemove: (id: string) => void
  onGoToPayment: () => void
  onSaveComanda?: () => void
}

export const PdvCartDrawer: React.FC<PdvCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  discount,
  total,
  formatPrice,
  onIncrease,
  onDecrease,
  onRemove,
  onGoToPayment,
  onSaveComanda,
}) => {
  const handlePayment = () => {
    onClose()
    onGoToPayment()
  }

  const handleSave = () => {
    onClose()
    onSaveComanda?.()
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Carrinho"
      variant="sidebar"
      footer={
        <Stack gap={2.5} w="full">
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
            variant="primary-lg"
            fullWidth
            label="F9 - Pagamento"
            disabled={cartItems.length === 0}
            onClick={handlePayment}
          />
          {onSaveComanda && (
            <Button
              variant="secondary-lg"
              fullWidth
              icon={SaveAll}
              label="Salvar Comanda"
              onClick={handleSave}
            />
          )}
        </Stack>
      }
    >
      <CartList
        items={cartItems}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
        hideHeader
        flushContent
      />
    </Modal>
  )
}
