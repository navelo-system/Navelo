export interface CatalogoOnlineIdentification {
  subdomain: string
  areas: string
  darkThemeEnabled: boolean
  lightColor: string
  darkColor: string
  facebook: string
  instagram: string
  coverImage?: string
  logoImage?: string
}

export interface CatalogoOnlineDaySchedule {
  day: string
  label: string
  enabled: boolean
  start: string
  end: string
}

export interface CatalogoOnlinePayments {
  contaDigitalEnabled: boolean
  pixEnabled: boolean
  dinheiro: boolean
  cartao: boolean
  entregaPix: boolean
}

export interface CatalogoOnlineWhatsApp {
  enabled: boolean
}

export interface CatalogoOnlineDelivery {
  retirada: boolean
  entrega: boolean
  consumirLocal: boolean
  taxasEntrega: boolean
}

export interface CatalogoOnlineOrders {
  login: boolean
  bloquearForaHorario: boolean
  notificacao: boolean
  avisoSonoro: boolean
  avisoContinuo: boolean
  dispositivo: string
}

export interface CatalogoOnlineSettings {
  enabled: boolean
  selectedProductIds: string[]
  allProductsSelected: boolean
  identification: CatalogoOnlineIdentification
  schedule: CatalogoOnlineDaySchedule[]
  payments: CatalogoOnlinePayments
  whatsapp: CatalogoOnlineWhatsApp
  delivery: CatalogoOnlineDelivery
  orders: CatalogoOnlineOrders
}

export const CATALOGO_ONLINE_SETTINGS_KEY = "navelo_catalogo_online_settings"
export const CATALOGO_ONLINE_SETTINGS_EVENT = "navelo-catalogo-online-settings-changed"

export function createDefaultCatalogoOnlineSettings(): CatalogoOnlineSettings {
  return {
    enabled: true,
    selectedProductIds: [],
    allProductsSelected: true,
    identification: {
      subdomain: "basenavelo",
      areas: "",
      darkThemeEnabled: true,
      lightColor: "#e05a2b",
      darkColor: "#2196f3",
      facebook: "",
      instagram: "https://www.instagram.com/navelo_pdv/",
      coverImage: "",
      logoImage: "",
    },
    schedule: [
      { day: "seg", label: "Segunda-feira", enabled: true, start: "08:00", end: "18:00" },
      { day: "ter", label: "Terça-feira", enabled: true, start: "08:00", end: "18:00" },
      { day: "qua", label: "Quarta-feira", enabled: true, start: "08:00", end: "18:00" },
      { day: "qui", label: "Quinta-feira", enabled: true, start: "08:00", end: "18:00" },
      { day: "sex", label: "Sexta-feira", enabled: true, start: "08:00", end: "18:00" },
      { day: "sab", label: "Sábado", enabled: false, start: "09:00", end: "13:00" },
      { day: "dom", label: "Domingo", enabled: false, start: "09:00", end: "13:00" },
    ],
    payments: {
      contaDigitalEnabled: true,
      pixEnabled: true,
      dinheiro: true,
      cartao: true,
      entregaPix: true,
    },
    whatsapp: {
      enabled: true,
    },
    delivery: {
      retirada: true,
      entrega: true,
      consumirLocal: false,
      taxasEntrega: false,
    },
    orders: {
      login: true,
      bloquearForaHorario: true,
      notificacao: true,
      avisoSonoro: true,
      avisoContinuo: false,
      dispositivo: "dev-06",
    },
  }
}

export function loadCatalogoOnlineSettings(): CatalogoOnlineSettings {
  if (typeof window === "undefined") return createDefaultCatalogoOnlineSettings()
  try {
    const raw = window.localStorage.getItem(CATALOGO_ONLINE_SETTINGS_KEY)
    if (!raw) return createDefaultCatalogoOnlineSettings()
    const parsed = JSON.parse(raw)
    const defaults = createDefaultCatalogoOnlineSettings()
    return {
      ...defaults,
      ...parsed,
      identification: { ...defaults.identification, ...(parsed.identification || {}) },
      schedule: Array.isArray(parsed.schedule) && parsed.schedule.length > 0 ? parsed.schedule : defaults.schedule,
      payments: { ...defaults.payments, ...(parsed.payments || {}) },
      whatsapp: { ...defaults.whatsapp, ...(parsed.whatsapp || {}) },
      delivery: { ...defaults.delivery, ...(parsed.delivery || {}) },
      orders: { ...defaults.orders, ...(parsed.orders || {}) },
    }
  } catch {
    return createDefaultCatalogoOnlineSettings()
  }
}

export function saveCatalogoOnlineSettings(settings: CatalogoOnlineSettings): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(CATALOGO_ONLINE_SETTINGS_KEY, JSON.stringify(settings))
  window.dispatchEvent(new CustomEvent(CATALOGO_ONLINE_SETTINGS_EVENT, { detail: settings }))
}

export function patchCatalogoOnlineSettings(patch: Partial<CatalogoOnlineSettings>): CatalogoOnlineSettings {
  const current = loadCatalogoOnlineSettings()
  const updated: CatalogoOnlineSettings = {
    ...current,
    ...patch,
  }
  saveCatalogoOnlineSettings(updated)
  return updated
}

// Helpers de formatação para subtítulos do menu
export function formatScheduleSummary(schedule: CatalogoOnlineDaySchedule[]): string {
  const enabledDays = schedule.filter((s) => s.enabled)
  if (enabledDays.length === 0) return "Nenhum dia configurado"
  if (enabledDays.length === 7) {
    const first = enabledDays[0]
    return `Todos os dias (${first.start} às ${first.end})`
  }
  if (
    enabledDays.length === 5 &&
    enabledDays.every((d) => ["seg", "ter", "qua", "qui", "sex"].includes(d.day))
  ) {
    const first = enabledDays[0]
    return `Seg a Sex (${first.start} às ${first.end})`
  }
  return `${enabledDays.length} dias configurados`
}

export function formatPaymentsSummary(payments: CatalogoOnlinePayments): string {
  const active: string[] = []
  if (payments.contaDigitalEnabled) active.push("Conta Digital")
  if (payments.pixEnabled) active.push("Pix")
  if (payments.dinheiro) active.push("Dinheiro")
  if (payments.cartao) active.push("Cartão")
  if (payments.entregaPix) active.push("Pix Entrega")
  return active.length > 0 ? active.join(", ") : "Nenhuma forma ativa"
}

export function formatDeliverySummary(delivery: CatalogoOnlineDelivery): string {
  const active: string[] = []
  if (delivery.retirada) active.push("Retirada no local")
  if (delivery.entrega) active.push("Entrega")
  if (delivery.consumirLocal) active.push("Consumir no local")
  if (delivery.taxasEntrega) active.push("Taxas ativas")
  return active.length > 0 ? active.join(", ") : "Nenhuma opção ativa"
}

export function formatOrdersSummary(orders: CatalogoOnlineOrders): string {
  const active: string[] = []
  if (orders.login) active.push("Identificação obrigatória")
  if (orders.bloquearForaHorario) active.push("Bloqueio fora do horário")
  if (orders.avisoSonoro) active.push("Aviso sonoro")
  return active.length > 0 ? active.join(" • ") : "Padrão"
}

export function resolveDynamicCatalogUrl(slug: string): string {
  if (typeof window === "undefined") {
    return `https://${slug}.comercio.net.br`
  }
  const origin = window.location.origin
  if (origin && !origin.includes("tauri") && !origin.startsWith("file:")) {
    return `${origin}/catalogo/${slug}`
  }
  return `https://${slug}.comercio.net.br`
}
