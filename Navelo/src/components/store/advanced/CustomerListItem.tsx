import React from 'react';
import { TableRow, TableCell } from '@/components/store/base/Table';
import { Font } from '@/components/store/base/Font';
import { Button } from '@/components/store/base/Button';
import { Stack } from '@/components/store/base/Stack';
import { Edit2, Eye } from 'lucide-react';
import { Customer } from '@/src/types/domain';

export interface CustomerListItemProps {
  customer: Customer;
  onEdit?: (customer: Customer) => void;
  onView?: (customer: Customer) => void;
}

export function CustomerListItem({ customer, onEdit, onView }: CustomerListItemProps) {
  return (
    <TableRow>
      <TableCell>
        <Stack gap={1}>
          <Font variant="body-bold" text={customer.name} />
          <Font variant="auxiliary" color="muted" text={customer.email || 'Sem e-mail'} />
        </Stack>
      </TableCell>
      <TableCell>
        <Font variant="body" text={customer.document || '—'} />
      </TableCell>
      <TableCell>
        <Font variant="body" text={customer.phone || '—'} />
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" justify="end" gap={2.5}>
          <Button variant="outline-icon-xs" icon={Eye} onClick={() => onView?.(customer)} />
          <Button variant="outline-icon-xs" icon={Edit2} onClick={() => onEdit?.(customer)} />
        </Stack>
      </TableCell>
    </TableRow>
  );
}
