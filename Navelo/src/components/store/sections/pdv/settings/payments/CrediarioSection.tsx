"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Form } from "@/components/store/base/Form"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import {
  CrediarioSettings,
  CrediarioInterestType,
  loadCrediarioSettings,
  saveCrediarioSettings,
  CREDIARIO_SETTINGS_EVENT,
} from "@/lib/sync/crediarioSettings"
import { Minus, Plus, Check, Percent } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface CrediarioSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function isSettingsDirty(current: CrediarioSettings, initial: CrediarioSettings): boolean {
  return JSON.stringify(current) !== JSON.stringify(initial)
}

export const CrediarioSection: React.FC<CrediarioSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [initialSettings, setInitialSettings] = React.useState<CrediarioSettings>(loadCrediarioSettings)
  const [draft, setDraft] = React.useState<CrediarioSettings>(initialSettings)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const isDirty = React.useMemo(() => isSettingsDirty(draft, initialSettings), [draft, initialSettings])
  const s = UI_STRINGS.crediario

  // Sincronização reativa de eventos
  React.useEffect(() => {
    const handleSync = () => {
      const fresh = loadCrediarioSettings()
      setInitialSettings(fresh)
      setDraft((prev) => (isSettingsDirty(prev, initialSettings) ? prev : fresh))
    }
    window.addEventListener(CREDIARIO_SETTINGS_EVENT, handleSync)
    return () => {
      window.removeEventListener(CREDIARIO_SETTINGS_EVENT, handleSync)
    }
  }, [initialSettings])

  const handleBack = React.useCallback(() => {
    if (isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      onCancel()
    }
  }, [isDirty, onCancel])

  const handleSave = React.useCallback(() => {
    saveCrediarioSettings(draft)
    setInitialSettings(draft)
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
            <Form
              onSubmit={(e) => {
                e.preventDefault()
                handleSave()
              }}
            >
              <Stack gap={2.5} w="full">
                {/* Tipo de juros */}
                <CustomSelect
                  variant="outlined-label"
                  label="Tipo de juros"
                  value={draft.interestType}
                  onChange={(val) =>
                    setDraft((prev) => ({
                      ...prev,
                      interestType: val as CrediarioInterestType,
                    }))
                  }
                >
                  <CustomSelectItem value="Simples" text="Simples" />
                  <CustomSelectItem value="Composto" text="Composto" />
                </CustomSelect>

                {/* Juros */}
                <Input
                  variant="outlined-label"
                  label="Juros"
                  icon={Percent}
                  placeholder="0,00"
                  value={draft.interestRate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const digits = e.target.value.replace(/\D/g, "")
                    if (!digits) {
                      setDraft((prev) => ({ ...prev, interestRate: "" }))
                      return
                    }
                    const number = Number(digits) / 100
                    const formatted = number.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                    setDraft((prev) => ({ ...prev, interestRate: formatted }))
                  }}
                />

                {/* Multa */}
                <Input
                  variant="outlined-label"
                  label="Multa"
                  icon={Percent}
                  placeholder="0,00"
                  value={draft.fineRate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const digits = e.target.value.replace(/\D/g, "")
                    if (!digits) {
                      setDraft((prev) => ({ ...prev, fineRate: "" }))
                      return
                    }
                    const number = Number(digits) / 100
                    const formatted = number.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                    setDraft((prev) => ({ ...prev, fineRate: formatted }))
                  }}
                />

                {/* Dias de carência */}
                <Input
                  variant="outlined-counter"
                  label="* Dias de carência"
                  value={draft.graceDays}
                  onDecrement={() =>
                    setDraft((prev) => ({
                      ...prev,
                      graceDays: Math.max(0, prev.graceDays - 1),
                    }))
                  }
                  onIncrement={() =>
                    setDraft((prev) => ({
                      ...prev,
                      graceDays: prev.graceDays + 1,
                    }))
                  }
                />
              </Stack>
            </Form>
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
