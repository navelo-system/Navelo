"use client"

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
import { DollarSign, QrCode, CreditCard, Users, Pencil, Check, X, Minus } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
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

function MobilePaymentsList({
  payments,
  formatPrice,
  onRemovePayment,
}: {
  payments: { method: string; amount: number }[]
  formatPrice: (v: number) => string
  onRemovePayment: (idx: number) => void
}) {
  const ch = UI_STRINGS.pdv.checkout
  if (payments.length === 0) {
    return <EmptyState variant="simple" icon={DollarSign} title={ch.noPaymentsTitle} />
  }
  return (
    <Stack gap={2.5} w="full">
      {payments.map((p, idx) => (
        <Stack key={idx} direction="row" justify="between" align="center" w="full">
          <Font variant="body" text={p.method} />
          <Stack direction="row" align="center" gap={2.5}>
            <Font variant="body" text={formatPrice(p.amount)} />
            <Button variant="ghost" icon={Minus} onClick={() => onRemovePayment(idx)} />
          </Stack>
        </Stack>
      ))}
    </Stack>
  )
}

function MobileCartItemsList({
  cartItems,
  onIncreaseItem,
  onDecreaseItem,
  onRequestRemoveItem,
}: {
  cartItems: CartItemType[]
  onIncreaseItem?: (id: string) => void
  onDecreaseItem?: (id: string) => void
  onRequestRemoveItem: (item: CartItemType) => void
}) {
  return (
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
            onIncrease={onIncreaseItem || (() => {})}
            onDecrease={onDecreaseItem || (() => {})}
            onRemove={() => onRequestRemoveItem(item)}
          />
        ))}
      </Stack>
    </Box>
  )
}

function MobileTotalsSummary({
  subtotal,
  discount,
  total,
  totalPaid,
  amountDue,
  formatPrice,
}: {
  subtotal: number
  discount: number
  total: number
  totalPaid: number
  amountDue: number
  formatPrice: (v: number) => string
}) {
  const ch = UI_STRINGS.pdv.checkout
  return (
    <Stack gap={1} w="full">
      <Stack direction="row" justify="between" align="center">
        <Font variant="description" color="muted" text={ch.subtotal} />
        <Font variant="description" text={formatPrice(subtotal)} />
      </Stack>
      <Stack direction="row" justify="between" align="center">
        <Font variant="description" color="muted" text={ch.discountOnSale} />
        <Font variant="description" color={discount > 0 ? "danger" : "muted"} text={`- ${formatPrice(discount)}`} />
      </Stack>
      <Stack direction="row" justify="between" align="center">
        <Font variant="body-bold" text={ch.total} />
        <Font variant="body-bold" text={formatPrice(total)} />
      </Stack>
      <Box h="h-[1px]" bg="bg-border" w="full" />
      <Stack direction="row" justify="between" align="center">
        <Font variant="description" color="muted" text={ch.totalPaid} />
        <Font variant="body-bold" color="success" text={formatPrice(totalPaid)} />
      </Stack>
      <Stack direction="row" justify="between" align="center">
        <Font variant="body-bold" text={ch.amountDue} />
        <Font variant="body-bold" color={amountDue > 0 ? "danger" : "muted"} text={formatPrice(amountDue)} />
      </Stack>
    </Stack>
  )
}

function MobilePaymentActions({
  amountDue,
  total,
  launchAmount,
  onOpenChangeModal,
  onOpenCardModal,
  onLaunchPayment,
  onFinalizeSale,
}: {
  amountDue: number
  total: number
  launchAmount: number
  onOpenChangeModal: () => void
  onOpenCardModal: () => void
  onLaunchPayment: (method: string, amount: number) => void
  onFinalizeSale: () => void
}) {
  const ch = UI_STRINGS.pdv.checkout
  return (
    <>
      <Box shrink="0">
        <Grid cols={4} gap={2.5}>
          <Button variant="outline" icon={DollarSign} label={ch.moneyOptionShort} disabled={amountDue <= 0} onClick={onOpenChangeModal} fullWidth />
          <Button variant="outline" icon={CreditCard} label={ch.cardOptionShort} disabled={amountDue <= 0} onClick={onOpenCardModal} fullWidth />
          <Button variant="outline" icon={Users} label={ch.creditOptionShort} disabled={amountDue <= 0} onClick={() => onLaunchPayment("Crediário", launchAmount)} fullWidth />
          <Button variant="outline" icon={QrCode} label={ch.pixOptionShort} disabled={amountDue <= 0} onClick={() => onLaunchPayment("Pix", launchAmount)} fullWidth />
        </Grid>
      </Box>
      <Box shrink="0">
        <Button variant="primary-lg" fullWidth label={ch.finalizeMobileButton} disabled={amountDue > 0 || total === 0} onClick={onFinalizeSale} />
      </Box>
    </>
  )
}

