"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { ShieldCheck, LogOut, Cloud, CloudOff, Eye, EyeOff } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

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

function AdminHeaderLogo({ logoUrl }: { logoUrl: string }) {
  const h = UI_STRINGS.admin.header
  if (logoUrl) {
    return <Box as="img" src={logoUrl} alt="Logo" h="h-8" w="auto" objectFit="contain" />
  }
  return (
    <Stack direction="row" align="center" gap={2.5} h="h-8">
      <CircularIcon icon={ShieldCheck} size={20} variant="secondary" />
      <Stack gap={0}>
        <Font variant="body-bold" color="brand-secondary" text={h.title} />
        <Font variant="sub-tiny" color="brand-secondary" text={h.subtitle} />
      </Stack>
    </Stack>
  )
}

function AdminHeaderActions({
  isSynced,
  hideValues,
  onToggleHideValues,
  onLogout,
}: {
  isSynced: boolean
  hideValues: boolean
  onToggleHideValues: () => void
  onLogout: () => void
}) {
  const h = UI_STRINGS.admin.header
  return (
    <Stack direction="row" align="center" justify="center" mobileJustify="end" w="full" gap={5}>
      <Box>
        <Button
          variant={isSynced ? "primary-pill-icon" : "danger-pill-icon"}
          icon={isSynced ? Cloud : CloudOff}
          title={isSynced ? h.syncedTitle : h.outOfSyncTitle}
        />
      </Box>
      <Stack direction="row" align="center" gap={2.5}>
        <Button
          variant="secondary-pill-icon"
          icon={hideValues ? EyeOff : Eye}
          onClick={onToggleHideValues}
          title={h.toggleValuesTitle}
        />
        <Button
          variant="secondary-pill-icon"
          icon={LogOut}
          onClick={onLogout}
          title={h.logoutTitle}
        />
      </Stack>
    </Stack>
  )
}

export const AdminHeaderSection: React.FC = () => {
  const [logoUrl] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("logo-data") || ""
    }
    return ""
  })

  const [isSynced, setIsSynced] = React.useState(true)
  const [hideValues, setHideValues] = React.useState(false)
  const { isDesktop, isBottomVisible } = useHeaderScroll()

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsSynced(false)
      setTimeout(() => setIsSynced(true), 2000)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPrimary = localStorage.getItem("brand-primary")
      const storedSecondary = localStorage.getItem("brand-secondary")
      if (storedPrimary) document.documentElement.style.setProperty("--brand-primary", storedPrimary)
      if (storedSecondary) document.documentElement.style.setProperty("--brand-secondary", storedSecondary)
    }
  }, [])

  return (
    <>
      <Box padding={5} bg="bg-brand-primary" w="full" display="flex" direction="col">
        <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" w="full" gap={isDesktop || isBottomVisible ? 5 : 0}>
          <Stack gap={1} align="center" mobileAlign="start">
            <AdminHeaderLogo logoUrl={logoUrl} />
          </Stack>
          <Box
            w="full"
            transition="all"
            overflow="hidden"
            maxH={isDesktop || isBottomVisible ? "96" : "0"}
            opacity={isDesktop || isBottomVisible ? "100" : "0"}
          >
            <AdminHeaderActions
              isSynced={isSynced}
              hideValues={hideValues}
              onToggleHideValues={() => setHideValues((prev) => !prev)}
              onLogout={() => { window.location.href = "/admin/login" }}
            />
          </Box>
        </Stack>
      </Box>
      <Box h="h-[2px]" w="full" bg="bg-brand-primary/10" />
    </>
  )
}
