"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Check, X } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface FilterStatusOption {
  id: string
  label: string
}

export interface FilterPanelProps {
  title?: string
  hideTitle?: boolean
  hideFilterButton?: boolean
  borderless?: boolean
  periodOptions?: string[]
  selectedPeriod?: string
  onPeriodChange?: (period: string) => void
  startDate?: string
  onStartDateChange?: (val: string) => void
  endDate?: string
  onEndDateChange?: (val: string) => void
  statusOptions?: FilterStatusOption[]
  selectedStatusIds?: string[]
  onStatusToggle?: (id: string) => void
  onFilter?: () => void
  children?: React.ReactNode
}

const DEFAULT_PERIOD_OPTIONS = ["Hoje", "7D", "1M", "3M", "6M", "1A"]

interface PeriodSelectorProps {
  options?: string[]
  selectedPeriod?: string
  onPeriodChange?: (period: string) => void
}

function PeriodSelector(props: PeriodSelectorProps) {
  const common = UI_STRINGS.common
  const options = props.options ?? DEFAULT_PERIOD_OPTIONS
  if (options.length === 0) return null

  return (
    <Stack gap={2.5} w="full">
      <Font variant="auxiliary" color="muted" text={common.period} />
      <Stack direction="row" wrap gap={2.5} w="full">
        {options.map((period) => {
          const isSelected = props.selectedPeriod === period
          return (
            <Button
              key={period}
              variant={isSelected ? "primary-pill-xs" : "outline-pill-xs"}
              label={period}
              onClick={() => props.onPeriodChange?.(period)}
              type="button"
            />
          )
        })}
      </Stack>
    </Stack>
  )
}

interface DateRangeSelectorProps {
  startDate?: string
  onStartDateChange?: (val: string) => void
  endDate?: string
  onEndDateChange?: (val: string) => void
}

function DateRangeSelector(props: DateRangeSelectorProps) {
  const common = UI_STRINGS.common
  if (props.startDate === undefined && props.endDate === undefined) return null

  return (
    <Stack gap={2.5} w="full">
      {props.startDate !== undefined && (
        <Input
          variant="date"
          label={common.startDate}
          value={props.startDate}
          onChange={(e) => props.onStartDateChange?.(e.target.value)}
          iconRight={X}
        />
      )}
      {props.endDate !== undefined && (
        <Input
          variant="date"
          label={common.endDate}
          value={props.endDate}
          onChange={(e) => props.onEndDateChange?.(e.target.value)}
          iconRight={X}
        />
      )}
    </Stack>
  )
}

interface StatusSelectorProps {
  options?: FilterStatusOption[]
  selectedStatusIds?: string[]
  onStatusToggle?: (id: string) => void
}

function StatusSelector(props: StatusSelectorProps) {
  const common = UI_STRINGS.common
  const options = props.options
  const selectedStatusIds = props.selectedStatusIds ?? []
  if (!options || options.length === 0) return null

  return (
    <Stack gap={2.5} w="full">
      <Font variant="auxiliary" color="muted" text={common.status} />
      <Stack direction="row" wrap gap={2.5} w="full">
        {options.map((opt) => {
          const isSelected = selectedStatusIds.includes(opt.id)
          return (
            <Button
              key={opt.id}
              variant={isSelected ? "primary-pill-xs" : "outline-pill-xs"}
              icon={isSelected ? Check : undefined}
              label={opt.label}
              onClick={() => props.onStatusToggle?.(opt.id)}
              type="button"
            />
          )
        })}
      </Stack>
    </Stack>
  )
}

interface FilterPanelFooterProps {
  onFilter?: () => void
}

function FilterPanelFooter({ onFilter }: FilterPanelFooterProps) {
  const common = UI_STRINGS.common
  return (
    <Box shrink="0" w="full">
      <Stack gap={5} w="full">
        <Box h="h-[1px]" bg="bg-border" w="full" />
        <Button
          variant="primary"
          label={common.filterAction}
          fullWidth
          onClick={onFilter}
          type="button"
        />
      </Stack>
    </Box>
  )
}

export function FilterPanel(props: FilterPanelProps) {
  const title = props.title ?? "Filtros"
  const isBorderless = Boolean(props.borderless)

  return (
    <Box
      bg={isBorderless ? undefined : "bg-white"}
      padding={isBorderless ? 0 : 5}
      radius={isBorderless ? "none" : "default"}
      border={!isBorderless}
      borderColor={isBorderless ? undefined : "border-border"}
      w="w-full lg:w-80"
      shrink="0"
      h="full"
      display="flex"
      direction="col"
      overflow="hidden"
      minH="0"
    >
      <Stack gap={5} w="full" h="full" justify="between" direction="col" minH="0">
        <Stack direction="col" flex="1" w="full" gap={5} overflow="x-hidden y-auto" minH="0">
          {!props.hideTitle && <Font variant="h4" text={title} />}

          <PeriodSelector
            options={props.periodOptions}
            selectedPeriod={props.selectedPeriod}
            onPeriodChange={props.onPeriodChange}
          />

          <DateRangeSelector
            startDate={props.startDate}
            onStartDateChange={props.onStartDateChange}
            endDate={props.endDate}
            onEndDateChange={props.onEndDateChange}
          />

          <StatusSelector
            options={props.statusOptions}
            selectedStatusIds={props.selectedStatusIds}
            onStatusToggle={props.onStatusToggle}
          />

          {props.children}
        </Stack>

        {!props.hideFilterButton && <FilterPanelFooter onFilter={props.onFilter} />}
      </Stack>
    </Box>
  )
}
