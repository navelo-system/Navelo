"use client"

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Button } from "../../base/Button"
import { ThermalReceiptPreview } from "../../advanced/ThermalReceiptPreview"

// Types
import { CartItemType } from "./PdvSection"

interface PdvCheckoutReceiptProps {
  cartItems: CartItemType[]
  payments: { method: string; amount: number }[]
  onCloseReceipt: () => void
}

export const PdvCheckoutReceipt: React.FC<PdvCheckoutReceiptProps> = ({
  cartItems,
  payments,
  onCloseReceipt,
}) => {
  const receiptItems = cartItems.map(item => ({
    name: item.name,
    qty: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.quantity * item.unitPrice
  }))

  return (
    <Stack gap={5} w="full" align="center">
      <Box w="w-full md:w-fit" bg="bg-surface" padding={5} radius="default" border={true} borderColor="border-border">
        <ThermalReceiptPreview
          companyName="Navelo Restaurante e PDV"
          cnpj="12.345.678/0001-90"
          items={receiptItems}
          paymentMethod={payments.map((p) => p.method).join(", ") || "Dinheiro"}
        />
      </Box>
      <Button variant="primary-lg" label="Concluir e Voltar" onClick={onCloseReceipt} />
    </Stack>
  )
}
