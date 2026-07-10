/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Stack } from "./Stack"
import { Box } from "./Box"
import { Button } from "./Button"
import { Font } from "./Font"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { X } from "lucide-react"

export type ModalProps =
  | {
    isOpen: boolean
    onClose: () => void
    title: string
    subtitle?: string
    icon?: LucideIcon
    successText?: string
    onSuccess?: () => void
    isSubmit?: boolean
    showCancelButton?: boolean
    cancelVariant?: string
    variant?: "default" | "bottom" | "sidebar"
    children: React.ReactNode
    footer?: React.ReactNode
  }
  | {
    isOpen: boolean
    onClose: () => void
    title?: never
    subtitle?: never
    icon?: never
    successText?: never
    onSuccess?: never
    isSubmit?: never
    showCancelButton?: never
    cancelVariant?: never
    variant?: "default" | "bottom" | "sidebar"
    children: React.ReactNode
    footer?: React.ReactNode
  }
/**/
export function Modal(props: ModalProps) {
  const {
    isOpen,
    onClose,
    title,
    subtitle,
    icon,
    successText,
    onSuccess,
    isSubmit = false,
    showCancelButton = true,
    variant = "default",
    cancelVariant = "secondary",
    children,
    footer,
  } = props

  // shouldRender: controla se o elemento existe no DOM
  // isActive: controla a posição final do painel (translateX)
  // enableTransition: habilita CSS transition só após o frame inicial off-screen
  const [shouldRender, setShouldRender] = React.useState(false)
  const [isActive, setIsActive] = React.useState(false)
  const [enableTransition, setEnableTransition] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setIsActive(false)
      setEnableTransition(false)
      document.body.style.overflow = "hidden"

      const raf1 = requestAnimationFrame(() => {
        setEnableTransition(true)
        requestAnimationFrame(() => {
          setIsActive(true)
        })
      })

      return () => cancelAnimationFrame(raf1)
    }

    setEnableTransition(true)
    setIsActive(false)
    document.body.style.overflow = ""
    const timer = setTimeout(() => setShouldRender(false), 220)
    return () => clearTimeout(timer)
  }, [isOpen])

  React.useEffect(() => {
    return () => { document.body.style.overflow = "" }
  }, [])

  const handleClose = () => {
    setEnableTransition(true)
    setIsActive(false)
    document.body.style.overflow = ""
    setTimeout(() => {
      setShouldRender(false)
      onClose()
    }, 220)
  }

  if (!shouldRender) return null

  const isSidebar = variant === "sidebar"
  const isBottom = variant === "bottom"

  // Animado de baixo para cima na variante bottom, senão em scale centralizado
  const dialogStyle: React.CSSProperties = isSidebar
    ? {
      transform: isActive ? "translateX(0)" : "translateX(100%)",
      transition: enableTransition
        ? isActive
          ? "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)"
          : "transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)"
        : "none",
    }
    : {
      opacity: isBottom ? 1 : (isActive ? 1 : 0),
      transform: isBottom
        ? (isActive ? "translateY(0)" : "translateY(100%)")
        : (isActive ? "scale(1)" : "scale(0.9)"),
      transition: isActive
        ? (isBottom
          ? "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          : "opacity 0.2s ease, transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1)")
        : (isBottom
          ? "transform 0.22s ease-in"
          : "opacity 0.18s ease, transform 0.18s ease")
    }

  const backdropStyle: React.CSSProperties = isSidebar
    ? {
      opacity: isActive ? 1 : 0,
      transition: enableTransition ? "opacity 0.22s ease" : "none",
    }
    : {}

  // Variant: sidebar (drawer deslizando da direita)
  if (isSidebar) {
    return (
      <div className="fixed inset-0 z-[100] flex justify-end">
        <div
          className="absolute inset-0 bg-black/50"
          style={backdropStyle}
          onClick={handleClose}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          style={dialogStyle}
          className="relative z-[101] w-full max-w-xs h-full bg-surface border-l-2 border-border shadow-2xl flex flex-col"
        >
          <div className="p-5">
            <Stack direction="row" align="center" justify="between" w="full">
              <Font variant="h3" text={title ?? ""} />
              <Button variant="outline-pill-icon-xs" icon={X} onClick={handleClose} />
            </Stack>
          </div>
          <div className="h-[1px] w-full bg-border" />
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 min-h-0">
            {children}
          </div>
          {footer && (
            <>
              <div className="h-[2px] w-full bg-border shrink-0" />
              <div className="p-5 shrink-0">
                {footer}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Modo Simplificado com title
  if (title) {
    if (isBottom) {
      return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            style={dialogStyle}
            className="relative z-[101] w-full bg-surface shadow-2xl rounded-t-[24px] border-t-2 border-border p-6"
          >
            <Stack direction="col" mobileDirection="row" align="center" mobileAlign="center" justify="between" w="full" gap={5}>
              <Box flex="1" className="text-center md:text-left">
                <Font variant="body-bold" text={title} color="muted" />
              </Box>

              <Stack direction="row" align="center" justify="center" w="full" mobileJustify="end" gap={5} className="md:w-auto">
                {showCancelButton && (
                  <Button
                    type="button"
                    variant="ghost"
                    label="Cancelar"
                    onClick={handleClose}
                  />
                )}
                {showCancelButton && successText && (
                  <Box h="24px" w="1px" bg="bg-border" opacity="50" />
                )}
                {successText && (
                  <Button
                    type={isSubmit ? "submit" : "button"}
                    variant="ghost-secondary"
                    label={successText}
                    onClick={onSuccess}
                  />
                )}
              </Stack>
            </Stack>
            {children}
          </div>
        </div>
      )
    }

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />
        <div
          role="dialog"
          aria-modal="true"
          style={dialogStyle}
          className="relative z-[101] w-full max-w-lg rounded-[5px] border-2 border-border bg-surface shadow-lg sm:rounded-[8px]"
        >
          <ModalHeader title={title} subtitle={subtitle} icon={icon} />
          <div className="h-[2px] bg-border w-full" />
          <ModalBody>
            {children}
          </ModalBody>
          {(showCancelButton || successText) && (
            <>
              <div className="h-[2px] bg-border w-full" />
              <div className="p-5">
                <Stack direction="col" mobileDirection="row" gap={2.5} w="full">
                  {showCancelButton && (
                    <Box flex="1">
                      <Button
                        type="button"
                        variant={cancelVariant as any}
                        label="Cancelar"
                        onClick={handleClose}
                        fullWidth
                      />
                    </Box>
                  )}
                  {successText && (
                    <Box flex="1">
                      <Button
                        type={isSubmit ? "submit" : "button"}
                        variant="primary"
                        label={successText}
                        onClick={onSuccess}
                        fullWidth
                      />
                    </Box>
                  )}
                </Stack>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Modo Legado / Composto
  const childrenArray = React.Children.toArray(children).filter(Boolean)
  const renderedChildren = childrenArray.map((child, index) => {
    const isLast = index === childrenArray.length - 1
    return (
      <React.Fragment key={index}>
        {child}
        {!isLast && <div className="h-[2px] bg-border w-full" />}
      </React.Fragment>
    )
  })

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        style={dialogStyle}
        className="relative z-[101] w-full max-w-lg rounded-[5px] border-2 border-border bg-surface shadow-lg sm:rounded-[8px]"
      >
        {renderedChildren}
      </div>
    </div>
  )
}

export interface ModalHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
}

export function ModalHeader({ title, subtitle, icon: IconComp }: ModalHeaderProps) {
  return (
    <div className="flex flex-col space-y-1.5 p-5">
      <div className="flex flex-col items-start gap-2.5 md:flex-row md:items-center md:gap-5">
        {IconComp && <CircularIcon icon={IconComp} size={20} variant="solid" solidColor="secondary" solidRadius="default" />}
        <Stack gap={1}>
          <Font variant="body-bold" text={title} />
          {subtitle && <Font variant="description" text={subtitle} />}
        </Stack>
      </div>
    </div>
  )
}

export interface ModalBodyProps {
  children: React.ReactNode
}

export function ModalBody({ children }: ModalBodyProps) {
  return (
    <div className="p-5 max-h-[60vh] overflow-y-auto">
      {children}
    </div>
  )
}

export interface ModalFooterProps {
  cancelLabel?: string
  cancelIcon?: LucideIcon
  onCancel?: () => void
  cancelVariant?: string
  confirmLabel?: string
  confirmIcon?: LucideIcon
  onConfirm?: () => void
  isSubmit?: boolean
}

export function ModalFooter({
  cancelLabel = "Cancelar",
  cancelIcon,
  onCancel,
  cancelVariant = "secondary",
  confirmLabel = "Confirmar",
  confirmIcon,
  onConfirm,
  isSubmit = false
}: ModalFooterProps) {
  return (
    <div className="p-5">
      <Stack direction="col" mobileDirection="row" gap={2.5} w="full">
        <Box flex="1">
          <Button
            type="button"
            variant={cancelVariant as any}
            label={cancelLabel}
            icon={cancelIcon}
            onClick={onCancel}
            fullWidth
          />
        </Box>
        <Box flex="1">
          <Button
            type={isSubmit ? "submit" : "button"}
            variant="primary"
            label={confirmLabel}
            icon={confirmIcon}
            onClick={onConfirm}
            fullWidth
          />
        </Box>
      </Stack>
    </div>
  )
}
