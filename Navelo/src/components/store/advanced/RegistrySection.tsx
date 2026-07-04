import * as React from "react"
import { Stack } from "../base/Stack"
import { SectionHeader } from "../intermediary/SectionHeader"
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
    <Stack gap={'title-content'} w="full" {...props}>
      {/* Section Header */}
      <SectionHeader icon={icon} title={title} subtitle={description} />

      {/* Section Content */}

      <Stack gap={5}>
        {children}
      </Stack>
    </Stack>
  )
}
