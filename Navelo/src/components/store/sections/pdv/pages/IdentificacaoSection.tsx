"use client"


import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Switch } from "@/components/store/base/Switch"
import { Badge } from "@/components/store/base/Badge"
import { Icon } from "@/components/store/base/Icon"
import { Moon } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

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

  const s = UI_STRINGS.settings.identificacao

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

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
            placeholder={s.coverPhotoPlaceholder}
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
            <Font variant="body-bold" text={s.visualIdentityTitle} align="center" />
            <Font
              variant="description"
              text={s.visualIdentityDesc}
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
              label={s.subdomainLabel}
              placeholder={s.subdomainPlaceholder}
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
              <Badge variant="success" label={s.availableBadge} />
            </Stack>
          </Stack>

          {/* Áreas atendidas */}
          <Stack gap={2.5} w="full">
            <Input
              placeholder={s.areasPlaceholder}
              value={areas}
              onChange={(e) => setAreas(e.target.value)}
            />
            <Font
              variant="description"
              text={s.areasDesc}
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
          <Font variant="body-bold" text={s.colorsTitle} />

          {/* Cor principal tema claro */}
          <Stack gap={2.5} w="full">
            <Font variant="description" text={s.primaryLightColorDesc} />
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
                <Font variant="body-bold" text={s.darkThemeToggle} />
              </Stack>
              <Switch
                checked={darkThemeEnabled}
                onChange={(e) => setDarkThemeEnabled(e.target.checked)}
              />
            </Stack>
            <Font
              variant="description"
              text={s.darkThemeDesc}
              color="muted"
            />
          </Stack>

          {/* Cor principal tema escuro */}
          {darkThemeEnabled && (
            <Stack gap={2.5} w="full">
              <Font variant="description" text={s.primaryDarkColorDesc} />
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
          <Font variant="body-bold" text={s.socialNetworksTitle} />

          <Stack gap={2.5} w="full">
            <Input
              placeholder={s.facebookPlaceholder}
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
            <Font
              variant="description"
              text={s.facebookDesc}
              color="muted"
            />
          </Stack>

          <Stack gap={2.5} w="full">
            <Input
              placeholder={s.instagramPlaceholder}
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
            <Font
              variant="description"
              text={s.instagramDesc}
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
          text={s.infoNote}
          color="muted"
        />
      </Box>
    </Stack>
  )
}
