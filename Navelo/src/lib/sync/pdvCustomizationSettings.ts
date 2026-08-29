"use client"

import * as React from "react"

export const STORAGE_KEY_ONLY_STOCK = "pdv_show_only_with_stock"
export const STORAGE_KEY_STOCK_QTY = "pdv_show_stock_qty"
export const STORAGE_KEY_MAIN_PAGE = "pdv_main_page"
export const PDV_CUSTOMIZATION_CHANGED_EVENT = "navelo:pdv_customization_changed"

export interface PdvCustomizationConfig {
  onlyStock: boolean
  stockQty: boolean
  mainPage: "products" | "resume"
}

export const DEFAULT_PDV_CUSTOMIZATION: PdvCustomizationConfig = {
  onlyStock: false,
  stockQty: false,
  mainPage: "products",
}

export function getStoredPdvConfig(): PdvCustomizationConfig {
  if (typeof window === "undefined") return DEFAULT_PDV_CUSTOMIZATION
  try {
    return {
      onlyStock: localStorage.getItem(STORAGE_KEY_ONLY_STOCK) === "true",
      stockQty: localStorage.getItem(STORAGE_KEY_STOCK_QTY) === "true",
      mainPage: ((localStorage.getItem(STORAGE_KEY_MAIN_PAGE) as "products" | "resume") || "products"),
    }
  } catch {
    return DEFAULT_PDV_CUSTOMIZATION
  }
}

export function saveStoredPdvConfig(config: PdvCustomizationConfig): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY_ONLY_STOCK, String(config.onlyStock))
    localStorage.setItem(STORAGE_KEY_STOCK_QTY, String(config.stockQty))
    localStorage.setItem(STORAGE_KEY_MAIN_PAGE, config.mainPage)
    window.dispatchEvent(new CustomEvent(PDV_CUSTOMIZATION_CHANGED_EVENT, { detail: config }))
  } catch (err) {
    console.error("Erro ao salvar customização do PDV:", err)
  }
}

export function usePdvCustomization(): PdvCustomizationConfig {
  const subscribe = React.useCallback((callback: () => void) => {
    if (typeof window === "undefined") return () => {}
    window.addEventListener(PDV_CUSTOMIZATION_CHANGED_EVENT, callback)
    window.addEventListener("storage", callback)
    return () => {
      window.removeEventListener(PDV_CUSTOMIZATION_CHANGED_EVENT, callback)
      window.removeEventListener("storage", callback)
    }
  }, [])

  const getSnapshot = React.useCallback(() => {
    if (typeof window === "undefined") return "false:false:products"
    const cfg = getStoredPdvConfig()
    return `${cfg.onlyStock}:${cfg.stockQty}:${cfg.mainPage}`
  }, [])

  const raw = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => "false:false:products"
  )

  return React.useMemo(() => {
    const [onlyStock, stockQty, mainPage] = raw.split(":")
    return {
      onlyStock: onlyStock === "true",
      stockQty: stockQty === "true",
      mainPage: (mainPage as "products" | "resume") || "products",
    }
  }, [raw])
}
