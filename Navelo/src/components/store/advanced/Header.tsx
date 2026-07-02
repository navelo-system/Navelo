"use client"

import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Icon } from "../base/Icon"
import { Input } from "../base/Input"
import { Grid } from "../base/Grid"
import { Button } from "../base/Button"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../base/Modal"
import { Eye, Cloud, LogOut, Settings, Upload } from "lucide-react"

const isValidHex = (color: string | null): color is string => {
  if (!color) return false
  return /^#[0-9A-Fa-f]{6}$/.test(color) || /^#[0-9A-Fa-f]{3}$/.test(color)
}

export const Header: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [logoUrl, setLogoUrl] = React.useState<string>("")
  const [tempLogo, setTempLogo] = React.useState<string>("")

  // Custom theme states (2 brand variables)
  const [tempPrimary, setTempPrimary] = React.useState<string>("#3b82f6")
  const [tempSecondary, setTempSecondary] = React.useState<string>("#f97316")

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPrimary = localStorage.getItem("brand-primary")
      const storedSecondary = localStorage.getItem("brand-secondary")
      const storedLogo = localStorage.getItem("logo-data")

      if (storedPrimary && isValidHex(storedPrimary)) {
        setTempPrimary(storedPrimary)
        document.documentElement.style.setProperty('--brand-primary', storedPrimary)
      }
      if (storedSecondary && isValidHex(storedSecondary)) {
        setTempSecondary(storedSecondary)
        document.documentElement.style.setProperty('--brand-secondary', storedSecondary)
      }
      if (storedLogo) {
        setLogoUrl(storedLogo)
        setTempLogo(storedLogo)
      }
    }
  }, [])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTempLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("brand-primary", tempPrimary)
      localStorage.setItem("brand-secondary", tempSecondary)
      localStorage.setItem("logo-data", tempLogo)

      document.documentElement.style.setProperty('--brand-primary', tempPrimary)
      document.documentElement.style.setProperty('--brand-secondary', tempSecondary)
      setLogoUrl(tempLogo)
    }
    setIsSettingsOpen(false)
  }

  const handleCancel = () => {
    if (typeof window !== "undefined") {
      const storedPrimary = localStorage.getItem("brand-primary")
      const storedSecondary = localStorage.getItem("brand-secondary")

      setTempPrimary(isValidHex(storedPrimary) ? storedPrimary : "#3b82f6")
      setTempSecondary(isValidHex(storedSecondary) ? storedSecondary : "#f97316")
      setTempLogo(localStorage.getItem("logo-data") || "")
    }
    setIsSettingsOpen(false)
  }

  return (
    <Box padding={0} bg="bg-brand-primary" w="full" className="py-6 px-8 border-b border-brand-primary/10 flex flex-col">
      <Stack direction="row" align="center" justify="between" w="full">
        {/* Left content: Logo and user aligned to the left */}
        <Stack gap={1} align="start">
          {logoUrl ? (
            <Box h="h-8" overflow="hidden" className="flex items-center">
              <img src={logoUrl} alt="Logo" style={{ height: "32px", objectFit: "contain" }} />
            </Box>
          ) : (
            <Font variant="body-bold" color="brand-secondary" text="Navelo - sistema PDV" />
          )}
          <button className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent p-0 text-left">
            <Icon icon={LogOut} size={14} color="brand-secondary" />
            <Font variant="body-xs" color="brand-secondary" text="Administrador" />
          </button>
        </Stack>

        {/* Right content: Icons with proper spacing */}
        <Stack direction="row" align="center" gap={2.5}>
          <button onClick={() => setIsSettingsOpen(true)} className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent p-0">
            <Icon icon={Settings} size={20} color="brand-secondary" />
          </button>
          <button className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent p-0">
            <Icon icon={Eye} size={20} color="brand-secondary" />
          </button>
          <button className="hover:opacity-80 transition-opacity cursor-pointer border-none bg-transparent p-0">
            <Icon icon={Cloud} size={20} color="brand-secondary" />
          </button>
        </Stack>
      </Stack>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} hideCloseButton={true}>
        <ModalHeader>
          <Stack gap={1}>
            <Font variant="body-semibold" text="Configurações do Sistema" />
            <Font variant="description" text="Gerencie suas preferências e recursos do terminal." />
          </Stack>
        </ModalHeader>
        <ModalBody>
          <Stack gap={5}>
            {/* Whitelabel Settings */}
            <Box padding={0}>
              <Stack gap={5}>
                <Stack gap={0}>
                  <Font variant="body-bold" text="Identidade Visual (Whitelabel)" />
                  <Font variant="description" text="Personalize as cores da sua marca e logotipo do seu terminal." />
                </Stack>

                <Grid cols={2} gap={2.5}>
                  <Input type="color" label="Cor Primária" value={tempPrimary} onChange={(e) => setTempPrimary(e.target.value)} />
                  <Input type="color" label="Cor Secundária" value={tempSecondary} onChange={(e) => setTempSecondary(e.target.value)} />
                </Grid>

                <Stack gap={2.5}>
                  <Input
                    variant="image-upload"
                    label="Subir Novo Logotipo"
                    placeholder="Arraste ou clique para enviar imagem"
                    icon={Upload}
                    onChange={handleLogoChange}
                  />
                  {tempLogo && (
                    <Stack direction="row" align="center" gap={2.5}>
                      <Box w="w-8" h="h-8" radius="default" display="flex" justify="center" overflow="hidden">
                        <img src={tempLogo} alt="Preview Logo" width={28} height={28} style={{ objectFit: "contain" }} />
                      </Box>
                      <Button variant="outline-xs" label="Remover logo" onClick={() => setTempLogo("")} />
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Stack direction="row" gap={2.5} w="full" wrap>
            <Box flex="1">
              <Button variant="outline-danger" label="Cancelar" onClick={handleCancel} fullWidth />
            </Box>
            <Box flex="1">
              <Button variant="outline-success" label="Salvar preferências" onClick={handleSave} fullWidth />
            </Box>
          </Stack>
        </ModalFooter>
      </Modal>
    </Box>
  )
}
