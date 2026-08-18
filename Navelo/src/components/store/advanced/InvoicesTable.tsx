"use client"

import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Stack } from "@/components/store/base/Stack"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { SupplierInvoice } from "@/src/types/domain"
import { UI_STRINGS } from "@/constants/strings"

export interface InvoicesTableProps {
  invoices: SupplierInvoice[]
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices }) => {
  const invStrings = UI_STRINGS.inventory
  const common = UI_STRINGS.common

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
            <TableHead text={invStrings.invoiceNumberHeader} />
            <TableHead text={invStrings.supplierIssuerHeader} />
            <TableHead text={invStrings.totalValueHeader} />
            <TableHead text={invStrings.accessKeyHeader} />
            <TableHead text={common.status} align="center" />
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
