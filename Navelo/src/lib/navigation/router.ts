import { canAccessView, SUB_VIEW_PARENT_MAP } from "@/lib/permissions"

export type RootViewKey =
  // Auth & Dashboard
  | "login"
  | "acesso-empresa"
  | "dashboard"
  // Caixa & Checkout
  | "caixa"
  | "pagamento"
  | "recibo"
  | "delivery-confirm"
  | "devolucao"
  | "recebimentos"
  | "sangrias-suprimentos"
  | "pdv-customizacao"
  | "numero-atendimento"
  // Comandas
  | "comandas"
  | "finalizar-atendimentos"
  // Delivery
  | "delivery"
  | "novo-delivery"
  | "entregadores"
  | "taxas-entrega"
  // Estoque
  | "estoque"
  | "auditoria"
  | "notas"
  | "entradas"
  // Produtos & Clientes
  | "produtos"
  | "novo-produto"
  | "clientes"
  | "novo-cliente"
  // Vendas & Financeiro
  | "vendas"
  | "totais-em-caixa"
  | "contas-a-receber"
  | "conta-digital"
  // Relatórios
  | "relatorios"
  | "comissoes"
  | "deliveries"
  | "evolucao"
  | "extrato"
  | "margem"
  | "taxas"
  | "vendas-produto"
  | "caixa-totais"
  | "caixa-pagamentos"
  | "xml-export"
  | "nf-sales"
  // Configurações
  | "configuracoes"
  | "dados-empresa"
  | "sincronizacao"
  | "usuarios"
  | "novo-usuario"
  | "restricoes"
  | "autorizacoes"
  | "nota-fiscal"
  | "nota-fiscal-config"
  | "pagamento-integrado"
  | "ordem-pagamento"
  | "pix"
  | "crediario"
  | "catalogo-online"
  | "identificacao"
  | "catalogo-produtos"
  | "horario-atendimento"
  | "formas-pagamento"
  | "whatsapp"
  | "opcao-entrega"
  | "opcao-pedido"
  | "opcao-pedido-menu-digital"
  | "ifood"
  | "taxa-entrega"
  | "consulta-preco"
  | "pesagem-automatica"
  | "menu-digital"
  | "mesas-comandas"
  | "configurar-comandas"
  | "taxas-servico"
  | "autoatendimento"
  | "autoatendimento-cartao"
  | "autoatendimento-pix"
  | "autoatendimento-customizacao"
  | "autoatendimento-numero"
  | "grupos-subgrupos"
  | "unidades"
  | "fornecedores"
  | "cidades"
  | "impressora"
  | "pontos-impressao"
  | "comprovantes"
  | "balanca-checkout"
  | "balanca-etiquetadora"
  | "backup"

export const VALID_ROOT_VIEWS: readonly RootViewKey[] = [
  "login", "acesso-empresa", "dashboard",
  "caixa", "pagamento", "recibo", "delivery-confirm", "devolucao", "recebimentos",
  "sangrias-suprimentos", "pdv-customizacao", "numero-atendimento",
  "comandas", "finalizar-atendimentos",
  "delivery", "novo-delivery", "entregadores", "taxas-entrega",
  "estoque", "auditoria", "notas", "entradas",
  "produtos", "novo-produto", "clientes", "novo-cliente",
  "vendas", "totais-em-caixa", "contas-a-receber", "conta-digital",
  "relatorios", "comissoes", "deliveries", "evolucao", "extrato", "margem", "taxas",
  "vendas-produto", "caixa-totais", "caixa-pagamentos", "xml-export", "nf-sales",
  "configuracoes", "dados-empresa", "sincronizacao", "usuarios", "novo-usuario",
  "restricoes", "autorizacoes", "nota-fiscal", "nota-fiscal-config", "pagamento-integrado",
  "ordem-pagamento", "pix", "crediario", "catalogo-online", "identificacao",
  "catalogo-produtos", "horario-atendimento", "formas-pagamento", "whatsapp",
  "opcao-entrega", "opcao-pedido", "opcao-pedido-menu-digital", "ifood", "taxa-entrega",
  "consulta-preco", "pesagem-automatica", "menu-digital", "mesas-comandas",
  "configurar-comandas", "taxas-servico", "autoatendimento", "autoatendimento-cartao",
  "autoatendimento-pix", "autoatendimento-customizacao", "autoatendimento-numero",
  "grupos-subgrupos", "unidades", "fornecedores", "cidades", "impressora",
  "pontos-impressao", "comprovantes", "balanca-checkout", "balanca-etiquetadora", "backup"
] as const

