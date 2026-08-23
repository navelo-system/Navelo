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
  variant?: "default" | "simple"
  fullHeight?: boolean
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  variant = "default",
  fullHeight = false,
}) => {
  if (variant === "simple") {
    return (
      <Box
        padding={2.5}
        display="flex"
        justify="center"
        align="center"
        bg="transparent"
        w="full"
        h={fullHeight ? "full" : undefined}
        flex={fullHeight ? "1" : undefined}
      >
        <Stack direction="row" align="center" justify="center" gap={2.5}>
          <Icon icon={icon} size={16} color="muted" />
          <Font variant="description" text={title} align="center" color="muted" />
        </Stack>
      </Box>
    )
  }

  return (
    <Box
      padding={5}
      display="flex"
      direction="col"
      justify="center"
      align="center"
      bg="bg-brand-primary/10"
      radius="default"
      w="full"
      h={fullHeight ? "full" : undefined}
      flex={fullHeight ? "1" : undefined}
    >
      <Stack align="center" justify="center" gap={2.5} w="full">
        <CircularIcon icon={icon} size={32} variant="solid" />
        <Stack align="center" gap={1}>
          <Font variant="h3" text={title} align="center" />
          {subtitle && <Font variant="description" text={subtitle} align="center" color="muted" />}
        </Stack>
      </Stack>
    </Box>
  )
}


