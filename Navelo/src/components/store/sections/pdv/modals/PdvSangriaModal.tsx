"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Numpad } from "@/components/store/intermediary/Numpad"
import { Banknote, Wallet } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

interface PdvSangriaModalProps {
  isOpen: boolean
  onClose: () => void
  cashAvailable?: number
  mode?: "sangria" | "suprimento"
  onConfirmSangria?: (amount: number, mode: "sangria" | "suprimento") => void
}

function getSangriaConfig(mode: "sangria" | "suprimento") {
  if (mode === "suprimento") {
    return {
      titleText: "Suprimento",
      subtitleText: "Informe o valor a ser adicionado ao caixa",
      successLabel: "Confirmar suprimento",
      valuePrefix: "R$",
      icon: Wallet,
    }
  }
  return {
    titleText: "Sangria",
    subtitleText: "Informe o valor a ser retirado do caixa",
    successLabel: "Confirmar sangria",
    valuePrefix: "-R$",
    icon: Banknote,
  }
}

export function PdvSangriaModal({
  isOpen,
  onClose,
  cashAvailable = 39.0,
  mode = "sangria",
  onConfirmSangria,
}: PdvSangriaModalProps) {
  const [digits, setDigits] = React.useState("")
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setDigits("")
    }
  }

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
    if (numericValue > 0 && onConfirmSangria) {
      onConfirmSangria(numericValue, mode)
    }
    onClose()
  }

  const config = getSangriaConfig(mode)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.titleText}
      variant="default"
      showCancelButton={true}
      successText={config.successLabel}
      onSuccess={handleConfirm}
    >
      <Stack gap={5} w="full" align="center">
        <Box w="full" bg="bg-surface-sunken" padding={2.5} radius="default" border borderColor="border-border">
          <Stack direction="row" align="center" justify="between" w="full">
            <Font variant="body-sm-medium" color="muted" text={UI_STRINGS.cashManagement.availableInCash} />
            <Font variant="body-bold" text={`R$ ${formattedAvailable}`} />
          </Stack>
        </Box>

        <Stack gap={1} align="center" w="full">
          <Font variant="description" text={config.titleText} color="muted" align="center" />
          <Font variant="h1" text={`${config.valuePrefix} ${formattedValue}`} color="primary" align="center" />
        </Stack>

        <Numpad onKeyPress={handleKeyPress} variant="ghost" />
      </Stack>
    </Modal>
  )
}
