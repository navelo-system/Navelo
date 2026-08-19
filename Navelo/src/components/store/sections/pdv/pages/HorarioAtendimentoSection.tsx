"use client"


import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { Input } from "@/components/store/base/Input"
import { UI_STRINGS } from "@/constants/strings"

interface DaySchedule {
  day: string
  label: string
  enabled: boolean
  start: string
  end: string
}

export interface HorarioAtendimentoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const HorarioAtendimentoSection: React.FC<HorarioAtendimentoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const s = UI_STRINGS.schedule

  const [schedule, setSchedule] = React.useState<DaySchedule[]>([
    { day: "seg", label: s.dayMonday, enabled: true, start: "08:00", end: "18:00" },
    { day: "ter", label: s.dayTuesday, enabled: true, start: "08:00", end: "18:00" },
    { day: "qua", label: s.dayWednesday, enabled: true, start: "08:00", end: "18:00" },
    { day: "qui", label: s.dayThursday, enabled: true, start: "08:00", end: "18:00" },
    { day: "sex", label: s.dayFriday, enabled: true, start: "08:00", end: "18:00" },
    { day: "sab", label: s.daySaturday, enabled: false, start: "09:00", end: "13:00" },
    { day: "dom", label: s.daySunday, enabled: false, start: "09:00", end: "13:00" }
  ])

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  const toggleDay = (idx: number) => {
    setSchedule((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, enabled: !d.enabled } : d))
    )
  }

  const updateTime = (idx: number, field: "start" | "end", val: string) => {
    setSchedule((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, [field]: val } : d))
    )
  }

  const handleSave = () => {
    onCancel()
  }

  return (
    <Stack gap={5} w="full">
      <Font
        variant="description"
        text={s.scheduleDesc}
        color="muted"
      />

      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          {schedule.map((item, idx) => (
            <React.Fragment key={item.day}>
              {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
              <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full" gap={2.5}>
                <Stack direction="row" align="center" gap={5} flex="1" w="full">
                  <Switch
                    checked={item.enabled}
                    onChange={() => toggleDay(idx)}
                  />
                  <Font variant="body-bold" text={item.label} />
                </Stack>

                {item.enabled && (
                  <Stack direction="row" align="center" gap={2.5} w="w-full md:w-auto" justify="start" mobileJustify="end">
                    <Input
                      type="time"
                      value={item.start}
                      onChange={(e) => updateTime(idx, "start", e.target.value)}
                    />
                    <Font variant="body" text={s.toTimeSeparator} color="muted" align="center" />
                    <Input
                      type="time"
                      value={item.end}
                      onChange={(e) => updateTime(idx, "end", e.target.value)}
                    />
                  </Stack>
                )}
              </Stack>
            </React.Fragment>
          ))}
        </Stack>
      </Box>

      <FormActions
        confirmLabel={UI_STRINGS.pdv.cart.saveChangesButton}
        onConfirm={handleSave}
        onCancel={onCancel}
      />
    </Stack>
  )
}
