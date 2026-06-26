import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Info, CheckCircle, AlertTriangle, XCircle, LucideIcon } from "lucide-react"

export interface AlertProps {
  variant?: "info" | "success" | "warning" | "danger"
  title: string
  description?: string
}

const variantConfig: Record<string, { icon: LucideIcon; iconColor: any; bg: string; border: string; customClass?: string }> = {
  info: { icon: Info, iconColor: "primary", bg: "bg-brand-primary/10", border: "border-brand-primary/20" },
  success: { icon: CheckCircle, iconColor: "inherit", bg: "bg-brand-success/10", border: "border-brand-success/20", customClass: "text-brand-success" },
  warning: { icon: AlertTriangle, iconColor: "inherit", bg: "bg-brand-warning/10", border: "border-brand-warning/20", customClass: "text-brand-warning" },
  danger: { icon: XCircle, iconColor: "inherit", bg: "bg-brand-danger/10", border: "border-brand-danger/20", customClass: "text-brand-danger" },
}

export function Alert({ variant = "info", title, description }: AlertProps) {
  const config = variantConfig[variant]
  
  return (
    <Box padding={5} radius="default" border borderColor={config.border} bg={config.bg}>
      <Stack direction="row" gap={5} align="start">
        <Icon icon={config.icon} color={config.iconColor} className={config.customClass} />
        <Stack gap={1}>
          <Font variant="body-semibold" text={title} />
          {description && <Font variant="description" text={description} />}
        </Stack>
      </Stack>
    </Box>
  )
}
