import { CreditCard, Users, Settings, Activity, BarChart3, Shield, LucideIcon } from "lucide-react"

export interface BentoItem {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

export const BENTO_ITEMS: BentoItem[] = [
  { title: "Empresas", description: "Gerencie as contas de inquilinos e status das licenças.", href: "/admin/tenants", icon: Users },
  { title: "Usuários", description: "Lista de logins, convite de novos membros e concessão de cargos administrativos.", href: "/admin/usuarios", icon: Shield },
  { title: "Planos", description: "Configure planos de cobrança e libere permissões modulares.", href: "/admin/planos", icon: CreditCard },
  { title: "Relatórios", description: "Consolidação de receitas, MRR, churn e crescimento.", href: "/admin/relatorios", icon: BarChart3 },
  { title: "Logs", description: "Histórico de eventos e auditoria de ações na plataforma.", href: "/admin/logs", icon: Activity },
  { title: "Configurações", description: "Defina os parâmetros operacionais da plataforma SaaS.", href: "/admin/configuracoes", icon: Settings },
]
