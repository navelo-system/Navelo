"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Warning } from "@/components/store/base/Warning"
import { KpiCard } from "@/components/store/intermediary/KpiCard"
import { BentoPDVModulesGrid } from "@/components/store/advanced/BentoPDVModulesGrid"
import { useTenant } from "@/lib/context/TenantContext"
import { ROLE_SHOW_KPIS } from "@/lib/permissions"
import { useProducts, useSales, useCashMovements, useTabs, db, Product, Company } from "@/lib/dal"
import { useLiveQuery } from "dexie-react-hooks"
import { AlertTriangle, LucideIcon } from "lucide-react"
import { UI_STRINGS, formatString } from "@/constants/strings"

interface DashboardSectionProps {
  onNavigate: (view: string) => void
}

interface DashboardNotification {
  id: string
  variant: "warning" | "danger" | "info" | "success"
  title: string
  text: string
  icon: LucideIcon
  textButton: string
  onClick: () => void
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function formatDateTimeShort(date: Date) {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = String(date.getFullYear()).slice(-2)
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

function useDashboardKpiMetrics(tenantId?: string) {
  const dbSales = useSales(tenantId)
  const dbMovements = useCashMovements(tenantId)
  const dbTabs = useTabs(tenantId)

  return React.useMemo(() => {
    const today = new Date().toDateString()
    const todaySales = (dbSales || []).filter((s) => s.created_at && new Date(s.created_at).toDateString() === today)
    const todaySalesTotal = todaySales.reduce((acc, s) => acc + (s.total || 0), 0)
    const todaySalesCount = todaySales.length

    let dinheiroSales = 0
    let lastMovementTime: Date | null = null
    ;(dbSales || []).forEach((s) => {
      const pm = s.payment_method || "Dinheiro"
      if (pm.includes("Dinheiro")) dinheiroSales += (s.total || 0)
      if (s.created_at) {
        const d = new Date(s.created_at)
        if (!lastMovementTime || d > lastMovementTime) lastMovementTime = d
      }
    })

    let sangria = 0
    let suprimento = 0
    ;(dbMovements || []).forEach((m) => {
      if (m.type === "BLEED") sangria += m.amount
      else if (m.type === "SUPPLY") suprimento += m.amount
      if (m.created_at) {
        const d = new Date(m.created_at)
        if (!lastMovementTime || d > lastMovementTime) lastMovementTime = d
      }
    })

    const gavetaTotal = dinheiroSales + suprimento - sangria

    let receivablesTotal = 0
    let receivablesCount = 0

    ;(dbSales || []).forEach((sale) => {
      const method = (sale.payment_method || "").toLowerCase()
      if (method.includes("crediário") || method.includes("crediario") || method.includes("prazo") || method.includes("boleto") || sale.status === "PENDING") {
        receivablesTotal += (sale.total || 0)
        receivablesCount += 1
      }
    })

    ;(dbTabs || []).forEach((tab) => {
      if ((tab.status === "OPEN" || !tab.status) && (tab.total || 0) > 0) {
        receivablesTotal += (tab.total || 0)
        receivablesCount += 1
      }
    })

    const receivablesSubtitle = receivablesCount === 1 ? "1 em aberto" : `${receivablesCount} em aberto`

    return {
      salesValue: formatPrice(todaySalesTotal),
      salesSubtitle: `Hoje - ${todaySalesCount} ${todaySalesCount === 1 ? "venda realizada" : "vendas realizadas"}`,
      cashTotalValue: formatPrice(gavetaTotal),
      cashTotalSubtitle: lastMovementTime ? formatDateTimeShort(lastMovementTime) : formatDateTimeShort(new Date()),
      receivablesValue: formatPrice(receivablesTotal),
      receivablesSubtitle,
      digitalAccountValue: formatPrice(0),
    }
  }, [dbSales, dbMovements, dbTabs])
}

function useDashboardVisibilityState() {
  const [hideValues, setHideValues] = React.useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("hide-values") === "true"
    return false
  })
  React.useEffect(() => {
    const handler = () => setHideValues(localStorage.getItem("hide-values") === "true")
    window.addEventListener("visibility-toggled", handler)
    return () => window.removeEventListener("visibility-toggled", handler)
  }, [])
  return { hideValues }
}

function useDashboardDigitalAccountState() {
  const [hasDigitalAccount, setHasDigitalAccount] = React.useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("navelo_digital_account_config")
        if (saved) return Boolean(JSON.parse(saved).enabled)
      } catch {
        return false
      }
    }
    return false
  })

  React.useEffect(() => {
    const handler = () => {
      try {
        const saved = localStorage.getItem("navelo_digital_account_config")
        setHasDigitalAccount(saved ? Boolean(JSON.parse(saved).enabled) : false)
      } catch {
        setHasDigitalAccount(false)
      }
    }
    window.addEventListener("digital-account-updated", handler)
    return () => window.removeEventListener("digital-account-updated", handler)
  }, [])

  return { hasDigitalAccount }
}

function hasCompleteAddress(company: Company): boolean {
  return Boolean(
    company.address_street?.trim() &&
    company.address_neighborhood?.trim() &&
    company.address_city?.trim() &&
    company.address_state?.trim() &&
    company.address_cep?.trim()
  )
}

function findMissingCompanyFields(company: Company): string[] {
  const missing: string[] = []
  if (!company.document?.trim()) missing.push("CNPJ/CPF")
  if (!company.phone?.trim()) missing.push("Telefone")
  if (!hasCompleteAddress(company)) missing.push("Endereço completo")
  return missing
}

