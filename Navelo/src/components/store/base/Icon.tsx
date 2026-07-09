import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface IconProps extends React.SVGAttributes<SVGElement> {
  icon: LucideIcon
  size?: number | string
  color?: "foreground" | "secondary" | "muted" | "primary" | "brand-secondary" | "white" | "danger" | "success" | "warning" | "inherit"
  variant?: "default" | "circular-success" | "circular-secondary" | "circular-primary"
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
  ({ className, icon: IconComponent, size = 20, color = "inherit", variant = "default", ...props }, ref) => {
    if (variant === "circular-success") {
      return (
        <span className="inline-flex items-center justify-center rounded-full w-8 h-8 bg-brand-success/10 border border-brand-success/30 text-brand-success shrink-0">
          <IconComponent
            ref={ref as React.Ref<SVGSVGElement>}
            size={16}
            className={cn(className)}
            {...props}
          />
        </span>
      )
    }

    if (variant === "circular-secondary") {
      return (
        <span className="inline-flex items-center justify-center rounded-full w-8 h-8 bg-brand-secondary/10 border border-brand-secondary/30 text-brand-secondary shrink-0">
          <IconComponent
            ref={ref as React.Ref<SVGSVGElement>}
            size={16}
            className={cn(className)}
            {...props}
          />
        </span>
      )
    }

    if (variant === "circular-primary") {
      return (
        <span className="inline-flex items-center justify-center rounded-full w-8 h-8 bg-brand-primary/10 border border-brand-primary/30 text-brand-primary shrink-0">
          <IconComponent
            ref={ref as React.Ref<SVGSVGElement>}
            size={16}
            className={cn(className)}
            {...props}
          />
        </span>
      )
    }

    return (
      <IconComponent
        ref={ref as React.Ref<SVGSVGElement>}
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
