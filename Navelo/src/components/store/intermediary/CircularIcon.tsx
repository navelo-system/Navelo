import * as React from "react"
import { Box } from "../base/Box"
import { Icon } from "../base/Icon"
import { LucideIcon } from "lucide-react"

export interface CircularIconProps {
  icon: LucideIcon
  variant?: "primary" | "secondary" | "neutral" | "brand-light" | "success" | "danger"
  size?: number
}

export const CircularIcon: React.FC<CircularIconProps> = ({
  icon,
  variant = "neutral",
  size = 20,
}) => {
  let bg = "bg-surface-sunken"
  let border = true
  let borderColor = "border-border"
  let iconColor: "primary" | "secondary" | "muted" | "success" | "danger" = "primary"

  if (variant === "primary") {
    bg = "bg-brand-primary/20"
    borderColor = "border-brand-primary/80"
    iconColor = "primary"
  } else if (variant === "secondary") {
    bg = "bg-surface-sunken"
    borderColor = "border-border"
    iconColor = "secondary"
  } else if (variant === "brand-light") {
    bg = "bg-brand-primary/10"
    border = false
    borderColor = ""
    iconColor = "primary"
  } else if (variant === "success") {
    bg = "bg-brand-success/20"
    borderColor = "border-brand-success/80"
    iconColor = "success"
  } else if (variant === "danger") {
    bg = "bg-brand-danger/20"
    borderColor = "border-brand-danger/80"
    iconColor = "danger"
  } else if (variant === "neutral") {
    bg = "bg-surface-sunken"
    border = true
    borderColor = "border-border"
    iconColor = "primary"
  }

  return (
    <Box padding={2.5} bg={bg} radius="full" border={border} borderColor={borderColor}>
      <Icon icon={icon} size={size} color={iconColor} />
    </Box>
  )
}
