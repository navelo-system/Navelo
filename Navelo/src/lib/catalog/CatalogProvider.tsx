"use client"

import React, { createContext, useContext, useEffect, useState, useMemo } from "react"
import {
  loadCatalogoOnlineSettings,
  CatalogoOnlineSettings,
  createDefaultCatalogoOnlineSettings,
} from "@/lib/sync/catalogoOnlineSettings"

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
  observation?: string
}

interface CatalogContextData {
  settings: CatalogoOnlineSettings
  isLoading: boolean
  isDark: boolean
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedProduct: any | null
  setSelectedProduct: (p: any | null) => void
  isCartOpen: boolean
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>
  isStoreInfoOpen: boolean
  setIsStoreInfoOpen: React.Dispatch<React.SetStateAction<boolean>>
  cart: CartItem[]
  addToCart: (
    product: { id: string; name: string; price: number; image_url?: string },
    quantity?: number,
    observation?: string
  ) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, delta: number) => void
  clearCart: () => void
  cartSubtotal: number
  cartTotalItems: number
}

const CatalogContext = createContext<CatalogContextData>({
  settings: createDefaultCatalogoOnlineSettings(),
  isLoading: true,
  isDark: false,
  setIsDark: () => {},
  searchQuery: "",
  setSearchQuery: () => {},
  selectedProduct: null,
  setSelectedProduct: () => {},
  isCartOpen: false,
  setIsCartOpen: () => {},
  isStoreInfoOpen: false,
  setIsStoreInfoOpen: () => {},
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartSubtotal: 0,
  cartTotalItems: 0,
})

export const useCatalog = () => useContext(CatalogContext)

export function CatalogProvider({
  children,
  slug,
}: {
  children: React.ReactNode
  slug: string
}) {
  const [settings, setSettings] = useState<CatalogoOnlineSettings>(() => loadCatalogoOnlineSettings())
  const [isLoading, setIsLoading] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("navelo_catalog_theme") || localStorage.getItem("navelo_theme")
      return savedTheme === "dark"
    } catch {
      return false
    }
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(`navelo_catalog_cart_${slug}`)
      return savedCart ? JSON.parse(savedCart) : []
    } catch {
      return []
    }
  })

  const [prevSlug, setPrevSlug] = useState(slug)
  if (slug !== prevSlug) {
    setPrevSlug(slug)
    let newCart: CartItem[] = []
    try {
      const savedCart = localStorage.getItem(`navelo_catalog_cart_${slug}`)
      if (savedCart) {
        newCart = JSON.parse(savedCart)
      }
    } catch {
      // Ignora erro
    }
    setCart(newCart)
  }

  // Salva carrinho no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`navelo_catalog_cart_${slug}`, JSON.stringify(cart))
    } catch {
      // Ignora erro
    }
  }, [cart, slug])

  const addToCart = (
    product: { id: string; name: string; price: number; image_url?: string },
    quantity = 1,
    observation?: string
  ) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && (item.observation || "") === (observation || "")
      )
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [
        ...prev,
        {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          imageUrl: product.image_url,
          observation: observation,
        },
      ]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const clearCart = () => setCart([])

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0)
  }, [cart])

  const cartTotalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0)
  }, [cart])

  // Aplica as cores customizadas da identificação no documento (lightColor / darkColor) e salva no localStorage
  useEffect(() => {
    if (typeof document === "undefined") return

    const activePrimary = isDark
      ? settings.identification.darkColor || "#2196f3"
      : settings.identification.lightColor || "#e05a2b"

    document.documentElement.style.setProperty("--brand-primary", activePrimary)

    if (isDark) {
      document.documentElement.classList.add("dark")
      try {
        localStorage.setItem("navelo_catalog_theme", "dark")
        localStorage.setItem("navelo_theme", "dark")
      } catch {
        // Ignora erro
      }
    } else {
      document.documentElement.classList.remove("dark")
      try {
        localStorage.setItem("navelo_catalog_theme", "light")
        localStorage.setItem("navelo_theme", "light")
      } catch {
        // Ignora erro
      }
    }

    return () => {
      document.documentElement.style.removeProperty("--brand-primary")
      document.documentElement.classList.remove("dark")
    }
  }, [
    isDark,
    settings.identification.lightColor,
    settings.identification.darkColor,
  ])

  return (
    <CatalogContext.Provider
      value={{
        settings,
        isLoading,
        isDark,
        setIsDark,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isStoreInfoOpen,
        setIsStoreInfoOpen,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTotalItems,
      }}
    >
      {children}
    </CatalogContext.Provider>
  )
}
