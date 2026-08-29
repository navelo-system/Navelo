import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LucideIcon, Trash2, Printer } from "lucide-react"
import { Icon as BaseIcon } from "./Icon"
import { Font } from "./Font"
import { Modal } from "./Modal"
import { db } from "@/lib/dal/db"

export type ButtonVariant =
  | "primary"
  | "primary-lg"
  | "primary-sm"
  | "primary-xs"
  | "primary-icon"
  | "primary-icon-xs"
  | "primary-pill-icon"
  | "primary-pill-xs"
  | "secondary"
  | "secondary-lg"
  | "secondary-sm"
  | "secondary-xs"
  | "secondary-icon"
  | "secondary-icon-xs"
  | "secondary-pill-icon"
  | "secondary-pill-icon-xs"
  | "secondary-pill-xs"
  | "danger-sm"
  | "danger-icon"
  | "danger-icon-xs"
  | "danger-pill-icon"
  | "danger-pill-icon-xs"
  | "danger-confirm"
  | "danger-confirm-sm"
  | "danger-confirm-xs"
  | "danger-icon-confirm"
  | "danger-icon-xs-confirm"
  | "danger-pill-icon-confirm"
  | "danger-pill-confirm-xs"
  | "primary-print"
  | "primary-print-lg"
  | "primary-print-sm"
  | "primary-print-xs"
  | "primary-icon-print"
  | "primary-icon-xs-print"
  | "primary-pill-icon-print"
  | "primary-pill-print-xs"
  | "secondary-print"
  | "secondary-lg-print"
  | "secondary-print-sm"
  | "secondary-print-xs"
  | "secondary-icon-print"
  | "secondary-icon-xs-print"
  | "secondary-pill-icon-print"
  | "secondary-pill-print-xs"
  | "success-sm"
  | "outline"
  | "outline-lg"
  | "outline-sm"
  | "outline-xs"
  | "outline-pill-icon"
  | "outline-pill-icon-xs"
  | "outline-pill-xs"
  | "ghost"
  | "ghost-primary"
  | "ghost-secondary"
  | "ghost-menu"

export interface ConfirmModalProps {
  title: string
  subtitle: string
  paragraph: string
  icon?: LucideIcon
  successText?: string
  cancelText?: string
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
  justify?: "center" | "start" | "end" | "between"
  label?: string
  rightLabel?: string
  icon?: LucideIcon
  iconRight?: LucideIcon
  href?: string
  modalTarget?: string
  spinOnClick?: boolean
  confirmModal?: ConfirmModalProps
  confirmTitle?: string
  confirmSubtitle?: string
  confirmParagraph?: string
  confirmDescription?: string
  confirmIcon?: LucideIcon
  confirmSuccessText?: string
  confirmCancelText?: string
  onConfirm?: () => void
  onPrint?: () => void
}

const variantStyles: Record<string, string> = {
  primary: "bg-brand-primary text-brand-primary-fg hover:opacity-90",
  secondary: "bg-brand-secondary text-brand-secondary-fg hover:opacity-90",
  outline: "bg-brand-secondary/10 text-brand-primary hover:bg-brand-secondary/20",
  success: "bg-brand-success text-white hover:opacity-90",
  danger: "bg-brand-danger text-white hover:opacity-90",
  ghost: "bg-transparent text-foreground border-none hover:bg-transparent hover:opacity-80 shadow-none p-0 min-h-0 min-w-0",
  "ghost-secondary": "bg-transparent text-brand-secondary border-none hover:bg-transparent hover:opacity-80 shadow-none p-0 min-h-0 min-w-0",
  "ghost-primary": "bg-transparent text-brand-primary border-none hover:bg-transparent hover:opacity-80 shadow-none p-0 min-h-0 min-w-0",
  "ghost-menu": "bg-transparent text-foreground border-none hover:bg-transparent hover:opacity-80 shadow-none",
}

const justifyStyles: Record<string, string> = {
  center: "justify-center text-center",
  start: "justify-start text-left",
  end: "justify-end text-right",
  between: "justify-between text-left",
}

const sizeStyles = {
  default: "py-2.5 px-5 min-h-[40px] h-auto",
  sm: "py-2 px-3 min-h-[32px] h-auto",
  xs: "py-1 px-2.5 min-h-[26px] text-xs h-auto",
  lg: "py-3.5 px-6 min-h-[48px] h-auto",
  icon: "h-10 w-10 p-0 flex items-center justify-center shrink-0",
  "icon-xs": "h-7 w-7 p-0 flex items-center justify-center shrink-0",
  ghost: "p-0 min-h-0 min-w-0 h-auto w-auto flex items-center justify-center",
  "ghost-menu": "py-2.5 px-3 min-h-[40px] h-auto flex items-center justify-center",
}

