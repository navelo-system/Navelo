import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Type } from "lucide-react"

export const TypographySection: React.FC = () => {
  return (
    <RegistrySection
      title="Tipografia"
      description="Variantes semânticas do componente Font."
      icon={Type}
    >
      <Box padding={5} bg="bg-surface" radius="default">
        <Stack gap={5}>
          <Font variant="h1" text="Heading 1 (30px/36px) - Títulos de página." />
          <Font variant="h2" text="Heading 2 (24px/30px) - Subtítulos principais." />
          <Font variant="h3" text="Heading 3 (20px/24px) - Títulos de seções ou cards." />
          <Font variant="h4" text="Heading 4 (18px/20px) - Subtítulos secundários." />
          <Font variant="h5" text="Heading 5 (16px/18px) - Ênfase estrutural." />
          <Font variant="body" text="Body (16px) - Texto padrão de leitura para todo o sistema." />
          <Font variant="description" text="Description (14px) - Textos de apoio e dicas." />
          <Font variant="auxiliary" text="Auxiliary (10px) - Metadados e labels secundários." />
          <Font variant="sub-tiny" text="Sub-tiny (10px uppercase) - Labels de cabeçalho e indicadores." />
        </Stack>
      </Box>
    </RegistrySection>
  )
}
