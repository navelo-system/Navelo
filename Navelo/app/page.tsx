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
import { canAccessView } from "@/lib/permissions"
import { useTabs, useSyncStatus, dal } from "@/lib/dal"
import { initialSync } from "@/lib/dal/sync"
import { TabEntity } from "@/lib/dal/db"
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

const PDV_VIEWS = ["dashboard", "caixa", "comandas", "delivery", "estoque", "produtos", "clientes", "relatorios", "configuracoes"]

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
  const [isMounted, setIsMounted] = React.useState(false)
  const [operator, setOperator] = React.useState<string | null>(null)

  const getViewFromHash = React.useCallback((): string => {
    if (typeof window === "undefined") return "login"
    const hash = window.location.hash.replace("#", "")
    const targetView = PDV_VIEWS.includes(hash) ? hash : "dashboard"
    if (targetView !== "dashboard" && targetView !== "login") {
      const userRole = tenantCtx?.currentUser?.role
      if (!canAccessView(userRole, targetView)) {
        return "dashboard"
      }
    }
    return targetView
  }, [tenantCtx?.currentUser?.role])

  const [currentView, setCurrentViewState] = React.useState<string>("login")
  const [customBack, setCustomBack] = React.useState<(() => void) | null>(null)
  const [customTitle, setCustomTitle] = React.useState<string | null>(null)
  const [customActions, setCustomActions] = React.useState<React.ReactNode | null>(null)
  const [isThemeModalOpen, setIsThemeModalOpen] = React.useState<boolean>(false)

  // Armazena posições de scroll por view
  const scrollPositions = React.useRef<Record<string, number>>({})
  const isBackNavigation = React.useRef<boolean>(false)

  // Função de navegação que sincroniza estado + hash do browser e salva scroll
  const setCurrentView = React.useCallback((view: string, isBack = false) => {
    isBackNavigation.current = isBack

    // Validação de permissões de acesso por perfil
    let targetView = view
    if (targetView !== "dashboard" && targetView !== "login" && targetView !== "acesso-empresa") {
      const userRole = tenantCtx?.currentUser?.role
      if (!canAccessView(userRole, targetView)) {
        targetView = "dashboard"
      }
    }

    setCurrentViewState(prev => {
      if (typeof window !== "undefined") {
        scrollPositions.current[prev] = window.scrollY
      }
      return targetView
    })
    setCustomTitle(null)
    setCustomActions(null)
    setCustomBack(null)
    if (typeof window !== "undefined") {
      const newHash = targetView === "login" ? "" : `#${targetView}`
      if (window.location.hash !== newHash) {
        window.history.pushState(null, "", newHash || window.location.pathname)
      }
    }
  }, [tenantCtx?.currentUser?.role])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
      applyThemeColors(loadSavedTheme())
      const savedOperator = sessionStorage.getItem("pdv-operator")
      if (savedOperator) {
        setOperator(savedOperator)
        const hash = window.location.hash.replace("#", "")
        const rawView = PDV_VIEWS.includes(hash) ? hash : "dashboard"
        const allowedView = (rawView !== "dashboard" && rawView !== "login" && !canAccessView(tenantCtx?.currentUser?.role, rawView))
          ? "dashboard"
          : rawView
        setCurrentViewState(allowedView)
      } else {
        setCurrentViewState("login")
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [tenantCtx?.currentUser?.role])

  // Persiste o operador no sessionStorage ao alterar (apenas logout do usuário, preservando o tenant)
  React.useEffect(() => {
    if (!isMounted) return
    if (operator) {
      sessionStorage.setItem("pdv-operator", operator)
    } else {
      sessionStorage.removeItem("pdv-operator")
      tenantCtx.logoutUserSession()
      // Limpa a hash sem criar entrada no histórico
      window.history.replaceState(null, "", window.location.pathname)
    }
  }, [operator, isMounted, tenantCtx])

  // Escuta o botão Voltar/Avançar do browser (popstate)
  React.useEffect(() => {
    if (!isMounted) return
    const handlePopState = () => {
      isBackNavigation.current = true
      const savedOp = sessionStorage.getItem("pdv-operator")
      if (!savedOp) {
        setCurrentViewState(prev => {
          scrollPositions.current[prev] = window.scrollY
          return "login"
        })
        return
      }
      setCurrentViewState(prev => {
        scrollPositions.current[prev] = window.scrollY
        return getViewFromHash()
      })
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [isMounted, getViewFromHash])

  // Restaura o scroll ao trocar de view
  React.useEffect(() => {
    if (typeof window === "undefined" || !isMounted) return
    const savedScroll = isBackNavigation.current ? (scrollPositions.current[currentView] || 0) : 0
    isBackNavigation.current = false // reset for next navigation

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScroll, behavior: "instant" })
      })
    })
  }, [currentView, isMounted])

  // Comandas reativas e status de sincronização do IndexedDB local (Dexie)
  const tenantId = tenantCtx?.currentTenant?.id
  const dbTabs = useTabs(tenantId)
  const syncStatus = useSyncStatus()

  // Sincronização inicial automática com o Supabase ao carregar a sessão do tenant
  React.useEffect(() => {
    if (tenantId) {
      initialSync(tenantId)
    }
  }, [tenantId])

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

  const [activeComandaId, setActiveComandaId] = React.useState<string | null>(null)

  const handleLoginSuccess = (operatorName: string) => {
    setOperator(operatorName)
    // Limpa o histórico anterior antes de entrar no dashboard
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "#dashboard")
    }
    setCurrentViewState("dashboard")
  }

  const handleSelectComanda = (id: string) => {
    setActiveComandaId(id)
    setCurrentView("caixa")
  }

  const handleStartAvulsoComanda = () => {
    const tempId = `avulso-${Date.now()}`
    setActiveComandaId(tempId)
    setCurrentView("caixa")
  }

  const handleAddComanda = async (label: string) => {
    const comandaId = Math.floor(100 + Math.random() * 900).toString()
    await dal.tabs.create({
      id: comandaId,
      code: label,
      label: label,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      total: 0.00,
      status: "OPEN",
      created_at: new Date().toISOString(),
      company_id: tenantId || "demo-tenant",
      tenant_id: tenantId || "demo-tenant"
    })
  }

  const handleCloseComanda = async (id: string) => {
    if (id && !id.startsWith("avulso-")) {
      try {
        await dal.tabs.delete(id, tenantId || "demo-tenant")
      } catch (err) {
        console.error("Erro ao fechar comanda na DAL:", err)
      }
    }
    setActiveComandaId(null)
  }

  if (!isMounted) {
    // Renderiza uma casca com fundo idêntico ao do login para evitar flash/hydration mismatch
    return <div className="w-full h-screen bg-slate-900" />
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

  return (
    <Box w="full" h="screen" display="flex" direction="col" className="min-h-screen bg-slate-200 overflow-hidden">
      {/* Header full width (only for dashboard) */}
      {currentView === "dashboard" && (
        <Box w="full" shrink="0">
          <PdvHeaderSection
            currentView={currentView}
            onNavigate={(view) => {
              if (view === "dashboard") {
                setActiveComandaId(null)
              }
              setCurrentView(view, view === "dashboard")
            }}
            operatorName={operator}
            isSynced={syncStatus.isSynced}
            statusText={syncStatus.statusText}
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
      <Box flex="1" w="full" className="flex flex-col min-h-0 overflow-hidden">
        <RegistryMain
          title={
            customTitle
              ? customTitle
              : currentView === "dashboard"
                ? undefined
                : currentView === "caixa" && activeComandaId
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
              : customBack
                ? customBack
                : () => {
                  setActiveComandaId(null)
                  setCurrentView("dashboard", true)
                }
          }
          customActions={currentView === "dashboard" ? undefined : customActions}
          className="flex-1 flex flex-col min-h-0"
        >
          {/* Container centralizado com largura limitada para o conteúdo (apenas no dashboard) */}
          <Box display="flex" justify="center" w="full" flex="1" className="min-h-0">
            <Box w="full" flex="1" display="flex" direction="col" className={`min-h-0 ${currentView === "dashboard" ? "max-w-[820px]" : ""}`}>
              <ViewTransition viewKey={currentView} className="flex-1 flex flex-col min-h-0">
                {currentView === "dashboard" && (
                  <Box w="full" flex="1" className="min-h-0">
                    <DashboardSection onNavigate={setCurrentView} />
                  </Box>
                )}

                {currentView === "caixa" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <PdvSection
                      onBackToDashboard={() => {
                        setActiveComandaId(null)
                        setCurrentView("dashboard", true)
                      }}
                      activeComandaId={activeComandaId}
                      onCloseComanda={handleCloseComanda}
                      setCustomBack={setCustomBack}
                      setCustomTitle={setCustomTitle}
                      setCustomActions={setCustomActions}
                    />
                  </Box>
                )}

                {currentView === "comandas" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <ComandasSection
                      onSelectComanda={handleSelectComanda}
                      comandas={comandas}
                      onAddComanda={handleAddComanda}
                      setCustomActions={setCustomActions}
                    />
                  </Box>
                )}

                {currentView === "delivery" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <DeliverySection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
                      setCustomTitle={setCustomTitle}
                      setCustomActions={setCustomActions}
                    />
                  </Box>
                )}

                {currentView === "estoque" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <EstoqueSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
                      setCustomTitle={setCustomTitle}
                      setCustomActions={setCustomActions}
                    />
                  </Box>
                )}

                {currentView === "produtos" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <ProdutosSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
                      setCustomTitle={setCustomTitle}
                      setCustomActions={setCustomActions}
                    />
                  </Box>
                )}

                {currentView === "clientes" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <ClientesSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
                      setCustomTitle={setCustomTitle}
                      setCustomActions={setCustomActions}
                    />
                  </Box>
                )}

                {currentView === "relatorios" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <RelatoriosSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
                      setCustomTitle={setCustomTitle}
                      setCustomActions={setCustomActions}
                    />
                  </Box>
                )}

                {currentView === "configuracoes" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <ConfiguracoesSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
                      setCustomTitle={setCustomTitle}
                      setCustomActions={setCustomActions}
                    />
                  </Box>
                )}

                {currentView === "vendas" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <VendasSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
                      setCustomTitle={setCustomTitle}
                      setCustomActions={setCustomActions}
                    />
                  </Box>
                )}

                {currentView === "totais-em-caixa" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <TotaisEmCaixaSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
                      setCustomTitle={setCustomTitle}
                      setCustomActions={setCustomActions}
                    />
                  </Box>
                )}

                {currentView === "contas-a-receber" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <ContasAReceberSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
                      setCustomTitle={setCustomTitle}
                      setCustomActions={setCustomActions}
                    />
                  </Box>
                )}

                {currentView === "conta-digital" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <ContaDigitalSection
                      onCancel={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
                      setCustomTitle={setCustomTitle}
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
      <HomeContent />
    </TenantProvider>
  )
}