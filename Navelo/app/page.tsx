"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { RegistryMain } from "@/components/store/advanced/RegistryMain"
import { PdvHeaderSection } from "@/components/store/advanced/PdvHeaderSection"
import { LoginSection } from "@/components/store/sections/pdv/pages/LoginSection"
import { AcessoEmpresaSection } from "@/components/store/sections/pdv/pages/AcessoEmpresaSection"
import { DashboardSection } from "@/components/store/sections/pdv/pages/DashboardSection"
import { PdvSection } from "@/components/store/sections/pdv/pages/PdvSection"
import { ComandasSection } from "@/components/store/sections/pdv/pages/ComandasSection"
import { DeliverySection } from "@/components/store/sections/pdv/pages/DeliverySection"
import { EstoqueSection } from "@/components/store/sections/pdv/pages/EstoqueSection"
import { ProdutosSection } from "@/components/store/sections/pdv/pages/ProdutosSection"
import { ClientesSection } from "@/components/store/sections/pdv/pages/ClientesSection"
import { RelatoriosSection } from "@/components/store/sections/pdv/pages/RelatoriosSection"
import { ConfiguracoesSection } from "@/components/store/sections/pdv/pages/ConfiguracoesSection"
import { VendasSection } from "@/components/store/sections/pdv/pages/VendasSection"
import { TotaisEmCaixaSection } from "@/components/store/sections/pdv/pages/TotaisEmCaixaSection"
import { ContasAReceberSection } from "@/components/store/sections/pdv/pages/ContasAReceberSection"
import { ContaDigitalSection } from "@/components/store/sections/pdv/pages/ContaDigitalSection"
import { Button } from "@/components/store/base/Button"
import { ViewTransition } from "@/components/store/base/ViewTransition"
import { ThemeCustomizerModal, applyThemeColors, loadSavedTheme } from "@/components/store/sections/pdv/modals/ThemeCustomizerModal"
import { TenantProvider, useTenant } from "@/lib/context/TenantContext"
import { NavigationProvider, useAppNavigation } from "@/lib/navigation/NavigationContext"
import { normalizeUserRole } from "@/lib/permissions"
import { UserRole } from "@/types/domain"
import { ConsultaPrecoTerminalScreen } from "@/components/store/advanced/ConsultaPrecoTerminalScreen"
import { loadConsultaPrecoSettings } from "@/components/store/sections/pdv/settings/catalog/ConsultaPrecoSection"
import { useTabs, useSyncStatus, dal } from "@/lib/dal"
import { initialSync, processSyncQueue, subscribeToRealtimeSync } from "@/lib/dal/sync"
import { DEVICE_SYNC_SETTINGS_EVENT, isDeviceSyncEnabled, isLanSyncConfigured } from "@/lib/sync/deviceSyncSettings"
import { startLanHubWatchdog } from "@/lib/sync/lanDiscovery"
import { db, TabEntity } from "@/lib/dal/db"
import { useLiveQuery } from "dexie-react-hooks"
import {
  ShoppingBag,
  Receipt,
  Bike,
  Package,
  Layers,
  Users,
  BarChart3,
  Settings,
  Terminal,
  LucideIcon
} from "lucide-react"

const viewIconMap: Record<string, LucideIcon> = {
  dashboard: Terminal,
  caixa: ShoppingBag,
  comandas: Receipt,
  delivery: Bike,
  estoque: Package,
  produtos: Layers,
  clientes: Users,
  relatorios: BarChart3,
  configuracoes: Settings,
}

