/**
 * permissions.ts
 * Mapa centralizado de permissões por perfil de usuário.
 * Define quais views cada role pode acessar, quem pode fazer login,
 * e quem vê KPIs/alertas no Dashboard.
 */

import { UserRole } from "@/types/domain"

const ROLE_ALIAS_MAP: Record<string, UserRole> = {
  ADMIN: UserRole.ADMIN,
  ADMINISTRADOR: UserRole.ADMIN,
  ADMINISTRATOR: UserRole.ADMIN,
  SUPERVISOR: UserRole.SUPERVISOR,
  MANAGER: UserRole.MANAGER,
  GERENTE: UserRole.MANAGER,
  CASHIER: UserRole.CASHIER,
  CAIXA: UserRole.CASHIER,
  OPERADOR: UserRole.CASHIER,
  ATTENDANT: UserRole.ATTENDANT,
  ATENDENTE: UserRole.ATTENDANT,
  TOTEM: UserRole.TOTEM,
  "TOTEM AUTOATENDIMENTO": UserRole.TOTEM,
}

/**
 * Normaliza qualquer string ou variante de role (ex: "Administrador", "admin", "Caixa")
 * para o enum canônico UserRole correspondente.
 */
export function normalizeUserRole(role?: string): UserRole {
  if (!role) return UserRole.CASHIER
  return ROLE_ALIAS_MAP[role.trim().toUpperCase()] || UserRole.CASHIER
}

/**
 * Views do Bento Grid permitidas por role.
 * O ADMIN vê tudo. Os demais são subconjuntos.
 */
export const ROLE_ALLOWED_VIEWS: Record<string, string[]> = {
  [UserRole.ADMIN]: [
    "caixa", "comandas", "delivery", "estoque",
    "produtos", "clientes", "relatorios", "configuracoes"
  ],
  [UserRole.MANAGER]: [
    "caixa", "comandas", "delivery", "estoque",
    "produtos", "clientes", "relatorios", "configuracoes"
  ],
  [UserRole.CASHIER]: [
    "caixa", "comandas", "delivery", "clientes"
  ],
  [UserRole.ATTENDANT]: [
    "comandas"
  ],
  [UserRole.TOTEM]: [],
  [UserRole.SUPERVISOR]: [],
}

export const SUB_VIEW_PARENT_MAP: Record<string, string> = {
  "pagamento": "caixa",
  "recibo": "caixa",
  "delivery-confirm": "caixa",
  "devolucao": "caixa",
  "recebimentos": "caixa",
  "sangrias-suprimentos": "caixa",
  "pdv-customizacao": "caixa",
  "numero-atendimento": "caixa",
  "finalizar-atendimentos": "comandas",
  "novo-delivery": "delivery",
  "entregadores": "delivery",
  "taxas-entrega": "delivery",
  "auditoria": "estoque",
  "notas": "estoque",
  "entradas": "estoque",
  "novo-produto": "produtos",
  "novo-cliente": "clientes",
  "dados-empresa": "configuracoes",
  "sincronizacao": "configuracoes",
  "usuarios": "configuracoes",
  "novo-usuario": "configuracoes",
  "restricoes": "configuracoes",
  "autorizacoes": "configuracoes",
  "nota-fiscal": "configuracoes",
  "nota-fiscal-config": "configuracoes",
  "pagamento-integrado": "configuracoes",
  "ordem-pagamento": "configuracoes",
  "pix": "configuracoes",
  "crediario": "configuracoes",
  "catalogo-online": "configuracoes",
  "identificacao": "configuracoes",
  "catalogo-produtos": "configuracoes",
  "horario-atendimento": "configuracoes",
  "formas-pagamento": "configuracoes",
  "whatsapp": "configuracoes",
  "opcao-entrega": "configuracoes",
  "opcao-pedido": "configuracoes",
  "opcao-pedido-menu-digital": "configuracoes",
  "ifood": "configuracoes",
  "taxa-entrega": "configuracoes",
  "consulta-preco": "configuracoes",
  "pesagem-automatica": "configuracoes",
  "menu-digital": "configuracoes",
  "mesas-comandas": "configuracoes",
  "configurar-comandas": "configuracoes",
  "taxas-servico": "configuracoes",
  "autoatendimento": "configuracoes",
  "autoatendimento-cartao": "configuracoes",
  "autoatendimento-pix": "configuracoes",
  "autoatendimento-customizacao": "configuracoes",
  "autoatendimento-numero": "configuracoes",
  "grupos-subgrupos": "configuracoes",
  "unidades": "configuracoes",
  "fornecedores": "configuracoes",
  "cidades": "configuracoes",
  "impressora": "configuracoes",
  "pontos-impressao": "configuracoes",
  "comprovantes": "configuracoes",
  "balanca-checkout": "configuracoes",
  "balanca-etiquetadora": "configuracoes",
  "backup": "configuracoes",
  "backup-config": "configuracoes",
  // Relatórios
  "comissoes": "relatorios",
  "deliveries": "relatorios",
  "evolucao": "relatorios",
  "extrato": "relatorios",
  "margem": "relatorios",
  "taxas": "relatorios",
  "vendas-produto": "relatorios",
  "caixa-totais": "relatorios",
  "caixa-pagamentos": "relatorios",
  "xml-export": "relatorios",
  "nf-sales": "relatorios",
}

