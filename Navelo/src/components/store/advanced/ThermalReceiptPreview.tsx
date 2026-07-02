import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Icon } from "../base/Icon"
import { Printer, ShieldAlert } from "lucide-react"

export interface ThermalReceiptItem {
  name: string
  qty: number
  unitPrice: number
}

export interface ThermalReceiptPreviewProps {
  companyName?: string
  cnpj?: string
  items?: ThermalReceiptItem[]
  paymentMethod?: string
}

export const ThermalReceiptPreview: React.FC<ThermalReceiptPreviewProps> = ({
  companyName = "NAVELO TECNOLOGIA LTDA",
  cnpj = "12.345.678/0001-99",
  items = [
    { name: "Hambúrguer Gourmet", qty: 2, unitPrice: 28.90 },
    { name: "Batata Rústica", qty: 1, unitPrice: 15.00 },
    { name: "Soda Italiana 500ml", qty: 1, unitPrice: 9.50 },
  ],
  paymentMethod = "PIX",
}) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const subtotal = items.reduce((acc, item) => acc + item.qty * item.unitPrice, 0)
  const taxValue = subtotal * 0.12 // Mock tax 12%

  return (
    <Box padding={5} bg="bg-surface" radius="default">
      <Stack gap={5}>
        {/* Header */}
        <Stack direction="row" align="center" justify="between" gap={5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Printer size={18} className="text-brand-primary" />
            <Font variant="body-bold" text="Pré-visualização do Cupom" />
          </Stack>
          <Font variant="auxiliary" text="Bobina 80mm" />
        </Stack>

        <div className="h-[2px] bg-border w-full" />

        {/* Thermal Bobina Area */}
        <Box 
          padding={5} 
          bg="bg-white" 
          radius="none" 
          className="shadow-inner font-mono max-w-[320px] mx-auto text-black border-dashed border-t-2"
        >
          <Stack gap={2.5} align="center" className="text-center">
            {/* Store details */}
            <Font variant="body-bold" text={companyName} className="text-center font-mono font-black" />
            <Font variant="auxiliary" text={`CNPJ: ${cnpj}`} className="font-mono text-xs" />
            <Font variant="auxiliary" text="RUA DAS FLORES, 123 - CENTRO - SP" className="font-mono text-xs" />
            
            {/* Dashed line */}
            <div className="border-t-2 border-dashed border-gray-400 w-full my-2" />

            <Font variant="body-bold" text="CUPOM FISCAL ELETRÔNICO (NFC-e)" className="font-mono text-xs text-center" />
            
            {/* Dashed line */}
            <div className="border-t-2 border-dashed border-gray-400 w-full my-2" />
          </Stack>

          {/* Items Header */}
          <Stack direction="row" justify="between" className="text-xs font-mono border-b-2 border-gray-300 pb-1 mb-2 font-black">
            <span className="w-1/2">ITEM</span>
            <span className="w-1/4 text-center">QTD</span>
            <span className="w-1/4 text-right">VALOR</span>
          </Stack>

          {/* Items List */}
          <Stack gap={1}>
            {items.map((item, idx) => (
              <Stack key={idx} direction="row" justify="between" className="text-xs font-mono leading-tight">
                <span className="w-1/2 truncate">{item.name}</span>
                <span className="w-1/4 text-center">{item.qty}x</span>
                <span className="w-1/4 text-right">{formatPrice(item.qty * item.unitPrice)}</span>
              </Stack>
            ))}
          </Stack>

          {/* Dashed line */}
          <div className="border-t-2 border-dashed border-gray-400 w-full my-2" />

          {/* Totals */}
          <Stack gap={1} className="text-xs font-mono">
            <Stack direction="row" justify="between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </Stack>
            <Stack direction="row" justify="between">
              <span>Tributos Aprox. (12%)</span>
              <span>{formatPrice(taxValue)}</span>
            </Stack>
            <Stack direction="row" justify="between" className="font-black text-sm border-t-2 border-gray-200 pt-1">
              <span>VALOR TOTAL</span>
              <span>{formatPrice(subtotal)}</span>
            </Stack>
          </Stack>

          {/* Dashed line */}
          <div className="border-t-2 border-dashed border-gray-400 w-full my-2" />

          {/* Payment */}
          <Stack direction="row" justify="between" className="text-xs font-mono">
            <span>FORMA PAGTO.</span>
            <span className="font-black">{paymentMethod}</span>
          </Stack>

          {/* Dashed line */}
          <div className="border-t-2 border-dashed border-gray-400 w-full my-2" />

          {/* NFC-e Info & QR Code Placeholder */}
          <Stack gap={2.5} align="center" className="text-center text-[10px] font-mono leading-tight">
            <span>NFC-e Nº 000184 Série 001</span>
            <span>Emissão: 26/06/2026 01:52</span>
            <span>Via Consumidor</span>
            
            {/* Mock QR Code */}
            <Box 
              w="w-24" 
              h="h-24" 
              border 
              borderColor="border-gray-400" 
              bg="bg-gray-100" 
              radius="none" 
              className="flex items-center justify-center p-2 my-2"
            >
              <div className="grid grid-cols-4 gap-1 w-full h-full opacity-60">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={`w-full h-full ${i % 3 === 0 || i % 7 === 0 ? "bg-black" : "bg-transparent"}`} />
                ))}
              </div>
            </Box>

            <span>Consulte pelo QR Code ou Chave de Acesso:</span>
            <span className="break-all text-[9px] select-all">3526 0612 3456 7800 0199 6500 1000 0001 8410 0234 5678</span>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
