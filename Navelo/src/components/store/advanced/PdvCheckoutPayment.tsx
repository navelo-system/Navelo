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
import { Modal } from "@/components/store/base/Modal"
import { CartItem } from "@/components/store/intermediary/CartItem"
import { RemoveItemConfirmModal } from "@/components/store/sections/pdv/modals/RemoveItemConfirmModal"
import { DollarSign, QrCode, CreditCard, Users, Minus, Calendar, ShoppingCart } from "lucide-react"
import { UI_STRINGS } from "@/constants/strings"
import { CartItemType } from "@/components/store/sections/pdv/pages/PdvSection"
import { Numpad } from "@/components/store/intermediary/Numpad"
import { DatePickerModal } from "@/components/store/base/DatePickerModal"

export interface PdvPaymentItem {
  method: string
  amount: number
  dueDate?: string
  installment?: number
  totalInstallments?: number
}

interface PdvCheckoutPaymentProps {
  cartItems: CartItemType[]
  payments: PdvPaymentItem[]
  discount: number
  subtotal: number
  total: number
  totalPaid: number
  amountDue: number
  formatPrice: (value: number) => string
  onOpenDiscountModal: () => void
  onLaunchPayment: (method: string, amount: number) => void
  onRemovePayment: (idx: number) => void
  onEditPayment?: (idx: number, newAmount: number, newDueDate?: string) => void
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

function CrediarioActionMenu({
  onOpenEditValue,
  onOpenEditDueDate,
}: {
  onOpenEditValue: () => void
  onOpenEditDueDate: () => void
}) {
  const ch = UI_STRINGS.pdv.checkout
  return (
    <Box
      position="absolute"
      top="100%"
      left="20px"
      zIndex="50"
      bg="bg-surface"
      radius="default"
      shadow="default"
      border
      borderColor="border-border"
      padding={2.5}
      w="w-52"
      onClick={(e) => e.stopPropagation()}
    >
      <Stack gap={1} w="full">
        <Box
          padding={2.5}
          hoverBg="secondary/10"
          cursor="pointer"
          radius="default"
          onClick={onOpenEditValue}
        >
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={DollarSign} size={16} />
            <Font variant="body" text={ch.changeValueOption} />
          </Stack>
        </Box>
        <Box
          padding={2.5}
          hoverBg="secondary/10"
          cursor="pointer"
          radius="default"
          onClick={onOpenEditDueDate}
        >
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Calendar} size={16} />
            <Font variant="body" text={ch.changeDueDateOption} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

function PaymentRowItem({
  p,
  idx,
  formatPrice,
  onRemovePayment,
  onOpenEditValue,
  onOpenEditDueDate,
}: {
  p: PdvPaymentItem
  idx: number
  formatPrice: (v: number) => string
  onRemovePayment: (idx: number) => void
  onOpenEditValue: (idx: number) => void
  onOpenEditDueDate: (idx: number) => void
}) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const isCrediario = p.method === "Crediário"
  const displayName = isCrediario
    ? `Crediário ${p.installment || 1} / ${p.totalInstallments || 1}`
    : p.method

  return (
    <Box
      position="relative"
      padding={2.5}
      radius="default"
      border
      borderColor="border-border"
      bg="bg-surface"
      hoverBg="secondary/10"
      cursor={isCrediario ? "pointer" : undefined}
      onClick={() => isCrediario && setIsMenuOpen((prev) => !prev)}
      w="full"
    >
      <Stack direction="row" justify="between" align="center" w="full">
        <Stack gap={0} align="start">
          <Font variant="body" text={displayName} />
          {p.dueDate && (
            <Font variant="auxiliary" color="muted" text={p.dueDate} />
          )}
        </Stack>
        <Stack direction="row" align="center" gap={2.5}>
          <Font variant="body" text={formatPrice(p.amount)} />
          <Button
            variant="ghost"
            icon={Minus}
            onClick={(e) => {
              e.stopPropagation()
              onRemovePayment(idx)
            }}
          />
        </Stack>
      </Stack>

      {isMenuOpen && (
        <CrediarioActionMenu
          onOpenEditValue={() => {
            setIsMenuOpen(false)
            onOpenEditValue(idx)
          }}
          onOpenEditDueDate={() => {
            setIsMenuOpen(false)
            onOpenEditDueDate(idx)
          }}
        />
      )}
    </Box>
  )
}

function EditInstallmentValueModal({
  isOpen,
  initialValue,
  onClose,
  onConfirm,
}: {
  isOpen: boolean
  initialValue: number
  onClose: () => void
  onConfirm: (val: number) => void
}) {
  const ch = UI_STRINGS.pdv.checkout
  const [digits, setDigits] = React.useState("")
  const [prevIsOpen, setPrevIsOpen] = React.useState(isOpen)
  const [prevInitialValue, setPrevInitialValue] = React.useState(initialValue)

  if (isOpen !== prevIsOpen || initialValue !== prevInitialValue) {
    setPrevIsOpen(isOpen)
    setPrevInitialValue(initialValue)
    if (isOpen) {
      const cents = Math.round(initialValue * 100)
      setDigits(cents > 0 ? String(cents) : "")
    }
  }

  const handleKeyPress = (val: string) => {
    if (val === "back") {
      setDigits((prev) => prev.slice(0, -1))
      return
    }
    if (val === "00") {
      if (!digits) return
      setDigits((prev) => (prev.length <= 6 ? prev + "00" : prev))
      return
    }
    if (digits.length >= 8) return
    setDigits((prev) => prev + val)
  }

  const numericValue = digits ? parseFloat(digits) / 100 : 0
  const formattedValue = numericValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="numpad">
      <Box padding={5} w="full">
        <Stack gap={5} w="full">
          {/* Cabeçalho */}
          <Stack gap={1}>
            <Font variant="body-bold" text={ch.changeValueModalTitle} />
            <Font variant="description" color="muted" text={ch.changeValueModalSubtitle} />
          </Stack>

          {/* Valor em destaque */}
          <Stack gap={1} align="center" w="full">
            <Font variant="description" text={ch.installmentValueInputLabel} color="muted" align="center" />
            <Font variant="h1" text={`${UI_STRINGS.common.currencySymbol} ${formattedValue}`} color="primary" align="center" />
          </Stack>

          {/* Teclado */}
          <Numpad onKeyPress={handleKeyPress} variant="ghost" />

          {/* Rodapé */}
          <Stack direction="row" justify="end" align="center" gap={2.5} w="full">
            <Button variant="ghost" label={UI_STRINGS.common.cancel} onClick={onClose} />
            <Button
              variant="ghost-primary"
              label={UI_STRINGS.common.confirm}
              onClick={() => {
                if (numericValue > 0) {
                  onConfirm(numericValue)
                }
                onClose()
              }}
              disabled={numericValue <= 0}
            />
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )
}

