"use client"

/* eslint-disable max-lines-per-function, react-hooks/set-state-in-effect */

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Grid } from "@/components/store/base/Grid"
import { Delete, Banknote, Wallet } from "lucide-react"

interface PdvSangriaModalProps {
  isOpen: boolean
  onClose: () => void
  cashAvailable?: number
  mode?: "sangria" | "suprimento"
  onConfirmSangria?: (amount: number, mode: "sangria" | "suprimento") => void
}

export const PdvSangriaModal: React.FC<PdvSangriaModalProps> = ({
  isOpen,
  onClose,
  cashAvailable = 39.00,
  mode = "sangria",
  onConfirmSangria,
}) => {
  const [digits, setDigits] = React.useState("")

  React.useEffect(() => {
    if (isOpen) {
      setDigits("")
    }
  }, [isOpen])

  const handleKeyPress = (val: string) => {
    if (val === "back") {
      setDigits((prev) => prev.slice(0, -1))
      return
    }
    if (digits.length >= 8) return
    setDigits((prev) => prev + val)
  }

  const numericValue = digits ? parseFloat(digits) / 100 : 0
  const formattedValue = numericValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const formattedAvailable = cashAvailable.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const handleConfirm = () => {
    if (onConfirmSangria && numericValue > 0) {
      onConfirmSangria(numericValue, mode)
    }
    onClose()
  }

  const isSuprimento = mode === "suprimento"
  const titleText = isSuprimento ? "Suprimento" : "Sangria"
  const successLabel = isSuprimento ? "Confirmar suprimento" : "Confirmar sangria"
  const valuePrefix = isSuprimento ? "R$" : "-R$"
  const IconComp = isSuprimento ? Wallet : Banknote

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "00", "0", "back"]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      icon={IconComp}
      title={titleText}
      variant="default"
      showCancelButton={true}
      successText={successLabel}
      onSuccess={handleConfirm}
    >
      <Stack gap={5} w="full" align="center">
        {/* Card Saldo Disponível */}
        <Box w="full" bg="bg-surface-sunken" padding={2.5} radius="default" border borderColor="border-border">
          <Stack direction="row" align="center" justify="between" w="full">
            <Font variant="body-sm-medium" color="muted" text="Disponível em caixa" />
            <Font variant="body-bold" text={`R$ ${formattedAvailable}`} />
          </Stack>
        </Box>

        {/* Valor da Sangria / Suprimento */}
        <Stack gap={1} align="center" w="full">
          <Font variant="description" text={titleText} color="muted" align="center" />
          <Font variant="h1" text={`${valuePrefix} ${formattedValue}`} color="primary" align="center" />
        </Stack>

        {/* Teclado Numérico Interativo */}
        <Box w="full">
          <Grid cols={3} gap={2.5}>
            {keys.map((k) => (
              <Button
                key={k}
                variant="outline"
                fullWidth
                onClick={() => handleKeyPress(k)}
                icon={k === "back" ? Delete : undefined}
                label={k !== "back" ? k : undefined}
              />
            ))}
          </Grid>
        </Box>
      </Stack>
    </Modal>
  )
}
