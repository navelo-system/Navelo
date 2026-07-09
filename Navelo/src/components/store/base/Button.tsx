import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { Icon as BaseIcon } from "./Icon"
import { Font } from "./Font"

type BaseColor = "primary" | "secondary" | "outline" | "outline-primary" | "outline-secondary" | "outline-success" | "outline-danger" | "ghost" | "ghost-secondary"
type Modifier = "" | "-pill" | "-sm" | "-xs" | "-lg" | "-icon" | "-icon-xs" | "-ghost" | "-pill-sm" | "-pill-xs" | "-pill-lg" | "-pill-icon" | "-pill-icon-xs"

export type ButtonVariant = `${BaseColor}${Modifier}`

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "style"> {
  variant?: ButtonVariant
  fullWidth?: boolean
  justify?: "center" | "start" | "end"
  label?: string
  icon?: LucideIcon
  iconRight?: LucideIcon
  href?: string
  modalTarget?: string
}

const variantStyles: Record<string, string> = {
  primary: "bg-brand-primary text-white hover:opacity-90 border-2 border-transparent",
  secondary: "bg-brand-secondary text-white hover:opacity-90 border-2 border-transparent",
  outline: "border-2 border-border bg-surface hover:bg-surface-sunken text-foreground",
  "outline-primary": "bg-brand-primary/20 text-brand-primary border-2 border-brand-primary/80 hover:bg-brand-primary/30",
  "outline-secondary": "bg-brand-secondary/20 text-brand-secondary border-2 border-brand-secondary/80 hover:bg-brand-secondary/30",
  "outline-success": "bg-brand-success/20 text-brand-success border-2 border-brand-success/80 hover:bg-brand-success/30",
  "outline-danger": "bg-brand-danger/20 text-brand-danger border-2 border-brand-danger/80 hover:bg-brand-danger/30",
  ghost: "bg-transparent text-foreground border-none hover:bg-transparent shadow-none p-0 min-h-0 min-w-0",
  "ghost-secondary": "bg-transparent text-brand-secondary border-none hover:bg-transparent shadow-none p-0 min-h-0 min-w-0",
}

const justifyStyles = {
  center: "justify-center",
  start: "justify-start",
  end: "justify-end",
}

const sizeStyles = {
  default: "py-2.5 px-5 min-h-[40px] h-auto",
  sm: "py-2 px-3 min-h-[32px] h-auto",
  xs: "py-1.5 px-3 min-h-[28px] h-auto",
  lg: "py-3.5 px-6 min-h-[48px] h-auto",
  icon: "h-10 w-10 p-0 flex items-center justify-center shrink-0",
  "icon-xs": "h-7 w-7 p-0 flex items-center justify-center shrink-0",
  ghost: "min-h-0 p-0 h-auto w-auto flex items-center justify-center",
}

const roundedStyles = {
  default: "rounded-[5px]",
  full: "rounded-full",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", justify = "center", fullWidth, label, icon: IconComponent, iconRight: IconRightComponent, href, modalTarget, ...props }, ref) => {
    
    const isPill = variant.includes("-pill")
    
    let logicalSize: keyof typeof sizeStyles = "default"
    if (variant === "ghost" || variant === "ghost-secondary") {
      logicalSize = "ghost"
    } else if (variant.includes("-icon-xs")) logicalSize = "icon-xs"
    else if (variant.includes("-icon")) logicalSize = "icon"
    else if (variant.includes("-xs")) logicalSize = "xs"
    else if (variant.includes("-sm")) logicalSize = "sm"
    else if (variant.includes("-lg")) logicalSize = "lg"
    else if (variant.includes("-ghost")) logicalSize = "ghost"

    let baseColor = variant as string
    const modifiers = ["-pill", "-icon-xs", "-icon", "-xs", "-sm", "-lg", "-ghost"]
    modifiers.forEach(mod => {
      baseColor = baseColor.replace(mod, "")
    })

    const isGhost = baseColor === "ghost" || baseColor === "ghost-secondary"

    const classes = cn(
      !isGhost && "btn-shimmer",
      "inline-flex flex-wrap text-center items-center gap-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50",
      justifyStyles[justify],
      variantStyles[baseColor] || variantStyles.primary,
      sizeStyles[logicalSize],
      roundedStyles[isPill ? "full" : "default"],
      !logicalSize.includes("icon") && logicalSize !== "ghost" && !fullWidth && "w-full md:w-auto",
      fullWidth && "w-full"
    )

    const getFontVariant = () => {
      if (logicalSize === "xs") return "body-xs-semibold"
      if (logicalSize === "sm") return "body-sm-semibold"
      return "body-semibold"
    }

    const getIconSize = () => {
      if (logicalSize === "xs" || logicalSize === "icon-xs") return 14
      if (logicalSize === "sm") return 16
      return 20
    }

    const content = (
      <>
        {IconComponent && <BaseIcon icon={IconComponent} size={getIconSize()} color="inherit" />}
        {label && <Font variant={getFontVariant()} color="inherit" text={label} align="center" />}
        {IconRightComponent && <BaseIcon icon={IconRightComponent} size={getIconSize()} color="inherit" />}
      </>
    )

    if (href) {
      return (
        <Link href={href} className={classes} data-modal-target={modalTarget}>
          {content}
        </Link>
      )
    }

    return (
      <button
        ref={ref}
        className={classes}
        data-modal-target={modalTarget}
        {...props}
      >
        {content}
      </button>
    )
  }
)
Button.displayName = "Button"
