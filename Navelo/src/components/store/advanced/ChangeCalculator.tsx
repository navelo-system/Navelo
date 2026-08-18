/* eslint-disable max-lines-per-function, complexity, react-hooks/set-state-in-effect */
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

export interface ChangeCalculatorProps {
  totalAmount?: number
  onConfirm?: (receivedAmount: number, change: number) => void
  hideHeaderAndFooter?: boolean
  onChange?: (receivedAmount: number) => void
}

export const ChangeCalculator: React.FC<ChangeCalculatorProps> = ({
  totalAmount = 78.50,
  onConfirm,
  hideHeaderAndFooter = false,
  onChange,
}) => {
  const calc = UI_STRINGS.pdv.changeCalculator
  const [receivedText, setReceivedText] = React.useState(
    totalAmount && totalAmount > 0 ? totalAmount.toFixed(2).replace(".", ",") : ""
  )

  React.useEffect(() => {
    if (totalAmount && totalAmount > 0) {
      setReceivedText(totalAmount.toFixed(2).replace(".", ","))
    }
  }, [totalAmount])

  const receivedAmount = parseFloat(receivedText.replace(",", ".")) || 0
  const change = Math.max(0, receivedAmount - totalAmount)
  const isInsufficient = receivedAmount > 0 && receivedAmount < totalAmount

  React.useEffect(() => {
    if (onChange) {
      onChange(receivedAmount)
    }
  }, [receivedAmount, onChange])

  const handleShortcutClick = (value: number) => {
    setReceivedText(value.toFixed(2).replace(".", ","))
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const content = (
    <Stack gap={5}>
      {!hideHeaderAndFooter && (
        <>
          {/* Header */}
          <SectionHeader
            icon={DollarSign}
            title={calc.title}
            subtitle={calc.subtitle}
          />

          <Box h="h-[2px]" w="full" bg="bg-border" opacity="25" />
        </>
      )}

      {/* Total & Received Info */}
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
            <Font 
              variant="h2" 
              text={isInsufficient ? calc.payRemaining : formatPrice(change)} 
              color={isInsufficient ? "danger" : change > 0 ? "success" : "secondary"}
            />
          </Stack>
        </Box>
      </Grid>

      {/* Shortcuts */}
      <Stack gap={2.5}>
        <Font variant="body-bold" text={calc.quickBills} />
        <Grid cols={4} gap={2.5}>
          <Button variant="outline" label={calc.bill10} onClick={() => handleShortcutClick(10)} />
          <Button variant="outline" label={calc.bill20} onClick={() => handleShortcutClick(20)} />
          <Button variant="outline" label={calc.bill50} onClick={() => handleShortcutClick(50)} />
          <Button variant="outline" label={calc.bill100} onClick={() => handleShortcutClick(100)} />
        </Grid>
      </Stack>

      {/* Input received */}
      <Input 
        label={calc.receivedValueLabel}
        placeholder="0,00"
        value={receivedText}
        onChange={(e) => setReceivedText(e.target.value)}
        variant="default"
      />

      {!hideHeaderAndFooter && (
        /* Confirm Button */
        <Button 
          variant="primary" 
          fullWidth 
          label={calc.confirmPaymentButton} 
          disabled={receivedAmount <= 0 || totalAmount === 0}
          onClick={() => onConfirm && onConfirm(receivedAmount, change)}
        />
      )}
    </Stack>
  )

  if (hideHeaderAndFooter) {
    return content
  }

  return (
    <Box padding={5} bg="bg-surface" radius="default">
      {content}
    </Box>
  )
}
