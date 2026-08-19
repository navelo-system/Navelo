"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { UI_STRINGS } from "@/constants/strings"

export interface ComprovantesSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

function ComprovanteToggleRow({
  title,
  description,
  checked,
  onChange,
  bgColor,
}: {
  title: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  bgColor?: string
}) {
  return (
    <Box padding={5} w="full" bg={bgColor}>
      <Stack direction="row" align="center" justify="between" w="full" gap={5}>
        <Stack gap={1} flex="1">
          <Font variant="body-bold" text={title} />
          {description && <Font variant="description" text={description} color="muted" />}
        </Stack>
        <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} />
      </Stack>
    </Box>
  )
}

function ComprovantesListCard({
  state,
  setState,
}: {
  state: Record<string, boolean>
  setState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}) {
  const s = UI_STRINGS.receipts
  const toggle = (key: string) => (checked: boolean) => setState((prev) => ({ ...prev, [key]: checked }))

  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
      <Box padding={5} bg="bg-surface" w="full">
        <Stack gap={1} w="full">
          <Font variant="body-bold" text={s.title} />
          <Font variant="description" text={s.headerDesc} color="muted" />
        </Stack>
      </Box>
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <Stack gap={0} w="full">
        <ComprovanteToggleRow title={s.cancellationTitle} description={s.cancellationDesc} checked={state.cancelamento} onChange={toggle("cancelamento")} />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <ComprovanteToggleRow title={s.carneTitle} checked={state.carne} onChange={toggle("carne")} />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <ComprovanteToggleRow title={s.cashClosingTitle} checked={state.fechamento} onChange={toggle("fechamento")} />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <ComprovanteToggleRow title={s.danfeSimplifiedTitle} description={s.danfeSimplifiedDesc} checked={state.danfe} onChange={toggle("danfe")} bgColor="bg-surface/50" />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <ComprovanteToggleRow title={s.nfceTitle} checked={state.nfce} onChange={toggle("nfce")} />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <ComprovanteToggleRow title={s.orderNumberTitle} description={s.orderNumberDesc} checked={state.numeroAtendimento} onChange={toggle("numeroAtendimento")} />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <ComprovanteToggleRow title={s.orderServiceTitle} description={s.orderServiceDesc} checked={state.pedidoAtendimento} onChange={toggle("pedidoAtendimento")} />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <ComprovanteToggleRow title={s.pixTitle} checked={state.pix} onChange={toggle("pix")} />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <ComprovanteToggleRow title={s.crediarioTitle} checked={state.crediario} onChange={toggle("crediario")} />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <ComprovanteToggleRow title={s.sangriaTitle} checked={state.sangria} onChange={toggle("sangria")} />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <ComprovanteToggleRow title={s.suprimentoTitle} checked={state.suprimento} onChange={toggle("suprimento")} />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <ComprovanteToggleRow title={s.ticketTitle} description={s.ticketDesc} checked={state.ticket} onChange={toggle("ticket")} />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <ComprovanteToggleRow title={s.posTransactionTitle} description={s.posTransactionDesc} checked={state.transacaoPos} onChange={toggle("transacaoPos")} />
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <ComprovanteToggleRow title={s.saleTitle} checked={state.venda} onChange={toggle("venda")} />
      </Stack>
    </Box>
  )
}

function ComprovantesSettingsCard({
  logomarca,
  setLogomarca,
}: {
  logomarca: boolean
  setLogomarca: (v: boolean) => void
}) {
  const s = UI_STRINGS.receipts
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
      <Box padding={5} bg="bg-surface" w="full">
        <Font variant="body-bold" text={s.settingsCardTitle} />
      </Box>
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <ComprovanteToggleRow title={s.logoTitle} description={s.logoDesc} checked={logomarca} onChange={setLogomarca} />
    </Box>
  )
}

const DEFAULT_STATE: Record<string, boolean> = {
  cancelamento: true,
  carne: true,
  fechamento: true,
  danfe: true,
  nfce: true,
  numeroAtendimento: false,
  pedidoAtendimento: true,
  pix: true,
  crediario: true,
  sangria: true,
  suprimento: true,
  ticket: false,
  transacaoPos: true,
  venda: true,
}

export const ComprovantesSection: React.FC<ComprovantesSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
}) => {
  const [state, setState] = React.useState<Record<string, boolean>>(DEFAULT_STATE)
  const [logomarca, setLogomarca] = React.useState(false)
  const s = UI_STRINGS.receipts

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  return (
    <Stack gap={5} w="full">
      <ComprovantesListCard state={state} setState={setState} />
      <ComprovantesSettingsCard logomarca={logomarca} setLogomarca={setLogomarca} />
      <FormActions confirmLabel={UI_STRINGS.common.save} onConfirm={onCancel} onCancel={onCancel} />
    </Stack>
  )
}
