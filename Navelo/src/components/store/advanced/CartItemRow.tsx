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
            <Stack direction="row" align="center" gap={1}>
              {item.quantity > 1 ? (
                <Button variant="primary-icon-xs" icon={Minus} onClick={() => onDecrease?.(item)} />
              ) : (
                <Button variant="danger-icon-xs" icon={Trash2} onClick={() => onRemove?.(item)} />
              )}

              <Box w="fit-content" paddingX={1}>
                <Font variant="body-bold" text={item.quantity.toString()} />
              </Box>

              <Button variant="primary-icon-xs" icon={Plus} onClick={() => onIncrease?.(item)} />
            </Stack>

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
