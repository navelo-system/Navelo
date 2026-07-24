"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Check, X } from "lucide-react"

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

export const FilterPanel: React.FC<FilterPanelProps> = ({
  title = "Filtros",
  hideTitle = false,
  hideFilterButton = false,
  borderless = false,
  periodOptions = DEFAULT_PERIOD_OPTIONS,
  selectedPeriod,
  onPeriodChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  statusOptions,
  selectedStatusIds = [],
  onStatusToggle,
  onFilter,
  children,
}) => {
  return (
    <Box
      bg={borderless ? undefined : "bg-white"}
      padding={borderless ? 0 : 5}
      radius={borderless ? "none" : "default"}
      border={!borderless}
      borderColor={borderless ? undefined : "border-border"}
      w="w-full lg:w-80"
      shrink="0"
      h="full"
      direction="col"
      overflow="hidden"
      minH="0"
    >
      <Stack gap={5} w="full" h="full" justify="between" direction="col" minH="0">
        {/* Conteúdo dos Filtros - Scrollável Internamente */}
        <Stack direction="col" flex="1" w="full" gap={5} overflow="x-hidden y-auto" minH="0">
          {!hideTitle && title && <Font variant="h4" text={title} />}

          {/* Período */}
          {periodOptions && periodOptions.length > 0 && (
            <Stack gap={2.5} w="full">
              <Font variant="auxiliary" color="muted" text="Período" />
              <Stack direction="row" wrap gap={2.5} w="full">
                {periodOptions.map((period) => {
                  const isSelected = selectedPeriod === period
                  return (
                    <Button
                      key={period}
                      variant={isSelected ? "primary-pill-xs" : "outline-pill-xs"}
                      label={period}
                      onClick={() => onPeriodChange?.(period)}
                      type="button"
                    />
                  )
                })}
              </Stack>
            </Stack>
          )}

          {/* Intervalo de Datas (Inicial e Final) */}
          {(startDate !== undefined || endDate !== undefined) && (
            <Stack gap={2.5} w="full">
              {startDate !== undefined && (
                <Input
                  label="Inicial"
                  value={startDate}
                  onChange={(e) => onStartDateChange?.(e.target.value)}
                  iconRight={X}
                />
              )}
              {endDate !== undefined && (
                <Input
                  label="Final"
                  value={endDate}
                  onChange={(e) => onEndDateChange?.(e.target.value)}
                  iconRight={X}
                />
              )}
            </Stack>
          )}

          {/* Status Options */}
          {statusOptions && statusOptions.length > 0 && (
            <Stack gap={2.5} w="full">
              <Font variant="auxiliary" color="muted" text="Status" />
              <Stack direction="row" wrap gap={2.5} w="full">
                {statusOptions.map((opt) => {
                  const isSelected = selectedStatusIds.includes(opt.id)
                  return (
                    <Button
                      key={opt.id}
                      variant={isSelected ? "primary-pill-xs" : "outline-pill-xs"}
                      icon={isSelected ? Check : undefined}
                      label={opt.label}
                      onClick={() => onStatusToggle?.(opt.id)}
                      type="button"
                    />
                  )
                })}
              </Stack>
            </Stack>
          )}

          {/* Slot para Filtros Adicionais Customizados */}
          {children}
        </Stack>

        {/* Botão de Filtrar Fixo no Rodapé */}
        {!hideFilterButton && (
          <Box w="full" shrink="0" borderTop={true} borderColor="border-border" paddingY={1} bg="bg-surface">
            <Button
              variant="primary"
              label="Filtrar"
              fullWidth
              onClick={onFilter}
              type="button"
            />
          </Box>
        )}
      </Stack>
    </Box>
  )
}
