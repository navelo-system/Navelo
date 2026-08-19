import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { SectionHeader } from "@/components/store/intermediary/SectionHeader"
import { DollarSign } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import { maskCurrency } from "@/lib/masks"

export interface ChangeCalculatorProps {
  totalAmount?: number
  onConfirm?: (receivedAmount: number, change: number) => void
  hideHeaderAndFooter?: boolean
  onChange?: (receivedAmount: number) => void
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function ChangeCalculatorInfoGrid({
  totalAmount,
  change,
  isInsufficient,
}: {
  totalAmount: number
  change: number
  isInsufficient: boolean
}) {
  const calc = UI_STRINGS.pdv.changeCalculator
  const changeColor = isInsufficient ? "danger" : change > 0 ? "success" : "secondary"
  const changeLabel = isInsufficient ? calc.payRemaining : formatPrice(change)

  return (
    <Grid cols={2} gap={5}>
      <Box padding={0}>
        <Stack gap={1} align="center">
          <Font variant="auxiliary" text={calc.totalToPay} />
          <Font variant="h2" text={formatPrice(totalAmount)} color="primary" />
        </Stack>
      </Box>
      <Box padding={0}>
        <Stack gap={1} align="center">
          <Font variant="auxiliary" text={calc.clientChange} />
          <Font variant="h2" text={changeLabel} color={changeColor} />
        </Stack>
      </Box>
    </Grid>
  )
}

function ChangeCalculatorShortcuts({ onShortcutClick }: { onShortcutClick: (v: number) => void }) {
  const calc = UI_STRINGS.pdv.changeCalculator
  return (
    <Stack gap={2.5}>
      <Font variant="body-bold" text={calc.quickBills} />
      <Grid cols={4} gap={2.5}>
        <Button variant="outline" label={calc.bill10} onClick={() => onShortcutClick(10)} />
        <Button variant="outline" label={calc.bill20} onClick={() => onShortcutClick(20)} />
        <Button variant="outline" label={calc.bill50} onClick={() => onShortcutClick(50)} />
        <Button variant="outline" label={calc.bill100} onClick={() => onShortcutClick(100)} />
      </Grid>
    </Stack>
  )
}

function computeChangeState(receivedText: string, totalAmount: number) {
  const digits = receivedText.replace(/\D/g, "")
  const receivedAmount = (Number(digits) || 0) / 100
  const change = Math.max(0, receivedAmount - totalAmount)
  const isInsufficient = receivedAmount > 0 && receivedAmount < totalAmount
  return { receivedAmount, change, isInsufficient }
}

export function ChangeCalculator(props: ChangeCalculatorProps) {
  const totalAmount = props.totalAmount !== undefined ? props.totalAmount : 78.5
  const calc = UI_STRINGS.pdv.changeCalculator
  const initialText = totalAmount > 0 ? maskCurrency(Math.round(totalAmount * 100)) : ""
  const [receivedText, setReceivedText] = React.useState(initialText)
  const [prevTotal, setPrevTotal] = React.useState(totalAmount)

  if (totalAmount !== prevTotal) {
    setPrevTotal(totalAmount)
    if (totalAmount > 0) {
      setReceivedText(maskCurrency(Math.round(totalAmount * 100)))
    }
  }

  const { receivedAmount, change, isInsufficient } = computeChangeState(receivedText, totalAmount)

  const handleInputChange = (val: string) => {
    setReceivedText(val)
    const num = (Number(val.replace(/\D/g, "")) || 0) / 100
    props.onChange?.(num)
  }

  const handleShortcutClick = (value: number) => {
    const masked = maskCurrency(Math.round(value * 100))
    setReceivedText(masked)
    props.onChange?.(value)
  }

  const content = (
    <Stack gap={5}>
      {!props.hideHeaderAndFooter && (
        <>
          <SectionHeader icon={DollarSign} title={calc.title} subtitle={calc.subtitle} />
          <Box h="h-[2px]" w="full" bg="bg-border" opacity="25" />
        </>
      )}

      <ChangeCalculatorInfoGrid totalAmount={totalAmount} change={change} isInsufficient={isInsufficient} />
      <ChangeCalculatorShortcuts onShortcutClick={handleShortcutClick} />

      <Input
        mask="currency"
        label={calc.receivedValueLabel}
        placeholder={UI_STRINGS.common.currencyPlaceholder}
        value={receivedText}
        onChange={(e) => handleInputChange(e.target.value)}
        variant="default"
      />

      {!props.hideHeaderAndFooter && (
        <Button
          variant="primary"
          fullWidth
          label={calc.confirmPaymentButton}
          disabled={receivedAmount <= 0 || totalAmount === 0}
          onClick={() => props.onConfirm?.(receivedAmount, change)}
        />
      )}
    </Stack>
  )

  if (props.hideHeaderAndFooter) {
    return content
  }

  return (
    <Box padding={5} bg="bg-surface" radius="default">
      {content}
    </Box>
  )
}
