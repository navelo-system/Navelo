"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Button } from "../../base/Button"
import { Input } from "../../base/Input"
import { ViewModeToggle } from "../../intermediary/ViewModeToggle"
import { Search, Percent, Menu, LogOut } from "lucide-react"
import { ViewTransition } from "../../base/ViewTransition"
import { Modal } from "../../base/Modal"

import { PdvCatalog, MockProduct } from "./PdvCatalog"
import { PdvCheckoutPayment } from "./PdvCheckoutPayment"
import { PdvCheckoutReceipt } from "./PdvCheckoutReceipt"
import { PdvCheckoutSidebar } from "./PdvCheckoutSidebar"
import { PdvModals } from "./PdvModals"
import { Font } from "../../base/Font"

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
  onCloseComanda,
  setCustomBack,
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
  const [isExitConfirmOpen, setIsExitConfirmOpen] = React.useState(false)

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
  const total = Math.max(0, subtotal - discount)
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0)
  const amountDue = Math.max(0, total - totalPaid)

  // Ref estável para onBackToDashboard — evita que referência instável cause loop infinito no useEffect
  const onBackToDashboardRef = React.useRef(onBackToDashboard)
  React.useEffect(() => {
    onBackToDashboardRef.current = onBackToDashboard
  }, [onBackToDashboard])

  // Registra o back correto de acordo com o step atual
  React.useEffect(() => {
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
    return () => setCustomBack?.(null)
  }, [step, setCustomBack, cartItems.length])

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
    <Stack gap={5} w="full">
      <ViewTransition viewKey={step}>
        {step === "negociacao" ? (
          <Stack gap={5} w="full">
            {/* Controles de pesquisa e view toggle (busca cheia no mobile, lado a lado no PC) */}
            <Stack direction="col" mobileDirection="row" gap={2.5} align="stretch" mobileAlign="center" justify="between" w="full">
              <Box flex="1" padding={0} w="full">
                <Input
                  placeholder="Pesquisar produto pelo nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </Box>
              <Stack direction="row" gap={2.5} align="center" justify="between" mobileJustify="end" w="full" className="md:w-auto">
                {/* Segmented View Toggle */}
                <ViewModeToggle value={viewMode} onChange={setViewMode} />
                
                {/* Botões de Ação da Direita */}
                <Stack direction="row" gap={2.5} align="center">
                  {/* Desconto */}
                  <Button
                    variant="secondary-pill-icon"
                    icon={Percent}
                    onClick={() => setIsDiscountModalOpen(true)}
                  />
                  {/* Menu Hamburguer */}
                  <Button
                    variant="primary-pill-icon"
                    icon={Menu}
                    onClick={() => setIsSidebarOpen(true)}
                  />
                </Stack>
              </Stack>
            </Stack>

            {/* Container do Catálogo e do Carrinho (verticalizado no mobile, lado a lado no PC) */}
            <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch">
              {/* Lado Esquerdo - Catálogo */}
              <Box flex="1" w="full">
                <PdvCatalog
                  activeCategory={activeCategory}
                  onActiveCategoryChange={setActiveCategory}
                  filteredProducts={filteredProducts}
                  onAddProduct={handleAddProduct}
                  categories={CATEGORIES}
                  viewMode={viewMode}
                />
              </Box>

              {/* Lado Direito - Carrinho e Totais */}
              <Box w="full" className="md:w-1/4">
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
            onRemoveItem={handleRemove}
            paymentAmountInput={paymentAmountInput}
            onChangePaymentAmountInput={setPaymentAmountInput}
            launchAmount={launchAmount}
          />
        )}
      </ViewTransition>

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
      />

      {/* Modal de confirmação de saída */}
      <Modal
        isOpen={isExitConfirmOpen}
        onClose={() => setIsExitConfirmOpen(false)}
        title="Descartar operação e sair do caixa?"
        subtitle="Os itens do carrinho e os pagamentos lançados serão descartados."
        icon={LogOut}
        successText="Descartar e sair"
        onSuccess={() => {
          setIsExitConfirmOpen(false)
          onBackToDashboardRef.current()
        }}
        showCancelButton
      >
        <Stack gap={2.5}>
          <Font variant="body" text={`Você possui ${cartItems.length} ${cartItems.length === 1 ? "item" : "itens"} no carrinho com um total de ${formatPrice(total)}.`} />
          <Font variant="body" text="Ao sair, toda a operação atual será perdida e você voltará ao painel principal. Esta ação não pode ser desfeita." color="muted" />
        </Stack>
      </Modal>
    </Stack>
  )
}
