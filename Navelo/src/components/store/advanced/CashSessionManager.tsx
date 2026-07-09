import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Button } from "../base/Button"
import { Input } from "../base/Input"
import { Badge } from "../base/Badge"
import { SectionHeader } from "../intermediary/SectionHeader"
import { Lock, Unlock, ArrowDownRight, ArrowUpLeft } from "lucide-react"

export interface CashSessionManagerProps {
  initialOpenState?: boolean
  operatorName?: string
  onStateChange?: (isOpen: boolean) => void
}

interface ClosedProps {
  openingBalance: string
  setOpeningBalance: (val: string) => void
  handleOpen: () => void
}

const CashSessionClosed: React.FC<ClosedProps> = ({ openingBalance, setOpeningBalance, handleOpen }) => (
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
      variant="success" 
      fullWidth 
      label="Abrir turno de vendas" 
      icon={Unlock}
      onClick={handleOpen}
    />
  </Stack>
)

interface OpenProps {
  currentCash: number
  formatPrice: (val: number) => string
  handleSangria: () => void
  handleSuprimento: () => void
  handleClose: () => void
  sangriaAmount: string
  setSangriaAmount: (v: string) => void
  sangriaMsg: string
  suprimentoAmount: string
  setSuprimentoAmount: (v: string) => void
  suprimentoMsg: string
}

const CashSessionOpen: React.FC<OpenProps> = ({ currentCash, formatPrice, handleSangria, handleSuprimento, handleClose, sangriaAmount, setSangriaAmount, sangriaMsg, suprimentoAmount, setSuprimentoAmount, suprimentoMsg }) => (
  <Stack gap={5}>
    <Box padding={0}>
      <Stack gap={1} align="center">
        <Font variant="auxiliary" text="Saldo Estimado em Dinheiro" />
        <Font variant="h2" text={formatPrice(currentCash)} color="success" />
      </Stack>
    </Box>
    <Stack gap={2.5}>
      <Font variant="body-bold" text="Sangria (Retirada)" />
      <Stack direction="row" gap={2.5}>
        <Input placeholder="Valor..." value={sangriaAmount} onChange={(e) => setSangriaAmount(e.target.value)} />
        <Button variant="outline" label="Registrar" icon={ArrowDownRight} onClick={handleSangria} />
      </Stack>
      {sangriaMsg && <Font variant="description" text={sangriaMsg} color="success" />}
    </Stack>
    <Stack gap={2.5}>
      <Font variant="body-bold" text="Suprimento (Aporte)" />
      <Stack direction="row" gap={2.5}>
        <Input placeholder="Valor..." value={suprimentoAmount} onChange={(e) => setSuprimentoAmount(e.target.value)} />
        <Button variant="outline" label="Registrar" icon={ArrowUpLeft} onClick={handleSuprimento} />
      </Stack>
      {suprimentoMsg && <Font variant="description" text={suprimentoMsg} color="success" />}
    </Stack>
    <Box h="h-[2px]" w="full" bg="bg-border" opacity="25" />
    <Button variant="danger" fullWidth label="Fechar turno e imprimir resumo" icon={Lock} onClick={handleClose} />
  </Stack>
)

export const CashSessionManager: React.FC<CashSessionManagerProps> = ({
  initialOpenState = false,
  operatorName = "Marcos Silva",
  onStateChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(initialOpenState)
  const [openingBalance, setOpeningBalance] = React.useState("100,00")
  const [currentCash, setCurrentCash] = React.useState(100.0)
  const [sangriaAmount, setSangriaAmount] = React.useState("")
  const [suprimentoAmount, setSuprimentoAmount] = React.useState("")
  const [sangriaMsg, setSangriaMsg] = React.useState("")
  const [suprimentoMsg, setSuprimentoMsg] = React.useState("")

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
    const val = parseFloat(sangriaAmount.replace(",", ".")) || 0
    if (val > 0) {
      setCurrentCash(prev => Math.max(0, prev - val))
      setSangriaMsg(`Sangria de R$ ${val.toFixed(2)} registrada!`)
      setSangriaAmount("")
    }
  }

  const handleSuprimento = () => {
    const val = parseFloat(suprimentoAmount.replace(",", ".")) || 0
    if (val > 0) {
      setCurrentCash(prev => prev + val)
      setSuprimentoMsg(`Suprimento de R$ ${val.toFixed(2)} registrado!`)
      setSuprimentoAmount("")
    }
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  return (
    <Box padding={5} bg="bg-surface" radius="default">
      <Stack gap={5}>
        <SectionHeader
          icon={isOpen ? Unlock : Lock}
          title="Sessão de Caixa"
          subtitle={`Operador: ${operatorName}`}
          action={<Badge variant={isOpen ? "success" : "danger"} label={isOpen ? "Aberto" : "Fechado"} />}
        />
        <Box h="h-[2px]" w="full" bg="bg-border" opacity="25" />
        {!isOpen ? (
          <CashSessionClosed openingBalance={openingBalance} setOpeningBalance={setOpeningBalance} handleOpen={handleOpen} />
        ) : (
          <CashSessionOpen currentCash={currentCash} formatPrice={formatPrice} handleSangria={handleSangria} handleSuprimento={handleSuprimento} handleClose={handleClose} sangriaAmount={sangriaAmount} setSangriaAmount={setSangriaAmount} sangriaMsg={sangriaMsg} suprimentoAmount={suprimentoAmount} setSuprimentoAmount={setSuprimentoAmount} suprimentoMsg={suprimentoMsg} />
        )}
      </Stack>
    </Box>
  )
}
