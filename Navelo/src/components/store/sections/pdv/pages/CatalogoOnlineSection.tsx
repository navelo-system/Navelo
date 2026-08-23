"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Icon } from "@/components/store/base/Icon"
import { Badge } from "@/components/store/base/Badge"
import {
  Globe,
  ChevronRight,
  Copy,
  ExternalLink,
  LayoutGrid,
  Clock,
  CreditCard,
  MessageSquare,
  Truck,
  Settings,
  Check,
  type LucideIcon,
} from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface CatalogoOnlineSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  onNavigate: (subView: string) => void
}

const CATALOG_URL = "https://basenavelo.comercio.net.br"

function CatalogoOnlineUrlRow({ enabled }: { enabled: boolean }) {
  const s = UI_STRINGS.onlineCatalog
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(CATALOG_URL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Box padding={5} w="full">
      <Stack direction="row" align="center" justify="between" w="full" gap={5}>
        <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
          <Box shrink="0">
            <Icon icon={Globe} size={16} color="primary" />
          </Box>
          <Box flex="1" minW="min-w-0">
            <Font as="p" variant="description" text={CATALOG_URL} color={enabled ? "primary" : "muted"} truncate={true} />
          </Box>
        </Stack>
        <Stack direction="row" align="center" gap={2.5} flex="none">
          <Box cursor="pointer" onClick={() => window.open(CATALOG_URL, "_blank")} title={s.openInBrowserTooltip}>
            <Icon icon={ExternalLink} size={16} color={enabled ? "primary" : "muted"} />
          </Box>
          <Box cursor="pointer" onClick={handleCopy} title={copied ? s.copiedTooltip : s.copyUrlTooltip}>
            <Icon icon={Copy} size={16} color={enabled ? "primary" : "muted"} />
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}

function CatalogoNavItem({
  icon,
  title,
  subtitle,
  badgeText,
  onClick,
}: {
  icon: LucideIcon
  title: string
  subtitle?: string
  badgeText?: string
  onClick: () => void
}) {
  return (
    <>
      <Box h="h-[1px]" w="full" bg="bg-border" />
      <Box padding={5} cursor="pointer" hoverBg="secondary/10" onClick={onClick} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack direction="row" align="center" gap={5} flex="1">
            <Icon icon={icon} size={20} color="primary" />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={title} align="left" />
              {subtitle && <Font variant="description" text={subtitle} color="muted" align="left" />}
            </Stack>
          </Stack>
          <Stack direction="row" align="center" justify="end" gap={2.5}>
            {badgeText && <Badge variant="success" label={badgeText} icon={Check} />}
            <Icon icon={ChevronRight} size={16} color="muted" />
          </Stack>
        </Stack>
      </Box>
    </>
  )
}

export const CatalogoOnlineSection: React.FC<CatalogoOnlineSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  onNavigate,
}) => {
  const [enabled, setEnabled] = React.useState(true)
  const s = UI_STRINGS.onlineCatalog

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
      <Box padding={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack gap={1}>
            <Font variant="body-bold" text={UI_STRINGS.selfService.enableToggle} />
            <Font variant="description" text={s.enableDesc} color="muted" />
          </Stack>
          <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        </Stack>
      </Box>

      <Box h="h-[1px]" w="full" bg="bg-border" />
      <CatalogoOnlineUrlRow enabled={enabled} />

      <CatalogoNavItem icon={LayoutGrid} title={s.identificationTitle} subtitle={s.identificationSlug} onClick={() => onNavigate("identificacao")} />
      <CatalogoNavItem icon={LayoutGrid} title={s.productsTitle} subtitle={s.productsSelectedCount} onClick={() => onNavigate("catalogo-produtos")} />
      <CatalogoNavItem icon={Clock} title={s.businessHoursTitle} subtitle={s.everydayText} onClick={() => onNavigate("horario-atendimento")} />
      <CatalogoNavItem icon={CreditCard} title={s.paymentMethodsTitle} onClick={() => onNavigate("formas-pagamento")} />
      <CatalogoNavItem icon={MessageSquare} title={s.whatsappTitle} subtitle={s.whatsappDesc} badgeText={s.enabledBadge} onClick={() => onNavigate("whatsapp")} />
      <CatalogoNavItem icon={Truck} title={s.deliveryOptionsTitle} onClick={() => onNavigate("opcao-entrega")} />
      <CatalogoNavItem icon={Settings} title={s.orderOptionsTitle} onClick={() => onNavigate("opcao-pedido")} />
    </Box>
  )
}
