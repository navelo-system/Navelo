import * as React from "react"
import { Box } from "../base/Box"
import { Icon } from "../base/Icon"
import { LucideIcon } from "lucide-react"

export interface CircularIconProps {
  icon: LucideIcon
  size?: number
  variant?: "primary" | "secondary" | "solid"
}

export const CircularIcon: React.FC<CircularIconProps> = ({
  icon,
  size = 20,
  variant = "primary"
}) => {
  const isSecondary = variant === "secondary"
  const isSolid = variant === "solid"

  if (isSolid) {
    return (
      <Box
        padding={2.5}
        bg="bg-brand-primary"
        radius="full"
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
