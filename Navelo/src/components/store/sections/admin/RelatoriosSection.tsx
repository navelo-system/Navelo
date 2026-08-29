"use client"

import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Button } from "@/components/store/base/Button"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { KpiCard } from "@/components/store/intermediary/KpiCard"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { ArrowLeft, Download, BarChart3, PieChart, FileSpreadsheet } from "lucide-react"
import { Tenant, Plan } from "@/src/types/domain"
import { UI_STRINGS } from "@/constants/strings"

interface TenantRevenueRow {
  tenant: Pick<Tenant, "tradingName">
  plan: Pick<Plan, "name" | "price">
}

const MOCK_REVENUE: TenantRevenueRow[] = [
  { tenant: { tradingName: "Lanchonete Bom Sabor" }, plan: { name: "Pro", price: 149.90 } },
  { tenant: { tradingName: "Restaurante Gourmet" }, plan: { name: "Enterprise", price: 499.90 } },
  { tenant: { tradingName: "Padaria Delícia" }, plan: { name: "Free", price: 0 } },
]

function exportCsvFile(reportTitle: string, rows: TenantRevenueRow[]) {
  const headers = ["Empresa", "Plano", "Receita Anual", "Receita Mensal"]
  const csvRows = rows.map(r => {
    const annual = r.plan.price * 12
    return [
      `"${r.tenant.tradingName.replace(/"/g, '""')}"`,
      `"${r.plan.name}"`,
      annual === 0 ? "0,00" : annual.toLocaleString("pt-BR", { minimumFractionDigits: 2 }),
      r.plan.price === 0 ? "0,00" : r.plan.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
    ].join(";")
  })
  const csvContent = "\uFEFF" + [headers.join(";"), ...csvRows].join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `Admin_${reportTitle.replace(/\s+/g, "_")}_${Date.now()}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function AdminMetricsKpiGrid({ hideValues, onToggleHide }: { hideValues: boolean; onToggleHide: () => void }) {
  const r = UI_STRINGS.admin.reports
  return (
    <Grid cols={3} gap={5}>
      <KpiCard title={r.mrrCardTitle} value="R$ 18.420,00" subtitle={r.mrrCardSubtitle} hideValues={hideValues} onToggleHide={onToggleHide} />
      <KpiCard title={r.arrCardTitle} value="R$ 221.040,00" subtitle={r.arrCardSubtitle} hideValues={hideValues} onToggleHide={onToggleHide} />
      <KpiCard title={r.ltvCardTitle} value="R$ 1.800,00" subtitle={r.ltvCardSubtitle} hideValues={hideValues} onToggleHide={onToggleHide} />
    </Grid>
  )
}

function AdminRevenueTable({ rows }: { rows: TenantRevenueRow[] }) {
  const r = UI_STRINGS.admin.reports
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={FileSpreadsheet}
        title={UI_STRINGS.common.noResultsFound}
        subtitle={UI_STRINGS.admin.audit.emptySubtitle}
      />
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead text={r.companyColumn} />
          <TableHead text={r.planColumn} />
          <TableHead align="right" text={r.annualRevenueColumn} />
          <TableHead align="right" text={r.monthlyRevenueColumn} />
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, idx) => {
          const annualRevenue = row.plan.price * 12
          return (
            <TableRow key={idx}>
              <TableCell fontWeight="medium">{row.tenant.tradingName}</TableCell>
              <TableCell>{row.plan.name}</TableCell>
              <TableCell align="right">
                {annualRevenue === 0 ? "R$ 0,00" : `R$ ${annualRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              </TableCell>
              <TableCell align="right">
                {row.plan.price === 0 ? "R$ 0,00" : `R$ ${row.plan.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export function RelatoriosSection() {
  const [hideValues, setHideValues] = React.useState<boolean>(false)
  const r = UI_STRINGS.admin.reports

  return (
    <>
      <Stack direction="row" align="start" w="fit-content">
        <Button variant="ghost" label={r.backButton} icon={ArrowLeft} onClick={() => { window.location.href = "/admin" }} />
      </Stack>

      <RegistrySection
        title={r.metricsTitle}
        description={r.metricsDescription}
        icon={BarChart3}
        action={<Button variant="primary" label={UI_STRINGS.reports.exportCsvButton} icon={Download} onClick={() => exportCsvFile("Métricas_MRR", MOCK_REVENUE)} />}
      >
        <AdminMetricsKpiGrid hideValues={hideValues} onToggleHide={() => setHideValues((prev) => !prev)} />
      </RegistrySection>

      <RegistrySection title={r.revenueTitle} description={r.revenueDescription} icon={PieChart}>
        <AdminRevenueTable rows={MOCK_REVENUE} />
      </RegistrySection>
    </>
  )
}
