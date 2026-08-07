"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { Truck, Store, Utensils, UserCheck, CreditCard, ChevronRight, RefreshCw, Trash2, Check } from "lucide-react"

export type DeliveryType = "delivery" | "pickup" | "dine_in"
export type PaymentMoment = "on_delivery" | "advance"

export interface DeliveryClientInfo {
  name: string
  phone?: string
  address?: string
  customerId?: string
}

export interface DeliveryCheckoutConfirmationProps {
  statusText?: string
  client: DeliveryClientInfo
  onAlterStatus?: () => void
  onAlterClient?: () => void
  onClearClient?: () => void
  onConfirmOrder: (orderData: {
    status: string
    deliveryType: DeliveryType
    client: DeliveryClientInfo
    paymentMoment: PaymentMoment
  }) => void
  onCancel?: () => void
}

export const DeliveryCheckoutConfirmation: React.FC<DeliveryCheckoutConfirmationProps> = ({
  statusText = "Status do pedido: Aberto",
  client,
  onAlterStatus,
  onAlterClient,
  onClearClient,
  onConfirmOrder,
  onCancel,
}) => {
  const [currentStatus, setCurrentStatus] = React.useState(statusText)
  const [deliveryType, setDeliveryType] = React.useState<DeliveryType>("delivery")
  const [paymentMoment, setPaymentMoment] = React.useState<PaymentMoment>("on_delivery")
  const [isStatusSelectorOpen, setIsStatusSelectorOpen] = React.useState(false)

  const handleConfirm = React.useCallback(() => {
    onConfirmOrder({
      status: currentStatus,
      deliveryType,
      client,
      paymentMoment,
    })
  }, [currentStatus, deliveryType, client, paymentMoment, onConfirmOrder])

  // Atalho de teclado F9 para confirmar o pedido
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

  const deliveryTypeOptions: Array<{ id: DeliveryType; label: string; icon: typeof Truck }> = [
    { id: "delivery", label: "Entrega", icon: Truck },
    { id: "pickup", label: "Retirada", icon: Store },
  ]

  const paymentMomentOptions: Array<{ id: PaymentMoment; label: string; icon: typeof UserCheck }> = [
    { id: "on_delivery", label: "Cobrar na entrega/retirada", icon: UserCheck },
    { id: "advance", label: "Cobrar antecipado", icon: CreditCard },
  ]

  const statusOptions = [
    "Status do pedido: Aberto",
    "Status do pedido: Confirmado",
    "Status do pedido: Preparando",
    "Status do pedido: Pronto para entrega",
  ]

  return (
    <Box display="flex" direction="col" flex="1" minH="0" overflow="auto" w="full">
      <Box
        padding={5}
        bg="bg-surface"
        radius="default"
        border={true}
        borderColor="border-border"
        shadow="default"
        w="full"
      >
        <Stack gap={5} w="full">

          {/* 1. SEÇÃO STATUS */}
          <Stack gap={2.5} w="full">
            <Stack direction="row" justify="between" align="center" w="full">
              <Font variant="body-bold" text="* Status" />
              <Button
                variant="secondary-icon-xs"
                icon={RefreshCw}
                spinOnClick={true}
                title="Alterar status"
                type="button"
                onClick={() => {
                  if (onAlterStatus) {
                    onAlterStatus()
                  } else {
                    setIsStatusSelectorOpen((prev) => !prev)
                  }
                }}
              />
            </Stack>

            <Font variant="description" color="muted" text={currentStatus} />

            <div className={`grid transition-all duration-300 ease-in-out ${isStatusSelectorOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0 mt-0"}`}>
              <div className="overflow-hidden">
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
                        onClick={() => {
                          setCurrentStatus(st)
                          setIsStatusSelectorOpen(false)
                        }}
                      >
                        <Stack direction="row" justify="between" align="center" w="full">
                          <Font
                            variant="body-sm-semibold"
                            color={currentStatus === st ? "primary" : "foreground"}
                            text={st}
                          />
                          {currentStatus === st && <Icon icon={Check} size={14} color="primary" />}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </div>
            </div>
          </Stack>

          {/* 2. SEÇÃO TIPO DE ENTREGA */}
          <Stack gap={2.5} w="full">
            <Font variant="body-bold" text="* Tipo de entrega" />
            <Stack gap={2.5} w="full">
              {deliveryTypeOptions.map((opt) => {
                const isSelected = deliveryType === opt.id
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
                    onClick={() => setDeliveryType(opt.id)}
                  >
                    <Stack direction="row" gap={2.5} align="center" w="full">
                      <Icon
                        icon={opt.icon}
                        color={isSelected ? "primary" : "muted"}
                      />
                      <Font
                        variant="body-sm-medium"
                        color={isSelected ? "primary" : "foreground"}
                        text={opt.label}
                      />
                    </Stack>
                  </Box>
                )
              })}
            </Stack>
          </Stack>

          {/* 3. SEÇÃO CLIENTE */}
          <Stack gap={2.5} w="full">
            <Stack direction="row" justify="between" align="center" w="full">
              <Font variant="body-bold" text="* Cliente" />
              <Stack direction="row" gap={2.5} align="center">
                {onAlterClient && (
                  <Button
                    variant="secondary-icon-xs"
                    icon={RefreshCw}
                    spinOnClick={true}
                    title="Alterar cliente"
                    type="button"
                    onClick={onAlterClient}
                  />
                )}
                {onClearClient && (
                  <Button
                    variant="danger-icon-xs"
                    icon={Trash2}
                    title="Remover cliente"
                    type="button"
                    onClick={onClearClient}
                  />
                )}
              </Stack>
            </Stack>

            <Box padding={2.5} bg="surface-sunken" radius="default" w="full">
              <Stack gap={1} w="full">
                <Font variant="body-bold" text={client.name || "Cliente não informado"} />
                {client.phone && (
                  <Font variant="description" color="muted" text={client.phone} />
                )}
                {client.address ? (
                  <Font variant="description" color="muted" text={client.address} />
                ) : (
                  <Font variant="description" color="muted" text="Endereço não informado" />
                )}
              </Stack>
            </Box>
          </Stack>

          {/* 4. SEÇÃO MOMENTO DA COBRANÇA */}
          <Stack gap={2.5} w="full">
            <Font variant="body-bold" text="* Momento da cobrança" />
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
                    onClick={() => setPaymentMoment(opt.id)}
                  >
                    <Stack direction="row" gap={2.5} align="center" w="full">
                      <Icon
                        icon={opt.icon}
                        color={isSelected ? "primary" : "muted"}
                      />
                      <Font
                        variant="body-sm-medium"
                        color={isSelected ? "primary" : "foreground"}
                        text={opt.label}
                      />
                    </Stack>
                  </Box>
                )
              })}
            </Stack>
          </Stack>

          {/* 5. BOTÃO PRINCIPAL DE CONFIRMAÇÃO (F9) */}
          <Box w="full" paddingY={2.5}>
            <Button
              variant="primary"
              label="F9 – Confirmar pedido"
              fullWidth={true}
              onClick={handleConfirm}
            />
          </Box>

        </Stack>
      </Box>
    </Box>
  )
}
