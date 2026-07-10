"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { Avatar } from "@/components/store/base/Avatar"
import { Cloud, Eye, EyeOff, LogOut, Store, AlertTriangle } from "lucide-react"

interface PdvHeaderSectionProps {
  currentView: string
  onNavigate: (view: string) => void
  operatorName?: string
  isSynced?: boolean
  onLogout: () => void
}

const useHeaderState = () => {
  const [logoUrl] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("logo-data") || ""
    }
    return ""
  })
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

  return { logoUrl, hideValues, setHideValues }
}

export const PdvHeaderSection: React.FC<PdvHeaderSectionProps> = ({
  onNavigate,
  isSynced = true,
  onLogout
}) => {
  const { logoUrl, hideValues, setHideValues } = useHeaderState()

  return (
    <Stack gap={0} w="full">
      <Box
        paddingY={5}
        paddingX={5}
        bg="bg-brand-primary"
        w="full"
        display="flex"
      >
        <Stack
          direction="row"
          align="center"
          justify="between"
          w="full"
          gap={2.5}
        >
          <Box shrink="0">
            <Box as="button" onClick={() => onNavigate("dashboard")} shrink="0" display="flex">
              <Stack direction="row" align="center" gap={2.5}>
                {logoUrl ? (
                  <Avatar image={logoUrl} fallback="Logo" />
                ) : (
                  <Icon icon={Store} size={32} color="brand-secondary" />
                )}
                <Stack gap={0} align="start">
                  <Font variant="body-bold" color="white" text="Navelo" />
                  <Font variant="sub-tiny" color="brand-secondary" text="sistema PDV" />
                </Stack>
              </Stack>
            </Box>
          </Box>

          {/* Lado Direito: Status de Sincronia, Olho e Logout */}
          <Box shrink="0">
            <Stack direction="row" align="center" justify="end" gap={2.5}>
              <Button
                variant={isSynced ? "success-pill-icon" : "danger-pill-icon"}
                icon={isSynced ? Cloud : AlertTriangle}
                title={isSynced ? "Sincronizado" : "Erro na sincronização"}
              />
              <Button
                variant={hideValues ? "danger-pill-icon" : "success-pill-icon"}
                icon={hideValues ? EyeOff : Eye}
                onClick={() => {
                  const next = !hideValues
                  setHideValues(next)
                  if (typeof window !== "undefined") {
                    localStorage.setItem("hide-values", String(next))
                    window.dispatchEvent(new Event("visibility-toggled"))
                  }
                }}
                title="Ocultar/Mostrar Valores"
              />
              <Button
                variant="danger-pill-icon"
                icon={LogOut}
                onClick={onLogout}
                title="Sair"
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Box h="h-[2px]" bg="bg-border" w="full" opacity="25" />
    </Stack>
  )
}
