"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"

import { PdvCatalog, MockProduct } from "./PdvCatalog"
import { PdvCheckoutPayment } from "./PdvCheckoutPayment"
import { PdvCheckoutReceipt } from "./PdvCheckoutReceipt"
import { PdvCheckoutSidebar } from "./PdvCheckoutSidebar"
import { PdvModals } from "./PdvModals"

// Interface dos itens do carrinho
export interface CartItemType {
  id: string
  name: string
  quantity: number
  unitPrice: number
  image?: string
}

interface PdvSectionProps {
  onBackToDashboard: () => void
  activeComandaId?: string | null
  onCloseComanda?: (id: string) => void
}

const MOCK_PRODUCTS = [
  { id: "1", name: "Água mineral sem gás", category: "Bebidas", unitPrice: 4.50, unit: "UN", stock: 15, image: "https://images.unsplash.com/photo-1560011961-4ab41261de01?w=200&auto=format&fit=crop" },
  { id: "2", name: "Água com gás", category: "Bebidas", unitPrice: 6.00, unit: "UN", stock: 2, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&auto=format&fit=crop" },
  { id: "3", name: "Refrigerante lata", category: "Bebidas", unitPrice: 6.50, unit: "UN", stock: -3, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&auto=format&fit=crop" },
  { id: "4", name: "Cerveja artesanal", category: "Bebidas", unitPrice: 12.00, unit: "UN", stock: 0, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=200&auto=format&fit=crop" },
  { id: "5", name: "Hambúrguer clássico", category: "Lanches", unitPrice: 28.90, unit: "UN", stock: 10 },
  { id: "6", name: "Batata frita grande", category: "Acompanhamentos", unitPrice: 15.00, unit: "UN", stock: 20 },
  { id: "7", name: "Pizza brotinho", category: "Lanches", unitPrice: 22.00, unit: "UN", stock: 5 },
  { id: "8", name: "Suco natural laranja", category: "Bebidas", unitPrice: 9.00, unit: "UN", stock: 8 }
]

const CATEGORIES = ["Todos", "Bebidas", "Lanches", "Acompanhamentos"]

export const PdvSection: React.FC<PdvSectionProps> = ({
  onBackToDashboard,
  activeComandaId,
  onCloseComanda
}) => {
  const [step, setStep] = React.useState<"negociacao" | "pagamento" | "recibo">("negociacao")
  const [cartItems, setCartItems] = React.useState<CartItemType[]>([])
  const [activeCategory, setActiveCategory] = React.useState("Todos")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewMode] = React.useState<"grade" | "lista">("grade")
  const [quantityMultiplier, setQuantityMultiplier] = React.useState(1)

  // Pagamentos
  const [payments, setPayments] = React.useState<{ method: string; amount: number }[]>([])
  const [discount, setDiscount] = React.useState(0)
  const [paymentAmountInput, setPaymentAmountInput] = React.useState("")

  // Modais
  const [isChangeModalOpen, setIsChangeModalOpen] = React.useState(false)
  const [isCardModalOpen, setIsCardModalOpen] = React.useState(false)
  const [isDiscountModalOpen, setIsDiscountModalOpen] = React.useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
  const total = Math.max(0, subtotal - discount)
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0)
  const amountDue = Math.max(0, total - totalPaid)

  // Sincroniza o valor de pagamento sugerido com o restante a pagar reativamente
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setPaymentAmountInput(amountDue > 0 ? amountDue.toFixed(2).replace(".", ",") : "")
    }, 0)
    return () => clearTimeout(timer)
  }, [amountDue])

  const parsedPaymentAmount = parseFloat(paymentAmountInput.replace(",", ".")) || amountDue
  const launchAmount = Math.min(parsedPaymentAmount, amountDue)

  // Adicionar produto
  const handleAddProduct = (prod: MockProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === prod.id)
      if (existing) {
        return prev.map((item) =>
          item.id === prod.id ? { ...item, quantity: item.quantity + quantityMultiplier } : item
        )
      }
      return [...prev, { id: prod.id, name: prod.name, quantity: quantityMultiplier, unitPrice: prod.unitPrice, image: prod.image }]
    })
    setQuantityMultiplier(1) // reseta o multiplicador
  }

  const handleIncrease = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
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

  // Filtragem
  const filteredProducts = MOCK_PRODUCTS.filter((prod) => {
    const matchesCategory = activeCategory === "Todos" || prod.category.toLowerCase() === activeCategory.toLowerCase()
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Pagamento rápido
  const handleLaunchPayment = (method: string, amount: number) => {
    setPayments((prev) => [...prev, { method, amount }])
  }

  const handleRemovePayment = (idx: number) => {
    setPayments((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleConfirmChangePayment = (amount: number) => {
    handleLaunchPayment("Dinheiro", amount)
    setIsChangeModalOpen(false)
  }

  const handleFinalizeSale = () => {
    setStep("recibo")
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

  if (step === "recibo") {
    return (
      <PdvCheckoutReceipt
        cartItems={cartItems}
        payments={payments}
        onCloseReceipt={handleCloseReceipt}
      />
    )
  }

  return (
    <Stack gap={5} w="full">
      {step === "negociacao" ? (
        <Stack direction="row" gap={5} w="full" align="stretch">
          {/* Lado Esquerdo - Catálogo */}
          <Box flex="1">
            <PdvCatalog
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              quantityMultiplier={quantityMultiplier}
              onQuantityMultiplierChange={() => setQuantityMultiplier((prev) => (prev >= 9 ? 1 : prev + 1))}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              activeCategory={activeCategory}
              onActiveCategoryChange={setActiveCategory}
              filteredProducts={filteredProducts}
              onAddProduct={handleAddProduct}
              onOpenDiscountModal={() => setIsDiscountModalOpen(true)}
              onOpenSidebarDrawer={() => setIsSidebarOpen(true)}
              categories={CATEGORIES}
            />
          </Box>

          {/* Lado Direito - Carrinho e Totais */}
          <Box w="1/4">
            <PdvCheckoutSidebar
              cartItems={cartItems}
              discount={discount}
              total={total}
              formatPrice={formatPrice}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
              onGoToPayment={() => setStep("pagamento")}
            />
          </Box>
        </Stack>
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
          onOpenChangeModal={() => setIsChangeModalOpen(true)}
          onOpenCardModal={() => setIsCardModalOpen(true)}
          onFinalizeSale={handleFinalizeSale}
          paymentAmountInput={paymentAmountInput}
          onChangePaymentAmountInput={setPaymentAmountInput}
          launchAmount={launchAmount}
        />
      )}

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
        discount={discount}
        onChangeDiscount={setDiscount}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        onBackToDashboard={onBackToDashboard}
        launchAmount={launchAmount}
      />
    </Stack>
  )
}
