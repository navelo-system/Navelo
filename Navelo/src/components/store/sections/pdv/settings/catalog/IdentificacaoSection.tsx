"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Switch } from "@/components/store/base/Switch"
import { Badge } from "@/components/store/base/Badge"
import { Button } from "@/components/store/base/Button"
import { Warning } from "@/components/store/base/Warning"
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
import { Icon } from "@/components/store/base/Icon"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { Moon, Check, Info } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import {
  loadCatalogoOnlineSettings,
  saveCatalogoOnlineSettings,
  resolveDynamicCatalogUrl,
  CatalogoOnlineIdentification,
} from "@/lib/sync/catalogoOnlineSettings"

export interface IdentificacaoSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

const RESERVED_SUBDOMAINS = new Set([
  "admin", "api", "app", "dashboard", "checkout", "auth", "login",
  "catalogo", "loja", "pdv", "suporte", "root", "sistema", "config",
  "pedidos", "menu", "digital", "comercio", "navelo", "base",
])

export function getSubdomainStatus(sub: string): {
  status: "available" | "unavailable" | "too-short"
  label: string
  variant: "success" | "danger" | "default"
} {
  const normalized = sub.trim().toLowerCase()
  if (normalized.length < 3) {
    return { status: "too-short", label: "Mínimo 3 caracteres", variant: "default" }
  }
  if (RESERVED_SUBDOMAINS.has(normalized)) {
    return { status: "unavailable", label: "Indisponível", variant: "danger" }
  }
  return { status: "available", label: "Disponível", variant: "success" }
}

function VisualIdentityCard({
  coverImage,
  onCoverChange,
  logoImage,
  onLogoChange,
}: {
  coverImage?: string
  onCoverChange: (base64: string) => void
  logoImage?: string
  onLogoChange: (base64: string) => void
}) {
  const s = UI_STRINGS.settings.identificacao

  const handleFile = (file: File | undefined, cb: (data: string) => void) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        cb(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
      <Box w="full" position="relative">
        <Input
          variant="image-upload"
          placeholder={s.coverPhotoPlaceholder}
          value={coverImage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleFile(e.target.files?.[0], onCoverChange)
          }
        />
        <Box
          position="absolute"
          bottom="-32px"
          left="calc(50% - 32px)"
          zIndex="20"
          w="w-16"
          h="h-16"
          radius="full"
          border
          borderColor="border-white"
          bg="bg-white"
          cursor="pointer"
        >
          <Input
            variant="image-upload"
            shape="circle"
            value={logoImage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFile(e.target.files?.[0], onLogoChange)
            }
          />
        </Box>
      </Box>
      <Box h="h-10" />
      <Box padding={5}>
        <Stack gap={1} align="center">
          <Font variant="body-bold" text={s.visualIdentityTitle} align="center" />
          <Font variant="description" text={s.visualIdentityDesc} align="center" color="muted" />
        </Stack>
      </Box>
    </Box>
  )
}

function SubdomainAreasCard({
  subdomain, setSubdomain, areas, setAreas,
}: {
  subdomain: string; setSubdomain: (v: string) => void
  areas: string; setAreas: (v: string) => void
}) {
  const s = UI_STRINGS.settings.identificacao
  const subStatus = React.useMemo(() => getSubdomainStatus(subdomain), [subdomain])

  const handleSubdomainChange = (val: string) => {
    const formatted = val.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setSubdomain(formatted)
  }

  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Stack gap={2.5} w="full">
          <Input
            label={s.subdomainLabel}
            placeholder={s.subdomainPlaceholder}
            value={subdomain}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSubdomainChange(e.target.value)}
          />
          <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" justify="start" mobileJustify="between" w="full" gap={2.5}>
            <Font variant="description" text={resolveDynamicCatalogUrl(subdomain || "basenavelo")} color="muted" align="left" />
            <Badge variant={subStatus.variant} label={subStatus.label} />
          </Stack>
        </Stack>
        <Stack gap={2.5} w="full">
          <Input placeholder={s.areasPlaceholder} value={areas} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAreas(e.target.value)} />
          <Font variant="description" text={s.areasDesc} color="muted" />
        </Stack>
      </Stack>
    </Box>
  )
}

