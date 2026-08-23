"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Package, Plus, Minus, Trash2, X, Search } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import { useProducts, useCashRegisters, dal } from "@/lib/dal"
import { Product, CashRegister } from "@/lib/dal/db"

export interface DevolucaoItem {
  id: string
  productId: string
  name: string
  unitPrice: number
  quantity: number
  unit?: string
}

interface DevolucaoSectionProps {
  tenantId?: string
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack: () => void
}

function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function DevolucaoProductSearchDropdown({
  isOpen,
  filteredProducts,
  onSelect,
  noProductsLabel,
}: {
  isOpen: boolean
  filteredProducts: Product[]
  onSelect: (p: Product) => void
  noProductsLabel: string
}) {
  if (!isOpen) return null

  return (
    <Box
      position="absolute"
      top="100%"
      left="0"
      right="0"
      bg="bg-white"
      radius="default"
      shadow="default"
      border
      borderColor="border-border"
      zIndex="50"
      maxH="96"
      overflowY="auto"
      w="full"
    >
      {filteredProducts.length > 0 ? (
        filteredProducts.map((prod) => (
          <Box
            key={prod.id}
            padding={2.5}
            hoverBg="secondary/10"
            cursor="pointer"
            borderBottom
            borderColor="border-border"
            onClick={() => onSelect(prod)}
          >
            <Stack direction="row" justify="between" align="center" w="full">
              <Stack gap={0} align="start" flex="1">
                <Font variant="body-sm-medium" text={prod.name.toUpperCase()} />
                <Font
                  variant="auxiliary"
                  color="muted"
                  text={`${prod.category || ""} ${prod.barcode ? `• Cód: ${prod.barcode}` : ""}`}
                />
              </Stack>
              <Stack gap={0} align="end">
                <Font variant="body-bold" color="primary" text={`R$ ${formatBRL(prod.price || 0)}`} />
                <Font variant="auxiliary" color="muted" text={`Estoque: ${prod.stock || 0}`} />
              </Stack>
            </Stack>
          </Box>
        ))
      ) : (
        <Box padding={5} align="center" justify="center">
          <Stack gap={1} align="center">
            <Icon icon={Search} size={20} color="muted" />
            <Font variant="body-sm-medium" color="muted" text={noProductsLabel} />
          </Stack>
        </Box>
      )}
    </Box>
  )
}

