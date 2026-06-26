import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface IconProps extends React.SVGAttributes<SVGElement> {
  icon: LucideIcon
  size?: number | string
  color?: "foreground" | "secondary" | "muted" | "primary" | "brand-secondary" | "white" | "danger" | "success" | "warning" | "inherit"
}

const colorStyles = {
  "foreground": "text-foreground",
  "secondary": "text-text-secondary",
  "muted": "text-text-muted",
  "primary": "text-brand-primary",
  "brand-secondary": "text-brand-secondary",
  "white": "text-white",
  "danger": "text-brand-danger",
  "success": "text-brand-success",
  "warning": "text-brand-warning",
  "inherit": "text-inherit",
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, icon: IconComponent, size = 20, color = "inherit", ...props }, ref) => {
    return (
      <IconComponent
        ref={ref as any}
        size={size}
        className={cn(
          colorStyles[color],
          className
        )}
        {...props}
      />
    )
  }
)
Icon.displayName = "Icon"
