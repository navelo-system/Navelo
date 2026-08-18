"use client"

/* eslint-disable complexity */

import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Badge } from "@/components/store/base/Badge"
import { Button } from "@/components/store/base/Button"
import { MoreHorizontal } from "lucide-react"
import { maskCpfCnpj } from "@/lib/masks"
import { UI_STRINGS } from "@/constants/strings"

/** Dados estendidos para listagem, aceitando tanto campos de Company quanto Tenant */
export interface TenantListRow {
  id: string
  name?: string
  corporateName?: string
  tradingName?: string
  trade_name?: string
  cnpj?: string
  document?: string
  phone?: string
  address_city?: string
  address_state?: string
  planName?: string
  plan?: string
  monthlyFee?: number
  isActive?: boolean
  status?: string
}

interface TenantListTableProps {
  tenants: TenantListRow[]
}

export function TenantListTable({ tenants }: TenantListTableProps) {
  const t = UI_STRINGS.admin.tenants
  const c = UI_STRINGS.admin.clients

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead text={t.nameColumn} />
          <TableHead text={t.cnpjCpfColumn} />
          <TableHead text={t.cityStateColumn} />
          <TableHead text={t.planColumn} />
          <TableHead text={t.statusColumn} />
          <TableHead align="right" text={t.monthlyFeeColumn} />
          <TableHead w="w-[50px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {tenants.map(tenant => {
          const displayName = tenant.trade_name || tenant.tradingName || tenant.name || tenant.corporateName || t.unnamedCompany
          const displayDoc = tenant.document || tenant.cnpj || ""
          const maskedDoc = displayDoc ? maskCpfCnpj(displayDoc) : "—"
          const location = tenant.address_city && tenant.address_state ? `${tenant.address_city}/${tenant.address_state}` : tenant.address_city || "—"
          const plan = tenant.plan || tenant.planName || "Pro"
          const active = tenant.status ? tenant.status === "active" : (tenant.isActive ?? true)
          const fee = tenant.monthlyFee ?? (plan === "Enterprise" ? 499.9 : plan === "Free" ? 0 : 149.9)

          return (
            <TableRow key={tenant.id}>
              <TableCell fontWeight="medium">{displayName}</TableCell>
              <TableCell>{maskedDoc}</TableCell>
              <TableCell>{location}</TableCell>
              <TableCell>
                <Badge
                  variant={plan === "Enterprise" ? "primary" : plan === "Free" ? "outline" : "success"}
                  label={plan}
                />
              </TableCell>
              <TableCell>
                <Badge
                  variant={active ? "success" : "danger"}
                  label={active ? c.activeStatus : c.inactiveStatus}
                />
              </TableCell>
              <TableCell align="right">
                {fee === 0 ? c.freeFee : `R$ ${fee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              </TableCell>
              <TableCell align="right">
                <Button variant="primary-icon-xs" icon={MoreHorizontal} />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
