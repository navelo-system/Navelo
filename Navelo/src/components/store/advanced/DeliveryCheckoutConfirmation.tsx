"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { Truck, Store, UserCheck, CreditCard, RefreshCw, Check } from "lucide-react"
import { Rider, DeliveryRate } from "@/lib/dal"
import { UI_STRINGS } from "@/constants/strings"

export type DeliveryType = "delivery" | "pickup"
export type PaymentMoment = "on_delivery" | "advance"

export interface DeliveryClientInfo {
  name: string
  phone?: string
  address?: string
  customerId?: string
  email?: string
  document?: string
}

export interface DeliveryCheckoutConfirmationProps {
  statusText?: string
  client: DeliveryClientInfo
  rider?: Rider | null
  rate?: DeliveryRate | null
  onAlterStatus?: () => void
  onAlterClient?: () => void
  onClearClient?: () => void
  onSelectRider?: () => void
  onClearRider?: () => void
  onSelectRate?: () => void
  onClearRate?: () => void
  onConfirmOrder: (orderData: {
    status: string
    deliveryType: DeliveryType
    client: DeliveryClientInfo
    rider?: Rider | null
    rate?: DeliveryRate | null
    paymentMoment: PaymentMoment
  }) => void
  onCancel?: () => void
}

const statusOptions = [
  "Status do pedido: Aberto",
  "Status do pedido: Confirmado",
  "Status do pedido: Preparando",
  "Status do pedido: Pronto para entrega",
]

