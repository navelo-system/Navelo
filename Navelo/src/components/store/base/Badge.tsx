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
  default: "bg-foreground/10 text-foreground border-none",
  primary: "bg-brand-primary/20 text-brand-primary border-none",
  secondary: "bg-brand-secondary/20 text-brand-secondary border-none",
  success: "bg-brand-success/20 text-brand-success border-none",
  danger: "bg-brand-danger/20 text-brand-danger border-none",
  outline: "text-foreground border-2 border-border bg-transparent",
}

const roundedStyles = {
  default: "rounded-[10px]",
  full: "rounded-full",
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", rounded = "default", label, icon: Icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase whitespace-nowrap flex-shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
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
