/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import * as React from "react"
import { Input } from "../../../base/Input"
import { Modal } from "../../../base/Modal"
import { Switch } from "../../../base/Switch"
import { Stack } from "../../../base/Stack"
import { Font } from "../../../base/Font"
import { Percent } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface DiscountModalProps {
  isOpen: boolean
  onClose: () => void
  subtotal: number
  discount: number
  onChangeDiscount: (newDiscountInReais: number) => void
}

const formatNum = (val: number) => {
  return Number(val.toFixed(2)).toString()
}

export const DiscountModal: React.FC<DiscountModalProps> = ({
  isOpen,
  onClose,
  subtotal,
  discount,
  onChangeDiscount
}) => {
  const [isPercentage, setIsPercentage] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const m = UI_STRINGS.pdv.modals

  // Ao abrir o modal, preenche o valor do desconto existente
  React.useEffect(() => {
    if (isOpen) {
      if (discount > 0) {
        setIsPercentage(false)
        setInputValue(formatNum(discount))
      } else {
        setInputValue("")
      }
    }
  }, [isOpen, discount])

  const handleTogglePercentage = (checked: boolean) => {
    const val = parseFloat(inputValue) || 0
    if (checked) {
      // De reais para porcentagem
      const pct = subtotal > 0 ? (val / subtotal) * 100 : 0
      setInputValue(pct > 0 ? formatNum(pct) : "")
    } else {
      // De porcentagem para reais
      const reais = (val / 100) * subtotal
      setInputValue(reais > 0 ? formatNum(reais) : "")
    }
    setIsPercentage(checked)
  }

  const handleConfirm = () => {
    const val = parseFloat(inputValue) || 0
    let finalDiscountInReais = val
    if (isPercentage) {
      finalDiscountInReais = (val / 100) * subtotal
    }
    // Garante que o desconto não ultrapasse o subtotal
    finalDiscountInReais = Math.min(Math.max(0, finalDiscountInReais), subtotal)
    onChangeDiscount(finalDiscountInReais)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={m.discountModalTitle}
      subtitle={m.discountModalSubtitle}
      icon={Percent}
      successText={m.confirmDiscountButton}
      onSuccess={handleConfirm}
    >
      <Stack gap={5}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body-semibold" text={isPercentage ? m.discountPercentageLabel : m.discountValueLabel} />
          <Stack direction="row" align="center" gap={2.5}>
            <Font variant="body-xs" text="R$" color={!isPercentage ? "primary" : "muted"} />
            <Switch checked={isPercentage} onChange={(e) => handleTogglePercentage(e.target.checked)} />
            <Font variant="body-xs" text="%" color={isPercentage ? "primary" : "muted"} />
          </Stack>
        </Stack>

        <Input
          label={isPercentage ? m.discountPercentageInputLabel : m.discountValueInputLabel}
          placeholder={m.discountValuePlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Stack>
    </Modal>
  )
}
