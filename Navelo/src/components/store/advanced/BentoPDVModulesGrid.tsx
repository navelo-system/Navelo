"use client"

import * as React from "react"
import { Grid } from "../base/Grid"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Icon } from "../base/Icon"
import { Font } from "../base/Font"
import {
  ShoppingBag,
  Receipt,
  Bike,
  Package,
  Layers,
  Users,
  BarChart3,
  Settings
} from "lucide-react"

export interface BentoPDVModulesGridProps {
  onNavigate: (view: string) => void
}

export const BentoPDVModulesGrid: React.FC<BentoPDVModulesGridProps> = ({ onNavigate }) => {
  const modules = [
    { id: "caixa", title: "Caixa", description: "Vendas e frente de caixa", icon: ShoppingBag },
    { id: "comandas", title: "Comandas", description: "Controle de consumo local", icon: Receipt },
    { id: "delivery", title: "Delivery", description: "Entregas e pedidos online", icon: Bike },
    { id: "estoque", title: "Estoque", description: "Balanço e notas fiscais", icon: Package },
    { id: "produtos", title: "Produtos", description: "Gestão do catálogo e fiscal", icon: Layers },
    { id: "clientes", title: "Clientes", description: "Cadastro e endereços", icon: Users },
    { id: "relatorios", title: "Relatórios", description: "Visão geral de faturamento", icon: BarChart3 },
    { id: "configuracoes", title: "Configurações", description: "Preferências do sistema", icon: Settings },
  ]

  return (
    <Grid cols={4} gap={5}>
      {modules.map((m) => (
        <Box
          key={m.id}
          as="button"
          onClick={() => onNavigate(m.id)}
          bg="bg-surface"
          padding={5}
          radius="default"
          border={true}
          borderColor="border-border"
          w="full"
          h="full"
          cursor="pointer"
          hoverBg="surface-sunken"
        >
          <Stack gap={2.5} align="start" justify="start">
            <Box w="w-10" h="h-10" radius="default" bg="bg-brand-secondary">
              <Stack w="full" h="full" align="center" justify="center">
                <Icon icon={m.icon} size={20} color="white" />
              </Stack>
            </Box>
            <Stack gap={1} align="start">
              <Font variant="body-bold" text={m.title} />
              <Font variant="auxiliary" color="muted" text={m.description} />
            </Stack>
          </Stack>
        </Box>
      ))}
    </Grid>
  )
}
