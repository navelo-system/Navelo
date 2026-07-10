"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Button } from "@/components/store/base/Button"
import { SettingsModal } from "./SettingsModal"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { LayoutDashboard, Settings, Users, LogOut, User } from "lucide-react"


export const Sidebar: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [logoUrl, setLogoUrl] = React.useState<string>("")

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLogo = localStorage.getItem("logo-data")

      if (storedLogo) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLogoUrl(storedLogo)
      }

      // Cleanup leftover customized colors from previous sessions to default to CSS
      const leftoverKeys = [
        "brand-success", "brand-warning", "brand-danger",
        "background", "surface", "surface-raised", "surface-sunken",
        "foreground", "text-secondary", "text-muted", "text-dim", "border"
      ]
      leftoverKeys.forEach(key => {
        localStorage.removeItem(key)
        document.documentElement.style.removeProperty(`--${key}`)
      })
    }
  }, [])

  return (
    <Box padding={5} w="w-64" h="screen" bg="bg-surface" display="hidden lg:flex" direction="col" justify="between">
      <Stack gap={12.5}>
        {/* Logo */}
        <Stack direction="row" align="center" gap={2.5}>
          {logoUrl ? (
            <Box as="img" src={logoUrl} alt="Logo" h="h-8" objectFit="contain" overflow="hidden" />
          ) : (
            <>
              <Box w="w-8" h="h-8" radius="default" bg="bg-brand-primary">
                <Stack w="full" h="full" align="center" justify="center">
                  <Icon icon={Settings} size={16} color="white" />
                </Stack>
              </Box>
              <Font variant="body-bold" text="Navelo PDV" />
            </>
          )}
        </Stack>

        <Stack gap={2.5}>
          <Button variant="primary" icon={LayoutDashboard} label="Design System" fullWidth justify="start" />
          <Button variant="outline" icon={Users} label="Componentes" fullWidth justify="start" />
          <Button variant="outline" icon={Settings} label="Configurações" fullWidth justify="start" />
        </Stack>
      </Stack>

      {/* User Profile */}
      <Stack gap={5}>
        {/* Horizontal Separator */}
        <Box w="full" h="h-[2px]" bg="bg-border" />

        <Stack direction="row" align="center" gap={2.5}>
          <CircularIcon icon={User} />
          <Stack gap={0}>
            <Font variant="body-medium" text="Admin Navelo" />
            <Font variant="auxiliary" text="admin@navelo.com" />
          </Stack>
        </Stack>
        <Stack direction="row" gap={2.5} w="full" wrap>
          <Button variant="primary-pill-icon" icon={Settings} onClick={() => setIsSettingsOpen(true)} />
          <Box flex="1">
            <Button variant="danger-pill-icon" icon={LogOut} label="Sair da conta" fullWidth justify="start" />
          </Box>
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
