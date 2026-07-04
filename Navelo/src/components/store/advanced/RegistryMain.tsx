import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Icon } from "../base/Icon"
import { LucideIcon } from "lucide-react"

export interface RegistryMainProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  superiorTitle?: string
  icon?: LucideIcon
  children: React.ReactNode
}

export const RegistryMain: React.FC<RegistryMainProps> = ({
  title,
  subtitle,
  superiorTitle,
  icon,
  children,
  ...props
}) => {
  return (
    <Box padding={5} w="full" h="full" bg="bg-background" overflow="auto" {...props}>
      <Stack gap={'section'} w="full">
        {/* Header */}
        <Stack gap={2.5}>
          {superiorTitle && (
            <Font variant="sub-tiny" color="primary" text={superiorTitle} />
          )}
          <Stack direction="row" align="center" gap={2.5}>
            {icon && <Icon icon={icon} size={32} color="primary" />}
            <Font variant="h2" text={title} />
          </Stack>
          {subtitle && <Font variant="description" text={subtitle} />}
        </Stack>

        {/* Content (RegistrySections) */}
        <Stack gap={'section'} w="full">
          {children}
        </Stack>
      </Stack>
    </Box>
  )
}
