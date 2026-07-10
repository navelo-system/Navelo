"use client"

import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Stack } from "@/components/store/base/Stack"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Search } from "lucide-react"

export interface BalancoProduct {
  id: string
  name: string
  category: string
  systemStock: number
  counted: string
}

export interface InventoryAuditTableProps {
  products: BalancoProduct[]
  onCancel: () => void
  onSave: (products: BalancoProduct[]) => void
}

export const InventoryAuditTable: React.FC<InventoryAuditTableProps> = ({
  products,
  onCancel,
  onSave,
}) => {
  const [localProducts, setLocalProducts] = React.useState<BalancoProduct[]>(products)
  const [prevProducts, setPrevProducts] = React.useState<BalancoProduct[]>(products)
  const [searchQuery, setSearchQuery] = React.useState("")

  if (products !== prevProducts) {
    setPrevProducts(products)
    setLocalProducts(products)
  }

  const handleCountChange = (id: string, val: string) => {
    setLocalProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, counted: val } : item))
    )
  }

  const filteredProducts = localProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Stack gap={5} w="full">
      <Input
        placeholder="Buscar por nome do produto ou grupo..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={Search}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead text="Produto" />
            <TableHead text="Categoria" />
            <TableHead text="Saldo Atual no Sistema" align="center" />
            <TableHead text="Quantidade Contada (Física)" align="right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((p) => (
            <TableRow key={p.id}>
              <TableCell fontWeight="bold">{p.name}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell align="center">{p.systemStock} UN</TableCell>
              <TableCell align="right" w="w-32">
                <Input
                  placeholder="Contado"
                  value={p.counted}
                  onChange={(e) => handleCountChange(p.id, e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Stack direction="col" mobileDirection="row" justify="end" gap={2.5} w="full">
        <Button variant="ghost" label="Cancelar" onClick={onCancel} />
        <Button variant="primary" label="Salvar Contagem" onClick={() => onSave(localProducts)} />
      </Stack>
    </Stack>
  )
}
