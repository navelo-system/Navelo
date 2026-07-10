"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Package, Plus, Minus } from "lucide-react"

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
            <Font variant="body-sm-semibold" text="Selecionar Produto" />
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
            <Font variant="body-sm-semibold" text="Tipo de Movimentação" />
            <CustomSelect value={type} onChange={(val) => setType(val)}>
              <CustomSelectItem value="Entrada" text="Entrada (+)" icon={Plus} />
              <CustomSelectItem value="Saída" text="Saída (-)" icon={Minus} />
            </CustomSelect>
          </Stack>

          {/* Quantidade */}
          <Stack gap={1}>
            <Font variant="body-sm-semibold" text="Quantidade" />
            <Input
              placeholder="Quantidade em unidades"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              required
            />
          </Stack>

          {/* Motivação */}
          <Stack gap={1}>
            <Font variant="body-sm-semibold" text="Motivo / Justificativa" />
            <Input
              placeholder="Ex: Ajuste de quebra, consumo da equipe..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Stack>

          {/* Botões */}
          <Stack direction="col" mobileDirection="row" justify="end" gap={2.5} w="full">
            <Button variant="outline" label="Cancelar" onClick={onCancel} />
            <Button variant="primary" label="Confirmar Movimentação" type="submit" />
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}
