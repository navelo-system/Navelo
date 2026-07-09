/* eslint-disable complexity */
import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Icon } from "../base/Icon"
import { Button } from "../base/Button"
import { LucideIcon, ChevronLeft } from "lucide-react"

export interface RegistryMainProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  superiorTitle?: string
  icon?: LucideIcon
  onBack?: () => void
  customActions?: React.ReactNode
  children: React.ReactNode
}

export const RegistryMain: React.FC<RegistryMainProps> = ({
  title,
  subtitle,
  superiorTitle,
  icon,
  onBack,
  customActions,
  children,
  ...props
}) => {
  // Validação estrita do Design System
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (typeof child.type === 'string') {
        throw new Error(`[Design System Violation] O componente RegistryMain não aceita tags primitivas HTML como <${child.type}>. Use RegistrySection, Box ou Stack.`);
      }
      const childType = child.type as React.JSXElementConstructor<unknown> & { name?: string, displayName?: string };
      const typeName = childType?.displayName || childType?.name;
      if (typeName && !['RegistrySection', 'RegistrySidebar', 'Box', 'Stack', 'Grid', 'Fragment', 'TenantShell'].includes(typeName) && typeName !== 'Symbol(react.fragment)') {
        console.warn(`[Design System Warning] RegistryMain não deveria renderizar diretamente <${typeName}>. Utilize uma RegistrySection.`);
      }
    }
  });

  return (
    <Box padding={5} w="full" h="full" bg="bg-background" overflow="auto" {...props}>
      <Stack gap={'section'} w="full">
        {(title || subtitle || icon || superiorTitle) && (
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack gap={2.5}>
              {onBack && (
                <Box className="block md:hidden">
                  <Button
                    variant="ghost-secondary"
                    label="Voltar"
                    icon={ChevronLeft}
                    onClick={onBack}
                    justify="start"
                  />
                </Box>
              )}
              {superiorTitle && (
                <Font variant="sub-tiny" color="primary" text={superiorTitle} />
              )}
              <Stack direction="row" align="center" gap={2.5}>
                {icon && <Icon icon={icon} size={32} color="primary" />}
                {title && <Font variant="h2" text={title} />}
              </Stack>
              {subtitle && <Font variant="description" text={subtitle} />}
            </Stack>
            {(onBack || customActions) && (
              <Stack direction="row" align="center" gap={2.5} flex="none">
                {customActions}
                {onBack && (
                  <Box className="hidden md:block">
                    <Button
                      variant="outline-secondary"
                      label="Voltar"
                      icon={ChevronLeft}
                      onClick={onBack}
                    />
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        )}

        {/* Content (RegistrySections) */}
        <Stack gap={'section'} w="full" flex="1">
          {children}
        </Stack>
      </Stack>
    </Box>
  )
}
