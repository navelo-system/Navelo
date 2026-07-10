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
    <Box padding={5} w="full" flex="1" bg="bg-background" className="min-h-0 flex flex-col" {...props}>
      <Stack gap={5} w="full" flex="1" className="min-h-0">
        {(onBack || customActions) && (
          <Stack direction="row" align="center" justify="between" w="full" gap={5} flex="none">
            {onBack ? (
              <Box display="block md:hidden">
                <Button
                  variant="ghost-primary"
                  label={_title || "Voltar"}
                  icon={ArrowLeft}
                  onClick={onBack}
                  justify="start"
                />
              </Box>
            ) : (
              <Box />
            )}
            <Stack direction="row" align="center" gap={2.5} flex="none">
              {customActions}
              {onBack && (
                <Box display="hidden md:block">
                  <Button
                    variant="ghost-primary"
                    label={_title || "Voltar"}
                    icon={ArrowLeft}
                    onClick={onBack}
                  />
                </Box>
              )}
            </Stack>
          </Stack>
        )}

        {/* Content (RegistrySections) */}
        <Stack gap={'section'} w="full" flex="1" className="min-h-0">
          {children}
        </Stack>
      </Stack>
    </Box>
  )
}