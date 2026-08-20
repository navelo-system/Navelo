"use client"

import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Grid } from "@/components/store/base/Grid"
import { Modal } from "@/components/store/base/Modal"
import { UI_STRINGS, formatString } from "@/constants/strings"

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
  const m = UI_STRINGS.pdv.modals
  const c = UI_STRINGS.common

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={m.cardTransactionTitle}
      showCancelButton={true}
      cancelText={c.cancel}
    >
      <Stack gap={5} w="full">
        <Font variant="description" text={formatString(m.amountToLaunchPrefix, { amount: formatPrice(amountDue) })} />
        <Grid cols={2} gap={2.5}>
          <Button
            variant="primary"
            label={m.debitLabel}
            onClick={() => {
              onLaunchPayment("Cartão Débito", amountDue)
              onClose()
            }}
          />
          <Button
            variant="primary"
            label={m.creditLabel}
            onClick={() => {
              onLaunchPayment("Cartão Crédito", amountDue)
              onClose()
            }}
          />
        </Grid>
      </Stack>
    </Modal>
  )
}
