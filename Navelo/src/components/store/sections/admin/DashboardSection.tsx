"use client"

import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { BentoModulesGrid } from "@/components/store/intermediary/BentoModulesGrid"
import { AuditLogTable } from "@/components/store/intermediary/AuditLogTable"
import { LayoutDashboard, History } from "lucide-react"

export function DashboardSection() {
  return (
    <>
      <RegistrySection
        icon={LayoutDashboard}
        title="Olá, Administrador 👋"
        description="Selecione o módulo que deseja acessar para gerenciar a plataforma."
      >
        <BentoModulesGrid />
      </RegistrySection>

      <RegistrySection
        title="Atividades Recentes"
        description="Últimos 5 logs registrados na plataforma."
        icon={History}
      >
        <AuditLogTable />
      </RegistrySection>
    </>
  )
}