function ConfirmationStatusSection({
  currentStatus,
  isStatusSelectorOpen,
  onToggleSelector,
  onSelectStatus,
}: {
  currentStatus: string
  isStatusSelectorOpen: boolean
  onToggleSelector: () => void
  onSelectStatus: (st: string) => void
}) {
  const d = UI_STRINGS.delivery
  return (
    <Stack gap={2.5} w="full">
      <Stack direction="row" justify="between" align="center" w="full">
        <Font variant="body-bold" text={d.statusLabelRequired} />
        <Button variant="secondary-icon-xs" icon={RefreshCw} spinOnClick={true} title={d.changeStatusTitle} type="button" onClick={onToggleSelector} />
      </Stack>
      <Font variant="description" color="muted" text={currentStatus} />
      {isStatusSelectorOpen && (
        <Box padding={0} bg="surface-sunken" radius="default" w="full">
          <Stack gap={1} w="full">
            {statusOptions.map((st) => (
              <Box
                key={st}
                padding={2.5}
                cursor="pointer"
                radius="default"
                bg={currentStatus === st ? "primary/10" : "transparent"}
                hoverBg="surface-sunken"
                onClick={() => onSelectStatus(st)}
              >
                <Stack direction="row" justify="between" align="center" w="full">
                  <Font variant="body-sm-semibold" color={currentStatus === st ? "primary" : "foreground"} text={st} />
                  {currentStatus === st && <Icon icon={Check} size={14} color="primary" />}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  )
}

function AccordionClientItem({
  client,
  onAlterClient,
  onClearClient,
}: {
  client: DeliveryClientInfo
  onAlterClient?: () => void
  onClearClient?: () => void
}) {
  const d = UI_STRINGS.delivery
  return (
    <Stack gap={2.5} w="full">
      <Stack direction="row" justify="between" align="center" w="full">
        <Font variant="body-bold" text={d.clientRequired} />
        <Stack direction="row" gap={2.5} align="center">
          {onAlterClient && (
            <Box cursor="pointer" onClick={onAlterClient}>
              <Font variant="sub-tiny-bold" color="primary" text={d.alterAction} />
            </Box>
          )}
          {onClearClient && (
            <Box cursor="pointer" onClick={onClearClient}>
              <Font variant="sub-tiny-bold" color="muted" text={d.clearAction} />
            </Box>
          )}
        </Stack>
      </Stack>
      <Stack gap={1} w="full">
        <Font variant="body-sm-medium" text={client.name || d.clientNotInformed} />
        {client.phone && <Font variant="body-sm-medium" color="muted" text={client.phone} />}
        <Font variant="body-sm-medium" color="muted" text={client.address || d.addressNotInformed} />
      </Stack>
    </Stack>
  )
}

function AccordionRiderItem({
  rider,
  onSelectRider,
  onClearRider,
}: {
  rider?: Rider | null
  onSelectRider?: () => void
  onClearRider?: () => void
}) {
  const d = UI_STRINGS.delivery
  return (
    <Stack gap={2.5} w="full">
      <Stack direction="row" justify="between" align="center" w="full">
        <Font variant="body-bold" text={d.riderSection} />
        <Stack direction="row" gap={2.5} align="center">
          {onSelectRider && (
            <Box cursor="pointer" onClick={onSelectRider}>
              <Font variant="sub-tiny-bold" color="primary" text={rider ? d.alterAction : d.selectRiderAction} />
            </Box>
          )}
          {rider && onClearRider && (
            <Box cursor="pointer" onClick={onClearRider}>
              <Font variant="sub-tiny-bold" color="muted" text={d.clearAction} />
            </Box>
          )}
        </Stack>
      </Stack>
      <Font variant="body-sm-medium" color={rider ? "foreground" : "muted"} text={rider ? rider.name : d.selectRiderPlaceholder} />
    </Stack>
  )
}

function AccordionRateItem({
  rate,
  onSelectRate,
  onClearRate,
}: {
  rate?: DeliveryRate | null
  onSelectRate?: () => void
  onClearRate?: () => void
}) {
  const d = UI_STRINGS.delivery
  const rateText = rate
    ? `${rate.neighborhood} (R$ ${(rate.fee || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })})`
    : d.noDeliveryFeeInformed

  return (
    <Stack gap={2.5} w="full">
      <Stack direction="row" justify="between" align="center" w="full">
        <Font variant="body-bold" text={d.deliveryFee} />
        <Stack direction="row" gap={2.5} align="center">
          {onSelectRate && (
            <Box cursor="pointer" onClick={onSelectRate}>
              <Font variant="sub-tiny-bold" color="primary" text={rate ? d.alterAction : d.selectRiderAction} />
            </Box>
          )}
          {rate && onClearRate && (
            <Box cursor="pointer" onClick={onClearRate}>
              <Font variant="sub-tiny-bold" color="muted" text={d.clearAction} />
            </Box>
          )}
        </Stack>
      </Stack>
      <Font variant="body-sm-medium" color={rate ? "foreground" : "muted"} text={rateText} />
    </Stack>
  )
}

function ConfirmationPaymentMomentSection({
  paymentMoment,
  onSelectPaymentMoment,
}: {
  paymentMoment: PaymentMoment
  onSelectPaymentMoment: (m: PaymentMoment) => void
}) {
  const d = UI_STRINGS.delivery
  const paymentMomentOptions: Array<{ id: PaymentMoment; label: string; icon: typeof UserCheck }> = [
    { id: "on_delivery", label: "Cobrar na entrega/retirada", icon: UserCheck },
    { id: "advance", label: "Cobrar antecipado", icon: CreditCard },
  ]

  return (
    <Stack gap={2.5} w="full">
      <Font variant="body-bold" text={d.paymentMomentRequired} />
      <Stack gap={2.5} w="full">
        {paymentMomentOptions.map((opt) => {
          const isSelected = paymentMoment === opt.id
          return (
            <Box
              key={opt.id}
              padding={2.5}
              radius="default"
              cursor="pointer"
              border={true}
              borderColor={isSelected ? "border-brand-primary" : "border-border"}
              bg={isSelected ? "bg-brand-primary/5" : "bg-transparent"}
              hoverBg="surface-sunken"
              onClick={() => onSelectPaymentMoment(opt.id)}
            >
              <Stack direction="row" gap={2.5} align="center" w="full">
                <Icon icon={opt.icon} color={isSelected ? "primary" : "muted"} />
                <Font variant="body-sm-medium" color={isSelected ? "primary" : "foreground"} text={opt.label} />
              </Stack>
            </Box>
          )
        })}
      </Stack>
    </Stack>
  )
}

function DeliveryTypeOptionsList({
  deliveryType,
  setDeliveryType,
  client,
  rider,
  rate,
  onAlterClient,
  onClearClient,
  onSelectRider,
  onClearRider,
  onSelectRate,
  onClearRate,
}: {
  deliveryType: DeliveryType
  setDeliveryType: (t: DeliveryType) => void
  client: DeliveryClientInfo
  rider?: Rider | null
  rate?: DeliveryRate | null
  onAlterClient?: () => void
  onClearClient?: () => void
  onSelectRider?: () => void
  onClearRider?: () => void
  onSelectRate?: () => void
  onClearRate?: () => void
}) {
  const d = UI_STRINGS.delivery
  const options: Array<{ id: DeliveryType; label: string; icon: typeof Truck }> = [
    { id: "delivery", label: "Entrega", icon: Truck },
    { id: "pickup", label: "Retirada", icon: Store },
  ]

  return (
    <Stack gap={2.5} w="full">
      <Font variant="body-bold" text={d.deliveryTypeRequired} />
      <Stack gap={2.5} w="full">
        {options.map((opt) => (
          <Stack key={opt.id} gap={2.5} w="full">
            <Box
              padding={2.5}
              radius="default"
              cursor="pointer"
              border
              borderColor={deliveryType === opt.id ? "border-brand-primary" : "border-border"}
              bg={deliveryType === opt.id ? "bg-brand-primary/5" : "bg-transparent"}
              hoverBg="surface-sunken"
              onClick={() => setDeliveryType(opt.id)}
            >
              <Stack direction="row" gap={2.5} align="center" w="full">
                <Icon icon={opt.icon} color={deliveryType === opt.id ? "primary" : "muted"} />
                <Font variant="body-sm-medium" color={deliveryType === opt.id ? "primary" : "foreground"} text={opt.label} />
              </Stack>
            </Box>
            {opt.id === "delivery" && deliveryType === opt.id && (
              <Box padding={2.5} bg="surface-sunken" radius="default" w="full">
                <Stack gap={5} w="full">
                  <AccordionClientItem client={client} onAlterClient={onAlterClient} onClearClient={onClearClient} />
                  <AccordionRiderItem rider={rider} onSelectRider={onSelectRider} onClearRider={onClearRider} />
                  <AccordionRateItem rate={rate} onSelectRate={onSelectRate} onClearRate={onClearRate} />
                </Stack>
              </Box>
            )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}

export function DeliveryCheckoutConfirmation({
  statusText,
  client,
  rider,
  rate,
  onAlterStatus,
  onAlterClient,
  onClearClient,
  onSelectRider,
  onClearRider,
  onSelectRate,
  onClearRate,
  onConfirmOrder,
  onCancel,
}: DeliveryCheckoutConfirmationProps) {
  const d = UI_STRINGS.delivery
  const [currentStatus, setCurrentStatus] = React.useState(statusText || d.defaultStatusOpen)
  const [deliveryType, setDeliveryType] = React.useState<DeliveryType>("delivery")
  const [paymentMoment, setPaymentMoment] = React.useState<PaymentMoment>("on_delivery")
  const [isStatusSelectorOpen, setIsStatusSelectorOpen] = React.useState(false)

  const handleConfirm = React.useCallback(() => {
    onConfirmOrder({ status: currentStatus, deliveryType, client, rider, rate, paymentMoment })
  }, [currentStatus, deliveryType, client, rider, rate, paymentMoment, onConfirmOrder])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F9") {
        e.preventDefault()
        handleConfirm()
      } else if (e.key === "Escape" && onCancel) {
        e.preventDefault()
        onCancel()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleConfirm, onCancel])

  return (
    <Box display="flex" direction="col" flex="1" minH="0" overflow="auto" w="full">
      <Box padding={5} bg="bg-surface" radius="default" border borderColor="border-border" shadow="default" w="full">
        <Stack gap={5} w="full">
          <ConfirmationStatusSection
            currentStatus={currentStatus}
            isStatusSelectorOpen={isStatusSelectorOpen}
            onToggleSelector={() => {
              if (onAlterStatus) onAlterStatus()
              else setIsStatusSelectorOpen((prev) => !prev)
            }}
            onSelectStatus={(st) => {
              setCurrentStatus(st)
              setIsStatusSelectorOpen(false)
            }}
          />

          <DeliveryTypeOptionsList
            deliveryType={deliveryType} setDeliveryType={setDeliveryType}
            client={client} rider={rider} rate={rate}
            onAlterClient={onAlterClient} onClearClient={onClearClient}
            onSelectRider={onSelectRider} onClearRider={onClearRider}
            onSelectRate={onSelectRate} onClearRate={onClearRate}
          />

          <ConfirmationPaymentMomentSection paymentMoment={paymentMoment} onSelectPaymentMoment={setPaymentMoment} />
          <Box w="full" paddingY={2.5}>
            <Button variant="primary" label={d.confirmOrderF9} fullWidth onClick={handleConfirm} />
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
