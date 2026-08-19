"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Badge } from "@/components/store/base/Badge"
import { Button } from "@/components/store/base/Button"
import { Modal } from "@/components/store/base/Modal"
import { Trash2, Edit2, Bike } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"

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
  status?: DeliveryStatus
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

function formatCurrency(val: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val)
}

function getNextAction(status: DeliveryStatus, isPickup: boolean): { nextStatus: DeliveryStatus; label: string } | null {
  if (status === "confirmed") {
    return { nextStatus: "preparing", label: "Confirmar pedido" }
  }
  if (status === "preparing") {
    return isPickup
      ? { nextStatus: "ready", label: "Pronto para retirada" }
      : { nextStatus: "dispatched", label: "Iniciar entrega" }
  }
  if (status === "ready" || status === "dispatched") {
    return { nextStatus: "delivered", label: "Confirmar entrega" }
  }
  return null
}

interface DeliveryHeaderProps {
  orderId: string
  origin: string
  status: DeliveryStatus
  estimatedTime: string
}

function DeliveryTimelineHeader({ orderId, origin, status, estimatedTime }: DeliveryHeaderProps) {
  const statusInfo = statusBadgeMap[status] || { variant: "primary" as const, label: "Aberto" }
  return (
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
  )
}

interface DeliveryClientInfoProps {
  createdAt: string
  clientName: string
  clientDocument?: string
  address: string
  clientPhone?: string
}

function DeliveryTimelineClientInfo({
  createdAt,
  clientName,
  clientDocument,
  address,
  clientPhone,
}: DeliveryClientInfoProps) {
  return (
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
  )
}

interface DeliveryRiderSectionProps {
  deliveryType: string
  paymentMethod: string
  motoboyName: string
  onSelectMotoboy?: () => void
}

function DeliveryTimelineRiderSection({
  deliveryType,
  paymentMethod,
  motoboyName,
  onSelectMotoboy,
}: DeliveryRiderSectionProps) {
  const d = UI_STRINGS.delivery
  return (
    <>
      <Stack gap={1} align="start" w="full">
        <Font variant="body-bold" text={d.deliveryAndPayment} />
        <Font variant="auxiliary" color="muted" text={deliveryType} />
        <Font variant="auxiliary" color="muted" text={paymentMethod} />
      </Stack>
      <Stack gap={1} align="start" w="full">
        <Stack direction="row" align="center" gap={2.5}>
          <Font variant="body-bold" text={d.riderSection} />
          <Box cursor="pointer" onClick={onSelectMotoboy}>
            <Font variant="sub-tiny-bold" color="primary" text={d.selectRiderAction} />
          </Box>
        </Stack>
        <Font variant="auxiliary" color="muted" text={motoboyName} />
      </Stack>
    </>
  )
}

interface DeliveryItemsSectionProps {
  items: DeliveryTimelineItem[]
}

function DeliveryTimelineItemsSection({ items }: DeliveryItemsSectionProps) {
  const d = UI_STRINGS.delivery
  return (
    <Stack gap={2.5} align="start" w="full">
      <Font variant="body-bold" text={d.itemsSection} />
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
  )
}

interface DeliveryTotalsSectionProps {
  computedSubtotal: number
  computedDeliveryFee: number
  computedDiscount: number
  totalToPay: number
  totalPaid: number
  paymentMethod?: string
  changeFor: number
  changeAmount: number
}

function DeliveryTimelineTotalsSection({
  computedSubtotal,
  computedDeliveryFee,
  computedDiscount,
  totalToPay,
  totalPaid,
  paymentMethod,
  changeFor,
  changeAmount,
}: DeliveryTotalsSectionProps) {
  const d = UI_STRINGS.delivery
  return (
    <Stack gap={2.5} align="start" w="full">
      <Font variant="body-bold" text={d.totalsSection} />
      <Stack gap={1} w="full">
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body-sm-medium" color="secondary" text={d.itemsTotal} />
          <Font variant="body-sm-semibold" text={formatCurrency(computedSubtotal)} />
        </Stack>
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body-sm-medium" color="secondary" text={d.deliveryFee} />
          <Font variant="body-sm-semibold" text={formatCurrency(computedDeliveryFee)} />
        </Stack>
        {computedDiscount > 0 && (
          <Stack direction="row" align="center" justify="between" w="full">
            <Font variant="body-sm-medium" color="secondary" text={d.discount} />
            <Font variant="body-sm-semibold" color="primary" text={`- ${formatCurrency(computedDiscount)}`} />
          </Stack>
        )}
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body-bold" text={d.totalToPay} />
          <Font variant="body-bold" text={formatCurrency(totalToPay)} />
        </Stack>
        <Stack direction="row" align="center" justify="between" w="full">
          <Font variant="body-sm-medium" color="secondary" text={d.totalPaid} />
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
  )
}

interface DeliveryFooterActionsProps {
  orderId: string
  isEditEnabled: boolean
  status: DeliveryStatus
  nextAction: { nextStatus: DeliveryStatus; label: string } | null
  onDeleteOrder?: (id: string) => void
  onEditOrder?: () => void
  onNextStatusClick: () => void
}

