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
import { UI_STRINGS } from "@/constants/strings"

function SidebarHeader({ logoUrl }: { logoUrl: string }) {
  const sb = UI_STRINGS.sidebar
  return (
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
          <Font variant="body-bold" text={sb.brandName} />
        </>
      )}
    </Stack>
  )
}

function SidebarFooter({ onOpenSettings }: { onOpenSettings: () => void }) {
  const sb = UI_STRINGS.sidebar
  return (
    <Stack gap={5}>
      <Box w="full" h="h-[2px]" bg="bg-border" />
      <Stack direction="row" align="center" gap={2.5}>
        <CircularIcon icon={User} />
        <Stack gap={0}>
          <Font variant="body-medium" text={sb.adminName} />
          <Font variant="auxiliary" text={sb.adminEmail} />
        </Stack>
      </Stack>
      <Stack direction="row" gap={2.5} w="full" wrap>
        <Button variant="primary-pill-icon" icon={Settings} onClick={onOpenSettings} />
        <Box flex="1">
          <Button variant="danger-pill-icon" icon={LogOut} label={sb.logout} fullWidth justify="start" />
        </Box>
      </Stack>
    </Stack>
  )
}

export function Sidebar() {
  const sb = UI_STRINGS.sidebar
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [logoUrl, setLogoUrl] = React.useState<string>(() => {
    if (typeof window === "undefined") return ""
    return localStorage.getItem("logo-data") || ""
  })

  return (
    <Box padding={5} w="w-64" h="screen" bg="bg-surface" display="hidden lg:flex" direction="col" justify="between">
      <Stack gap={12.5}>
        <SidebarHeader logoUrl={logoUrl} />
        <Stack gap={2.5}>
          <Button variant="primary" icon={LayoutDashboard} label={sb.designSystem} fullWidth justify="start" />
          <Button variant="ghost" icon={Users} label={sb.components} fullWidth justify="start" />
          <Button variant="ghost" icon={Settings} label={sb.settings} fullWidth justify="start" />
        </Stack>
      </Stack>

      <SidebarFooter onOpenSettings={() => setIsSettingsOpen(true)} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(newLogo) => setLogoUrl(newLogo)}
      />
    </Box>
  )
}