function CheckoutMobileView({
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
  onOpenChangeModal,
  onOpenCardModal,
  onFinalizeSale,
  launchAmount,
  onIncreaseItem,
  onDecreaseItem,
  onRequestRemoveItem,
}: {
  cartItems: CartItemType[]
  payments: { method: string; amount: number }[]
  discount: number
  subtotal: number
  total: number
  totalPaid: number
  amountDue: number
  formatPrice: (v: number) => string
  onLaunchPayment: (method: string, amount: number) => void
  onRemovePayment: (idx: number) => void
  onOpenChangeModal: () => void
  onOpenCardModal: () => void
  onFinalizeSale: () => void
  launchAmount: number
  onIncreaseItem?: (id: string) => void
  onDecreaseItem?: (id: string) => void
  onRequestRemoveItem: (item: CartItemType) => void
}) {
  return (
    <Box display="flex md:hidden" direction="col" w="full" flex="1" overflow="hidden" minH="0" h="full">
      <Stack gap={2.5} w="full" flex="1" minH="0" h="full">
        <Box bg="bg-surface" padding={5} radius="default" w="full" flex="1" direction="col" overflow="hidden" minH="0">
          <Stack gap={2.5} flex="1" minH="0" h="full" w="full">
            <MobileCartItemsList
              cartItems={cartItems}
              onIncreaseItem={onIncreaseItem}
              onDecreaseItem={onDecreaseItem}
              onRequestRemoveItem={onRequestRemoveItem}
            />
            <Box h="h-[1px]" bg="bg-border" w="full" shrink="0" />
            <Box shrink="0" padding={0} maxH="96" overflow="auto" w="full">
              <MobilePaymentsList payments={payments} formatPrice={formatPrice} onRemovePayment={onRemovePayment} />
            </Box>
            <Box h="h-[1px]" bg="bg-border" w="full" shrink="0" />
            <Box shrink="0" w="full">
              <MobileTotalsSummary subtotal={subtotal} discount={discount} total={total} totalPaid={totalPaid} amountDue={amountDue} formatPrice={formatPrice} />
            </Box>
          </Stack>
        </Box>
        <MobilePaymentActions
          amountDue={amountDue}
          total={total}
          launchAmount={launchAmount}
          onOpenChangeModal={onOpenChangeModal}
          onOpenCardModal={onOpenCardModal}
          onLaunchPayment={onLaunchPayment}
          onFinalizeSale={onFinalizeSale}
        />
      </Stack>
    </Box>
  )
}

function CheckoutDesktopSummary({
  cartItems,
  discount,
  subtotal,
  total,
  formatPrice,
  onIncreaseItem,
  onDecreaseItem,
  onRequestRemoveItem,
}: {
  cartItems: CartItemType[]
  discount: number
  subtotal: number
  total: number
  formatPrice: (v: number) => string
  onIncreaseItem?: (id: string) => void
  onDecreaseItem?: (id: string) => void
  onRequestRemoveItem: (item: CartItemType) => void
}) {
  const ch = UI_STRINGS.pdv.checkout
  return (
    <Box bg="bg-surface" padding={5} radius="default" w="full" direction="col" flex="1" minH="0" h="full">
      <Stack gap={5} flex="1" minH="0" h="full" justify="between">
        <Box shrink="0" w="full">
          <Stack gap={2.5} w="full">
            <Font variant="h3" text={ch.accountSummaryTitle} />
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
                onIncrease={onIncreaseItem || (() => {})}
                onDecrease={onDecreaseItem || (() => {})}
                onRemove={() => onRequestRemoveItem(item)}
              />
            ))}
          </Stack>
        </Box>
        <Box h="h-[2px]" bg="bg-border" w="full" shrink="0" />
        <Box shrink="0" w="full">
          <Stack gap={2.5}>
            <Stack direction="row" justify="between" align="center">
              <Font variant="description" color="muted" text={ch.subtotal} />
              <Font variant="description" text={formatPrice(subtotal)} />
            </Stack>
            <Stack direction="row" justify="between" align="center">
              <Font variant="description" color="muted" text={ch.discount} />
              <Font variant="description" color="danger" text={`-${formatPrice(discount)}`} />
            </Stack>
            <Stack direction="row" justify="between" align="center">
              <Font variant="body-bold" text={ch.totalToCharge} />
              <Font variant="h3" color="success" text={formatPrice(total)} />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

