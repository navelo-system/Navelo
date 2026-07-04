"use client"

import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Icon } from "../base/Icon"
import { Button } from "../base/Button"
import { SettingsModal } from "./SettingsModal"
import { Eye, Cloud, LogOut, Settings, Store } from "lucide-react"


const useHeaderScroll = () => {
  const [isMobileButtonsVisible, setIsMobileButtonsVisible] = React.useState(true)
  const [isDesktop, setIsDesktop] = React.useState(true)

  React.useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768)
    checkDesktop()
    window.addEventListener("resize", checkDesktop)
    return () => window.removeEventListener("resize", checkDesktop)
  }, [])

  React.useEffect(() => {
    if (isDesktop) return
    let lastScrollY = 0
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement | Document
      const currentScrollY = target === document ? window.scrollY : (target as HTMLElement).scrollTop
      
      if (currentScrollY === undefined) return

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsMobileButtonsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setIsMobileButtonsVisible(true)
      }
      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true, capture: true })
    return () => window.removeEventListener("scroll", handleScroll, { capture: true } as EventListenerOptions)
  }, [isDesktop])

  return { isDesktop, isMobileButtonsVisible }
}

export const Header: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [logoUrl, setLogoUrl] = React.useState<string>("")
  const { isDesktop, isMobileButtonsVisible } = useHeaderScroll()

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLogo = localStorage.getItem("logo-data")

      if (storedLogo) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLogoUrl(storedLogo)
      }
    }
  }, [])

  return (
    <Box paddingY={5} paddingX={5} bg="bg-brand-primary" w="full" borderBottom borderColor="border-brand-primary/10" display="flex" direction="col">
      <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" w="full" gap={5}>
        {/* Left content: Logo aligned to the left/center */}
        <Stack gap={1} align="center" mobileAlign="start">
          {logoUrl ? (
            <Box as="img" src={logoUrl} alt="Logo" h="h-8" w="auto" objectFit="contain" />
          ) : (
            <Stack direction="row" align="center" gap={2.5} h="h-8">
              <Icon icon={Store} size={32} color="brand-secondary" />
              <Font variant="body-bold" color="brand-secondary" text="Sua Logo" />
            </Stack>
          )}
        </Stack>

        {/* Right content: Icons and logout stacked on mobile */}
        <Stack 
          direction="col" 
          mobileDirection="row" 
          align="stretch" 
          mobileAlign="center" 
          gap={5}
          style={isDesktop ? {} : {
            maxHeight: isMobileButtonsVisible ? "200px" : "0px",
            opacity: isMobileButtonsVisible ? 1 : 0,
            overflow: "hidden",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            marginTop: isMobileButtonsVisible ? "0px" : "-20px" // compensate for parent gap={5}
          }}
        >
          <Stack direction="row" align="center" justify="center" gap={5}>
            <Button variant="outline-secondary-pill-icon" icon={Settings} onClick={() => setIsSettingsOpen(true)} />
            <Button variant="outline-secondary-pill-icon" icon={Eye} />
            <Button variant="outline-secondary-pill-icon" icon={Cloud} />
          </Stack>
          <Button variant="outline-secondary-sm" label="Administrador" icon={LogOut} justify="center" />
        </Stack>
      </Stack>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onSave={(newLogo) => setLogoUrl(newLogo)}
      />
    </Box>
  )
}