function checkCompanyNotifications(dbCompany: Company | null | undefined, onNavigate: (v: string) => void): DashboardNotification[] {
  if (!dbCompany) return []
  const missing = findMissingCompanyFields(dbCompany)
  if (missing.length === 0) return []

  const d = UI_STRINGS.dashboard
  return [{
    id: "company-incomplete-profile",
    variant: "warning",
    title: d.incompleteCompanyTitle,
    text: formatString(d.incompleteCompanyText, { fields: missing.join(", ") }),
    icon: AlertTriangle,
    textButton: d.completeCompanyButton,
    onClick: () => onNavigate("configuracoes"),
  }]
}

function checkSingleProductStock(p: Product, onNavigate: (v: string) => void): DashboardNotification | null {
  if (p.active === false) return null
  const d = UI_STRINGS.dashboard
  const stock = p.stock ?? 0
  const minStock = p.min_stock

  if (stock <= 0) {
    return {
      id: `stock-depleted-${p.id}`, variant: "danger",
      title: formatString(d.stockDepletedTitle, { product: p.name }), text: d.stockDepletedText,
      icon: AlertTriangle, textButton: d.adjustStockButton, onClick: () => onNavigate("estoque"),
    }
  }
  if (minStock !== undefined && minStock > 0 && stock <= minStock) {
    return {
      id: `stock-low-${p.id}`, variant: "warning",
      title: formatString(d.stockLowTitle, { product: p.name }),
      text: formatString(d.stockLowText, { stock, minStock, unit: p.unit || UI_STRINGS.common.unitDefault }),
      icon: AlertTriangle, textButton: d.adjustStockButton, onClick: () => onNavigate("estoque"),
    }
  }
  return null
}

function checkProductStockNotifications(dbProducts: Product[] | undefined, onNavigate: (v: string) => void): DashboardNotification[] {
  if (!dbProducts || dbProducts.length === 0) return []
  const list: DashboardNotification[] = []
  dbProducts.forEach((p) => {
    const notif = checkSingleProductStock(p, onNavigate)
    if (notif) list.push(notif)
  })
  return list
}

function DashboardKpiSection({
  showKpis, hideValues, hasDigitalAccount, onNavigate, kpis,
}: {
  showKpis: boolean
  hideValues: boolean
  hasDigitalAccount: boolean
  onNavigate: (v: string) => void
  kpis: ReturnType<typeof useDashboardKpiMetrics>
}) {
  if (!showKpis) return null
  const d = UI_STRINGS.dashboard
  return (
    <Grid cols={2} gap={5} mobileCols={2}>
      <KpiCard title={d.salesKpi} value={kpis.salesValue} subtitle={kpis.salesSubtitle} hideValues={hideValues} onClick={() => onNavigate("vendas")} />
      <KpiCard title={d.cashTotalKpi} value={kpis.cashTotalValue} subtitle={kpis.cashTotalSubtitle} hideValues={hideValues} onClick={() => onNavigate("totais-em-caixa")} />
      <KpiCard title={d.receivablesKpi} value={kpis.receivablesValue} subtitle={kpis.receivablesSubtitle} hideValues={hideValues} onClick={() => onNavigate("contas-a-receber")} />
      {hasDigitalAccount && <KpiCard title={d.digitalAccountKpi} value={kpis.digitalAccountValue} subtitle={d.availableBalance} hideValues={hideValues} onClick={() => onNavigate("conta-digital")} />}
    </Grid>
  )
}

function DashboardNotificationSection({
  showKpis, notifications,
}: {
  showKpis: boolean
  notifications: DashboardNotification[]
}) {
  if (!showKpis || notifications.length === 0) return null
  return (
    <Stack gap={2.5} w="full">
      {notifications.map((notif) => (
        <Warning
          key={notif.id} variant={notif.variant} title={notif.title} text={notif.text}
          icon={notif.icon} textButton={notif.textButton} onClick={notif.onClick}
        />
      ))}
    </Stack>
  )
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({ onNavigate }) => {
  const tenantCtx = useTenant()
  const userRole = tenantCtx?.currentUser?.role
  const tenantId = tenantCtx?.currentTenant?.id
  const showKpis = userRole ? (ROLE_SHOW_KPIS[userRole] ?? false) : true

  const dbProducts = useProducts(tenantId)
  const dbCompany = useLiveQuery(async () => {
    if (!tenantId) return null
    return await db.companies.get(tenantId)
  }, [tenantId])

  const { hideValues } = useDashboardVisibilityState()
  const { hasDigitalAccount } = useDashboardDigitalAccountState()
  const kpis = useDashboardKpiMetrics(tenantId)

  const notifications: DashboardNotification[] = React.useMemo(() => {
    return [
      ...checkCompanyNotifications(dbCompany, onNavigate),
      ...checkProductStockNotifications(dbProducts, onNavigate),
    ]
  }, [dbCompany, dbProducts, onNavigate])

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <Stack gap={12} w="full">
        <DashboardKpiSection showKpis={showKpis} hideValues={hideValues} hasDigitalAccount={hasDigitalAccount} onNavigate={onNavigate} kpis={kpis} />
        <BentoPDVModulesGrid onNavigate={onNavigate} userRole={userRole} />
        <DashboardNotificationSection showKpis={showKpis} notifications={notifications} />
      </Stack>
    </Box>
  )
}
