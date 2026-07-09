"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Button } from "../../base/Button"
import { Cloud, CloudOff, Eye, EyeOff, LogOut, Store } from "lucide-react"
import { CircularIcon } from "../../intermediary/CircularIcon"

interface PdvHeaderSectionProps {
  currentView: string
  onNavigate: (view: string) => void
  operatorName?: string
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
  onLogout
}) => {
  const [logoUrl] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("logo-data") || ""
    }
    return ""
  })
  const [isSynced, setIsSynced] = React.useState(true)
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

  // Simula alternância autônoma de sincronização conforme o painel admin
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsSynced((prev) => !prev)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

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
                {logoUrl ? (
                  <Box as="img" src={logoUrl} alt="Logo" h="h-8" w="auto" objectFit="contain" shrink="0" />
                ) : (
                  <Stack direction="row" align="center" gap={2.5}>
                    <CircularIcon icon={Store} size={20} variant="secondary" />
                    <Stack gap={0} w="fit-content" align="start">
                      <Font variant="body-bold" color="brand-secondary" text="Navelo PDV" />
                      <Font variant="sub-tiny" color="brand-secondary" text="Terminal de Vendas" />
                    </Stack>
                  </Stack>
                )}
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
            <Stack direction="row" align="center" justify="center" mobileJustify="end" w="full" gap={5}>
              {/* Indicador de sincronização — visual apenas, sem interação */}
              <Box>
                <Button
                  variant={isSynced ? "outline-success-pill-icon" : "outline-danger-pill-icon"}
                  icon={isSynced ? Cloud : CloudOff}
                  title={isSynced ? "Sincronizado" : "Fora de sincronização"}
                />
              </Box>

              <Stack direction="row" align="center" gap={2.5}>
                 <Button
                  variant={hideValues ? "outline-danger-pill-icon" : "outline-success-pill-icon"}
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
                  variant="outline-danger-pill-icon"
                  icon={LogOut}
                  onClick={onLogout}
                  title="Sair"
                />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
      <Box h="h-[2px]" bg="bg-border" w="full" opacity="25" />
    </Stack>
  )
}
