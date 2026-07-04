import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"

export interface KanbanColumnProps {
  title: string
  count: number
  colorClass: string
  children: React.ReactNode
}

export function KanbanColumn({ title, count, colorClass, children }: KanbanColumnProps) {
  return (
    <Box padding={0} bg="transparent" display="flex" direction="col">
      <Stack gap={5}>
        {/* Header */}
        <Stack direction="row" align="center" justify="between" gap={2.5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Box w="w-3" h="h-3" radius="full" bg={colorClass} />
            <Font variant="h4" text={title} />
          </Stack>
          <Box padding={1} paddingX={2.5} bg="bg-surface" radius="full">
            <Font variant="body-sm-medium" text={String(count)} />
          </Box>
        </Stack>

        {/* Content */}
        <Stack gap={5}>
          {children}
        </Stack>
      </Stack>
    </Box>
  )
}
