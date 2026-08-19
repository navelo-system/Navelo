"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { LucideIcon, X } from "lucide-react"
import { Stack } from "./Stack"
import { Box } from "./Box"
import { Button, ButtonVariant } from "./Button"
import { Font } from "./Font"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"

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
    cancelText?: string
    cancelVariant?: ButtonVariant
    zIndex?: number
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
    cancelText?: string
    cancelVariant?: never
    zIndex?: number
    variant?: "default" | "bottom" | "sidebar"
    children: React.ReactNode
    footer?: React.ReactNode
  }

interface SidebarContentProps {
  zIndex: number
  backdropStyle: React.CSSProperties
  dialogStyle: React.CSSProperties
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  onClose: () => void
}

function SidebarModalContent({
  zIndex,
  backdropStyle,
  dialogStyle,
  title,
  children,
  footer,
  onClose,
}: SidebarContentProps) {
  return (
    <div className="fixed inset-0 flex justify-end" style={{ zIndex }}>
      <div
        className="absolute inset-0 bg-black/50"
        style={backdropStyle}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{ ...dialogStyle, zIndex: zIndex + 1 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xs h-full bg-surface border-l-2 border-border shadow-2xl flex flex-col"
      >
        <div className="p-5">
          <Stack direction="row" align="center" justify="between" w="full">
            <Font variant="h3" text={title ?? ""} />
            <Button variant="secondary-pill-icon-xs" icon={X} onClick={onClose} />
          </Stack>
        </div>
        <div className="h-[1px] w-full bg-border" />
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 min-h-0">
          {children}
        </div>
        {footer && (
          <>
            <div className="h-[2px] w-full bg-border shrink-0" />
            <div className="p-5 shrink-0">{footer}</div>
          </>
        )}
      </div>
    </div>
  )
}

interface BottomContentProps {
  zIndex: number
  backdropStyle: React.CSSProperties
  dialogStyle: React.CSSProperties
  title?: string
  showCancelButton: boolean
  cancelText: string
  successText?: string
  isSubmit: boolean
  children: React.ReactNode
  onClose: () => void
  onSuccess?: () => void
}

function BottomModalContent({
  zIndex,
  backdropStyle,
  dialogStyle,
  title,
  showCancelButton,
  cancelText,
  successText,
  isSubmit,
  children,
  onClose,
  onSuccess,
}: BottomContentProps) {
  return (
    <div className="fixed inset-0 flex items-end justify-center" style={{ zIndex }}>
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        style={backdropStyle}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{ ...dialogStyle, zIndex: zIndex + 1 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full bg-surface shadow-2xl rounded-t-[24px] border-t-2 border-border p-6"
      >
        <Stack gap={5} w="full">
          <Stack direction="col" mobileDirection="row" align="center" mobileAlign="center" justify="between" w="full" gap={5}>
            <Box flex="1" className="text-center md:text-left">
              <Font variant="body-bold" text={title ?? ""} color="muted" />
            </Box>
            <Stack direction="row" align="center" justify="center" w="full" mobileJustify="end" gap={5} className="md:w-auto">
              {showCancelButton && (
                <Button type="button" variant="ghost" label={cancelText} onClick={onClose} />
              )}
              {showCancelButton && successText && (
                <Box h="h-6" w="w-[1px]" bg="bg-border" opacity="50" />
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
        </Stack>
      </div>
    </div>
  )
}

interface DefaultContentProps {
  zIndex: number
  backdropStyle: React.CSSProperties
  dialogStyle: React.CSSProperties
  title?: string
  subtitle?: string
  icon?: LucideIcon
  showCancelButton: boolean
  cancelText: string
  cancelVariant: ButtonVariant
  successText?: string
  isSubmit: boolean
  children: React.ReactNode
  onClose: () => void
  onSuccess?: () => void
}

function DefaultModalContent({
  zIndex,
  backdropStyle,
  dialogStyle,
  title,
  subtitle,
  icon,
  showCancelButton,
  cancelText,
  cancelVariant,
  successText,
  isSubmit,
  children,
  onClose,
  onSuccess,
}: DefaultContentProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex }}>
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        style={backdropStyle}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{ ...dialogStyle, zIndex: zIndex + 1 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-[5px] border-2 border-border bg-surface shadow-lg sm:rounded-[8px]"
      >
        <ModalHeader title={title ?? ""} subtitle={subtitle} icon={icon} />
        <div className="h-[2px] bg-border w-full" />
        <ModalBody>{children}</ModalBody>
        {(showCancelButton || successText) && (
          <>
            <div className="h-[2px] bg-border w-full" />
            <div className="p-5">
              <Stack direction="col" mobileDirection="row" gap={2.5} w="full">
                {showCancelButton && (
                  <Box flex="1">
                    <Button
                      type="button"
                      variant={cancelVariant}
                      label={cancelText}
                      onClick={onClose}
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

function getDialogStyle(isSidebar: boolean, isBottom: boolean, isActive: boolean): React.CSSProperties {
  if (isSidebar) {
    return {
      transform: isActive ? "translateX(0)" : "translateX(100%)",
      transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
    }
  }
  return {
    opacity: isBottom ? 1 : (isActive ? 1 : 0),
    transform: isBottom
      ? (isActive ? "translateY(0)" : "translateY(100%)")
      : (isActive ? "scale(1)" : "scale(0.95)"),
    transition: isBottom
      ? "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)"
      : "opacity 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
  }
}

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
    cancelText = "Cancelar",
    zIndex = 100,
    variant = "default",
    cancelVariant = "secondary",
    children,
    footer,
  } = props

  const [shouldRender, setShouldRender] = React.useState(isOpen)
  const [isActive, setIsActive] = React.useState(false)
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setShouldRender(true)
    } else {
      setIsActive(false)
    }
  }

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      const animTimer = setTimeout(() => setIsActive(true), 16)
      return () => {
        clearTimeout(animTimer)
        document.body.style.overflow = ""
      }
    }
    document.body.style.overflow = ""
    const unmountTimer = setTimeout(() => setShouldRender(false), 250)
    return () => clearTimeout(unmountTimer)
  }, [isOpen])

  const handleClose = () => {
    setIsActive(false)
    document.body.style.overflow = ""
    setTimeout(() => {
      setShouldRender(false)
      onClose()
    }, 250)
  }

  if (!shouldRender) return null

  const isSidebar = variant === "sidebar"
  const isBottom = variant === "bottom"
  const dialogStyle = getDialogStyle(isSidebar, isBottom, isActive)
  const backdropStyle: React.CSSProperties = {
    opacity: isActive ? 1 : 0,
    transition: "opacity 0.28s ease",
  }

  let modalContent: React.ReactNode = null
  if (isSidebar) {
    modalContent = (
      <SidebarModalContent
        zIndex={zIndex}
        backdropStyle={backdropStyle}
        dialogStyle={dialogStyle}
        title={title}
        footer={footer}
        onClose={handleClose}
      >
        {children}
      </SidebarModalContent>
    )
  } else if (isBottom) {
    modalContent = (
      <BottomModalContent
        zIndex={zIndex}
        backdropStyle={backdropStyle}
        dialogStyle={dialogStyle}
        title={title}
        showCancelButton={showCancelButton}
        cancelText={cancelText}
        successText={successText}
        isSubmit={isSubmit}
        onClose={handleClose}
        onSuccess={onSuccess}
      >
        {children}
      </BottomModalContent>
    )
  } else {
    modalContent = (
      <DefaultModalContent
        zIndex={zIndex}
        backdropStyle={backdropStyle}
        dialogStyle={dialogStyle}
        title={title}
        subtitle={subtitle}
        icon={icon}
        showCancelButton={showCancelButton}
        cancelText={cancelText}
        cancelVariant={cancelVariant}
        successText={successText}
        isSubmit={isSubmit}
        onClose={handleClose}
        onSuccess={onSuccess}
      >
        {children}
      </DefaultModalContent>
    )
  }

  if (typeof document === "undefined") return null
  return createPortal(modalContent, document.body)
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
        {IconComp && (
          <CircularIcon
            icon={IconComp}
            size={20}
            variant="solid"
            solidColor="secondary"
            solidRadius="default"
          />
        )}
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
  cancelVariant?: ButtonVariant
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
  isSubmit = false,
}: ModalFooterProps) {
  return (
    <div className="p-5">
      <Stack direction="col" mobileDirection="row" gap={2.5} w="full">
        <Box flex="1">
          <Button
            type="button"
            variant={cancelVariant}
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
