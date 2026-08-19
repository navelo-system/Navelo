"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { RotateCcw } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface AutoatendimentoNumeroSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

function AutoatendimentoNumeroCard({
  enabled,
  setEnabled,
  nextNumber,
  setNextNumber,
  onReset,
}: {
  enabled: boolean
  setEnabled: (v: boolean) => void
  nextNumber: string
  setNextNumber: (v: string) => void
  onReset: () => void
}) {
  const s = UI_STRINGS.selfService
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Font variant="body-bold" text={s.enableToggle} />
          <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        </Stack>
        {enabled && (
          <>
            <Box h="h-[1px]" w="full" bg="bg-border" />
            <Stack direction="row" align="end" gap={2.5} w="full">
              <Box flex="1">
                <Input
                  label={s.nextNumberLabel}
                  value={nextNumber}
                  onChange={(e) => setNextNumber(e.target.value)}
                  placeholder={s.nextNumberPlaceholder}
                  required
                />
              </Box>
              <Button type="button" variant="outline" label={s.resetNumberButton} icon={RotateCcw} onClick={onReset} />
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  )
}

export const AutoatendimentoNumeroSection: React.FC<AutoatendimentoNumeroSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
}) => {
  const [enabled, setEnabled] = React.useState(false)
  const [nextNumber, setNextNumber] = React.useState("")
  const s = UI_STRINGS.selfService

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.orderNumberTitle)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.orderNumberTitle])

  return (
    <Stack gap={5} w="full">
      <AutoatendimentoNumeroCard
        enabled={enabled}
        setEnabled={setEnabled}
        nextNumber={nextNumber}
        setNextNumber={setNextNumber}
        onReset={() => setNextNumber("1")}
      />
      <Box bg="bg-surface" border borderColor="border-border" radius="default" padding={5} w="full">
        <Font variant="description" text={s.orderNumberScopeNotice} color="muted" />
      </Box>
      <FormActions confirmLabel={UI_STRINGS.common.save} onConfirm={onCancel} onCancel={onCancel} />
    </Stack>
  )
}
