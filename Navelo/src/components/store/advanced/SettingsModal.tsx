"use client"

import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Grid } from "../base/Grid"
import { Button } from "../base/Button"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../base/Modal"
import { Input } from "../base/Input"
import { SectionHeader } from "../intermediary/SectionHeader"
import { Settings, Upload, Palette } from "lucide-react"

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

const SettingsForm: React.FC<SettingsFormProps> = ({
  tempPrimary, setTempPrimary, tempSecondary, setTempSecondary, tempLogo, setTempLogo, handleLogoChange
}) => (
  <Stack gap={5}>
    <Box padding={0}>
      <Stack gap={5}>
        <SectionHeader
          icon={Palette}
          title="Identidade Visual (Whitelabel)"
          subtitle="Personalize as cores da sua marca e logotipo do seu terminal."
          iconSize={20}
        />
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
                <Box as="img" src={tempLogo} alt="Preview Logo" w="w-[28px]" h="h-[28px]" objectFit="contain" />
              </Box>
              <Button variant="outline-xs" label="Remover logo" onClick={() => setTempLogo("")} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  </Stack>
)

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [tempLogo, setTempLogo] = React.useState<string>("")
  const [tempPrimary, setTempPrimary] = React.useState<string>("#3b82f6")
  const [tempSecondary, setTempSecondary] = React.useState<string>("#f97316")

  React.useEffect(() => {
    if (typeof window !== "undefined" && isOpen) {
      const storedPrimary = localStorage.getItem("brand-primary")
      const storedSecondary = localStorage.getItem("brand-secondary")
      const storedLogo = localStorage.getItem("logo-data")

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempPrimary(isValidHex(storedPrimary) ? storedPrimary : "#3b82f6")
      setTempSecondary(isValidHex(storedSecondary) ? storedSecondary : "#f97316")
      setTempLogo(storedLogo || "")
    }
  }, [isOpen])

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
      
      onSave?.(tempLogo)
    }
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} hideCloseButton={true}>
      <ModalHeader>
        <SectionHeader
          icon={Settings}
          title="Configurações do Sistema"
          subtitle="Gerencie suas preferências e recursos do terminal."
        />
      </ModalHeader>
      <ModalBody>
        <SettingsForm
          tempPrimary={tempPrimary}
          setTempPrimary={setTempPrimary}
          tempSecondary={tempSecondary}
          setTempSecondary={setTempSecondary}
          tempLogo={tempLogo}
          setTempLogo={setTempLogo}
          handleLogoChange={handleLogoChange}
        />
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
  )
}