function DesktopSettlementHeader({
  total,
  totalPaid,
  amountDue,
  formatPrice,
}: {
  total: number
  totalPaid: number
  amountDue: number
  formatPrice: (v: number) => string
}) {
  const ch = UI_STRINGS.pdv.checkout
  return (
    <Box shrink="0" w="full">
      <Stack gap={2.5} w="full">
        <Font variant="h3" text={ch.settlementTitle} />
        <Box h="h-[2px]" bg="bg-border" w="full" shrink="0" />
        <Grid cols={3} gap={2.5}>
          <Box padding={2.5} border borderColor="border-border" radius="default">
            <Stack gap={1} align="center">
              <Font variant="sub-tiny" color="muted" text={ch.settlementTotal} />
              <Font variant="body-bold" text={formatPrice(total)} />
            </Stack>
          </Box>
          <Box padding={2.5} border borderColor="border-border" radius="default">
            <Stack gap={1} align="center">
              <Font variant="sub-tiny" color="muted" text={ch.settlementTotalPaid} />
              <Font variant="body-bold" color="success" text={formatPrice(totalPaid)} />
            </Stack>
          </Box>
          <Box padding={2.5} border borderColor="border-border" radius="default">
            <Stack gap={1} align="center">
              <Font variant="sub-tiny" color="muted" text={ch.settlementRemaining} />
              <Font variant="body-bold" color={amountDue > 0 ? "danger" : "secondary"} text={formatPrice(amountDue)} />
            </Stack>
          </Box>
        </Grid>
      </Stack>
    </Box>
  )
}

function DesktopPaymentsList({
  payments,
  formatPrice,
  onRemovePayment,
  onEditPayment,
}: {
  payments: { method: string; amount: number }[]
  formatPrice: (v: number) => string
  onRemovePayment: (idx: number) => void
  onEditPayment?: (idx: number, newAmount: number) => void
}) {
  const ch = UI_STRINGS.pdv.checkout
  const [editingIdx, setEditingIdx] = React.useState<number | null>(null)
  const [editInput, setEditInput] = React.useState("")

  const confirmEdit = () => {
    if (editingIdx !== null && onEditPayment) {
      const parsed = parseFloat(editInput.replace(",", "."))
      if (!isNaN(parsed) && parsed > 0) onEditPayment(editingIdx, parsed)
    }
    setEditingIdx(null)
    setEditInput("")
  }

  if (payments.length === 0) {
    return <EmptyState icon={DollarSign} title={ch.emptyPaymentsTitle} subtitle={ch.emptyPaymentsSubtitle} />
  }

  return (
    <Stack gap={2.5}>
      {payments.map((p, idx) => (
        <Box key={idx} padding={2.5} radius="default" border borderColor="border-border">
          {editingIdx === idx ? (
            <Stack direction="row" justify="between" align="center" w="full">
              <Stack direction="row" align="center" gap={2.5}>
                <Icon icon={DollarSign} variant="circular-success" />
                <Font variant="body-bold" text={p.method} />
              </Stack>
              <Stack direction="row" align="center" gap={2.5}>
                <Box w="w-24">
                  <Input value={editInput} onChange={(e) => setEditInput(e.target.value)} />
                </Box>
                <Button variant="primary-icon-xs" icon={Check} onClick={confirmEdit} />
                <Button variant="danger-icon-xs" icon={X} onClick={() => setEditingIdx(null)} />
              </Stack>
            </Stack>
          ) : (
            <Stack direction="row" justify="between" align="center" w="full">
              <Stack direction="row" align="center" gap={2.5}>
                <Icon icon={DollarSign} variant="circular-success" />
                <Font variant="body-bold" text={p.method} />
              </Stack>
              <Stack direction="row" align="center" gap={2.5}>
                <Font variant="body-bold" text={formatPrice(p.amount)} />
                <Button variant="primary-icon-xs" icon={Pencil} onClick={() => {
                  setEditingIdx(idx)
                  setEditInput(p.amount.toFixed(2).replace(".", ","))
                }} />
                <Button
                  variant="danger-icon-xs-confirm"
                  confirmTitle={ch.removePaymentTitle}
                  confirmSubtitle={ch.removePaymentSubtitle}
                  confirmParagraph={ch.removePaymentParagraph}
                  onConfirm={() => onRemovePayment(idx)}
                />
              </Stack>
            </Stack>
          )}
        </Box>
      ))}
    </Stack>
  )
}