export const KNOWN_STACK_SUBVIEWS: Record<string, string[]> = {
  configuracoes: [
    "dados-empresa", "sincronizacao", "usuarios", "novo-usuario", "restricoes",
    "autorizacoes", "nota-fiscal", "nota-fiscal-config", "pagamento-integrado",
    "ordem-pagamento", "pix", "crediario", "catalogo-online", "identificacao",
    "catalogo-produtos", "horario-atendimento", "formas-pagamento", "whatsapp",
    "opcao-entrega", "opcao-pedido", "opcao-pedido-menu-digital", "ifood", "taxa-entrega",
    "consulta-preco", "pesagem-automatica", "menu-digital", "mesas-comandas",
    "configurar-comandas", "taxas-servico", "autoatendimento", "autoatendimento-cartao",
    "autoatendimento-pix", "autoatendimento-customizacao", "autoatendimento-numero",
    "grupos-subgrupos", "unidades", "fornecedores", "cidades", "impressora",
    "pontos-impressao", "comprovantes", "balanca-checkout", "balanca-etiquetadora", "backup"
  ],
  caixa: [
    "pagamento", "recibo", "delivery-confirm", "devolucao", "recebimentos",
    "sangrias-suprimentos", "pdv-customizacao", "numero-atendimento"
  ],
  comandas: ["finalizar-atendimentos", "new"],
  delivery: ["novo-delivery", "entregadores", "taxas-entrega", "novo", "new"],
  estoque: ["auditoria", "notas", "entradas"],
  produtos: ["novo-produto", "new"],
  clientes: ["novo-cliente", "new"],
  relatorios: [
    "comissoes", "deliveries", "evolucao", "extrato", "margem", "taxas",
    "vendas-produto", "relatorio-crediario", "caixa-totais", "caixa-pagamentos",
    "xml-export", "nf-sales"
  ],
}

export interface ParsedRoute {
  raw: string
  view: RootViewKey
  subView?: string
  entityId?: string
  action?: string
  subAction?: string
  params: Record<string, string>
}

function parseQueryParams(queryPart?: string): Record<string, string> {
  const params: Record<string, string> = {}
  if (!queryPart) return params
  const searchParams = new URLSearchParams(queryPart)
  searchParams.forEach((val, key) => {
    params[key] = val
  })
  return params
}

export function parseHash(rawHash: string): ParsedRoute {
  const clean = (rawHash || "").trim().replace(/^#\/?/, "").replace(/\/+$/, "")
  if (!clean) return { raw: "", view: "dashboard", params: {} }

  const [pathPart, queryPart] = clean.split("?")
  const params = parseQueryParams(queryPart)
  const segments = pathPart.split("/").map((s) => decodeURIComponent(s).trim()).filter(Boolean)
  if (segments.length === 0) return { raw: "", view: "dashboard", params }

  const first = segments[0] as RootViewKey
  const view = (VALID_ROOT_VIEWS as readonly string[]).includes(first) ? first : "dashboard"

  // Se houver segmentos adicionais passados por engano (ex: #usuarios/123 ou #produtos/new), normaliza para params
  if (segments.length > 1) {
    if (segments[1] === "new" || segments[1] === "novo") {
      params.action = "new"
      if (segments[2]) params.subAction = segments[2]
    } else {
      params.id = segments[1]
      if (segments[2]) params.action = segments[2]
      if (segments[3]) params.subAction = segments[3]
    }
  }

  const entityId = params.id
  const action = params.action
  const subAction = params.subAction

  return {
    raw: clean,
    view,
    subView: undefined,
    entityId,
    action,
    subAction,
    params,
  }
}

export function formatRoute(route: Partial<ParsedRoute>): string {
  if (!route.view) return "#dashboard"
  if (route.view === "login") return "#login"
  if (route.view === "acesso-empresa") return "#acesso-empresa"

  let hash = `#${route.view}`

  const cleanParams = { ...route.params }
  if (route.entityId && !cleanParams.id) cleanParams.id = route.entityId
  if (route.action && route.action !== "view" && !cleanParams.action) cleanParams.action = route.action
  if (route.subAction && !cleanParams.subAction) cleanParams.subAction = route.subAction

  if (Object.keys(cleanParams).length > 0) {
    hash += `?${new URLSearchParams(cleanParams).toString()}`
  }
  return hash
}

export function resolveAllowedRoute(route: ParsedRoute, userRole?: string): ParsedRoute {
  if (route.view === "login" || route.view === "acesso-empresa" || route.view === "dashboard") {
    return route
  }
  if (!canAccessView(userRole, route.view)) {
    return { raw: "dashboard", view: "dashboard", params: {} }
  }
  return route
}

