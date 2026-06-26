import * as React from "react"
import { cn } from "@/lib/utils"

export interface FontProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  text: React.ReactNode
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "body" | "body-medium" | "body-semibold" | "body-bold" | "body-sm-medium" | "body-sm-semibold" | "body-xs" | "body-xs-medium" | "body-xs-semibold" | "body-xs-bold" | "description" | "auxiliary" | "sub-tiny" | "sub-tiny-bold"
  color?: "foreground" | "secondary" | "muted" | "dim" | "primary" | "brand-secondary" | "white" | "danger" | "success" | "warning" | "inherit"
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div"
}

const variantStyles = {
  "h1": "text-3xl md:text-4xl font-bold tracking-tight text-foreground",
  "h2": "text-2xl md:text-3xl font-bold tracking-tight text-foreground",
  "h3": "text-xl md:text-2xl font-semibold tracking-tight text-foreground",
  "h4": "text-lg md:text-xl font-semibold text-foreground",
  "h5": "text-base md:text-lg font-medium text-foreground",
  "body": "text-base text-foreground",
  "body-medium": "text-base font-medium text-foreground",
  "body-semibold": "text-base font-semibold text-foreground",
  "body-bold": "text-base font-bold text-foreground",
  "body-sm-medium": "text-sm font-medium text-foreground",
  "body-sm-semibold": "text-sm font-semibold text-foreground",
  "body-xs": "text-xs text-foreground",
  "body-xs-medium": "text-xs font-medium text-foreground",
  "body-xs-semibold": "text-xs font-semibold text-foreground",
  "body-xs-bold": "text-xs font-bold text-foreground",
  "description": "text-sm text-text-secondary",
  "auxiliary": "text-[10px] text-text-muted",
  "sub-tiny": "text-[10px] uppercase tracking-wider font-semibold text-text-dim",
  "sub-tiny-bold": "text-[10px] uppercase tracking-wider font-bold text-text-dim",
}

const colorStyles = {
  "foreground": "text-foreground",
  "secondary": "text-text-secondary",
  "muted": "text-text-muted",
  "dim": "text-text-dim",
  "primary": "text-brand-primary",
  "brand-secondary": "text-brand-secondary",
  "white": "text-white",
  "danger": "text-brand-danger",
  "success": "text-brand-success",
  "warning": "text-brand-warning",
  "inherit": "text-inherit",
}

export const Font = React.forwardRef<HTMLElement, FontProps>(
  ({ className, text, variant = "body", color, as = "span", ...props }, ref) => {
    const Comp = as as any
    return (
      <Comp
        ref={ref}
        className={cn(
          variantStyles[variant],
          color && colorStyles[color],
          className
        )}
        {...props}
      >
        {text}
      </Comp>
    )
  }
)
Font.displayName = "Font"
