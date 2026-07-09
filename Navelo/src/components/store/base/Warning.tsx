"use client"

import * as React from "react"
import { LucideIcon, X } from "lucide-react"
import { Box } from "./Box"
import { Stack } from "./Stack"
import { Font } from "./Font"
import { Button } from "./Button"
import { Icon } from "./Icon"

export interface WarningProps {
  title: string
  text?: string | React.ReactNode
  icon: LucideIcon
  textButton?: string
  onClick?: () => void
  onClose?: () => void
  variant: "warning" | "danger" | "success" | "info"
}

const variantConfig = {
  warning: {
    bg: "bg-brand-warning/10",
    border: "border-brand-warning/30",
    textClass: "warning" as const,
    iconBg: "bg-brand-warning",
    buttonVariant: "outline-secondary-sm" as const,
    closeButtonVariant: "outline-secondary-pill-icon" as const,
  },
  danger: {
    bg: "bg-brand-danger/10",
    border: "border-brand-danger/30",
    textClass: "danger" as const,
    iconBg: "bg-brand-danger",
    buttonVariant: "outline-danger-sm" as const,
    closeButtonVariant: "outline-danger-pill-icon" as const,
  },
  success: {
    bg: "bg-brand-success/10",
    border: "border-brand-success/30",
    textClass: "success" as const,
    iconBg: "bg-brand-success",
    buttonVariant: "outline-success-sm" as const,
    closeButtonVariant: "outline-success-pill-icon" as const,
  },
  info: {
    bg: "bg-brand-primary/10",
    border: "border-brand-primary/30",
    textClass: "primary" as const,
    iconBg: "bg-brand-primary",
    buttonVariant: "outline-primary-sm" as const,
    closeButtonVariant: "outline-primary-pill-icon" as const,
  },
}

export const Warning: React.FC<WarningProps> = ({
  title,
  text,
  icon: IconComponent,
  textButton,
  onClick,
  onClose,
  variant,
}) => {
  const config = variantConfig[variant] || variantConfig.warning

  return (
    <Box
      padding={5}
      bg={config.bg}
      border={true}
      borderColor={config.border}
      radius="default"
      w="full"
    >
      {/* Container principal flex com alinhamento vertical centralizado no PC/Desktop */}
      <Stack
        direction="col"
        mobileDirection="row"
        align="stretch"
        justify="between"
        gap={5}
        w="full"
        className="md:items-center"
      >
        {/* Lado Esquerdo: Ícone Circular Sólido + Título e Texto (empilhados no mobile, lado a lado no PC) */}
        <Stack
          direction="col"
          mobileDirection="row"
          gap={5}
          align="start"
          flex="1"
          w="full"
          className="md:items-center"
        >
          <Box
            padding={2.5}
            bg={config.iconBg}
            radius="full"
            display="flex"
            justify="center"
            shrink="0"
          >
            <Icon icon={IconComponent} size={24} color="white" />
          </Box>

          <Stack gap={1} w="full">
            <Font variant="body-semibold" color={config.textClass} text={title} />
            {React.isValidElement(text) ? (
              text
            ) : (
              typeof text === "string" && <Font variant="description" color={config.textClass} text={text} />
            )}
          </Stack>
        </Stack>

        {/* Lado Direito: Botões de Ação e Fechar (largura cheia no mobile, auto no PC) */}
        <Stack direction="row" gap={2.5} align="center" flex="none" className="w-full md:w-auto">
          {textButton && onClick && (
            <Box flex="1" className="md:flex-none min-w-0">
              <Button
                variant={config.buttonVariant}
                label={textButton}
                onClick={onClick}
                fullWidth
              />
            </Box>
          )}
          {onClose && (
            <Box shrink="0">
              <Button
                variant={config.closeButtonVariant}
                icon={X}
                onClick={onClose}
              />
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}
