"use client"


import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Grid } from "../../base/Grid"
import { Warning } from "../../base/Warning"
import { KpiCard } from "../../../store/intermediary/KpiCard"
import { BentoPDVModulesGrid } from "../../advanced/BentoPDVModulesGrid"
import {
  AlertTriangle,
  TrendingUp,
  Coins,
  ArrowUpRight
} from "lucide-react"

interface DashboardSectionProps {
  onNavigate: (view: string) => void
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({ onNavigate }) => {
  const [isAlertVisible, setIsAlertVisible] = React.useState(true)
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
    <Stack gap={12} w="full">
      {/* Seção 1: Indicadores */}
      <Grid cols={3} gap={5} mobileCols={2}>
        <KpiCard
          title="Vendas"
          value="R$ 0,00"
          subtitle="Hoje - 0 vendas realizadas"
          hideValues={hideValues}
        />
        <KpiCard
          title="Totais em caixa"
          value="R$ 45,00"
          subtitle="16/06/26 16:00"
          hideValues={hideValues}
        />
        <Box className="col-span-2 md:col-span-1">
          <KpiCard
            title="Total a receber"
            value="R$ 0,00"
            subtitle="0 parcelas em aberto"
            hideValues={hideValues}
          />
        </Box>
      </Grid>

      {/* Seção 2: Bento Grid de Módulos */}
      <BentoPDVModulesGrid onNavigate={onNavigate} />

      {/* Seção 3: Alertas / Pendências Fiscais */}
      {isAlertVisible && (
        <Warning
          variant="danger"
          title="Pendência Fiscal Detectada"
          text="Existem notas fiscais em contingência aguardando sincronização com a SEFAZ."
          icon={AlertTriangle}
          textButton="Configurar"
          onClick={() => onNavigate("configuracoes")}
          onClose={() => setIsAlertVisible(false)}
        />
      )}
    </Stack>
  )
}
