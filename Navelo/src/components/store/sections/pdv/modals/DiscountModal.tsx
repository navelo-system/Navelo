"use client"

import * as React from "react"
import { Box } from "../../../base/Box"
import { Stack } from "../../../base/Stack"
import { Font } from "../../../base/Font"
import { Button } from "../../../base/Button"
import { Input } from "../../../base/Input"
import { Modal } from "../../../base/Modal"

interface DiscountModalProps {
  isOpen: boolean
  onClose: () => void
  discount: number
  onChangeDiscount: (value: number) => void
}

export const DiscountModal: React.FC<DiscountModalProps> = ({
  isOpen,
  onClose,
  discount,
  onChangeDiscount,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box padding={5} bg="bg-surface" radius="default">
        <Stack gap={5}>
          <Font variant="h3" text="Desconto na Venda" />
          <Box h="h-[2px]" bg="bg-border" w="full" />
          <Input
            label="Valor do Desconto (R$)"
            placeholder="0,00"
            value={discount.toString()}
            onChange={(e) => onChangeDiscount(parseFloat(e.target.value) || 0)}
          />
          <Button
            variant="primary"
            label="Confirmar Desconto"
            onClick={onClose}
          />
        </Stack>
      </Box>
    </Modal>
  )
}
