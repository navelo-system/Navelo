import React from 'react';
import { TableRow, TableCell } from '@/components/store/base/Table';
import { Badge } from '@/components/store/base/Badge';
import { Font } from '@/components/store/base/Font';
import { Stack } from '@/components/store/base/Stack';
import { StockMovement, StockMovementType } from '@/src/types/domain';

export interface StockMovementRowProps {
  movement: StockMovement;
  productName?: string;
}

const TYPE_MAP: Record<StockMovementType, { label: string; variant: 'success' | 'danger' | 'primary' }> = {
  [StockMovementType.IN]:         { label: 'Entrada',  variant: 'success' },
  [StockMovementType.OUT]:        { label: 'Saída',    variant: 'danger' },
  [StockMovementType.ADJUSTMENT]: { label: 'Ajuste',   variant: 'primary' },
};

export function StockMovementRow({ movement, productName }: StockMovementRowProps) {
  const { label, variant } = TYPE_MAP[movement.type];

  const date = new Date(movement.createdAt).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const qtyColor = movement.type === StockMovementType.IN
    ? 'success'
    : movement.type === StockMovementType.OUT
      ? 'danger'
      : 'primary';

  return (
    <TableRow>
      <TableCell>
        <Font variant="body" text={date} />
      </TableCell>
      <TableCell>
        <Font variant="body-medium" text={productName ?? movement.productId} />
      </TableCell>
      <TableCell>
        <Badge variant={variant} label={label} />
      </TableCell>
      <TableCell>
        <Stack direction="row" align="center" gap={1}>
          <Font
            variant="body-bold"
            color={qtyColor}
            text={`${movement.type === StockMovementType.OUT ? '-' : '+'}${movement.quantity}`}
          />
        </Stack>
      </TableCell>
      <TableCell>
        <Font variant="description" text={movement.reason ?? '—'} />
      </TableCell>
    </TableRow>
  );
}
