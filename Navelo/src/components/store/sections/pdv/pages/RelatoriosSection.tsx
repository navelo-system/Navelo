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
import { Badge } from "@/components/store/base/Badge"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { Modal } from "@/components/store/base/Modal"
import { Download, ChevronRight, X, FileSpreadsheet, Filter } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

interface RelatoriosSectionProps {
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

export type ReportType =
  | "comissoes"
  | "deliveries"
  | "evolucao"
  | "extrato"
  | "margem"
  | "taxas"
  | "vendas-produto"
  | "crediario"
  | "caixa-totais"
  | "caixa-pagamentos"
  | "xml-export"
  | "nf-sales"

interface ReportDefinition {
  id: ReportType
  title: string
  subtitle: string
  category: "Comercial" | "Controle de Crediário" | "Operações de Caixa" | "Fiscal"
}

interface ReportDetails {
  title: string
  description: string
  kpis: Array<{ title: string; value: string; subtitle: string }>
  headers: string[]
  rows: string[][]
}

const REPORTS_LIST: ReportDefinition[] = [
  { id: "comissoes", title: "Comissões sobre vendas", subtitle: "Por usuário • Ticket médio", category: "Comercial" },
  { id: "deliveries", title: "Deliveries finalizados", subtitle: "Por entregadores • Por clientes • Por período", category: "Comercial" },
  { id: "evolucao", title: "Evolução de vendas", subtitle: "Por hora • Por dia do mês • Por dia da semana • Por mês", category: "Comercial" },
  { id: "extrato", title: "Extrato de vendas", subtitle: "", category: "Comercial" },
  { id: "margem", title: "Margem bruta de vendas", subtitle: "Diferença entre valor de venda e custo de produtos", category: "Comercial" },
  { id: "taxas", title: "Taxas de serviço", subtitle: "Para mesas e comandas", category: "Comercial" },
  { id: "vendas-produto", title: "Vendas por produto", subtitle: "", category: "Comercial" },
  { id: "crediario", title: "Contas a receber", subtitle: "Ativas e liquidadas", category: "Controle de Crediário" },
  { id: "caixa-totais", title: "Totais em caixa", subtitle: "Fechamentos de caixa • Negociação • Sangria • Suprimento", category: "Operações de Caixa" },
  { id: "caixa-pagamentos", title: "Totais por forma de pagamento", subtitle: "Negociação • Sangria • Suprimento", category: "Operações de Caixa" },
  { id: "xml-export", title: "Exportar XML das notas fiscais", subtitle: "NFC-e • NF-e", category: "Fiscal" },
  { id: "nf-sales", title: "Notas fiscais de vendas", subtitle: "Notas fiscais de emissão própria", category: "Fiscal" },
]

const REPORT_DETAILS_MAP: Record<ReportType, ReportDetails> = {
  comissoes: {
    title: "Comissões sobre vendas",
    description: "Comissão acumulada por vendedor no período selecionado",
    kpis: [
      { title: "Total Comissões", value: "R$ 840,00", subtitle: "Soma de todas as comissões" },
      { title: "Vendedores Ativos", value: "4", subtitle: "Usuários com comissão no período" },
      { title: "Ticket Médio", value: "R$ 112,00", subtitle: "Média geral de vendas" },
    ],
    headers: ["Vendedor / Usuário", "Total de Vendas", "Ticket Médio", "Comissão Acumulada"],
    rows: [
      ["Carlos Souza", "R$ 2.450,00", "R$ 122,50", "R$ 245,00"],
      ["Júlia Lima", "R$ 1.840,00", "R$ 92,00", "R$ 184,00"],
      ["Marcos Silva", "R$ 3.100,00", "R$ 155,00", "R$ 310,00"],
      ["Ana Costa", "R$ 1.010,00", "R$ 80,50", "R$ 101,00"],
    ],
  },
  deliveries: {
    title: "Deliveries finalizados",
    description: "Relatório de entregas concluídas por período e entregador",
    kpis: [
      { title: "Entregas Concluídas", value: "87", subtitle: "Total no período" },
      { title: "Taxa Média", value: "R$ 7,50", subtitle: "Média paga por entrega" },
      { title: "Tempo Médio", value: "28 min", subtitle: "Média de tempo de trânsito" },
    ],
    headers: ["Pedido", "Entregador", "Cliente", "Taxa de Entrega", "Status"],
    rows: [
      ["#1024", "Jonathan Alves", "Ana Paula", "R$ 8,00", "Finalizado"],
      ["#1025", "Jonathan Alves", "Bruno Lima", "R$ 6,50", "Finalizado"],
      ["#1026", "Rodrigo Santos", "Carla Dias", "R$ 9,00", "Finalizado"],
      ["#1027", "Rodrigo Santos", "Diego Oliveira", "R$ 7,00", "Finalizado"],
    ],
  },
  evolucao: {
    title: "Evolução de vendas",
    description: "Análise histórica comparativa de vendas faturadas",
    kpis: [
      { title: "Pico de Faturamento", value: "R$ 2.450,00", subtitle: "12:00 às 14:00" },
      { title: "Crescimento", value: "+14.2%", subtitle: "Comparado ao período anterior" },
      { title: "Vendas Totais", value: "145", subtitle: "Pedidos emitidos" },
    ],
    headers: ["Período / Hora", "Quantidade Vendas", "Valor Faturado", "Ticket Médio"],
    rows: [
      ["08:00 - 10:00", "12", "R$ 240,00", "R$ 20,00"],
      ["10:00 - 12:00", "34", "R$ 1.850,00", "R$ 54,40"],
      ["12:00 - 14:00", "65", "R$ 6.450,00", "R$ 99,20"],
      ["14:00 - 16:00", "34", "R$ 4.300,00", "R$ 126,40"],
    ],
  },
  extrato: {
    title: "Extrato de vendas",
    description: "Listagem corrida de todas as movimentações de venda efetuadas",
    kpis: [
      { title: "Faturamento Bruto", value: "R$ 12.840,50", subtitle: "Vendas totais" },
      { title: "Vendas Dinheiro", value: "R$ 2.450,00", subtitle: "Em espécie" },
      { title: "Vendas Pix", value: "R$ 4.580,00", subtitle: "Transferência instantânea" },
    ],
    headers: ["Código", "Data / Hora", "Cliente", "Forma de Pagamento", "Valor"],
    rows: [
      ["#1024", "08/07/2026 14:32", "Consumidor Final", "Pix", "R$ 45,00"],
      ["#1025", "08/07/2026 13:15", "Marcos Silva", "Cartão Crédito", "R$ 120,00"],
      ["#1026", "08/07/2026 10:45", "Consumidor Final", "Dinheiro", "R$ 15,50"],
      ["#1027", "08/07/2026 09:20", "Ana Souza", "Pix", "R$ 310,00"],
    ],
  },
  margem: {
    title: "Margem bruta de vendas",
    description: "Relação de custos, receitas e rentabilidade por produto",
    kpis: [
      { title: "Faturamento", value: "R$ 10.000,00", subtitle: "Soma de vendas" },
      { title: "Custo de Mercadoria", value: "R$ 4.000,00", subtitle: "Soma dos custos de compra" },
      { title: "Margem Bruta Média", value: "60.0%", subtitle: "Percentual médio de lucro" },
    ],
    headers: ["Produto", "Qtd Vendida", "Valor Venda", "Custo Unitário", "Margem Bruta (%)"],
    rows: [
      ["COCA-COLA LATA 350ML", "45 UN", "R$ 270,00", "R$ 2,50", "58.3%"],
      ["HAMBÚRGUER CLÁSSICO", "12 UN", "R$ 346,80", "R$ 12,00", "58.4%"],
      ["ÁGUA MINERAL SEM GÁS", "15 UN", "R$ 67,55", "R$ 1,20", "73.3%"],
    ],
  },
  taxas: {
    title: "Taxas de serviço",
    description: "Arrecadação de taxa de serviço por comanda e mesa",
    kpis: [
      { title: "Total Taxas", value: "R$ 420,00", subtitle: "Soma arrecadada" },
      { title: "Comandas Com Taxa", value: "45", subtitle: "Comandas participantes" },
      { title: "Média por Comanda", value: "R$ 9,33", subtitle: "Média de comissões" },
    ],
    headers: ["Mesa / Comanda", "Consumo", "Taxa de Serviço (10%)", "Valor Total"],
    rows: [
      ["Comanda #12", "R$ 120,00", "R$ 12,00", "R$ 132,00"],
      ["Comanda #15", "R$ 340,00", "R$ 34,00", "R$ 374,00"],
      ["Mesa 04", "R$ 95,00", "R$ 9,50", "R$ 104,50"],
      ["Comanda #22", "R$ 80,00", "R$ 8,00", "R$ 88,00"],
    ],
  },
  "vendas-produto": {
    title: "Vendas por produto",
    description: "Quantidade e faturamento detalhados por mercadoria",
    kpis: [
      { title: "Itens Vendidos", value: "340 UN", subtitle: "Quantidade no período" },
      { title: "Produto Líder", value: "COCA-COLA LATA", subtitle: "Maior saída" },
      { title: "Faturamento Geral", value: "R$ 12.840,50", subtitle: "Total faturado" },
    ],
    headers: ["Produto", "Grupo", "Quantidade Vendida", "Valor Total"],
    rows: [
      ["COCA-COLA LATA 350ML", "Bebidas", "120 UN", "R$ 780,00"],
      ["HAMBÚRGUER CLÁSSICO", "Lanches", "45 UN", "R$ 1.300,50"],
      ["ÁGUA MINERAL SEM GÁS", "Bebidas", "50 UN", "R$ 225,00"],
      ["REFRIGERANTE LATA", "Bebidas", "32 UN", "R$ 208,00"],
    ],
  },
  crediario: {
    title: "Contas a receber",
    description: "Controle de saldos pendentes em contas de clientes (crediário)",
    kpis: [
      { title: "Saldo a Receber", value: "R$ 1.840,00", subtitle: "Total em aberto" },
      { title: "Contas em Atraso", value: "3", subtitle: "Vencidas e não pagas" },
      { title: "Clientes Ativos", value: "4", subtitle: "Com débito pendente" },
    ],
    headers: ["Cliente", "Vencimento", "Status", "Valor"],
    rows: [
      ["Marcos Silva", "15/07/2026", "Aberto", "R$ 320,00"],
      ["Ana Souza", "05/07/2026", "Atrasado", "R$ 150,00"],
      ["Carlos Souza", "22/07/2026", "Aberto", "R$ 410,00"],
      ["Júlia Lima", "01/07/2026", "Atrasado", "R$ 960,00"],
    ],
  },
  "caixa-totais": {
    title: "Totais em caixa",
    description: "Saldos correntes e histórico de fechamento de turnos",
    kpis: [
      { title: "Saldo Corrente", value: "R$ 450,00", subtitle: "Disponível no caixa" },
      { title: "Aporte / Suprimento", value: "R$ 50,00", subtitle: "Total inserido" },
      { title: "Sangrias / Retiradas", value: "R$ 20,00", subtitle: "Total retirado" },
    ],
    headers: ["Operação / Movimento", "Operador", "Data / Hora", "Valor"],
    rows: [
      ["Abertura de Caixa", "Admin", "08/07/2026 08:00", "R$ 100,00"],
      ["Suprimento de Troco", "Admin", "08/07/2026 09:15", "R$ 50,00"],
      ["Venda Realizada", "Admin", "08/07/2026 10:45", "R$ 15,50"],
      ["Sangria de Segurança", "Admin", "08/07/2026 12:00", "R$ 20,00"],
    ],
  },
  "caixa-pagamentos": {
    title: "Totais por forma de pagamento",
    description: "Balanço consolidado de métodos de negociação",
    kpis: [
      { title: "Cartão Débito/Crédito", value: "R$ 320,00", subtitle: "Operações em cartão" },
      { title: "Pix Instantâneo", value: "R$ 180,00", subtitle: "Chave copia e cola/QR Code" },
      { title: "Dinheiro Físico", value: "R$ 50,00", subtitle: "Saldo no caixa" },
    ],
    headers: ["Forma de Pagamento", "Quantidade Vendas", "Valor Total"],
    rows: [
      ["Dinheiro", "3", "R$ 50,00"],
      ["Pix", "5", "R$ 180,00"],
      ["Cartão de Crédito", "4", "R$ 220,00"],
      ["Cartão de Débito", "2", "R$ 100,00"],
    ],
  },
  "xml-export": {
    title: "Exportar XML das notas fiscais",
    description: "Exportação em lote de arquivos XML de NFC-e e NF-e",
    kpis: [
      { title: "XMLs Prontos", value: "145", subtitle: "Notas no período" },
      { title: "Tamanho Estimado", value: "2.4 MB", subtitle: "Compactado .zip" },
      { title: "Notas Rejeitadas", value: "0", subtitle: "Nenhuma pendência" },
    ],
    headers: [],
    rows: [],
  },
  "nf-sales": {
    title: "Notas fiscais de vendas",
    description: "Auditoria e acompanhamento de emissão de cupons e notas fiscais",
    kpis: [
      { title: "Notas Emitidas", value: "145", subtitle: "NFC-e e NF-e no período" },
      { title: "Valor Total", value: "R$ 12.840,50", subtitle: "Soma total de vendas" },
      { title: "Imposto Calculado", value: "R$ 513,62", subtitle: "Alíquotas estimadas" },
    ],
    headers: ["Chave de Acesso", "Data / Hora", "Cliente", "Valor Total", "Status"],
    rows: [
      ["3526 0710 4928 2000 0155 5500 1000 1234 5619 8765 4321", "08/07/2026 14:32", "Consumidor Final", "R$ 45,00", "Autorizada"],
      ["3526 0710 4928 2000 0155 5500 1000 1234 5619 8765 4322", "08/07/2026 13:15", "Marcos Silva", "R$ 120,00", "Autorizada"],
      ["3526 0710 4928 2000 0155 5500 1000 1234 5619 8765 4323", "08/07/2026 10:45", "Consumidor Final", "R$ 15,50", "Autorizada"],
      ["3526 0710 4928 2000 0155 5500 1000 1234 5619 8765 4324", "08/07/2026 09:20", "Ana Souza", "R$ 310,00", "Autorizada"],
    ],
  },
}

function ReportCategoriesList({ onSelectReport }: { onSelectReport: (id: ReportType) => void }) {
  const categories = ["Comercial", "Controle de Crediário", "Operações de Caixa", "Fiscal"] as const

  return (
    <Stack gap={5} w="full">
      {categories.map((cat) => {
        const filteredReports = REPORTS_LIST.filter((r) => r.category === cat)
        if (filteredReports.length === 0) return null

        return (
          <Box key={cat} border borderColor="border-border" padding={5} bg="bg-surface" radius="default">
            <Stack gap={2.5} w="full">
              <Font variant="body-semibold" text={cat} />
              <Box direction="col" w="full" border borderColor="border-border" radius="lg" overflow="hidden" bg="bg-surface">
                {filteredReports.map((rep) => (
                  <Box key={rep.id} padding={5} cursor="pointer" hoverBg="primary/10" onClick={() => onSelectReport(rep.id)}>
                    <Stack direction="row" align="center" justify="between" w="full">
                      <Stack gap={1}>
                        <Font variant="body-bold" text={rep.title} />
                        {rep.subtitle && <Font variant="description" text={rep.subtitle} />}
                      </Stack>
                      <Icon icon={ChevronRight} size={18} color="muted" />
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Stack>
          </Box>
        )
      })}
    </Stack>
  )
}

function ReportDetailTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <Box radius="default" bg="bg-surface" overflow="auto" w="full">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((h, i) => (
              <TableHead key={i} text={h} />
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rIdx) => (
            <TableRow key={rIdx}>
              {row.map((cell, cIdx) => {
                const isStatus = cell === "Concluída" || cell === "Pendente" || cell === "Atrasado" || cell === "Autorizada" || cell === "Finalizado"
                const badgeVariant = cell === "Concluída" || cell === "Autorizada" || cell === "Finalizado" ? "success" : cell === "Atrasado" ? "danger" : "default"
                return (
                  <TableCell key={cIdx}>
                    {isStatus ? <Badge variant={badgeVariant} label={cell} /> : cell}
                  </TableCell>
                )
              })}
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
      ) : (
        details.headers.length > 0 && <ReportDetailTable headers={details.headers} rows={details.rows} />
      )}
    </Stack>
  )
}

interface FilterFormState {
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
  onCloseDrawer?: () => void
}

function ReportFilterPanel({ state, isDrawer = false }: { state: FilterFormState; isDrawer?: boolean }) {
  const r = UI_STRINGS.reports
  return (
    <FilterPanel
      hideTitle={isDrawer} borderless={isDrawer}
      selectedPeriod={state.period}
      onPeriodChange={(p: string) => state.setPeriod(p as "Hoje" | "7D" | "1M" | "3M" | "6M" | "1A")}
      startDate={state.startDate} onStartDateChange={state.setStartDate}
      endDate={state.endDate} onEndDateChange={state.setEndDate}
      onFilter={() => state.onCloseDrawer?.()}
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

export const RelatoriosSection: React.FC<RelatoriosSectionProps> = ({
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const [mode, setMode] = React.useState<"list" | "report">("list")
  const [selectedReport, setSelectedReport] = React.useState<ReportType | null>(null)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)

  const [period, setPeriod] = React.useState<"Hoje" | "7D" | "1M" | "3M" | "6M" | "1A">("Hoje")
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [productGroup, setProductGroup] = React.useState("")
  const [productSubgroup, setProductSubgroup] = React.useState("")
  const [client, setClient] = React.useState("")
  const [user, setUser] = React.useState("")
  const [device, setDevice] = React.useState("")
  const [cost, setCost] = React.useState<"Vendido" | "Atual">("Vendido")
  const [order, setOrder] = React.useState<"Descrição" | "Margem bruta">("Descrição")

  const filterState: FilterFormState = {
    period, setPeriod, startDate, setStartDate, endDate, setEndDate,
    productGroup, setProductGroup, productSubgroup, setProductSubgroup,
    client, setClient, user, setUser, device, setDevice, cost, setCost, order, setOrder,
  }

  const reportDetails = selectedReport ? REPORT_DETAILS_MAP[selectedReport] : null

  React.useEffect(() => {
    if (mode === "report") {
      setCustomBack?.(() => () => { setMode("list"); setSelectedReport(null) })
      setCustomTitle?.(reportDetails?.title || "Relatório")
      setCustomActions?.(
        <Box display="block md:hidden">
          <Button variant="primary-pill-icon" icon={Filter} onClick={() => setIsFilterDrawerOpen(true)} />
        </Box>
      )
    } else {
      setCustomBack?.(null)
      setCustomTitle?.("Relatórios")
      setCustomActions?.(null)
    }
    return () => { setCustomBack?.(null); setCustomTitle?.(null); setCustomActions?.(null) }
  }, [mode, setCustomBack, setCustomTitle, setCustomActions, reportDetails?.title])

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <Stack gap={5} w="full" flex="1" minH="0" h="full">
        {mode === "list" ? (
          <ReportCategoriesList onSelectReport={(id) => { setSelectedReport(id); setMode("report") }} />
        ) : (
          <Stack direction="col" gap={5} w="full" flex="1" minH="0" h="full" overflow="hidden">
            <Box shrink="0" w="full">
              <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" w="full" gap={2.5}>
                <Stack gap={1} flex="1" minW="0">
                  <Font variant="h3" text={reportDetails?.title || UI_STRINGS.reports.title} align="left" />
                  <Font variant="description" text={reportDetails?.description || ""} align="left" />
                </Stack>
                <Box shrink="0">
                  <Button variant="secondary" label={UI_STRINGS.reports.exportCsvButton} icon={Download} onClick={() => { }} />
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
        )}
      </Stack>
    </Box>
  )
}
