"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Switch } from "@/components/store/base/Switch"
import { Icon } from "@/components/store/base/Icon"
import { BookOpen, ChevronRight, Copy, ExternalLink, LayoutGrid, Settings } from "lucide-react"
import { UI_STRINGS, formatString } from "@/constants/strings"

export interface MenuDigitalSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  onNavigate: (subView: string) => void
}

const MENU_URL = "https://basenavelo.menudigital.net.br"

function MenuDigitalHeaderRow({
  enabled, setEnabled,
}: {
  enabled: boolean
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const s = UI_STRINGS.digitalMenu
  return (
    <Box padding={5} w="full">
      <Stack direction="row" align="center" justify="between" w="full" gap={5}>
        <Stack gap={1}>
          <Font variant="body-bold" text={s.title} />
          <Font variant="description" text={s.headerDesc} color="muted" />
        </Stack>
        <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
      </Stack>
    </Box>
  )
}

function MenuDigitalUrlRow({
  enabled, copied, onCopy, onOpenUrl,
}: {
  enabled: boolean
  copied: boolean
  onCopy: () => void
  onOpenUrl: () => void
}) {
  const s = UI_STRINGS.digitalMenu
  return (
    <Box padding={5} w="full">
      <Stack direction="row" align="center" justify="between" w="full" gap={5}>
        <Stack direction="row" align="center" gap={2.5}>
          <Icon icon={BookOpen} size={16} color="primary" />
          <Font variant="description" text={MENU_URL} color={enabled ? "primary" : "muted"} />
        </Stack>
        <Stack direction="row" align="center" gap={2.5}>
          <Button variant="ghost" icon={ExternalLink} onClick={onOpenUrl} title={s.openInBrowserTooltip} />
          <Button variant="ghost" icon={Copy} onClick={onCopy} title={copied ? s.copiedTooltip : s.copyUrlButton} />
        </Stack>
      </Stack>
    </Box>
  )
}

function MenuDigitalNavigationRows({ onNavigate }: { onNavigate: (subView: string) => void }) {
  const s = UI_STRINGS.digitalMenu
  return (
    <>
      <Box padding={5} cursor="pointer" hoverBg="primary/10" onClick={() => onNavigate("identificacao")} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={5}>
            <Icon icon={LayoutGrid} size={20} color="primary" />
            <Stack gap={1}>
              <Font variant="body-bold" text={UI_STRINGS.settings.identificacao.title} />
              <Font variant="description" text={UI_STRINGS.settings.identificacao.subdomainPlaceholder} color="muted" />
            </Stack>
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <Box padding={5} cursor="pointer" hoverBg="primary/10" onClick={() => onNavigate("catalogo-produtos")} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={5}>
            <Icon icon={LayoutGrid} size={20} color="primary" />
            <Stack gap={1}>
              <Font variant="body-bold" text={UI_STRINGS.printPoints.categoriesLabel} />
              <Font variant="description" text={formatString(s.selectedProductsTemplate, { count: 52 })} color="muted" />
            </Stack>
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <Box padding={5} cursor="pointer" hoverBg="primary/10" onClick={() => onNavigate("opcao-pedido-menu-digital")} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={5}>
            <Icon icon={Settings} size={20} color="primary" />
            <Font variant="body-bold" text={UI_STRINGS.orderOptions.title} />
          </Stack>
          <Icon icon={ChevronRight} size={16} color="muted" />
        </Stack>
      </Box>
    </>
  )
}

export const MenuDigitalSection: React.FC<MenuDigitalSectionProps> = ({
  onCancel, setCustomBack, setCustomTitle, onNavigate,
}) => {
  const [enabled, setEnabled] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const s = UI_STRINGS.digitalMenu

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => { setCustomBack?.(null); setCustomTitle?.(null) }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  const handleCopy = () => {
    navigator.clipboard.writeText(MENU_URL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleOpenUrl = () => {
    window.open(MENU_URL, "_blank")
  }

  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
      <MenuDigitalHeaderRow enabled={enabled} setEnabled={setEnabled} />
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <MenuDigitalUrlRow enabled={enabled} copied={copied} onCopy={handleCopy} onOpenUrl={handleOpenUrl} />
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <MenuDigitalNavigationRows onNavigate={onNavigate} />
    </Box>
  )
}
