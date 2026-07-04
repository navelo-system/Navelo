import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Grid } from "../base/Grid"
import { Font } from "../base/Font"
import { Button } from "../base/Button"
import { Input } from "../base/Input"
import { SectionHeader } from "../intermediary/SectionHeader"
import { DollarSign } from "lucide-react"

export interface ChangeCalculatorProps {
  totalAmount?: number
  onConfirm?: (receivedAmount: number, change: number) => void
}

export const ChangeCalculator: React.FC<ChangeCalculatorProps> = ({
  totalAmount = 78.50,
  onConfirm,
}) => {
  const [receivedText, setReceivedText] = React.useState("")
  const receivedAmount = parseFloat(receivedText.replace(",", ".")) || 0
  const change = Math.max(0, receivedAmount - totalAmount)
  const isInsufficient = receivedAmount > 0 && receivedAmount < totalAmount

  const handleShortcutClick = (value: number) => {
    setReceivedText(value.toFixed(2).replace(".", ","))
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Box padding={5} bg="bg-surface" radius="default">
      <Stack gap={5}>
        {/* Header */}
        <SectionHeader
          icon={DollarSign}
          title="Calculadora de Troco"
          subtitle="Calcule o troco a ser entregue ao cliente."
        />

        <Box borderBottom borderColor="border-border" w="full" />

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

        {/* Confirm Button */}
        <Button 
          variant="primary" 
          fullWidth 
          label="Confirmar pagamento" 
          disabled={receivedAmount < totalAmount || totalAmount === 0}
          onClick={() => onConfirm && onConfirm(receivedAmount, change)}
        />
      </Stack>
    </Box>
  )
}
