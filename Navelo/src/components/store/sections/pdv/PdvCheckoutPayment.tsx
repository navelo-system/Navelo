"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "../../base/Box"
import { Stack } from "../../base/Stack"
import { Grid } from "../../base/Grid"
import { Font } from "../../base/Font"
import { Button } from "../../base/Button"
import { Icon } from "../../base/Icon"
import { EmptyState } from "../../intermediary/EmptyState"
import { Input } from "../../base/Input"
import { Avatar } from "../../base/Avatar"
import { Modal } from "../../base/Modal"
import {
  DollarSign,
  Percent,
  QrCode,
  CreditCard,
  Users,
  Trash2
} from "lucide-react"

// Types
import { CartItemType } from "./PdvSection"

interface PdvCheckoutPaymentProps {
  cartItems: CartItemType[]
  payments: { method: string; amount: number }[]
  discount: number
  subtotal: number
  total: number
  totalPaid: number
  amountDue: number
  formatPrice: (value: number) => string
  onOpenDiscountModal: () => void
  onLaunchPayment: (method: string, amount: number) => void
  onRemovePayment: (idx: number) => void
  onOpenChangeModal: () => void
  onOpenCardModal: () => void
  onFinalizeSale: () => void
  paymentAmountInput: string
  onChangePaymentAmountInput: (val: string) => void
  launchAmount: number
  onRemoveItem: (id: string) => void
}

