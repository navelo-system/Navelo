/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import * as React from "react"
import { Input } from "../../../base/Input"
import { Modal } from "../../../base/Modal"
import { Switch } from "../../../base/Switch"
import { Stack } from "../../../base/Stack"
import { Font } from "../../../base/Font"
import { Percent } from "lucide-react"

interface DiscountModalProps {
  isOpen: boolean
  onClose: () => void
  discount: number
  onChangeDiscount: (value: number) => void
  subtotal: number
}

export const DiscountModal: React.FC<DiscountModalProps> = ({
  isOpen,
  onClose,
  discount,
  onChangeDiscount,
  subtotal,
}) => {
  const [isPercentage, setIsPercentage] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  React.useEffect(() => {
    if (isOpen) {
      setInputValue(discount > 0 ? discount.toString() : "")
      setIsPercentage(false)
    }
  }, [isOpen, discount])

  const formatNum = (val: number) => {
    return Number(val.toFixed(2)).toString()
  }

  const handleTogglePercentage = (checked: boolean) => {
    const currentVal = parseFloat(inputValue) || 0
    if (checked) {
      // De Reais para Porcentagem
      const pct = subtotal > 0 ? (currentVal / subtotal) * 100 : 0
      setInputValue(pct > 0 ? formatNum(pct) : "")
    } else {
      // De Porcentagem para Reais
      const reais = (currentVal / 100) * subtotal
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
      title="Desconto na Venda"
      subtitle="Informe o valor do desconto a ser aplicado à venda atual."
      icon={Percent}
      successText="Confirmar Desconto"
      onSuccess={handleConfirm}
    >
      <Stack gap={5}>
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body-semibold" text={isPercentage ? "Desconto em Porcentagem (%)" : "Desconto em Valor (R$)"} />
          <Stack direction="row" align="center" gap={2.5}>
            <Font variant="body-xs" text="R$" color={!isPercentage ? "primary" : "muted"} />
            <Switch checked={isPercentage} onChange={(e) => handleTogglePercentage(e.target.checked)} />
            <Font variant="body-xs" text="%" color={isPercentage ? "primary" : "muted"} />
          </Stack>
        </Stack>

        <Input
          label={isPercentage ? "Valor do Desconto (%)" : "Valor do Desconto (R$)"}
          placeholder="0,00"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Stack>
    </Modal>
  )
}
