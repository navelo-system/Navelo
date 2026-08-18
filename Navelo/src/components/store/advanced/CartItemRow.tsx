import React from 'react';
import { Box } from '@/components/store/base/Box';
import { Stack } from '@/components/store/base/Stack';
import { Font } from '@/components/store/base/Font';
import { QuantityControl } from '@/components/store/intermediary/QuantityControl';
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
      <Stack direction="row" justify="between" align="center" gap={2.5}>
        <Stack gap={1} flex="1" minW="0">
          <Font variant="body" text={item.productNameSnapshot} truncate />
          <Font
            variant="description"
            text={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.unitPrice)}
          />
        </Stack>

        <Box shrink="0">
          <Stack direction="col" align="end" gap={1}>
            <QuantityControl
              quantity={item.quantity}
              onIncrease={() => onIncrease?.(item)}
              onDecrease={() => onDecrease?.(item)}
              onRemove={() => onRemove?.(item)}
              stopPropagation={false}
            />

            <Font
              variant="body-bold"
              text={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalPrice)}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
