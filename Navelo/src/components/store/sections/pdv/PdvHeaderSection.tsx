"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Button } from "../../base/Button"
import { Cloud, CloudOff, Eye, EyeOff, LogOut, Store, AlertTriangle } from "lucide-react"
import { CircularIcon } from "../../intermediary/CircularIcon"

interface PdvHeaderSectionProps {
  currentView: string
  onNavigate: (view: string) => void
  operatorName?: string
  isSynced?: boolean
  onLogout: () => void
}

const useHeaderScroll = () => {
  const [isBottomVisible, setIsBottomVisible] = React.useState(true)
  const [isDesktop, setIsDesktop] = React.useState(true)

  React.useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768)
    checkDesktop()
    window.addEventListener("resize", checkDesktop)
    return () => window.removeEventListener("resize", checkDesktop)
  }, [])

  React.useEffect(() => {
    if (isDesktop) return
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | Document
      const currentScrollY = target === document ? window.scrollY : (target as HTMLElement).scrollTop
      if (currentScrollY === undefined) return
      if (currentScrollY > 50) {
        setIsBottomVisible(false)
      } else if (currentScrollY <= 10) {
        setIsBottomVisible(true)
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true, capture: true })
    return () => window.removeEventListener("scroll", handleScroll, { capture: true } as EventListenerOptions)
  }, [isDesktop])

  return { isDesktop, isBottomVisible }
}

export const PdvHeaderSection: React.FC<PdvHeaderSectionProps> = ({
  onNavigate,
  isSynced = true,
  onLogout
}) => {
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
  const { isDesktop, isBottomVisible } = useHeaderScroll()

  return (
    <Stack gap={0} w="full">
      <Box
        paddingY={5}
        paddingX={5}
        bg="bg-brand-primary"
        w="full"
        display="flex"
        direction="col"
      >
        <Stack
          direction="col"
          mobileDirection="row"
          align="stretch"
          mobileAlign="center"
          justify="between"
          w="full"
          gap={isDesktop || isBottomVisible ? 5 : 0}
        >
          <Box shrink="0">
            <Stack gap={1} align="center" mobileAlign="start">
              <Box as="button" onClick={() => onNavigate("dashboard")} shrink="0" display="flex">
                <Stack direction="row" align="center" gap={2.5}>
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
                  ) : (
                    <Store className="h-8 w-8 text-brand-secondary" />
                  )}
                  <Stack gap={0} align="start">
                    <Font variant="body-bold" color="white" text="Navelo" />
                    <Font variant="sub-tiny" color="brand-secondary" text="sistema PDV" />
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* Lado Direito: Status de Sincronia, Olho e Logout */}
          <Box
            w="full"
            transition="all"
            overflow="hidden"
            maxH={isDesktop || isBottomVisible ? "96" : "0"}
            opacity={isDesktop || isBottomVisible ? "100" : "0"}
          >
            <Stack direction="row" align="center" justify="center" mobileJustify="end" w="full" gap={2.5}>
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
