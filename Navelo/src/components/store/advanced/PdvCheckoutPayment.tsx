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
  QrCode,
  CreditCard,
  Users,
  Pencil,
  Check,
  X,
  Minus
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
    <Box w="full" flex="1" direction="col" minH="0">
      {/* ================= VISUALIZAÇÃO MOBILE (NOVA REFERÊNCIA PRINT 2) ================= */}
      <Box display="flex md:hidden" direction="col" w="full" flex="1" overflow="hidden" minH="0" h="full">
        <Stack gap={2.5} w="full" flex="1" minH="0" h="full">
          {/* Card Superior Unificado */}
          <Box bg="bg-surface" padding={5} radius="default" w="full" flex="1" direction="col" overflow="hidden" minH="0">
            <Stack gap={2.5} flex="1" minH="0" h="full" w="full">
              {/* Lista de Produtos do Pedido com Scroll Interno (Flex-1) */}
              <Box flex="1" overflow="auto" padding={0} minH="0" w="full">
                <Stack gap={2.5} w="full">
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

              <Box h="h-[1px]" bg="bg-border" w="full" shrink="0" />

              {/* Lista de Pagamentos Lançados */}
              <Box shrink="0" padding={0} maxH="96" overflow="auto" w="full">
                {payments.length > 0 ? (
                  <Stack gap={2.5} w="full">
                    {payments.map((p, idx) => (
                      <Stack key={idx} direction="row" justify="between" align="center" w="full">
                        <Font variant="body" text={p.method} />
                        <Stack direction="row" align="center" gap={2.5}>
                          <Font variant="body" text={formatPrice(p.amount)} />
                          <Button
                            variant="ghost"
                            icon={Minus}
                            onClick={() => onRemovePayment(idx)}
                          />
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <EmptyState
                    variant="simple"
                    icon={DollarSign}
                    title="Nenhum pagamento lançado"
                  />
                )}
              </Box>

              <Box h="h-[1px]" bg="bg-border" w="full" shrink="0" />

              {/* Totalizadores Finais Alinhados na Base do Card */}
              <Box shrink="0" w="full">
                <Stack gap={1} w="full">
                  {/* Resumo da Venda */}
                  <Stack direction="row" justify="between" align="center">
                    <Font variant="description" color="muted" text="Subtotal" />
                    <Font variant="description" text={formatPrice(subtotal)} />
                  </Stack>

                  <Stack direction="row" justify="between" align="center">
                    <Font variant="description" color="muted" text="Desconto na venda" />
                    <Font variant="description" color={discount > 0 ? "danger" : "muted"} text={`- ${formatPrice(discount)}`} />
                  </Stack>

                  <Stack direction="row" justify="between" align="center">
                    <Font variant="body-bold" text="Total" />
                    <Font variant="body-bold" text={formatPrice(total)} />
                  </Stack>

                  <Box h="h-[1px]" bg="bg-border" w="full" />

                  {/* Situação do Pagamento */}
                  <Stack direction="row" justify="between" align="center">
                    <Font variant="description" color="muted" text="Total pago" />
                    <Font variant="body-bold" color="success" text={formatPrice(totalPaid)} />
                  </Stack>

                  <Stack direction="row" justify="between" align="center">
                    <Font variant="body-bold" text="Falta pagar" />
                    <Font variant="body-bold" color={amountDue > 0 ? "danger" : "muted"} text={formatPrice(amountDue)} />
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* Grade de 4 Métodos de Pagamento (Pílulas/Cards) */}
          <Box shrink="0">
            <Grid cols={4} gap={2.5}>
              <Button
                variant="outline"
                icon={DollarSign}
                label="D - Dinheiro"
                disabled={amountDue <= 0}
                onClick={onOpenChangeModal}
                fullWidth
              />

              <Button
                variant="outline"
                icon={CreditCard}
                label="C - Cartão"
                disabled={amountDue <= 0}
                onClick={onOpenCardModal}
                fullWidth
              />

              <Button
                variant="outline"
                icon={Users}
                label="N - Crediário"
                disabled={amountDue <= 0}
                onClick={() => onLaunchPayment("Crediário", launchAmount)}
                fullWidth
              />

              <Button
                variant="outline"
                icon={QrCode}
                label="P - Pix"
                disabled={amountDue <= 0}
                onClick={() => onLaunchPayment("Pix", launchAmount)}
                fullWidth
              />
            </Grid>
          </Box>

          {/* Botão de Finalização no Rodapé */}
          <Box shrink="0">
            <Button
              variant="primary-lg"
              fullWidth
              label="Enter ou F9 - Finalizar"
              disabled={amountDue > 0 || total === 0}
              onClick={onFinalizeSale}
            />
          </Box>
        </Stack>
      </Box>

      {/* ================= VISUALIZAÇÃO DESKTOP (TRADICIONAL 2 COLUNAS) ================= */}
      <Box display="hidden md:flex" w="full" flex="1" minH="0" h="full">
        <Grid cols={2} gap={5} flex="1" minH="0" h="full">
          {/* Painel Esquerdo: Resumo do Pedido */}
          <Box bg="bg-surface" padding={5} radius="default" w="full" direction="col" flex="1" minH="0" h="full">
            <Stack gap={5} flex="1" minH="0" h="full" justify="between">
              <Box shrink="0" w="full">
                <Stack gap={2.5} w="full">
                  <Font variant="h3" text="Resumo da Conta" />
                  <Box h="h-[2px]" bg="bg-border" w="full" />
                </Stack>
              </Box>

              <Box flex="1" overflow="auto" padding={0} minH="0">
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

              <Box shrink="0" w="full">
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
                </Stack>
              </Box>
            </Stack>
          </Box>

          {/* Painel Direito: Métodos de Pagamento e Lançamento */}
          <Box bg="bg-surface" padding={5} radius="default" w="full" direction="col" flex="1" minH="0" h="full">
            <Stack gap={5} flex="1" minH="0" h="full" justify="between">
              <Box shrink="0" w="full">
                <Stack gap={2.5} w="full">
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
                </Stack>
              </Box>

              {/* Pagamentos Lançados */}
              <Box flex="1" overflow="auto" padding={0} minH="0">
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
                        {editingPaymentIdx === idx ? (
                          <Box display="block" w="full">
                            <Stack direction="row" justify="between" align="center" w="full">
                              <Stack direction="row" align="center" gap={2.5}>
                                <Icon icon={DollarSign} variant="circular-success" />
                                <Font variant="body-bold" text={p.method} />
                              </Stack>
                              <Stack direction="row" align="center" gap={2.5}>
                                <Box w="w-24">
                                  <Input value={editPaymentInput} onChange={(e) => setEditPaymentInput(e.target.value)} />
                                </Box>
                                <Button variant="primary-icon-xs" icon={Check} onClick={confirmEditPayment} />
                                <Button variant="danger-icon-xs" icon={X} onClick={cancelEditPayment} />
                              </Stack>
                            </Stack>
                          </Box>
                        ) : (
                          <Box display="block" w="full">
                            <Stack direction="row" justify="between" align="center" w="full">
                              <Stack direction="row" align="center" gap={2.5}>
                                <Icon icon={DollarSign} variant="circular-success" />
                                <Font variant="body-bold" text={p.method} />
                              </Stack>
                              <Stack direction="row" align="center" gap={2.5}>
                                <Font variant="body-bold" text={formatPrice(p.amount)} />
                                <Button variant="primary-icon-xs" icon={Pencil} onClick={() => startEditPayment(idx, p.amount)} />
                                <Button
                                  variant="danger-icon-xs-confirm"
                                  confirmTitle="Remover Pagamento"
                                  confirmSubtitle="Confirmar remoção de pagamento"
                                  confirmParagraph="Tem certeza que deseja remover este lançamento de pagamento?"
                                  onConfirm={() => onRemovePayment(idx)}
                                />
                              </Stack>
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    ))
                  )}
                </Stack>
              </Box>

              {/* Seletor de Atalhos Rápidos e Finalização Grudados na Base */}
              <Box shrink="0" w="full">
                <Stack gap={5}>
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
                    variant="primary-lg"
                    fullWidth
                    label="Enter ou F9 - Finalizar Venda"
                    disabled={amountDue > 0 || total === 0}
                    onClick={onFinalizeSale}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Box>

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
    </Box>
  )
}
