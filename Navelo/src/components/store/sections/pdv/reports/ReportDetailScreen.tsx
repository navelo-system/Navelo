"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Icon } from "@/components/store/base/Icon"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { KpiCard } from "@/components/store/intermediary/KpiCard"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Modal } from "@/components/store/base/Modal"
import { Download, X, FileSpreadsheet } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import { ReportDetails } from "@/components/store/sections/pdv/pages/relatoriosReportData"

export type ReportType =
  | "comissoes"
  | "deliveries"
  | "evolucao"
  | "extrato"
  | "margem"
  | "taxas"
  | "vendas-produto"
  | "relatorio-crediario"
  | "caixa-totais"
  | "caixa-pagamentos"
  | "xml-export"
  | "nf-sales"

export interface FilterFormState {
  period: "Hoje" | "7D" | "1M" | "3M" | "6M" | "1A"
  setPeriod: (p: "Hoje" | "7D" | "1M" | "3M" | "6M" | "1A") => void
  startDate: string; setStartDate: (d: string) => void
  endDate: string; setEndDate: (d: string) => void
  productGroup: string; setProductGroup: (g: string) => void
  productSubgroup: string; setProductSubgroup: (sg: string) => void
  client: string; setClient: (c: string) => void
  user: string; setUser: (u: string) => void
  device: string; setDevice: (dv: string) => void
  cost: "Vendido" | "Atual"; setCost: (c: "Vendido" | "Atual") => void
  order: "Descrição" | "Margem bruta"; setOrder: (o: "Descrição" | "Margem bruta") => void
  onApplyFilters?: () => void
  onCloseDrawer?: () => void
}

function ReportDetailTable({ headers, rows }: { headers: string[]; rows: (string | number)[][] }) {
  return (
    <Box border borderColor="border-border" radius="default" overflow="hidden" w="full">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((h, idx) => (
              <TableHead key={idx} align={idx === 0 ? "left" : "right"} text={h} />
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rIdx) => (
            <TableRow key={rIdx}>
              {row.map((cell, cIdx) => (
                <TableCell key={cIdx} align={cIdx === 0 ? "left" : "right"}>
                  <Font variant="body" text={String(cell)} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}

function ReportDetailView({ selectedReport, details }: { selectedReport: ReportType; details: ReportDetails }) {
  return (
    <Stack gap={5} w="full">
      {details.kpis.length > 0 && (
        <Grid cols={details.kpis.length as 1 | 2 | 3 | 4 | 5 | 6 | 12} gap={5}>
          {details.kpis.map((kpi, idx) => (
            <KpiCard key={idx} title={kpi.title} value={kpi.value} subtitle={kpi.subtitle} />
          ))}
        </Grid>
      )}
      {selectedReport === "xml-export" ? (
        <Box border borderColor="border-border" padding={5} bg="bg-surface" radius="default" w="full">
          <Stack align="center" justify="center" gap={5} w="full">
            <Icon icon={FileSpreadsheet} size={48} color="primary" />
            <Stack align="center" gap={1} maxWidth="5xl">
              <Font variant="h3" text={UI_STRINGS.reports.xmlExportTitle} align="center" />
              <Font variant="description" text={UI_STRINGS.reports.xmlExportDesc} align="center" />
            </Stack>
            <Button variant="primary" label={UI_STRINGS.reports.generateZipButton} icon={Download} onClick={() => { }} />
          </Stack>
        </Box>
      ) : details.rows.length === 0 ? (
        <EmptyState
          icon={FileSpreadsheet}
          title={UI_STRINGS.common.noResultsFound}
          subtitle={UI_STRINGS.admin.audit.emptySubtitle}
        />
      ) : (
        details.headers.length > 0 && <ReportDetailTable headers={details.headers} rows={details.rows} />
      )}
    </Stack>
  )
}

function getPeriodDates(period: string): { start: string; end: string } {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const fmt = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  if (period === "7D") { start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); start.setHours(0, 0, 0, 0) }
  else if (period === "1M") { start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 0, 0, 0) }
  else if (period === "3M") { start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate(), 0, 0, 0) }
  else if (period === "6M") { start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate(), 0, 0, 0) }
  else if (period === "1A") { start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), 0, 0, 0) }
  return { start: fmt(start), end: fmt(end) }
}

