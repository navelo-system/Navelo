"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Button } from "@/components/store/base/Button"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { Warning } from "@/components/store/base/Warning"
import { Grid } from "@/components/store/base/Grid"
import { QrCodeSvg } from "@/components/store/base/QrCodeSvg"
import { Check } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import {
  loadCatalogoOnlineSettings,
  saveCatalogoOnlineSettings,
  CatalogoOnlineWhatsApp,
} from "@/lib/sync/catalogoOnlineSettings"

export interface WhatsAppSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function WhatsAppConnectionSteps() {
  const steps = [
    UI_STRINGS.whatsapp.step1,
    UI_STRINGS.whatsapp.step2,
    UI_STRINGS.whatsapp.step3,
    UI_STRINGS.whatsapp.step4,
    UI_STRINGS.whatsapp.step5,
  ]

  return (
    <Stack gap={2.5}>
      {steps.map((stepText, idx) => (
        <Stack key={idx} direction="row" gap={2.5} align="start">
          <Box bg="bg-brand-primary/10" radius="full" w="w-6" h="h-6" shrink="0">
            <Stack align="center" justify="center" h="full" w="full" gap={0}>
              <Font variant="sub-tiny-bold" text={(idx + 1).toString()} color="primary" />
            </Stack>
          </Box>
          <Font variant="body" text={stepText} />
        </Stack>
      ))}
    </Stack>
  )
}

function WhatsAppConnectionCard() {
  const s = UI_STRINGS.whatsapp
  return (
    <Box border borderColor="border-border" radius="default" padding={5} w="full">
      <Grid cols={2} gap={5} w="full">
        <Stack gap={5}>
          <Font variant="body-bold" text={s.connectionTitle} />
          <WhatsAppConnectionSteps />
        </Stack>
        <Box padding={2.5} border borderColor="border-border" radius="default" bg="bg-white" w="w-[180px]" h="h-[180px]" shrink="0">
          <Stack align="center" justify="center" h="full" w="full" gap={0}>
            <QrCodeSvg width={140} height={140} />
          </Stack>
        </Box>
      </Grid>
    </Box>
  )
}

export const WhatsAppSection: React.FC<WhatsAppSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [initial, setInitial] = React.useState<CatalogoOnlineWhatsApp>(() => loadCatalogoOnlineSettings().whatsapp)
  const [draft, setDraft] = React.useState<CatalogoOnlineWhatsApp>(() => loadCatalogoOnlineSettings().whatsapp)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const s = UI_STRINGS.whatsapp

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
      whatsapp: draft,
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
              <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                <Stack gap={1}>
                  <Font variant="body-bold" text={s.title} />
                  <Font variant="description" text={s.scanQrCodeDesc} color="muted" />
                </Stack>
                <Switch checked={draft.enabled} onChange={(e) => setDraft({ enabled: e.target.checked })} />
              </Stack>

              {draft.enabled && (
                <>
                  <Warning variant="success" icon={Check} title={s.connectedStatus} text={s.scanQrCodeDesc} />
                  <WhatsAppConnectionCard />
                </>
              )}
            </Stack>
          </Box>
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
