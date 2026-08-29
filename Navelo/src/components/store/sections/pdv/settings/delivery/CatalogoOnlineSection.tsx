"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Switch } from "@/components/store/base/Switch"
import { Icon } from "@/components/store/base/Icon"
import { Badge } from "@/components/store/base/Badge"
import { CircularIcon } from "@/components/store/intermediary/CircularIcon"
import { useTenant } from "@/lib/context/TenantContext"
import { db } from "@/lib/dal/db"
import { useProducts } from "@/lib/dal"
import {
  loadCatalogoOnlineSettings,
  patchCatalogoOnlineSettings,
  resolveDynamicCatalogUrl,
  CATALOGO_ONLINE_SETTINGS_EVENT,
  formatScheduleSummary,
  formatPaymentsSummary,
  formatDeliverySummary,
  formatOrdersSummary,
} from "@/lib/sync/catalogoOnlineSettings"
import { useLiveQuery } from "dexie-react-hooks"
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

function CatalogoOnlineUrlRow({ enabled, catalogUrl }: { enabled: boolean; catalogUrl: string }) {
  const s = UI_STRINGS.onlineCatalog
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(catalogUrl).then(() => {
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
            <Font as="p" variant="description" text={catalogUrl} color={enabled ? "primary" : "muted"} truncate={true} />
          </Box>
        </Stack>
        <Stack direction="row" align="center" gap={2.5} flex="none">
          <Box cursor="pointer" onClick={() => window.open(catalogUrl, "_blank")} title={s.openInBrowserTooltip}>
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
            <CircularIcon variant="secondary" icon={icon} size={20} />
            <Stack gap={1} flex="1">
              <Font variant="body-bold" text={title} align="left" />
              {subtitle && <Font variant="description" text={subtitle} color="muted" align="left" />}
              {badgeText && (
                <Box display="block md:hidden">
                  <Badge variant="success" label={badgeText} icon={Check} />
                </Box>
              )}
            </Stack>
          </Stack>
          <Stack direction="row" align="center" justify="end" gap={2.5}>
            {badgeText && (
              <Box display="hidden md:block">
                <Badge variant="success" label={badgeText} icon={Check} />
              </Box>
            )}
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
  const s = UI_STRINGS.onlineCatalog
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const dbCompany = useLiveQuery(async () => (tenantId ? await db.companies.get(tenantId) : null), [tenantId])
  const dbProducts = useProducts(tenantId)
  const [catalogSettings, setCatalogSettings] = React.useState(() => loadCatalogoOnlineSettings())

  React.useEffect(() => {
    const handleUpdate = () => setCatalogSettings(loadCatalogoOnlineSettings())
    window.addEventListener(CATALOGO_ONLINE_SETTINGS_EVENT, handleUpdate)
    window.addEventListener("storage", handleUpdate)
    return () => {
      window.removeEventListener(CATALOGO_ONLINE_SETTINGS_EVENT, handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [])

  const totalProducts = dbProducts?.length || 0
  const selectedCount = catalogSettings.allProductsSelected
    ? totalProducts
    : catalogSettings.selectedProductIds.filter((id) => dbProducts?.some((p) => p.id === id)).length

  const productsSubtitle =
    selectedCount === 1
      ? "1 produto selecionado"
      : selectedCount === 0
        ? "Nenhum produto selecionado"
        : `${selectedCount} produtos selecionados`

  const defaultCompanyName =
    dbCompany?.trade_name ||
    dbCompany?.name ||
    tenantCtx?.currentTenant?.tradingName ||
    tenantCtx?.currentTenant?.corporateName ||
    "basenavelo"

  const slug = (
    catalogSettings.identification.subdomain ||
    defaultCompanyName.toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "basenavelo"
  ).trim()

  const catalogUrl = React.useMemo(() => resolveDynamicCatalogUrl(slug), [slug])

  const scheduleSubtitle = formatScheduleSummary(catalogSettings.schedule)
  const paymentsSubtitle = formatPaymentsSummary(catalogSettings.payments)
  const deliverySubtitle = formatDeliverySummary(catalogSettings.delivery)
  const ordersSubtitle = formatOrdersSummary(catalogSettings.orders)
  const whatsappBadge = catalogSettings.whatsapp.enabled ? s.enabledBadge : undefined

  React.useEffect(() => {
    setCustomBack?.(() => () => onCancel())
    setCustomTitle?.(s.title)
    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
    }
  }, [setCustomBack, setCustomTitle, onCancel, s.title])

  const handleToggleEnabled = (val: boolean) => {
    const updated = patchCatalogoOnlineSettings({ enabled: val })
    setCatalogSettings(updated)
  }

  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
      <Box padding={5} w="full">
        <Stack direction="row" align="center" justify="between" w="full" gap={5}>
          <Stack gap={1}>
            <Font variant="body-bold" text={UI_STRINGS.selfService.enableToggle} />
            <Font variant="description" text={s.enableDesc} color="muted" />
          </Stack>
          <Switch checked={catalogSettings.enabled} onChange={(e) => handleToggleEnabled(e.target.checked)} />
        </Stack>
      </Box>

      <Box h="h-[1px]" w="full" bg="bg-border" />
      <CatalogoOnlineUrlRow enabled={catalogSettings.enabled} catalogUrl={catalogUrl} />

      <CatalogoNavItem icon={LayoutGrid} title={s.identificationTitle} subtitle={slug} onClick={() => onNavigate("identificacao")} />
      <CatalogoNavItem icon={LayoutGrid} title={s.productsTitle} subtitle={productsSubtitle} onClick={() => onNavigate("catalogo-produtos")} />
      <CatalogoNavItem icon={Clock} title={s.businessHoursTitle} subtitle={scheduleSubtitle} onClick={() => onNavigate("horario-atendimento")} />
      <CatalogoNavItem icon={CreditCard} title={s.paymentMethodsTitle} subtitle={paymentsSubtitle} onClick={() => onNavigate("formas-pagamento")} />
      <CatalogoNavItem icon={MessageSquare} title={s.whatsappTitle} subtitle={s.whatsappDesc} badgeText={whatsappBadge} onClick={() => onNavigate("whatsapp")} />
      <CatalogoNavItem icon={Truck} title={s.deliveryOptionsTitle} subtitle={deliverySubtitle} onClick={() => onNavigate("opcao-entrega")} />
      <CatalogoNavItem icon={Settings} title={s.orderOptionsTitle} subtitle={ordersSubtitle} onClick={() => onNavigate("opcao-pedido")} />
    </Box>
  )
}