function DeliveryTimelineFooterActions({
  orderId,
  isEditEnabled,
  status,
  nextAction,
  onDeleteOrder,
  onEditOrder,
  onNextStatusClick,
}: DeliveryFooterActionsProps) {
  const common = UI_STRINGS.common
  return (
    <Box padding={5} w="full" borderTop={true} borderColor="border-border" bg="bg-surface">
      <Stack
        direction="col"
        mobileDirection="row"
        align="stretch"
        mobileAlign="center"
        justify="start"
        mobileJustify="between"
        w="full"
        gap={2.5}
      >
        <Stack direction="row" align="center" gap={2.5} w="w-full md:w-auto">
          {onDeleteOrder && (
            <Box w="w-1/2 md:w-auto" minW="0">
              <Button
                variant="danger-confirm"
                label={common.delete}
                icon={Trash2}
                onClick={() => onDeleteOrder(orderId)}
              />
            </Box>
          )}
          {onEditOrder && (
            <Box w="w-1/2 md:w-auto" minW="0">
              <Button
                variant="secondary"
                label={common.edit}
                icon={Edit2}
                disabled={!isEditEnabled}
                onClick={onEditOrder}
              />
            </Box>
          )}
        </Stack>

        {nextAction && status !== "delivered" && (
          <Box w="w-full md:w-auto" shrink="0">
            <Button
              variant="primary"
              label={nextAction.label}
              onClick={onNextStatusClick}
            />
          </Box>
        )}
      </Stack>
    </Box>
  )
}

const DEFAULT_TIMELINE_VALUES = {
  orderId: "016.3",
  origin: "Pedido realizado no Aplicativo",
  status: "confirmed" as DeliveryStatus,
  estimatedTime: "1 hora",
  createdAt: "07/08/2026 13:45",
  clientName: "Teste",
  clientDocument: "101.389.219-46",
  address: "Endereço",
  deliveryType: "Entrega no endereço",
  paymentMethod: "Cobrança na Entrega - Dinheiro",
  motoboyName: "Entregador não selecionado",
  totalPaid: 0,
  changeFor: 50,
  changeAmount: 7,
}

function computeTimelineFinancials(props: DeliveryTimelineProps, items: DeliveryTimelineItem[]) {
  let subtotal = props.subtotal
  if (subtotal === undefined) {
    let sum = 0
    for (let i = 0; i < items.length; i++) {
      sum += items[i].totalPrice || 0
    }
    subtotal = sum
  }
  const fee = props.deliveryFee !== undefined ? props.deliveryFee : 10
  const discount = props.discount !== undefined ? props.discount : 0
  const total = props.total !== undefined ? props.total : Math.max(0, subtotal + fee - discount)

  return { subtotal, fee, discount, total }
}

function resolveDeliveryDetails(props: DeliveryTimelineProps) {
  const items = props.items || []
  const fin = computeTimelineFinancials(props, items)
  return {
    ...DEFAULT_TIMELINE_VALUES,
    ...props,
    items,
    ...fin,
  }
}

export function DeliveryTimeline(props: DeliveryTimelineProps) {
  const d = UI_STRINGS.delivery
  const [isMotoboyWarningOpen, setIsMotoboyWarningOpen] = React.useState(false)
  const details = resolveDeliveryDetails(props)

  const isPickup = details.deliveryType.toLowerCase().includes("retirada") || details.deliveryType.toLowerCase().includes("pickup")
  const nextAction = getNextAction(details.status, isPickup)

  const handleNextStatusClick = () => {
    if (!nextAction || !props.onUpdateStatus) return
    if (details.status === "preparing" && !isPickup && details.motoboyName === "Entregador não selecionado") {
      setIsMotoboyWarningOpen(true)
      return
    }
    props.onUpdateStatus(nextAction.nextStatus)
  }

  return (
    <Box display="flex" direction="col" flex="1" h="full" minH="0" w="full" bg="bg-surface" radius="default" border={true} borderColor="border-border" padding={0}>
      <Box flex="1" minH="0" overflow="auto" w="full" padding={5}>
        <Stack gap={5} w="full">
          <DeliveryTimelineHeader orderId={details.orderId} origin={details.origin} status={details.status} estimatedTime={details.estimatedTime} />
          <DeliveryTimelineClientInfo createdAt={details.createdAt} clientName={details.clientName} clientDocument={details.clientDocument} address={details.address} clientPhone={details.clientPhone} />
          <Box h="h-[2px]" bg="bg-border" w="full" />
          <DeliveryTimelineRiderSection deliveryType={details.deliveryType} paymentMethod={details.paymentMethod} motoboyName={details.motoboyName} onSelectMotoboy={props.onSelectMotoboy} />
          <DeliveryTimelineItemsSection items={details.items} />
          <DeliveryTimelineTotalsSection
            computedSubtotal={details.subtotal}
            computedDeliveryFee={details.fee}
            computedDiscount={details.discount}
            totalToPay={details.total}
            totalPaid={details.totalPaid}
            paymentMethod={details.paymentMethod}
            changeFor={details.changeFor}
            changeAmount={details.changeAmount}
          />
        </Stack>
      </Box>

      <DeliveryTimelineFooterActions
        orderId={details.orderId}
        isEditEnabled={details.status === "confirmed"}
        status={details.status}
        nextAction={nextAction}
        onDeleteOrder={props.onDeleteOrder}
        onEditOrder={props.onEditOrder}
        onNextStatusClick={handleNextStatusClick}
      />

      <Modal
        isOpen={isMotoboyWarningOpen}
        onClose={() => setIsMotoboyWarningOpen(false)}
        title={d.motoboyWarningTitle}
        subtitle={d.motoboyWarningSubtitle}
        icon={Bike}
        successText={d.motoboyWarningSuccess}
        onSuccess={() => {
          setIsMotoboyWarningOpen(false)
          props.onSelectMotoboy?.()
        }}
        showCancelButton={true}
      >
        <Font variant="body-sm-medium" color="secondary" text={d.motoboyWarningBody} />
      </Modal>
    </Box>
  )
}
