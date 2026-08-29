"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Button } from "@/components/store/base/Button"
import { Warning } from "@/components/store/base/Warning"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Monitor, Check, Info } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import {
  loadCatalogoOnlineSettings,
  saveCatalogoOnlineSettings,
  CatalogoOnlineOrders,
} from "@/lib/sync/catalogoOnlineSettings"
import { getActiveDevices } from "@/lib/sync/deviceSyncSettings"

export interface OpcoesPedidoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function OpcoesPedidoTogglesCard({
  login, setLogin,
  bloquearForaHorario, setBloquearForaHorario,
  notificacao, setNotificacao,
  avisoSonoro, setAvisoSonoro,
  avisoContinuo, setAvisoContinuo,
}: {
  login: boolean; setLogin: (v: boolean) => void
  bloquearForaHorario: boolean; setBloquearForaHorario: (v: boolean) => void
  notificacao: boolean; setNotificacao: (v: boolean) => void
  avisoSonoro: boolean; setAvisoSonoro: (v: boolean) => void
  avisoContinuo: boolean; setAvisoContinuo: (v: boolean) => void
}) {
  const o = UI_STRINGS.orderOptions
  return (
    <>
      <Stack direction="row" align="start" gap={2.5} w="full">
        <Checkbox checked={login} onChange={(e) => setLogin(e.target.checked)} />
        <Stack gap={1} flex="1">
          <Font variant="body-bold" text={o.askCustomerNameToggle} />
          <Font variant="description" text={o.loginDesc} color="muted" />
        </Stack>
      </Stack>
      <Box h="h-[1px]" w="full" bg="bg-border" />

      <Stack direction="row" align="start" gap={2.5} w="full">
        <Checkbox checked={bloquearForaHorario} onChange={(e) => setBloquearForaHorario(e.target.checked)} />
        <Stack gap={1} flex="1">
          <Font variant="body-bold" text={o.blockOutOfHoursToggle} />
          <Font variant="description" text={o.blockOutOfHoursDesc} color="muted" />
        </Stack>
      </Stack>
      <Box h="h-[1px]" w="full" bg="bg-border" />

      <Stack direction="row" align="start" gap={2.5} w="full">
        <Checkbox checked={notificacao} onChange={(e) => setNotificacao(e.target.checked)} />
        <Stack gap={1} flex="1">
          <Font variant="body-bold" text={UI_STRINGS.ifood.notificationCheckboxLabel} />
          <Font variant="description" text={o.notificationDesc} color="muted" />
        </Stack>
      </Stack>
      <Box h="h-[1px]" w="full" bg="bg-border" />

      <Stack direction="row" align="start" gap={2.5} w="full">
        <Checkbox checked={avisoSonoro} onChange={(e) => setAvisoSonoro(e.target.checked)} />
        <Stack gap={1} flex="1">
          <Font variant="body-bold" text={o.soundAlertToggle} />
          <Font variant="description" text={o.soundAlertDesc} color="muted" />
        </Stack>
      </Stack>

      {avisoSonoro && (
        <>
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox checked={avisoContinuo} onChange={(e) => setAvisoContinuo(e.target.checked)} />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={UI_STRINGS.ifood.continuousSoundCheckboxLabel} />
              <Font variant="description" text={o.continuousSoundDesc} color="muted" />
            </Stack>
          </Stack>
        </>
      )}
    </>
  )
}

function OpcoesPedidoDeviceCard({
  dispositivo,
  setDispositivo,
}: {
  dispositivo: string
  setDispositivo: (v: string) => void
}) {
  const o = UI_STRINGS.orderOptions
  const devices = React.useMemo(() => getActiveDevices(), [])

  // Se o valor selecionado não existir na lista ou for antigo, seleciona o primeiro disponível
  React.useEffect(() => {
    if (devices.length > 0 && (!dispositivo || !devices.some((d) => d.id === dispositivo || d.name === dispositivo))) {
      setDispositivo(devices[0].id)
    }
  }, [devices, dispositivo, setDispositivo])

  return (
    <Stack gap={2.5} w="full">
      <Font variant="description" text={o.deviceReceivingOrdersLabel} color="muted" />
      <CustomSelect value={dispositivo} onChange={setDispositivo} placeholder={o.selectDevicePlaceholder}>
        {devices.map((d) => (
          <CustomSelectItem
            key={d.id}
            value={d.id}
            text={d.isCurrent ? `${d.name} (Este dispositivo)` : d.name}
            icon={Monitor}
          />
        ))}
      </CustomSelect>
    </Stack>
  )
}

export const OpcoesPedidoSection: React.FC<OpcoesPedidoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [initial, setInitial] = React.useState<CatalogoOnlineOrders>(() => loadCatalogoOnlineSettings().orders)
  const [draft, setDraft] = React.useState<CatalogoOnlineOrders>(() => loadCatalogoOnlineSettings().orders)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const s = UI_STRINGS.orderOptions

  const isDirty = React.useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initial),
    [draft, initial]
  )

  const handleBack = React.useCallback(() => {
    if (isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      onCancel()
    }
  }, [isDirty, onCancel])

  const handleSave = React.useCallback(() => {
    const full = loadCatalogoOnlineSettings()
    saveCatalogoOnlineSettings({
      ...full,
      orders: draft,
    })
    setInitial(draft)
    onCancel()
  }, [draft, onCancel])

  const handleBackRef = React.useRef(handleBack)
  const handleSaveRef = React.useRef(handleSave)

  React.useEffect(() => {
    handleBackRef.current = handleBack
    handleSaveRef.current = handleSave
  }, [handleBack, handleSave])

  React.useEffect(() => {
    setCustomBack?.(() => () => handleBackRef.current())
    setCustomTitle?.(s.title)
    setCustomActions?.(
      <Button
        variant="primary-pill-icon"
        icon={Check}
        onClick={() => handleSaveRef.current()}
      />
    )
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, s.title])

  return (
    <>
      <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
        <Stack gap={5} w="full">
          <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
            <Stack gap={5} w="full">
              <OpcoesPedidoTogglesCard
                login={draft.login}
                setLogin={(val) => setDraft((p) => ({ ...p, login: val }))}
                bloquearForaHorario={draft.bloquearForaHorario}
                setBloquearForaHorario={(val) => setDraft((p) => ({ ...p, bloquearForaHorario: val }))}
                notificacao={draft.notificacao}
                setNotificacao={(val) => setDraft((p) => ({ ...p, notificacao: val }))}
                avisoSonoro={draft.avisoSonoro}
                setAvisoSonoro={(val) => setDraft((p) => ({ ...p, avisoSonoro: val }))}
                avisoContinuo={draft.avisoContinuo}
                setAvisoContinuo={(val) => setDraft((p) => ({ ...p, avisoContinuo: val }))}
              />
              <Box h="h-[1px]" w="full" bg="bg-border" />
              <OpcoesPedidoDeviceCard
                dispositivo={draft.dispositivo}
                setDispositivo={(val) => setDraft((p) => ({ ...p, dispositivo: val }))}
              />
            </Stack>
          </Box>

          <Warning variant="info" icon={Info} title={s.deviceInfoNote} />
        </Stack>
      </Box>

      {/* Modal de Descarte de Alterações */}
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          onCancel()
        }}
      />
    </>
  )
}
