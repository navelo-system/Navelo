"use client"

import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { BentoModulesGrid } from "@/components/store/intermediary/BentoModulesGrid"
import { AuditLogTable } from "@/components/store/intermediary/AuditLogTable"
import { LayoutDashboard, History } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export function DashboardSection() {
  const d = UI_STRINGS.admin.dashboard

  return (
    <>
      <RegistrySection
        icon={LayoutDashboard}
        title={d.title}
        description={d.description}
      >
        <BentoModulesGrid />
      </RegistrySection>

      <RegistrySection
        title={d.activitiesTitle}
        description={d.activitiesDescription}
        icon={History}
      >
        <AuditLogTable />
      </RegistrySection>
    </>
  )
}
