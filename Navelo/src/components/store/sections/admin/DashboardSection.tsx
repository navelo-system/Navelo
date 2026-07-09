"use client"

import * as React from "react"
import { RegistrySection } from "../../advanced/RegistrySection"
import { BentoModulesGrid } from "../../intermediary/BentoModulesGrid"
import { AuditLogTable } from "../../intermediary/AuditLogTable"
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
