import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"

export interface CardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Card({ title, subtitle, children, footer }: CardProps) {
  return (
    <Box padding={5} radius="default" border borderColor="border-border" bg="bg-surface">
      <Stack gap={5}>
        {(title || subtitle) && (
          <Stack gap={2.5}>
            {title && <Font variant="h3" text={title} />}
            {subtitle && <Font variant="description" text={subtitle} />}
          </Stack>
        )}
        <Box>{children}</Box>
        {footer && (
          <>
            <Box paddingY={2.5}>
              <Box bg="bg-border" h="h-[2px]" w="full" />
            </Box>
            <Box>{footer}</Box>
          </>
        )}
      </Stack>
    </Box>
  )
}
