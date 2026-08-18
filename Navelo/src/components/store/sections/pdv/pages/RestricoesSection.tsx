"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Switch } from "@/components/store/base/Switch"
import { UI_STRINGS } from "@/constants/strings"

export interface RestricoesSectionProps {
  onCancel: () => void
  onSave?: (data: Record<string, unknown>) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

const CustomCheckbox = ({ checked, onChange, label }: { checked: boolean, onChange: () => void, label: string }) => (
  <Stack direction="row" gap={5} align="center" justify="between" w="full">
    <Box flex="1">
      <Font variant="body" text={label} align="left" />
    </Box>
    <Box shrink="0">
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
  const s = UI_STRINGS.restrictions

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
    setCustomTitle?.(s.title)
    setCustomActions?.(null)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, onCancel, s.title])

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
        <Font variant="body-bold" text={UI_STRINGS.tabsConfig.actionsCol} />

        <Stack gap={5} w="full">
          <CustomCheckbox
            checked={cancelamento}
            onChange={() => setCancelamento(!cancelamento)}
            label={s.requireSupervisorForCancelToggle}
          />
          <CustomCheckbox
            checked={reimpressao}
            onChange={() => setReimpressao(!reimpressao)}
            label={UI_STRINGS.restrictions.reprintToggle}
          />
          <CustomCheckbox
            checked={transferencia}
            onChange={() => setTransferencia(!transferencia)}
            label={UI_STRINGS.restrictions.transferToggle}
          />
          <CustomCheckbox
            checked={complemento}
            onChange={() => setComplemento(!complemento)}
            label={UI_STRINGS.restrictions.complementToggle}
          />
          <CustomCheckbox
            checked={descontos}
            onChange={() => setDescontos(!descontos)}
            label={UI_STRINGS.restrictions.discountToggle}
          />
        </Stack>

        <Box w="full">
          <Input
            label={UI_STRINGS.restrictions.discountLimitLabel}
            value={`% ${descontoLimite}`}
            onChange={(e) => {
              const val = e.target.value.replace("% ", "")
              setDescontoLimite(val)
            }}
          />
        </Box>

        {/* Botão de Salvar na Cor Primária na parte inferior */}
        <FormActions
          confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton}
          onConfirm={handleSaveClick}
          isSubmit={false}
          onCancel={onCancel}
        />
      </Stack>
    </Box>
  )
}
