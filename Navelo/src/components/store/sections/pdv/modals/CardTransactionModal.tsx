"use client"

import * as React from "react"
import { Box } from "../../../base/Box"
import { Stack } from "../../../base/Stack"
import { Font } from "../../../base/Font"
import { Button } from "../../../base/Button"
import { Grid } from "../../../base/Grid"
import { Modal } from "../../../base/Modal"

interface CardTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  amountDue: number
  formatPrice: (val: number) => string
  onLaunchPayment: (method: string, amount: number) => void
}

export const CardTransactionModal: React.FC<CardTransactionModalProps> = ({
  isOpen,
  onClose,
  amountDue,
  formatPrice,
  onLaunchPayment,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Box padding={5} bg="bg-surface" radius="default">
        <Stack gap={5}>
          <Font variant="h3" text="Transação de Cartão" />
          <Box h="h-[2px]" bg="bg-border" w="full" />
          <Font variant="description" text={`Valor a lançar: ${formatPrice(amountDue)}`} />
          <Grid cols={2} gap={2.5}>
            <Button
              variant="primary"
              label="Débito"
              onClick={() => {
                onLaunchPayment("Cartão Débito", amountDue)
                onClose()
              }}
            />
            <Button
              variant="primary"
              label="Crédito"
              onClick={() => {
                onLaunchPayment("Cartão Crédito", amountDue)
                onClose()
              }}
            />
          </Grid>
        </Stack>
      </Box>
    </Modal>
  )
}
