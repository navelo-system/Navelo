import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Grid } from "../base/Grid"
import { Icon } from "../base/Icon"
import { Printer } from "lucide-react"

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

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

const ReceiptItemRow: React.FC<{ item: ThermalReceiptItem }> = ({ item }) => (
  <Stack direction="row" justify="between" gap={0}>
    <Box w="1/2" overflow="hidden">
      <Font variant="body-xs" text={item.name} truncate mono />
    </Box>
    <Box w="1/4" display="flex" justify="center">
      <Font variant="body-xs" text={`${item.qty}x`} mono />
    </Box>
    <Box w="1/4" display="flex" justify="end">
      <Font variant="body-xs" text={formatPrice(item.qty * item.unitPrice)} mono />
    </Box>
  </Stack>
)

const ReceiptTotals: React.FC<{ subtotal: number; taxValue: number; paymentMethod: string }> = ({
  subtotal, taxValue, paymentMethod
}) => (
  <>
    <Stack gap={1}>
      <Stack direction="row" justify="between">
        <Font variant="body-xs" text="Subtotal" mono />
        <Font variant="body-xs" text={formatPrice(subtotal)} mono />
      </Stack>
      <Stack direction="row" justify="between">
        <Font variant="body-xs" text="Tributos Aprox. (12%)" mono />
        <Font variant="body-xs" text={formatPrice(taxValue)} mono />
      </Stack>
      <Box borderTop borderStyle="dashed" borderColor="border-border" paddingY={2.5}>
        <Stack direction="row" justify="between">
          <Font variant="body-xs-bold" text="VALOR TOTAL" mono />
          <Font variant="body-xs-bold" text={formatPrice(subtotal)} mono />
        </Stack>
      </Box>
    </Stack>
    <Box borderTop borderStyle="dashed" borderColor="border-border" w="full" />
    <Box display="flex" direction="row" justify="between" paddingY={2.5}>
      <Font variant="body-xs" text="FORMA PAGTO." mono />
      <Font variant="body-xs-bold" text={paymentMethod} mono />
    </Box>
    <Box borderTop borderStyle="dashed" borderColor="border-border" w="full" />
  </>
)

const ReceiptFooter: React.FC = () => (
  <Stack gap={2.5} align="center">
    <Font variant="auxiliary" text="NFC-e Nº 000184 Série 001" mono align="center" />
    <Font variant="auxiliary" text="Emissão: 26/06/2026 01:52" mono align="center" />
    <Font variant="auxiliary" text="Via Consumidor" mono align="center" />
    
    <Box w="w-24" h="h-24" border borderStyle="dashed" borderColor="border-border" bg="bg-surface-sunken" display="flex" justify="center" padding={2.5}>
      <Stack align="center" justify="center" w="full" h="full">
        <Grid cols={4} gap={1} responsive={false} w="w-full" h="h-full">
          {Array.from({ length: 16 }).map((_, i) => (
            <Box key={i} w="full" h="full" bg={i % 3 === 0 || i % 7 === 0 ? "bg-black" : "bg-transparent"} />
          ))}
        </Grid>
      </Stack>
    </Box>
    
    <Font variant="auxiliary" text="Consulte pelo QR Code ou Chave de Acesso:" mono align="center" />
    <Font variant="auxiliary" text="3526 0612 3456 7800 0199 6500 1000 0001 8410 0234 5678" mono align="center" />
  </Stack>
)

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
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.unitPrice, 0)
  const taxValue = subtotal * 0.12

  return (
    <Box padding={5} bg="bg-surface" radius="default">
      <Stack gap={5}>
        <Stack direction="row" align="center" justify="between" gap={5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Printer} size={18} color="primary" />
            <Font variant="body-bold" text="Pré-visualização do Cupom" />
          </Stack>
          <Font variant="auxiliary" text="Bobina 80mm" />
        </Stack>

        <Box borderBottom borderColor="border-border" w="full" />

        {/* Flex parent container handles centering instead of mx-auto */}
        <Box display="flex" justify="center" w="full">
          <Box padding={5} bg="bg-white" w="max-w-[320px]" shadow="inner" borderTop borderStyle="dashed" borderColor="border-border">
            <Stack gap={2.5} align="center">
              <Font variant="body-bold" text={companyName} align="center" mono />
              <Font variant="auxiliary" text={`CNPJ: ${cnpj}`} mono />
              <Font variant="auxiliary" text="RUA DAS FLORES, 123 - CENTRO - SP" mono />
              <Box borderTop borderStyle="dashed" borderColor="border-border" w="full" />
              <Font variant="body-bold" text="CUPOM FISCAL ELETRÔNICO (NFC-e)" align="center" mono />
              <Box borderTop borderStyle="dashed" borderColor="border-border" w="full" />
            </Stack>

            <Box borderBottom borderColor="border-border" paddingY={1} />

            <Box display="flex" direction="row" justify="between" paddingY={2.5}>
              <Box w="1/2">
                <Font variant="body-xs-bold" text="ITEM" mono />
              </Box>
              <Box w="1/4" display="flex" justify="center">
                <Font variant="body-xs-bold" text="QTD" mono />
              </Box>
              <Box w="1/4" display="flex" justify="end">
                <Font variant="body-xs-bold" text="VALOR" mono />
              </Box>
            </Box>

            <Stack gap={1}>
              {items.map((item, idx) => (
                <ReceiptItemRow key={idx} item={item} />
              ))}
            </Stack>

            <Box borderTop borderStyle="dashed" borderColor="border-border" w="full" paddingY={2.5} />

            <ReceiptTotals subtotal={subtotal} taxValue={taxValue} paymentMethod={paymentMethod} />
            <ReceiptFooter />
          </Box>
        </Box>
      </Stack>
    </Box>
  )
}
