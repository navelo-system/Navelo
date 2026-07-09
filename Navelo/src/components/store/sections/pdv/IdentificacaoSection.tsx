"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Font } from "../../base/Font"
import { Input } from "../../base/Input"
import { Switch } from "../../base/Switch"
import { Badge } from "../../base/Badge"
import { Icon } from "../../base/Icon"
import { Moon } from "lucide-react"

export interface IdentificacaoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
}

export const IdentificacaoSection: React.FC<IdentificacaoSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle
}) => {
  const [subdomain, setSubdomain] = React.useState("basenavelo")
  const [areas, setAreas] = React.useState("")
  const [darkThemeEnabled, setDarkThemeEnabled] = React.useState(true)
  const [lightColor, setLightColor] = React.useState("#e05a2b")
  const [darkColor, setDarkColor] = React.useState("#2196f3")
  const [facebook, setFacebook] = React.useState("")
  const [instagram, setInstagram] = React.useState("https://www.instagram.com/navelo_pdv/")

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.("Identificação")
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel])

  return (
    <Stack gap={5} w="full">
      {/* Card: Identidade Visual */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        overflow="hidden"
        w="full"
      >
        {/* Capa + Logo */}
        <Box w="full" position="relative">
          <Input
            variant="image-upload"
            placeholder="Clique para adicionar a foto de capa"
          />
          {/* Logo sobreposto */}
          <Box
            position="absolute"
            bottom="-32px"
            left="calc(50% - 32px)"
            zIndex="20"
            w="w-16"
            h="h-16"
            radius="full"
            overflow="hidden"
            border={true}
            borderColor="border-white"
            bg="bg-white"
            cursor="pointer"
          >
            <Input
              variant="image-upload"
            />
          </Box>
        </Box>

        {/* Espaço para o logo sobreposto */}
        <Box h="h-10" />

        <Box padding={5}>
          <Stack gap={1} align="center">
            <Font variant="body-bold" text="Identidade visual" align="center" />
            <Font
              variant="description"
              text="Clique nas áreas indicadas para adicionar a foto de capa e o logo da sua empresa"
              align="center"
              color="muted"
            />
          </Stack>
        </Box>
      </Box>

      {/* Card: Subdomínio + Áreas */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          {/* Subdomínio */}
          <Stack gap={2.5} w="full">
            <Input
              label="* Subdomínio"
              placeholder="basenavelo"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
            />
            <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full" gap={2.5}>
              <Font
                variant="description"
                text={`https://${subdomain || "basenavelo"}.menudigital.net.br`}
                color="muted"
                align="left"
              />
              <Badge variant="success" label="Disponível" />
            </Stack>
          </Stack>

          {/* Áreas atendidas */}
          <Stack gap={2.5} w="full">
            <Input
              placeholder="Áreas atendidas"
              value={areas}
              onChange={(e) => setAreas(e.target.value)}
            />
            <Font
              variant="description"
              text="Descreva as áreas atendidas pela sua empresa"
              color="muted"
            />
          </Stack>
        </Stack>
      </Box>

      {/* Card: Cores */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          <Font variant="body-bold" text="Cores" />

          {/* Cor principal tema claro */}
          <Stack gap={2.5} w="full">
            <Font variant="description" text="Cor principal (tema claro)" />
            <Input
              type="color"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
            />
          </Stack>

          {/* Disponibilizar tema escuro */}
          <Stack gap={1} w="full">
            <Stack direction="row" align="center" justify="between" w="full" gap={5}>
              <Stack direction="row" align="center" gap={2.5}>
                <Icon icon={Moon} size={16} color="muted" />
                <Font variant="body-bold" text="Disponibilizar tema escuro" />
              </Stack>
              <Switch
                checked={darkThemeEnabled}
                onChange={(e) => setDarkThemeEnabled(e.target.checked)}
              />
            </Stack>
            <Font
              variant="description"
              text="Habilite essa opção para que os clientes possam escolher entre o tema claro e o tema escuro."
              color="muted"
            />
          </Stack>

          {/* Cor principal tema escuro */}
          {darkThemeEnabled && (
            <Stack gap={2.5} w="full">
              <Font variant="description" text="Cor principal (tema escuro)" />
              <Input
                type="color"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
              />
            </Stack>
          )}
        </Stack>
      </Box>

      {/* Card: Redes Sociais */}
      <Box
        bg="bg-white"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Stack gap={5} w="full">
          <Font variant="body-bold" text="Redes Sociais" />

          <Stack gap={2.5} w="full">
            <Input
              placeholder="Facebook"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
            <Font
              variant="description"
              text="https://www.facebook.com/sua_empresa"
              color="muted"
            />
          </Stack>

          <Stack gap={2.5} w="full">
            <Input
              placeholder="Instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
            <Font
              variant="description"
              text="https://www.instagram.com/sua_empresa"
              color="muted"
            />
          </Stack>
        </Stack>
      </Box>

      {/* Nota informativa */}
      <Box
        bg="bg-surface"
        border={true}
        borderColor="border-border"
        radius="default"
        padding={5}
        w="full"
      >
        <Font
          variant="description"
          text="ℹ️ Estas configurações serão aplicadas tanto para o Menu Digital, quanto para o Catálogo Online."
          color="muted"
        />
      </Box>
    </Stack>
  )
}
