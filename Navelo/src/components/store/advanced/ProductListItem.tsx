import React from 'react';
import { TableRow, TableCell } from '@/components/store/base/Table';
import { Badge } from '@/components/store/base/Badge';
import { Font } from '@/components/store/base/Font';
import { Button } from '@/components/store/base/Button';
import { Stack } from '@/components/store/base/Stack';
import { Edit2, Trash2 } from 'lucide-react';
import { Product } from '@/src/types/domain';

export interface ProductListItemProps {
  product: Product;
  categoryName?: string;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductListItem({ product, categoryName, onEdit, onDelete }: ProductListItemProps) {
  const isLowStock = product.stock < product.minStock;

  return (
    <TableRow>
      <TableCell fontWeight="bold">
        {product.name}
      </TableCell>
      <TableCell>
        <Font variant="description" text={categoryName || 'Sem Categoria'} />
      </TableCell>
      <TableCell>
        <Stack direction="row" align="center" gap={2.5}>
          <Font variant="body" color={isLowStock ? 'danger' : 'foreground'} text={`${product.stock} ${product.unitType}`} />
          {isLowStock && <Badge variant="danger" label="Baixo" />}
        </Stack>
      </TableCell>
      <TableCell>
        <Font variant="body-bold" color="primary" text={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.sellingPrice)} />
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" justify="end" gap={2.5}>
          <Button variant="outline-icon-xs" icon={Edit2} onClick={() => onEdit?.(product)} />
          <Button variant="danger-icon-xs" icon={Trash2} onClick={() => onDelete?.(product)} />
        </Stack>
      </TableCell>
    </TableRow>
  );
}
