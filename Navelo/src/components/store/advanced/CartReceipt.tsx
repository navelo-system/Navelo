import React from 'react';
import { Box } from '@/components/store/base/Box';
import { Stack } from '@/components/store/base/Stack';
import { Font } from '@/components/store/base/Font';
import { Button } from '@/components/store/base/Button';
import { EmptyState } from '@/components/store/intermediary/EmptyState';
import { Icon } from '@/components/store/base/Icon';
import { CartItemRow } from './CartItemRow';
import { User, Tag, ShoppingCart } from 'lucide-react';
import { Order, OrderItem } from '@/src/types/domain';

export interface CartReceiptProps {
  order: Order;
  items: OrderItem[];
  customerName?: string;
  onAddCustomer?: () => void;
  onApplyDiscount?: () => void;
  onCheckout?: () => void;
  onItemIncrease?: (item: OrderItem) => void;
  onItemDecrease?: (item: OrderItem) => void;
  onItemRemove?: (item: OrderItem) => void;
}

// eslint-disable-next-line max-lines-per-function
export function CartReceipt({
  order,
  items,
  customerName,
  onAddCustomer,
  onApplyDiscount,
  onCheckout,
  onItemIncrease,
  onItemDecrease,
  onItemRemove,
}: CartReceiptProps) {
  const fmt = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <Stack gap={0} h="full">
      {/* Customer row */}
      <Box padding={5}>
        {customerName ? (
          <Stack direction="row" align="center" justify="between" gap={2.5}>
            <Stack direction="row" align="center" gap={2.5}>
              <Box padding={1} bg="bg-brand-primary/10" radius="full">
                <Icon icon={User} size={16} color="primary" />
              </Box>
              <Font variant="body-medium" text={customerName} />
            </Stack>
            <Button variant="ghost" label="Trocar" onClick={onAddCustomer} />
          </Stack>
        ) : (
          <Button
            variant="outline"
            icon={User}
            label="Vincular Cliente"
            fullWidth
            onClick={onAddCustomer}
          />
        )}
      </Box>
      <Box h="h-[2px]" w="full" bg="bg-border" />

      {/* Items list */}
      <Box flex="1" overflow="x-hidden y-auto">
        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Carrinho vazio"
            subtitle="Adicione itens para iniciar o pedido."
          />
        ) : (
          items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onIncrease={onItemIncrease}
              onDecrease={onItemDecrease}
              onRemove={onItemRemove}
            />
          ))
        )}
      </Box>
      <Box h="h-[2px]" w="full" bg="bg-border" />

      {/* Totals */}
      <Box padding={5}>
        <Stack gap={2.5}>
          <Stack direction="row" justify="between" align="center" gap={2.5}>
            <Font variant="description" text="Subtotal" />
            <Font variant="body" text={fmt(order.subtotal)} />
          </Stack>

          {order.discountAmount > 0 && (
            <Stack direction="row" justify="between" align="center" gap={2.5}>
              <Font variant="description" text="Desconto" />
              <Font variant="body" color="success" text={`- ${fmt(order.discountAmount)}`} />
            </Stack>
          )}

          {order.serviceFee > 0 && (
            <Stack direction="row" justify="between" align="center" gap={2.5}>
              <Font variant="description" text="Taxa de serviço" />
              <Font variant="body" text={fmt(order.serviceFee)} />
            </Stack>
          )}

          <Stack direction="row" justify="between" align="center" gap={2.5}>
            <Font variant="body-bold" text="Total" />
            <Font variant="h4" color="primary" text={fmt(order.total)} />
          </Stack>
        </Stack>
      </Box>
      <Box h="h-[2px]" w="full" bg="bg-border" />

      {/* Actions */}
      <Box paddingX={5} paddingY={2.5}>
        <Stack gap={2.5}>
          <Button
            variant="outline"
            icon={Tag}
            label="Aplicar Desconto"
            fullWidth
            onClick={onApplyDiscount}
          />
          <Button
            variant="outline-success"
            icon={ShoppingCart}
            label="Cobrar"
            fullWidth
            onClick={onCheckout}
          />
        </Stack>
      </Box>
    </Stack>
  );
}
