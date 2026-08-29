"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Alert } from "@/components/store/intermediary/Alert"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { RotateCcw, Check } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

interface NumeroAtendimentoSectionProps {
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack: () => void
}

const STORAGE_KEY_ENABLED = "pdv_order_number_enabled"
const STORAGE_KEY_NEXT = "pdv_order_number_next"

function getStoredOrderNumberConfig() {
  if (typeof window === "undefined") {
    return { enabled: false, next: "1" }
  }
  return {
    enabled: localStorage.getItem(STORAGE_KEY_ENABLED) === "true",
    next: localStorage.getItem(STORAGE_KEY_NEXT) || "1",
  }
}

interface NumeroAtendimentoCardProps {
  enabled: boolean
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>
  nextNumber: string
  setNextNumber: React.Dispatch<React.SetStateAction<string>>
  onRestart: () => void
}

function NumeroAtendimentoCard({
  enabled,
  setEnabled,
  nextNumber,
  setNextNumber,
  onRestart,
}: NumeroAtendimentoCardProps) {
  const s = UI_STRINGS.pdv.orderNumberConfig
  return (
    <Box bg="bg-white" padding={5} radius="default" border borderColor="border-border" w="full">
      <Stack gap={5} w="full">
        {/* Toggle habilitar */}
        <Box cursor="pointer" onClick={() => setEnabled((prev) => !prev)} w="full">
          <Stack direction="row" align="center" gap={2.5}>
            <Switch
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            <Font variant="body" text={s.enableLabel} />
          </Stack>
        </Box>

        {/* Input próximo número */}
        <Stack direction="row" align="center" gap={2.5} w="full">
          <Box flex="1">
            <Input
              variant="outlined-label"
              label={s.nextNumberLabel}
              value={nextNumber}
              onChange={(e) => setNextNumber(e.target.value)}
              type="number"
              disabled={!enabled}
            />
          </Box>
          <Button
            variant="secondary-icon"
            icon={RotateCcw}
            onClick={onRestart}
            disabled={!enabled}
          />
        </Stack>

        {/* Alert informativo */}
        <Alert
          variant="info"
          description={`${s.infoText} ${s.infoTextBold} ${s.infoTextAnd} ${s.infoTextBold2} ${s.infoTextEnd}`}
        />
      </Stack>
    </Box>
  )
}

export const NumeroAtendimentoSection: React.FC<NumeroAtendimentoSectionProps> = ({
  setCustomBack,
  setCustomTitle,
  setCustomActions,
  onBack,
}) => {
  const s = UI_STRINGS.pdv.orderNumberConfig

  const [initialValues] = React.useState(getStoredOrderNumberConfig)
  const [savedValues, setSavedValues] = React.useState(initialValues)
  const [enabled, setEnabled] = React.useState(() => initialValues.enabled)
  const [nextNumber, setNextNumber] = React.useState(() => initialValues.next)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const isDirty = enabled !== savedValues.enabled || nextNumber !== savedValues.next

  const onBackRef = React.useRef(onBack)
  React.useEffect(() => { onBackRef.current = onBack }, [onBack])

  const handleSave = React.useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_ENABLED, String(enabled))
      localStorage.setItem(STORAGE_KEY_NEXT, nextNumber || "1")
    }
    setSavedValues({ enabled, next: nextNumber })
    onBackRef.current()
  }, [enabled, nextNumber])

  const handleBack = React.useCallback(() => {
    if (isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      onBackRef.current()
    }
  }, [isDirty])

  const handleBackRef = React.useRef(handleBack)
  const handleSaveRef = React.useRef(handleSave)
  React.useEffect(() => {
    handleBackRef.current = handleBack
    handleSaveRef.current = handleSave
  })

  React.useEffect(() => {
    setCustomTitle?.(s.sectionTitle)
    setCustomBack?.(() => () => handleBackRef.current())
    setCustomActions?.(
      <Button
        variant="primary-pill-icon"
        icon={Check}
        title={UI_STRINGS.common.confirm}
        onClick={() => handleSaveRef.current()}
      />
    )
    return () => {
      setCustomTitle?.(null)
      setCustomBack?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, s.sectionTitle])

  return (
    <>
      <Box flex="1" minH="0" overflowY="auto" w="full">
        <Stack gap={5} w="full">
          <NumeroAtendimentoCard
            enabled={enabled}
            setEnabled={setEnabled}
            nextNumber={nextNumber}
            setNextNumber={setNextNumber}
            onRestart={() => setNextNumber("1")}
          />
        </Stack>
      </Box>

      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          onBackRef.current()
        }}
      />
    </>
  )
}
