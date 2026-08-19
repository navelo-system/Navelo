"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Checkbox } from "@/components/store/base/Checkbox"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Monitor } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface OpcoesPedidoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
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
        <Stack direction="row" gap={5} w="full">
          <Box w="w-[2px]" bg="bg-border" shrink="0" />
          <Stack direction="row" align="start" gap={2.5} flex="1">
            <Checkbox checked={avisoContinuo} onChange={(e) => setAvisoContinuo(e.target.checked)} />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={UI_STRINGS.ifood.continuousSoundCheckboxLabel} />
              <Font variant="description" text={o.continuousSoundDesc} color="muted" />
            </Stack>
          </Stack>
        </Stack>
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
  return (
    <Stack gap={2.5} w="full">
      <Font variant="description" text={o.deviceReceivingOrdersLabel} color="muted" />
      <CustomSelect value={dispositivo} onChange={setDispositivo} placeholder={o.selectDevicePlaceholder}>
        <CustomSelectItem value="dev-06" text={o.device06} icon={Monitor} />
        <CustomSelectItem value="dev-01" text={o.device01} icon={Monitor} />
        <CustomSelectItem value="dev-caixa" text={o.mainCashierDevice} icon={Monitor} />
      </CustomSelect>
    </Stack>
  )
}

export const OpcoesPedidoSection: React.FC<OpcoesPedidoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
}) => {
  const [login, setLogin] = React.useState(true)
  const [bloquearForaHorario, setBloquearForaHorario] = React.useState(true)
  const [notificacao, setNotificacao] = React.useState(true)
  const [avisoSonoro, setAvisoSonoro] = React.useState(true)
  const [avisoContinuo, setAvisoContinuo] = React.useState(false)
  const [dispositivo, setDispositivo] = React.useState("dev-06")
  const s = UI_STRINGS.orderOptions

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
      <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
        <Stack gap={5} w="full">
          <OpcoesPedidoTogglesCard
            login={login} setLogin={setLogin}
            bloquearForaHorario={bloquearForaHorario} setBloquearForaHorario={setBloquearForaHorario}
            notificacao={notificacao} setNotificacao={setNotificacao}
            avisoSonoro={avisoSonoro} setAvisoSonoro={setAvisoSonoro}
            avisoContinuo={avisoContinuo} setAvisoContinuo={setAvisoContinuo}
          />
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <OpcoesPedidoDeviceCard dispositivo={dispositivo} setDispositivo={setDispositivo} />
        </Stack>
      </Box>

      <Box bg="bg-surface" border borderColor="border-border" radius="default" padding={5} w="full">
        <Font variant="description" text={s.deviceInfoNote} color="muted" />
      </Box>

      <FormActions confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton} onConfirm={onCancel} onCancel={onCancel} />
    </Stack>
  )
}
