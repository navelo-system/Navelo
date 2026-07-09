"use client"

import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Icon } from "../base/Icon"
import { LayoutGrid, List } from "lucide-react"

export interface ViewModeToggleProps {
  value: "grade" | "lista"
  onChange: (val: "grade" | "lista") => void
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ value, onChange }) => {
  return (
    <Box
      border={true}
      borderColor="border-border"
      radius="full"
      overflow="hidden"
      bg="bg-surface"
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
        bg={value === "grade" ? "bg-brand-secondary" : "bg-surface"}
        hoverBg={value === "grade" ? undefined : "secondary/10"}
        cursor="pointer"
      >
        <Stack direction="row" align="center" justify="center" w="full" h="full">
          <Icon icon={LayoutGrid} size={16} color={value === "grade" ? "white" : "muted"} />
        </Stack>
      </Box>

      {/* Vertical separator */}
      <Box w="w-[1px]" h="full" bg="bg-border" shrink="0" />

      {/* Lista / List side */}
      <Box
        as="button"
        type="button"
        flex="1"
        h="full"
        display="flex"
        justify="center"
        onClick={() => onChange("lista")}
        bg={value === "lista" ? "bg-brand-secondary" : "bg-surface"}
        hoverBg={value === "lista" ? undefined : "secondary/10"}
        cursor="pointer"
      >
        <Stack direction="row" align="center" justify="center" w="full" h="full">
          <Icon icon={List} size={16} color={value === "lista" ? "white" : "muted"} />
        </Stack>
      </Box>
    </Box>
  )
}
