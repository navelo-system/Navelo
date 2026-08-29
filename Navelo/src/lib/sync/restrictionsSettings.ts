"use client"

import * as React from "react"

export interface TenantRestrictions {
  cancelamento: boolean
  reimpressao: boolean
  transferencia: boolean
  complemento: boolean
  descontos: boolean
  descontoLimite: string
}

export const DEFAULT_TENANT_RESTRICTIONS: TenantRestrictions = {
  cancelamento: true,
  reimpressao: true,
  transferencia: false,
  complemento: true,
  descontos: true,
  descontoLimite: "10,00",
}

export const RESTRICTIONS_CHANGED_EVENT = "navelo:restrictions_changed"

function getStorageKey(tenantId?: string): string {
  return `navelo_tenant_restrictions_${tenantId || "default"}`
}

export function loadTenantRestrictions(tenantId?: string): TenantRestrictions {
  if (typeof window === "undefined") return DEFAULT_TENANT_RESTRICTIONS
  try {
    const raw = localStorage.getItem(getStorageKey(tenantId))
    if (!raw) return DEFAULT_TENANT_RESTRICTIONS
    const parsed = JSON.parse(raw) as Partial<TenantRestrictions>
    return { ...DEFAULT_TENANT_RESTRICTIONS, ...parsed }
  } catch {
    return DEFAULT_TENANT_RESTRICTIONS
  }
}

export function saveTenantRestrictions(tenantId: string | undefined, data: TenantRestrictions): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(getStorageKey(tenantId), JSON.stringify(data))
    window.dispatchEvent(new CustomEvent(RESTRICTIONS_CHANGED_EVENT, { detail: data }))
  } catch (err) {
    console.error("Erro ao salvar restrições:", err)
  }
}

export function useTenantRestrictions(tenantId?: string): TenantRestrictions {
  const subscribe = React.useCallback((callback: () => void) => {
    if (typeof window === "undefined") return () => {}
    window.addEventListener(RESTRICTIONS_CHANGED_EVENT, callback)
    window.addEventListener("storage", callback)
    return () => {
      window.removeEventListener(RESTRICTIONS_CHANGED_EVENT, callback)
      window.removeEventListener("storage", callback)
    }
  }, [])

  const getSnapshot = React.useCallback(() => {
    return JSON.stringify(loadTenantRestrictions(tenantId))
  }, [tenantId])

  const raw = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => JSON.stringify(DEFAULT_TENANT_RESTRICTIONS)
  )

  return React.useMemo(() => {
    try {
      return JSON.parse(raw) as TenantRestrictions
    } catch {
      return DEFAULT_TENANT_RESTRICTIONS
    }
  }, [raw])
}
