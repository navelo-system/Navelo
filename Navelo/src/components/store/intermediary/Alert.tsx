import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Info, CheckCircle, AlertTriangle, XCircle, LucideIcon } from "lucide-react"

export interface AlertProps {
  variant?: "info" | "success" | "warning" | "danger"
  title?: string
  description?: string
  icon?: LucideIcon
}

const variantConfig: Record<string, { bg: string, border: string, color: "primary" | "success" | "warning" | "danger" }> = {
  info: { bg: "bg-brand-primary/10", border: "border-brand-primary/20", color: "primary" },
  success: { bg: "bg-brand-success/10", border: "border-brand-success/20", color: "success" },
  warning: { bg: "bg-brand-warning/10", border: "border-brand-warning/20", color: "warning" },
  danger: { bg: "bg-brand-danger/10", border: "border-brand-danger/20", color: "danger" },
}

const defaultIcons: Record<string, LucideIcon> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: XCircle,
}

export function Alert({ variant = "info", title, description, icon }: AlertProps) {
  const IconComponent = icon || defaultIcons[variant]
  const config = variantConfig[variant] || variantConfig.info
  
  return (
    <Box padding={5} radius="default" border bg={config.bg} borderColor={config.border}>
      <Stack direction="row" gap={5} align="start">
        {IconComponent && (
          <Box flex="none">
            <Icon icon={IconComponent} color={config.color} size={20} />
          </Box>
        )}
        <Stack gap={1}>
          {title && <Font variant="body-semibold" color={config.color} text={title} />}
          {description && <Font variant="description" color={config.color} text={description} />}
        </Stack>
      </Stack>
    </Box>
  )
}
