"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Stack } from "@/components/store/base/Stack"
import { Button } from "@/components/store/base/Button"
import { PdvCheckoutSidebar } from "@/components/store/advanced/PdvCheckoutSidebar"
import { SaveAll, ShoppingCart } from "lucide-react"
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Carrinho"
      variant="sidebar"
      footer={
        <Stack direction="col" gap={2.5} w="full">
          <Button
            variant="success-lg"
            fullWidth
            label="Pagamento"
            icon={ShoppingCart}
            disabled={cartItems.length === 0}
            onClick={handlePayment}
          />
          {onSaveComanda && (
            <Button
              variant="outline"
              fullWidth
              icon={SaveAll}
              label="Salvar Comanda"
              onClick={handleSave}
            />
          )}
        </Stack>
      }
    >
      <PdvCheckoutSidebar
        cartItems={cartItems}
        discount={discount}
        total={total}
        formatPrice={formatPrice}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
        hideActions
        compactList
      />
    </Modal>
  )
}
