import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Button } from "@/components/store/base/Button"
import { LucideIcon, ArrowLeft } from "lucide-react"

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
  title: _title,
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
    <Box padding={5} w="full" flex="1" bg="bg-background" direction="col" overflow="hidden" minH="0" {...props}>
      <Stack gap={5} w="full" flex="1" minH="0" overflow="hidden">
        {(onBack || customActions) && (
          <Box position="relative" w="full" shrink="0">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              {onBack ? (
                <Button
                  variant="ghost-primary"
                  label={_title || "Voltar"}
                  icon={ArrowLeft}
                  onClick={onBack}
                  justify="start"
                />
              ) : (
                <Box />
              )}
              {customActions ? (
                <Stack direction="row" align="center" gap={2.5} flex="1" justify="end">
                  {customActions}
                </Stack>
              ) : (
                <Box />
              )}
            </Stack>
          </Box>
        )}

        {/* Content (RegistrySections) */}
        <Stack w="full" flex="1" gap={1} minH="0" overflow="hidden">
          {children}
        </Stack>
      </Stack>
    </Box>
  )
}