"use client"

import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Badge } from "@/components/store/base/Badge"
import { Button } from "@/components/store/base/Button"
import { MoreHorizontal } from "lucide-react"
import { Tenant } from "@/src/types/domain"

/** Dados estendidos para listagem, simulando um JOIN que a API fará */
export interface TenantListRow extends Tenant {
  planName?: string
  monthlyFee?: number
}

interface TenantListTableProps {
  tenants: TenantListRow[]
}

export function TenantListTable({ tenants }: TenantListTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead text="Empresa" />
          <TableHead text="CNPJ" />
          <TableHead text="Plano" />
          <TableHead text="Status" />
          <TableHead align="right" text="Mensalidade" />
          <TableHead w="w-[50px]" text="" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map(tenant => (
          <TableRow key={tenant.id}>
            <TableCell fontWeight="medium">{tenant.tradingName}</TableCell>
            <TableCell>{tenant.cnpj}</TableCell>
            <TableCell>
              <Badge
                variant={tenant.planName === "Enterprise" ? "primary" : tenant.planName === "Free" ? "outline" : "success"}
                label={tenant.planName ?? "—"}
              />
            </TableCell>
            <TableCell>
              <Badge
                variant={tenant.isActive ? "success" : "danger"}
                label={tenant.isActive ? "Ativo" : "Inativo"}
              />
            </TableCell>
            <TableCell align="right">
              {(tenant.monthlyFee ?? 0) === 0 ? "Grátis" : `R$ ${(tenant.monthlyFee ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            </TableCell>
            <TableCell align="right">
              <Button variant="primary-icon-xs" icon={MoreHorizontal} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
