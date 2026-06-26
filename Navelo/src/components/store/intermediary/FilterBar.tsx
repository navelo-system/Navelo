import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Input } from "../base/Input"
import { Button } from "../base/Button"
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
    <Box padding={5} bg="bg-surface" border borderColor="border-border" radius="default">
      <Stack direction="row" align="center" justify="between" gap={5}>
        <Stack direction="row" align="center" gap={2.5} className="flex-1 max-w-md">
          <Input
            icon={Search}
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
          />
          <Button
            variant={hasActiveFilters ? "primary-icon" : "outline-icon"}
            icon={Filter}
            onClick={onFilterClick}
          />
          {hasActiveFilters && onClearFilters && (
            <Button
              variant="outline-danger-icon"
              icon={X}
              onClick={onClearFilters}
            />
          )}
        </Stack>

        {actions && (
          <Stack direction="row" align="center" gap={2.5}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
