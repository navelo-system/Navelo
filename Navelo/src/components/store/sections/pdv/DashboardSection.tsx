"use client"


import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Grid } from "../../base/Grid"
import { Font } from "../../base/Font"
import { Icon } from "../../base/Icon"
import { Button } from "../../base/Button"
import { KpiCard } from "../../../store/intermediary/KpiCard"
import { BentoPDVModulesGrid } from "../../advanced/BentoPDVModulesGrid"
import {
  AlertTriangle,
  X,
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
      <Grid cols={3} gap={5}>
        <KpiCard
          title="Vendas"
          value="R$ 0,00"
          subtitle="Hoje - 0 vendas realizadas"
          hideValues={hideValues}
          icon={TrendingUp}
        />
        <KpiCard
          title="Totais em caixa"
          value="R$ 45,00"
          subtitle="16/06/26 16:00"
          hideValues={hideValues}
          icon={Coins}
        />
        <KpiCard
          title="Total a receber"
          value="R$ 0,00"
          subtitle="0 parcelas em aberto"
          hideValues={hideValues}
          icon={ArrowUpRight}
        />
      </Grid>

      {/* Seção 2: Bento Grid de Módulos */}
      <BentoPDVModulesGrid onNavigate={onNavigate} />

      {/* Seção 3: Alertas / Pendências Fiscais */}
      {isAlertVisible && (
        <Box padding={5} bg="bg-brand-warning/10" border={true} borderColor="border-brand-warning" radius="default">
          {/* Desktop: row (texto à esq, botões à dir) | Mobile: col (botões abaixo) */}
          <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" justify="between" gap={5}>
            {/* Texto */}
            <Stack direction="row" gap={5} align="start" flex="1">
              <Box shrink="0">
                <Icon icon={AlertTriangle} color="warning" size={20} />
              </Box>
              <Stack gap={1}>
                <Font variant="body-semibold" color="warning" text="Pendência Fiscal Detectada" />
                <Font variant="description" color="warning" text="Existem notas fiscais em contingência aguardando sincronização com a SEFAZ." />
              </Stack>
            </Stack>
            {/* Botões */}
            <Stack direction="row" gap={2.5} align="center">
              <Button variant="outline-secondary-sm" label="Configurar" onClick={() => onNavigate("configuracoes")} fullWidth />
              <Box shrink="0">
                <Button variant="outline-secondary-pill-icon" icon={X} onClick={() => setIsAlertVisible(false)} />
              </Box>
            </Stack>
          </Stack>
        </Box>
      )}
    </Stack>
  )
}
