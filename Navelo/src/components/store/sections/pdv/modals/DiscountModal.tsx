"use client"

import * as React from "react"
import { Input } from "@/components/store/base/Input"
import { Modal } from "@/components/store/base/Modal"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { AlertTriangle } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import { maskCurrency, maskPercent } from "@/lib/masks"

export interface DiscountModalProps {
  isOpen: boolean
  onClose: () => void
  subtotal: number
  discount: number
  onChangeDiscount: (newDiscountInReais: number) => void
}

function formatCurrency(val: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
}

function formatPercent(val: number) {
  return Number(val.toFixed(2)).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

interface DiscountSummaryProps {
  subtotal: number
  discountPercent: number
  calculatedTotal: number
}

function DiscountSummary({ subtotal, discountPercent, calculatedTotal }: DiscountSummaryProps) {
  return (
    <Stack gap={2.5} w="full">
      <Stack direction="row" justify="between" align="center" w="full">
        <Font variant="body" color="muted" text={UI_STRINGS.common.subtotal} />
        <Font variant="body-bold" text={formatCurrency(subtotal)} />
      </Stack>
      <Stack direction="row" justify="between" align="center" w="full">
        <Font variant="body" color="muted" text={UI_STRINGS.common.discount} />
        <Font variant="body-bold" text={`- ${formatPercent(discountPercent)} %`} />
      </Stack>
      <Box borderTop w="full" />
      <Stack direction="row" justify="between" align="center" w="full">
        <Font variant="body" color="muted" text={UI_STRINGS.common.total} />
        <Font variant="body-bold" text={formatCurrency(calculatedTotal)} />
      </Stack>
    </Stack>
  )
}

interface DiscountInputsProps {
  percentInput: string
  reaisInput: string
  onPercentChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onReaisChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function DiscountInputs({
  percentInput,
  reaisInput,
  onPercentChange,
  onReaisChange,
}: DiscountInputsProps) {
  const m = UI_STRINGS.pdv.modals
  return (
    <Stack gap={2.5} w="full">
      <Input
        variant="outlined-label"
        mask="percent"
        label={m.percentDiscountLabel}
        placeholder={UI_STRINGS.common.percentPlaceholder}
        value={percentInput}
        onChange={onPercentChange}
      />
      <Input
        variant="outlined-label"
        mask="currency"
        label={m.reaisDiscountLabel}
        placeholder={UI_STRINGS.common.currencyPlaceholder}
        value={reaisInput}
        onChange={onReaisChange}
      />
    </Stack>
  )
}

function useDiscountState(isOpen: boolean, subtotal: number, discount: number) {
  const [discountReais, setDiscountReais] = React.useState<number>(discount)
  const [discountPercent, setDiscountPercent] = React.useState<number>(0)
  const [percentInput, setPercentInput] = React.useState<string>("% 0,00")
  const [reaisInput, setReaisInput] = React.useState<string>("R$ 0,00")
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      if (discount > 0 && subtotal > 0) {
        const pct = (discount / subtotal) * 100
        setDiscountReais(discount)
        setDiscountPercent(pct)
        setPercentInput(maskPercent(Math.round(pct * 100)))
        setReaisInput(maskCurrency(Math.round(discount * 100)))
      } else {
        setDiscountReais(0)
        setDiscountPercent(0)
        setPercentInput("% 0,00")
        setReaisInput("R$ 0,00")
      }
    }
  }

  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setPercentInput(raw)
    const digits = raw.replace(/\D/g, "")
    if (!digits) {
      setDiscountPercent(0)
      setDiscountReais(0)
      setReaisInput("R$ 0,00")
      return
    }
    const clampedPct = Math.min(Number(digits) / 100, 100)
    const calculatedReais = (subtotal * clampedPct) / 100
    setDiscountPercent(clampedPct)
    setDiscountReais(calculatedReais)
    setReaisInput(maskCurrency(Math.round(calculatedReais * 100)))
  }

  const handleReaisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setReaisInput(raw)
    const digits = raw.replace(/\D/g, "")
    if (!digits) {
      setDiscountReais(0)
      setDiscountPercent(0)
      setPercentInput("% 0,00")
      return
    }
    const clampedReais = Math.min(Number(digits) / 100, subtotal)
    const calculatedPct = subtotal > 0 ? (clampedReais / subtotal) * 100 : 0
    setDiscountReais(clampedReais)
    setDiscountPercent(calculatedPct)
    setPercentInput(maskPercent(Math.round(calculatedPct * 100)))
  }

  return {
    discountReais,
    discountPercent,
    percentInput,
    reaisInput,
    handlePercentChange,
    handleReaisChange,
  }
}

export function DiscountModal({
  isOpen,
  onClose,
  subtotal,
  discount,
  onChangeDiscount,
}: DiscountModalProps) {
  const m = UI_STRINGS.pdv.modals
  const {
    discountReais,
    discountPercent,
    percentInput,
    reaisInput,
    handlePercentChange,
    handleReaisChange,
  } = useDiscountState(isOpen, subtotal, discount)

  const calculatedTotal = Math.max(0, subtotal - discountReais)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={m.applyDiscountTitle}
      showCancelButton={true}
      cancelText={m.cancelAction}
      successText={m.confirmDiscountButton}
      onSuccess={() => {
        onChangeDiscount(discountReais)
        onClose()
      }}
    >
      <Stack gap={5} w="full">
        <DiscountSummary subtotal={subtotal} discountPercent={discountPercent} calculatedTotal={calculatedTotal} />
        <DiscountInputs percentInput={percentInput} reaisInput={reaisInput} onPercentChange={handlePercentChange} onReaisChange={handleReaisChange} />
        <Box bg="bg-brand-warning/10" border borderColor="border-brand-warning/20" padding={2.5} radius="default" w="full">
          <Stack direction="row" gap={2.5} align="center">
            <Icon icon={AlertTriangle} color="warning" size={16} />
            <Font variant="body-xs" color="warning" text={m.discountNotice} />
          </Stack>
        </Box>
      </Stack>
    </Modal>
  )
}
