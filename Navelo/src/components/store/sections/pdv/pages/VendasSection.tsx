"use client"

import * as React from "react"
import { NegociacoesSection } from "./NegociacoesSection"
import { UI_STRINGS } from "@/constants/strings"

export interface VendasSectionProps {
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

export const VendasSection: React.FC<VendasSectionProps> = ({
  onBackToDashboard,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  return (
    <NegociacoesSection
      title={UI_STRINGS.dashboard.salesKpi}
      onBack={onBackToDashboard}
      setCustomBack={setCustomBack}
      setCustomTitle={setCustomTitle}
      setCustomActions={setCustomActions}
    />
  )
}

