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
    <Box padding={0} bg="transparent" className="flex flex-col h-[700px]">
      <Stack gap={5} className="flex-1 overflow-hidden">
        {/* Header */}
        <Stack direction="row" align="center" justify="between" gap={2.5}>
          <Stack direction="row" align="center" gap={2.5}>
            <div className={`w-3 h-3 rounded-full ${colorClass}`} />
            <Font variant="h4" text={title} />
          </Stack>
          <Box padding={1} paddingX={2.5} bg="bg-surface" radius="full">
            <Font variant="body-sm-medium" text={String(count)} />
          </Box>
        </Stack>

        {/* Scrollable Content */}
        <Box padding={0} className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <Stack gap={5}>
            {children}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
