"use client"

import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Grid } from "../base/Grid"
import { Font } from "../base/Font"
import { Icon } from "../base/Icon"
import { Button } from "../base/Button"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "../base/Modal"
import { Input } from "../base/Input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../base/Tabs"
import { CircularIcon } from "../intermediary/CircularIcon"
import { LayoutDashboard, Settings, Users, LogOut, User, Upload, Palette } from "lucide-react"

const isValidHex = (color: string | null): color is string => {
  if (!color) return false
  return /^#[0-9A-Fa-f]{6}$/.test(color) || /^#[0-9A-Fa-f]{3}$/.test(color)
}

export const Sidebar: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [logoUrl, setLogoUrl] = React.useState<string>("")
  const [tempLogo, setTempLogo] = React.useState<string>("")
  
  // Custom theme states (14 variables)
  const [tempPrimary, setTempPrimary] = React.useState<string>("#3b82f6")
  const [tempSecondary, setTempSecondary] = React.useState<string>("#f97316")
  const [tempSuccess, setTempSuccess] = React.useState<string>("#10b981")
  const [tempWarning, setTempWarning] = React.useState<string>("#f59e0b")
  const [tempDanger, setTempDanger] = React.useState<string>("#ef4444")
  const [tempBackground, setTempBackground] = React.useState<string>("#ffffff")
  const [tempSurface, setTempSurface] = React.useState<string>("#ffffff")
  const [tempSurfaceRaised, setTempSurfaceRaised] = React.useState<string>("#ffffff")
  const [tempSurfaceSunken, setTempSurfaceSunken] = React.useState<string>("#f8fafc")
  const [tempForeground, setTempForeground] = React.useState<string>("#0f172a")
  const [tempTextSecondary, setTempTextSecondary] = React.useState<string>("#475569")
  const [tempTextMuted, setTempTextMuted] = React.useState<string>("#64748b")
  const [tempTextDim, setTempTextDim] = React.useState<string>("#94a3b8")
  const [tempBorder, setTempBorder] = React.useState<string>("#e2e8f0")

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPrimary = localStorage.getItem("brand-primary")
      const storedSecondary = localStorage.getItem("brand-secondary")
      const storedSuccess = localStorage.getItem("brand-success")
      const storedWarning = localStorage.getItem("brand-warning")
      const storedDanger = localStorage.getItem("brand-danger")
      const storedBackground = localStorage.getItem("background")
      const storedSurface = localStorage.getItem("surface")
      const storedSurfaceRaised = localStorage.getItem("surface-raised")
      const storedSurfaceSunken = localStorage.getItem("surface-sunken")
      const storedForeground = localStorage.getItem("foreground")
      const storedTextSecondary = localStorage.getItem("text-secondary")
      const storedTextMuted = localStorage.getItem("text-muted")
      const storedTextDim = localStorage.getItem("text-dim")
      const storedBorder = localStorage.getItem("border")
      const storedLogo = localStorage.getItem("logo-data")

      if (storedPrimary && isValidHex(storedPrimary)) {
        setTempPrimary(storedPrimary)
        document.documentElement.style.setProperty('--brand-primary', storedPrimary)
      }
      if (storedSecondary && isValidHex(storedSecondary)) {
        setTempSecondary(storedSecondary)
        document.documentElement.style.setProperty('--brand-secondary', storedSecondary)
      }
      if (storedSuccess && isValidHex(storedSuccess)) {
        setTempSuccess(storedSuccess)
        document.documentElement.style.setProperty('--brand-success', storedSuccess)
      }
      if (storedWarning && isValidHex(storedWarning)) {
        setTempWarning(storedWarning)
        document.documentElement.style.setProperty('--brand-warning', storedWarning)
      }
      if (storedDanger && isValidHex(storedDanger)) {
        setTempDanger(storedDanger)
        document.documentElement.style.setProperty('--brand-danger', storedDanger)
      }
      if (storedBackground && isValidHex(storedBackground)) {
        setTempBackground(storedBackground)
        document.documentElement.style.setProperty('--background', storedBackground)
      }
      if (storedSurface && isValidHex(storedSurface)) {
        setTempSurface(storedSurface)
        document.documentElement.style.setProperty('--surface', storedSurface)
      }
      if (storedSurfaceRaised && isValidHex(storedSurfaceRaised)) {
        setTempSurfaceRaised(storedSurfaceRaised)
        document.documentElement.style.setProperty('--surface-raised', storedSurfaceRaised)
      }
      if (storedSurfaceSunken && isValidHex(storedSurfaceSunken)) {
        setTempSurfaceSunken(storedSurfaceSunken)
        document.documentElement.style.setProperty('--surface-sunken', storedSurfaceSunken)
      }
      if (storedForeground && isValidHex(storedForeground)) {
        setTempForeground(storedForeground)
        document.documentElement.style.setProperty('--foreground', storedForeground)
      }
      if (storedTextSecondary && isValidHex(storedTextSecondary)) {
        setTempTextSecondary(storedTextSecondary)
        document.documentElement.style.setProperty('--text-secondary', storedTextSecondary)
      }
      if (storedTextMuted && isValidHex(storedTextMuted)) {
        setTempTextMuted(storedTextMuted)
        document.documentElement.style.setProperty('--text-muted', storedTextMuted)
      }
      if (storedTextDim && isValidHex(storedTextDim)) {
        setTempTextDim(storedTextDim)
        document.documentElement.style.setProperty('--text-dim', storedTextDim)
      }
      if (storedBorder && isValidHex(storedBorder)) {
        setTempBorder(storedBorder)
        document.documentElement.style.setProperty('--border', storedBorder)
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
      localStorage.setItem("brand-success", tempSuccess)
      localStorage.setItem("brand-warning", tempWarning)
      localStorage.setItem("brand-danger", tempDanger)
      localStorage.setItem("background", tempBackground)
      localStorage.setItem("surface", tempSurface)
      localStorage.setItem("surface-raised", tempSurfaceRaised)
      localStorage.setItem("surface-sunken", tempSurfaceSunken)
      localStorage.setItem("foreground", tempForeground)
      localStorage.setItem("text-secondary", tempTextSecondary)
      localStorage.setItem("text-muted", tempTextMuted)
      localStorage.setItem("text-dim", tempTextDim)
      localStorage.setItem("border", tempBorder)
      localStorage.setItem("logo-data", tempLogo)

      document.documentElement.style.setProperty('--brand-primary', tempPrimary)
      document.documentElement.style.setProperty('--brand-secondary', tempSecondary)
      document.documentElement.style.setProperty('--brand-success', tempSuccess)
      document.documentElement.style.setProperty('--brand-warning', tempWarning)
      document.documentElement.style.setProperty('--brand-danger', tempDanger)
      document.documentElement.style.setProperty('--background', tempBackground)
      document.documentElement.style.setProperty('--surface', tempSurface)
      document.documentElement.style.setProperty('--surface-raised', tempSurfaceRaised)
      document.documentElement.style.setProperty('--surface-sunken', tempSurfaceSunken)
      document.documentElement.style.setProperty('--foreground', tempForeground)
      document.documentElement.style.setProperty('--text-secondary', tempTextSecondary)
      document.documentElement.style.setProperty('--text-muted', tempTextMuted)
      document.documentElement.style.setProperty('--text-dim', tempTextDim)
      document.documentElement.style.setProperty('--border', tempBorder)
      setLogoUrl(tempLogo)
    }
    setIsSettingsOpen(false)
  }

  const handleCancel = () => {
    if (typeof window !== "undefined") {
      const storedPrimary = localStorage.getItem("brand-primary")
      const storedSecondary = localStorage.getItem("brand-secondary")
      const storedSuccess = localStorage.getItem("brand-success")
      const storedWarning = localStorage.getItem("brand-warning")
      const storedDanger = localStorage.getItem("brand-danger")
      const storedBackground = localStorage.getItem("background")
      const storedSurface = localStorage.getItem("surface")
      const storedSurfaceRaised = localStorage.getItem("surface-raised")
      const storedSurfaceSunken = localStorage.getItem("surface-sunken")
      const storedForeground = localStorage.getItem("foreground")
      const storedTextSecondary = localStorage.getItem("text-secondary")
      const storedTextMuted = localStorage.getItem("text-muted")
      const storedTextDim = localStorage.getItem("text-dim")
      const storedBorder = localStorage.getItem("border")

      setTempPrimary(isValidHex(storedPrimary) ? storedPrimary : "#3b82f6")
      setTempSecondary(isValidHex(storedSecondary) ? storedSecondary : "#f97316")
      setTempSuccess(isValidHex(storedSuccess) ? storedSuccess : "#10b981")
      setTempWarning(isValidHex(storedWarning) ? storedWarning : "#f59e0b")
      setTempDanger(isValidHex(storedDanger) ? storedDanger : "#ef4444")
      setTempBackground(isValidHex(storedBackground) ? storedBackground : "#ffffff")
      setTempSurface(isValidHex(storedSurface) ? storedSurface : "#ffffff")
      setTempSurfaceRaised(isValidHex(storedSurfaceRaised) ? storedSurfaceRaised : "#ffffff")
      setTempSurfaceSunken(isValidHex(storedSurfaceSunken) ? storedSurfaceSunken : "#f8fafc")
      setTempForeground(isValidHex(storedForeground) ? storedForeground : "#0f172a")
      setTempTextSecondary(isValidHex(storedTextSecondary) ? storedTextSecondary : "#475569")
      setTempTextMuted(isValidHex(storedTextMuted) ? storedTextMuted : "#64748b")
      setTempTextDim(isValidHex(storedTextDim) ? storedTextDim : "#94a3b8")
      setTempBorder(isValidHex(storedBorder) ? storedBorder : "#e2e8f0")
      setTempLogo(localStorage.getItem("logo-data") || "")
    }
    setIsSettingsOpen(false)
  }

  return (
    <Box padding={5} w="w-64" h="screen" bg="bg-surface" display="hidden lg:flex" direction="col" justify="between">
      <Stack gap={12.5}>
        {/* Logo */}
        <Stack direction="row" align="center" gap={2.5}>
          {logoUrl ? (
            <Box h="h-8" overflow="hidden">
              <img src={logoUrl} alt="Logo" style={{ height: "32px", objectFit: "contain" }} />
            </Box>
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
          <Button variant="outline-primary" icon={LayoutDashboard} label="Design System" fullWidth justify="start" />
          <Button variant="outline" icon={Users} label="Componentes" fullWidth justify="start" />
          <Button variant="outline" icon={Settings} label="Configurações" fullWidth justify="start" />
        </Stack>
      </Stack>

      {/* User Profile */}
      <Stack gap={5}>
        {/* Horizontal Separator */}
        <Box w="full" h="h-[2px]" bg="bg-border" />

        <Stack direction="row" align="center" gap={2.5}>
          <CircularIcon icon={User} variant="secondary" />
          <Stack gap={0}>
            <Font variant="body-medium" text="Admin Navelo" />
            <Font variant="auxiliary" text="admin@navelo.com" />
          </Stack>
        </Stack>
        <Stack direction="row" gap={2.5} w="full" wrap>
          <Button variant="outline-primary-pill-icon" icon={Settings} onClick={() => setIsSettingsOpen(true)} />
          <Box flex="1">
            <Button variant="outline-danger-pill-icon" icon={LogOut} label="Sair da conta" fullWidth justify="start" />
          </Box>
        </Stack>
      </Stack>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <ModalHeader>
          <Stack direction="row" align="center" gap={5}>
            <CircularIcon icon={Settings} variant="secondary" size={24} />
            <Stack gap={1}>
              <Font variant="body-semibold" text="Configurações do Sistema" />
              <Font variant="description" text="Gerencie suas preferências e recursos do terminal." />
            </Stack>
          </Stack>
        </ModalHeader>
        <ModalBody>
          <Stack gap={5}>
            {/* Whitelabel Settings */}
            <Box padding={5} bg="bg-surface-sunken" radius="default" border borderColor="border-border">
              <Stack gap={5}>
                <Stack direction="row" align="center" gap={5}>
                  <CircularIcon icon={Palette} variant="brand-light" size={20} />
                  <Stack gap={0}>
                    <Font variant="body-bold" text="Identidade Visual (Whitelabel)" />
                    <Font variant="description" text="Personalize as cores e logotipo do seu terminal." />
                  </Stack>
                </Stack>

                <Tabs defaultValue="brand">
                  <TabsList>
                    <TabsTrigger value="brand">Marca e Alertas</TabsTrigger>
                    <TabsTrigger value="screens">Telas e Layout</TabsTrigger>
                    <TabsTrigger value="typography">Textos e Fontes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="brand">
                    <Stack gap={2.5}>
                      <Grid cols={2} gap={2.5}>
                        <Input type="color" label="Cor Primária" value={tempPrimary} onChange={(e) => setTempPrimary(e.target.value)} />
                        <Input type="color" label="Cor Secundária" value={tempSecondary} onChange={(e) => setTempSecondary(e.target.value)} />
                      </Grid>
                      <Grid cols={3} gap={2.5}>
                        <Input type="color" label="Sucesso" value={tempSuccess} onChange={(e) => setTempSuccess(e.target.value)} />
                        <Input type="color" label="Aviso" value={tempWarning} onChange={(e) => setTempWarning(e.target.value)} />
                        <Input type="color" label="Erro/Perigo" value={tempDanger} onChange={(e) => setTempDanger(e.target.value)} />
                      </Grid>
                    </Stack>
                  </TabsContent>

                  <TabsContent value="screens">
                    <Grid cols={2} gap={2.5}>
                      <Input type="color" label="Fundo Geral" value={tempBackground} onChange={(e) => setTempBackground(e.target.value)} />
                      <Input type="color" label="Bordas" value={tempBorder} onChange={(e) => setTempBorder(e.target.value)} />
                      <Input type="color" label="Superfície" value={tempSurface} onChange={(e) => setTempSurface(e.target.value)} />
                      <Input type="color" label="Superfície Elevada" value={tempSurfaceRaised} onChange={(e) => setTempSurfaceRaised(e.target.value)} />
                      <Input type="color" label="Superfície Baixa" value={tempSurfaceSunken} onChange={(e) => setTempSurfaceSunken(e.target.value)} />
                    </Grid>
                  </TabsContent>

                  <TabsContent value="typography">
                    <Grid cols={2} gap={2.5}>
                      <Input type="color" label="Texto Principal" value={tempForeground} onChange={(e) => setTempForeground(e.target.value)} />
                      <Input type="color" label="Texto Secundário" value={tempTextSecondary} onChange={(e) => setTempTextSecondary(e.target.value)} />
                      <Input type="color" label="Texto Mudo" value={tempTextMuted} onChange={(e) => setTempTextMuted(e.target.value)} />
                      <Input type="color" label="Texto Suave" value={tempTextDim} onChange={(e) => setTempTextDim(e.target.value)} />
                    </Grid>
                  </TabsContent>
                </Tabs>

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
                      <Box w="w-8" h="h-8" radius="default" border borderColor="border-border" display="flex" justify="center" overflow="hidden">
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
    </Box >
  )
}
