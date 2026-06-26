import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Grid } from "@/components/store/base/Grid"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { Card } from "@/components/store/intermediary/Card"
import { LayoutTemplate } from "lucide-react"

export const CardsSection: React.FC = () => {
  return (
    <RegistrySection
      title="Cards e Dashboard Grids"
      description="Containers base para exibição de dados e blocos de informações."
      icon={LayoutTemplate}
    >
      <Grid cols={2} gap={5}>
        <Card title="Receita do Dia" subtitle="Total apurado no caixa 1">
          <Box paddingY={5}>
            <Font variant="h2" className="text-4xl text-brand-primary" text="R$ 2.450,00" />
          </Box>
        </Card>

        <Card title="Pedidos Pendentes" subtitle="Cozinha e Delivery">
          <Box paddingY={5}>
            <Font variant="h2" className="text-4xl text-brand-secondary" text="14" />
          </Box>
        </Card>
      </Grid>
    </RegistrySection>
  )
}
