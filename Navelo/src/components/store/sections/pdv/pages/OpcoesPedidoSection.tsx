"use client"

/* eslint-disable max-lines-per-function */

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

export const OpcoesPedidoSection: React.FC<OpcoesPedidoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
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

  const handleSave = () => {
    onCancel()
  }

  return (
    <Stack gap={5} w="full">
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          {/* Login */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={login}
              onChange={(e) => setLogin(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={s.askCustomerNameToggle} />
              <Font
                variant="description"
                text={UI_STRINGS.orderOptions.loginDesc}
                color="muted"
              />
            </Stack>
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Bloquear fora do horário */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={bloquearForaHorario}
              onChange={(e) => setBloquearForaHorario(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={UI_STRINGS.orderOptions.blockOutOfHoursToggle} />
              <Font
                variant="description"
                text={UI_STRINGS.orderOptions.blockOutOfHoursDesc}
                color="muted"
              />
            </Stack>
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Notificação */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={notificacao}
              onChange={(e) => setNotificacao(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={UI_STRINGS.ifood.notificationCheckboxLabel} />
              <Font
                variant="description"
                text={UI_STRINGS.orderOptions.notificationDesc}
                color="muted"
              />
            </Stack>
          </Stack>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Aviso Sonoro */}
          <Stack direction="row" align="start" gap={2.5} w="full">
            <Checkbox
              checked={avisoSonoro}
              onChange={(e) => setAvisoSonoro(e.target.checked)}
            />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={UI_STRINGS.orderOptions.soundAlertToggle} />
              <Font
                variant="description"
                text={UI_STRINGS.orderOptions.soundAlertDesc}
                color="muted"
              />
            </Stack>
          </Stack>

          {/* Aviso Sonoro Contínuo (Recuado) */}
          {avisoSonoro && (
            <Stack direction="row" gap={5} w="full">
              {/* Linha vertical de recuo */}
              <Box w="w-[2px]" bg="bg-border" shrink="0" />
              <Stack direction="row" align="start" gap={2.5} flex="1">
                <Checkbox
                  checked={avisoContinuo}
                  onChange={(e) => setAvisoContinuo(e.target.checked)}
                />
                <Stack gap={1} flex="1">
                  <Font variant="body-bold" text={UI_STRINGS.ifood.continuousSoundCheckboxLabel} />
                  <Font
                    variant="description"
                    text={UI_STRINGS.orderOptions.continuousSoundDesc}
                    color="muted"
                  />
                </Stack>
              </Stack>
            </Stack>
          )}

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Selecionar dispositivo */}
          <Stack gap={2.5} w="full">
            <Font variant="description" text={UI_STRINGS.orderOptions.deviceReceivingOrdersLabel} color="muted" />
            <CustomSelect
              value={dispositivo}
              onChange={(val) => setDispositivo(val)}
              placeholder={UI_STRINGS.orderOptions.selectDevicePlaceholder}
            >
              <CustomSelectItem value="dev-06" text={UI_STRINGS.orderOptions.device06} icon={Monitor} />
              <CustomSelectItem value="dev-01" text={UI_STRINGS.orderOptions.device01} icon={Monitor} />
              <CustomSelectItem value="dev-caixa" text={UI_STRINGS.orderOptions.mainCashierDevice} icon={Monitor} />
            </CustomSelect>
          </Stack>
        </Stack>
      </Box>

      {/* Nota informativa */}
      <Box
        bg="bg-surface"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Font
          variant="description"
          text={UI_STRINGS.orderOptions.deviceInfoNote}
          color="muted"
        />
      </Box>

      {/* Botões de Ação */}
      <FormActions
        confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton}
        onConfirm={handleSave}
        onCancel={onCancel}
      />
    </Stack>
  )
}
