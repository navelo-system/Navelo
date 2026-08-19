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
import { useProducts, db } from "@/lib/dal"
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

  const [hideValues, setHideValues] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("hide-values") === "true"
    }
    return false
  })

  React.useEffect(() => {
    const handler = () => {
      setHideValues(localStorage.getItem("hide-values") === "true")
    }
    window.addEventListener("visibility-toggled", handler)
    return () => window.removeEventListener("visibility-toggled", handler)
  }, [])

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

  // Geração dinâmica de notificações reais e reativas
  const notifications: DashboardNotification[] = React.useMemo(() => {
    const list: DashboardNotification[] = []
    const d = UI_STRINGS.dashboard

    // 1. Verificação de Dados Críticos da Empresa
    if (dbCompany) {
      const missingFields: string[] = []
      if (!dbCompany.document || !dbCompany.document.trim()) {
        missingFields.push("CNPJ/CPF")
      }
      if (!dbCompany.phone || !dbCompany.phone.trim()) {
        missingFields.push("Telefone")
      }
      const hasFullAddress =
        Boolean(dbCompany.address_street && dbCompany.address_street.trim()) &&
        Boolean(dbCompany.address_neighborhood && dbCompany.address_neighborhood.trim()) &&
        Boolean(dbCompany.address_city && dbCompany.address_city.trim()) &&
        Boolean(dbCompany.address_state && dbCompany.address_state.trim()) &&
        Boolean(dbCompany.address_cep && dbCompany.address_cep.trim())

      if (!hasFullAddress) {
        missingFields.push("Endereço completo")
      }

      if (missingFields.length > 0) {
        list.push({
          id: "company-incomplete-profile",
          variant: "warning",
          title: d.incompleteCompanyTitle,
          text: formatString(d.incompleteCompanyText, { fields: missingFields.join(", ") }),
          icon: AlertTriangle,
          textButton: d.completeCompanyButton,
          onClick: () => onNavigate("configuracoes"),
        })
      }
    }

    // 2. Verificação de Estoque dos Produtos (Esgotado ou Limite Mínimo)
    if (dbProducts && dbProducts.length > 0) {
      dbProducts.forEach((p) => {
        if (p.active === false) return

        const stock = p.stock ?? 0
        const minStock = p.min_stock

        if (stock <= 0) {
          list.push({
            id: `stock-depleted-${p.id}`,
            variant: "danger",
            title: formatString(d.stockDepletedTitle, { product: p.name }),
            text: d.stockDepletedText,
            icon: AlertTriangle,
            textButton: d.adjustStockButton,
            onClick: () => onNavigate("estoque"),
          })
        } else if (minStock !== undefined && minStock > 0 && stock <= minStock) {
          list.push({
            id: `stock-low-${p.id}`,
            variant: "warning",
            title: formatString(d.stockLowTitle, { product: p.name }),
            text: formatString(d.stockLowText, {
              stock,
              minStock,
              unit: p.unit || UI_STRINGS.common.unitDefault,
            }),
            icon: AlertTriangle,
            textButton: d.adjustStockButton,
            onClick: () => onNavigate("estoque"),
          })
        }
      })
    }

    return list
  }, [dbCompany, dbProducts, onNavigate])

  const d = UI_STRINGS.dashboard

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <Stack gap={12} w="full">
        {/* Seção 1: Indicadores (apenas para ADMIN/MANAGER) */}
        {showKpis && (
          <Grid cols={2} gap={5} mobileCols={2}>
            <KpiCard
              title={d.salesKpi}
              value="R$ 0,00"
              subtitle={d.salesTodaySubtitle}
              hideValues={hideValues}
              onClick={() => onNavigate("vendas")}
            />
            <KpiCard
              title={d.cashTotalKpi}
              value="R$ 45,00"
              subtitle="16/06/26 16:00"
              hideValues={hideValues}
              onClick={() => onNavigate("totais-em-caixa")}
            />
            <KpiCard
              title={d.receivablesKpi}
              value="R$ 0,00"
              subtitle={d.receivablesSubtitle}
              hideValues={hideValues}
              onClick={() => onNavigate("contas-a-receber")}
            />
            {hasDigitalAccount && (
              <KpiCard
                title={d.digitalAccountKpi}
                value="R$ 0,00"
                subtitle={d.availableBalance}
                hideValues={hideValues}
                onClick={() => onNavigate("conta-digital")}
              />
            )}
          </Grid>
        )}

        {/* Seção 2: Bento Grid de Módulos (filtrado por role) */}
        <BentoPDVModulesGrid onNavigate={onNavigate} userRole={userRole} />

        {/* Seção 3: Notificações Funcionais Empilhadas Verticalmente (Estoque, Cadastro, etc.) */}
        {showKpis && notifications.length > 0 && (
          <Stack gap={2.5} w="full">
            {notifications.map((notif) => (
              <Warning
                key={notif.id}
                variant={notif.variant}
                title={notif.title}
                text={notif.text}
                icon={notif.icon}
                textButton={notif.textButton}
                onClick={notif.onClick}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