function HomeContent() {
  const tenantCtx = useTenant()
  const nav = useAppNavigation()
  const [isMounted, setIsMounted] = React.useState(false)
  const [operator, setOperator] = React.useState<string | null>(null)

  const currentView = nav.currentRoute.view
  const [customBack, setCustomBack] = React.useState<(() => void) | null>(null)
  const [customTitle, setCustomTitle] = React.useState<string | null>(null)
  const [customActions, setCustomActions] = React.useState<React.ReactNode | null>(null)
  const [activeComandaId, setActiveComandaId] = React.useState<string | null>(null)
  const [isThemeModalOpen, setIsThemeModalOpen] = React.useState<boolean>(false)

  const handleSetCustomBack = React.useCallback((cb: (() => void) | null) => {
    setCustomBack(() => cb)
  }, [])

  const handleSetCustomTitle = React.useCallback((title: string | null) => {
    setCustomTitle((prev) => (prev === title ? prev : title))
  }, [])

  const handleSetCustomActions = React.useCallback((actions: React.ReactNode | null) => {
    setCustomActions(actions)
  }, [])

  const setCurrentView = React.useCallback((target: string, isBack = false) => {
    setCustomTitle(null)
    setCustomActions(null)
    setCustomBack(null)
    if (isBack) {
      nav.goBack(target)
    } else {
      nav.navigate(target)
    }
  }, [nav])

  const handleRegistryBack = React.useCallback(() => {
    if (customBack) {
      let currentFn: unknown = customBack
      while (typeof currentFn === "function") {
        currentFn = (currentFn as () => unknown)()
      }
    } else {
      setActiveComandaId(null)
      setCurrentView("dashboard", true)
    }
  }, [customBack, setCurrentView])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
      applyThemeColors(loadSavedTheme())
      const savedOperator = sessionStorage.getItem("pdv-operator")
      if (savedOperator) {
        setOperator(savedOperator)
      } else {
        nav.navigate("#login", { replace: true })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [nav])

  // Persiste o operador no sessionStorage ao alterar (apenas logout do usuário, preservando o tenant)
  React.useEffect(() => {
    if (!isMounted) return
    if (operator) {
      sessionStorage.setItem("pdv-operator", operator)
    } else {
      sessionStorage.removeItem("pdv-operator")
      tenantCtx.logoutUserSession()
      nav.navigate("#login", { replace: true })
    }
  }, [operator, isMounted, tenantCtx, nav])

  // Comandas reativas e status de sincronização do IndexedDB local (Dexie)
  const tenantId = tenantCtx?.currentTenant?.id || "tenant-11111111111111"
  const dbTabs = useTabs(tenantId)
  const syncStatus = useSyncStatus()

  const dbCompany = useLiveQuery(async () => {
    if (!tenantId) return null
    return await db.companies.get(tenantId)
  }, [tenantId])

  const companyDisplayName =
    dbCompany?.trade_name ||
    dbCompany?.name ||
    tenantCtx?.currentTenant?.tradingName ||
    tenantCtx?.currentTenant?.corporateName ||
    tenantCtx?.platformSettings?.platformName ||
    "Navelo - PDV"

  // Sincronização contínua e em tempo real da Fonte Primária (Supabase)
  const [syncEpoch, setSyncEpoch] = React.useState(0)
  React.useEffect(() => {
    const onSettingsChange = () => setSyncEpoch((n) => n + 1)
    window.addEventListener(DEVICE_SYNC_SETTINGS_EVENT, onSettingsChange)
    return () => window.removeEventListener(DEVICE_SYNC_SETTINGS_EVENT, onSettingsChange)
  }, [])

  React.useEffect(() => {
    if (!tenantId || !isDeviceSyncEnabled()) return

    const stopLanWatchdog = isLanSyncConfigured() ? startLanHubWatchdog() : () => {}
    initialSync(tenantId)
    processSyncQueue()

    const unsubscribe = subscribeToRealtimeSync(tenantId)

    const handleOnline = () => {
      initialSync(tenantId)
      processSyncQueue()
    }

    const handleFocus = () => {
      initialSync(tenantId)
      processSyncQueue()
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("focus", handleFocus)

    const interval = setInterval(() => {
      initialSync(tenantId)
      processSyncQueue()
    }, 20000)

    return () => {
      stopLanWatchdog()
      unsubscribe()
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("focus", handleFocus)
      clearInterval(interval)
    }
  }, [tenantId, syncEpoch])

  const comandas = React.useMemo(() => {
    if (dbTabs && dbTabs.length > 0) {
      return dbTabs
        .filter((t: TabEntity) => t.status === 'OPEN' || !t.status)
        .map((t: TabEntity) => ({
          id: t.id,
          label: t.label || t.code || `#${t.id}`,
          time: t.time || (t.created_at ? new Date(t.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "00:01"),
          total: t.total || 0
        }))
    }
    return []
  }, [dbTabs])

  const isCaixaFlow = [
    "caixa", "pagamento", "recibo", "delivery-confirm", "devolucao",
    "recebimentos", "sangrias-suprimentos", "pdv-customizacao", "numero-atendimento"
  ].includes(currentView)

  const isComandasFlow = ["comandas", "finalizar-atendimentos"].includes(currentView)
  const isDeliveryFlow = ["delivery", "novo-delivery", "entregadores", "taxas-entrega"].includes(currentView)
  const isEstoqueFlow = ["estoque", "auditoria", "notas", "entradas"].includes(currentView)
  const isProdutosFlow = ["produtos", "novo-produto"].includes(currentView)
  const isClientesFlow = ["clientes", "novo-cliente"].includes(currentView)
  const isRelatoriosFlow = [
    "relatorios", "comissoes", "deliveries", "evolucao", "extrato", "margem", "taxas",
    "vendas-produto", "relatorio-crediario", "caixa-totais", "caixa-pagamentos", "xml-export", "nf-sales"
  ].includes(currentView)
  const isConfiguracoesFlow = [
    "configuracoes", "dados-empresa", "sincronizacao", "usuarios", "novo-usuario",
    "restricoes", "autorizacoes", "nota-fiscal", "nota-fiscal-config", "pagamento-integrado",
    "ordem-pagamento", "pix", "crediario", "catalogo-online", "identificacao",
    "catalogo-produtos", "horario-atendimento", "formas-pagamento", "whatsapp",
    "opcao-entrega", "opcao-pedido", "opcao-pedido-menu-digital", "ifood", "taxa-entrega",
    "consulta-preco", "pesagem-automatica", "menu-digital", "mesas-comandas",
    "configurar-comandas", "taxas-servico", "autoatendimento", "autoatendimento-cartao",
    "autoatendimento-pix", "autoatendimento-customizacao", "autoatendimento-numero",
    "grupos-subgrupos", "unidades", "fornecedores", "cidades", "impressora",
    "pontos-impressao", "comprovantes", "balanca-checkout", "balanca-etiquetadora", "backup"
  ].includes(currentView)

  const handleLoginSuccess = (operatorName: string) => {
    setOperator(operatorName)
    nav.navigate("#dashboard", { replace: true })
  }

  const handleSelectComanda = (id: string) => {
    setActiveComandaId(id)
    nav.navigate("#caixa")
  }

  const handleAddComanda = async (label: string) => {
    await dal.tabs.create({
      id: crypto.randomUUID(),
      label: label,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      total: 0.00,
      status: "OPEN",
      created_at: new Date().toISOString(),
      company_id: tenantId || "demo-tenant",
      tenant_id: tenantId || "demo-tenant",
    })
  }

  const handleBatchCheckoutComandas = (comandaIds: string[]) => {
    if (comandaIds.length === 0) return
    const batchId = `batch:${comandaIds.join(",")}`
    setActiveComandaId(batchId)
    nav.navigate("#caixa")
  }

  const handleCloseComanda = async (id: string) => {
    if (id) {
      if (id.startsWith("batch:")) {
        const ids = id.replace("batch:", "").split(",")
        for (const singleId of ids) {
          if (singleId && !singleId.startsWith("avulso-")) {
            try {
              const existing = await db.tabs.get(singleId)
              if (existing?.is_fixed) {
                await dal.tabs.update({ ...existing, items: [], total: 0, observation: undefined, status: "OPEN" })
              } else {
                await dal.tabs.delete(singleId, tenantId || "demo-tenant")
              }
            } catch (err) {
              console.error("Erro ao fechar comanda do lote na DAL:", err)
            }
          }
        }
      } else if (!id.startsWith("avulso-")) {
        try {
          const existing = await db.tabs.get(id)
          if (existing?.is_fixed) {
            await dal.tabs.update({ ...existing, items: [], total: 0, observation: undefined, status: "OPEN" })
          } else {
            await dal.tabs.delete(id, tenantId || "demo-tenant")
          }
        } catch (err) {
          console.error("Erro ao fechar comanda na DAL:", err)
        }
      }
    }
    setActiveComandaId(null)
  }

  if (!isMounted) {
    // Renderiza uma casca com fundo idêntico ao do login para evitar flash/hydration mismatch
    return <Box w="full" h="screen" bg="bg-surface-sunken" />
  }

  if (!tenantCtx?.currentTenant) {
    return <AcessoEmpresaSection onUnlockSuccess={() => setCurrentView("login")} />
  }

  if (!operator) {
    return (
      <LoginSection
        onLoginSuccess={handleLoginSuccess}
        onSwitchTenant={() => {
          tenantCtx.logoutTenantSession()
          setCurrentView("acesso-empresa")
        }}
      />
    )
  }

  const isTotemUser = normalizeUserRole(tenantCtx?.currentUser?.role) === UserRole.TOTEM

  if (isTotemUser) {
    return (
      <ConsultaPrecoTerminalScreen
        configuredPassword={loadConsultaPrecoSettings().password}
        onExit={() => {
          setOperator(null)
          tenantCtx.logoutUserSession()
          setCurrentView("login")
          setActiveComandaId(null)
        }}
      />
    )
  }

  return (
    <Box w="full" h="screen" minH="screen" display="flex" direction="col" bg="bg-app" overflow="hidden">
      {/* Header full width (only for dashboard) */}
      {currentView === "dashboard" && (
        <Box w="full" shrink="0">
          <PdvHeaderSection
            currentView={currentView}
            companyName={companyDisplayName}
            onNavigate={(view) => {
              if (view === "dashboard") {
                setActiveComandaId(null)
              }
              setCurrentView(view, view === "dashboard")
            }}
            operatorName={operator}
            isSynced={syncStatus.isSynced}
            statusText={syncStatus.statusText}
            onSyncClick={() => {
              if (tenantId) initialSync(tenantId)
              processSyncQueue()
            }}
            onLogout={() => {
              setOperator(null)
              tenantCtx.logoutUserSession()
              setCurrentView("login")
              setActiveComandaId(null)
            }}
          />
        </Box>
      )}
      {/* Main content area */}
      <Box flex="1" w="full" display="flex" direction="col" minH="0" overflow="hidden">
        <RegistryMain
          title={
            customTitle
              ? customTitle
              : currentView === "dashboard"
                ? undefined
                : isCaixaFlow && activeComandaId
                  ? comandas.find((c: { id: string; label: string; time: string; total: number }) => c.id === activeComandaId)?.label || "Caixa"
                  : currentView.charAt(0).toUpperCase() + currentView.slice(1)
          }
          subtitle={
            currentView === "dashboard"
              ? undefined
              : `Terminal PDV — Operador: ${operator}`
          }
          icon={
            currentView === "dashboard"
              ? undefined
              : viewIconMap[currentView] || Terminal
          }
          onBack={
            currentView === "dashboard"
              ? undefined
              : handleRegistryBack
          }
          customActions={currentView === "dashboard" ? undefined : customActions}
        >
          {/* Container centralizado com largura limitada para o conteúdo (apenas no dashboard) */}
          <Box display="flex" justify="center" w="full" flex="1" minH="0" h="full">
            <Box w="full" flex="1" display="flex" direction="col" minH="0" h="full" maxW={currentView === "dashboard" ? "820" : undefined}>
              <ViewTransition viewKey={currentView} flex="1" direction="col" minH="0">
                {currentView === "dashboard" && (
                  <Box w="full" flex="1" minH="0">
                    <DashboardSection onNavigate={setCurrentView} />
                  </Box>
                )}

                {isCaixaFlow && (
                  <Box w="full" flex="1" minH="0" h="full" display="flex" direction="col">
                    <PdvSection
                      onBackToDashboard={() => {
                        setActiveComandaId(null)
                        setCurrentView("dashboard", true)
                      }}
                      activeComandaId={activeComandaId}
                      onCloseComanda={handleCloseComanda}
                      setCustomBack={handleSetCustomBack}
                      setCustomTitle={handleSetCustomTitle}
                      setCustomActions={handleSetCustomActions}
                    />
                  </Box>
                )}

                {isComandasFlow && (
                  <Box w="full" flex="1" minH="0" display="flex" direction="col">
                    <ComandasSection
                      onSelectComanda={handleSelectComanda}
                      comandas={comandas}
                      onAddComanda={handleAddComanda}
                      onBatchCheckoutComandas={handleBatchCheckoutComandas}
                      setCustomTitle={handleSetCustomTitle}
                      setCustomBack={handleSetCustomBack}
                      setCustomActions={handleSetCustomActions}
                    />
                  </Box>
                )}

                {isDeliveryFlow && (
                  <Box w="full" flex="1" minH="0" display="flex" direction="col">
                    <DeliverySection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={handleSetCustomBack}
                      setCustomTitle={handleSetCustomTitle}
                      setCustomActions={handleSetCustomActions}
                    />
                  </Box>
                )}

                {isEstoqueFlow && (
                  <Box w="full" flex="1" minH="0" display="flex" direction="col">
                    <EstoqueSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={handleSetCustomBack}
                      setCustomTitle={handleSetCustomTitle}
                      setCustomActions={handleSetCustomActions}
                    />
                  </Box>
                )}

                {isProdutosFlow && (
                  <Box w="full" flex="1" minH="0" display="flex" direction="col">
                    <ProdutosSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={handleSetCustomBack}
                      setCustomTitle={handleSetCustomTitle}
                      setCustomActions={handleSetCustomActions}
                    />
                  </Box>
                )}

                {isClientesFlow && (
                  <Box w="full" flex="1" minH="0" display="flex" direction="col">
                    <ClientesSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={handleSetCustomBack}
                      setCustomTitle={handleSetCustomTitle}
                      setCustomActions={handleSetCustomActions}
                    />
                  </Box>
                )}

                {isRelatoriosFlow && (
                  <Box w="full" flex="1" minH="0" display="flex" direction="col">
                    <RelatoriosSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={handleSetCustomBack}
                      setCustomTitle={handleSetCustomTitle}
                      setCustomActions={handleSetCustomActions}
                    />
                  </Box>
                )}

                {isConfiguracoesFlow && (
                  <Box w="full" flex="1" minH="0" display="flex" direction="col">
                    <ConfiguracoesSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={handleSetCustomBack}
                      setCustomTitle={handleSetCustomTitle}
                      setCustomActions={handleSetCustomActions}
                    />
                  </Box>
                )}

                {currentView === "vendas" && (
                  <Box w="full" flex="1" minH="0" display="flex" direction="col">
                    <VendasSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={handleSetCustomBack}
                      setCustomTitle={handleSetCustomTitle}
                      setCustomActions={handleSetCustomActions}
                    />
                  </Box>
                )}

                {currentView === "totais-em-caixa" && (
                  <Box w="full" flex="1" minH="0" display="flex" direction="col">
                    <TotaisEmCaixaSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={handleSetCustomBack}
                      setCustomTitle={handleSetCustomTitle}
                      setCustomActions={handleSetCustomActions}
                    />
                  </Box>
                )}

                {currentView === "contas-a-receber" && (
                  <Box w="full" flex="1" minH="0" display="flex" direction="col">
                    <ContasAReceberSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={handleSetCustomBack}
                      setCustomTitle={handleSetCustomTitle}
                      setCustomActions={handleSetCustomActions}
                    />
                  </Box>
                )}

                {currentView === "conta-digital" && (
                  <Box w="full" flex="1" minH="0" display="flex" direction="col">
                    <ContaDigitalSection
                      onCancel={() => setCurrentView("dashboard", true)}
                      setCustomBack={handleSetCustomBack}
                      setCustomTitle={handleSetCustomTitle}
                      setCustomActions={handleSetCustomActions}
                    />
                  </Box>
                )}
              </ViewTransition>
            </Box>
          </Box>
        </RegistryMain>
      </Box>

      {/* Botão Fixo no Canto Inferior Esquerdo para Personalizar Tema */}
      <Box position="fixed" bottom={6} left={6} zIndex="50">
        <Button
          variant="secondary-pill-icon"
          icon={Settings}
          onClick={() => setIsThemeModalOpen(true)}
        />
      </Box>

      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </Box>
  )
}

export default function Home() {
  return (
    <TenantProvider>
      <NavigationProvider>
        <HomeContent />
      </NavigationProvider>
    </TenantProvider>
  )
}