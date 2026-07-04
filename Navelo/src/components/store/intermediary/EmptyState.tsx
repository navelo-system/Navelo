import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { CircularIcon } from "./CircularIcon"
import { LucideIcon } from "lucide-react"

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  subtitle?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle }) => {
  return (
    <Box padding={5} display="flex" justify="center" bg="bg-brand-primary/10" border borderColor="border-brand-primary/80" radius="default">
      <Stack align="center" gap={2.5}>
        <CircularIcon icon={icon} size={32} />
        <Stack align="center" gap={1}>
          <Font variant="h3" text={title} align="center" />
          {subtitle && (
            <Font variant="description" text={subtitle} align="center" color="muted" />
          )}
        </Stack>
      </Stack>
    </Box>
  )
}