function ColorsCard({
  lightColor, setLightColor, darkThemeEnabled, setDarkThemeEnabled, darkColor, setDarkColor,
}: {
  lightColor: string; setLightColor: (v: string) => void
  darkThemeEnabled: boolean; setDarkThemeEnabled: (v: boolean) => void
  darkColor: string; setDarkColor: (v: string) => void
}) {
  const s = UI_STRINGS.settings.identificacao
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Font variant="body-bold" text={s.colorsTitle} />
        <Stack gap={2.5} w="full">
          <Font variant="description" text={s.primaryLightColorDesc} />
          <Input type="color" value={lightColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLightColor(e.target.value)} />
        </Stack>
        <Stack gap={1} w="full">
          <Stack direction="row" align="center" justify="between" w="full" gap={5}>
            <Stack direction="row" align="center" gap={2.5}>
              <CircularIcon variant="secondary" icon={Moon} size={20} />
              <Font variant="body-bold" text={s.darkThemeToggle} />
            </Stack>
            <Switch checked={darkThemeEnabled} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDarkThemeEnabled(e.target.checked)} />
          </Stack>
          <Font variant="description" text={s.darkThemeDesc} color="muted" />
        </Stack>
        {darkThemeEnabled && (
          <Stack gap={2.5} w="full">
            <Font variant="description" text={s.primaryDarkColorDesc} />
            <Input type="color" value={darkColor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDarkColor(e.target.value)} />
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

function SocialNetworksCard({
  facebook, setFacebook, instagram, setInstagram,
}: {
  facebook: string; setFacebook: (v: string) => void
  instagram: string; setInstagram: (v: string) => void
}) {
  const s = UI_STRINGS.settings.identificacao
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Font variant="body-bold" text={s.socialNetworksTitle} />
        <Stack gap={2.5} w="full">
          <Input placeholder={s.facebookPlaceholder} value={facebook} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFacebook(e.target.value)} />
          <Font variant="description" text={s.facebookDesc} color="muted" />
        </Stack>
        <Stack gap={2.5} w="full">
          <Input placeholder={s.instagramPlaceholder} value={instagram} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInstagram(e.target.value)} />
          <Font variant="description" text={s.instagramDesc} color="muted" />
        </Stack>
      </Stack>
    </Box>
  )
}

export const IdentificacaoSection: React.FC<IdentificacaoSectionProps> = ({
  onCancel, setCustomBack, setCustomTitle, setCustomActions,
}) => {
  const s = UI_STRINGS.settings.identificacao
  const [initial, setInitial] = React.useState<CatalogoOnlineIdentification>(() => loadCatalogoOnlineSettings().identification)
  const [draft, setDraft] = React.useState<CatalogoOnlineIdentification>(() => loadCatalogoOnlineSettings().identification)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  const isDirty = React.useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(initial),
    [draft, initial]
  )

  const handleBack = React.useCallback(() => {
    if (isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      onCancel()
    }
  }, [isDirty, onCancel])

  const handleSave = React.useCallback(() => {
    const subStatus = getSubdomainStatus(draft.subdomain)
    if (subStatus.status === "unavailable" || subStatus.status === "too-short") {
      return
    }
    const full = loadCatalogoOnlineSettings()
    saveCatalogoOnlineSettings({
      ...full,
      identification: draft,
    })
    setInitial(draft)
    onCancel()
  }, [draft, onCancel])

  const handleBackRef = React.useRef(handleBack)
  const handleSaveRef = React.useRef(handleSave)

  React.useEffect(() => {
    handleBackRef.current = handleBack
    handleSaveRef.current = handleSave
  }, [handleBack, handleSave])

  React.useEffect(() => {
    setCustomBack?.(() => () => handleBackRef.current())
    setCustomTitle?.(s.title)
    setCustomActions?.(
      <Button
        variant="primary-pill-icon"
        icon={Check}
        onClick={() => handleSaveRef.current()}
      />
    )
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, s.title])

  return (
    <>
      <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
        <Stack gap={5} w="full">
          <VisualIdentityCard
            coverImage={draft.coverImage}
            onCoverChange={(data) => setDraft((p) => ({ ...p, coverImage: data }))}
            logoImage={draft.logoImage}
            onLogoChange={(data) => setDraft((p) => ({ ...p, logoImage: data }))}
          />
          <SubdomainAreasCard
            subdomain={draft.subdomain}
            setSubdomain={(val) => setDraft((p) => ({ ...p, subdomain: val }))}
            areas={draft.areas}
            setAreas={(val) => setDraft((p) => ({ ...p, areas: val }))}
          />
          <ColorsCard
            lightColor={draft.lightColor}
            setLightColor={(val) => setDraft((p) => ({ ...p, lightColor: val }))}
            darkThemeEnabled={draft.darkThemeEnabled}
            setDarkThemeEnabled={(val) => setDraft((p) => ({ ...p, darkThemeEnabled: val }))}
            darkColor={draft.darkColor}
            setDarkColor={(val) => setDraft((p) => ({ ...p, darkColor: val }))}
          />
          <SocialNetworksCard
            facebook={draft.facebook}
            setFacebook={(val) => setDraft((p) => ({ ...p, facebook: val }))}
            instagram={draft.instagram}
            setInstagram={(val) => setDraft((p) => ({ ...p, instagram: val }))}
          />
          <Warning variant="info" icon={Info} title={s.infoNote} />
        </Stack>
      </Box>

      {/* Modal de Descarte de Alterações */}
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          onCancel()
        }}
      />
    </>
  )
}
