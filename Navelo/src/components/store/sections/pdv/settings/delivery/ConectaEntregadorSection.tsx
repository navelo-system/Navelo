"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Icon } from "@/components/store/base/Icon"
import { Bike, ChevronRight, Info, Tablet } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface ConectaEntregadorSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

function ConectaEntregadorHeaderCard({
  enabled,
  setEnabled,
}: {
  enabled: boolean
  setEnabled: (v: boolean) => void
}) {
  const s = UI_STRINGS.driverConnect
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Font variant="body-bold" text={s.enableToggle} />
          <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        </Stack>
        <Box h="h-[1px]" w="full" bg="bg-border" />
        <Box padding={2.5} w="full" opacity={enabled ? "100" : "50"}>
          <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={Bike} size={20} color="muted" />
              <Stack gap={1}>
                <Font variant="body-bold" text={s.driversShortcutTitle} />
                <Font variant="description" text={s.driversLinkedCount} />
              </Stack>
            </Stack>
            <Icon icon={ChevronRight} size={20} color="muted" />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

function ConectaEntregadorLocationCard({
  enabled,
  mapsKey,
  setMapsKey,
  allowTracking,
  setAllowTracking,
}: {
  enabled: boolean
  mapsKey: string
  setMapsKey: (v: string) => void
  allowTracking: boolean
  setAllowTracking: (v: boolean) => void
}) {
  const s = UI_STRINGS.driverConnect
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full" opacity={enabled ? "100" : "50"}>
      <Stack gap={5} w="full">
        <Font variant="body-bold" text={s.realtimeLocationTitle} />
        <Stack gap={2.5} w="full">
          <Input
            label={s.googleMapsKeyLabel}
            value={mapsKey}
            onChange={(e) => setMapsKey(e.target.value)}
            disabled={!enabled}
            placeholder={s.googleMapsKeyPlaceholder}
          />
          <Stack direction="row" gap={1} align="center">
            <Font variant="description" text={s.howToGetKeyText} />
            <Box cursor={enabled ? "pointer" : undefined} onClick={() => enabled && window.open("https://developers.google.com/maps", "_blank")}>
              <Font variant="description" color="primary" text={s.clickHereText} />
            </Box>
          </Stack>
        </Stack>

        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Box flex="1">
            <Checkbox
              label={s.allowTrackingLabel}
              checked={allowTracking}
              onChange={(e) => setAllowTracking(e.target.checked)}
              disabled={!enabled}
            />
          </Box>
          <Box shrink="0">
            <Icon icon={Info} size={20} color="muted" />
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}

function ConectaEntregadorSyncCard({
  enabled,
  selectedDevice,
  setSelectedDevice,
}: {
  enabled: boolean
  selectedDevice: string
  setSelectedDevice: (v: string) => void
}) {
  const s = UI_STRINGS.driverConnect
  const devices = ["Dispositivo 10", "Dispositivo 18"]
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full" opacity={enabled ? "100" : "50"}>
      <Stack gap={5} w="full">
        <Stack gap={1}>
          <Font variant="body-bold" text={s.syncTitle} />
          <Font variant="description" text={s.syncDesc} />
        </Stack>
        <Stack gap={2.5} w="full">
          <Font variant="body-bold" text={s.syncDeviceTitle} />
          <CustomSelect value={selectedDevice} onChange={setSelectedDevice} disabled={!enabled}>
            {devices.map((dName) => (
              <CustomSelectItem key={dName} value={dName} text={dName} icon={Tablet} />
            ))}
          </CustomSelect>
        </Stack>
      </Stack>
    </Box>
  )
}

export const ConectaEntregadorSection: React.FC<ConectaEntregadorSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
}) => {
  const [enabled, setEnabled] = React.useState(true)
  const [mapsKey, setMapsKey] = React.useState("AIzaSyBaZ7fqoqJp_JUuh6Plz5eGeXpwZSKe9Fk")
  const [allowTracking, setAllowTracking] = React.useState(true)
  const [selectedDevice, setSelectedDevice] = React.useState("Dispositivo 10")
  const s = UI_STRINGS.driverConnect

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
      <ConectaEntregadorHeaderCard enabled={enabled} setEnabled={setEnabled} />
      <ConectaEntregadorLocationCard
        enabled={enabled}
        mapsKey={mapsKey} setMapsKey={setMapsKey}
        allowTracking={allowTracking} setAllowTracking={setAllowTracking}
      />
      <ConectaEntregadorSyncCard
        enabled={enabled}
        selectedDevice={selectedDevice} setSelectedDevice={setSelectedDevice}
      />
      <FormActions confirmLabel={UI_STRINGS.common.save} onConfirm={onCancel} onCancel={onCancel} />
    </Stack>
  )
}
