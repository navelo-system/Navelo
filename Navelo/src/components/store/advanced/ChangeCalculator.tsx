/* eslint-disable max-lines-per-function, complexity */
import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { SectionHeader } from "@/components/store/intermediary/SectionHeader"
import { DollarSign } from "lucide-react"

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
  const [receivedText, setReceivedText] = React.useState("")
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
            title="Calculadora de Troco"
            subtitle="Calcule o troco a ser entregue ao cliente."
          />

          <Box h="h-[2px]" w="full" bg="bg-border" opacity="25" />
        </>
      )}

      {/* Total & Received Info */}
      <Grid cols={2} gap={5}>
        <Box padding={0}>
          <Stack gap={1} align="center">
            <Font variant="auxiliary" text="Total a Pagar" />
            <Font variant="h2" text={formatPrice(totalAmount)} color="primary" />
          </Stack>
        </Box>
        <Box padding={0}>
          <Stack gap={1} align="center">
            <Font variant="auxiliary" text="Troco do Cliente" />
            <Font 
              variant="h2" 
              text={isInsufficient ? "Pagar restante" : formatPrice(change)} 
              color={isInsufficient ? "danger" : change > 0 ? "success" : "secondary"}
            />
          </Stack>
        </Box>
      </Grid>

      {/* Shortcuts */}
      <Stack gap={2.5}>
        <Font variant="body-bold" text="Cédulas Rápidas" />
        <Grid cols={4} gap={2.5}>
          <Button variant="outline" label="R$ 10" onClick={() => handleShortcutClick(10)} />
          <Button variant="outline" label="R$ 20" onClick={() => handleShortcutClick(20)} />
          <Button variant="outline" label="R$ 50" onClick={() => handleShortcutClick(50)} />
          <Button variant="outline" label="R$ 100" onClick={() => handleShortcutClick(100)} />
        </Grid>
      </Stack>

      {/* Input received */}
      <Input 
        label="Valor Recebido (R$)"
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
          label="Confirmar pagamento" 
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
