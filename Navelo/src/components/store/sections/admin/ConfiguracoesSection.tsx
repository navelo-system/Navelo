"use client"

import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Button } from "@/components/store/base/Button"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Grid } from "@/components/store/base/Grid"
import { Input } from "@/components/store/base/Input"
import { Switch } from "@/components/store/base/Switch"
import { Font } from "@/components/store/base/Font"
import { ArrowLeft, Save, Upload, Palette, Settings } from "lucide-react"
import { GlobalConfig } from "@/src/types/domain"

const MOCK_CONFIG: GlobalConfig = {
  systemName: "Navelo SaaS",
  adminEmail: "admin@navelo.com",
  allowRegistration: true,
  maintenanceMode: false,
  whitelabel: {
    primaryColor: typeof window !== "undefined" ? localStorage.getItem("brand-primary") || "#3b82f6" : "#3b82f6",
    secondaryColor: typeof window !== "undefined" ? localStorage.getItem("brand-secondary") || "#f97316" : "#f97316",
    logoUrl: typeof window !== "undefined" ? localStorage.getItem("logo-data") || "" : "",
  }
}

// eslint-disable-next-line max-lines-per-function
export function ConfiguracoesSection() {
  const [config, setConfig] = React.useState<GlobalConfig>(MOCK_CONFIG)


  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, whitelabel: { ...prev.whitelabel, logoUrl: reader.result as string } }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("brand-primary", config.whitelabel.primaryColor)
      localStorage.setItem("brand-secondary", config.whitelabel.secondaryColor)
      localStorage.setItem("logo-data", config.whitelabel.logoUrl || "")

      // Apply dynamically
      document.documentElement.style.setProperty('--brand-primary', config.whitelabel.primaryColor)
      document.documentElement.style.setProperty('--brand-secondary', config.whitelabel.secondaryColor)
      
      window.location.reload() // Reload to propagate logo to header cleanly
    }
  }

  return (
    <>
      <Stack direction="row" align="start" w="fit-content">
        <Button
          variant="ghost-ghost"
          label="Voltar ao Painel"
          icon={ArrowLeft}
          onClick={() => window.location.href = "/admin"}
        />
      </Stack>

      <RegistrySection 
        title="Parâmetros do Sistema"
        description="Defina os parâmetros operacionais da plataforma SaaS."
        icon={Settings}
      >
        <Stack gap={5}>
          <Input
            label="Nome da Plataforma"
            placeholder="Digite o nome da plataforma"
            value={config.systemName}
            onChange={(e) => setConfig({ ...config, systemName: e.target.value })}
          />

          <Input
            label="E-mail de Suporte Administrativo"
            placeholder="Ex: suporte@empresa.com"
            value={config.adminEmail}
            onChange={(e) => setConfig({ ...config, adminEmail: e.target.value })}
          />

          <Stack gap={5}>
            <Stack direction="row" align="center" justify="between">
              <Stack gap={1}>
                <Font variant="body-bold" text="Permitir novos cadastros" />
                <Font variant="auxiliary" text="Novos locatários podem se registrar de forma autônoma." />
              </Stack>
              <Switch
                checked={config.allowRegistration}
                onChange={(e) => setConfig({ ...config, allowRegistration: e.target.checked })}
              />
            </Stack>

            <Stack direction="row" align="center" justify="between">
              <Stack gap={1}>
                <Font variant="body-bold" text="Modo de manutenção" />
                <Font variant="auxiliary" text="Bloqueia temporariamente o acesso de todos os inquilinos." />
              </Stack>
              <Switch
                checked={config.maintenanceMode}
                onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
              />
            </Stack>
          </Stack>
        </Stack>
      </RegistrySection>

      <RegistrySection 
        title="Identidade Visual & Cores (Whitelabel)"
        description="Personalize as cores e o logotipo de sua plataforma."
        icon={Palette}
      >
        <Stack gap={5}>
          <Grid cols={2} gap={5}>
            <Input
              type="color"
              label="Cor Primária (Tema)"
              value={config.whitelabel.primaryColor}
              onChange={(e) => setConfig({ ...config, whitelabel: { ...config.whitelabel, primaryColor: e.target.value } })}
            />
            <Input
              type="color"
              label="Cor Secundária (Destaques)"
              value={config.whitelabel.secondaryColor}
              onChange={(e) => setConfig({ ...config, whitelabel: { ...config.whitelabel, secondaryColor: e.target.value } })}
            />
          </Grid>

          <Stack gap={2.5}>
            <Input
              variant="image-upload"
              label="Logotipo da Plataforma"
              placeholder="Clique ou arraste para enviar logotipo customizado"
              icon={Upload}
              onChange={handleLogoChange}
            />
            {config.whitelabel.logoUrl && (
              <Stack direction="row" align="center" gap={2.5}>
                <Box w="w-16" h="h-16" radius="default" display="flex" justify="center" overflow="hidden" bg="bg-surface-sunken" border borderColor="border-slate-200">
                  <Stack w="full" h="full" align="center" justify="center">
                    <Box as="img" src={config.whitelabel.logoUrl} alt="Preview Logo" w="w-[48px]" h="h-[48px]" objectFit="contain" />
                  </Stack>
                </Box>
                <Button
                  variant="outline-danger-sm"
                  label="Remover Logotipo"
                  onClick={() => setConfig({ ...config, whitelabel: { ...config.whitelabel, logoUrl: "" } })}
                />
              </Stack>
            )}
          </Stack>

          <Stack direction="row" justify="end">
            <Button
              variant="primary"
              label="Salvar Alterações"
              icon={Save}
              onClick={handleSave}
            />
          </Stack>
        </Stack>
      </RegistrySection>
    </>
  )
}
