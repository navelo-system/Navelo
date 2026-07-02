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

const variantStyles: Record<string, string> = {
  info: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
  success: "bg-brand-success/10 text-brand-success border-brand-success/20",
  warning: "bg-brand-warning/10 text-brand-warning border-brand-warning/20",
  danger: "bg-brand-danger/10 text-brand-danger border-brand-danger/20",
}

const defaultIcons: Record<string, LucideIcon> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  danger: XCircle,
}

export function Alert({ variant = "info", title, description, icon }: AlertProps) {
  const IconComponent = icon || defaultIcons[variant]
  const variantClass = variantStyles[variant] || variantStyles.info
  
  return (
    <Box padding={5} radius="default" border className={variantClass}>
      <Stack direction="row" gap={5} align="start">
        {IconComponent && <Icon icon={IconComponent} color="inherit" size={20} />}
        <Stack gap={1}>
          {title && <Font variant="body-semibold" color="inherit" text={title} />}
          {description && <Font variant="description" color="inherit" className="opacity-90" text={description} />}
        </Stack>
      </Stack>
    </Box>
  )
}
