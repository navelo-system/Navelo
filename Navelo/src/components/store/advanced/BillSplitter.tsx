import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Button } from "../base/Button"
import { CustomSelect, CustomSelectItem } from "../base/CustomSelect"
import { Switch } from "../base/Switch"
import { SectionHeader } from "../intermediary/SectionHeader"
import { Users2, CreditCard, QrCode, Coins } from "lucide-react"

export interface BillSplitterProps {
  totalAmount: number
  onCompleteSplit?: (splitInfo: { peopleCount: number; amountPerPerson: number; serviceFee: number }) => void
}

interface CalculationsProps {
  totalAmount: number
  serviceFee: number
  grandTotal: number
  applyServiceFee: boolean
  setApplyServiceFee: (val: boolean) => void
  formatPrice: (val: number) => string
}

const BillSplitterCalculations: React.FC<CalculationsProps> = ({
  totalAmount, serviceFee, grandTotal, applyServiceFee, setApplyServiceFee, formatPrice
}) => (
  <Box padding={0}>
    <Stack gap={2.5}>
      <Stack direction="row" justify="between" align="center">
        <Font variant="body" text="Consumo Subtotal" />
        <Font variant="body-bold" text={formatPrice(totalAmount)} />
      </Stack>
      <Stack direction="row" justify="between" align="center">
        <Stack direction="row" align="center" gap={2.5}>
          <Font variant="body" text="Taxa de Serviço (10%)" />
          <Switch
            checked={applyServiceFee}
            onChange={(e) => setApplyServiceFee(e.target.checked)}
          />
        </Stack>
        <Font variant="body-bold" text={formatPrice(serviceFee)} color={applyServiceFee ? "foreground" : "muted"} />
      </Stack>
      <Box h="h-[2px]" w="full" bg="bg-border" opacity="25" />
      <Stack direction="row" justify="between" align="center">
        <Font variant="body-bold" text="Total Geral" />
        <Font variant="h3" text={formatPrice(grandTotal)} color="primary" />
      </Stack>
    </Stack>
  </Box>
)

interface ControlsProps {
  peopleCount: number
  amountPerPerson: number
  handleDecrease: () => void
  handleIncrease: () => void
  formatPrice: (val: number) => string
}

const BillSplitterControls: React.FC<ControlsProps> = ({
  peopleCount, amountPerPerson, handleDecrease, handleIncrease, formatPrice
}) => (
  <Stack gap={2.5}>
    <Font variant="body-bold" text="Número de Pessoas" />
    <Stack direction="row" align="center" justify="between" gap={5}>
      <Stack direction="row" align="center" gap={2.5}>
        <Button variant="outline-icon-xs" label="-" onClick={handleDecrease} />
        <Box w="w-12" display="flex" justify="center">
          <Font variant="h3" text={String(peopleCount)} />
        </Box>
        <Button variant="outline-icon-xs" label="+" onClick={handleIncrease} />
      </Stack>
      <Stack gap={0} align="end">
        <Font variant="auxiliary" text="Valor por Pessoa" />
        <Font variant="h3" text={formatPrice(amountPerPerson)} color="success" />
      </Stack>
    </Stack>
  </Stack>
)

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
    <Box padding={5} bg="bg-surface" radius="default">
      <Stack gap={5}>
        <SectionHeader
          icon={Users2}
          title="Divisão de Conta"
          subtitle="Divida o consumo de mesas e comandas de forma rápida."
        />
        <Box h="h-[2px]" w="full" bg="bg-border" opacity="25" />
        
        <BillSplitterCalculations
          totalAmount={totalAmount}
          serviceFee={serviceFee}
          grandTotal={grandTotal}
          applyServiceFee={applyServiceFee}
          setApplyServiceFee={setApplyServiceFee}
          formatPrice={formatPrice}
        />

        <BillSplitterControls
          peopleCount={peopleCount}
          amountPerPerson={amountPerPerson}
          handleDecrease={handleDecrease}
          handleIncrease={handleIncrease}
          formatPrice={formatPrice}
        />

        <Stack gap={2.5}>
          <Font variant="body-bold" text="Forma de Pagamento (Fatia Ativa)" />
          <CustomSelect
            value={paymentMethod}
            onChange={setPaymentMethod}
            placeholder="Selecione..."
          >
            <CustomSelectItem value="pix" text="PIX" icon={QrCode} />
            <CustomSelectItem value="dinheiro" text="Dinheiro" icon={Coins} />
            <CustomSelectItem value="debito" text="Débito" icon={CreditCard} />
            <CustomSelectItem value="credito" text="Crédito" icon={CreditCard} />
          </CustomSelect>
        </Stack>

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
