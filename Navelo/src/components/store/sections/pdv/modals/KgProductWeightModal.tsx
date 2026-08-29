"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Numpad } from "@/components/store/intermediary/Numpad"
import { Minus, Plus } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import { MockProduct } from "@/components/store/advanced/PdvCatalog"

export interface KgProductWeightModalProps {
  isOpen: boolean
  onClose: () => void
  product: MockProduct | null
  onConfirm: (product: MockProduct, quantity: number) => void
}

function formatPrice(val: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
}

interface KgModalBodyProps {
  product: MockProduct | null
  weightKg: number
  formattedWeight: string
  onDecrease: () => void
  onIncrease: () => void
  onKeyPress: (val: string) => void
  onClose: () => void
  onConfirm: () => void
}

function KgModalBody({
  product,
  weightKg,
  formattedWeight,
  onDecrease,
  onIncrease,
  onKeyPress,
  onClose,
  onConfirm,
}: KgModalBodyProps) {
  const unitPrice = product?.unitPrice || 0
  const totalPrice = weightKg * unitPrice

  return (
    <Box padding={5} w="full">
      <Stack gap={5} w="full">
        {/* Cabeçalho do Produto */}
        <Stack direction="row" align="start" justify="between" w="full">
          <Stack gap={1}>
            <Font variant="body-bold" text={product?.name || ""} />
            <Font
              variant="description"
              color="muted"
              text={`${formattedWeight} KG x ${formatPrice(unitPrice)}`}
            />
          </Stack>
          <Font variant="body-bold" text={formatPrice(totalPrice)} />
        </Stack>

        {/* Seletor Central de Quantidade */}
        <Stack gap={1} align="center" w="full">
          <Font
            variant="description"
            color="muted"
            text={UI_STRINGS.pdv.kgModal?.quantityLabel || "Quantidade"}
            align="center"
          />
          <Stack direction="row" align="center" justify="center" gap={5} w="full">
            <Button
              variant="ghost"
              icon={Minus}
              onClick={onDecrease}
              disabled={weightKg <= 0}
            />
            <Box minW="min-w-[140px]" display="flex" align="center" justify="center">
              <Font variant="h1" text={formattedWeight} align="center" />
            </Box>
            <Button
              variant="ghost"
              icon={Plus}
              onClick={onIncrease}
            />
          </Stack>
        </Stack>

        {/* Teclado Numérico */}
        <Numpad onKeyPress={onKeyPress} variant="ghost" />

        {/* Rodapé com Ações */}
        <Stack direction="row" justify="end" align="center" gap={2.5} w="full">
          <Button
            variant="ghost"
            label={UI_STRINGS.common.cancel}
            onClick={onClose}
          />
          <Button
            variant="ghost-primary"
            label={UI_STRINGS.common.confirm}
            onClick={onConfirm}
            disabled={weightKg <= 0}
          />
        </Stack>
      </Stack>
    </Box>
  )
}

export function KgProductWeightModal({
  isOpen,
  onClose,
  product,
  onConfirm,
}: KgProductWeightModalProps) {
  const [digits, setDigits] = React.useState("1000")
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setDigits("1000")
    }
  }

  const handleKeyPress = (val: string) => {
    if (val === "back") {
      setDigits((prev) => prev.slice(0, -1))
      return
    }
    if (digits.length >= 7) return
    setDigits((prev) => (prev === "0" ? val : prev + val))
  }

  const weightKg = digits ? parseFloat(digits) / 1000 : 0
  const formattedWeight = weightKg.toLocaleString("pt-BR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })

  const handleDecrease = () => {
    const nextGrams = Math.max(0, Math.round(weightKg * 1000) - 100)
    setDigits(nextGrams > 0 ? String(nextGrams) : "")
  }

  const handleIncrease = () => {
    const nextGrams = Math.round(weightKg * 1000) + 100
    setDigits(String(nextGrams))
  }

  const handleConfirm = () => {
    if (product && weightKg > 0) {
      onConfirm(product, weightKg)
    }
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="numpad">
      <KgModalBody
        product={product}
        weightKg={weightKg}
        formattedWeight={formattedWeight}
        onDecrease={handleDecrease}
        onIncrease={handleIncrease}
        onKeyPress={handleKeyPress}
        onClose={onClose}
        onConfirm={handleConfirm}
      />
    </Modal>
  )
}
