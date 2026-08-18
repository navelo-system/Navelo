"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Cloud, Eye, EyeOff, LogOut, AlertTriangle } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

interface PdvHeaderSectionProps {
  currentView: string
  onNavigate: (view: string) => void
  companyName?: string
  operatorName?: string
  isSynced?: boolean
  statusText?: string
  onSyncClick?: () => void
  onLogout: () => void
}

const useHeaderState = () => {
  const [hideValues, setHideValues] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hide-values") === "true"
    }
    return false
  })

  React.useEffect(() => {
    const handler = () => {
      setHideValues(localStorage.getItem("hide-values") === "true")
    }
    window.addEventListener("visibility-toggled", handler)
    return () => window.removeEventListener("visibility-toggled", handler)
  }, [])

  return { hideValues, setHideValues }
}

export const PdvHeaderSection: React.FC<PdvHeaderSectionProps> = ({
  onNavigate,
  companyName = "NAVELO PDV",
  operatorName = "Caixa 01",
  isSynced = true,
  statusText,
  onSyncClick,
  onLogout,
}) => {
  const { hideValues, setHideValues } = useHeaderState()
  const pdvHeader = UI_STRINGS.pdv.header

  return (
    <Stack gap={0} w="full">
      <Box paddingX={5} paddingY={2.5} bg="bg-brand-primary" w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
          {/* Lado Esquerdo: Identificação da Empresa e Operador */}
          <Box shrink="0">
            <Stack gap={1} align="start">
              <Box cursor="pointer" onClick={() => onNavigate("dashboard")} shrink="0" display="flex">
                <Font variant="h3" as="h1" color="brand-secondary" text={companyName} />
              </Box>
              <Button
                variant="ghost-secondary"
                label={operatorName}
                icon={LogOut}
                onClick={onLogout}
              />
            </Stack>
          </Box>

          {/* Lado Direito: Status de Sincronia e Olho */}
          <Box shrink="0">
            <Stack direction="row" align="center" justify="end" gap={2.5}>
              <Button
                variant={isSynced ? "secondary-pill-icon" : "outline-pill-icon"}
                icon={isSynced ? Cloud : AlertTriangle}
                title={statusText || (isSynced ? pdvHeader.syncedStatus : pdvHeader.localModeStatus)}
                onClick={onSyncClick}
              />
              <Button
                variant={hideValues ? "outline-pill-icon" : "secondary-pill-icon"}
                icon={hideValues ? EyeOff : Eye}
                onClick={() => {
                  const next = !hideValues
                  setHideValues(next)
                  if (typeof window !== "undefined") {
                    localStorage.setItem("hide-values", String(next))
                    window.dispatchEvent(new Event("visibility-toggled"))
                  }
                }}
                title={pdvHeader.toggleVisibility}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Box h="h-[2px]" bg="bg-border" w="full" opacity="25" />
    </Stack>
  )
}