/**
 * Retorna a rota pai de retorno para uma determinada rota ou view.
 * Se for uma rota hierárquica (ex: #configuracoes/usuarios/123/edit), retorna a rota da listagem (#configuracoes/usuarios).
 * Se for uma sub-view, retorna o módulo pai correspondente (ex: #configuracoes, #caixa, #relatorios).
 * Se for um módulo principal, retorna o dashboard.
 */
export function getParentRoute(routeInput: string): string {
  const clean = (routeInput || "").trim().replace(/^#\/?/, "").replace(/\/+$/, "")
  if (!clean || clean === "dashboard" || clean === "login" || clean === "acesso-empresa") return "#dashboard"

  const view = clean.split("?")[0].split("/")[0]
  if (view === "dashboard" || view === "login" || view === "acesso-empresa") return "#dashboard"

  const parent = SUB_VIEW_PARENT_MAP[view]
  if (parent) return `#${parent}`
  return "#dashboard"
}

/**
 * Verifica se um role pode acessar uma view específica.
 * Views não listadas no Bento Grid (ex: "vendas", "totais-em-caixa", "contas-a-receber", "conta-digital")
 * são sub-views administrativas — só ADMIN e MANAGER podem acessar.
 */
export function canAccessView(role: string | undefined, view: string): boolean {
  if (!role) return false
  const normalized = normalizeUserRole(role)

  // Dashboard é sempre acessível para quem logou
  if (view === "dashboard" || view === "login" || view === "acesso-empresa") return true

  const parentView = SUB_VIEW_PARENT_MAP[view] || view

  // Sub-views administrativas (KPIs do dashboard)
  const adminSubViews = ["vendas", "totais-em-caixa", "contas-a-receber", "conta-digital"]
  if (adminSubViews.includes(parentView)) {
    return normalized === UserRole.ADMIN || normalized === UserRole.MANAGER
  }

  const allowed = ROLE_ALLOWED_VIEWS[normalized]
  if (!allowed) return false
  return allowed.includes(parentView)
}

/**
 * Roles que podem fazer login no sistema.
 * SUPERVISOR é exclusivo para autorização administrativa — não pode logar.
 */
export const ROLE_CAN_LOGIN: Record<string, boolean> = {
  [UserRole.ADMIN]: true,
  [UserRole.MANAGER]: true,
  [UserRole.CASHIER]: true,
  [UserRole.ATTENDANT]: true,
  [UserRole.TOTEM]: true,
  [UserRole.SUPERVISOR]: false,
}

/**
 * Roles que veem KPIs e alertas fiscais no Dashboard.
 */
export const ROLE_SHOW_KPIS: Record<string, boolean> = {
  [UserRole.ADMIN]: true,
  [UserRole.MANAGER]: true,
  [UserRole.CASHIER]: false,
  [UserRole.ATTENDANT]: false,
  [UserRole.TOTEM]: false,
  [UserRole.SUPERVISOR]: false,
}