const roundedStyles = {
  default: "rounded-[20px]",
  full: "rounded-full",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      justify = "center",
      fullWidth,
      label,
      rightLabel,
      icon: PassedIconComponent,
      iconRight: IconRightComponent,
      href,
      modalTarget,
      spinOnClick,
      confirmModal,
      confirmTitle,
      confirmSubtitle,
      confirmParagraph,
      confirmDescription,
      confirmIcon,
      confirmSuccessText,
      onConfirm,
      onPrint,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isSpinning, setIsSpinning] = React.useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
    const [isNoPrintOpen, setIsNoPrintOpen] = React.useState(false)
    const clickEventRef = React.useRef<React.MouseEvent<HTMLButtonElement> | null>(null)

    const activeVariant = variant
    const isConfirmVariant = activeVariant.includes("-confirm")
    const isConfirmButton = isConfirmVariant || Boolean(confirmModal) || Boolean(confirmTitle)

    const isPrintVariant = activeVariant.includes("-print")
    const isPrintButton = isPrintVariant || Boolean(onPrint)

    // Define o ícone padrão como Trash2 se for exclusão, ou Printer se for impressão
    const IconComponent =
      PassedIconComponent ||
      (isConfirmVariant || confirmModal || confirmTitle
        ? Trash2
        : isPrintButton
          ? Printer
          : undefined)

    const isPill = activeVariant.includes("-pill")

    let logicalSize: keyof typeof sizeStyles = "default"
    if (activeVariant === "ghost" || activeVariant === "ghost-secondary" || activeVariant === "ghost-primary") {
      logicalSize = "ghost"
    } else if (activeVariant === "ghost-menu") {
      logicalSize = "ghost-menu"
    } else if (activeVariant.includes("-icon-xs")) logicalSize = "icon-xs"
    else if (activeVariant.includes("-icon")) logicalSize = "icon"
    else if (activeVariant.includes("-xs")) logicalSize = "xs"
    else if (activeVariant.includes("-sm")) logicalSize = "sm"
    else if (activeVariant.includes("-lg")) logicalSize = "lg"
    else if (activeVariant.includes("-ghost")) logicalSize = "ghost"

    let baseColor = activeVariant as string
    const modifiers = ["-confirm", "-print", "-pill", "-icon-xs", "-icon", "-xs", "-sm", "-lg", "-ghost"]
    modifiers.forEach((mod) => {
      baseColor = baseColor.replace(mod, "")
    })

    const isGhost =
      baseColor === "ghost" || baseColor === "ghost-secondary" || baseColor === "ghost-primary" || baseColor === "ghost-menu"

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (spinOnClick) {
        setIsSpinning(true)
        setTimeout(() => setIsSpinning(false), 450)
      }

      if (isConfirmButton) {
        e.preventDefault()
        e.stopPropagation()
        clickEventRef.current = e
        setIsConfirmOpen(true)
        return
      }

      if (isPrintButton) {
        e.preventDefault()
        e.stopPropagation()
        clickEventRef.current = e

        try {
          const points = await db.print_points.toArray()
          const hasConfiguredPoint =
            Array.isArray(points) &&
            points.length > 0 &&
            points.some(
              (p) =>
                p.enabled !== false &&
                (Boolean(p.serverIp && p.serverIp.trim()) || Boolean(p.linkingCode && p.linkingCode.trim()))
            )

          if (!hasConfiguredPoint) {
            setIsNoPrintOpen(true)
            return
          }
        } catch {
          setIsNoPrintOpen(true)
          return
        }

        onClick?.(e)
        onPrint?.()
        return
      }

      onClick?.(e)
    }

    const handleConfirmSuccess = () => {
      setIsConfirmOpen(false)
      onConfirm?.()
      if (clickEventRef.current) {
        onClick?.(clickEventRef.current)
      }
    }

    const handleRetryPrint = async () => {
      try {
        const points = await db.print_points.toArray()
        const hasConfiguredPoint =
          Array.isArray(points) &&
          points.length > 0 &&
          points.some(
            (p) =>
              p.enabled !== false &&
              (Boolean(p.serverIp && p.serverIp.trim()) || Boolean(p.linkingCode && p.linkingCode.trim()))
          )

        if (hasConfiguredPoint) {
          setIsNoPrintOpen(false)
          if (clickEventRef.current) {
            onClick?.(clickEventRef.current)
          }
          onPrint?.()
          return
        }
      } catch {
        // ignore
      }
    }

    const classes = cn(
      !isGhost && "btn-shimmer",
      "inline-flex flex-nowrap whitespace-nowrap items-center gap-2.5 cursor-pointer transition-transform duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
      justifyStyles[justify],
      variantStyles[baseColor] || variantStyles.primary,
      sizeStyles[logicalSize],
      roundedStyles[isPill ? "full" : isGhost ? "full" : "default"],
      !isPill && !logicalSize.includes("icon") && logicalSize !== "ghost" && !fullWidth && "w-full md:w-auto",
      fullWidth && "w-full",
      props.disabled && !isGhost && "!bg-surface-sunken !text-text-muted !opacity-40 !cursor-not-allowed pointer-events-none shadow-none grayscale",
      props.disabled && isGhost && "!bg-transparent !opacity-40 !cursor-not-allowed pointer-events-none",
      className
    )

    const getFontVariant = () => {
      if (logicalSize === "xs") return "body-xs"
      if (logicalSize === "sm") return "body-sm-medium"
      return "body-medium"
    }

    const getIconSize = () => {
      if (logicalSize === "xs" || logicalSize === "icon-xs") return 14
      if (logicalSize === "sm") return 16
      return 20
    }

    const content = (
      <>
        {IconComponent && (
          <span className={cn("inline-flex transition-transform duration-500 ease-out", isSpinning && "rotate-[360deg]")}>
            <BaseIcon icon={IconComponent} size={getIconSize()} color="inherit" />
          </span>
        )}
        {label && (
          <span className="truncate min-w-0 max-w-full">
            <Font
              variant={getFontVariant()}
              color="inherit"
              text={label}
              align={justify === "start" || justify === "between" ? "left" : justify === "end" ? "right" : "center"}
              truncate
            />
          </span>
        )}
        {rightLabel && <Font variant="sub-tiny" color="muted" text={rightLabel} />}
        {IconRightComponent && <BaseIcon icon={IconRightComponent} size={getIconSize()} color="inherit" />}
      </>
    )

    const modalTitle = confirmTitle || confirmModal?.title || "Excluir Item"
    const modalSubtitle = confirmSubtitle || confirmModal?.subtitle || "Confirmar ação de exclusão"
    const modalParagraph =
      confirmParagraph ||
      confirmDescription ||
      confirmModal?.paragraph ||
      "Tem certeza de que deseja realizar esta exclusão? Esta ação não poderá ser desfeita."
    const modalIcon = confirmIcon || confirmModal?.icon || IconComponent || Trash2
    const modalSuccessText = confirmSuccessText || confirmModal?.successText || "Confirmar Exclusão"

    const confirmModalElement = isConfirmButton ? (
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={modalTitle}
        successText={modalSuccessText}
        onSuccess={handleConfirmSuccess}
        showCancelButton={true}
        zIndex={200}
      >
        <Font variant="body-sm-medium" text={modalParagraph} />
      </Modal>
    ) : null

    const noPrintModalElement = isPrintButton ? (
      <Modal
        isOpen={isNoPrintOpen}
        onClose={() => setIsNoPrintOpen(false)}
        title="Ponto de impressão não encontrado"
        showCancelButton={true}
        cancelVariant="secondary"
        cancelText="Continuar"
        successText="Tentar novamente"
        zIndex={200}
        onSuccess={handleRetryPrint}
      >
        <Font
          variant="body-sm-medium"
          text="Não foi possível identificar pontos de impressão configurados no sistema para realizar a impressão do comprovante."
        />
      </Modal>
    ) : null

    if (href) {
      return (
        <>
          <Link href={href} className={classes} data-modal-target={modalTarget}>
            {content}
          </Link>
          {confirmModalElement}
          {noPrintModalElement}
        </>
      )
    }

    return (
      <>
        <button
          ref={ref}
          className={classes}
          data-modal-target={modalTarget}
          onClick={handleClick}
          style={{
            ...(props.disabled
              ? {
                backgroundColor: "#cbd5e1",
                color: "#64748b",
                opacity: 0.45,
                pointerEvents: "none",
                cursor: "not-allowed",
                filter: "grayscale(1)",
              }
              : {}),
            ...(props.style || {}),
          }}
          {...props}
        >
          {content}
        </button>
        {confirmModalElement}
        {noPrintModalElement}
      </>
    )
  }
)
Button.displayName = "Button"

