"use client"

import * as React from "react"
import { Modal } from "./Modal"
import { Box } from "./Box"
import { Stack } from "./Stack"
import { Font } from "./Font"
import { Button } from "./Button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

export interface DatePickerModalProps {
  isOpen: boolean
  onClose: () => void
  initialDateString?: string
  onSelectDate: (formattedDate: string) => void
}

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

const WEEKDAY_SHORT_NAMES = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."]

function parseDateString(str?: string): Date {
  if (!str) return new Date()
  const parts = str.split(" ")[0].split("/")
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const year = parseInt(parts[2], 10)
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day)
    }
  }
  return new Date()
}

function formatDateToInput(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function formatHeaderDate(date: Date): string {
  const weekday = WEEKDAY_SHORT_NAMES[date.getDay()]
  const day = date.getDate()
  const monthShort = MONTH_NAMES[date.getMonth()].slice(0, 3).toLowerCase()
  return `${weekday}, ${day} de ${monthShort}.`
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  isOpen,
  onClose,
  initialDateString,
  onSelectDate,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(() => parseDateString(initialDateString))
  const [viewDate, setViewDate] = React.useState<Date>(() => parseDateString(initialDateString))
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)
  const [prevInitialDateString, setPrevInitialDateString] = React.useState(initialDateString)

  if (isOpen !== prevIsOpen || initialDateString !== prevInitialDateString) {
    setPrevIsOpen(isOpen)
    setPrevInitialDateString(initialDateString)
    if (isOpen) {
      const parsed = parseDateString(initialDateString)
      setSelectedDate(parsed)
      setViewDate(parsed)
    }
  }

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const handleSelectDay = (dayNum: number) => {
    const nextDate = new Date(year, month, dayNum)
    setSelectedDate(nextDate)
  }

  const handleConfirm = () => {
    onSelectDate(formatDateToInput(selectedDate))
    onClose()
  }

  const isSameDay = (d1: Date, dayNum: number) => {
    return (
      d1.getDate() === dayNum &&
      d1.getMonth() === month &&
      d1.getFullYear() === year
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Selecione a data"
      subtitle={formatHeaderDate(selectedDate)}
      icon={Calendar}
      successText="OK"
      onSuccess={handleConfirm}
      showCancelButton={true}
    >
      <Stack gap={5} w="full">
        {/* Header de Navegação Mês / Ano */}
        <Stack direction="row" align="center" justify="between" w="full">
          <Font
            variant="body-bold"
            text={`${MONTH_NAMES[month]} de ${year}`}
          />
          <Stack direction="row" gap={1} align="center">
            <Button
              variant="primary-pill-icon"
              icon={ChevronLeft}
              onClick={handlePrevMonth}
              type="button"
            />
            <Button
              variant="primary-pill-icon"
              icon={ChevronRight}
              onClick={handleNextMonth}
              type="button"
            />
          </Stack>
        </Stack>

        {/* Grade dos Dias da Semana (D S T Q Q S S) */}
        <div className="grid grid-cols-7 gap-1.5 w-full text-center">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, idx) => (
            <Box key={idx} paddingY={1} align="center" justify="center" w="full">
              <Font variant="auxiliary" color="muted" text={d} align="center" />
            </Box>
          ))}
        </div>

        {/* Grade dos Dias do Mês usando Button do Design System */}
        <div className="grid grid-cols-7 gap-1.5 w-full justify-items-center">
          {/* Células vazias antes do dia 1 */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <Box key={`empty-${i}`} w="full" h="h-8" />
          ))}

          {/* Botões dos Dias */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1
            const selected = isSameDay(selectedDate, dayNum)

            return (
              <Button
                key={dayNum}
                variant={selected ? "primary-pill-xs" : "outline-pill-xs"}
                label={String(dayNum)}
                onClick={() => handleSelectDay(dayNum)}
                type="button"
                fullWidth
              />
            )
          })}
        </div>
      </Stack>
    </Modal>
  )
}
