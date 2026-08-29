import { PixKeyType } from "@/lib/sync/pixSettings"

/**
 * Remove acentos e caracteres especiais para compatibilidade estrita com o padrão EMVCo BACEN
 */
export function normalizePixString(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s.,-]/g, "")
    .trim()
}

/**
 * Limpa a chave Pix conforme seu tipo para montagem do payload
 */
export function cleanPixKey(key: string, keyType: PixKeyType): string {
  const trimmed = key.trim()
  if (keyType === "CPF/CNPJ") {
    return trimmed.replace(/\D/g, "")
  }
  if (keyType === "Telefone") {
    const digits = trimmed.replace(/\D/g, "")
    if (!digits.startsWith("55") && digits.length <= 11) {
      return `+55${digits}`
    }
    return digits.startsWith("+") ? digits : `+${digits}`
  }
  return trimmed
}

/**
 * Formata um campo no padrão TLV (Tag-Length-Value)
 */
function formatTlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0")
  return `${id}${len}${value}`
}

/**
 * Calcula o CRC16-CCITT (Polinômio 0x1021, valor inicial 0xFFFF)
 */
export function calculateCrc16(payload: string): string {
  let crc = 0xffff
  const polynomial = 0x1021

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xffff
      } else {
        crc = (crc << 1) & 0xffff
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0")
}

export interface PixPayloadOptions {
  pixKey: string
  keyType: PixKeyType
  beneficiaryName: string
  beneficiaryCity: string
  amount?: number
  txid?: string
  additionalInfo?: string
}

/**
 * Gera o payload oficial do Pix Copia e Cola / BR Code (Padrão Banco Central / EMVCo)
 */
export function generatePixPayload(options: PixPayloadOptions): string {
  const {
    pixKey,
    keyType,
    beneficiaryName,
    beneficiaryCity,
    amount,
    txid = "***",
    additionalInfo,
  } = options

  const formattedKey = cleanPixKey(pixKey, keyType)
  const normName = normalizePixString(beneficiaryName).slice(0, 25) || "NAVELO PDV"
  const normCity = normalizePixString(beneficiaryCity).slice(0, 15) || "CIDADE"
  const normTxid = (normalizePixString(txid) || "***").slice(0, 25)

  // 00: Payload Format Indicator
  let payload = formatTlv("00", "01")

  // 01: Point of Initiation Method (12 = Dinâmico, 11 = Estático/reutilizável)
  payload += formatTlv("01", amount ? "12" : "11")

  // 26: Merchant Account Information - Pix
  let merchantAccountInfo = formatTlv("00", "br.gov.bcb.pix")
  merchantAccountInfo += formatTlv("01", formattedKey)
  if (additionalInfo && additionalInfo.trim()) {
    merchantAccountInfo += formatTlv("02", normalizePixString(additionalInfo).slice(0, 50))
  }
  payload += formatTlv("26", merchantAccountInfo)

  // 52: Merchant Category Code (0000 = Geral)
  payload += formatTlv("52", "0000")

  // 53: Transaction Currency (986 = BRL)
  payload += formatTlv("53", "986")

  // 54: Transaction Amount
  if (amount && amount > 0) {
    payload += formatTlv("54", amount.toFixed(2))
  }

  // 58: Country Code
  payload += formatTlv("58", "BR")

  // 59: Merchant Name
  payload += formatTlv("59", normName)

  // 60: Merchant City
  payload += formatTlv("60", normCity)

  // 62: Additional Data Field Template (txid)
  const additionalDataField = formatTlv("05", normTxid)
  payload += formatTlv("62", additionalDataField)

  // 63: CRC16
  payload += "6304"
  const checksum = calculateCrc16(payload)

  return `${payload}${checksum}`
}
