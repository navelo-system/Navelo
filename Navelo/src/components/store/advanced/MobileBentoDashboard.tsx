"use client"

import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Grid } from "../base/Grid"
import { Font } from "../base/Font"
import { Button } from "../base/Button"
import { Icon } from "../base/Icon"
import { CircularIcon } from "../intermediary/CircularIcon"
import { Alert } from "../intermediary/Alert"
import { 
  ShoppingBag, 
  LayoutGrid, 
  Bike, 
  Package, 
  Tag, 
  Users, 
  TrendingUp, 
  Settings, 
  Eye, 
  EyeOff, 
  LogOut, 
  WifiOff,
  CloudLightning
} from "lucide-react"

export const MobileBentoDashboard: React.FC = () => {
  const [hideValues, setHideValues] = React.useState<boolean>(true)
  const [isSyncing, setIsSyncing] = React.useState<boolean>(false)

  const toggleHideValues = () => {
    setHideValues(prev => !prev)
  }

  const handleSyncClick = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      alert("Terminal sincronizado com a nuvem!")
    }, 1200)
  }

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
          <Box padding={2.5} bg="bg-surface" radius="default">
            <Stack gap={2.5}>
              <Stack direction="row" align="center" justify="between" gap={1}>
                <Font variant="description" text="Vendas" />
                <Button 
                  variant="outline-icon-xs" 
                  icon={hideValues ? EyeOff : Eye} 
                  onClick={toggleHideValues} 
                />
              </Stack>
              <Font 
                variant="body-bold" 
                text={hideValues ? "R$ *****" : "R$ 1.250,00"} 
              />
              <Font variant="sub-tiny" text="Hoje — 0 vendas realizadas" />
            </Stack>
          </Box>

          <Box padding={2.5} bg="bg-surface" radius="default">
            <Stack gap={2.5}>
              <Stack direction="row" align="center" justify="between" gap={1}>
                <Font variant="description" text="Totais em caixa" />
                <Button 
                  variant="outline-icon-xs" 
                  icon={hideValues ? EyeOff : Eye} 
                  onClick={toggleHideValues} 
                />
              </Stack>
              <Font 
                variant="body-bold" 
                text={hideValues ? "R$ *****" : "R$ 450,00"} 
              />
              <Font variant="sub-tiny" text="02/05/26 13:59" />
            </Stack>
          </Box>
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
