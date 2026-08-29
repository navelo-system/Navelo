"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Switch } from "@/components/store/base/Switch"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { Check } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import { useTenant } from "@/lib/context/TenantContext"
import {
  TenantRestrictions,
  loadTenantRestrictions,
  saveTenantRestrictions,
} from "@/lib/sync/restrictionsSettings"

export interface RestricoesSectionProps {
  onCancel: () => void
  onSave?: (data: TenantRestrictions) => void
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

function useRestricoesFormState(tenantId: string | undefined, onSave?: (data: TenantRestrictions) => void, onCancel?: () => void) {
  const initial = React.useMemo(() => loadTenantRestrictions(tenantId), [tenantId])
  const [cancelamento, setCancelamento] = React.useState(initial.cancelamento)
  const [reimpressao, setReimpressao] = React.useState(initial.reimpressao)
  const [transferencia, setTransferencia] = React.useState(initial.transferencia)
  const [complemento, setComplemento] = React.useState(initial.complemento)
  const [descontos, setDescontos] = React.useState(initial.descontos)
  const [descontoLimite, setDescontoLimite] = React.useState(initial.descontoLimite)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const isDirty = (
    cancelamento !== initial.cancelamento ||
    reimpressao !== initial.reimpressao ||
    transferencia !== initial.transferencia ||
    complemento !== initial.complemento ||
    descontos !== initial.descontos ||
    descontoLimite !== initial.descontoLimite
  )

  const handleSave = React.useCallback(() => {
    const payload: TenantRestrictions = {
      cancelamento,
      reimpressao,
      transferencia,
      complemento,
      descontos,
      descontoLimite: descontoLimite.trim() || "0,00",
    }
    saveTenantRestrictions(tenantId, payload)
    onSave?.(payload)
    onCancel?.()
  }, [cancelamento, reimpressao, transferencia, complemento, descontos, descontoLimite, tenantId, onSave, onCancel])

  const handleBack = React.useCallback(() => {
    if (isDirty) setIsDiscardModalOpen(true)
    else onCancel?.()
  }, [isDirty, onCancel])

  return {
    cancelamento, setCancelamento,
    reimpressao, setReimpressao,
    transferencia, setTransferencia,
    complemento, setComplemento,
    descontos, setDescontos,
    descontoLimite, setDescontoLimite,
    isDiscardModalOpen, setIsDiscardModalOpen,
    handleSave, handleBack,
  }
}

export const RestricoesSection: React.FC<RestricoesSectionProps> = ({
  onCancel,
  onSave,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const s = UI_STRINGS.restrictions
  const state = useRestricoesFormState(tenantId, onSave, onCancel)

  const { handleBack, handleSave } = state

  React.useEffect(() => {
    setCustomBack?.(() => () => handleBack())
    setCustomTitle?.(s.title)
    setCustomActions?.(
      <Button
        type="button"
        variant="primary-icon"
        icon={Check}
        onClick={handleSave}
      />
    )
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, handleBack, handleSave, s.title])

  return (
    <>
      <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
        <Stack gap={5} w="full">
          <Font variant="body-bold" text={UI_STRINGS.tabsConfig.actionsCol} />
          <RestricoesList
            cancelamento={state.cancelamento} setCancelamento={state.setCancelamento}
            reimpressao={state.reimpressao} setReimpressao={state.setReimpressao}
            transferencia={state.transferencia} setTransferencia={state.setTransferencia}
            complemento={state.complemento} setComplemento={state.setComplemento}
            descontos={state.descontos} setDescontos={state.setDescontos}
          />
          {state.descontos && (
            <Box w="full">
              <Input
                variant="outlined-label"
                mask="percent"
                label={s.discountLimitLabel}
                placeholder="% 0,00"
                value={`% ${state.descontoLimite}`}
                onChange={(e) => state.setDescontoLimite(e.target.value.replace("% ", ""))}
              />
            </Box>
          )}
        </Stack>
      </Box>
      <DiscardChangesModal
        isOpen={state.isDiscardModalOpen}
        onClose={() => state.setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          state.setIsDiscardModalOpen(false)
          onCancel()
        }}
      />
    </>
  )
}
