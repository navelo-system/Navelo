"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Warning } from "@/components/store/base/Warning"
import { Grid } from "@/components/store/base/Grid"
import { QrCodeSvg } from "@/components/store/base/QrCodeSvg"
import { Check } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface WhatsAppSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
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
}) => {
  const [enabled, setEnabled] = React.useState(true)
  const s = UI_STRINGS.whatsapp

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
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack gap={1}>
              <Font variant="body-bold" text={s.title} />
              <Font variant="description" text={s.scanQrCodeDesc} color="muted" />
            </Stack>
            <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          </Stack>

          {enabled && (
            <>
              <Warning variant="success" icon={Check} title={s.connectedStatus} text={s.scanQrCodeDesc} />
              <WhatsAppConnectionCard />
            </>
          )}
        </Stack>
      </Box>

      <FormActions confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton} onConfirm={onCancel} onCancel={onCancel} />
    </Stack>
  )
}
