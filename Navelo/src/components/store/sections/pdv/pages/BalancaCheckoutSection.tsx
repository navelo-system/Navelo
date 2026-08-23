"use client"

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

function BalancaModelAndPortSelectors({
  enabled,
  modelo,
  setModelo,
  porta,
  setPorta,
  baudRate,
  setBaudRate,
  onPortHelp,
}: {
  enabled: boolean
  modelo: string
  setModelo: (v: string) => void
  porta: string
  setPorta: (v: string) => void
  baudRate: string
  setBaudRate: (v: string) => void
  onPortHelp: () => void
}) {
  const s = UI_STRINGS.scales
  return (
    <>
      <Box opacity={enabled ? "100" : "50"} w="full">
        <Stack gap={1} w="full">
          <Font variant="sub-tiny-bold" text={s.scaleModelLabel} />
          <CustomSelect value={modelo} onChange={setModelo} disabled={!enabled}>
            <CustomSelectItem value="filizola" text={s.fizilolaModel} icon={Scale} />
            <CustomSelectItem value="toledo" text={s.toledoModel} icon={Scale} />
            <CustomSelectItem value="urano" text={s.uranoModel} icon={Scale} />
          </CustomSelect>
        </Stack>
      </Box>

      <Box opacity={enabled ? "100" : "50"} w="full">
        <Stack gap={1} w="full">
          <Font variant="sub-tiny-bold" text={s.portLabel} />
          <CustomSelect value={porta} onChange={setPorta} disabled={!enabled}>
            {["COM1", "COM2", "COM3", "COM4"].map((pName) => (
              <CustomSelectItem key={pName} value={pName} text={pName} icon={Settings} />
            ))}
          </CustomSelect>
        </Stack>
      </Box>

      <Button variant="ghost-primary" label={s.portHelpButton} disabled={!enabled} onClick={onPortHelp} />

      <Box opacity={enabled ? "100" : "50"} w="full">
        <Stack gap={1} w="full">
          <Font variant="sub-tiny-bold" text={s.baudRateLabel} />
          <CustomSelect value={baudRate} onChange={setBaudRate} disabled={!enabled}>
            {["2400", "4800", "9600", "19200"].map((bRate) => (
              <CustomSelectItem key={bRate} value={bRate} text={bRate} icon={Settings} />
            ))}
          </CustomSelect>
        </Stack>
      </Box>
    </>
  )
}

function BalancaAdvancedSettingsAccordion({
  enabled,
  showAdvanced,
  setShowAdvanced,
  dataBits,
  setDataBits,
  stopBits,
  setStopBits,
  parity,
  setParity,
}: {
  enabled: boolean
  showAdvanced: boolean
  setShowAdvanced: React.Dispatch<React.SetStateAction<boolean>>
  dataBits: string
  setDataBits: (v: string) => void
  stopBits: string
  setStopBits: (v: string) => void
  parity: string
  setParity: (v: string) => void
}) {
  const s = UI_STRINGS.scales
  return (
    <Box opacity={enabled ? "100" : "50"} w="full">
      <Stack gap={2.5} w="full">
        <Box cursor={enabled ? "pointer" : undefined} onClick={() => enabled && setShowAdvanced((prev) => !prev)} w="full">
          <Stack direction="row" align="center" justify="between" gap={0} w="full">
            <Font variant="body-bold" text={s.advancedSettingsTitle} color={enabled ? "foreground" : "muted"} />
            <Icon icon={showAdvanced ? ChevronUp : ChevronDown} size={16} color="muted" />
          </Stack>
        </Box>

        {enabled && showAdvanced && (
          <Stack gap={5} w="full">
            <Grid cols={3} gap={5}>
              <Stack gap={1} w="full">
                <Font variant="sub-tiny-bold" text={s.dataBitsLabel} />
                <CustomSelect value={dataBits} onChange={setDataBits}>
                  <CustomSelectItem value="7" text="7" icon={Settings} />
                  <CustomSelectItem value="8" text="8" icon={Settings} />
                </CustomSelect>
              </Stack>
              <Stack gap={1} w="full">
                <Font variant="sub-tiny-bold" text={s.stopBitsLabel} />
                <CustomSelect value={stopBits} onChange={setStopBits}>
                  <CustomSelectItem value="1" text="1" icon={Settings} />
                  <CustomSelectItem value="2" text="2" icon={Settings} />
                </CustomSelect>
              </Stack>
              <Stack gap={1} w="full">
                <Font variant="sub-tiny-bold" text={s.parityLabel} />
                <CustomSelect value={parity} onChange={setParity}>
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
  )
}

export const BalancaCheckoutSection: React.FC<BalancaCheckoutSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
}) => {
  const [enabled, setEnabled] = React.useState(false)
  const [modelo, setModelo] = React.useState("filizola")
  const [porta, setPorta] = React.useState("COM1")
  const [baudRate, setBaudRate] = React.useState("4800")
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const [dataBits, setDataBits] = React.useState("8")
  const [stopBits, setStopBits] = React.useState("1")
  const [parity, setParity] = React.useState("none")
  const [modalMsg, setModalMsg] = React.useState<string | null>(null)
  const s = UI_STRINGS.scales

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.checkoutScaleTitle)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.checkoutScaleTitle])

  return (
    <Stack gap={5} w="full">
      <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
        <Stack gap={5} w="full">
          <Stack direction="row" align="start" justify="between" w="full" gap={5}>
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={UI_STRINGS.selfService.enableToggle} />
              <Font variant="description" text={s.enableCheckoutScaleDesc} color="muted" />
            </Stack>
            <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          </Stack>

          <BalancaModelAndPortSelectors
            enabled={enabled}
            modelo={modelo} setModelo={setModelo}
            porta={porta} setPorta={setPorta}
            baudRate={baudRate} setBaudRate={setBaudRate}
            onPortHelp={() => enabled && setModalMsg("Certifique-se de que a balança está ligada e os drivers estão instalados.")}
          />

          <BalancaAdvancedSettingsAccordion
            enabled={enabled}
            showAdvanced={showAdvanced} setShowAdvanced={setShowAdvanced}
            dataBits={dataBits} setDataBits={setDataBits}
            stopBits={stopBits} setStopBits={setStopBits}
            parity={parity} setParity={setParity}
          />

          <Box h="h-[1px]" w="full" bg="bg-border" />
          <Font variant="description" text={s.testWeightNote} color="muted" align="center" />
          <Box w="full">
            <Button
              type="button"
              variant="outline"
              label={s.testConnectionButton}
              icon={RefreshCw}
              disabled={!enabled}
              onClick={() => setModalMsg("Testando comunicação com a balança...")}
            />
          </Box>
        </Stack>
      </Box>

      <FormActions confirmLabel={UI_STRINGS.common.save} onConfirm={onCancel} onCancel={onCancel} />
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
