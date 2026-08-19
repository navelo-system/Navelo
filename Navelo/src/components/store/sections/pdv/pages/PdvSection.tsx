"use client"


import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Button } from "@/components/store/base/Button"
import { PdvCatalogToolbar, MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { Menu } from "lucide-react"
import { ViewTransition } from "@/components/store/base/ViewTransition"
import { ExitConfirmModal } from "@/components/store/sections/pdv/modals/ExitConfirmModal"
import { PdvCartDrawer } from "@/components/store/sections/pdv/modals/PdvCartDrawer"

import { PdvCatalog, MockProduct } from "@/components/store/advanced/PdvCatalog"
import { PdvCheckoutPayment } from "@/components/store/advanced/PdvCheckoutPayment"
import { PdvCheckoutReceipt } from "@/components/store/advanced/PdvCheckoutReceipt"
import { PdvCheckoutSidebar } from "@/components/store/advanced/PdvCheckoutSidebar"
import { PdvModals } from "@/components/store/advanced/PdvModals"

import { NegociacoesSection } from "@/components/store/sections/pdv/pages/NegociacoesSection"
import { ClientesSection } from "@/components/store/sections/pdv/pages/ClientesSection"
import { DevolucaoSection } from "@/components/store/sections/pdv/pages/DevolucaoSection"
import { TotaisEmCaixaSection } from "@/components/store/sections/pdv/pages/TotaisEmCaixaSection"
import { ContasAReceberSection } from "@/components/store/sections/pdv/pages/ContasAReceberSection"
import { PdvObservacaoModal } from "@/components/store/sections/pdv/modals/PdvObservacaoModal"
import { PdvSangriaModal } from "@/components/store/sections/pdv/modals/PdvSangriaModal"
import { SaleSuccessModal } from "@/components/store/sections/pdv/modals/SaleSuccessModal"
import { maskCurrency } from "@/lib/masks"

import { DeliveryClientInfo, DeliveryCheckoutConfirmation, DeliveryType, PaymentMoment } from "@/components/store/advanced/DeliveryCheckoutConfirmation"
import { UI_STRINGS } from "@/constants/strings"
import { DeliveryRatesScreen } from "@/components/store/advanced/DeliveryRatesScreen"
import { DeliveryRidersScreen } from "@/components/store/advanced/DeliveryRidersScreen"
import { Rider, DeliveryRate } from "@/lib/dal"
import { useLiveQuery } from "dexie-react-hooks"
import { generateSaleReceiptPdf, sanitizeSaleFileName } from "@/lib/pdf/generateSaleReceipt"

// Interface dos itens do carrinho
export interface CartItemType {
  id: string
  name: string
  quantity: number
  unitPrice: number
  image?: string
  stock?: number
}

export interface DeliveryOrderPayload {
  client: DeliveryClientInfo
  status: string
  deliveryType: DeliveryType
  paymentMoment: PaymentMoment
  items: CartItemType[]
  total: number
  subtotal: number
  discount: number
}

export interface DeliveryContextData {
  client: DeliveryClientInfo
  onConfirmDelivery: (orderData: DeliveryOrderPayload) => void
  onAlterClient?: () => void
  initialItems?: CartItemType[]
  initialDiscount?: number
  isEditing?: boolean
  onSaveEdits?: (items: CartItemType[], subtotal: number, discount: number, total: number) => void
}

interface PdvSectionProps {
  onBackToDashboard: () => void
  activeComandaId?: string | null
  onCloseComanda?: (id: string) => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  setCustomTitle?: (title: string | null) => void
  deliveryContext?: DeliveryContextData | null
}

import { useProducts, useCategories, useTabs, useDeliveryOrders, dal, db } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"

export const PdvSection: React.FC<PdvSectionProps> = ({
  onBackToDashboard,
  activeComandaId,
  onCloseComanda,
  setCustomBack,
  setCustomActions,
  setCustomTitle,
  deliveryContext,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id

  // Produtos vindos do banco local IndexedDB (Dexie)
  const dbProducts = useProducts(tenantId)
  const dbCategories = useCategories(tenantId)
  const dbTabs = useTabs(tenantId)
  const dbDeliveryOrders = useDeliveryOrders(tenantId)
  const dbCompany = useLiveQuery(async () => {
    if (!tenantId) return null
    return await db.companies.get(tenantId)
  }, [tenantId])

  // Mapa de id ou nome da categoria -> Nome oficial da categoria
  const categoryMap = React.useMemo(() => {
    const map = new Map<string, string>()
    if (dbCategories) {
      dbCategories.forEach((cat) => {
        if (cat.name) {
          if (cat.id) map.set(cat.id, cat.name)
          map.set(cat.name.toLowerCase(), cat.name)
        }
      })
    }
    return map
  }, [dbCategories])

  // Calcula a quantidade de um produto comprometida em comandas ou entregas abertas
  const getCommittedStock = React.useCallback(
    (productId: string) => {
      let count = 0
      if (Array.isArray(dbTabs)) {
        for (const tab of dbTabs) {
          if (tab.status === "OPEN" && tab.id !== activeComandaId && Array.isArray(tab.items)) {
            for (const item of tab.items as any[]) {
              if ((item.id === productId || item.productId === productId) && typeof item.quantity === "number") {
                count += item.quantity
              }
            }
          }
        }
      }
      if (Array.isArray(dbDeliveryOrders)) {
        for (const order of dbDeliveryOrders) {
          if (order.status !== "delivered" && Array.isArray((order as any).items)) {
            for (const item of (order as any).items) {
              if ((item.id === productId || item.productId === productId) && typeof item.quantity === "number") {
                count += item.quantity
              }
            }
          }
        }
      }
      return count
    },
    [dbTabs, dbDeliveryOrders, activeComandaId]
  )

  const getEffectiveAvailableStock = React.useCallback(
    (productId: string, rawStock?: number) => {
      if (rawStock === undefined) return Infinity
      const committed = getCommittedStock(productId)
      return Math.max(0, rawStock - committed)
    },
    [getCommittedStock]
  )

  // Produtos do catálogo alimentados via IndexedDB
  const catalogProducts: MockProduct[] = React.useMemo(() => {
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p, idx) => {
        let groupName = ""
        if (p.category_id && categoryMap.has(p.category_id)) {
          groupName = categoryMap.get(p.category_id)!
        } else if (p.category && categoryMap.has(p.category.toLowerCase())) {
          groupName = categoryMap.get(p.category.toLowerCase())!
        } else if (p.category && p.category.trim() && !p.category.includes("-") && p.category.length < 30) {
          groupName = p.category.trim()
        } else {
          groupName = "Geral"
        }

        const subgroupName = p.subgroup && p.subgroup.trim() ? p.subgroup.trim() : undefined
        const effectiveStock = getEffectiveAvailableStock(p.id, p.stock)

        return {
          id: p.id,
          name: p.name,
          category: groupName,
          subgroup: subgroupName,
          unitPrice: p.price || 0,
          unit: p.unit || "UN",
          stock: effectiveStock !== undefined && effectiveStock !== Infinity ? effectiveStock : (p.stock ?? 0),
          barcode: p.barcodes?.[0] || p.barcode || `78900000000${idx}`,
          image: p.image_url || ""
        }
      })
    }
    return []
  }, [dbProducts, categoryMap, getEffectiveAvailableStock])

  // Configuração booleana para mostrar produtos sem estoque
  const [showOutOfStockProducts, setShowOutOfStockProducts] = React.useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pdv_show_out_of_stock_products")
      if (saved !== null) return saved === "true"
    }
    return true
  })

  const handleToggleShowOutOfStock = React.useCallback((show: boolean) => {
    setShowOutOfStockProducts(show)
    if (typeof window !== "undefined") {
      localStorage.setItem("pdv_show_out_of_stock_products", String(show))
    }
  }, [])

  // Produtos disponíveis considerando a regra de estoque
  const availableProducts = React.useMemo(() => {
    return catalogProducts.filter((p) => {
      if (showOutOfStockProducts) return true
      return (p.stock ?? 0) >= 1
    })
  }, [catalogProducts, showOutOfStockProducts])

  // Categorias e Subgrupos exibidos: apenas Grupos e Subgrupos que possuam pelo menos 1 produto elegível
  const categories = React.useMemo(() => {
    const set = new Set<string>()
    availableProducts.forEach((p) => {
      if (p.category && p.category !== "Geral") {
        set.add(p.category)
      }
      if (p.subgroup) {
        set.add(p.subgroup)
      }
    })
    const catList = Array.from(set)
    if (catList.length === 0) {
      const hasGeral = availableProducts.some((p) => p.category === "Geral")
      return hasGeral ? ["Todos", "Geral"] : ["Todos"]
    }
    return ["Todos", ...catList]
  }, [availableProducts])

  const [step, setStep] = React.useState<"negociacao" | "pagamento" | "recibo" | "delivery-confirm">("negociacao")
  const [subView, setSubView] = React.useState<"none" | "negociacoes" | "clientes" | "devolucao" | "totais-em-caixa" | "recebimentos" | "sangrias-suprimentos" | "rates-screen" | "riders-screen">("none")
  const [negociacoesClientFilter, setNegociacoesClientFilter] = React.useState<string | null>(null)
  const [isSelectingClientForNegociacoes, setIsSelectingClientForNegociacoes] = React.useState<boolean>(false)
  const [selectedRider, setSelectedRider] = React.useState<Rider | null>(null)
  const [selectedRate, setSelectedRate] = React.useState<DeliveryRate | null>(null)
  const [cartItems, setCartItems] = React.useState<CartItemType[]>(
    deliveryContext?.initialItems || []
  )
  const [observationText, setObservationText] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState("Todos")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewModeState] = React.useState<"grade" | "lista">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pdv_catalog_view_mode")
      if (saved === "grade" || saved === "lista") return saved
    }
    return "grade"
  })

  const setViewMode = React.useCallback((mode: "grade" | "lista") => {
    setViewModeState(mode)
    if (typeof window !== "undefined") {
      localStorage.setItem("pdv_catalog_view_mode", mode)
    }
  }, [])
  const [quantityMultiplier, setQuantityMultiplier] = React.useState(1)

  // Carrega os itens e observação da comanda salva apenas uma vez ao abrir a comanda
  const [prevComandaId, setPrevComandaId] = React.useState<string | null>(activeComandaId || null)
  if (activeComandaId !== prevComandaId) {
    setPrevComandaId(activeComandaId || null)
    if (activeComandaId && !activeComandaId.startsWith("avulso-") && dbTabs) {
      const activeTab = dbTabs.find((t) => t.id === activeComandaId)
      if (activeTab) {
        if (Array.isArray(activeTab.items)) {
          setCartItems((activeTab.items as unknown) as CartItemType[])
        }
        if ((activeTab as any).observation) {
          setObservationText((activeTab as any).observation)
        } else {
          setObservationText("")
        }
      }
    }
  }

  const enrichedCartItems: CartItemType[] = React.useMemo(() => {
    return cartItems.map((item) => {
      const catalogItem = catalogProducts.find((p) => p.id === item.id)
      return {
        ...item,
        stock: catalogItem?.stock ?? item.stock,
      }
    })
  }, [cartItems, catalogProducts])

  const handleSaveComandaAndExit = async () => {
    if (activeComandaId && !activeComandaId.startsWith("avulso-")) {
      try {
        const existingTab = await db.tabs.get(activeComandaId)
        if (existingTab) {
          await dal.tabs.update({
            ...existingTab,
            items: cartItems,
            total: subtotal,
            observation: observationText,
          } as any)
        }
      } catch (err) {
        console.error("Erro ao salvar comanda na DAL:", err)
      }
    }
    setIsExitConfirmOpen(false)
    onBackToDashboardRef.current()
  }

  // Pagamentos
  const [pendingDeliveryData, setPendingDeliveryData] = React.useState<DeliveryOrderPayload | null>(null)
  const [payments, setPayments] = React.useState<{ method: string; amount: number }[]>([])
  const [discount, setDiscount] = React.useState(deliveryContext?.initialDiscount || 0)
  const [paymentAmountInput, setPaymentAmountInput] = React.useState("")

  // Modais
  const [isChangeModalOpen, setIsChangeModalOpen] = React.useState(false)
  const [isCardModalOpen, setIsCardModalOpen] = React.useState(false)
  const [isDiscountModalOpen, setIsDiscountModalOpen] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false)
  const [isExitConfirmOpen, setIsExitConfirmOpen] = React.useState(false)
  const [isObservationModalOpen, setIsObservationModalOpen] = React.useState(false)
  const [isSangriaModalOpen, setIsSangriaModalOpen] = React.useState(false)
  const [isSangriaObsModalOpen, setIsSangriaObsModalOpen] = React.useState(false)
  const [sangriaModalMode, setSangriaModalMode] = React.useState<"sangria" | "suprimento">("sangria")
  const [pendingSangriaAmount, setPendingSangriaAmount] = React.useState<number>(0)
  const [selectedCustomerName, setSelectedCustomerName] = React.useState<string | null>(null)

  const handleSaveObservation = async (obs: string) => {
    setObservationText(obs)
    if (activeComandaId && !activeComandaId.startsWith("avulso-")) {
      try {
        const existingTab = await db.tabs.get(activeComandaId)
        if (existingTab) {
          await dal.tabs.update({
            ...existingTab,
            observation: obs,
          } as any)
        }
      } catch (err) {
        console.error("Erro ao sincronizar observacao na comanda:", err)
      }
    }
  }

  const handleSaveSangriaMovement = async (obs: string) => {
    if (pendingSangriaAmount > 0) {
      try {
        const movementId = crypto.randomUUID()
        const type = sangriaModalMode === "suprimento" ? "SUPPLY" : "BLEED"
        const desc = obs.trim() || (sangriaModalMode === "suprimento" ? "Suprimento manual" : "Sangria manual")
        const now = new Date().toISOString()

        await db.cash_movements.add({
          id: movementId,
          cash_register_id: tenantId || "caixa-padrao",
          company_id: tenantId || "demo-tenant",
          tenant_id: tenantId || "demo-tenant",
          type,
          amount: pendingSangriaAmount,
          description: desc,
          operator_name: tenantCtx?.currentUser?.name || "Administrador",
          created_at: now,
        })

        await db.sync_queue.add({
          id: crypto.randomUUID(),
          table: "cash_movements",
          action: "INSERT",
          tenant_id: tenantId || "demo-tenant",
          payload: {
            id: movementId,
            cash_register_id: tenantId || "caixa-padrao",
            type,
            amount: pendingSangriaAmount,
            description: desc,
            operator_name: tenantCtx?.currentUser?.name || "Administrador",
            created_at: now,
          },
          created_at: now,
        })
      } catch (err) {
        console.error("Erro ao salvar movimentacao de sangria/suprimento:", err)
      }
    }
    setIsSangriaObsModalOpen(false)
    setPendingSangriaAmount(0)
  }

  const activeClientOrTitle = React.useMemo(() => {
    if (deliveryContext?.client?.name) {
      return deliveryContext.client.name
    }
    if (activeComandaId && !activeComandaId.startsWith("avulso-") && Array.isArray(dbTabs)) {
      const activeTab = dbTabs.find((t) => t.id === activeComandaId)
      if (activeTab) {
        if (activeTab.customer_name) return activeTab.customer_name
        if (activeTab.label) return activeTab.label
        if (activeTab.code) return `Comanda #${activeTab.code}`
      }
    }
    if (selectedCustomerName) {
      return selectedCustomerName
    }
    return "Nao selecionado"
  }, [deliveryContext, activeComandaId, dbTabs, selectedCustomerName])

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
  const total = Math.max(0, subtotal - discount)
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0)
  const amountDue = Math.max(0, total - totalPaid)

  const handleGoToPayment = () => {
    if (deliveryContext) {
      setStep("delivery-confirm")
    } else {
      setStep("pagamento")
    }
  }

  // Ref estável para onBackToDashboard — evita que referência instável cause loop infinito no useEffect
  const onBackToDashboardRef = React.useRef(onBackToDashboard)
  React.useEffect(() => {
    onBackToDashboardRef.current = onBackToDashboard
  }, [onBackToDashboard])

  // Registra o back e o título corretos de acordo com o step atual e a subView ativa
  React.useEffect(() => {
    if (subView !== "none") return

    setCustomTitle?.(activeClientOrTitle === "Nao selecionado" || !activeClientOrTitle ? "Caixa" : activeClientOrTitle)

    if (step === "negociacao") {
      // Se o carrinho estiver vazio, volta direto; se tiver itens, confirma saída
      setCustomBack?.(() => () => {
        if (cartItems.length === 0) {
          onBackToDashboardRef.current()
        } else {
          setIsExitConfirmOpen(true)
        }
      })
    } else if (step === "pagamento" || step === "delivery-confirm") {
      setCustomBack?.(() => () => setStep("negociacao"))
    } else if (step === "recibo") {
      setCustomBack?.(() => () => setStep("pagamento"))
    }
  }, [step, subView, setCustomBack, setCustomTitle, cartItems.length, activeClientOrTitle])

  React.useEffect(() => {
    if (subView !== "none") return

    if (step === "negociacao") {
      setCustomActions?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder={UI_STRINGS.pdv.searchPlaceholder}
        >
          <Button
            variant="primary-pill-icon"
            icon={Menu}
            onClick={() => setIsSidebarOpen(true)}
          />
        </MobileHeaderSearch>
      )
    } else if (step === "pagamento") {
      setCustomActions?.(
        <Button
          variant="ghost-primary"
          label={UI_STRINGS.pdv.discountShortcutLabel}
          onClick={() => setIsDiscountModalOpen(true)}
        />
      )
    } else {
      setCustomActions?.(null)
    }
  }, [step, subView, searchQuery, setCustomActions])

  // Atalho de teclado F6 para abrir modal de desconto
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F6") {
        e.preventDefault()
        e.stopPropagation()
        setIsDiscountModalOpen(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Sincroniza o valor de pagamento sugerido com o restante a pagar reativamente
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPaymentAmountInput(amountDue > 0 ? maskCurrency(Math.round(amountDue * 100)) : "")
    }, 0)
    return () => clearTimeout(timer)
  }, [amountDue])

  const parsedPaymentAmount = (Number(paymentAmountInput.replace(/\D/g, "")) || 0) / 100 || amountDue
  const launchAmount = Math.min(parsedPaymentAmount, amountDue)

  // Adicionar produto
  const handleAddProduct = (prod: MockProduct) => {
    const catalogItem = catalogProducts.find((p) => p.id === prod.id)
    const effectiveStock = catalogItem?.stock ?? prod.stock

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === prod.id)
      const currentQty = existing ? existing.quantity : 0
      const newQty = currentQty + quantityMultiplier

      if (effectiveStock !== undefined && effectiveStock !== Infinity && newQty > effectiveStock) {
        return prev
      }

      if (existing) {
        return prev.map((item) =>
          item.id === prod.id ? { ...item, quantity: item.quantity + quantityMultiplier } : item
        )
      }
      return [...prev, { id: prod.id, name: prod.name, quantity: quantityMultiplier, unitPrice: prod.unitPrice, image: prod.image, stock: effectiveStock }]
    })
    setQuantityMultiplier(1) // reseta o multiplicador
  }

  const handleIncrease = (id: string) => {
    const catalogItem = catalogProducts.find((p) => p.id === id)
    const effectiveStock = catalogItem?.stock

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (effectiveStock !== undefined && effectiveStock !== Infinity && item.quantity + 1 > effectiveStock) {
            return item
          }
          return { ...item, quantity: item.quantity + 1 }
        }
        return item
      })
    )
  }

  const handleDecrease = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    )
  }

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleBarcodeScanned = (code: string) => {
    const product = catalogProducts.find(
      (prod) => prod.barcode === code || prod.id === code
    )
    if (product) {
      handleAddProduct(product)
    }
  }

  const effectiveCategory = activeCategory !== "Todos" && !categories.includes(activeCategory) ? "Todos" : activeCategory

  // Filtragem dos produtos por grupo ou subgrupo ativo e termo de busca
  const filteredProducts = React.useMemo(() => {
    return availableProducts.filter((prod) => {
      const matchesFilter =
        effectiveCategory === "Todos" ||
        prod.category.toLowerCase() === effectiveCategory.toLowerCase() ||
        (prod.subgroup && prod.subgroup.toLowerCase() === effectiveCategory.toLowerCase())
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [availableProducts, effectiveCategory, searchQuery])

  // Pagamento rápido
  const handleLaunchPayment = (method: string, amount: number) => {
    setPayments((prev) => [...prev, { method, amount }])
  }

  const handleRemovePayment = (idx: number) => {
    setPayments((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleEditPayment = (idx: number, newAmount: number) => {
    setPayments((prev) => prev.map((p, i) => i === idx ? { ...p, amount: newAmount } : p))
  }

  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false)
  const [lastCompletedSaleData, setLastCompletedSaleData] = React.useState<{
    total: number
    change: number
    paymentMethod: string
    customerName: string
  } | null>(null)

  const handleResetCaixaState = () => {
    if (activeComandaId && onCloseComanda) {
      onCloseComanda(activeComandaId)
    }
    if (activeComandaId && !activeComandaId.startsWith("avulso-")) {
      dal.tabs.delete(activeComandaId).catch(() => {})
    }
    setCartItems([])
    setPayments([])
    setDiscount(0)
    setStep("negociacao")
    setSubView("none")
    setSelectedCustomerName(null)
    setObservationText("")
    setSearchQuery("")
    setActiveCategory("Todos")
    setIsSuccessModalOpen(false)
  }

  const handleConfirmChangePayment = (amount: number) => {
    handleLaunchPayment("Dinheiro", amount)
    setIsChangeModalOpen(false)
  }

  const handleFinalizeSale = async () => {
    try {
      const paymentMethodsStr = payments.map((p) => p.method).join(", ") || "Dinheiro"
      const saleId = `sale-${Date.now()}`
      const saleData = {
        id: saleId,
        company_id: tenantId || "default",
        tenant_id: tenantId || "default",
        total,
        subtotal,
        discount,
        status: "COMPLETED",
        payment_method: paymentMethodsStr,
        customer_name: activeClientOrTitle !== "Nao selecionado" ? activeClientOrTitle : undefined,
        observation: observationText.trim() || undefined,
        created_at: new Date().toISOString(),
        items: cartItems.map((item) => ({
          id: `si-${Date.now()}-${item.id}`,
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.quantity * item.unitPrice,
        })),
      }

      await dal.sales.create(saleData)

      // Geração e upload automático do comprovante PDF para o Supabase Storage
      try {
        const saleNum = saleId.slice(-4)
        const saleReceiptData = {
          id: saleId,
          saleCode: `#${saleNum}`,
          total,
          subtotal,
          discount,
          payment_method: paymentMethodsStr,
          customer_name: activeClientOrTitle !== "Nao selecionado" ? activeClientOrTitle : undefined,
          created_at: saleData.created_at,
          items: cartItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total_price: item.quantity * item.unitPrice,
          })),
        }

        const companyData = dbCompany || (tenantCtx?.currentTenant as any) || undefined
        const { base64 } = await generateSaleReceiptPdf(saleReceiptData, companyData)
        const cleanName = sanitizeSaleFileName(`Negociacao_${saleNum}_${saleId}`)
        const fileName = `${cleanName}.pdf`

        const response = await fetch("/api/upload-receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pdfBase64: base64,
            fileName,
            tenantId: tenantId || "default",
          }),
        })

        if (response.ok) {
          const { publicUrl } = await response.json()
          if (publicUrl) {
            await dal.sales.update({ ...saleData, pdf_url: publicUrl })
          }
        }
      } catch (pdfErr) {
        console.warn("[PdvSection] Não foi possível gerar/fazer upload do PDF (modo offline ou erro de rede):", pdfErr)
      }

      for (const item of cartItems) {
        const dbProduct = await dal.products.getById(item.id)
        if (dbProduct) {
          const currentStock = dbProduct.stock ?? 0
          const newStock = Math.max(0, currentStock - item.quantity)
          await dal.products.update({
            ...dbProduct,
            stock: newStock,
          })
        }
      }

      if (pendingDeliveryData && deliveryContext) {
        deliveryContext.onConfirmDelivery({
          ...pendingDeliveryData,
          status: "Status do pedido: Aberto",
          paymentMoment: "advance",
          items: cartItems,
          total,
          subtotal,
          discount,
        })
        setPendingDeliveryData(null)
      }

      const calculatedChange = totalPaid > total ? totalPaid - total : 0
      setLastCompletedSaleData({
        total,
        change: calculatedChange,
        paymentMethod: paymentMethodsStr,
        customerName: activeClientOrTitle,
      })
      setIsSuccessModalOpen(true)
    } catch (err) {
      console.error("Erro ao finalizar venda no PDV:", err)
      const calculatedChange = totalPaid > total ? totalPaid - total : 0
      setLastCompletedSaleData({
        total,
        change: calculatedChange,
        paymentMethod: payments.map((p) => p.method).join(", ") || "Dinheiro",
        customerName: activeClientOrTitle,
      })
      setIsSuccessModalOpen(true)
    }
  }

  const handleCloseReceipt = () => {
    if (activeComandaId && onCloseComanda) {
      onCloseComanda(activeComandaId)
    }
    // Reseta PDV
    setCartItems([])
    setPayments([])
    setDiscount(0)
    setStep("negociacao")
    onBackToDashboard()
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const handleSidebarNavigate = (view: "negociacoes" | "clientes" | "devolucao" | "totais-em-caixa" | "recebimentos" | "sangrias-suprimentos" | "ultimas-negociacoes") => {
    if (view === "ultimas-negociacoes") {
      if (selectedCustomerName && selectedCustomerName !== "Nao selecionado" && selectedCustomerName !== "Venda Avulsa") {
        setNegociacoesClientFilter(selectedCustomerName)
        setIsSelectingClientForNegociacoes(false)
        setSubView("negociacoes")
      } else {
        setIsSelectingClientForNegociacoes(true)
        setSubView("clientes")
      }
      return
    }

    if (view === "negociacoes") {
      setNegociacoesClientFilter(null)
      setIsSelectingClientForNegociacoes(false)
      setSubView("negociacoes")
      return
    }

    setIsSelectingClientForNegociacoes(false)
    setSubView(view)
  }

  const handleDuplicateToCart = React.useCallback(
    (items: CartItemType[]) => {
      setCartItems((prev) => {
        const next = [...prev]
        for (const item of items) {
          if (!item.id) continue
          const catalogItem = catalogProducts.find((p) => p.id === item.id)
          const effectiveStock = catalogItem?.stock
          const currentQty = next.find((c) => c.id === item.id)?.quantity ?? 0
          const available = effectiveStock === undefined || effectiveStock === Infinity
            ? item.quantity
            : Math.max(0, effectiveStock - currentQty)
          const qtyToAdd = Math.min(item.quantity, available)
          if (qtyToAdd <= 0) continue
          const existingIdx = next.findIndex((c) => c.id === item.id)
          if (existingIdx >= 0) {
            next[existingIdx] = { ...next[existingIdx], quantity: next[existingIdx].quantity + qtyToAdd }
          } else {
            next.push({ id: item.id, name: item.name, quantity: qtyToAdd, unitPrice: item.unitPrice, image: item.image, stock: effectiveStock })
          }
        }
        return next
      })
      setNegociacoesClientFilter(null)
      setSubView("none")
    },
    [catalogProducts]
  )

  if (subView === "negociacoes") {
    return (
      <NegociacoesSection
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
        onBack={() => {
          setNegociacoesClientFilter(null)
          setSubView("none")
        }}
        initialClientFilter={negociacoesClientFilter || undefined}
        onDuplicateToCart={handleDuplicateToCart}
      />
    )
  }

  if (subView === "clientes") {
    return (
      <ClientesSection
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
        onBack={() => {
          setIsSelectingClientForNegociacoes(false)
          setSubView("none")
        }}
        onSelectClient={(client) => {
          setSelectedCustomerName(client.name)
          if (isSelectingClientForNegociacoes) {
            setIsSelectingClientForNegociacoes(false)
            setNegociacoesClientFilter(client.name)
            setSubView("negociacoes")
          } else {
            setSubView("none")
          }
        }}
      />
    )
  }

  if (subView === "devolucao") {
    return (
      <DevolucaoSection
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
        onBack={() => setSubView("none")}
      />
    )
  }

  if (subView === "totais-em-caixa") {
    return (
      <TotaisEmCaixaSection
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
        onBack={() => setSubView("none")}
      />
    )
  }

  if (subView === "recebimentos") {
    return (
      <ContasAReceberSection
        onBackToDashboard={() => setSubView("none")}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
      />
    )
  }

  if (subView === "sangrias-suprimentos") {
    return (
      <NegociacoesSection
        title={UI_STRINGS.sangrias.sectionTitle}
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
        onBack={() => setSubView("none")}
      />
    )
  }

  if (subView === "rates-screen") {
    return (
      <DeliveryRatesScreen
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
        onBack={() => setSubView("none")}
        onSelectRate={(r) => {
          setSelectedRate(r)
          setSubView("none")
        }}
      />
    )
  }

  if (subView === "riders-screen") {
    return (
      <DeliveryRidersScreen
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
        onBack={() => setSubView("none")}
        onSelectRider={(r) => {
          setSelectedRider(r)
          setSubView("none")
        }}
      />
    )
  }

  if (step === "recibo") {
    return (
      <ViewTransition viewKey={step}>
        <PdvCheckoutReceipt
          cartItems={cartItems}
          payments={payments}
          onCloseReceipt={handleCloseReceipt}
        />
      </ViewTransition>
    )
  }

  return (
    <Stack gap={5} w="full" flex="1" minH="0" overflow="hidden">
      <ViewTransition viewKey={step} flex="1" direction="col" minH="0" overflow="hidden">
        {step === "negociacao" ? (
          <Stack gap={5} w="full" flex="1" minH="0">
            {/* Container do Catálogo e do Carrinho (verticalizado no mobile, lado a lado no PC) */}
            <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0">
              {/* Lado Esquerdo - Catálogo */}
              <Box display="flex" flex="1" w="full" direction="col" minH="0">
                <Stack gap={5} w="full" flex="1" minH="0" overflow="hidden">
                  {/* Barra com a bolinha de busca expansível para Desktop e Mobile */}
                  <Box w="full">
                    <PdvCatalogToolbar
                      searchQuery={searchQuery}
                      onSearchQueryChange={setSearchQuery}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                      onOpenCart={() => setIsCartDrawerOpen(true)}
                      onBarcodeScanned={handleBarcodeScanned}
                    />
                  </Box>

                  <PdvCatalog
                    activeCategory={activeCategory}
                    onActiveCategoryChange={setActiveCategory}
                    filteredProducts={filteredProducts}
                    onAddProduct={handleAddProduct}
                    categories={categories}
                    viewMode={viewMode}
                    cartItems={enrichedCartItems}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                  />

                  <Box display="block md:hidden" h="h-16" shrink="0" />
                </Stack>
              </Box>

              {/* Lado Direito - Carrinho e Totais (Visível apenas no Desktop) */}
              <Box display="hidden md:flex" w="1/4" direction="col" minH="0">
                <PdvCheckoutSidebar
                  cartItems={enrichedCartItems}
                  discount={discount}
                  total={total}
                  formatPrice={formatPrice}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                  onGoToPayment={handleGoToPayment}
                  onSaveComanda={activeComandaId ? handleSaveComandaAndExit : undefined}
                  onSaveDeliveryOrder={
                    deliveryContext?.isEditing && deliveryContext?.onSaveEdits
                      ? () => deliveryContext.onSaveEdits!(cartItems, subtotal, discount, total)
                      : undefined
                  }
                  submitLabel={deliveryContext?.isEditing ? "Salvar alterações" : undefined}
                />
              </Box>
            </Stack>
          </Stack>
        ) : step === "delivery-confirm" && deliveryContext ? (
          <DeliveryCheckoutConfirmation
            client={deliveryContext.client}
            rider={selectedRider}
            rate={selectedRate}
            onSelectRider={() => setSubView("riders-screen")}
            onClearRider={() => setSelectedRider(null)}
            onSelectRate={() => setSubView("rates-screen")}
            onClearRate={() => setSelectedRate(null)}
            onAlterClient={deliveryContext.onAlterClient}
            onCancel={() => setStep("negociacao")}
            onConfirmOrder={(data) => {
              if (data.paymentMoment === "advance") {
                setPendingDeliveryData({
                  ...data,
                  items: cartItems,
                  total,
                  subtotal,
                  discount,
                })
                setStep("pagamento")
              } else {
                deliveryContext.onConfirmDelivery({
                  ...data,
                  items: cartItems,
                  total,
                  subtotal,
                  discount,
                })
              }
            }}
          />
        ) : (
          <PdvCheckoutPayment
            cartItems={cartItems}
            payments={payments}
            discount={discount}
            subtotal={subtotal}
            total={total}
            totalPaid={totalPaid}
            amountDue={amountDue}
            formatPrice={formatPrice}
            onOpenDiscountModal={() => setIsDiscountModalOpen(true)}
            onLaunchPayment={handleLaunchPayment}
            onRemovePayment={handleRemovePayment}
            onEditPayment={handleEditPayment}
            onOpenChangeModal={() => setIsChangeModalOpen(true)}
            onOpenCardModal={() => setIsCardModalOpen(true)}
            onFinalizeSale={handleFinalizeSale}
            onRemoveItem={handleRemove}
            onIncreaseItem={handleIncrease}
            onDecreaseItem={handleDecrease}
            paymentAmountInput={paymentAmountInput}
            onChangePaymentAmountInput={setPaymentAmountInput}
            launchAmount={launchAmount}
          />
        )}
      </ViewTransition>

      {step === "negociacao" && (
        <Box
          display="block md:hidden"
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          w="full"
          zIndex="20"
        >
          <Box w="full" bg="bg-background" paddingX={5} paddingY={2.5}>
            <Stack direction="row" gap={2.5} w="full">
              {deliveryContext?.isEditing && deliveryContext?.onSaveEdits ? (
                <Button
                  variant="primary-lg"
                  fullWidth
                  label={UI_STRINGS.pdv.cart.saveChangesButton}
                  disabled={cartItems.length === 0}
                  onClick={() => deliveryContext.onSaveEdits!(cartItems, subtotal, discount, total)}
                />
              ) : (
                <Button
                  variant="primary-lg"
                  fullWidth
                  label={UI_STRINGS.pdv.cart.payButton}
                  disabled={cartItems.length === 0}
                  onClick={handleGoToPayment}
                />
              )}
              {activeComandaId && (
                <Button
                  variant="secondary-lg"
                  fullWidth
                  label={UI_STRINGS.pdv.cart.saveButton}
                  onClick={handleSaveComandaAndExit}
                />
              )}
            </Stack>
          </Box>
        </Box>
      )}

      <PdvCartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={enrichedCartItems}
        discount={discount}
        total={total}
        formatPrice={formatPrice}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
        onGoToPayment={handleGoToPayment}
        onSaveComanda={activeComandaId ? handleSaveComandaAndExit : undefined}
      />

      <PdvModals
        isChangeModalOpen={isChangeModalOpen}
        onCloseChangeModal={() => setIsChangeModalOpen(false)}
        amountDue={amountDue}
        onConfirmChangePayment={handleConfirmChangePayment}
        isCardModalOpen={isCardModalOpen}
        onCloseCardModal={() => setIsCardModalOpen(false)}
        formatPrice={formatPrice}
        onLaunchPayment={handleLaunchPayment}
        isDiscountModalOpen={isDiscountModalOpen}
        onCloseDiscountModal={() => setIsDiscountModalOpen(false)}
        onOpenDiscountModal={() => setIsDiscountModalOpen(true)}
        discount={discount}
        onChangeDiscount={setDiscount}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        onBackToDashboard={onBackToDashboard}
        launchAmount={launchAmount}
        subtotal={subtotal}
        onNavigate={handleSidebarNavigate}
        onOpenObservationModal={() => setIsObservationModalOpen(true)}
        onOpenSangriaModal={(mode = "sangria") => { setSangriaModalMode(mode); setIsSangriaModalOpen(true); }}
        customerName={activeClientOrTitle}
        showOutOfStockProducts={showOutOfStockProducts}
        onToggleShowOutOfStock={handleToggleShowOutOfStock}
        hasCartItems={cartItems.length > 0}
        onCancelOperation={() => {
          setIsSidebarOpen(false)
          if (cartItems.length === 0) {
            onBackToDashboardRef.current()
          } else {
            setIsExitConfirmOpen(true)
          }
        }}
      />

      <PdvObservacaoModal
        isOpen={isObservationModalOpen}
        onClose={() => setIsObservationModalOpen(false)}
        initialObservation={observationText}
        onSaveObservation={handleSaveObservation}
      />

      <PdvSangriaModal
        isOpen={isSangriaModalOpen}
        onClose={() => setIsSangriaModalOpen(false)}
        mode={sangriaModalMode}
        cashAvailable={39.00}
        onConfirmSangria={(amount, mode) => {
          setPendingSangriaAmount(amount)
          setSangriaModalMode(mode)
          setIsSangriaModalOpen(false)
          setIsSangriaObsModalOpen(true)
        }}
      />

      <PdvObservacaoModal
        isOpen={isSangriaObsModalOpen}
        onClose={() => {
          setIsSangriaObsModalOpen(false)
          setPendingSangriaAmount(0)
        }}
        title={sangriaModalMode === "suprimento" ? "Suprimento" : "Sangria"}
        description={`Você está fazendo ${sangriaModalMode === "suprimento" ? "um suprimento" : "uma sangria"} de ${formatPrice(pendingSangriaAmount)}.`}
        placeholder={UI_STRINGS.common.observation}
        initialObservation=""
        onSaveObservation={handleSaveSangriaMovement}
      />

      {/* Modal de confirmação de saída */}
      <ExitConfirmModal
        isOpen={isExitConfirmOpen}
        onClose={() => setIsExitConfirmOpen(false)}
        onConfirm={() => {
          setIsExitConfirmOpen(false)
          onBackToDashboardRef.current()
        }}
        isComanda={!!activeComandaId && !activeComandaId.startsWith("avulso-")}
        onSave={handleSaveComandaAndExit}
      />

      {/* Modal de confirmação de venda concluída */}
      <SaleSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleResetCaixaState}
        total={lastCompletedSaleData?.total || 0}
        change={lastCompletedSaleData?.change || 0}
        paymentMethod={lastCompletedSaleData?.paymentMethod}
        customerName={lastCompletedSaleData?.customerName}
        formatPrice={formatPrice}
        onPrintReceipt={() => {
          setIsSuccessModalOpen(false)
          setStep("recibo")
        }}
      />
    </Stack>
  )
}
