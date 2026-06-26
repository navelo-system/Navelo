import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Grid } from "@/components/store/base/Grid"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Paintbrush } from "lucide-react"

export const ColorsSection: React.FC = () => {
  return (
    <RegistrySection
      title="Paleta de Cores"
      description="Sistema principal de cores semânticas."
      icon={Paintbrush}
    >
      <Grid cols={3} gap={5}>
        <Box padding={5} bg="bg-brand-primary" radius="default">
          <Font variant="body-semibold" color="white" text="Brand Primary" />
        </Box>
        <Box padding={5} bg="bg-emerald-500" radius="default">
          <Font variant="body-semibold" color="white" text="Success (Emerald)" />
        </Box>
        <Box padding={5} bg="bg-red-500" radius="default">
          <Font variant="body-semibold" color="white" text="Danger (Red)" />
        </Box>
        <Box padding={5} bg="bg-brand-secondary" radius="default">
          <Font variant="body-semibold" color="white" text="Brand Secondary" />
        </Box>
        <Box padding={5} bg="bg-zinc-100" radius="default">
          <Font variant="body-semibold" color="foreground" text="Surface Muted" />
        </Box>
        <Box padding={5} bg="bg-white" border borderColor="border-zinc-200" radius="default">
          <Font variant="body-semibold" color="foreground" text="Surface Background" />
        </Box>
      </Grid>
    </RegistrySection>
  )
}
