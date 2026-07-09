"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Input } from "../../base/Input"
import { Button } from "../../base/Button"
import { Switch } from "../../base/Switch"

export interface RestricoesSectionProps {
  onCancel: () => void
  onSave?: (data: Record<string, unknown>) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

const CustomCheckbox = ({ checked, onChange, label }: { checked: boolean, onChange: () => void, label: string }) => (
  <Stack direction="col" mobileDirection="row" gap={5} align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full">
    <Box order="2" mdOrder="1">
      <Font variant="body" text={label} align="left" />
    </Box>
    <Box order="1" mdOrder="2">
      <Switch checked={checked} onChange={onChange} />
    </Box>
  </Stack>
)

export const RestricoesSection: React.FC<RestricoesSectionProps> = ({
  onCancel,
  onSave,
  setCustomBack,
  setCustomTitle,
  setCustomActions
}) => {
  const [cancelamento, setCancelamento] = React.useState(true)
  const [reimpressao, setReimpressao] = React.useState(true)
  const [transferencia, setTransferencia] = React.useState(false)
  const [complemento, setComplemento] = React.useState(true)
  const [descontos, setDescontos] = React.useState(true)
  const [descontoLimite, setDescontoLimite] = React.useState("10,00")

  const handleSaveClick = React.useCallback(() => {
    onSave?.({
      cancelamento,
      reimpressao,
      transferencia,
      complemento,
      descontos,
      descontoLimite
    })
    onCancel()
  }, [cancelamento, reimpressao, transferencia, complemento, descontos, descontoLimite, onSave, onCancel])

  // Configure header title and back action (no top right save button anymore)
  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Restrições de acesso")
    setCustomActions?.(null)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, onCancel])

  return (
    <Box
      bg="bg-white"
      border={true}
      borderColor="border-border"
      radius="default"
      padding={5}
      w="full"
    >
      <Stack gap={5} w="full">
        <Font variant="body-bold" text="Ações" />

        <Stack gap={5} w="full">
          <CustomCheckbox
            checked={cancelamento}
            onChange={() => setCancelamento(!cancelamento)}
            label="Cancelamento de itens, vendas e pagamentos"
          />
          <CustomCheckbox
            checked={reimpressao}
            onChange={() => setReimpressao(!reimpressao)}
            label="Reimpressão de tickets"
          />
          <CustomCheckbox
            checked={transferencia}
            onChange={() => setTransferencia(!transferencia)}
            label="Transferência de produtos entre mesas"
          />
          <CustomCheckbox
            checked={complemento}
            onChange={() => setComplemento(!complemento)}
            label="Cadastrar itens de complemento na venda"
          />
          <CustomCheckbox
            checked={descontos}
            onChange={() => setDescontos(!descontos)}
            label="Aplicar descontos"
          />
        </Stack>

        <Box w="full">
          <Input
            label="Limite de desconto permitido ao usuário"
            value={`% ${descontoLimite}`}
            onChange={(e) => {
              const val = e.target.value.replace("% ", "")
              setDescontoLimite(val)
            }}
          />
        </Box>

        {/* Botão de Salvar na Cor Primária na parte inferior */}
        <Box paddingY={2.5} w="full">
          <Stack direction="col" mobileDirection="row" justify="end" gap={2.5} w="w-full md:w-auto">
            <Button variant="outline" label="Cancelar" onClick={onCancel} fullWidth />
            <Button type="button" variant="primary" label="Salvar alterações" onClick={handleSaveClick} fullWidth />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