export const PdvCheckoutPayment: React.FC<PdvCheckoutPaymentProps> = ({
  cartItems,
  payments,
  discount,
  subtotal,
  total,
  totalPaid,
  amountDue,
  formatPrice,
  onOpenDiscountModal,
  onLaunchPayment,
  onRemovePayment,
  onOpenChangeModal,
  onOpenCardModal,
  onFinalizeSale,
  paymentAmountInput,
  onChangePaymentAmountInput,
  launchAmount,
  onRemoveItem,
}) => {
  const [itemToRemove, setItemToRemove] = React.useState<CartItemType | null>(null)

  return (
    <Grid cols={2} gap={5}>
      {/* Painel Esquerdo: Resumo do Pedido */}
      <Box bg="bg-surface" padding={5} radius="default" border={true} borderColor="border-border" w="full">
        <Stack gap={5}>
          <Font variant="h3" text="Resumo da Conta" />
          <Box h="h-[2px]" bg="bg-border" w="full" />

          <Box flex="1" overflow="auto" maxH="96" padding={0}>
            <Stack gap={2.5}>
              {cartItems.map((item) => (
                <Box key={item.id} padding={2.5} border={true} borderColor="border-border" radius="default">
                  <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" gap={2.5} className="md:gap-5 w-full">
                    {/* Lado Esquerdo: Avatar + Nome + Quantidade/Preço Unitário */}
                    <Stack direction="row" align="center" gap={5} flex="1" minW="0">
                      <Avatar image={item.image} fallback={item.name.substring(0, 2)} />
                      <Stack gap={1} w="full">
                        <Font variant="body-bold" text={item.name} align="left" />
                        <Font variant="auxiliary" color="muted" text={`${item.quantity} UN x ${formatPrice(item.unitPrice)}`} align="left" />
                      </Stack>
                    </Stack>

                    {/* Lado Direito: Preço Total + Botão Lixeira */}
                    <Stack direction="row" align="center" gap={5} justify="end" w="w-full md:w-auto">
                      <Font variant="body-bold" text={formatPrice(item.quantity * item.unitPrice)} />
                      <Button
                        variant="outline-danger-icon"
                        icon={Trash2}
                        onClick={() => setItemToRemove(item)}
                      />
                    </Stack>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box h="h-[2px]" bg="bg-border" w="full" />

          <Stack gap={2.5}>
            <Stack direction="row" justify="between" align="center">
              <Font variant="description" color="muted" text="Subtotal" />
              <Font variant="description" text={formatPrice(subtotal)} />
            </Stack>
            <Stack direction="row" justify="between" align="center">
              <Font variant="description" color="muted" text="Desconto" />
              <Font variant="description" color="danger" text={`-${formatPrice(discount)}`} />
            </Stack>
            <Stack direction="row" justify="between" align="center">
              <Font variant="body-bold" text="Total a Cobrar" />
              <Font variant="h3" color="success" text={formatPrice(total)} />
            </Stack>
            <Button
              variant="secondary"
              label="F6 - Aplicar Desconto"
              icon={Percent}
              onClick={onOpenDiscountModal}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Painel Direito: Métodos de Pagamento e Lançamento */}
      <Box bg="bg-surface" padding={5} radius="default" border={true} borderColor="border-border" w="full">
        <Stack gap={5}>
          <Font variant="h3" text="Quitação de Valores" />
          <Box h="h-[2px]" bg="bg-border" w="full" />

          {/* Totalizadores de Quitação */}
          <Grid cols={3} gap={2.5}>
            <Box padding={2.5} border={true} borderColor="border-border" radius="default">
              <Stack gap={1} align="center">
                <Font variant="sub-tiny" color="muted" text="Total" />
                <Font variant="body-bold" text={formatPrice(total)} />
              </Stack>
            </Box>
            <Box padding={2.5} border={true} borderColor="border-border" radius="default">
              <Stack gap={1} align="center">
                <Font variant="sub-tiny" color="muted" text="Total Pago" />
                <Font variant="body-bold" color="success" text={formatPrice(totalPaid)} />
              </Stack>
            </Box>
            <Box padding={2.5} border={true} borderColor="border-border" radius="default">
              <Stack gap={1} align="center">
                <Font variant="sub-tiny" color="muted" text="Restante" />
                <Font variant="body-bold" color={amountDue > 0 ? "danger" : "secondary"} text={formatPrice(amountDue)} />
              </Stack>
            </Box>
          </Grid>

          {/* Pagamentos Lançados */}
          <Box flex="1" overflow="auto" maxH="96" padding={0}>
            <Stack gap={2.5}>
              {payments.length === 0 ? (
                <EmptyState
                  icon={DollarSign}
                  title="Sem pagamentos"
                  subtitle="Nenhum pagamento lançado."
                />
              ) : (
                payments.map((p, idx) => (
                  <Box key={idx} padding={2.5} radius="default" border={true} borderColor="border-border">
                    {/* Visualização Mobile: Ícone e Lixeira em cima, Método e Valor embaixo */}
                    <Box display="block md:hidden" w="full">
                      <Stack gap={2.5} w="full">
                        <Stack direction="row" justify="between" align="center" w="full">
                          <Icon icon={DollarSign} variant="circular-success" />
                          <Button
                            variant="outline-danger-icon"
                            icon={Trash2}
                            onClick={() => onRemovePayment(idx)}
                          />
                        </Stack>
                        <Stack direction="row" justify="between" align="center" w="full">
                          <Font variant="body-bold" text={p.method} />
                          <Font variant="body-bold" text={formatPrice(p.amount)} />
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Visualização Desktop: Lado a lado tradicional */}
                    <Box display="hidden md:block" w="full">
                      <Stack direction="row" justify="between" align="center" w="full">
                        <Stack direction="row" align="center" gap={2.5}>
                          <Icon icon={DollarSign} variant="circular-success" />
                          <Font variant="body-bold" text={p.method} />
                        </Stack>
                        <Stack direction="row" align="center" gap={5}>
                          <Font variant="body-bold" text={formatPrice(p.amount)} />
                          <Button
                            variant="outline-danger-icon"
                            icon={Trash2}
                            onClick={() => onRemovePayment(idx)}
                          />
                        </Stack>
                      </Stack>
                    </Box>
                  </Box>
                ))
              )}
            </Stack>
          </Box>

          {/* Seletor de Atalhos Rápidos de Formas de Pagamento */}
          <Stack gap={2.5}>
            <Input
              label="Valor a Lançar (R$)"
              placeholder="0,00"
              value={paymentAmountInput}
              onChange={(e) => onChangePaymentAmountInput(e.target.value)}
            />
            <Font variant="body-bold" text="Lançar Forma de Pagamento" />
            <Grid cols={2} gap={2.5}>
              <Button
                variant="outline"
                label="Dinheiro (Troco)"
                icon={DollarSign}
                disabled={amountDue <= 0}
                onClick={onOpenChangeModal}
              />
              <Button
                variant="outline"
                label="Pix Instantâneo"
                icon={QrCode}
                disabled={amountDue <= 0}
                onClick={() => onLaunchPayment("Pix", launchAmount)}
              />
              <Button
                variant="outline"
                label="Crédito/Débito"
                icon={CreditCard}
                disabled={amountDue <= 0}
                onClick={onOpenCardModal}
              />
              <Button
                variant="outline"
                label="Crediário Fiado"
                icon={Users}
                disabled={amountDue <= 0}
                onClick={() => onLaunchPayment("Crediário", launchAmount)}
              />
            </Grid>
          </Stack>

          <Button
            variant="outline-success-lg"
            fullWidth
            label="Enter ou F9 - Finalizar Venda"
            disabled={amountDue > 0 || total === 0}
            onClick={onFinalizeSale}
          />
          {itemToRemove && (
            <Modal
              isOpen={itemToRemove !== null}
              onClose={() => setItemToRemove(null)}
              title="Remover Item"
              subtitle={`Deseja realmente remover o produto "${itemToRemove.name}" do carrinho?`}
              icon={Trash2}
              successText="Remover"
              onSuccess={() => {
                onRemoveItem(itemToRemove.id)
                setItemToRemove(null)
              }}
            >
              <Font variant="description" text="Esta ação removerá o produto desta venda e recalculará o total da conta." />
            </Modal>
          )}
        </Stack>
      </Box>
    </Grid>
  )
}
