/**
 * permissions.ts
 * Mapa centralizado de permissões por perfil de usuário.
 * Define quais views cada role pode acessar, quem pode fazer login,
 * e quem vê KPIs/alertas no Dashboard.
 */

import { UserRole } from "@/types/domain"

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
    "caixa", "comandas", "delivery"
  ],
  [UserRole.ATTENDANT]: [
    "comandas"
  ],
  [UserRole.TOTEM]: [],
  [UserRole.SUPERVISOR]: [],
}

/**
 * Verifica se um role pode acessar uma view específica.
 * Views não listadas no Bento Grid (ex: "vendas", "totais-em-caixa", "contas-a-receber", "conta-digital")
 * são sub-views administrativas — só ADMIN e MANAGER podem acessar.
 */
export function canAccessView(role: string | undefined, view: string): boolean {
  if (!role) return false

  // Dashboard é sempre acessível para quem logou
  if (view === "dashboard") return true

  // Sub-views administrativas (KPIs do dashboard)
  const adminSubViews = ["vendas", "totais-em-caixa", "contas-a-receber", "conta-digital"]
  if (adminSubViews.includes(view)) {
    return role === UserRole.ADMIN || role === UserRole.MANAGER
  }

  const allowed = ROLE_ALLOWED_VIEWS[role]
  if (!allowed) return false
  return allowed.includes(view)
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
