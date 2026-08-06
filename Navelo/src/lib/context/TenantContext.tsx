"use client"

import * as React from "react"
import { Tenant, User, PlatformSettings } from "@/types/domain"
import { applyThemeColors, DEFAULT_THEME, ThemeColors } from "@/components/store/sections/pdv/modals/ThemeCustomizerModal"
import { db } from "@/lib/dal/db"

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  id: "global",
  platformName: "Navelo SaaS",
  primaryColor: "#16315e",
  secondaryColor: "#f97316",
  logoUrl: "/logo.png"
}

interface TenantContextType {
  platformSettings: PlatformSettings
  currentTenant: Tenant | null
  currentUser: User | null
  activeThemeMode: "platform" | "tenant"
  setCurrentTenant: (tenant: Tenant | null) => void
  setCurrentUser: (user: User | null) => void
  updatePlatformTheme: (primary: string, secondary: string, logoUrl?: string) => void
  updateTenantTheme: (primary: string, secondary: string, logoUrl?: string) => void
  switchThemeMode: (mode: "platform" | "tenant") => void
  loginTenantSession: (user: User, tenant: Tenant) => void
  logoutTenantSession: () => void
  logoutUserSession: () => void
}

const TenantContext = React.createContext<TenantContextType | undefined>(undefined)

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [platformSettings, setPlatformSettings] = React.useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS)
  const [currentTenant, setCurrentTenant] = React.useState<Tenant | null>(null)
  const [currentUser, setCurrentUser] = React.useState<User | null>(null)
  const [activeThemeMode, setActiveThemeMode] = React.useState<"platform" | "tenant">("platform")

  // Carrega configurações iniciais salvas em localStorage para resiliência offline
  React.useEffect(() => {
    if (typeof window === "undefined") return

    // 1. Tenta carregar tema da plataforma SaaS
    const savedPlatform = localStorage.getItem("navelo_platform_settings")
    let platformData = DEFAULT_PLATFORM_SETTINGS
    if (savedPlatform) {
      try {
        platformData = JSON.parse(savedPlatform)
        setPlatformSettings(platformData)
      } catch (err) {
        console.error("Erro ao carregar tema da plataforma:", err)
      }
    }

    // 2. Tenta carregar sessão do tenant ativo e usuário
    const savedTenant = localStorage.getItem("navelo_active_tenant")
    const savedUser = sessionStorage.getItem("pdv-operator-data")

    if (savedTenant) {
      try {
        const tenantObj: Tenant = JSON.parse(savedTenant)
        setCurrentTenant(tenantObj)
        setActiveThemeMode("tenant")

        if (savedUser) {
          try {
            const userObj: User = JSON.parse(savedUser)
            setCurrentUser(userObj)
          } catch (e) {
            console.error("Erro ao carregar sessão do usuário:", e)
          }
        }

        // Aplica o tema do Tenant
        const tenantTheme: ThemeColors = {
          ...DEFAULT_THEME,
          primary: tenantObj.primaryColor || platformData.primaryColor,
          secondary: tenantObj.secondaryColor || platformData.secondaryColor,
        }
        applyThemeColors(tenantTheme)
        return
      } catch (err) {
        console.error("Erro ao carregar sessão do tenant:", err)
      }
    }

    // Caso não haja tenant ativo (deslogado ou na tela de login), aplica o tema da plataforma SaaS
    applyThemeColors({
      ...DEFAULT_THEME,
      primary: platformData.primaryColor,
      secondary: platformData.secondaryColor,
    })
  }, [])

  // Alterna o tema ativo no DOM
  const switchThemeMode = React.useCallback((mode: "platform" | "tenant") => {
    setActiveThemeMode(mode)
    if (mode === "platform" || !currentTenant) {
      applyThemeColors({
        ...DEFAULT_THEME,
        primary: platformSettings.primaryColor,
        secondary: platformSettings.secondaryColor,
      })
    } else {
      applyThemeColors({
        ...DEFAULT_THEME,
        primary: currentTenant.primaryColor || platformSettings.primaryColor,
        secondary: currentTenant.secondaryColor || platformSettings.secondaryColor,
      })
    }
  }, [platformSettings, currentTenant])

  // Atualiza cores da plataforma SaaS (persistido em localStorage)
  const updatePlatformTheme = React.useCallback((primary: string, secondary: string, logoUrl?: string) => {
    setPlatformSettings(prev => {
      const updated: PlatformSettings = {
        ...prev,
        primaryColor: primary,
        secondaryColor: secondary,
        logoUrl: logoUrl !== undefined ? logoUrl : prev.logoUrl
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("navelo_platform_settings", JSON.stringify(updated))
      }

      if (activeThemeMode === "platform") {
        applyThemeColors({
          ...DEFAULT_THEME,
          primary,
          secondary
        })
      }
      return updated
    })
  }, [activeThemeMode])

  // Atualiza cores e identidade do Tenant específico (persistido no IndexedDB e localStorage)
  const updateTenantTheme = React.useCallback(async (primary: string, secondary: string, logoUrl?: string) => {
    if (!currentTenant) return

    setCurrentTenant(prev => {
      if (!prev) return null
      const updated: Tenant = {
        ...prev,
        primaryColor: primary,
        secondaryColor: secondary,
        logoUrl: logoUrl !== undefined ? logoUrl : prev.logoUrl
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("navelo_active_tenant", JSON.stringify(updated))
      }

      if (activeThemeMode === "tenant") {
        applyThemeColors({
          ...DEFAULT_THEME,
          primary,
          secondary
        })
      }

      // Persiste as cores da empresa no banco IndexedDB
      try {
        db.companies.put({
          id: prev.id,
          name: prev.tradingName || prev.corporateName,
          document: prev.cnpj,
          email: "",
          phone: "",
          primary_color: primary,
          secondary_color: secondary,
          logo_url: logoUrl !== undefined ? logoUrl : prev.logoUrl,
          created_at: new Date().toISOString()
        })
      } catch (err) {
        console.error("Erro ao persistir tema da empresa no IndexedDB:", err)
      }

      return updated
    })
  }, [currentTenant, activeThemeMode])

  // Login de Sessão do Tenant
  const loginTenantSession = React.useCallback((user: User, tenant: Tenant) => {
    setCurrentUser(user)
    setCurrentTenant(tenant)
    setActiveThemeMode("tenant")

    if (typeof window !== "undefined") {
      sessionStorage.setItem("pdv-operator", user.name)
      sessionStorage.setItem("pdv-operator-data", JSON.stringify(user))
      localStorage.setItem("navelo_active_tenant", JSON.stringify(tenant))
    }

    // Aplica o tema específico do Tenant
    applyThemeColors({
      ...DEFAULT_THEME,
      primary: tenant.primaryColor || platformSettings.primaryColor,
      secondary: tenant.secondaryColor || platformSettings.secondaryColor
    })
  }, [platformSettings])

  // Logout de Usuário/Operador (Mantém o Tenant/Empresa desbloqueado no terminal)
  const logoutUserSession = React.useCallback(() => {
    setCurrentUser(null)

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("pdv-operator")
      sessionStorage.removeItem("pdv-operator-data")
    }
  }, [])

  // Logout de Sessão Completa do Tenant (Reverte para o Tema da Plataforma e tela de CNPJ)
  const logoutTenantSession = React.useCallback(() => {
    setCurrentUser(null)
    setCurrentTenant(null)
    setActiveThemeMode("platform")

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("pdv-operator")
      sessionStorage.removeItem("pdv-operator-data")
      localStorage.removeItem("navelo_active_tenant")
    }

    // Reverte o tema do DOM para as cores da Plataforma SaaS (Tela de Login)
    applyThemeColors({
      ...DEFAULT_THEME,
      primary: platformSettings.primaryColor,
      secondary: platformSettings.secondaryColor
    })
  }, [platformSettings])

  return (
    <TenantContext.Provider
      value={{
        platformSettings,
        currentTenant,
        currentUser,
        activeThemeMode,
        setCurrentTenant,
        setCurrentUser,
        updatePlatformTheme,
        updateTenantTheme,
        switchThemeMode,
        loginTenantSession,
        logoutTenantSession,
        logoutUserSession
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = React.useContext(TenantContext)
  if (!context) {
    throw new Error("useTenant deve ser usado dentro de um TenantProvider")
  }
  return context
}
