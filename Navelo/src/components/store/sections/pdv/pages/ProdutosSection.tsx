"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { ProductForm, ProductFormData } from "@/components/store/advanced/ProductForm"
import { FiscalConfigForm, FiscalConfigData } from "@/components/store/advanced/FiscalConfigForm"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/store/base/Table"
import {
  Search,
  Plus,
  Edit2,
  Trash2
} from "lucide-react"

interface ProductItem extends ProductFormData {
  id: string
}

interface ProdutosSectionProps {
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
}

export const ProdutosSection: React.FC<ProdutosSectionProps> = ({
  setCustomBack
}) => {
  const [products, setProducts] = React.useState<ProductItem[]>([
    {
      id: "1",
      name: "ÁGUA MINERAL SEM GÁS",
      category: "Bebidas",
      unitPrice: 4.50,
      stock: 15,
      unit: "UN",
      ncm: "2201.10.00",
      cest: "17.110.00",
      cfop: "5.102",
      icmsOrigem: "0 - Nacional"
    },
    {
      id: "2",
      name: "ÁGUA COM GÁS",
      category: "Bebidas",
      unitPrice: 6.00,
      stock: 2,
      unit: "UN",
      ncm: "2201.10.00",
      cest: "17.110.00",
      cfop: "5.102",
      icmsOrigem: "0 - Nacional"
    },
    {
      id: "3",
      name: "REFRIGERANTE LATA",
      category: "Bebidas",
      unitPrice: 6.50,
      stock: -3,
      unit: "UN",
      ncm: "2202.10.00",
      cest: "17.111.00",
      cfop: "5.405",
      icmsOrigem: "0 - Nacional"
    },
    {
      id: "5",
      name: "HAMBÚRGUER CLÁSSICO",
      category: "Lanches",
      unitPrice: 28.90,
      stock: 10,
      unit: "UN",
      ncm: "1602.50.00",
      cest: "17.085.00",
      cfop: "5.102",
      icmsOrigem: "0 - Nacional"
    },
  ])

  const [mode, setMode] = React.useState<"list" | "form" | "fiscal-config">("list")
  const [editingProduct, setEditingProduct] = React.useState<ProductItem | null>(null)

  const scrollPositions = React.useRef<Record<string, number>>({})

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = () => {
      scrollPositions.current[mode] = window.scrollY
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [mode])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const savedScroll = scrollPositions.current[mode] || 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScroll, behavior: "instant" })
      })
    })
  }, [mode])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [defaultFiscalConfig, setDefaultFiscalConfig] = React.useState<FiscalConfigData>({
    csosn: "500",
    reduction: 0,
    aliquot: 0,
    pisCofinsCst: "99",
  })

  React.useEffect(() => {
    if (mode === "form") {
      setCustomBack?.(() => () => setMode("list"))
    } else if (mode === "fiscal-config") {
      setCustomBack?.(() => () => setMode("form"))
    } else {
      setCustomBack?.(null)
    }
    return () => setCustomBack?.(null)
  }, [mode, setCustomBack])

  const handleEdit = (prod: ProductItem) => {
    setEditingProduct(prod)
    setMode("form")
  }

  const handleCreateNew = () => {
    setEditingProduct(null)
    setMode("form")
  }

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSave = (data: ProductFormData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
              ...p,
              ...data,
              name: data.name.toUpperCase(),
            }
            : p
        )
      )
    } else {
      const newProduct: ProductItem = {
        id: Math.random().toString(),
        ...data,
        name: data.name.toUpperCase(),
      }
      setProducts((prev) => [...prev, newProduct])
    }

    setMode("list")
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Stack gap={5} w="full">
      {mode === "list" && (
        /* ================= LISTAGEM DE PRODUTOS ================= */
        <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
          <Stack gap={5} w="full">
            <Stack direction="col" mobileDirection="row" gap={2.5} align="stretch" mobileAlign="center" w="full">
              <Box flex="1" w="full">
                <Input
                  placeholder="Buscar por nome do produto..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </Box>
              <Button
                variant="primary"
                label="Novo Produto"
                icon={Plus}
                onClick={handleCreateNew}
              />
            </Stack>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead text="Nome do Produto" />
                  <TableHead text="Categoria" />
                  <TableHead text="Unidade" />
                  <TableHead text="Preço de Venda" />
                  <TableHead text="Estoque" />
                  <TableHead text="NCM Fiscal" />
                  <TableHead text="Ações" align="right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((prod) => (
                  <TableRow key={prod.id}>
                    <TableCell fontWeight="bold">{prod.name}</TableCell>
                    <TableCell>{prod.category}</TableCell>
                    <TableCell>{prod.unit}</TableCell>
                    <TableCell>{formatPrice(prod.unitPrice)}</TableCell>
                    <TableCell>
                      <Font
                        variant="body-bold"
                        color={prod.stock < 0 ? "danger" : prod.stock === 0 ? "muted" : "success"}
                        text={`${prod.stock} UN`}
                      />
                    </TableCell>
                    <TableCell>
                      <Font variant="sub-tiny" color="muted" text={prod.ncm || "Não informado"} />
                    </TableCell>
                    <TableCell align="right" w="w-24">
                      <Stack direction="row" gap={2.5} justify="end">
                        <Button
                          variant="primary-icon-xs"
                          icon={Edit2}
                          onClick={() => handleEdit(prod)}
                        />
                        <Button
                          variant="danger-icon-xs"
                          icon={Trash2}
                          onClick={() => handleDelete(prod.id)}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </Box>
      )}

      {mode === "form" && (
        /* ================= FORMULÁRIO DE PRODUTO ================= */
        <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
          <ProductForm
            initialData={editingProduct}
            onCancel={() => setMode("list")}
            onSave={handleSave}
            onAccessFiscalConfig={() => setMode("fiscal-config")}
          />
        </Box>
      )}

      {mode === "fiscal-config" && (
        /* ================= CONFIGURAÇÃO FISCAL PADRÃO ================= */
        <Box padding={5} bg="bg-surface" radius="default" border={true} borderColor="border-border">
          <FiscalConfigForm
            initialData={defaultFiscalConfig}
            onCancel={() => setMode("form")}
            onSave={(data) => {
              setDefaultFiscalConfig(data)
              setMode("form")
            }}
          />
        </Box>
      )}
    </Stack>
  )
}
