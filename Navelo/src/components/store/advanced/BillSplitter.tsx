import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Button } from "../base/Button"
import { Input } from "../base/Input"
import { Select } from "../base/Select"
import { CircularIcon } from "../intermediary/CircularIcon"
import { Users, Users2, CreditCard, DollarSign } from "lucide-react"

export interface BillSplitterProps {
  totalAmount: number
  onCompleteSplit?: (splitInfo: { peopleCount: number; amountPerPerson: number; serviceFee: number }) => void
}

export const BillSplitter: React.FC<BillSplitterProps> = ({
  totalAmount = 150.0,
  onCompleteSplit,
}) => {
  const [peopleCount, setPeopleCount] = React.useState(2)
  const [applyServiceFee, setApplyServiceFee] = React.useState(true)
  const [paymentMethod, setPaymentMethod] = React.useState("pix")

  const serviceFeeRate = 0.10
  const serviceFee = applyServiceFee ? totalAmount * serviceFeeRate : 0
  const grandTotal = totalAmount + serviceFee
  const amountPerPerson = grandTotal / Math.max(1, peopleCount)

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleIncrease = () => setPeopleCount((prev) => prev + 1)
  const handleDecrease = () => setPeopleCount((prev) => Math.max(1, prev - 1))

  return (
    <Box padding={5} bg="bg-surface" border borderColor="border-border" radius="default">
      <Stack gap={5}>
        {/* Header */}
        <Stack direction="row" align="center" gap={2.5}>
          <CircularIcon icon={Users2} variant="neutral" />
          <Stack gap={0}>
            <Font variant="body-bold" text="Divisão de Conta" />
            <Font variant="description" text="Divida o consumo de mesas e comandas de forma rápida." />
          </Stack>
        </Stack>

        <div className="h-[2px] bg-border w-full" />

        {/* Calculations display */}
        <Box padding={5} bg="bg-surface-sunken" radius="default" border borderColor="border-border">
          <Stack gap={2.5}>
            <Stack direction="row" justify="between" align="center">
              <Font variant="body" text="Consumo Subtotal" />
              <Font variant="body-bold" text={formatPrice(totalAmount)} />
            </Stack>
            <Stack direction="row" justify="between" align="center">
              <Stack direction="row" align="center" gap={2.5}>
                <Font variant="body" text="Taxa de Serviço (10%)" />
                <input 
                  type="checkbox" 
                  checked={applyServiceFee} 
                  onChange={(e) => setApplyServiceFee(e.target.checked)}
                  className="w-4 h-4 accent-brand-primary cursor-pointer"
                />
              </Stack>
              <Font variant="body-bold" text={formatPrice(serviceFee)} color={applyServiceFee ? "foreground" : "muted"} />
            </Stack>
            <div className="h-[2px] bg-border w-full my-1" />
            <Stack direction="row" justify="between" align="center">
              <Font variant="body-bold" text="Total Geral" />
              <Font variant="h3" text={formatPrice(grandTotal)} className="text-brand-primary" />
            </Stack>
          </Stack>
        </Box>

        {/* Adjust Split */}
        <Stack gap={2.5}>
          <Font variant="body-bold" text="Número de Pessoas" />
          <Stack direction="row" align="center" justify="between" gap={5}>
            <Stack direction="row" align="center" gap={2.5}>
              <Button variant="outline-icon-xs" label="-" onClick={handleDecrease} />
              <div className="w-12 text-center">
                <Font variant="h3" text={String(peopleCount)} />
              </div>
              <Button variant="outline-icon-xs" label="+" onClick={handleIncrease} />
            </Stack>
            <Stack gap={0} align="end">
              <Font variant="auxiliary" text="Valor por Pessoa" />
              <Font variant="h3" text={formatPrice(amountPerPerson)} className="text-emerald-600" />
            </Stack>
          </Stack>
        </Stack>

        {/* Payment Method Selector */}
        <Stack gap={2.5}>
          <Font variant="body-bold" text="Forma de Pagamento (Fatia Ativa)" />
          <Select 
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="pix">PIX</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="debito">Débito</option>
            <option value="credito">Crédito</option>
          </Select>
        </Stack>

        {/* Trigger Complete Action */}
        <Button 
          variant="outline-success" 
          fullWidth 
          label="Registrar pagamento parcial" 
          icon={CreditCard}
          onClick={() => onCompleteSplit && onCompleteSplit({ peopleCount, amountPerPerson, serviceFee })}
        />
      </Stack>
    </Box>
  )
}
