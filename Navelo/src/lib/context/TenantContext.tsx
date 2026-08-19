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
  logoUrl: "/logo.png",
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

function getInitialPlatformSettings(): PlatformSettings {
  if (typeof window === "undefined") return DEFAULT_PLATFORM_SETTINGS
  const saved = localStorage.getItem("navelo_platform_settings")
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error("Erro ao ler platform settings:", e)
    }
  }
  return DEFAULT_PLATFORM_SETTINGS
}

function getInitialTenant(): Tenant | null {
  if (typeof window === "undefined") return null
  const saved = localStorage.getItem("navelo_active_tenant")
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error("Erro ao ler active tenant:", e)
    }
  }
  return null
}

function getInitialUser(): User | null {
  if (typeof window === "undefined") return null
  const saved = sessionStorage.getItem("pdv-operator-data")
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error("Erro ao ler user data:", e)
    }
  }
  return null
}

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [platformSettings, setPlatformSettings] = React.useState<PlatformSettings>(getInitialPlatformSettings)
  const [currentTenant, setCurrentTenant] = React.useState<Tenant | null>(getInitialTenant)
  const [currentUser, setCurrentUser] = React.useState<User | null>(getInitialUser)
  const [activeThemeMode, setActiveThemeMode] = React.useState<"platform" | "tenant">(() =>
    getInitialTenant() ? "tenant" : "platform"
  )

  // Aplica o tema correto na montagem do cliente
  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (currentTenant) {
      const tenantTheme: ThemeColors = {
        ...DEFAULT_THEME,
        primary: currentTenant.primaryColor || platformSettings.primaryColor,
        secondary: currentTenant.secondaryColor || platformSettings.secondaryColor,
      }
      applyThemeColors(tenantTheme)
    } else {
      applyThemeColors({
        ...DEFAULT_THEME,
        primary: platformSettings.primaryColor,
        secondary: platformSettings.secondaryColor,
      })
    }
  }, [currentTenant, platformSettings.primaryColor, platformSettings.secondaryColor])

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
    setPlatformSettings((prev) => {
      const updated: PlatformSettings = {
        ...prev,
        primaryColor: primary,
        secondaryColor: secondary,
        logoUrl: logoUrl !== undefined ? logoUrl : prev.logoUrl,
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("navelo_platform_settings", JSON.stringify(updated))
      }

      if (activeThemeMode === "platform") {
        applyThemeColors({ ...DEFAULT_THEME, primary, secondary })
      }
      return updated
    })
  }, [activeThemeMode])

  // Atualiza cores e identidade do Tenant específico (persistido no IndexedDB e localStorage)
  const updateTenantTheme = React.useCallback(async (primary: string, secondary: string, logoUrl?: string) => {
    if (!currentTenant) return

    setCurrentTenant((prev) => {
      if (!prev) return null
      const updated: Tenant = {
        ...prev,
        primaryColor: primary,
        secondaryColor: secondary,
        logoUrl: logoUrl !== undefined ? logoUrl : prev.logoUrl,
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("navelo_active_tenant", JSON.stringify(updated))
      }

      if (activeThemeMode === "tenant") {
        applyThemeColors({ ...DEFAULT_THEME, primary, secondary })
      }

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

    applyThemeColors({
      ...DEFAULT_THEME,
      primary: tenant.primaryColor || platformSettings.primaryColor,
      secondary: tenant.secondaryColor || platformSettings.secondaryColor,
    })
  }, [platformSettings])

  // Logout de Usuário/Operador
  const logoutUserSession = React.useCallback(() => {
    setCurrentUser(null)
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("pdv-operator")
      sessionStorage.removeItem("pdv-operator-data")
    }
  }, [])

  // Logout de Sessão Completa do Tenant
  const logoutTenantSession = React.useCallback(() => {
    setCurrentUser(null)
    setCurrentTenant(null)
    setActiveThemeMode("platform")

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("pdv-operator")
      sessionStorage.removeItem("pdv-operator-data")
      localStorage.removeItem("navelo_active_tenant")
    }

    applyThemeColors({
      ...DEFAULT_THEME,
      primary: platformSettings.primaryColor,
      secondary: platformSettings.secondaryColor,
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
        logoutUserSession,
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
