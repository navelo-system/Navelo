export interface PosInstituicao {
  name: string
  cnpj: string
  isDefault: boolean
}

export interface DeviceFiscalSettings {
  emitirNotas: boolean
  certificadoNome: string
  certificadoBase64?: string
  qrCode: string
  serieNfce: string
  ultimoNfce: string
  serieNfe: string
  ultimoNfe: string
  regimeTributario: string
  homologacao: boolean
  imprimirComprovanteNaoFiscal: boolean
  emitirNfeAutomaticoCnpj: boolean
  motivoCancelamento: string
  informacoesAdicionais: string
  authorizedCpfCnpj: string[]
  posEnabled: boolean
  posObrigatorioInstituicao: boolean
  posObrigatorioBandeira: boolean
  posObrigatorioAutorizacao: boolean
  posInstituicoes: PosInstituicao[]
}

export const DEVICE_FISCAL_STORAGE_KEY = "navelo_device_fiscal_settings"
export const DEVICE_FISCAL_SETTINGS_EVENT = "navelo-fiscal-settings-changed"

export function createDefaultDeviceFiscalSettings(): DeviceFiscalSettings {
  return {
    emitirNotas: false,
    certificadoNome: "",
    certificadoBase64: undefined,
    qrCode: "Versão 2.0",
    serieNfce: "0",
    ultimoNfce: "0",
    serieNfe: "0",
    ultimoNfe: "0",
    regimeTributario: "Simples Nacional",
    homologacao: false,
    imprimirComprovanteNaoFiscal: false,
    emitirNfeAutomaticoCnpj: false,
    motivoCancelamento: "Operação cancelada pelo cliente",
    informacoesAdicionais: "",
    authorizedCpfCnpj: [],
    posEnabled: false,
    posObrigatorioInstituicao: false,
    posObrigatorioBandeira: false,
    posObrigatorioAutorizacao: false,
    posInstituicoes: [],
  }
}

function persistDeviceFiscalSettings(settings: DeviceFiscalSettings, notify: boolean) {
  if (typeof window === "undefined") return
  localStorage.setItem(DEVICE_FISCAL_STORAGE_KEY, JSON.stringify(settings))
  if (notify) window.dispatchEvent(new Event(DEVICE_FISCAL_SETTINGS_EVENT))
}

export function loadDeviceFiscalSettings(): DeviceFiscalSettings {
  if (typeof window === "undefined") return createDefaultDeviceFiscalSettings()
  const raw = localStorage.getItem(DEVICE_FISCAL_STORAGE_KEY)
  if (!raw) {
    const created = createDefaultDeviceFiscalSettings()
    localStorage.setItem(DEVICE_FISCAL_STORAGE_KEY, JSON.stringify(created))
    return created
  }
  try {
    const parsed = JSON.parse(raw) as Partial<DeviceFiscalSettings>
    return { ...createDefaultDeviceFiscalSettings(), ...parsed }
  } catch {
    return createDefaultDeviceFiscalSettings()
  }
}

export function saveDeviceFiscalSettings(settings: DeviceFiscalSettings): void {
  persistDeviceFiscalSettings(settings, true)
}

export function patchDeviceFiscalSettings(patch: Partial<DeviceFiscalSettings>): DeviceFiscalSettings {
  const next = { ...loadDeviceFiscalSettings(), ...patch }
  persistDeviceFiscalSettings(next, true)
  return next
}
