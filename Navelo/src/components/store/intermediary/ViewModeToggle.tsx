"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Icon } from "@/components/store/base/Icon"
import { LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ViewModeToggleProps {
  value: "grade" | "lista"
  onChange: (val: "grade" | "lista") => void
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ value, onChange }) => {
  return (
    <Box
      radius="full"
      overflow="hidden"
      bg="bg-brand-secondary/10"
      w="w-24"
      h="h-10"
      display="flex"
      direction="row"
      shrink="0"
    >
      {/* Grade / Grid side */}
      <Box
        as="button"
        type="button"
        flex="1"
        h="full"
        display="flex"
        justify="center"
        onClick={() => onChange("grade")}
        bg={value === "grade" ? "bg-brand-primary" : "bg-transparent"}
        hoverBg={value === "grade" ? undefined : "secondary/10"}
        cursor="pointer"
        className={cn(
          "transition-all duration-300 ease-in-out",
          value === "grade" ? "rounded-l-full rounded-r-none" : "rounded-none"
        )}
      >
        <Stack direction="row" align="center" justify="center" w="full" h="full">
          <Icon icon={LayoutGrid} size={16} color={value === "grade" ? "brand-secondary" : "primary"} />
        </Stack>
      </Box>

      {/* Lista / List side */}
      <Box
        as="button"
        type="button"
        flex="1"
        h="full"
        display="flex"
        justify="center"
        onClick={() => onChange("lista")}
        bg={value === "lista" ? "bg-brand-primary" : "bg-transparent"}
        hoverBg={value === "lista" ? undefined : "secondary/10"}
        cursor="pointer"
        className={cn(
          "transition-all duration-300 ease-in-out",
          value === "lista" ? "rounded-r-full rounded-l-none" : "rounded-none"
        )}
      >
        <Stack direction="row" align="center" justify="center" w="full" h="full">
          <Icon icon={List} size={16} color={value === "lista" ? "brand-secondary" : "primary"} />
        </Stack>
      </Box>
    </Box>
  )
}
