"use client"

import * as React from "react"
import { useTenant } from "@/lib/context/TenantContext"
import { ParsedRoute, parseHash, formatRoute, resolveAllowedRoute } from "./router"
import { getParentRoute } from "@/lib/permissions"

interface NavigationContextType {
  currentRoute: ParsedRoute
  navigate: (target: string | Partial<ParsedRoute>, options?: { replace?: boolean }) => void
  goBack: (fallback?: string) => void
  canGoBack: boolean
  historyStack: string[]
}

const NavigationContext = React.createContext<NavigationContextType | null>(null)

function usePopStateListener(
  onPopState: (allowed: ParsedRoute) => void,
  userRole?: string
) {
  React.useEffect(() => {
    if (typeof window === "undefined") return

    const handlePopState = () => {
      const parsed = parseHash(window.location.hash)
      const allowed = resolveAllowedRoute(parsed, userRole)
      onPopState(allowed)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [userRole, onPopState])
}

function useNavigationController(userRole?: string) {
  const [historyStack, setHistoryStack] = React.useState<string[]>([])
  const [currentRoute, setCurrentRoute] = React.useState<ParsedRoute>(() => {
    if (typeof window === "undefined") return { raw: "login", view: "login", params: {} }
    return resolveAllowedRoute(parseHash(window.location.hash || ""), userRole)
  })

  const historyStackRef = React.useRef<string[]>(historyStack)
  React.useEffect(() => {
    historyStackRef.current = historyStack
  }, [historyStack])

  const scrollPositions = React.useRef<Record<string, number>>({})

  const navigate = React.useCallback(
    (target: string | Partial<ParsedRoute>, options?: { replace?: boolean }) => {
      const targetHash = typeof target === "string" ? (target.startsWith("#") ? target : `#${target}`) : formatRoute(target)
      const allowed = resolveAllowedRoute(parseHash(targetHash), userRole)
      const allowedHash = formatRoute(allowed)
      const currentHash = formatRoute(currentRoute)

      if (typeof window !== "undefined") {
        scrollPositions.current[currentRoute.raw || currentRoute.view] = window.scrollY
        if (options?.replace) {
          window.history.replaceState(null, "", allowedHash)
        } else if (currentHash !== allowedHash) {
          window.history.pushState(null, "", allowedHash)
          setHistoryStack((prev) => [...prev, currentHash])
        }
      }
      setCurrentRoute(allowed)
    },
    [currentRoute, userRole]
  )

  const goBack = React.useCallback(
    (fallback?: string) => {
      const currentStack = historyStackRef.current
      const currentHash = formatRoute(currentRoute)
      const nextStack = [...currentStack]
      let targetHash: string | undefined

      while (nextStack.length > 0) {
        const popped = nextStack.pop()
        if (popped) {
          const normPopped = popped.startsWith("#") ? popped : `#${popped}`
          if (normPopped !== currentHash) {
            targetHash = normPopped
            break
          }
        }
      }

      if (!targetHash) {
        targetHash = fallback || getParentRoute(currentHash)
      }

      const allowed = resolveAllowedRoute(parseHash(targetHash), userRole)
      const allowedHash = formatRoute(allowed)

      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", allowedHash)
      }

      setHistoryStack(nextStack)
      setCurrentRoute(allowed)
    },
    [currentRoute, userRole]
  )

  const handlePopStateCallback = React.useCallback((allowed: ParsedRoute) => {
    const allowedHash = formatRoute(allowed)
    setHistoryStack((prev) => {
      const next = [...prev]
      if (next.length > 0 && next[next.length - 1] === allowedHash) {
        next.pop()
      }
      return next
    })
    setCurrentRoute(allowed)
  }, [])

  usePopStateListener(handlePopStateCallback, userRole)

  return { currentRoute, navigate, goBack, historyStack }
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const tenantCtx = useTenant()
  const userRole = tenantCtx?.currentUser?.role
  const { currentRoute, navigate, goBack, historyStack } = useNavigationController(userRole)

  const contextValue = React.useMemo<NavigationContextType>(
    () => ({
      currentRoute,
      navigate,
      goBack,
      canGoBack: historyStack.length > 0 || currentRoute.view !== "dashboard",
      historyStack,
    }),
    [currentRoute, navigate, goBack, historyStack]
  )

  return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>
}

export function useAppNavigation(): NavigationContextType {
  const ctx = React.useContext(NavigationContext)
  if (!ctx) {
    throw new Error("useAppNavigation deve ser utilizado dentro de um NavigationProvider")
  }
  return ctx
}
