"use client"

import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Grid } from "../base/Grid"
import { Font } from "../base/Font"
import { CircularIcon } from "../intermediary/CircularIcon"
import { Alert } from "../intermediary/Alert"
import { KpiCard } from "../intermediary/KpiCard"
import { 
  ShoppingBag, 
  LayoutGrid, 
  Bike, 
  Package, 
  Tag, 
  Users, 
  TrendingUp, 
  Settings,
  Coins
} from "lucide-react"

export const MobileBentoDashboard: React.FC = () => {
  const [hideValues] = React.useState<boolean>(true)

  const menuItems = [
    { label: "Caixa", icon: ShoppingBag },
    { label: "Mesas", icon: LayoutGrid },
    { label: "Delivery", icon: Bike },
    { label: "Estoque", icon: Package },
    { label: "Produtos", icon: Tag },
    { label: "Clientes", icon: Users },
    { label: "Relatórios", icon: TrendingUp },
    { label: "Config", icon: Settings },
  ]

  return (
    <Box padding={0}>
      <Stack gap={5}>
        {/* KPI Cards com Máscara de Privacidade */}
        <Grid cols={2} gap={2.5}>
          <KpiCard 
            title="Vendas"
            value="R$ 1.250,00"
            subtitle="Hoje — 0 vendas realizadas"
            hideValues={hideValues}
            icon={TrendingUp}
          />
          <KpiCard 
            title="Totais em caixa"
            value="R$ 450,00"
            subtitle="02/05/26 13:59"
            hideValues={hideValues}
            icon={Coins}
          />
        </Grid>

        {/* Banner de Sincronização */}
        <Alert 
          variant="danger" 
          title="Erro na sincronização" 
          description="O terminal local não está conseguindo sincronizar com o banco central." 
        />

        {/* Bento Grid Menu de Atalhos */}
        <Stack gap={2.5}>
          <Font variant="body-semibold" text="Atalhos Rápidos" />
          <Grid cols={4} gap={2.5}>
            {menuItems.map((item, idx) => (
              <Box 
                key={idx} 
                padding={2.5} 
                bg="bg-surface" 
                radius="default" 
                hoverBg="primary/10"
                cursor="pointer"
              >
                <Stack gap={2.5} align="center" justify="center">
                  <CircularIcon icon={item.icon} size={20} />
                  <Font variant="body-sm-semibold" text={item.label} />
                </Stack>
              </Box>
            ))}
          </Grid>
        </Stack>

      </Stack>
    </Box>
  )
}
