"use client"


import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Warning } from "@/components/store/base/Warning"
import { KpiCard } from "@/components/store/intermediary/KpiCard"
import { BentoPDVModulesGrid } from "@/components/store/advanced/BentoPDVModulesGrid"
import { useTenant } from "@/lib/context/TenantContext"
import { ROLE_SHOW_KPIS } from "@/lib/permissions"
import {
  AlertTriangle
} from "lucide-react"

interface DashboardSectionProps {
  onNavigate: (view: string) => void
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({ onNavigate }) => {
  const tenantCtx = useTenant()
  const userRole = tenantCtx?.currentUser?.role
  const showKpis = userRole ? (ROLE_SHOW_KPIS[userRole] ?? false) : true

  const [hideValues, setHideValues] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hide-values") === "true"
    }
    return false
  })

  React.useEffect(() => {
    const handler = () => {
      setHideValues(localStorage.getItem("hide-values") === "true")
    }
    window.addEventListener("visibility-toggled", handler)
    return () => window.removeEventListener("visibility-toggled", handler)
  }, [])

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <Stack gap={12} w="full">
        {/* Seção 1: Indicadores (apenas para ADMIN/MANAGER) */}
        {showKpis && (
          <Grid cols={2} gap={5} mobileCols={2}>
            <KpiCard
              title="Vendas"
              value="R$ 0,00"
              subtitle="Hoje - 0 vendas realizadas"
              hideValues={hideValues}
              onClick={() => onNavigate("vendas")}
            />
            <KpiCard
              title="Totais em caixa"
              value="R$ 45,00"
              subtitle="16/06/26 16:00"
              hideValues={hideValues}
              onClick={() => onNavigate("totais-em-caixa")}
            />
            <KpiCard
              title="Total a receber"
              value="R$ 0,00"
              subtitle="0 parcelas em aberto"
              hideValues={hideValues}
              onClick={() => onNavigate("contas-a-receber")}
            />
            <KpiCard
              title="Conta Digital"
              value="R$ 0,00"
              subtitle="Saldo disponível"
              hideValues={hideValues}
              onClick={() => onNavigate("conta-digital")}
            />
          </Grid>
        )}

        {/* Seção 2: Bento Grid de Módulos (filtrado por role) */}
        <BentoPDVModulesGrid onNavigate={onNavigate} userRole={userRole} />

        {/* Seção 3: Alertas / Pendências Fiscais (apenas para ADMIN/MANAGER) */}
        {showKpis && (
          <Warning
            variant="danger"
            title="Pendência Fiscal Detectada"
            text="Existem notas fiscais em contingência aguardando sincronização com a SEFAZ."
            icon={AlertTriangle}
            textButton="Configurar"
            onClick={() => onNavigate("configuracoes")}
          />
        )}
      </Stack>
    </Box>
  )
}

