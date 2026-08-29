"use client"

import * as React from "react"
import { DeliveryRatesScreen } from "@/components/store/advanced/DeliveryRatesScreen"

export interface TaxaEntregaSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

export const TaxaEntregaSection: React.FC<TaxaEntregaSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  return (
    <DeliveryRatesScreen
      onBack={onCancel}
      setCustomBack={setCustomBack}
      setCustomTitle={setCustomTitle}
      setCustomActions={setCustomActions}
    />
  )
}
