"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { RegistryMain } from "@/components/store/advanced/RegistryMain"
import { PdvHeaderSection } from "@/components/store/sections/pdv/PdvHeaderSection"
import { LoginSection } from "@/components/store/sections/pdv/LoginSection"
import { DashboardSection } from "@/components/store/sections/pdv/DashboardSection"
import { PdvSection } from "@/components/store/sections/pdv/PdvSection"
import { ComandasSection } from "@/components/store/sections/pdv/ComandasSection"
import { DeliverySection } from "@/components/store/sections/pdv/DeliverySection"
import { EstoqueSection } from "@/components/store/sections/pdv/EstoqueSection"
import { ProdutosSection } from "@/components/store/sections/pdv/ProdutosSection"
import { ClientesSection } from "@/components/store/sections/pdv/ClientesSection"
import { RelatoriosSection } from "@/components/store/sections/pdv/RelatoriosSection"
import { ConfiguracoesSection } from "@/components/store/sections/pdv/ConfiguracoesSection"
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
  Terminal
} from "lucide-react"

const PDV_VIEWS = ["dashboard", "caixa", "comandas", "delivery", "estoque", "produtos", "clientes", "relatorios", "configuracoes"]

const viewIconMap: Record<string, any> = {
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

  // Função de navegação que sincroniza estado + hash do browser
  const setCurrentView = React.useCallback((view: string) => {
    setCurrentViewState(view)
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
      const savedOp = sessionStorage.getItem("pdv-operator")
      if (!savedOp) {
        setCurrentViewState("login")
        return
      }
      setCurrentViewState(getViewFromHash())
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [isMounted])

  // Estado global de comandas para fluxo integrado
  const [comandas, setComandas] = React.useState([
    { id: "101", label: "#filipe", time: "452:42", total: 45.00 },
    { id: "102", label: "#maria", time: "015:30", total: 120.50 },
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
    <Box w="full" h="screen" bg="bg-slate-200" display="flex" direction="col">
      {/* Cabeçalho superior do PDV */}
      <PdvHeaderSection
        currentView={currentView}
        onNavigate={(view) => {
          if (view === "dashboard") {
            setActiveComandaId(null)
          }
          setCurrentView(view)
        }}
        operatorName={operator}
        onLogout={() => {
          setOperator(null)
          setCurrentView("login")
          setActiveComandaId(null)
        }}
      />

      {/* Conteúdo dinâmico da tela envolto por RegistryMain */}
      <Box flex="1" overflow="auto">
        <RegistryMain
          title={
            customTitle
              ? customTitle
              : currentView === "dashboard"
              ? undefined
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
                  setCurrentView("dashboard")
                }
              : undefined
          }
          customActions={currentView === "dashboard" ? undefined : customActions}
        >
          <ViewTransition viewKey={currentView}>
          {currentView === "dashboard" && (
            <Box w="full">
              <DashboardSection onNavigate={setCurrentView} />
            </Box>
          )}

          {currentView === "caixa" && (
            <Box w="full">
              <PdvSection
                onBackToDashboard={() => {
                  setActiveComandaId(null)
                  setCurrentView("dashboard")
                }}
                activeComandaId={activeComandaId}
                onCloseComanda={handleCloseComanda}
                setCustomBack={setCustomBack}
              />
            </Box>
          )}

          {currentView === "comandas" && (
            <Box w="full">
              <ComandasSection
                onSelectComanda={handleSelectComanda}
                comandas={comandas}
                onAddComanda={handleAddComanda}
              />
            </Box>
          )}

          {currentView === "delivery" && (
            <Box w="full">
              <DeliverySection />
            </Box>
          )}

          {currentView === "estoque" && (
            <Box w="full">
              <EstoqueSection
                onBackToDashboard={() => setCurrentView("dashboard")}
                setCustomBack={setCustomBack}
              />
            </Box>
          )}

          {currentView === "produtos" && (
            <Box w="full">
              <ProdutosSection
                onBackToDashboard={() => setCurrentView("dashboard")}
                setCustomBack={setCustomBack}
              />
            </Box>
          )}

          {currentView === "clientes" && (
            <Box w="full">
              <ClientesSection
                onBackToDashboard={() => setCurrentView("dashboard")}
                setCustomBack={setCustomBack}
              />
            </Box>
          )}

          {currentView === "relatorios" && (
            <Box w="full">
              <RelatoriosSection
                onBackToDashboard={() => setCurrentView("dashboard")}
                setCustomBack={setCustomBack}
              />
            </Box>
          )}

          {currentView === "configuracoes" && (
            <Box w="full">
              <ConfiguracoesSection
                onBackToDashboard={() => setCurrentView("dashboard")}
                setCustomBack={setCustomBack}
                setCustomTitle={setCustomTitle}
                setCustomActions={setCustomActions}
              />
            </Box>
          )}
          </ViewTransition>
        </RegistryMain>
      </Box>
    </Box>
  )
}
