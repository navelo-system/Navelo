"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Icon } from "@/components/store/base/Icon"
import { Font } from "@/components/store/base/Font"
import { ROLE_ALLOWED_VIEWS } from "@/lib/permissions"
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

import { UI_STRINGS } from "@/constants/strings"

export interface BentoPDVModulesGridProps {
  onNavigate: (view: string) => void
  userRole?: string
}

const ALL_MODULES = [
  { id: "caixa", title: UI_STRINGS.modules.caixa, icon: ShoppingBag },
  { id: "comandas", title: UI_STRINGS.modules.comandas, icon: Receipt },
  { id: "delivery", title: UI_STRINGS.modules.delivery, icon: Bike },
  { id: "estoque", title: UI_STRINGS.modules.estoque, icon: Package },
  { id: "produtos", title: UI_STRINGS.modules.produtos, icon: Layers },
  { id: "clientes", title: UI_STRINGS.modules.clientes, icon: Users },
  { id: "relatorios", title: UI_STRINGS.modules.relatorios, icon: BarChart3 },
  { id: "configuracoes", title: UI_STRINGS.modules.config, icon: Settings },
]

export const BentoPDVModulesGrid: React.FC<BentoPDVModulesGridProps> = ({ onNavigate, userRole }) => {
  const allowedViews = userRole ? (ROLE_ALLOWED_VIEWS[userRole] || []) : ALL_MODULES.map(m => m.id)
  const modules = ALL_MODULES.filter(m => allowedViews.includes(m.id))

  return (
    <Stack direction="row" wrap={true} gap={5} justify="center" align="start" w="full">
      {modules.map((m) => (
        <Stack key={m.id} gap={2.5} align="center" justify="center" w="w-[72px] md:w-20">
          <Box
            onClick={() => onNavigate(m.id)}
            bg="bg-white"
            radius="lg"
            cursor="pointer"
            hoverBg="secondary/10"
            interactive
            display="flex"
            w="w-16 md:w-20"
            h="h-16 md:h-20"
            direction="col"
            align="center"
            justify="center"
          >
            <Icon icon={m.icon} size={28} color="brand-secondary" />
          </Box>
          <Font variant="body" text={m.title} align="center" />
        </Stack>
      ))}
    </Stack>
  )
}

