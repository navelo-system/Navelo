"use client"

import * as React from "react"
import { Modal } from "@/components/store/base/Modal"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { CheckCircle2, ArrowRight } from "lucide-react"

interface SaleSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  change?: number
  paymentMethod?: string
  customerName?: string
  formatPrice: (value: number) => string
  onPrintReceipt?: () => void
}

export const SaleSuccessModal: React.FC<SaleSuccessModalProps> = ({
  isOpen,
  onClose,
  total,
  change = 0,
  paymentMethod,
  customerName,
  formatPrice,
  onPrintReceipt,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Venda Concluída" variant="default">
      <Stack gap={5} align="center" w="full">
        <Box color="brand-primary" display="flex" justify="center">
          <Icon icon={CheckCircle2} size={56} color="success" />
        </Box>

        <Stack gap={1} align="center" w="full">
          <Font variant="h3" text="Venda realizada com sucesso!" align="center" />
          {customerName && customerName !== "Nao selecionado" && (
            <Font variant="body-sm-medium" color="muted" text={`Cliente/Comanda: ${customerName}`} align="center" />
          )}
        </Stack>

        <Box padding={5} bg="bg-surface-sunken" radius="default" w="full">
          <Stack gap={2.5}>
            <Stack direction="row" justify="between" align="center">
              <Font variant="body-sm-medium" color="muted" text="Forma de Pagamento" />
              <Font variant="body-sm-semibold" text={paymentMethod || "Dinheiro"} />
            </Stack>
            <Stack direction="row" justify="between" align="center">
              <Font variant="body-sm-medium" color="muted" text="Valor Total" />
              <Font variant="body-bold" color="success" text={formatPrice(total)} />
            </Stack>
            {change > 0 && (
              <Stack direction="row" justify="between" align="center">
                <Font variant="body-sm-medium" color="muted" text="Troco a Devolver" />
                <Font variant="body-bold" color="primary" text={formatPrice(change)} />
              </Stack>
            )}
          </Stack>
        </Box>

        <Stack gap={2.5} w="full">
          {onPrintReceipt && (
            <Button
              variant="secondary-lg-print"
              fullWidth
              label="Imprimir Comprovante / Recibo"
              onClick={onPrintReceipt}
            />
          )}
          <Button
            variant="primary-lg"
            fullWidth
            icon={ArrowRight}
            label="Nova Venda / Concluir"
            onClick={onClose}
          />
        </Stack>
      </Stack>
    </Modal>
  )
}
