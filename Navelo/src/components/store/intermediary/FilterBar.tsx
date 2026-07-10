import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Search, Filter, X } from "lucide-react"

export interface FilterBarProps {
  onSearch?: (value: string) => void
  onFilterClick?: () => void
  onClearFilters?: () => void
  hasActiveFilters?: boolean
  searchPlaceholder?: string
  actions?: React.ReactNode
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  onFilterClick,
  onClearFilters,
  hasActiveFilters = false,
  searchPlaceholder = "Buscar...",
  actions,
}) => {
  return (
    <Box padding={5} bg="bg-surface" radius="default">
      <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" gap={5}>
        <Stack direction="row" align="center" gap={2.5} flex="1" w="full">
          <Box flex="1" w="full">
            <Input
              icon={Search}
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </Box>
          <Button
            variant={hasActiveFilters ? "primary-pill-icon" : "outline-pill-icon"}
            icon={Filter}
            onClick={onFilterClick}
          />
          {hasActiveFilters && onClearFilters && (
            <Button
              variant="danger-pill-icon"
              icon={X}
              onClick={onClearFilters}
            />
          )}
        </Stack>

        {actions && (
          <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" gap={2.5}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
