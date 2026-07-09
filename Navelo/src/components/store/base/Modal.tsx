/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { Stack } from "./Stack"
import { Box } from "./Box"
import { Button } from "./Button"

export type ModalProps = 
  | {
      isOpen: boolean
      onClose: () => void
      title: string
      subtitle: string
      icon: LucideIcon
      successText?: string
      onSuccess?: () => void
      isSubmit?: boolean
      showCancelButton?: boolean
      children: React.ReactNode
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
      children: React.ReactNode
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
    children 
  } = props

  // shouldRender: controla se o elemento existe no DOM
  // isActive: controla o estado visual (dispara a transição CSS)
  const [shouldRender, setShouldRender] = React.useState(false)
  const [isActive, setIsActive] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      document.body.style.overflow = "hidden"
      // Double RAF: garante que o browser pintou o estado inicial (scale 0.9, opacity 0)
      // antes de aplicar a transição para o estado final
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsActive(true)
        })
      })
    } else {
      setIsActive(false)
      document.body.style.overflow = ""
      const timer = setTimeout(() => setShouldRender(false), 220)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  React.useEffect(() => {
    return () => { document.body.style.overflow = "" }
  }, [])

  const handleClose = () => {
    setIsActive(false)
    document.body.style.overflow = ""
    setTimeout(() => {
      setShouldRender(false)
      onClose()
    }, 220)
  }

  if (!shouldRender) return null

  // Estado inicial: scale 0.9, opacity 0 → transição para scale 1, opacity 1
  const dialogStyle: React.CSSProperties = {
    opacity: isActive ? 1 : 0,
    transform: isActive ? "scale(1)" : "scale(0.9)",
    transition: isActive
      ? "opacity 0.2s ease, transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1)"
      : "opacity 0.18s ease, transform 0.18s ease"
  }

  // Modo Simplificado (quando 'title' é fornecido)
  if (title) {
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
                        variant="outline-danger" 
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
                        variant="outline-success" 
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

import { Font } from "./Font"
import { CircularIcon } from "../intermediary/CircularIcon"

export interface ModalHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
}

export function ModalHeader({ title, subtitle, icon: IconComp }: ModalHeaderProps) {
  return (
    <div className="flex flex-col space-y-1.5 p-5">
      <Stack direction="row" align="center" gap={5}>
        {IconComp && <CircularIcon icon={IconComp} size={20} />}
        <Stack gap={1}>
          <Font variant="body-bold" text={title} />
          {subtitle && <Font variant="description" text={subtitle} />}
        </Stack>
      </Stack>
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
  confirmLabel?: string
  confirmIcon?: LucideIcon
  onConfirm?: () => void
  isSubmit?: boolean
}

export function ModalFooter({ 
  cancelLabel = "Cancelar",
  cancelIcon,
  onCancel,
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
            variant="outline-danger" 
            label={cancelLabel} 
            icon={cancelIcon} 
            onClick={onCancel} 
            fullWidth 
          />
        </Box>
        <Box flex="1">
          <Button 
            type={isSubmit ? "submit" : "button"} 
            variant="outline-success" 
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
