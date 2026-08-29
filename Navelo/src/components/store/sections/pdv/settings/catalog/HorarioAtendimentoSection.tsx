"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Button } from "@/components/store/base/Button"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { Input } from "@/components/store/base/Input"
import { Check } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import {
  loadCatalogoOnlineSettings,
  saveCatalogoOnlineSettings,
  CatalogoOnlineDaySchedule,
} from "@/lib/sync/catalogoOnlineSettings"

export interface HorarioAtendimentoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

function DayScheduleRow({
  item, idx, onToggle, onUpdateTime,
}: {
  item: CatalogoOnlineDaySchedule
  idx: number
  onToggle: (i: number) => void
  onUpdateTime: (i: number, field: "start" | "end", val: string) => void
}) {
  const s = UI_STRINGS.schedule
  return (
    <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full" gap={2.5}>
      <Stack direction="row" align="center" gap={5} flex="1" w="full">
        <Switch checked={item.enabled} onChange={() => onToggle(idx)} />
        <Font variant="body-bold" text={item.label} />
      </Stack>
      {item.enabled && (
        <Stack direction="row" align="center" gap={2.5} w="w-full md:w-auto" justify="start" mobileJustify="end">
          <Input type="time" value={item.start} onChange={(e) => onUpdateTime(idx, "start", e.target.value)} />
          <Font variant="body" text={s.toTimeSeparator} color="muted" align="center" />
          <Input type="time" value={item.end} onChange={(e) => onUpdateTime(idx, "end", e.target.value)} />
        </Stack>
      )}
    </Stack>
  )
}

function ScheduleCard({
  schedule, onToggle, onUpdateTime,
}: {
  schedule: CatalogoOnlineDaySchedule[]
  onToggle: (i: number) => void
  onUpdateTime: (i: number, field: "start" | "end", val: string) => void
}) {
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        {schedule.map((item, idx) => (
          <React.Fragment key={item.day}>
            {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
            <DayScheduleRow item={item} idx={idx} onToggle={onToggle} onUpdateTime={onUpdateTime} />
          </React.Fragment>
        ))}
      </Stack>
    </Box>
  )
}

export const HorarioAtendimentoSection: React.FC<HorarioAtendimentoSectionProps> = ({
  onCancel, setCustomBack, setCustomTitle, setCustomActions,
}) => {
  const s = UI_STRINGS.schedule
  const [initialSchedule, setInitialSchedule] = React.useState<CatalogoOnlineDaySchedule[]>(() => loadCatalogoOnlineSettings().schedule)
  const [schedule, setSchedule] = React.useState<CatalogoOnlineDaySchedule[]>(() => loadCatalogoOnlineSettings().schedule)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const isDirty = React.useMemo(
    () => JSON.stringify(schedule) !== JSON.stringify(initialSchedule),
    [schedule, initialSchedule]
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
      schedule,
    })
    setInitialSchedule(schedule)
    onCancel()
  }, [schedule, onCancel])

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

  const toggleDay = (idx: number) => {
    setSchedule((prev) => prev.map((d, i) => (i === idx ? { ...d, enabled: !d.enabled } : d)))
  }

  const updateTime = (idx: number, field: "start" | "end", val: string) => {
    setSchedule((prev) => prev.map((d, i) => (i === idx ? { ...d, [field]: val } : d)))
  }

  return (
    <>
      <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
        <Stack gap={5} w="full">
          <Font variant="description" text={s.scheduleDesc} color="muted" />
          <ScheduleCard schedule={schedule} onToggle={toggleDay} onUpdateTime={updateTime} />
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
