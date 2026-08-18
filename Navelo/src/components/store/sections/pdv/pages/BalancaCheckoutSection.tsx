"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Button } from "@/components/store/base/Button"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Icon } from "@/components/store/base/Icon"
import { Grid } from "@/components/store/base/Grid"
import { Scale, Settings, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { ScaleStatusModal } from "@/components/store/sections/pdv/modals/ScaleStatusModal"
import { UI_STRINGS } from "@/constants/strings"

export interface BalancaCheckoutSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const BalancaCheckoutSection: React.FC<BalancaCheckoutSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [enabled, setEnabled] = React.useState(false)
  const [modelo, setModelo] = React.useState("filizola")
  const [porta, setPorta] = React.useState("COM1")
  const [baudRate, setBaudRate] = React.useState("4800")
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const s = UI_STRINGS.scales

  // Advanced form states (e.g. dataBits, stopBits, parity)
  const [dataBits, setDataBits] = React.useState("8")
  const [stopBits, setStopBits] = React.useState("1")
  const [parity, setParity] = React.useState("none")

  const [modalMsg, setModalMsg] = React.useState<string | null>(null)

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.checkoutScaleTitle)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.checkoutScaleTitle])

  const handleSave = () => {
    onCancel()
  }

  const handleTestCommunication = () => {
    setModalMsg("Testando comunicação com a balança...")
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
          {/* Habilitar */}
          <Stack direction="row" align="start" justify="between" w="full" gap={5}>
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={UI_STRINGS.selfService.enableToggle} />
              <Font
                variant="description"
                text={s.enableCheckoutScaleDesc}
                color="muted"
              />
            </Stack>
            <Switch
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
          </Stack>

          {/* Seletor Modelo */}
          <Box opacity={enabled ? "100" : "50"} w="full">
            <Stack gap={1} w="full">
              <Font variant="sub-tiny-bold" text={s.scaleModelLabel} />
              <CustomSelect
                value={modelo}
                onChange={(val) => setModelo(val)}
                disabled={!enabled}
              >
                <CustomSelectItem value="filizola" text={s.fizilolaModel} icon={Scale} />
                <CustomSelectItem value="toledo" text={s.toledoModel} icon={Scale} />
                <CustomSelectItem value="urano" text={s.uranoModel} icon={Scale} />
              </CustomSelect>
            </Stack>
          </Box>

          {/* Seletor Porta */}
          <Box opacity={enabled ? "100" : "50"} w="full">
            <Stack gap={1} w="full">
              <Font variant="sub-tiny-bold" text={s.portLabel} />
              <CustomSelect
                value={porta}
                onChange={(val) => setPorta(val)}
                disabled={!enabled}
              >
                <CustomSelectItem value="COM1" text={`COM1`} icon={Settings} />
                <CustomSelectItem value="COM2" text={`COM2`} icon={Settings} />
                <CustomSelectItem value="COM3" text={`COM3`} icon={Settings} />
                <CustomSelectItem value="COM4" text={`COM4`} icon={Settings} />
              </CustomSelect>
            </Stack>
          </Box>

          {/* Link: Não encontrei a porta de comunicação */}
          <Button
            variant="ghost-primary"
            label={s.portHelpButton}
            disabled={!enabled}
            onClick={() => {
              if (enabled) {
                setModalMsg("Certifique-se de que a balança está ligada e os drivers estão instalados.");
              }
            }}
          />

          {/* Velocidade de comunicação */}
          <Box opacity={enabled ? "100" : "50"} w="full">
            <Stack gap={1} w="full">
              <Font variant="sub-tiny-bold" text={s.baudRateLabel} />
              <CustomSelect
                value={baudRate}
                onChange={(val) => setBaudRate(val)}
                disabled={!enabled}
              >
                <CustomSelectItem value="2400" text="2400" icon={Settings} />
                <CustomSelectItem value="4800" text="4800" icon={Settings} />
                <CustomSelectItem value="9600" text="9600" icon={Settings} />
                <CustomSelectItem value="19200" text="19200" icon={Settings} />
              </CustomSelect>
            </Stack>
          </Box>

          {/* Configurações avançadas Accordion */}
          <Box opacity={enabled ? "100" : "50"} w="full">
            <Stack gap={2.5} w="full">
              <Box
                cursor={enabled ? "pointer" : undefined}
                onClick={() => enabled && setShowAdvanced((prev) => !prev)}
                w="full"
                paddingY={2.5}
              >
                <Stack
                  direction="row"
                  align="center"
                  justify="between"
                  gap={0}
                  w="full"
                >
                  <Font variant="body-bold" text={s.advancedSettingsTitle} color={enabled ? "foreground" : "muted"} />
                  <Icon icon={showAdvanced ? ChevronUp : ChevronDown} size={16} color="muted" />
                </Stack>
              </Box>

              {enabled && showAdvanced && (
                <Stack gap={5} w="full">
                  <Grid cols={3} gap={5}>
                    <Stack gap={1} w="full">
                      <Font variant="sub-tiny-bold" text={s.dataBitsLabel} />
                      <CustomSelect value={dataBits} onChange={(val) => setDataBits(val)}>
                        <CustomSelectItem value="7" text="7" icon={Settings} />
                        <CustomSelectItem value="8" text="8" icon={Settings} />
                      </CustomSelect>
                    </Stack>

                    <Stack gap={1} w="full">
                      <Font variant="sub-tiny-bold" text={s.stopBitsLabel} />
                      <CustomSelect value={stopBits} onChange={(val) => setStopBits(val)}>
                        <CustomSelectItem value="1" text="1" icon={Settings} />
                        <CustomSelectItem value="2" text="2" icon={Settings} />
                      </CustomSelect>
                    </Stack>

                    <Stack gap={1} w="full">
                      <Font variant="sub-tiny-bold" text={s.parityLabel} />
                      <CustomSelect value={parity} onChange={(val) => setParity(val)}>
                        <CustomSelectItem value="none" text={s.parityNone} icon={Settings} />
                        <CustomSelectItem value="odd" text={s.parityOdd} icon={Settings} />
                        <CustomSelectItem value="even" text={s.parityEven} icon={Settings} />
                      </CustomSelect>
                    </Stack>
                  </Grid>
                </Stack>
              )}
            </Stack>
          </Box>

          <Box h="h-[1px]" w="full" bg="bg-border" />

          {/* Nota */}
          <Font
            variant="description"
            text={s.testWeightNote}
            color="muted"
            align="center"
          />

          {/* Botão de Teste */}
          <Box w="full">
            <Button
              type="button"
              variant="outline"
              label={s.testConnectionButton}
              icon={RefreshCw}
              disabled={!enabled}
              onClick={handleTestCommunication}
            />
          </Box>
        </Stack>
      </Box>

      {/* Ações de Cancelar / Salvar */}
      <FormActions
        confirmLabel={UI_STRINGS.common.save}
        onConfirm={handleSave}
        onCancel={onCancel}
      />

      <ScaleStatusModal
        isOpen={modalMsg !== null}
        onClose={() => setModalMsg(null)}
        title={s.infoModalTitle}
        subtitle={s.infoModalSubtitle}
        message={modalMsg || ""}
      />
    </Stack>
  )
}