function DevolucaoItemsList({
  items,
  onRemoveItem,
  onFinish,
}: {
  items: DevolucaoItem[]
  onRemoveItem: (id: string) => void
  onFinish: () => void
}) {
  const s = UI_STRINGS.returns
  return (
    <Box flex="1" position="relative" display="flex" direction="col" justify="between" h="full" w="full">
      <Stack gap={5} w="full">
        {items.length === 0 ? (
          <EmptyState icon={Package} title={s.emptyTitle} subtitle={s.emptySubtitle} />
        ) : (
          <Box w="full" maxH="96" overflow="x-hidden y-auto">
            <Box display="flex" direction="col" w="full">
              {items.map((item, idx) => (
                <Box key={item.id}>
                  <Box padding={2.5} w="full">
                    <Stack direction="row" align="center" justify="between" w="full">
                      <Stack gap={0} align="start" flex="1" minW="0">
                        <Font variant="body-sm-medium" text={item.name.toUpperCase()} />
                        <Font
                          variant="auxiliary"
                          color="muted"
                          text={`Unit: R$ ${formatBRL(item.unitPrice)}`}
                        />
                      </Stack>
                      <Stack direction="row" gap={2.5} align="center">
                        <Font
                          variant="body-bold"
                          color="primary"
                          text={`R$ ${formatBRL(item.unitPrice * item.quantity)} (${item.quantity} ${item.unit || "UN"})`}
                        />
                        <Button
                          variant="danger-icon-xs"
                          icon={Trash2}
                          title={s.removeItemTitle}
                          onClick={() => onRemoveItem(item.id)}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                  {idx < items.length - 1 && <Box borderBottom borderColor="border-border" w="full" />}
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Stack>
      <Button
        variant="primary"
        label={s.finishButton}
        fullWidth
        disabled={items.length === 0}
        onClick={onFinish}
      />
    </Box>
  )
}

function DevolucaoQuantityAdjuster({
  quantity,
  setQuantity,
}: {
  quantity: number
  setQuantity: React.Dispatch<React.SetStateAction<number>>
}) {
  const s = UI_STRINGS.returns
  return (
    <Stack direction="row" align="center" gap={2.5} w="full">
      <Button
        variant="secondary-pill-icon"
        icon={Minus}
        title={s.decreaseQuantity}
        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
      />
      <Box flex="1">
        <Input
          variant="outlined-label"
          label={s.quantityLabel}
          type="number"
          value={quantity.toString()}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
        />
      </Box>
      <Button
        variant="secondary-pill-icon"
        icon={Plus}
        title={s.increaseQuantity}
        onClick={() => setQuantity((prev) => prev + 1)}
      />
    </Stack>
  )
}

function DevolucaoProductInputField({
  searchQuery,
  setSearchQuery,
  selectedProduct,
  filteredProducts,
  onSelectProduct,
  onClearSelectedProduct,
}: {
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedProduct: Product | null
  filteredProducts: Product[]
  onSelectProduct: (p: Product) => void
  onClearSelectedProduct: () => void
}) {
  const s = UI_STRINGS.returns
  const [isOpen, setIsOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <Stack ref={containerRef} gap={1} w="full">
      <Box position="relative" w="full">
        <Input
          variant="outlined-label"
          label={s.productLabel}
          placeholder={s.productPlaceholder}
          value={selectedProduct ? selectedProduct.name.toUpperCase() : searchQuery}
          onFocus={() => !selectedProduct && setIsOpen(true)}
          onChange={(e) => {
            if (!selectedProduct) {
              setSearchQuery(e.target.value)
              setIsOpen(true)
            }
          }}
          iconRight={selectedProduct ? X : undefined}
          onIconRightClick={selectedProduct ? onClearSelectedProduct : undefined}
        />
        {!selectedProduct && (
          <DevolucaoProductSearchDropdown
            isOpen={isOpen}
            filteredProducts={filteredProducts}
            onSelect={(p) => {
              onSelectProduct(p)
              setIsOpen(false)
            }}
            noProductsLabel={s.noProductsAvailable}
          />
        )}
      </Box>
      <Font variant="auxiliary" text={s.productHelp} color="muted" />
    </Stack>
  )
}

function DevolucaoAddProductCard({
  searchQuery,
  setSearchQuery,
  selectedProduct,
  quantity,
  setQuantity,
  filteredProducts,
  onSelectProduct,
  onClearSelectedProduct,
  onAddProduct,
}: {
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedProduct: Product | null
  quantity: number
  setQuantity: React.Dispatch<React.SetStateAction<number>>
  filteredProducts: Product[]
  onSelectProduct: (p: Product) => void
  onClearSelectedProduct: () => void
  onAddProduct: () => void
}) {
  const s = UI_STRINGS.returns

  return (
    <Box position="relative" bg="bg-white" padding={5} radius="default" h="fit-content" w="full">
      <Stack gap={5} w="full">
        <Stack gap={1} w="full">
          <Font variant="body-bold" text={s.addProductTitle} />
          <Font variant="description" text={s.addProductDesc} color="muted" />
        </Stack>

        <DevolucaoProductInputField
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedProduct={selectedProduct}
          filteredProducts={filteredProducts}
          onSelectProduct={onSelectProduct}
          onClearSelectedProduct={onClearSelectedProduct}
        />

        <Stack direction="row" gap={2.5} w="full" align="center">
          <Box flex="1">
            <Input
              variant="outlined-label"
              label={s.priceLabel}
              value={`R$ ${formatBRL(selectedProduct ? selectedProduct.price || 0 : 0)}`}
              disabled
            />
          </Box>
          <Box flex="1">
            <DevolucaoQuantityAdjuster
              quantity={quantity}
              setQuantity={setQuantity}
            />
          </Box>
        </Stack>

        <Button
          variant="primary"
          label={s.addProductButton}
          disabled={!selectedProduct || quantity <= 0}
          fullWidth
          onClick={onAddProduct}
        />
      </Stack>
    </Box>
  )
}

async function executeReturnTransaction(
  items: DevolucaoItem[],
  products: Product[] | undefined,
  cashRegisters: CashRegister[] | undefined,
  tenantId?: string
) {
  await Promise.all(
    items.map(async (item) => {
      const prod = products?.find((p) => p.id === item.productId)
      if (prod) {
        await dal.products.update({
          ...prod,
          stock: (prod.stock || 0) + item.quantity,
        })
      }
    })
  )

  const openRegister = cashRegisters?.find((r) => r.status === "OPEN")
  const totalRefund = items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0)
  if (openRegister && totalRefund > 0) {
    const activeTenant = tenantId || "tenant-11111111111111"
    await dal.cashMovements.create({
      id: crypto.randomUUID(),
      cash_register_id: openRegister.id,
      company_id: openRegister.company_id || activeTenant,
      tenant_id: activeTenant,
      type: "REFUND",
      amount: totalRefund,
      description: `Devolução de produtos (${items.length} itens)`,
      operator_name: openRegister.operator_name || "Operador",
      created_at: new Date().toISOString(),
    })
    await dal.cashRegisters.update({
      ...openRegister,
      current_balance: Math.max(0, (openRegister.current_balance || 0) - totalRefund),
    })
  }
}

export const DevolucaoSection: React.FC<DevolucaoSectionProps> = ({
  tenantId, setCustomBack, setCustomTitle, setCustomActions, onBack,
}) => {
  const s = UI_STRINGS.returns
  const products = useProducts(tenantId)
  const cashRegisters = useCashRegisters(tenantId)
  const [items, setItems] = React.useState<DevolucaoItem[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
  const [quantity, setQuantity] = React.useState(1)

  const onBackRef = React.useRef(onBack)
  React.useEffect(() => { onBackRef.current = onBack }, [onBack])

  React.useEffect(() => {
    setCustomTitle?.(s.title)
    setCustomBack?.(() => () => onBackRef.current())
    setCustomActions?.(null)
    return () => { setCustomTitle?.(null); setCustomBack?.(null); setCustomActions?.(null) }
  }, [setCustomBack, setCustomTitle, setCustomActions, s.title])

  const filteredProducts = React.useMemo(() => {
    if (!products) return []
    if (!searchQuery.trim()) return products.slice(0, 30)
    const q = searchQuery.toLowerCase()
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.barcode && p.barcode.toLowerCase().includes(q))
    )
  }, [products, searchQuery])

  const handleAddProduct = () => {
    if (!selectedProduct || quantity <= 0) return
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        productId: selectedProduct.id,
        name: selectedProduct.name,
        unitPrice: selectedProduct.price || 0,
        quantity,
        unit: selectedProduct.unit || "UN",
      },
    ])
    setSelectedProduct(null)
    setSearchQuery("")
    setQuantity(1)
  }

  const handleFinishReturn = async () => {
    if (items.length === 0) return
    await executeReturnTransaction(items, products, cashRegisters, tenantId)
    onBack()
  }

  return (
    <Stack direction="col" mobileDirection="row" gap={5} w="full" h="full" align="stretch" flex="1" minH="0">
      <Box order="2" mdOrder="1" mdFlex="1" position="relative" display="flex" direction="col" w="full">
        <DevolucaoItemsList
          items={items}
          onRemoveItem={(id) => setItems((prev) => prev.filter((it) => it.id !== id))}
          onFinish={handleFinishReturn}
        />
      </Box>
      <Box order="1" mdOrder="2" mdFlex="1" position="relative" w="full">
        <DevolucaoAddProductCard
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedProduct={selectedProduct}
          quantity={quantity}
          setQuantity={setQuantity}
          filteredProducts={filteredProducts}
          onSelectProduct={(p) => { setSelectedProduct(p); setSearchQuery(""); setQuantity(1) }}
          onClearSelectedProduct={() => { setSelectedProduct(null); setSearchQuery(""); setQuantity(1) }}
          onAddProduct={handleAddProduct}
        />
      </Box>
    </Stack>
  )
}
