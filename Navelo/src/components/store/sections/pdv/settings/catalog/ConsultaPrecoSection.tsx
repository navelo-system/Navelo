"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { UserCheck, Tablet, Scan, Check } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface ConsultaPrecoSettings {
  password: string
}

const STORAGE_KEY = "navelo_consulta_preco_settings"

export function loadConsultaPrecoSettings(): ConsultaPrecoSettings {
  if (typeof window === "undefined") return { password: "" }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { password: "" }
    return JSON.parse(raw)
  } catch {
    return { password: "" }
  }
}

export function saveConsultaPrecoSettings(settings: ConsultaPrecoSettings): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // ignore
  }
}

export interface ConsultaPrecoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function ConsultaPrecoAuthCard({
  password,
  setPassword,
}: {
  password: string
  setPassword: (v: string) => void
}) {
  const s = UI_STRINGS.priceCheck
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Font variant="body-bold" text={s.authTitle} />
        <Stack gap={2.5} w="full">
          <Input
            label={s.passwordLabel}
            type="password"
            placeholder={s.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Font variant="description" text={s.authDesc} />
        </Stack>
      </Stack>
    </Box>
  )
}

function ConsultaPrecoGuideCard() {
  const s = UI_STRINGS.priceCheck

  const steps = [
    {
      icon: UserCheck,
      title: s.step1Title,
      desc: s.step1Desc,
    },
    {
      icon: Tablet,
      title: s.step2Title,
      desc: s.step2Desc,
    },
    {
      icon: Scan,
      title: s.step3Title,
      desc: s.step3Desc,
    },
  ]

  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Font variant="body-bold" text={s.howToActivateTitle} />
        <Stack gap={2.5} w="full">
          {steps.map((step, idx) => (
            <React.Fragment key={step.title}>
              {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
              <Box padding={2.5} w="full">
                <Stack direction="row" align="center" gap={5} w="full">
                  <CircularIcon variant="secondary" icon={step.icon} size={20} />
                  <Stack gap={0} flex="1">
                    <Font variant="body-bold" text={step.title} />
                    <Font variant="description" text={step.desc} />
                  </Stack>
                </Stack>
              </Box>
            </React.Fragment>
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}

export const ConsultaPrecoSection: React.FC<ConsultaPrecoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [initial, setInitial] = React.useState<ConsultaPrecoSettings>(() => loadConsultaPrecoSettings())
  const [draft, setDraft] = React.useState<ConsultaPrecoSettings>(() => loadConsultaPrecoSettings())
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const s = UI_STRINGS.priceCheck

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
    saveConsultaPrecoSettings(draft)
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
      <Stack gap={5} w="full">
        <ConsultaPrecoAuthCard
          password={draft.password}
          setPassword={(password) => setDraft((prev) => ({ ...prev, password }))}
        />
        <ConsultaPrecoGuideCard />
      </Stack>

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
