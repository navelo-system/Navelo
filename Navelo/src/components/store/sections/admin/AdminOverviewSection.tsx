import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { KpiCard } from "@/components/store/intermediary/KpiCard"
import { BarChart3 } from "lucide-react"
import { TenantListTable, TenantListRow } from "@/components/store/intermediary/TenantListTable"

const MOCK_TENANTS: TenantListRow[] = [
  { id: "1", corporateName: "Lanchonete Bom Sabor LTDA", tradingName: "Lanchonete Bom Sabor", cnpj: "12.345.678/0001-99", subscriptionId: "plan-002", isActive: true, planName: "Pro", monthlyFee: 149.90 },
  { id: "2", corporateName: "Restaurante Gourmet SA", tradingName: "Restaurante Gourmet", cnpj: "98.765.432/0001-00", subscriptionId: "plan-003", isActive: true, planName: "Enterprise", monthlyFee: 499.90 },
  { id: "3", corporateName: "Padaria Delícia ME", tradingName: "Padaria Delícia", cnpj: "45.678.901/0001-22", subscriptionId: "plan-001", isActive: false, planName: "Free", monthlyFee: 0 },
]

export const AdminOverviewSection: React.FC = () => {
  const [hideValues, setHideValues] = React.useState<boolean>(false)
  const toggleHideValues = () => setHideValues(prev => !prev)

  return (
    <RegistrySection
      title="Métricas da Plataforma"
      description="Visão consolidada dos tenants e faturamento global do SaaS."
      icon={BarChart3}
    >
      <Stack gap={12.5}>
        <Grid cols={3} gap={5}>
          <KpiCard
            title="Total de Locatários (Tenants)"
            value="42 Empresas"
            subtitle="6 novos este mês"
            hideValues={hideValues}
            onToggleHide={toggleHideValues}
          />
          <KpiCard
            title="Faturamento Global (MRR)"
            value="R$ 18.420,00"
            subtitle="Crescimento de +12.4%"
            hideValues={hideValues}
            onToggleHide={toggleHideValues}
          />
          <KpiCard
            title="Taxa de Churn (Mensal)"
            value="2.1%"
            subtitle="Dentro da meta (< 5%)"
            hideValues={hideValues}
            onToggleHide={toggleHideValues}
          />
        </Grid>

        <Stack gap={5}>
          <TenantListTable tenants={MOCK_TENANTS} />
        </Stack>
      </Stack>
    </RegistrySection>
  )
}
