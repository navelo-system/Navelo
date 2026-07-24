import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { CircularIcon } from "./CircularIcon"
import { LucideIcon } from "lucide-react"

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  subtitle?: string
  variant?: "default" | "simple" | "compact" | "transparent"
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  variant = "default"
}) => {
  if (variant === "simple" || variant === "compact") {
    return (
      <Box padding={2.5} display="flex" justify="center" bg="transparent" w="full">
        <Stack direction="row" align="center" justify="center" gap={2.5}>
          <Icon icon={icon} size={16} color="muted" />
          <Font variant="description" text={title} align="center" color="muted" />
        </Stack>
      </Box>
    )
  }

  if (variant === "transparent") {
    return (
      <Box padding={5} display="flex" justify="center" bg="transparent" w="full" h="full">
        <Stack align="center" justify="center" gap={2.5} w="full" h="full">
          <CircularIcon icon={icon} size={32} variant="solid" />
          <Stack align="center" gap={1}>
            <Font variant="h3" text={title} align="center" color="muted" />
            {subtitle && <Font variant="description" text={subtitle} align="center" color="muted" />}
          </Stack>
        </Stack>
      </Box>
    )
  }

  return (
    <Box padding={5} display="flex" justify="center" bg="bg-brand-primary/10" radius="default" w="full">
      <Stack align="center" gap={2.5} w="full">
        <CircularIcon icon={icon} size={32} variant="solid" />
        <Stack align="center" gap={1}>
          <Font variant="h3" text={title} align="center" />
          {subtitle && <Font variant="description" text={subtitle} align="center" color="muted" />}
        </Stack>
      </Stack>
    </Box>
  )
}
