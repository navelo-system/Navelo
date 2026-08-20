"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Package, Plus, Minus } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

interface DevolucaoItem {
  id: string
  name: string
  price: string
  quantity: number
}

interface DevolucaoSectionProps {
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  onBack: () => void
}

function DevolucaoItemsList({
  items, onFinish,
}: {
  items: DevolucaoItem[]
  onFinish: () => void
}) {
  const s = UI_STRINGS.returns
  return (
    <Box flex="1" w="full" bg="bg-surface" padding={5} radius="default" direction="col" justify="between" minH="0">
      <Box flex="1" w="full" direction="col" justify="center" minH="0">
        {items.length === 0 ? (
          <EmptyState icon={Package} title={s.emptyTitle} subtitle={s.emptySubtitle} />
        ) : (
          <Stack gap={2.5} w="full" overflow="x-hidden y-auto" minH="0">
            {items.map((item) => (
              <Box key={item.id} padding={2.5} border borderColor="border-border" radius="default">
                <Stack direction="row" justify="between" align="center">
                  <Font variant="body-bold" text={item.name} />
                  <Font variant="body" text={`${item.quantity}x R$ ${item.price}`} />
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
      <Box w="full" shrink="0" paddingY={1}>
        <Button variant="primary" label={UI_STRINGS.common.finish} fullWidth onClick={onFinish} />
      </Box>
    </Box>
  )
}

function DevolucaoAddProductForm({
  productQuery, setProductQuery, price, setPrice, quantity, setQuantity, onAddProduct,
}: {
  productQuery: string; setProductQuery: (q: string) => void
  price: string; setPrice: (p: string) => void
  quantity: number; setQuantity: React.Dispatch<React.SetStateAction<number>>
  onAddProduct: () => void
}) {
  const s = UI_STRINGS.returns
  return (
    <Box w="w-full md:w-[380px]" bg="bg-surface" padding={5} radius="default" shrink="0" overflow="auto">
      <Stack gap={5} w="full">
        <Stack gap={1} w="full">
          <Font variant="body-bold" text={s.addProductTitle} />
          <Font variant="description" text={s.addProductDesc} color="muted" />
        </Stack>
        <Stack gap={1} w="full">
          <Input label={s.productLabel} placeholder={s.searchPlaceholder} value={productQuery} onChange={(e) => setProductQuery(e.target.value)} />
          <Font variant="auxiliary" text={s.productHelp} color="muted" />
        </Stack>
        <Stack direction="row" gap={2.5} w="full" align="end">
          <Box flex="1">
            <Input label={s.priceLabel} value={`R$ ${price}`} onChange={(e) => setPrice(e.target.value.replace("R$ ", ""))} />
          </Box>
          <Box flex="1">
            <Stack gap={1} w="full">
              <Font variant="auxiliary" text={s.quantityLabel} color="muted" />
              <Stack direction="row" align="center" justify="between" w="full" h="h-10">
                <Button variant="primary-icon-xs" icon={Minus} type="button" onClick={() => setQuantity((q) => Math.max(0, q - 1))} />
                <Font variant="body-bold" text={String(quantity)} align="center" />
                <Button variant="primary-icon-xs" icon={Plus} type="button" onClick={() => setQuantity((q) => q + 1)} />
              </Stack>
            </Stack>
          </Box>
        </Stack>
        <Button variant="primary" label={s.addProductButton} fullWidth onClick={onAddProduct} />
      </Stack>
    </Box>
  )
}

export const DevolucaoSection: React.FC<DevolucaoSectionProps> = ({
  setCustomBack, setCustomTitle, setCustomActions, onBack,
}) => {
  const [productQuery, setProductQuery] = React.useState("")
  const [price, setPrice] = React.useState("0,00")
  const [quantity, setQuantity] = React.useState(0)
  const [items, setItems] = React.useState<DevolucaoItem[]>([])
  const s = UI_STRINGS.returns

  const onBackRef = React.useRef(onBack)
  React.useEffect(() => { onBackRef.current = onBack }, [onBack])

  React.useEffect(() => {
    setCustomTitle?.(s.title)
    setCustomBack?.(() => () => onBackRef.current())
    setCustomActions?.(null)
    return () => { setCustomTitle?.(null); setCustomBack?.(null); setCustomActions?.(null) }
  }, [setCustomBack, setCustomTitle, setCustomActions, s.title])

  const handleAddProduct = () => {
    if (!productQuery || quantity <= 0) return
    setItems((prev) => [...prev, { id: Date.now().toString(), name: productQuery, price, quantity }])
    setProductQuery("")
    setQuantity(0)
  }

  return (
    <Stack direction="col" gap={5} w="full" flex="1" minH="0">
      <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0">
        <DevolucaoItemsList items={items} onFinish={onBack} />
        <DevolucaoAddProductForm
          productQuery={productQuery} setProductQuery={setProductQuery}
          price={price} setPrice={setPrice} quantity={quantity}
          setQuantity={setQuantity} onAddProduct={handleAddProduct}
        />
      </Stack>
    </Stack>
  )
}
