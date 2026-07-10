import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { SectionHeader } from "@/components/store/intermediary/SectionHeader"
import { LucideIcon } from "lucide-react"

export interface RegistrySectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  icon: LucideIcon
  action?: React.ReactNode
  children: React.ReactNode
  variant?: "default" | "card"
}

export const RegistrySection: React.FC<RegistrySectionProps> = ({
  title = "",
  description,
  icon,
  action,
  children,
  variant = "default",
  ...props
}) => {
  // Validação estrita do Design System
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (typeof child.type === 'string') {
        throw new Error(`[Design System Violation] O componente RegistrySection não aceita tags primitivas HTML como <${child.type}>. Use Box, Stack, Font, Grid ou outros componentes do Design System.`);
      }
    }
  });

  if (variant === "card") {
    return (
      <Box padding={5} bg="bg-surface" radius="default" w="full" {...props}>
        <Stack gap={5}>
          <SectionHeader icon={icon} title={title} subtitle={description} action={action} />
          {children}
        </Stack>
      </Box>
    )
  }

  return (
    <Stack gap={'title-content'} w="full" {...props}>
      {/* Section Header */}
      <SectionHeader icon={icon} title={title} subtitle={description} action={action} />

      {/* Section Content */}
      <Stack gap={5}>
        {children}
      </Stack>
    </Stack>
  )
}
