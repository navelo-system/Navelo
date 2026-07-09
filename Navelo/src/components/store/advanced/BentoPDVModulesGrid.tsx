"use client"

import * as React from "react"
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
    { id: "caixa", title: "Caixa", icon: ShoppingBag },
    { id: "comandas", title: "Comandas", icon: Receipt },
    { id: "delivery", title: "Delivery", icon: Bike },
    { id: "estoque", title: "Estoque", icon: Package },
    { id: "produtos", title: "Produtos", icon: Layers },
    { id: "clientes", title: "Clientes", icon: Users },
    { id: "relatorios", title: "Relatórios", icon: BarChart3 },
    { id: "configuracoes", title: "Config", icon: Settings },
  ]

  return (
    <Stack direction="row" wrap={true} gap={5} justify="center" align="start" w="full">
      {modules.map((m) => (
        <Stack key={m.id} gap={2.5} align="center" justify="center" className="w-[72px] md:w-20">
          <Box
            as="button"
            onClick={() => onNavigate(m.id)}
            bg="bg-white"
            radius="lg"
            className="w-16 h-16 md:w-20 md:h-20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            cursor="pointer"
          >
            <Icon icon={m.icon} size={28} color="brand-secondary" />
          </Box>
          <Font variant="body-bold" text={m.title} align="center" />
        </Stack>
      ))}
    </Stack>
  )
}
