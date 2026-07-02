import * as React from "react"
import { Box } from "../base/Box"
import { Icon } from "../base/Icon"
import { LucideIcon } from "lucide-react"

export interface CircularIconProps {
  icon: LucideIcon
  size?: number
}

export const CircularIcon: React.FC<CircularIconProps> = ({
  icon,
  size = 20,
}) => {
  return (
    <Box padding={2.5} bg="bg-brand-primary/20" radius="full" border={true} borderColor="border-brand-primary/80">
      <Icon icon={icon} size={size} color="primary" />
    </Box>
  )
}
