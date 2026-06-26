import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Button } from "../base/Button"
import { Input } from "../base/Input"
import { Badge } from "../base/Badge"
import { CircularIcon } from "../intermediary/CircularIcon"
import { KeyRound, Lock, Unlock, DollarSign, ArrowDownRight, ArrowUpLeft } from "lucide-react"

export interface CashSessionManagerProps {
  initialOpenState?: boolean
  operatorName?: string
  onStateChange?: (isOpen: boolean) => void
}

export const CashSessionManager: React.FC<CashSessionManagerProps> = ({
  initialOpenState = false,
  operatorName = "Marcos Silva",
  onStateChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(initialOpenState)
  const [openingBalance, setOpeningBalance] = React.useState("100,00")
  const [currentCash, setCurrentCash] = React.useState(100.0)

  const handleOpen = () => {
    const val = parseFloat(openingBalance.replace(",", ".")) || 0
    setCurrentCash(val)
    setIsOpen(true)
    if (onStateChange) onStateChange(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    if (onStateChange) onStateChange(false)
  }

  const handleSangria = () => {
    const amount = prompt("Digite o valor da Sangria (Retirada):")
    if (amount) {
      const val = parseFloat(amount.replace(",", ".")) || 0
      setCurrentCash(prev => Math.max(0, prev - val))
      alert(`Sangria de R$ ${val.toFixed(2)} registrada!`)
    }
  }

  const handleSuprimento = () => {
    const amount = prompt("Digite o valor do Suprimento (Aporte):")
    if (amount) {
      const val = parseFloat(amount.replace(",", ".")) || 0
      setCurrentCash(prev => prev + val)
      alert(`Suprimento de R$ ${val.toFixed(2)} registrado!`)
    }
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Box padding={5} bg="bg-surface" border borderColor="border-border" radius="default">
      <Stack gap={5}>
        {/* Header */}
        <Stack direction="row" align="center" justify="between" gap={5}>
          <Stack direction="row" align="center" gap={2.5}>
            <CircularIcon icon={isOpen ? Unlock : Lock} variant={isOpen ? "success" : "danger"} />
            <Stack gap={0}>
              <Font variant="body-bold" text="Sessão de Caixa" />
              <Font variant="description" text={`Operador: ${operatorName}`} />
            </Stack>
          </Stack>
          <Badge variant={isOpen ? "success" : "danger"} label={isOpen ? "Aberto" : "Fechado"} />
        </Stack>

        <div className="h-[2px] bg-border w-full" />

        {!isOpen ? (
          /* Closed State Form */
          <Stack gap={5}>
            <Font variant="description" text="O caixa está atualmente fechado. Digite o valor de fundo de troco para iniciar as vendas." />
            <Input 
              label="Fundo de Abertura (Suprimento Inicial)"
              placeholder="0,00"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              variant="default"
            />
            <Button 
              variant="outline-success" 
              fullWidth 
              label="Abrir turno de vendas" 
              icon={Unlock}
              onClick={handleOpen}
            />
          </Stack>
        ) : (
          /* Open State Dashboard */
          <Stack gap={5}>
            <Box padding={5} bg="bg-surface-sunken" radius="default" border borderColor="border-border">
              <Stack gap={1} align="center">
                <Font variant="auxiliary" text="Saldo Estimado em Dinheiro" />
                <Font variant="h2" text={formatPrice(currentCash)} className="text-emerald-600" />
              </Stack>
            </Box>

            {/* Quick Actions */}
            <Stack gap={2.5}>
              <Font variant="body-bold" text="Movimentações de Caixa" />
              <Stack direction="row" gap={2.5}>
                <Button 
                  variant="outline" 
                  fullWidth 
                  label="Sangria" 
                  icon={ArrowDownRight}
                  onClick={handleSangria}
                />
                <Button 
                  variant="outline" 
                  fullWidth 
                  label="Suprimento" 
                  icon={ArrowUpLeft}
                  onClick={handleSuprimento}
                />
              </Stack>
            </Stack>

            <div className="h-[2px] bg-border w-full" />

            {/* Close Button */}
            <Button 
              variant="outline-danger" 
              fullWidth 
              label="Fechar turno e imprimir resumo" 
              icon={Lock}
              onClick={handleClose}
            />
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
