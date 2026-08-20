"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Switch } from "@/components/store/base/Switch"
import { Checkbox } from "@/components/store/base/Checkbox"
import { Icon } from "@/components/store/base/Icon"
import { IFoodActivationModal } from "@/components/store/sections/pdv/modals/IFoodActivationModal"
import { Ban, BookOpen, RefreshCw, Trash2, ChevronRight } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface IFoodSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

function IFoodHeaderSection({
  enabled, onToggleEnable, autoAccept, setAutoAccept,
}: {
  enabled: boolean
  onToggleEnable: (checked: boolean) => void
  autoAccept: boolean
  setAutoAccept: (v: boolean) => void
}) {
  const s = UI_STRINGS.ifood
  return (
    <>
      <Stack direction="row" align="center" justify="between" w="full" gap={5}>
        <Stack gap={1}><Font variant="body-bold" text={s.title} /></Stack>
        <Switch checked={enabled} onChange={(e) => onToggleEnable(e.target.checked)} />
      </Stack>
      {!enabled && (
        <Stack direction="row" align="center" gap={2.5} w="full">
          <Icon icon={Ban} size={16} color="muted" />
          <Font variant="description" text={s.disabledNotice} />
        </Stack>
      )}
      <Box opacity={enabled ? "100" : "50"}>
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack gap={1}>
            <Font variant="body-bold" text={s.autoAcceptToggle} />
            <Font variant="description" text={s.autoAcceptDesc} />
          </Stack>
          <Switch checked={autoAccept} onChange={(e) => setAutoAccept(e.target.checked)} disabled={!enabled} />
        </Stack>
      </Box>
    </>
  )
}

function IFoodOptionsMenu({ enabled }: { enabled: boolean }) {
  const s = UI_STRINGS.ifood
  return (
    <Box w="full" opacity={enabled ? "100" : "50"}>
      <Stack gap={2.5} w="full">
        <Font variant="body-bold" text={s.optionsTitle} />
        <Box padding={2.5} w="full" cursor={enabled ? "pointer" : undefined}>
          <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={BookOpen} size={16} color="muted" />
              <Font variant="body" text={s.menuItemTitle} />
            </Stack>
            <Icon icon={ChevronRight} size={16} color="muted" />
          </Stack>
        </Box>
        <Box padding={2.5} w="full" cursor={enabled ? "pointer" : undefined}>
          <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={RefreshCw} size={16} color="muted" />
              <Font variant="body" text={s.syncMenuTitle} />
            </Stack>
            <Icon icon={ChevronRight} size={16} color="muted" />
          </Stack>
        </Box>
        <Box padding={2.5} w="full" cursor={enabled ? "pointer" : undefined}>
          <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
            <Stack direction="row" align="center" gap={2.5}>
              <Icon icon={Trash2} size={16} color="muted" />
              <Font variant="body" text={s.cleanMenuTitle} />
            </Stack>
            <Icon icon={ChevronRight} size={16} color="muted" />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

function IFoodNotificationSettings({
  enabled, notification, setNotification, soundAlert, setSoundAlert, continuousSound, setContinuousSound,
}: {
  enabled: boolean
  notification: boolean; setNotification: (v: boolean) => void
  soundAlert: boolean; setSoundAlert: (v: boolean) => void
  continuousSound: boolean; setContinuousSound: (v: boolean) => void
}) {
  const s = UI_STRINGS.ifood
  return (
    <Box w="full" opacity={enabled ? "100" : "50"}>
      <Stack gap={5} w="full">
        <Checkbox label={s.notificationCheckboxLabel} checked={notification} onChange={(e) => setNotification(e.target.checked)} disabled={!enabled} />
        <Box paddingX={5}><Font variant="description" text={s.notificationDesc} /></Box>
        <Checkbox label={s.soundAlertCheckboxLabel} checked={soundAlert} onChange={(e) => setSoundAlert(e.target.checked)} disabled={!enabled} />
        <Box paddingX={5}><Font variant="description" text={s.soundAlertDesc} /></Box>
        <Box paddingX={5} opacity={enabled && soundAlert ? "100" : "50"}>
          <Stack direction="row" gap={2.5} align="start" w="full">
            <Box w="[2px]" h="[32px]" bg="bg-border" shrink="0" />
            <Stack gap={1} flex="1">
              <Checkbox label={s.continuousSoundCheckboxLabel} checked={continuousSound} onChange={(e) => setContinuousSound(e.target.checked)} disabled={!enabled || !soundAlert} />
              <Box paddingX={5}><Font variant="description" text={s.continuousSoundDesc} /></Box>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

export const IFoodSection: React.FC<IFoodSectionProps> = ({
  onCancel, setCustomBack, setCustomTitle,
}) => {
  const [enabled, setEnabled] = React.useState(false)
  const [autoAccept, setAutoAccept] = React.useState(false)
  const [notification, setNotification] = React.useState(false)
  const [soundAlert, setSoundAlert] = React.useState(false)
  const [continuousSound, setContinuousSound] = React.useState(false)
  const [isActivationModalOpen, setIsActivationModalOpen] = React.useState(false)
  const s = UI_STRINGS.ifood

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => { setCustomBack?.(null); setCustomTitle?.(null) }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  const handleToggleEnable = (checked: boolean) => {
    if (checked) {
      setIsActivationModalOpen(true)
    } else {
      setEnabled(false); setAutoAccept(false); setNotification(false)
      setSoundAlert(false); setContinuousSound(false)
    }
  }

  return (
    <Stack gap={5} w="full">
      <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
        <Stack gap={5} w="full">
          <IFoodHeaderSection enabled={enabled} onToggleEnable={handleToggleEnable} autoAccept={autoAccept} setAutoAccept={setAutoAccept} />
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <IFoodOptionsMenu enabled={enabled} />
          <Box h="h-[1px]" w="full" bg="bg-border" />
          <IFoodNotificationSettings
            enabled={enabled} notification={notification} setNotification={setNotification}
            soundAlert={soundAlert} setSoundAlert={setSoundAlert}
            continuousSound={continuousSound} setContinuousSound={setContinuousSound}
          />
        </Stack>
      </Box>
      <FormActions confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton} onConfirm={onCancel} onCancel={onCancel} />
      <IFoodActivationModal isOpen={isActivationModalOpen} onClose={() => setIsActivationModalOpen(false)} onActivate={() => { setEnabled(true); setIsActivationModalOpen(false) }} />
    </Stack>
  )
}
