import * as React from "react"
import { cn } from "@/lib/utils"

import { LucideIcon } from "lucide-react"

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  variant?: "default" | "primary" | "secondary" | "success" | "danger" | "outline"
  rounded?: "default" | "full"
  label: string
  icon?: LucideIcon
}

const variantStyles = {
  default: "bg-foreground/10 text-foreground border-2 border-foreground/30",
  primary: "bg-brand-primary/20 text-brand-primary border-2 border-brand-primary/80",
  secondary: "bg-brand-secondary/20 text-brand-secondary border-2 border-brand-secondary/80",
  success: "bg-brand-success/20 text-brand-success border-2 border-brand-success/80",
  danger: "bg-brand-danger/20 text-brand-danger border-2 border-brand-danger/80",
  outline: "text-foreground border-2 border-border bg-transparent",
}

const roundedStyles = {
  default: "rounded-[5px]",
  full: "rounded-full",
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", rounded = "default", label, icon: Icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
          variantStyles[variant],
          roundedStyles[rounded],
          className
        )}
        {...props}
      >
        {Icon && <Icon size={12} strokeWidth={2.5} />}
        {label}
      </div>
    )
  }
)
Badge.displayName = "Badge"
