/**
 * APP_FEATURES — Catálogo de funcionalidades modulares do SaaS Navelo.
 * Cada feature pode ser liberada ou bloqueada por plano de assinatura.
 * Fonte de verdade para o CRUD de Planos.
 */
export const APP_FEATURES = [
  { id: "pos_touch", name: "Frente de Caixa (PDV Touch)", description: "Terminal rápido otimizado para toque" },
  { id: "thermal_print", name: "Impressão Térmica (Bobina 80mm)", description: "Visualização e impressão fiscal física" },
  { id: "bill_splitter", name: "Divisor de Contas", description: "Rateio e divisão parcial de mesas/comandas" },
  { id: "cash_session", name: "Controle de Sessão de Caixa", description: "Abertura, fechamento, sangrias e suprimentos" },
  { id: "kds_kanban", name: "Painel de Produção (KDS/Kanban)", description: "Monitoramento de pedidos na cozinha" },
  { id: "delivery_timeline", name: "Logística e Timeline de Delivery", description: "Painel de rastreamento de entregas e motoboy" },
  { id: "branch_switcher", name: "Seletor de Filiais (Multiempresa)", description: "Gestão consolidada de múltiplas lojas" },
  { id: "bento_dashboard", name: "Relatórios & Bento Dashboard", description: "Métricas completas e widgets mobile" },
  { id: "peripherals_manager", name: "Gerenciador de Periféricos", description: "Conexão local com balanças e leitores" },
] as const

export type AppFeatureId = typeof APP_FEATURES[number]["id"]
