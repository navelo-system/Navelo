"use client"

/* eslint-disable max-lines-per-function, complexity */

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
import { Font } from "../../../base/Font"

import { NegociacoesSection } from "@/components/store/sections/pdv/pages/NegociacoesSection"
import { ClientesSection } from "@/components/store/sections/pdv/pages/ClientesSection"
import { DevolucaoSection } from "@/components/store/sections/pdv/pages/DevolucaoSection"
import { TotaisEmCaixaSection } from "@/components/store/sections/pdv/pages/TotaisEmCaixaSection"
import { ContasAReceberSection } from "@/components/store/sections/pdv/pages/ContasAReceberSection"
import { PdvObservacaoModal } from "@/components/store/sections/pdv/modals/PdvObservacaoModal"
import { PdvSangriaModal } from "@/components/store/sections/pdv/modals/PdvSangriaModal"

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
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  setCustomTitle?: (title: string | null) => void
}

const MOCK_PRODUCTS = [
  { id: "1", name: "Água mineral sem gás", category: "Bebidas", unitPrice: 4.50, unit: "UN", stock: 15, barcode: "7891000100103", image: "https://images.unsplash.com/photo-1560011961-4ab41261de01?w=200&auto=format&fit=crop" },
  { id: "2", name: "Água com gás", category: "Bebidas", unitPrice: 6.00, unit: "UN", stock: 2, barcode: "7894900011517", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&auto=format&fit=crop" },
  { id: "3", name: "Refrigerante lata", category: "Bebidas", unitPrice: 6.50, unit: "UN", stock: -3, barcode: "7891293901017", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&auto=format&fit=crop" },
  { id: "4", name: "Cerveja artesanal", category: "Bebidas", unitPrice: 12.00, unit: "UN", stock: 0, barcode: "7891234567890", image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=200&auto=format&fit=crop" },
  { id: "5", name: "Hambúrguer clássico", category: "Lanches", unitPrice: 28.90, unit: "UN", stock: 10, barcode: "7892345678901" },
  { id: "6", name: "Batata frita grande", category: "Acompanhamentos", unitPrice: 15.00, unit: "UN", stock: 20, barcode: "7893456789012" },
  { id: "7", name: "Pizza brotinho", category: "Lanches", unitPrice: 22.00, unit: "UN", stock: 5, barcode: "7894567890123" },
  { id: "8", name: "Suco natural laranja", category: "Bebidas", unitPrice: 9.00, unit: "UN", stock: 8, barcode: "7895678901234" }
]

const CATEGORIES = ["Todos", "Bebidas", "Lanches", "Acompanhamentos"]

export const PdvSection: React.FC<PdvSectionProps> = ({
  onBackToDashboard,
  activeComandaId,
  onCloseComanda,
  setCustomBack,
  setCustomActions,
  setCustomTitle,
}) => {
  const [step, setStep] = React.useState<"negociacao" | "pagamento" | "recibo">("negociacao")
  const [subView, setSubView] = React.useState<"none" | "negociacoes" | "clientes" | "devolucao" | "totais-em-caixa" | "recebimentos" | "sangrias-suprimentos">("none")
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
  const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false)
  const [isExitConfirmOpen, setIsExitConfirmOpen] = React.useState(false)
  const [isObservationModalOpen, setIsObservationModalOpen] = React.useState(false)
  const [isSangriaModalOpen, setIsSangriaModalOpen] = React.useState(false)
  const [sangriaModalMode, setSangriaModalMode] = React.useState<"sangria" | "suprimento">("sangria")
  const [observationText, setObservationText] = React.useState("")

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
  const total = Math.max(0, subtotal - discount)
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0)
  const amountDue = Math.max(0, total - totalPaid)

  // Ref estável para onBackToDashboard — evita que referência instável cause loop infinito no useEffect
  const onBackToDashboardRef = React.useRef(onBackToDashboard)
  React.useEffect(() => {
    onBackToDashboardRef.current = onBackToDashboard
  }, [onBackToDashboard])

  // Registra o back e o título corretos de acordo com o step atual e a subView ativa
  React.useEffect(() => {
    if (subView !== "none") return

    setCustomTitle?.(null)

    if (step === "negociacao") {
      // Se o carrinho estiver vazio, volta direto; se tiver itens, confirma saída
      setCustomBack?.(() => () => {
        if (cartItems.length === 0) {
          onBackToDashboardRef.current()
        } else {
          setIsExitConfirmOpen(true)
        }
      })
    } else if (step === "pagamento") {
      setCustomBack?.(() => () => setStep("negociacao"))
    } else if (step === "recibo") {
      setCustomBack?.(() => () => setStep("pagamento"))
    }
  }, [step, subView, setCustomBack, setCustomTitle, cartItems.length])

  React.useEffect(() => {
    if (subView !== "none") return

    if (step === "negociacao") {
      setCustomActions?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          placeholder="Pesquisar produto pelo nome..."
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
        <Font
          variant="body-sm-medium"
          color="primary"
          text="F12 - Opções"
        />
      )
    } else {
      setCustomActions?.(null)
    }
  }, [step, subView, searchQuery, setCustomActions])

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

  const handleBarcodeScanned = (code: string) => {
    const product = MOCK_PRODUCTS.find(
      (prod) => prod.barcode === code || prod.id === code
    )
    if (product) {
      handleAddProduct(product)
    }
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

  const handleEditPayment = (idx: number, newAmount: number) => {
    setPayments((prev) => prev.map((p, i) => i === idx ? { ...p, amount: newAmount } : p))
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

  if (subView === "negociacoes") {
    return (
      <NegociacoesSection
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
        onBack={() => setSubView("none")}
      />
    )
  }

  if (subView === "clientes") {
    return (
      <ClientesSection
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
        onBack={() => setSubView("none")}
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
        title="Sangrias e suprimentos"
        setCustomBack={setCustomBack}
        setCustomTitle={setCustomTitle}
        setCustomActions={setCustomActions}
        onBack={() => setSubView("none")}
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
                    categories={CATEGORIES}
                    viewMode={viewMode}
                    cartItems={cartItems}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                  />

                  <Box display="block md:hidden" h="h-16" shrink="0" />
                </Stack>
              </Box>

              {/* Lado Direito - Carrinho e Totais (Visível apenas no Desktop) */}
              <Box display="hidden md:block" w="1/4" direction="col" minH="0">
                <PdvCheckoutSidebar
                  cartItems={cartItems}
                  discount={discount}
                  total={total}
                  formatPrice={formatPrice}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                  onGoToPayment={() => setStep("pagamento")}
                  onSaveComanda={activeComandaId ? onBackToDashboard : undefined}
                />
              </Box>
            </Stack>
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
              <Button
                variant="primary-lg"
                fullWidth
                label="F9 - Pagamento"
                disabled={cartItems.length === 0}
                onClick={() => setStep("pagamento")}
              />
              {activeComandaId && (
                <Button
                  variant="secondary-lg"
                  fullWidth
                  label="Salvar"
                  onClick={onBackToDashboard}
                />
              )}
            </Stack>
          </Box>
        </Box>
      )}

      <PdvCartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        discount={discount}
        total={total}
        formatPrice={formatPrice}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
        onGoToPayment={() => setStep("pagamento")}
        onSaveComanda={activeComandaId ? onBackToDashboard : undefined}
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
        discount={discount}
        onChangeDiscount={setDiscount}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
        onBackToDashboard={onBackToDashboard}
        launchAmount={launchAmount}
        subtotal={subtotal}
        onNavigate={(view) => setSubView(view)}
        onOpenObservationModal={() => setIsObservationModalOpen(true)}
        onOpenSangriaModal={(mode = "sangria") => { setSangriaModalMode(mode); setIsSangriaModalOpen(true); }}
      />

      <PdvObservacaoModal
        isOpen={isObservationModalOpen}
        onClose={() => setIsObservationModalOpen(false)}
        initialObservation={observationText}
        onSaveObservation={(obs) => setObservationText(obs)}
      />

      <PdvSangriaModal
        isOpen={isSangriaModalOpen}
        onClose={() => setIsSangriaModalOpen(false)}
        mode={sangriaModalMode}
        cashAvailable={39.00}
        onConfirmSangria={() => {}}
      />

      {/* Modal de confirmação de saída */}
      <ExitConfirmModal
        isOpen={isExitConfirmOpen}
        onClose={() => setIsExitConfirmOpen(false)}
        onConfirm={() => {
          setIsExitConfirmOpen(false)
          onBackToDashboardRef.current()
        }}
      />
    </Stack>
  )
}
