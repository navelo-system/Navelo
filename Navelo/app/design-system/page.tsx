"use client"

import * as React from "react"
import { RegistryMain } from "@/components/store/advanced/RegistryMain"
import { Component } from "lucide-react"

// Import Sections
import { ColorsSection } from "@/components/store/sections/design-system/ColorsSection"
import { AuthSection } from "@/components/store/sections/design-system/AuthSection"
import { InputsSection } from "@/components/store/sections/design-system/InputsSection"
import { TypographySection } from "@/components/store/sections/design-system/TypographySection"
import { ButtonsSection } from "@/components/store/sections/design-system/ButtonsSection"
import { SemanticActionsSection } from "@/components/store/sections/design-system/SemanticActionsSection"
import { BadgesSection } from "@/components/store/sections/design-system/BadgesSection"
import { CardsSection } from "@/components/store/sections/design-system/CardsSection"
import { SwitchesSection } from "@/components/store/sections/design-system/SwitchesSection"
import { AlertsSection } from "@/components/store/sections/design-system/AlertsSection"
import { TableSection } from "@/components/store/sections/design-system/TableSection"
import { TabsSection } from "@/components/store/sections/design-system/TabsSection"
import { PosSection } from "@/components/store/sections/design-system/PosSection"
import { KanbanSection } from "@/components/store/sections/design-system/KanbanSection"
import { OperationalModulesSection } from "@/components/store/sections/design-system/OperationalModulesSection"
import { AdvancedCheckoutSection } from "@/components/store/sections/design-system/AdvancedCheckoutSection"
import { MobileDashboardSection } from "@/components/store/sections/design-system/MobileDashboardSection"

export default function DesignSystemPage() {
  return (
    <RegistryMain
      title="Design System"
      subtitle="Catálogo oficial de componentes da arquitetura Navelo."
      superiorTitle="STORE COMPONENTS"
      icon={Component}
    >
      <ColorsSection />
      <AuthSection />
      <InputsSection />
      <TypographySection />
      <ButtonsSection />
      <SemanticActionsSection />
      <BadgesSection />
      <CardsSection />
      <SwitchesSection />
      <AlertsSection />
      <TableSection />
      <TabsSection />
      <PosSection />
      <KanbanSection />
      <OperationalModulesSection />
      <AdvancedCheckoutSection />
      <MobileDashboardSection />
    </RegistryMain>
  )
}
