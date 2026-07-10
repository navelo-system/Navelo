"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Icon } from "@/components/store/base/Icon"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Input } from "@/components/store/base/Input"
import { CartItem } from "@/components/store/intermediary/CartItem"
import { RemoveItemConfirmModal } from "@/components/store/sections/pdv/modals/RemoveItemConfirmModal"
import {
  DollarSign,
  Percent,
  QrCode,
  CreditCard,
  Users,
  Trash2,
  Pencil,
  Check,
  X
} from "lucide-react"

// Types
import { CartItemType } from "@/components/store/sections/pdv/pages/PdvSection"

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
  onEditPayment?: (idx: number, newAmount: number) => void
  onOpenChangeModal: () => void
  onOpenCardModal: () => void
  onFinalizeSale: () => void
  paymentAmountInput: string
  onChangePaymentAmountInput: (val: string) => void
  launchAmount: number
  onRemoveItem: (id: string) => void
  onIncreaseItem?: (id: string) => void
  onDecreaseItem?: (id: string) => void
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
  onEditPayment,
  onOpenChangeModal,
  onOpenCardModal,
  onFinalizeSale,
  paymentAmountInput,
  onChangePaymentAmountInput,
  launchAmount,
  onRemoveItem,
  onIncreaseItem,
  onDecreaseItem,
}) => {
  const [itemToRemove, setItemToRemove] = React.useState<CartItemType | null>(null)
  const [editingPaymentIdx, setEditingPaymentIdx] = React.useState<number | null>(null)
  const [editPaymentInput, setEditPaymentInput] = React.useState("")

  const startEditPayment = (idx: number, amount: number) => {
    setEditingPaymentIdx(idx)
    setEditPaymentInput(amount.toFixed(2).replace(".", ","))
  }

  const confirmEditPayment = () => {
    if (editingPaymentIdx !== null && onEditPayment) {
      const parsed = parseFloat(editPaymentInput.replace(",", "."))
      if (!isNaN(parsed) && parsed > 0) {
        onEditPayment(editingPaymentIdx, parsed)
      }
    }
    setEditingPaymentIdx(null)
    setEditPaymentInput("")
  }

  const cancelEditPayment = () => {
    setEditingPaymentIdx(null)
    setEditPaymentInput("")
  }

  return (
    <Grid cols={2} gap={5} className="flex-1 min-h-0">
      {/* Painel Esquerdo: Resumo do Pedido */}
      <Box bg="bg-surface" padding={5} radius="default" w="full" className="flex flex-col min-h-0">
        <Stack gap={5} className="flex-1 min-h-0">
          <Font variant="h3" text="Resumo da Conta" />
          <Box h="h-[2px]" bg="bg-border" w="full" />

          <Box flex="1" overflow="auto" padding={0} className="min-h-0">
            <Stack gap={2.5}>
              {cartItems.map((item, idx) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  quantity={item.quantity}
                  unitPrice={item.unitPrice}
                  image={item.image}
                  isLast={idx === cartItems.length - 1}
                  onIncrease={onIncreaseItem || (() => { })}
                  onDecrease={onDecreaseItem || (() => { })}
                  onRemove={() => setItemToRemove(item)}
                />
              ))}
            </Stack>
          </Box>

          <Box h="h-[2px]" bg="bg-border" w="full" shrink="0" />

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
      <Box bg="bg-surface" padding={5} radius="default" w="full" className="flex flex-col min-h-0">
        <Stack gap={5} className="flex-1 min-h-0">
          <Font variant="h3" text="Quitação de Valores" />
          <Box h="h-[2px]" bg="bg-border" w="full" shrink="0" />

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
          <Box flex="1" overflow="auto" padding={0} className="min-h-0">
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
                    {editingPaymentIdx === idx ? (
                      <Box display="block md:hidden" w="full">
                        <Stack gap={2.5} w="full">
                          <Stack direction="row" justify="between" align="center" w="full">
                            <Icon icon={DollarSign} variant="circular-success" />
                            <Stack direction="row" gap={2.5}>
                              <Button variant="outline-icon-xs" icon={Check} onClick={confirmEditPayment} />
                              <Button variant="danger-icon-xs" icon={X} onClick={cancelEditPayment} />
                            </Stack>
                          </Stack>
                          <Stack direction="row" justify="between" align="center" w="full">
                            <Font variant="body-bold" text={p.method} />
                            <Input value={editPaymentInput} onChange={(e) => setEditPaymentInput(e.target.value)} />
                          </Stack>
                        </Stack>
                      </Box>
                    ) : (
                      <Box display="block md:hidden" w="full">
                        <Stack gap={2.5} w="full">
                          <Stack direction="row" justify="between" align="center" w="full">
                            <Icon icon={DollarSign} variant="circular-success" />
                            <Stack direction="row" gap={2.5}>
                              <Button variant="outline-icon-xs" icon={Pencil} onClick={() => startEditPayment(idx, p.amount)} />
                              <Button variant="danger-icon-xs" icon={Trash2} onClick={() => onRemovePayment(idx)} />
                            </Stack>
                          </Stack>
                          <Stack direction="row" justify="between" align="center" w="full">
                            <Font variant="body-bold" text={p.method} />
                            <Font variant="body-bold" text={formatPrice(p.amount)} />
                          </Stack>
                        </Stack>
                      </Box>
                    )}

                    {/* Visualização Desktop: Lado a lado tradicional */}
                    {editingPaymentIdx === idx ? (
                      <Box display="hidden md:block" w="full">
                        <Stack direction="row" justify="between" align="center" w="full">
                          <Stack direction="row" align="center" gap={2.5}>
                            <Icon icon={DollarSign} variant="circular-success" />
                            <Font variant="body-bold" text={p.method} />
                          </Stack>
                          <Stack direction="row" align="center" gap={2.5}>
                            <Box w="w-24">
                              <Input value={editPaymentInput} onChange={(e) => setEditPaymentInput(e.target.value)} />
                            </Box>
                            <Button variant="outline-icon-xs" icon={Check} onClick={confirmEditPayment} />
                            <Button variant="danger-icon-xs" icon={X} onClick={cancelEditPayment} />
                          </Stack>
                        </Stack>
                      </Box>
                    ) : (
                      <Box display="hidden md:block" w="full">
                        <Stack direction="row" justify="between" align="center" w="full">
                          <Stack direction="row" align="center" gap={2.5}>
                            <Icon icon={DollarSign} variant="circular-success" />
                            <Font variant="body-bold" text={p.method} />
                          </Stack>
                          <Stack direction="row" align="center" gap={2.5}>
                            <Font variant="body-bold" text={formatPrice(p.amount)} />
                            <Button variant="outline-icon-xs" icon={Pencil} onClick={() => startEditPayment(idx, p.amount)} />
                            <Button variant="danger-icon-xs" icon={Trash2} onClick={() => onRemovePayment(idx)} />
                          </Stack>
                        </Stack>
                      </Box>
                    )}
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
            variant="success-lg"
            fullWidth
            label="Enter ou F9 - Finalizar Venda"
            disabled={amountDue > 0 || total === 0}
            onClick={onFinalizeSale}
          />
          {itemToRemove && (
            <RemoveItemConfirmModal
              isOpen={itemToRemove !== null}
              onClose={() => setItemToRemove(null)}
              productName={itemToRemove.name}
              onConfirm={() => {
                onRemoveItem(itemToRemove.id)
                setItemToRemove(null)
              }}
            />
          )}
        </Stack>
      </Box>
    </Grid>
  )
}
