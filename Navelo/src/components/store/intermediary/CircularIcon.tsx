import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Icon } from "@/components/store/base/Icon"
import { LucideIcon } from "lucide-react"

export interface CircularIconProps {
  icon: LucideIcon
  size?: number
  variant?: "primary" | "secondary" | "solid"
  solidColor?: "primary" | "secondary" | "success" | "danger"
  solidRadius?: "default" | "full"
}

export const CircularIcon: React.FC<CircularIconProps> = ({
  icon,
  size = 20,
  variant = "primary",
  solidColor = "primary",
  solidRadius = "default",
}) => {
  const isSecondary = variant === "secondary"
  const isSolid = variant === "solid"

  const solidBgMap = {
    primary: "bg-brand-primary",
    secondary: "bg-brand-secondary",
    success: "bg-brand-success",
    danger: "bg-brand-danger",
  } as const

  if (isSolid) {
    return (
      <Box
        padding={2.5}
        bg={solidBgMap[solidColor]}
        radius={solidRadius}
      >
        <Icon icon={icon} size={size} color="white" />
      </Box>
    )
  }

  return (
    <Box 
      padding={2.5} 
      bg={isSecondary ? "bg-brand-secondary/20" : "bg-brand-primary/20"} 
      radius="full" 
      border={true} 
      borderColor={isSecondary ? "border-brand-secondary/80" : "border-brand-primary/80"}
    >
      <Icon icon={icon} size={size} color={isSecondary ? "brand-secondary" : "primary"} />
    </Box>
  )
}
