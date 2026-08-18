"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { FormActions } from "@/components/store/intermediary/FormActions"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Package, Plus, Minus } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface ManualMovementFormProps {
  products: { id: string; name: string; systemStock: number }[]
  onCancel: () => void
  onSubmit: (data: { productId: string; type: string; qty: string; reason: string }) => void
}

export const ManualMovementForm: React.FC<ManualMovementFormProps> = ({
  products,
  onCancel,
  onSubmit,
}) => {
  const [productId, setProductId] = React.useState(products[0]?.id || "")
  const [type, setType] = React.useState("Entrada")
  const [qty, setQty] = React.useState("")
  const [reason, setReason] = React.useState("")
  const inv = UI_STRINGS.inventory

  const [prevProducts, setPrevProducts] = React.useState(products)

  if (products !== prevProducts) {
    setPrevProducts(products)
    if (products.length > 0 && !productId) {
      setProductId(products[0].id)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!qty) return
    onSubmit({ productId, type, qty, reason })
    setQty("")
    setReason("")
  }

  return (
    <Box as="form" onSubmit={handleSubmit} w="full">
      <Box w="full">
        <Stack gap={5}>
          {/* Produto */}
          <Stack gap={1}>
            <Font variant="body-sm-semibold" text={inv.selectProductLabel} />
            <CustomSelect value={productId} onChange={(val) => setProductId(val)}>
              {products.map((p) => (
                <CustomSelectItem
                  key={p.id}
                  value={p.id}
                  text={`${p.name} (Atual: ${p.systemStock} UN)`}
                  icon={Package}
                />
              ))}
            </CustomSelect>
          </Stack>

          {/* Tipo de Movimentação */}
          <Stack gap={1}>
            <Font variant="body-sm-semibold" text={inv.movementTypeLabel} />
            <CustomSelect value={type} onChange={(val) => setType(val)}>
              <CustomSelectItem value="Entrada" text={inv.entryPlusOption} icon={Plus} />
              <CustomSelectItem value="Saída" text={inv.exitMinusOption} icon={Minus} />
            </CustomSelect>
          </Stack>

          {/* Quantidade */}
          <Stack gap={1}>
            <Font variant="body-sm-semibold" text={inv.quantityUnitsLabel} />
            <Input
              placeholder={inv.quantityUnitsPlaceholder}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
            />
          </Stack>

          {/* Motivação */}
          <Stack gap={1}>
            <Font variant="body-sm-semibold" text={inv.movementReasonLabel} />
            <Input
              placeholder={inv.movementReasonPlaceholder}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Stack>

          {/* Botões */}
          <FormActions
            confirmLabel={inv.confirmMovementButton}
            onConfirm={() => {}}
            isSubmit={true}
            onCancel={onCancel}
          />
        </Stack>
      </Box>
    </Box>
  )
}
