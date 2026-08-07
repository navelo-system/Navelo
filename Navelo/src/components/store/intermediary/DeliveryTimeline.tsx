"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Badge } from "@/components/store/base/Badge"
import { Button } from "@/components/store/base/Button"
import { Modal } from "@/components/store/base/Modal"
import { Trash2, Edit2, Bike } from "lucide-react"

export type DeliveryStatus = "confirmed" | "preparing" | "ready" | "dispatched" | "delivered"

export interface DeliveryTimelineItem {
  id: string
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface DeliveryTimelineProps {
  orderId?: string
  status: DeliveryStatus
  clientName?: string
  clientDocument?: string
  clientPhone?: string
  motoboyName?: string
  estimatedTime?: string
  address?: string
  createdAt?: string
  origin?: string
  deliveryType?: string
  paymentMethod?: string
  items?: DeliveryTimelineItem[]
  subtotal?: number
  deliveryFee?: number
  discount?: number
  total?: number
  totalPaid?: number
  changeFor?: number
  changeAmount?: number
  onDeleteOrder?: (id: string) => void
  onEditOrder?: () => void
  onSelectMotoboy?: () => void
  onUpdateStatus?: (newStatus: DeliveryStatus) => void
}

const statusBadgeMap: Record<DeliveryStatus, { variant: "primary" | "secondary" | "success" | "outline" | "default"; label: string }> = {
  confirmed: { variant: "primary", label: "Aberto" },
  preparing: { variant: "secondary", label: "Em preparo" },
  ready: { variant: "success", label: "Pronto para retirar" },
  dispatched: { variant: "secondary", label: "Saiu para entrega" },
  delivered: { variant: "success", label: "Entregue" },
}

export const DeliveryTimeline: React.FC<DeliveryTimelineProps> = ({
  orderId = "016.3",
  status = "confirmed",
  clientName = "Teste",
  clientDocument = "101.389.219-46",
  clientPhone = "(41) 998364028",
  motoboyName = "Entregador não selecionado",
  estimatedTime = "1 hora",
  address = "Rua Acre, 288, Ap 210 bloco 4 / Boneca do Iguaçu, São José dos Pinhais, PR, - CEP: 83040-030",
  createdAt = "07/08/2026 13:45",
  origin = "Pedido realizado no Aplicativo",
  deliveryType = "Entrega no endereço",
  paymentMethod = "Cobrança na Entrega - Dinheiro",
  items = [
    { id: "1", name: "ÁGUA COM GÁS", quantity: 1, unitPrice: 6.0, totalPrice: 6.0 },
    { id: "2", name: "ÁGUA SEM GÁS", quantity: 1, unitPrice: 3.0, totalPrice: 3.0 },
    { id: "3", name: "ÁGUA TÔNICA 350ML", quantity: 1, unitPrice: 6.0, totalPrice: 6.0 },
  ],
  subtotal,
  deliveryFee = 10.0,
  discount = 0,
  total,
  totalPaid = 0,
  changeFor = 50.0,
  changeAmount = 7.0,
  onDeleteOrder,
  onEditOrder,
  onSelectMotoboy,
  onUpdateStatus,
}) => {
  const [isMotoboyWarningOpen, setIsMotoboyWarningOpen] = React.useState(false)

  const statusInfo = statusBadgeMap[status] || { variant: "primary" as const, label: "Aberto" }

  const isPickup = React.useMemo(() => {
    if (!deliveryType) return false
    const lower = deliveryType.toLowerCase()
    return lower.includes("retirada") || lower.includes("pickup")
  }, [deliveryType])

  const getNextAction = (): { nextStatus: DeliveryStatus; label: string } | null => {
    switch (status) {
      case "confirmed":
        return { nextStatus: "preparing", label: "Confirmar pedido" }
      case "preparing":
        if (isPickup) {
          return { nextStatus: "ready", label: "Pronto para retirada" }
        }
        return { nextStatus: "dispatched", label: "Iniciar entrega" }
      case "ready":
        return { nextStatus: "delivered", label: "Confirmar entrega" }
      case "dispatched":
        return { nextStatus: "delivered", label: "Confirmar entrega" }
      case "delivered":
      default:
        return null
    }
  }

  const nextAction = getNextAction()
  const isEditEnabled = status === "confirmed"

  const handleNextStatusClick = () => {
    if (!nextAction || !onUpdateStatus) return

    // Se estiver em preparo e a próxima ação for iniciar entrega, verificar se há motoboy selecionado
    if (status === "preparing" && !isPickup) {
      const hasMotoboy = motoboyName && motoboyName !== "Entregador não selecionado"
      if (!hasMotoboy) {
        setIsMotoboyWarningOpen(true)
        return
      }
    }

    onUpdateStatus(nextAction.nextStatus)
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)

  const computedSubtotal = subtotal ?? items.reduce((acc, it) => acc + (it.totalPrice || 0), 0)
  const computedDeliveryFee = deliveryFee ?? 10.0
  const computedDiscount = discount ?? 0
  const totalToPay = total ?? Math.max(0, computedSubtotal + computedDeliveryFee - computedDiscount)

  return (
    <Box display="flex" direction="col" flex="1" h="full" minH="0" w="full" bg="bg-surface" radius="default" border={true} borderColor="border-border" padding={0}>
      {/* Área de conteúdo rolável internamente */}
      <Box flex="1" minH="0" overflow="auto" w="full" padding={5}>
        <Stack gap={5} w="full">
          {/* Cabeçalho do Detalhe: Venda - #016.3 + Badge de Status */}
          <Stack direction="row" align="center" justify="between" w="full">
            <Stack gap={0} align="start">
              <Font variant="h2" text={`Venda - ${orderId}`} />
              <Font variant="auxiliary" color="muted" text={origin} />
            </Stack>
            <Badge
              variant={statusInfo.variant}
              label={`${statusInfo.label} ⏱ ${estimatedTime}`}
            />
          </Stack>

          {/* Informações do Cliente */}
          <Stack gap={1} align="start" w="full">
            <Font variant="auxiliary" color="muted" text={createdAt} />
            <Font variant="body-bold" text={clientName} />
            {clientDocument && (
              <Font variant="auxiliary" color="muted" text={`Documento: ${clientDocument}`} />
            )}
            <Font variant="auxiliary" color="muted" text={address} />
            {clientPhone && (
              <Font variant="auxiliary" color="muted" text={clientPhone} />
            )}
          </Stack>

          <Box h="h-[2px]" bg="bg-border" w="full" />

          {/* Seção Entrega/Cobrança */}
          <Stack gap={1} align="start" w="full">
            <Font variant="body-bold" text="Entrega/Cobrança" />
            <Font variant="auxiliary" color="muted" text={deliveryType} />
            <Font variant="auxiliary" color="muted" text={paymentMethod} />
          </Stack>

          {/* Seção Entregador com link SELECIONAR */}
          <Stack gap={1} align="start" w="full">
            <Stack direction="row" align="center" gap={2.5}>
              <Font variant="body-bold" text="Entregador" />
              <Box cursor="pointer" onClick={onSelectMotoboy}>
                <Font variant="sub-tiny-bold" color="primary" text="SELECIONAR" />
              </Box>
            </Stack>
            <Font variant="auxiliary" color="muted" text={motoboyName} />
          </Stack>

          {/* Seção Itens */}
          <Stack gap={2.5} align="start" w="full">
            <Font variant="body-bold" text="Itens" />
            <Stack gap={2.5} w="full">
              {items.map((item) => (
                <Stack key={item.id} direction="row" align="center" justify="between" w="full">
                  <Stack gap={0} align="start">
                    <Font variant="body-sm-medium" text={item.name} />
                    <Font
                      variant="auxiliary"
                      color="muted"
                      text={`${item.quantity} UN x ${formatCurrency(item.unitPrice)}`}
                    />
                  </Stack>
                  <Font variant="body-sm-semibold" text={formatCurrency(item.totalPrice)} />
                </Stack>
              ))}
            </Stack>
          </Stack>

          {/* Seção Totais */}
          <Stack gap={2.5} align="start" w="full">
            <Font variant="body-bold" text="Totais" />
            <Stack gap={1} w="full">
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body-sm-medium" color="secondary" text="Valor itens" />
                <Font variant="body-sm-semibold" text={formatCurrency(computedSubtotal)} />
              </Stack>
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body-sm-medium" color="secondary" text="Taxa de entrega" />
                <Font variant="body-sm-semibold" text={formatCurrency(computedDeliveryFee)} />
              </Stack>
              {computedDiscount > 0 && (
                <Stack direction="row" align="center" justify="between" w="full">
                  <Font variant="body-sm-medium" color="secondary" text="Desconto" />
                  <Font variant="body-sm-semibold" color="primary" text={`- ${formatCurrency(computedDiscount)}`} />
                </Stack>
              )}
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body-bold" text="Total a pagar" />
                <Font variant="body-bold" text={formatCurrency(totalToPay)} />
              </Stack>
              <Stack direction="row" align="center" justify="between" w="full">
                <Font variant="body-sm-medium" color="secondary" text="Total pago" />
                <Font variant="body-sm-semibold" text={formatCurrency(totalPaid)} />
              </Stack>
              <Font variant="auxiliary" color="muted" text={paymentMethod || "Dinheiro"} />
              {changeFor > 0 && (
                <Font
                  variant="auxiliary"
                  color="muted"
                  text={`Troco para: ${formatCurrency(changeFor)}, levar ${formatCurrency(changeAmount)}`}
                />
              )}
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Rodapé de Ações Fixo na base da tela (Tamanho Normal) */}
      <Box padding={5} w="full" borderTop={true} borderColor="border-border" bg="bg-surface">
        <Stack direction="row" align="center" justify="between" w="full">
          <Stack direction="row" align="center" gap={2.5}>
            {onDeleteOrder && (
              <Button
                variant="danger-confirm"
                label="Excluir"
                icon={Trash2}
                onClick={() => onDeleteOrder(orderId)}
              />
            )}
            {onEditOrder && (
              <Button
                variant="secondary"
                label="Editar"
                icon={Edit2}
                disabled={!isEditEnabled}
                onClick={onEditOrder}
              />
            )}
          </Stack>

          {onUpdateStatus && nextAction && status !== "delivered" && (
            <Button
              variant="primary"
              label={nextAction.label}
              onClick={handleNextStatusClick}
            />
          )}
        </Stack>
      </Box>

      {/* Modal de Aviso: Entregador não selecionado */}
      <Modal
        isOpen={isMotoboyWarningOpen}
        onClose={() => setIsMotoboyWarningOpen(false)}
        title="Entregador não selecionado"
        subtitle="Selecione um entregador parceiro para iniciar a entrega deste pedido."
        icon={Bike}
        successText="Selecionar entregador"
        onSuccess={() => {
          setIsMotoboyWarningOpen(false)
          if (onSelectMotoboy) {
            onSelectMotoboy()
          }
        }}
        showCancelButton={true}
      >
        <Font
          variant="body-sm-medium"
          color="secondary"
          text="Não é possível alterar o status do pedido para 'Saiu para entrega' sem que haja um entregador atribuído ao pedido."
        />
      </Modal>
    </Box>
  )
}
