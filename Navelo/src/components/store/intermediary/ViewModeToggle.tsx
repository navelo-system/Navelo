"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Icon } from "@/components/store/base/Icon"
import { LayoutGrid, List } from "lucide-react"

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
        flex="1"
        h="full"
        display="flex"
        justify="center"
        onClick={() => onChange("grade")}
        cursor="pointer"
        bg={value === "grade" ? "bg-brand-primary" : "bg-transparent"}
        hoverBg={value === "grade" ? undefined : "secondary/10"}
      >
        <Stack w="full" h="full" align="center" justify="center">
          <Icon icon={LayoutGrid} size={16} color={value === "grade" ? "brand-secondary" : "primary"} />
        </Stack>
      </Box>

      {/* Lista / List side */}
      <Box
        flex="1"
        h="full"
        display="flex"
        justify="center"
        onClick={() => onChange("lista")}
        cursor="pointer"
        bg={value === "lista" ? "bg-brand-primary" : "bg-transparent"}
        hoverBg={value === "lista" ? undefined : "secondary/10"}
      >
        <Stack w="full" h="full" align="center" justify="center">
          <Icon icon={List} size={16} color={value === "lista" ? "brand-secondary" : "primary"} />
        </Stack>
      </Box>
    </Box>
  )
}
