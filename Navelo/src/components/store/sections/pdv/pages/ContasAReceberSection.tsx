"use client"

/* eslint-disable max-lines-per-function, complexity, @typescript-eslint/no-explicit-any */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Input } from "@/components/store/base/Input"
import { Button } from "@/components/store/base/Button"
import { Modal } from "@/components/store/base/Modal"
import { Icon } from "@/components/store/base/Icon"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { SaleExportModal } from "@/components/store/sections/pdv/modals/SaleExportModal"
import { generateReceivablesReportPdf } from "@/lib/pdf/generateReceivablesReportPdf"
import { useSales } from "@/lib/dal"
import { db } from "@/lib/dal/db"
import { useLiveQuery } from "dexie-react-hooks"
import { useTenant } from "@/lib/context/TenantContext"
import { PackageSearch, Filter, Calendar, FileText, FileSpreadsheet } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

export interface ContasAReceberSectionProps {
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

interface ReceivableAccount {
  id: string
  saleId?: string
  client: string
  docNumber: string
  issueDate: Date
  issueDateFormatted: string
  dueDate: Date
  dueDateFormatted: string
  settlementDate?: Date | null
  settlementDateFormatted?: string
  value: number
  fine: number
  interest: number
  toSettle: number
  status: "PENDING" | "SETTLED"
  device?: string
}

function formatPrice(val: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
}

function formatDateTimeBr(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  const day = pad(d.getDate())
  const month = pad(d.getMonth() + 1)
  const year = d.getFullYear()
  const hours = pad(d.getHours())
  const mins = pad(d.getMinutes())
  return `${day}/${month}/${year} ${hours}:${mins}`
}

function formatDateBr(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  const day = pad(d.getDate())
  const month = pad(d.getMonth() + 1)
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

function parseBrDateTime(str: string, isEnd = false): Date | null {
  if (!str || !str.trim()) return null
  const clean = str.trim()
  const brMatch = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2}))?$/)
  if (brMatch) {
    const day = parseInt(brMatch[1], 10)
    const month = parseInt(brMatch[2], 10) - 1
    const year = parseInt(brMatch[3], 10)
    const hour = brMatch[4] !== undefined ? parseInt(brMatch[4], 10) : (isEnd ? 23 : 0)
    const min = brMatch[5] !== undefined ? parseInt(brMatch[5], 10) : (isEnd ? 59 : 0)
    const sec = isEnd ? 59 : 0
    return new Date(year, month, day, hour, min, sec)
  }
  const isoDate = new Date(clean)
  if (!isNaN(isoDate.getTime())) {
    return isoDate
  }
  return null
}

function getPeriodDates(period: string): { start: string; end: string } {
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)

  if (period === "7D") {
    start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    start.setHours(0, 0, 0, 0)
  } else if (period === "1M") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 0, 0, 0)
  } else if (period === "3M") {
    start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate(), 0, 0, 0)
  } else if (period === "6M") {
    start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate(), 0, 0, 0)
  } else if (period === "1A") {
    start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate(), 0, 0, 0)
  }
  return {
    start: formatDateTimeBr(start),
    end: formatDateTimeBr(end),
  }
}

