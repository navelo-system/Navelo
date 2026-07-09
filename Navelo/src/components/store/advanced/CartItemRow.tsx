import React from 'react';
import { Box } from '@/components/store/base/Box';
import { Stack } from '@/components/store/base/Stack';
import { Font } from '@/components/store/base/Font';
import { Button } from '@/components/store/base/Button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { OrderItem } from '@/src/types/domain';

export interface CartItemRowProps {
  item: OrderItem;
  onIncrease?: (item: OrderItem) => void;
  onDecrease?: (item: OrderItem) => void;
  onRemove?: (item: OrderItem) => void;
}

export function CartItemRow({ item, onIncrease, onDecrease, onRemove }: CartItemRowProps) {
  return (
    <Box padding={2.5}>
      <Stack gap={2.5}>
        <Stack direction="row" justify="between" align="start" gap={2.5}>
          <Box flex="1" overflow="hidden">
            <Font variant="body-bold" text={item.productNameSnapshot} truncate />
          </Box>
          <Font
            variant="body-bold"
            text={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalPrice)}
          />
        </Stack>

        <Stack direction="row" justify="between" align="center" gap={5}>
          <Font
            variant="description"
            text={`${item.quantity}x ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}`}
          />

          <Stack direction="row" align="center" gap={2.5}>
            {item.quantity > 1 ? (
              <Button variant="outline-icon-xs" icon={Minus} onClick={() => onDecrease?.(item)} />
            ) : (
              <Button variant="outline-danger-icon-xs" icon={Trash2} onClick={() => onRemove?.(item)} />
            )}

            <Box w="fit-content" paddingX={2.5}>
              <Font variant="body-bold" text={item.quantity.toString()} />
            </Box>

            <Button variant="outline-icon-xs" icon={Plus} onClick={() => onIncrease?.(item)} />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
