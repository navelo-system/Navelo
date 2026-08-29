"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { ChevronRight, Filter } from "lucide-react"
import { useSales, useCashMovements, useReceivables, useDeliveryOrders } from "@/lib/dal"
import { useTenant } from "@/lib/context/TenantContext"
import { useAppNavigation } from "@/lib/navigation/NavigationContext"
import { computeReportDetails, ReportDetails, ReportAppliedFilters } from "@/components/store/sections/pdv/pages/relatoriosReportData"
import { ReportDetailScreen, FilterFormState, ReportType } from "@/components/store/sections/pdv/reports/ReportDetailScreen"

interface RelatoriosSectionProps {
  onBackToDashboard: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

interface ReportDefinition {
  id: ReportType
  title: string
  subtitle: string
  category: "Comercial" | "Controle de Crediário" | "Operações de Caixa" | "Fiscal"
}

const REPORTS_LIST: ReportDefinition[] = [
  { id: "comissoes", title: "Comissões sobre vendas", subtitle: "Por usuário • Ticket médio", category: "Comercial" },
  { id: "deliveries", title: "Deliveries finalizados", subtitle: "Por entregadores • Por clientes • Por período", category: "Comercial" },
  { id: "evolucao", title: "Evolução de vendas", subtitle: "Por hora • Por dia do mês • Por dia da semana • Por mês", category: "Comercial" },
  { id: "extrato", title: "Extrato de vendas", subtitle: "", category: "Comercial" },
  { id: "margem", title: "Margem bruta de vendas", subtitle: "Diferença entre valor de venda e custo de produtos", category: "Comercial" },
  { id: "taxas", title: "Taxas de serviço", subtitle: "Para mesas e comandas", category: "Comercial" },
  { id: "vendas-produto", title: "Vendas por produto", subtitle: "", category: "Comercial" },
  { id: "relatorio-crediario", title: "Contas a receber", subtitle: "Ativas e liquidadas", category: "Controle de Crediário" },
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
      { title: "Mês Atual", value: "R$ 48.250,00", subtitle: "+12% comparado ao anterior" },
      { title: "Pico de Horário", value: "19h - 21h", subtitle: "Maior volume de clientes" },
      { title: "Melhor Dia", value: "Sexta-feira", subtitle: "Média R$ 3.200,00/dia" },
    ],
    headers: ["Período / Intervalo", "Vendas Concluídas", "Ticket Médio", "Total Faturado"],
    rows: [
      ["Manhã (08h - 12h)", "120", "R$ 25,00", "R$ 3.000,00"],
      ["Tarde (12h - 18h)", "340", "R$ 45,00", "R$ 15.300,00"],
      ["Noite (18h - 23h)", "510", "R$ 58,00", "R$ 29.580,00"],
    ],
  },
  extrato: {
    title: "Extrato de vendas",
    description: "Espelho detalhado de todas as operações emitidas no caixa",
    kpis: [
      { title: "Total de Operações", value: "145", subtitle: "No período selecionado" },
      { title: "Cancelamentos", value: "2", subtitle: "Taxa de 1.3%" },
      { title: "Faturamento Líquido", value: "R$ 12.840,50", subtitle: "Total líquido" },
    ],
    headers: ["Venda #", "Data / Hora", "Operador", "Forma Pagamento", "Valor Líquido"],
    rows: [
      ["#1001", "08/07/2026 14:32", "Admin", "Pix", "R$ 45,00"],
      ["#1002", "08/07/2026 14:15", "Admin", "Cartão Crédito", "R$ 120,00"],
      ["#1003", "08/07/2026 13:50", "Admin", "Dinheiro", "R$ 15,50"],
      ["#1004", "08/07/2026 13:20", "Admin", "Pix", "R$ 310,00"],
    ],
  },
  margem: {
    title: "Margem bruta de vendas",
    description: "Lucratividade estimada baseada no CMV cadastrado",
    kpis: [
      { title: "Margem Média", value: "54.2%", subtitle: "Retorno bruto geral" },
      { title: "Lucro Bruto", value: "R$ 6.950,00", subtitle: "Sobre o faturamento" },
      { title: "Custo Mercadorias (CMV)", value: "R$ 5.890,50", subtitle: "Custo total dos itens" },
    ],
    headers: ["Categoria", "Faturamento", "Custo (CMV)", "Lucro Bruto", "Margem (%)"],
    rows: [
      ["Bebidas", "R$ 4.200,00", "R$ 1.890,00", "R$ 2.310,00", "55.0%"],
      ["Lanches", "R$ 6.100,00", "R$ 2.745,00", "R$ 3.355,00", "55.0%"],
      ["Sobremesas", "R$ 2.540,50", "R$ 1.255,50", "R$ 1.285,00", "50.5%"],
    ],
  },
  taxas: {
    title: "Taxas de serviço",
    description: "Apuração das gorjetas e taxas opcionais de atendimento",
    kpis: [
      { title: "Total em Gorjetas", value: "R$ 420,00", subtitle: "Taxas arrecadadas" },
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
  "relatorio-crediario": {
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

function useReportData(
  selectedReport: ReportType | null,
  appliedFilters: ReportAppliedFilters,
  tenantId: string,
  fallbackMap: Record<ReportType, ReportDetails>
): ReportDetails | null {
  const dbSales = useSales(tenantId)
  const dbCash = useCashMovements(tenantId)
  const dbReceivables = useReceivables(tenantId)
  const dbDelivery = useDeliveryOrders(tenantId)

  return React.useMemo(() => {
    if (!selectedReport) return null
    return computeReportDetails({
      selectedReport,
      filters: appliedFilters,
      sales: dbSales || [],
      cash: dbCash || [],
      receivables: dbReceivables || [],
      deliveries: dbDelivery || [],
      defaultMock: fallbackMap[selectedReport],
    })
  }, [selectedReport, appliedFilters, dbSales, dbCash, dbReceivables, dbDelivery, fallbackMap])
}

function ReportCategoriesList({ onSelectReport }: { onSelectReport: (id: ReportType) => void }) {
  const categories = ["Comercial", "Controle de Crediário", "Operações de Caixa", "Fiscal"] as const
  return (
    <Stack gap={12} w="full">
      {categories.map((cat) => {
        const reportsInCat = REPORTS_LIST.filter((r) => r.category === cat)
        if (reportsInCat.length === 0) return null
        return (
          <Stack key={cat} gap={2.5} w="full">
            <Font variant="body-sm-semibold" color="muted" text={cat.toUpperCase()} />
            <Box border borderColor="border-border" radius="default" overflow="hidden" w="full" bg="bg-surface">
              {reportsInCat.map((item, idx) => (
                <Box
                  key={item.id}
                  padding={5}
                  borderBottom={idx < reportsInCat.length - 1}
                  borderColor="border-border"
                  cursor="pointer"
                  hoverBg="secondary/10"
                  onClick={() => onSelectReport(item.id)}
                >
                  <Stack direction="row" justify="between" align="center" w="full">
                    <Stack gap={1} flex="1">
                      <Font variant="body" text={item.title} />
                      {item.subtitle && <Font variant="description" text={item.subtitle} />}
                    </Stack>
                    <Icon icon={ChevronRight} size={18} color="muted" />
                  </Stack>
                </Box>
              ))}
            </Box>
          </Stack>
        )
      })}
    </Stack>
  )
}

export function useReportFilterState() {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  const todayStart = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} 00:00`
  const todayEnd = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} 23:59`

  const [period, setPeriod] = React.useState<"Hoje" | "7D" | "1M" | "3M" | "6M" | "1A">("Hoje")
  const [startDate, setStartDate] = React.useState(todayStart)
  const [endDate, setEndDate] = React.useState(todayEnd)
  const [productGroup, setProductGroup] = React.useState("")
  const [productSubgroup, setProductSubgroup] = React.useState("")
  const [client, setClient] = React.useState("")
  const [user, setUser] = React.useState("")
  const [device, setDevice] = React.useState("")
  const [cost, setCost] = React.useState<"Vendido" | "Atual">("Vendido")
  const [order, setOrder] = React.useState<"Descrição" | "Margem bruta">("Descrição")

  const [appliedFilters, setAppliedFilters] = React.useState({
    period: "Hoje" as "Hoje" | "7D" | "1M" | "3M" | "6M" | "1A",
    startDate: todayStart,
    endDate: todayEnd,
    productGroup: "",
    productSubgroup: "",
    client: "",
    user: "",
    device: "",
    cost: "Vendido" as "Vendido" | "Atual",
    order: "Descrição" as "Descrição" | "Margem bruta",
  })

  const handlePeriodChange = (p: "Hoje" | "7D" | "1M" | "3M" | "6M" | "1A") => {
    setPeriod(p)
  }

  const handleApplyFilters = () => {
    setAppliedFilters({
      period, startDate, endDate, productGroup, productSubgroup, client, user, device, cost, order,
    })
  }

  const filterState: FilterFormState = {
    period, setPeriod: handlePeriodChange, startDate, setStartDate, endDate, setEndDate,
    productGroup, setProductGroup, productSubgroup, setProductSubgroup,
    client, setClient, user, setUser, device, setDevice, cost, setCost, order, setOrder,
    onApplyFilters: handleApplyFilters,
  }

  return { filterState, appliedFilters }
}

export const RelatoriosSection: React.FC<RelatoriosSectionProps> = ({
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const { currentRoute, navigate, goBack } = useAppNavigation()
  const selectedReport: ReportType | null =
    currentRoute.view !== "relatorios" && (REPORT_DETAILS_MAP as Record<string, unknown>)[currentRoute.view]
      ? (currentRoute.view as ReportType)
      : null
  const mode: "list" | "report" = selectedReport ? "report" : "list"

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false)
  const { filterState, appliedFilters } = useReportFilterState()
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "default"
  const reportDetails = useReportData(selectedReport, appliedFilters, tenantId, REPORT_DETAILS_MAP)

  React.useEffect(() => {
    if (mode === "report") {
      setCustomBack?.(() => () => goBack("#relatorios"))
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
  }, [mode, setCustomBack, setCustomTitle, setCustomActions, reportDetails?.title, goBack])

  return (
    <Box flex="1" minH="0" h="full" overflowY="auto" w="full">
      <Stack gap={5} w="full" flex="1" minH="0" h="full">
        {mode === "list" ? (
          <ReportCategoriesList onSelectReport={(id) => navigate(`#${id}`)} />
        ) : (
          <ReportDetailScreen
            selectedReport={selectedReport}
            reportDetails={reportDetails}
            filterState={filterState}
            isFilterDrawerOpen={isFilterDrawerOpen}
            setIsFilterDrawerOpen={setIsFilterDrawerOpen}
          />
        )}
      </Stack>
    </Box>
  )
}