export function ReportFilterPanel({ state, isDrawer = false }: { state: FilterFormState; isDrawer?: boolean }) {
  const r = UI_STRINGS.reports
  return (
    <FilterPanel
      hideTitle={isDrawer} borderless={isDrawer}
      selectedPeriod={state.period}
      onPeriodChange={(p: string) => { state.setPeriod(p as "Hoje" | "7D" | "1M" | "3M" | "6M" | "1A"); const { start, end } = getPeriodDates(p); state.setStartDate(start); state.setEndDate(end) }}
      startDate={state.startDate} onStartDateChange={state.setStartDate}
      endDate={state.endDate} onEndDateChange={state.setEndDate}
      onFilter={() => {
        state.onApplyFilters?.()
        state.onCloseDrawer?.()
      }}
    >
      <Stack gap={2.5} w="full">
        <Input label={r.groupLabel} placeholder={r.groupPlaceholder} value={state.productGroup} onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setProductGroup(e.target.value)} iconRight={state.productGroup ? X : undefined} />
        <Input label={r.subgroupLabel} placeholder={r.subgroupPlaceholder} value={state.productSubgroup} onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setProductSubgroup(e.target.value)} iconRight={state.productSubgroup ? X : undefined} />
      </Stack>
      <Input label={r.clientLabel} placeholder={r.clientPlaceholder} value={state.client} onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setClient(e.target.value)} iconRight={state.client ? X : undefined} />
      <Input label={r.userLabel} placeholder={r.userPlaceholder} value={state.user} onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setUser(e.target.value)} iconRight={state.user ? X : undefined} />
      <Input label={r.deviceLabel} placeholder={r.devicePlaceholder} value={state.device} onChange={(e: React.ChangeEvent<HTMLInputElement>) => state.setDevice(e.target.value)} iconRight={state.device ? X : undefined} />

      <Stack gap={2.5} w="full">
        <Font variant="body-sm-semibold" color="muted" text={r.costLabel} />
        <Grid cols={2} gap={2.5} w="full">
          {(["Vendido", "Atual"] as const).map((c) => (
            <Button key={c} variant={state.cost === c ? "primary-pill-xs" : "outline-pill-xs"} label={c} onClick={() => state.setCost(c)} type="button" fullWidth />
          ))}
        </Grid>
      </Stack>

      <Stack gap={2.5} w="full">
        <Stack direction="row" justify="between" align="center" w="full">
          <Font variant="body-sm-semibold" color="muted" text={r.orderLabel} />
          <Button variant="ghost" label={r.azSortButton} />
        </Stack>
        <Grid cols={2} gap={2.5} w="full">
          {(["Descrição", "Margem bruta"] as const).map((o) => (
            <Button key={o} variant={state.order === o ? "primary-pill-xs" : "outline-pill-xs"} label={o} onClick={() => state.setOrder(o)} type="button" fullWidth />
          ))}
        </Grid>
      </Stack>
    </FilterPanel>
  )
}

function exportCsvFile(title: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [headers.join(","), ...rows.map((r) => r.map((cell) => `"${cell}"`).join(","))].join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "_")}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function ReportDetailScreen({
  selectedReport,
  reportDetails,
  filterState,
  isFilterDrawerOpen,
  setIsFilterDrawerOpen,
}: {
  selectedReport: ReportType | null
  reportDetails: ReportDetails | null
  filterState: FilterFormState
  isFilterDrawerOpen: boolean
  setIsFilterDrawerOpen: (v: boolean) => void
}) {
  return (
    <Stack direction="col" gap={5} w="full" flex="1" minH="0" h="full" overflow="hidden">
      <Box shrink="0" w="full">
        <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" w="full" gap={2.5}>
          <Stack gap={1} flex="1" minW="0">
            <Font variant="h3" text={reportDetails?.title || UI_STRINGS.reports.title} align="left" />
            <Font variant="description" text={reportDetails?.description || ""} align="left" />
          </Stack>
          <Box shrink="0">
            <Button
              variant="secondary"
              label={UI_STRINGS.reports.exportCsvButton}
              icon={Download}
              onClick={() => {
                if (reportDetails) exportCsvFile(reportDetails.title, reportDetails.headers, reportDetails.rows)
              }}
            />
          </Box>
        </Stack>
      </Box>
      <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0" overflow="hidden">
        <Box flex="1" w="full" h="full" minH="0" overflow="x-hidden y-auto">
          {selectedReport && reportDetails && <ReportDetailView selectedReport={selectedReport} details={reportDetails} />}
        </Box>
        <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
          <ReportFilterPanel state={filterState} />
        </Box>
        <Modal isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} title={UI_STRINGS.common.filter} variant="sidebar">
          <ReportFilterPanel state={{ ...filterState, onCloseDrawer: () => setIsFilterDrawerOpen(false) }} isDrawer />
        </Modal>
      </Stack>
    </Stack>
  )
}