function DesktopPaymentsList({
  payments,
  formatPrice,
  onRemovePayment,
  onEditPayment,
}: {
  payments: PdvPaymentItem[]
  formatPrice: (v: number) => string
  onRemovePayment: (idx: number) => void
  onEditPayment?: (idx: number, newAmount: number, newDueDate?: string) => void
}) {
  const ch = UI_STRINGS.pdv.checkout
  const [valueModalIdx, setValueModalIdx] = React.useState<number | null>(null)
  const [dateModalIdx, setDateModalIdx] = React.useState<number | null>(null)

  const handleSaveValue = (newValue: number) => {
    if (valueModalIdx !== null && onEditPayment) {
      onEditPayment(valueModalIdx, newValue, payments[valueModalIdx].dueDate)
    }
    setValueModalIdx(null)
  }

  const handleSaveDueDate = (formattedDate: string) => {
    if (dateModalIdx !== null && onEditPayment) {
      onEditPayment(dateModalIdx, payments[dateModalIdx].amount, formattedDate)
    }
    setDateModalIdx(null)
  }

  if (payments.length === 0) {
    return <EmptyState icon={DollarSign} title={ch.emptyPaymentsTitle} subtitle={ch.emptyPaymentsSubtitle} />
  }

  return (
    <Stack gap={2.5} w="full">
      {payments.map((p, idx) => (
        <PaymentRowItem
          key={idx}
          p={p}
          idx={idx}
          formatPrice={formatPrice}
          onRemovePayment={onRemovePayment}
          onOpenEditValue={(i) => setValueModalIdx(i)}
          onOpenEditDueDate={(i) => setDateModalIdx(i)}
        />
      ))}
      <EditInstallmentValueModal
        isOpen={valueModalIdx !== null}
        initialValue={valueModalIdx !== null ? payments[valueModalIdx]?.amount || 0 : 0}
        onClose={() => setValueModalIdx(null)}
        onConfirm={handleSaveValue}
      />
      <DatePickerModal
        isOpen={dateModalIdx !== null}
        onClose={() => setDateModalIdx(null)}
        initialDateString={dateModalIdx !== null ? payments[dateModalIdx]?.dueDate : undefined}
        onSelectDate={handleSaveDueDate}
      />
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
  const ch = UI_STRINGS.pdv.checkout
  if (cartItems.length === 0) {
    return <EmptyState icon={ShoppingCart} title={ch.emptyCartTitle} subtitle={ch.emptyCartSubtitle} />
  }

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
    <Box shrink="0" w="full">
      <Stack gap={2.5} w="full">
        <Box shrink="0" w="full">
          <Grid cols={4} gap={2.5}>
            <Button variant="outline" icon={DollarSign} label={ch.moneyOptionShort} disabled={amountDue <= 0} onClick={onOpenChangeModal} fullWidth />
            <Button variant="outline" icon={CreditCard} label={ch.cardOptionShort} disabled={amountDue <= 0} onClick={onOpenCardModal} fullWidth />
            <Button variant="outline" icon={Users} label={ch.creditOptionShort} disabled={amountDue <= 0} onClick={() => onLaunchPayment("Crediário", launchAmount)} fullWidth />
            <Button variant="outline" icon={QrCode} label={ch.pixOptionShort} disabled={amountDue <= 0} onClick={() => onLaunchPayment("Pix", launchAmount)} fullWidth />
          </Grid>
        </Box>
        <Box shrink="0" w="full">
          <Button variant="primary-lg" fullWidth label={ch.finalizeMobileButton} disabled={amountDue > 0 || total === 0} onClick={onFinalizeSale} />
        </Box>
      </Stack>
    </Box>
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
  onEditPayment,
  onOpenChangeModal,
  onOpenCardModal,
  onFinalizeSale,
  launchAmount,
  onIncreaseItem,
  onDecreaseItem,
  onRequestRemoveItem,
}: {
  cartItems: CartItemType[]
  payments: PdvPaymentItem[]
  discount: number
  subtotal: number
  total: number
  totalPaid: number
  amountDue: number
  formatPrice: (v: number) => string
  onLaunchPayment: (method: string, amount: number) => void
  onRemovePayment: (idx: number) => void
  onEditPayment?: (idx: number, newAmount: number, newDueDate?: string) => void
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
      <Stack gap={2.5} w="full" flex="1" minH="0" h="full" justify="between">
        <Box bg="bg-surface" padding={5} radius="default" w="full" flex="1" direction="col" overflow="hidden" minH="0" display="flex">
          <Stack gap={2.5} flex="1" minH="0" h="full" w="full" justify="between">
            <Stack gap={2.5} flex="1" minH="0" overflow="auto" w="full">
              <MobileCartItemsList
                cartItems={cartItems}
                onIncreaseItem={onIncreaseItem}
                onDecreaseItem={onDecreaseItem}
                onRequestRemoveItem={onRequestRemoveItem}
              />
              <Box h="h-[1px]" bg="bg-border" w="full" shrink="0" />
              <Box shrink="0" padding={0} maxH="96" overflow="auto" w="full">
                <DesktopPaymentsList payments={payments} formatPrice={formatPrice} onRemovePayment={onRemovePayment} onEditPayment={onEditPayment} />
              </Box>
            </Stack>
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
          {cartItems.length === 0 ? (
            <EmptyState icon={ShoppingCart} title={ch.emptyCartTitle} subtitle={ch.emptyCartSubtitle} />
          ) : (
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
          )}
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
  payments: PdvPaymentItem[]
  total: number
  totalPaid: number
  amountDue: number
  formatPrice: (v: number) => string
  onLaunchPayment: (method: string, amount: number) => void
  onRemovePayment: (idx: number) => void
  onEditPayment?: (idx: number, newAmount: number, newDueDate?: string) => void
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
    <Box w="full" flex="1" direction="col" minH="0" h="full" display="flex">
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
        onEditPayment={props.onEditPayment}
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
