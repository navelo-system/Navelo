"use client"

/* eslint-disable max-lines-per-function, complexity */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { Truck, Store, UserCheck, CreditCard, RefreshCw, Check } from "lucide-react"
import { Rider, DeliveryRate } from "@/lib/dal"

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

export const DeliveryCheckoutConfirmation: React.FC<DeliveryCheckoutConfirmationProps> = ({
  statusText = "Status do pedido: Aberto",
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
      rider,
      rate,
      paymentMoment,
    })
  }, [currentStatus, deliveryType, client, rider, rate, paymentMoment, onConfirmOrder])

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

  // APENAS Entrega e Retirada (Sem Consumo no local)
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
            )}
          </Stack>

          {/* 2. SEÇÃO TIPO DE ENTREGA (Design dos Cards identico ao Momento da cobranca com Sanfona Animada) */}
          <Stack gap={2.5} w="full">
            <Font variant="body-bold" text="* Tipo de entrega" />
            <Stack gap={2.5} w="full">
              {deliveryTypeOptions.map((opt) => {
                const isSelected = deliveryType === opt.id
                return (
                  <Stack key={opt.id} gap={2.5} w="full">
                    <Box
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

                    {/* SANFONA PARA SUB-SEÇÕES DE ENTREGA (CLIENTE, ENTREGADOR, TAXA) */}
                    {opt.id === "delivery" && isSelected && (
                      <Box padding={2.5} bg="surface-sunken" radius="default" w="full">
                        <Stack gap={5} w="full">
                          {/* CLIENTE */}
                          <Stack gap={2.5} w="full">
                            <Stack direction="row" justify="between" align="center" w="full">
                              <Font variant="body-bold" text="* Cliente" />
                              <Stack direction="row" gap={2.5} align="center">
                                {onAlterClient && (
                                  <Box cursor="pointer" onClick={onAlterClient}>
                                    <Font variant="sub-tiny-bold" color="primary" text="ALTERAR" />
                                  </Box>
                                )}
                                {onClearClient && (
                                  <Box cursor="pointer" onClick={onClearClient}>
                                    <Font variant="sub-tiny-bold" color="muted" text="LIMPAR" />
                                  </Box>
                                )}
                              </Stack>
                            </Stack>

                            <Box padding={0} w="full">
                              <Stack gap={1} w="full">
                                <Font variant="body-sm-medium" text={client.name || "Cliente não informado"} />
                                {client.phone && (
                                  <Font variant="body-sm-medium" color="muted" text={client.phone} />
                                )}
                                {client.address ? (
                                  <Font variant="body-sm-medium" color="muted" text={client.address} />
                                ) : (
                                  <Font variant="body-sm-medium" color="muted" text="Endereço não informado" />
                                )}
                              </Stack>
                            </Box>
                          </Stack>

                          {/* ENTREGADOR */}
                          <Stack gap={2.5} w="full">
                            <Stack direction="row" justify="between" align="center" w="full">
                              <Font variant="body-bold" text="Entregador" />
                              <Stack direction="row" gap={2.5} align="center">
                                {onSelectRider && (
                                  <Box cursor="pointer" onClick={onSelectRider}>
                                    <Font variant="sub-tiny-bold" color="primary" text={rider ? "ALTERAR" : "SELECIONAR"} />
                                  </Box>
                                )}
                                {rider && onClearRider && (
                                  <Box cursor="pointer" onClick={onClearRider}>
                                    <Font variant="sub-tiny-bold" color="muted" text="LIMPAR" />
                                  </Box>
                                )}
                              </Stack>
                            </Stack>

                            <Box padding={0} w="full">
                              <Font
                                variant="body-sm-medium"
                                color={rider ? "foreground" : "muted"}
                                text={rider ? rider.name : "Selecione um entregador"}
                              />
                            </Box>
                          </Stack>

                          {/* TAXA DE ENTREGA */}
                          <Stack gap={2.5} w="full">
                            <Stack direction="row" justify="between" align="center" w="full">
                              <Font variant="body-bold" text="Taxa de entrega" />
                              <Stack direction="row" gap={2.5} align="center">
                                {onSelectRate && (
                                  <Box cursor="pointer" onClick={onSelectRate}>
                                    <Font variant="sub-tiny-bold" color="primary" text={rate ? "ALTERAR" : "SELECIONAR"} />
                                  </Box>
                                )}
                                {rate && onClearRate && (
                                  <Box cursor="pointer" onClick={onClearRate}>
                                    <Font variant="sub-tiny-bold" color="muted" text="LIMPAR" />
                                  </Box>
                                )}
                              </Stack>
                            </Stack>

                            <Box padding={0} w="full">
                                  <Font
                                    variant="body-sm-medium"
                                    color={rate ? "foreground" : "muted"}
                                    text={
                                      rate
                                        ? `${rate.neighborhood} (R$ ${(rate.fee || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })})`
                                        : "Nenhuma taxa de entrega informada"
                                    }
                                  />
                                </Box>
                              </Stack>
                            </Stack>
                          </Box>
                        )}
                      </Stack>
                    )
              })}
            </Stack>
          </Stack>

          {/* 3. SEÇÃO MOMENTO DA COBRANÇA */}
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

          {/* 4. BOTÃO PRINCIPAL DE CONFIRMAÇÃO (F9) */}
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