function CheckoutDesktopSettlement({
  payments,
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
}: {
  payments: { method: string; amount: number }[]
  total: number
  totalPaid: number
  amountDue: number
  formatPrice: (v: number) => string
  onLaunchPayment: (method: string, amount: number) => void
  onRemovePayment: (idx: number) => void
  onEditPayment?: (idx: number, newAmount: number) => void
  onOpenChangeModal: () => void
  onOpenCardModal: () => void
  onFinalizeSale: () => void
  paymentAmountInput: string
  onChangePaymentAmountInput: (val: string) => void
  launchAmount: number
}) {
  const ch = UI_STRINGS.pdv.checkout
  return (
    <Box bg="bg-surface" padding={5} radius="default" w="full" direction="col" flex="1" minH="0" h="full">
      <Stack gap={5} flex="1" minH="0" h="full" justify="between">
        <DesktopSettlementHeader total={total} totalPaid={totalPaid} amountDue={amountDue} formatPrice={formatPrice} />
        <Box flex="1" overflow="auto" padding={0} minH="0">
          <DesktopPaymentsList payments={payments} formatPrice={formatPrice} onRemovePayment={onRemovePayment} onEditPayment={onEditPayment} />
        </Box>
        <Box shrink="0" w="full">
          <Stack gap={5}>
            <Stack gap={2.5}>
              <Input
                mask="currency"
                label={ch.amountToLaunchLabel}
                placeholder={UI_STRINGS.common.currencyPlaceholder}
                value={paymentAmountInput}
                onChange={(e) => onChangePaymentAmountInput(e.target.value)}
              />
              <Font variant="body-bold" text={ch.launchPaymentMethodTitle} />
              <Grid cols={2} gap={2.5}>
                <Button variant="outline" label={ch.cashChangeOption} icon={DollarSign} disabled={amountDue <= 0} onClick={onOpenChangeModal} />
                <Button variant="outline" label={ch.pixInstantOption} icon={QrCode} disabled={amountDue <= 0} onClick={() => onLaunchPayment("Pix", launchAmount)} />
                <Button variant="outline" label={ch.creditDebitOption} icon={CreditCard} disabled={amountDue <= 0} onClick={onOpenCardModal} />
                <Button variant="outline" label={ch.crediarioOption} icon={Users} disabled={amountDue <= 0} onClick={() => onLaunchPayment("Crediário", launchAmount)} />
              </Grid>
            </Stack>
            <Button variant="primary-lg" fullWidth label={ch.finalizeSaleButton} disabled={amountDue > 0 || total === 0} onClick={onFinalizeSale} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

export function PdvCheckoutPayment(props: PdvCheckoutPaymentProps) {
  const [itemToRemove, setItemToRemove] = React.useState<CartItemType | null>(null)

  return (
    <Box w="full" flex="1" direction="col" minH="0">
      <CheckoutMobileView
        cartItems={props.cartItems}
        payments={props.payments}
        discount={props.discount}
        subtotal={props.subtotal}
        total={props.total}
        totalPaid={props.totalPaid}
        amountDue={props.amountDue}
        formatPrice={props.formatPrice}
        onLaunchPayment={props.onLaunchPayment}
        onRemovePayment={props.onRemovePayment}
        onOpenChangeModal={props.onOpenChangeModal}
        onOpenCardModal={props.onOpenCardModal}
        onFinalizeSale={props.onFinalizeSale}
        launchAmount={props.launchAmount}
        onIncreaseItem={props.onIncreaseItem}
        onDecreaseItem={props.onDecreaseItem}
        onRequestRemoveItem={(item) => setItemToRemove(item)}
      />

      <Box display="hidden md:flex" w="full" flex="1" minH="0" h="full">
        <Grid cols={2} gap={5} flex="1" minH="0" h="full">
          <CheckoutDesktopSummary
            cartItems={props.cartItems}
            discount={props.discount}
            subtotal={props.subtotal}
            total={props.total}
            formatPrice={props.formatPrice}
            onIncreaseItem={props.onIncreaseItem}
            onDecreaseItem={props.onDecreaseItem}
            onRequestRemoveItem={(item) => setItemToRemove(item)}
          />
          <CheckoutDesktopSettlement
            payments={props.payments}
            total={props.total}
            totalPaid={props.totalPaid}
            amountDue={props.amountDue}
            formatPrice={props.formatPrice}
            onLaunchPayment={props.onLaunchPayment}
            onRemovePayment={props.onRemovePayment}
            onEditPayment={props.onEditPayment}
            onOpenChangeModal={props.onOpenChangeModal}
            onOpenCardModal={props.onOpenCardModal}
            onFinalizeSale={props.onFinalizeSale}
            paymentAmountInput={props.paymentAmountInput}
            onChangePaymentAmountInput={props.onChangePaymentAmountInput}
            launchAmount={props.launchAmount}
          />
        </Grid>
      </Box>

      {itemToRemove && (
        <RemoveItemConfirmModal
          isOpen={itemToRemove !== null}
          onClose={() => setItemToRemove(null)}
          productName={itemToRemove.name}
          onConfirm={() => {
            props.onRemoveItem(itemToRemove.id)
            setItemToRemove(null)
          }}
        />
      )}
    </Box>
  )
}
