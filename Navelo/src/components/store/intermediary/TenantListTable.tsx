"use client"

import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Badge } from "@/components/store/base/Badge"
import { Button } from "@/components/store/base/Button"
import { MoreHorizontal } from "lucide-react"
import { maskCpfCnpj } from "@/lib/masks"
import { UI_STRINGS } from "@/constants/strings"

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

function getTenantDisplayName(tenant: TenantListRow, fallback: string): string {
  if (tenant.trade_name) return tenant.trade_name
  if (tenant.tradingName) return tenant.tradingName
  if (tenant.name) return tenant.name
  if (tenant.corporateName) return tenant.corporateName
  return fallback
}

function getTenantDocumentMasked(tenant: TenantListRow): string {
  const doc = tenant.document || tenant.cnpj
  if (!doc) return "—"
  return maskCpfCnpj(doc)
}

function getTenantLocation(tenant: TenantListRow): string {
  if (tenant.address_city && tenant.address_state) {
    return `${tenant.address_city}/${tenant.address_state}`
  }
  return tenant.address_city || "—"
}

function getPlanVariant(plan: string): "primary" | "outline" | "success" {
  if (plan === "Enterprise") return "primary"
  if (plan === "Free") return "outline"
  return "success"
}

function getTenantFee(tenant: TenantListRow, plan: string): number {
  if (tenant.monthlyFee !== undefined) return tenant.monthlyFee
  if (plan === "Enterprise") return 499.9
  if (plan === "Free") return 0
  return 149.9
}

function TenantTableRowItem({ tenant }: { tenant: TenantListRow }) {
  const t = UI_STRINGS.admin.tenants
  const c = UI_STRINGS.admin.clients

  const displayName = getTenantDisplayName(tenant, t.unnamedCompany)
  const maskedDoc = getTenantDocumentMasked(tenant)
  const location = getTenantLocation(tenant)
  const plan = tenant.plan || tenant.planName || "Pro"
  const active = tenant.status === "active" || (tenant.status === undefined && (tenant.isActive ?? true))
  const fee = getTenantFee(tenant, plan)

  return (
    <TableRow>
      <TableCell fontWeight="medium">{displayName}</TableCell>
      <TableCell>{maskedDoc}</TableCell>
      <TableCell>{location}</TableCell>
      <TableCell>
        <Badge variant={getPlanVariant(plan)} label={plan} />
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
}

export function TenantListTable({ tenants }: TenantListTableProps) {
  const t = UI_STRINGS.admin.tenants

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
        {tenants.map((tenant) => (
          <TenantTableRowItem key={tenant.id} tenant={tenant} />
        ))}
      </TableBody>
    </Table>
  )
}
