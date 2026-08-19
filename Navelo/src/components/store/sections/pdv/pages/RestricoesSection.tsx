"use client"

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

const CustomCheckbox = ({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) => (
  <Stack direction="row" gap={5} align="center" justify="between" w="full">
    <Box flex="1">
      <Font variant="body" text={label} align="left" />
    </Box>
    <Box shrink="0">
      <Switch checked={checked} onChange={onChange} />
    </Box>
  </Stack>
)

function RestricoesList({
  cancelamento, setCancelamento,
  reimpressao, setReimpressao,
  transferencia, setTransferencia,
  complemento, setComplemento,
  descontos, setDescontos,
}: {
  cancelamento: boolean; setCancelamento: (v: boolean) => void
  reimpressao: boolean; setReimpressao: (v: boolean) => void
  transferencia: boolean; setTransferencia: (v: boolean) => void
  complemento: boolean; setComplemento: (v: boolean) => void
  descontos: boolean; setDescontos: (v: boolean) => void
}) {
  const r = UI_STRINGS.restrictions
  return (
    <Stack gap={5} w="full">
      <CustomCheckbox checked={cancelamento} onChange={() => setCancelamento(!cancelamento)} label={r.requireSupervisorForCancelToggle} />
      <CustomCheckbox checked={reimpressao} onChange={() => setReimpressao(!reimpressao)} label={r.reprintToggle} />
      <CustomCheckbox checked={transferencia} onChange={() => setTransferencia(!transferencia)} label={r.transferToggle} />
      <CustomCheckbox checked={complemento} onChange={() => setComplemento(!complemento)} label={r.complementToggle} />
      <CustomCheckbox checked={descontos} onChange={() => setDescontos(!descontos)} label={r.discountToggle} />
    </Stack>
  )
}

export const RestricoesSection: React.FC<RestricoesSectionProps> = ({
  onCancel,
  onSave,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [cancelamento, setCancelamento] = React.useState(true)
  const [reimpressao, setReimpressao] = React.useState(true)
  const [transferencia, setTransferencia] = React.useState(false)
  const [complemento, setComplemento] = React.useState(true)
  const [descontos, setDescontos] = React.useState(true)
  const [descontoLimite, setDescontoLimite] = React.useState("10,00")
  const s = UI_STRINGS.restrictions

  const handleSaveClick = React.useCallback(() => {
    onSave?.({ cancelamento, reimpressao, transferencia, complemento, descontos, descontoLimite })
    onCancel()
  }, [cancelamento, reimpressao, transferencia, complemento, descontos, descontoLimite, onSave, onCancel])

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
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Font variant="body-bold" text={UI_STRINGS.tabsConfig.actionsCol} />
        <RestricoesList
          cancelamento={cancelamento} setCancelamento={setCancelamento}
          reimpressao={reimpressao} setReimpressao={setReimpressao}
          transferencia={transferencia} setTransferencia={setTransferencia}
          complemento={complemento} setComplemento={setComplemento}
          descontos={descontos} setDescontos={setDescontos}
        />
        <Box w="full">
          <Input
            label={s.discountLimitLabel}
            value={`% ${descontoLimite}`}
            onChange={(e) => setDescontoLimite(e.target.value.replace("% ", ""))}
          />
        </Box>
        <FormActions confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton} onConfirm={handleSaveClick} isSubmit={false} onCancel={onCancel} />
      </Stack>
    </Box>
  )
}
