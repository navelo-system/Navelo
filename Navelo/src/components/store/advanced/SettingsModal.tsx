"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Button } from "@/components/store/base/Button"
import { Modal } from "@/components/store/base/Modal"
import { Input } from "@/components/store/base/Input"
import { SectionHeader } from "@/components/store/intermediary/SectionHeader"
import { Settings, Upload, Palette } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

const isValidHex = (color: string | null): color is string => {
  if (!color) return false
  return /^#[0-9A-Fa-f]{6}$/.test(color) || /^#[0-9A-Fa-f]{3}$/.test(color)
}

export interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (logoUrl: string) => void
}

interface SettingsFormProps {
  tempPrimary: string
  setTempPrimary: (val: string) => void
  tempSecondary: string
  setTempSecondary: (val: string) => void
  tempLogo: string
  setTempLogo: (val: string) => void
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function SettingsForm({
  tempPrimary,
  setTempPrimary,
  tempSecondary,
  setTempSecondary,
  tempLogo,
  setTempLogo,
  handleLogoChange,
}: SettingsFormProps) {
  const tc = UI_STRINGS.themeCustomizer
  return (
    <Stack gap={5}>
      <Box padding={0}>
        <Stack gap={5}>
          <SectionHeader
            icon={Palette}
            title={tc.whitelabelTitle}
            subtitle={tc.whitelabelSubtitle}
            iconSize={20}
          />
          <Grid cols={2} gap={2.5}>
            <Input type="color" label={tc.primaryColorLabel} value={tempPrimary} onChange={(e) => setTempPrimary(e.target.value)} />
            <Input type="color" label={tc.secondaryColorLabel} value={tempSecondary} onChange={(e) => setTempSecondary(e.target.value)} />
          </Grid>
          <Stack gap={2.5}>
            <Input
              variant="image-upload"
              label={tc.uploadNewLogoLabel}
              placeholder={tc.uploadLogoDragPlaceholder}
              icon={Upload}
              onChange={handleLogoChange}
            />
            {tempLogo && (
              <Stack direction="row" align="center" gap={2.5}>
                <Box w="w-8" h="h-8" radius="default" display="flex" justify="center" overflow="hidden">
                  <Box as="img" src={tempLogo} alt={tc.previewLogoAlt} w="w-[28px]" h="h-[28px]" objectFit="contain" />
                </Box>
                <Button variant="secondary" label={tc.removeLogoButton} onClick={() => setTempLogo("")} />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}

function readStoredSettings() {
  if (typeof window === "undefined") {
    return { primary: "#3b82f6", secondary: "#f97316", logo: "" }
  }
  const storedPrimary = localStorage.getItem("brand-primary")
  const storedSecondary = localStorage.getItem("brand-secondary")
  const storedLogo = localStorage.getItem("logo-data")
  return {
    primary: isValidHex(storedPrimary) ? storedPrimary : "#3b82f6",
    secondary: isValidHex(storedSecondary) ? storedSecondary : "#f97316",
    logo: storedLogo || "",
  }
}

export function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const tc = UI_STRINGS.themeCustomizer
  const initial = readStoredSettings()
  const [tempLogo, setTempLogo] = React.useState<string>(initial.logo)
  const [tempPrimary, setTempPrimary] = React.useState<string>(initial.primary)
  const [tempSecondary, setTempSecondary] = React.useState<string>(initial.secondary)
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      const stored = readStoredSettings()
      setTempPrimary(stored.primary)
      setTempSecondary(stored.secondary)
      setTempLogo(stored.logo)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setTempLogo(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("brand-primary", tempPrimary)
      localStorage.setItem("brand-secondary", tempSecondary)
      localStorage.setItem("logo-data", tempLogo)
      document.documentElement.style.setProperty("--brand-primary", tempPrimary)
      document.documentElement.style.setProperty("--brand-secondary", tempSecondary)
      onSave?.(tempLogo)
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tc.systemSettingsTitle}
      subtitle={tc.systemSettingsSubtitle}
      icon={Settings}
      successText={tc.savePreferencesButton}
      onSuccess={handleSave}
    >
      <SettingsForm
        tempPrimary={tempPrimary}
        setTempPrimary={setTempPrimary}
        tempSecondary={tempSecondary}
        setTempSecondary={setTempSecondary}
        tempLogo={tempLogo}
        setTempLogo={setTempLogo}
        handleLogoChange={handleLogoChange}
      />
    </Modal>
  )
}
