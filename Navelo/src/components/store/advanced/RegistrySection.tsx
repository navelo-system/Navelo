import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { CircularIcon } from "../intermediary/CircularIcon"
import { LucideIcon } from "lucide-react"

export interface RegistrySectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: LucideIcon
  children: React.ReactNode
}

export const RegistrySection: React.FC<RegistrySectionProps> = ({
  title,
  description,
  icon,
  children,
  ...props
}) => {
  return (
    <Stack gap="title-content" w="full" {...props}>
      {/* Section Header */}
      <Stack direction="row" align="center" gap={5}>
        {icon && (
          <CircularIcon icon={icon} variant="primary" size={24} />
        )}
        <Stack gap={1}>
          <Font variant="body-semibold" text={title} />
          {description && <Font variant="description" text={description} />}
        </Stack>
      </Stack>

      {/* Section Content */}
      <Box padding={5} bg="bg-surface" border={true} borderColor="border-border" radius="default" w="full">
        <Stack gap={5}>
          {children}
        </Stack>
      </Box>
    </Stack>
  )
}
