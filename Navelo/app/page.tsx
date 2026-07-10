"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { RegistryMain } from "@/components/store/advanced/RegistryMain"
import { PdvHeaderSection } from "@/components/store/advanced/PdvHeaderSection"
import { LoginSection } from "@/components/store/sections/pdv/pages/LoginSection"
import { DashboardSection } from "@/components/store/sections/pdv/pages/DashboardSection"
import { PdvSection } from "@/components/store/sections/pdv/pages/PdvSection"
import { ComandasSection } from "@/components/store/sections/pdv/pages/ComandasSection"
import { DeliverySection } from "@/components/store/sections/pdv/pages/DeliverySection"
import { EstoqueSection } from "@/components/store/sections/pdv/pages/EstoqueSection"
import { ProdutosSection } from "@/components/store/sections/pdv/pages/ProdutosSection"
import { ClientesSection } from "@/components/store/sections/pdv/pages/ClientesSection"
import { RelatoriosSection } from "@/components/store/sections/pdv/pages/RelatoriosSection"
import { ConfiguracoesSection } from "@/components/store/sections/pdv/pages/ConfiguracoesSection"
import { ViewTransition } from "@/components/store/base/ViewTransition"
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

export default function Home() {
  const [isMounted, setIsMounted] = React.useState(false)
  const [operator, setOperator] = React.useState<string | null>(null)

  const getViewFromHash = (): string => {
    if (typeof window === "undefined") return "login"
    const hash = window.location.hash.replace("#", "")
    return PDV_VIEWS.includes(hash) ? hash : "dashboard"
  }

  const [currentView, setCurrentViewState] = React.useState<string>("login")
  const [customBack, setCustomBack] = React.useState<(() => void) | null>(null)
  const [customTitle, setCustomTitle] = React.useState<string | null>(null)
  const [customActions, setCustomActions] = React.useState<React.ReactNode | null>(null)

  // Armazena posições de scroll por view
  const scrollPositions = React.useRef<Record<string, number>>({})
  const isBackNavigation = React.useRef<boolean>(false)

  // Função de navegação que sincroniza estado + hash do browser e salva scroll
  const setCurrentView = React.useCallback((view: string, isBack = false) => {
    isBackNavigation.current = isBack
    setCurrentViewState(prev => {
      if (typeof window !== "undefined") {
        scrollPositions.current[prev] = window.scrollY
      }
      return view
    })
    setCustomTitle(null)
    setCustomActions(null)
    if (typeof window !== "undefined") {
      const newHash = view === "login" ? "" : `#${view}`
      if (window.location.hash !== newHash) {
        window.history.pushState(null, "", newHash || window.location.pathname)
      }
    }
  }, [])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true)
      const savedOperator = sessionStorage.getItem("pdv-operator")
      if (savedOperator) {
        setOperator(savedOperator)
        const hash = window.location.hash.replace("#", "")
        setCurrentViewState(PDV_VIEWS.includes(hash) ? hash : "dashboard")
      } else {
        setCurrentViewState("login")
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Persiste o operador no sessionStorage ao alterar
  React.useEffect(() => {
    if (!isMounted) return
    if (operator) {
      sessionStorage.setItem("pdv-operator", operator)
    } else {
      sessionStorage.removeItem("pdv-operator")
      // Limpa a hash sem criar entrada no histórico
      window.history.replaceState(null, "", window.location.pathname)
    }
  }, [operator, isMounted])

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
  }, [isMounted])

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

  // Estado global de comandas para fluxo integrado
  const [comandas, setComandas] = React.useState([
    { id: "101", label: "#filipe", time: "452:42", total: 45.00 },
    { id: "102442", label: "#maria", time: "015:30", total: 120.50 },
    { id: "103", label: "#mesa_5", time: "124:10", total: 18.00 },
    { id: "104", label: "#mesa_12", time: "002:15", total: 0.00 }
  ])

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

  const handleAddComanda = (label: string) => {
    const newComanda = {
      id: Math.floor(100 + Math.random() * 900).toString(),
      label,
      time: "000:01",
      total: 0.00
    }
    setComandas((prev) => [...prev, newComanda])
  }

  const handleCloseComanda = (id: string) => {
    setComandas((prev) => prev.filter((c) => c.id !== id))
    setActiveComandaId(null)
  }

  if (!isMounted) {
    // Renderiza uma casca com fundo idêntico ao do login para evitar flash/hydration mismatch
    return <div className="w-full h-screen bg-slate-900" />
  }

  if (!operator) {
    return <LoginSection onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <Box w="full" h={currentView === "caixa" ? "h-auto md:h-screen" : "auto"} display="flex" direction="col" className={`min-h-screen bg-slate-200 ${currentView === "caixa" ? "md:overflow-hidden" : ""}`}>
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
            onLogout={() => {
              setOperator(null)
              setCurrentView("login")
              setActiveComandaId(null)
            }}
          />
        </Box>
      )}
      {/* Main content area */}
      <Box flex="1" w="full" className={`flex flex-col ${currentView === "caixa" ? "min-h-0 overflow-y-auto md:overflow-hidden" : ""}`}>
        <RegistryMain
          title={
            customTitle
              ? customTitle
              : currentView === "dashboard"
                ? undefined
                : currentView === "caixa" && activeComandaId
                  ? comandas.find(c => c.id === activeComandaId)?.label || "Caixa"
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
            customBack
              ? customBack
              : currentView !== "dashboard"
                ? () => {
                    setActiveComandaId(null)
                    setCurrentView("dashboard", true)
                  }
                : undefined
          }
          customActions={currentView === "dashboard" ? undefined : customActions}
          className={`flex-1 flex flex-col ${currentView === "caixa" ? "min-h-0" : ""}`}
        >
          {/* Container centralizado com largura limitada para o conteúdo (apenas no dashboard) */}
          <Box display="flex" justify="center" w="full" flex="1" className="min-h-0">
            <Box w="full" flex="1" display="flex" direction="col" className={`min-h-0 ${currentView === "dashboard" ? "max-w-[1000px]" : ""}`}>
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
                    <DeliverySection />
                  </Box>
                )}

                {currentView === "estoque" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <EstoqueSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
                    />
                  </Box>
                )}

                {currentView === "produtos" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <ProdutosSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
                    />
                  </Box>
                )}

                {currentView === "clientes" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <ClientesSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
                    />
                  </Box>
                )}

                {currentView === "relatorios" && (
                  <Box w="full" flex="1" className="min-h-0 flex flex-col">
                    <RelatoriosSection
                      onBackToDashboard={() => setCurrentView("dashboard", true)}
                      setCustomBack={setCustomBack}
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
              </ViewTransition>
            </Box>
          </Box>
        </RegistryMain>
      </Box>
    </Box>
  )
}