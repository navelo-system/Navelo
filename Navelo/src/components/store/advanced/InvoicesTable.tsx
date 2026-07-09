"use client"

import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../base/Table"
import { Stack } from "../base/Stack"
import { Box } from "../base/Box"
import { Font } from "../base/Font"
import { SupplierInvoice } from "@/src/types/domain"

export interface InvoicesTableProps {
  invoices: SupplierInvoice[]
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices }) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <Stack gap={5} w="full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead text="Número NF-e" />
            <TableHead text="Fornecedor / Emitente" />
            <TableHead text="Valor Total" />
            <TableHead text="Chave de Acesso" />
            <TableHead text="Status" align="center" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell fontWeight="bold">{inv.number}</TableCell>
              <TableCell>{inv.supplier}</TableCell>
              <TableCell>{formatPrice(inv.value)}</TableCell>
              <TableCell>
                <Font variant="sub-tiny" color="muted" text={inv.key} />
              </TableCell>
              <TableCell align="center">
                <Box
                  paddingY={1}
                  paddingX={2.5}
                  bg={inv.status === "Importada" ? "bg-brand-success/10" : "bg-brand-primary/10"}
                  radius="default"
                >
                  <Font
                    variant="sub-tiny"
                    color={inv.status === "Importada" ? "success" : "primary"}
                    text={inv.status}
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  )
}