export const ContasAReceberSection: React.FC<ContasAReceberSectionProps> = ({
  onBackToDashboard,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id
  const dbSales = useSales(tenantId)
  const dbCompany = useLiveQuery(async () => {
    if (!tenantId) return null
    return await db.companies.get(tenantId)
  }, [tenantId])

  const s = UI_STRINGS.receivables

  const initialDates = React.useMemo(() => getPeriodDates("Hoje"), [])
  const [period, setPeriod] = React.useState("Hoje")
  const [periodType, setPeriodType] = React.useState<"Emissão" | "Vencimento" | "Liquidação">("Emissão")
  const [startDate, setStartDate] = React.useState(initialDates.start)
  const [endDate, setEndDate] = React.useState(initialDates.end)
  const [cliente, setCliente] = React.useState("")
  const [dispositivo, setDispositivo] = React.useState("")
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false)

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    const { start, end } = getPeriodDates(newPeriod)
    setStartDate(start)
    setEndDate(end)
  }

  const onBackToDashboardRef = React.useRef(onBackToDashboard)
  React.useEffect(() => {
    onBackToDashboardRef.current = onBackToDashboard
  }, [onBackToDashboard])

  React.useEffect(() => {
    setCustomBack?.(() => () => onBackToDashboardRef.current())
    setCustomTitle?.(s.title)
    setCustomActions?.(
      <Box display="block md:hidden">
        <Button
          variant="primary-pill-icon"
          icon={Filter}
          onClick={() => setIsFilterDrawerOpen(true)}
        />
      </Box>
    )

    return () => {
      setCustomBack?.(null)
      setCustomTitle?.(null)
      setCustomActions?.(null)
    }
  }, [setCustomBack, setCustomTitle, setCustomActions, s.title])

  // Processamento e unificação dos dados reais de contas a receber
  const allAccounts: ReceivableAccount[] = React.useMemo(() => {
    const accounts: ReceivableAccount[] = []
    const salesList = dbSales || []

    salesList.forEach((sale, idx) => {
      const isCrediario = (sale.payment_method || "").toLowerCase().includes("crediário") ||
                          (sale.payment_method || "").toLowerCase().includes("crediario") ||
                          (sale.payment_method || "").toLowerCase().includes("prazo") ||
                          (sale.payment_method || "").toLowerCase().includes("boleto") ||
                          sale.status === "PENDING"

      // Se for crediário, pendente ou marcada como conta a receber
      if (isCrediario || (sale as any).is_receivable) {
        const issue = sale.created_at ? new Date(sale.created_at) : new Date()
        const due = (sale as any).due_date ? new Date((sale as any).due_date) : new Date(issue.getTime() + 30 * 24 * 60 * 60 * 1000)
        const isSettled = sale.status === "SETTLED" || (sale as any).is_settled === true
        const settlement = isSettled && (sale as any).settled_at ? new Date((sale as any).settled_at) : isSettled ? due : null

        const docNum = (sale as any).doc_number || `019.${salesList.length - idx}-1/1`
        const clientName = sale.customer_name && sale.customer_name !== "Nao selecionado" ? sale.customer_name : "Cliente Avulso"

        accounts.push({
          id: sale.id,
          saleId: sale.id,
          client: clientName,
          docNumber: docNum,
          issueDate: issue,
          issueDateFormatted: formatDateBr(issue),
          dueDate: due,
          dueDateFormatted: formatDateBr(due),
          settlementDate: settlement,
          settlementDateFormatted: settlement ? formatDateBr(settlement) : undefined,
          value: sale.total || 0,
          fine: (sale as any).fine || 0,
          interest: (sale as any).interest || 0,
          toSettle: isSettled ? 0 : (sale.total || 0),
          status: isSettled ? "SETTLED" : "PENDING",
          device: (sale as any).device || (sale as any).terminal || "",
        })
      }
    })

    return accounts
  }, [dbSales])

  // Filtragem estrita e dinâmica
  const filteredAccounts = React.useMemo(() => {
    const clientTerm = cliente.trim().toLowerCase()
    const deviceTerm = dispositivo.trim().toLowerCase()
    const startObj = parseBrDateTime(startDate, false)
    const endObj = parseBrDateTime(endDate, true)

    return allAccounts
      .filter((acc) => {
        // Filtro por Data e Tipo de Período
        let targetDate: Date | null = acc.issueDate
        if (periodType === "Vencimento") targetDate = acc.dueDate
        if (periodType === "Liquidação") targetDate = acc.settlementDate || null

        if (targetDate) {
          const tTime = targetDate.getTime()
          if (startObj && tTime < startObj.getTime()) return false
          if (endObj && tTime > endObj.getTime()) return false
        } else if (periodType === "Liquidação") {
          return false
        }

        // Filtro por Cliente
        if (clientTerm) {
          if (!acc.client.toLowerCase().includes(clientTerm)) return false
        }

        // Filtro por Dispositivo
        if (deviceTerm) {
          if (!acc.device || !acc.device.toLowerCase().includes(deviceTerm)) return false
        }

        return true
      })
      .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime())
  }, [allAccounts, cliente, dispositivo, startDate, endDate, periodType])

  // Totais calculados
  const totalToReceive = React.useMemo(() => {
    return filteredAccounts
      .filter((acc) => acc.status === "PENDING")
      .reduce((acc, curr) => acc + curr.toSettle, 0)
  }, [filteredAccounts])

  const totalSettled = React.useMemo(() => {
    return filteredAccounts
      .filter((acc) => acc.status === "SETTLED")
      .reduce((acc, curr) => acc + curr.value, 0)
  }, [filteredAccounts])

  // Exportação para PDF
  const handleExportPdf = async () => {
    const reportData = {
      title: s.title,
      periodText: `${startDate} até ${endDate}`,
      periodType,
      clientFilter: cliente.trim() || undefined,
      deviceFilter: dispositivo.trim() || undefined,
      items: filteredAccounts.map((acc) => ({
        client: acc.client,
        docNumber: acc.docNumber,
        issueDate: acc.issueDateFormatted,
        dueDate: acc.dueDateFormatted,
        value: acc.value,
        fine: acc.fine,
        interest: acc.interest,
        toSettle: acc.toSettle,
        status: acc.status === "SETTLED" ? "Liquidada" : "Pendente",
      })),
      totalToReceive,
      totalSettled,
    }

    const companyData = dbCompany || (tenantCtx?.currentTenant as any) || undefined
    const { blob } = await generateReceivablesReportPdf(reportData, companyData)
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Relatorio_Contas_Receber_${Date.now()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Exportação para CSV
  const handleExportCsv = () => {
    const headers = [
      "Cliente",
      "Documento",
      "Data Emissao",
      "Data Vencimento",
      "Data Liquidacao",
      "Valor (R$)",
      "Multa (R$)",
      "Juros (R$)",
      "Valor a Liquidar (R$)",
      "Situacao"
    ]

    const rows = filteredAccounts.map((acc) => [
      `"${acc.client.replace(/"/g, '""')}"`,
      acc.docNumber,
      acc.issueDateFormatted,
      acc.dueDateFormatted,
      acc.settlementDateFormatted || "-",
      acc.value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      acc.fine.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      acc.interest.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      acc.toSettle.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      acc.status === "SETTLED" ? "Liquidada" : "Pendente"
    ].join(";"))

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `Contas_Receber_${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const periodTypes: Array<"Emissão" | "Vencimento" | "Liquidação"> = [
    "Emissão", "Vencimento", "Liquidação"
  ]

  const renderFilterInputs = () => (
    <>
      {/* Tipo de Período */}
      <Stack gap={2.5} w="full">
        <Font variant="auxiliary" color="muted" text={s.periodTypeLabel} />
        <Stack direction="row" wrap gap={2.5} w="full">
          {periodTypes.map((pt) => (
            <Button
              key={pt}
              variant={periodType === pt ? "primary-pill-xs" : "outline-pill-xs"}
              label={pt}
              onClick={() => setPeriodType(pt)}
              type="button"
            />
          ))}
        </Stack>
      </Stack>

      <Input
        label={s.clientLabel}
        placeholder={s.clientPlaceholder}
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
      />
      <Input
        label={s.deviceLabel}
        placeholder={s.devicePlaceholder}
        value={dispositivo}
        onChange={(e) => setDispositivo(e.target.value)}
      />
    </>
  )

  return (
    <>
    <Stack direction="col" gap={5} w="full" flex="1" minH="0" h="full" overflow="hidden">
      <Stack direction="col" mobileDirection="row" gap={5} w="full" align="stretch" flex="1" minH="0" h="full" overflow="hidden">
        {/* Painel Esquerdo: Lista de Contas a Receber e Totais */}
        <Stack direction="col" gap={5} flex="1" h="full" minH="0" overflow="hidden">
          <Box flex="1" w="full" h="full" bg="bg-surface" padding={5} radius="default" direction="col" overflow="x-hidden y-auto" minH="0">
            {filteredAccounts.length === 0 ? (
              <Box w="full" h="full" direction="col" align="center" justify="center">
                <EmptyState
                  icon={PackageSearch}
                  title={s.emptyTitle}
                  subtitle={s.emptySubtitle}
                />
              </Box>
            ) : (
              <Stack gap={0} w="full">
                {filteredAccounts.map((acc, idx) => (
                  <React.Fragment key={acc.id}>
                    {idx > 0 && <Box h="h-[1px]" bg="bg-border" w="full" />}
                    <Box
                      padding={2.5}
                      w="full"
                    >
                      <Stack direction="row" justify="between" align="start" w="full">
                        {/* Lado Esquerdo */}
                        <Stack gap={1} flex="1" minW="0">
                          <Font variant="body-sm-semibold" text={acc.client} />
                          <Stack direction="row" align="center" gap={1}>
                            <Icon icon={FileText} size={12} color="muted" />
                            <Font variant="auxiliary" color="muted" text={`${s.docPrefix}${acc.docNumber}`} />
                          </Stack>
                          <Stack direction="row" align="center" gap={1}>
                            <Icon icon={Calendar} size={12} color="muted" />
                            <Font variant="auxiliary" color="muted" text={`${s.issueDatePrefix}${acc.issueDateFormatted}`} />
                          </Stack>
                          <Stack direction="row" align="center" gap={1}>
                            <Icon icon={Calendar} size={12} color="muted" />
                            <Font variant="auxiliary" color="muted" text={`${s.dueDatePrefix}${acc.dueDateFormatted}`} />
                          </Stack>
                        </Stack>

                        {/* Lado Direito */}
                        <Stack align="end" gap={0}>
                          <Font variant="body-bold" text={formatPrice(acc.value)} />
                          <Font variant="auxiliary" color="muted" text={`${s.finePrefix}${formatPrice(acc.fine)}`} />
                          <Font variant="auxiliary" color="muted" text={`${s.interestPrefix}${formatPrice(acc.interest)}`} />
                          <Font variant="auxiliary" color="muted" text={`${s.toSettlePrefix}${formatPrice(acc.toSettle)}`} />
                        </Stack>
                      </Stack>
                    </Box>
                  </React.Fragment>
                ))}
              </Stack>
            )}
          </Box>

          {/* Card Fixo no Canto Inferior Esquerdo: A receber e Liquidado com Botão Exportar integrado */}
          <Box w="full" bg="bg-surface" padding={5} radius="default">
            <Stack direction="row" justify="between" align="center" w="full">
              <Stack gap={1}>
                <Font variant="auxiliary" color="muted" text={s.toReceiveLabel} />
                <Font variant="h3" text={formatPrice(totalToReceive)} />
              </Stack>
              <Stack direction="row" align="center" gap={5}>
                <Stack align="end" gap={1}>
                  <Font variant="auxiliary" color="muted" text={s.settledLabel} />
                  <Font variant="h3" color="primary" text={formatPrice(totalSettled)} />
                </Stack>
                <Button
                  variant="primary-pill-icon"
                  icon={FileSpreadsheet}
                  title={s.exportReceivablesModalTitle}
                  onClick={() => setIsExportModalOpen(true)}
                />
              </Stack>
            </Stack>
          </Box>
        </Stack>

        {/* Sidebar Direita Desktop: FilterPanel Inline */}
        <Box display="hidden md:flex" direction="col" h="full" minH="0" shrink="0">
          <FilterPanel
            title={s.filtersPanelTitle}
            selectedPeriod={period}
            onPeriodChange={handlePeriodChange}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onFilter={() => {}}
          >
            {renderFilterInputs()}
          </FilterPanel>
        </Box>

        {/* Drawer Mobile: FilterPanel dentro de Modal Sidebar */}
        <Modal
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          title={s.filtersPanelTitle}
          variant="sidebar"
        >
          <FilterPanel
            hideTitle
            borderless
            selectedPeriod={period}
            onPeriodChange={handlePeriodChange}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onFilter={() => setIsFilterDrawerOpen(false)}
          >
            {renderFilterInputs()}
          </FilterPanel>
        </Modal>
      </Stack>
    </Stack>

    {/* Modal de Exportação de Contas a Receber (PDF e CSV) */}
    <SaleExportModal
      isOpen={isExportModalOpen}
      onClose={() => setIsExportModalOpen(false)}
      onExportPdf={handleExportPdf}
      onExportCsv={handleExportCsv}
    />
    </>
  )
}

