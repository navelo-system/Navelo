import React from 'react';
import { TableRow, TableCell } from '@/components/store/base/Table';
import { Badge } from '@/components/store/base/Badge';
import { Font } from '@/components/store/base/Font';
import { Stack } from '@/components/store/base/Stack';
import { PaymentTransaction, PaymentMethod, PaymentStatus, TransactionType } from '@/src/types/domain';

export interface PaymentTransactionRowProps {
  transaction: PaymentTransaction;
}

const METHOD_LABEL: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]:         'Dinheiro',
  [PaymentMethod.CREDIT_CARD]:  'Crédito',
  [PaymentMethod.DEBIT_CARD]:   'Débito',
  [PaymentMethod.PIX]:          'Pix',
  [PaymentMethod.VOUCHER]:      'Voucher',
  [PaymentMethod.STORE_CREDIT]: 'Crédito Loja',
};

const STATUS_MAP: Record<PaymentStatus, { label: string; variant: 'success' | 'danger' | 'default' }> = {
  [PaymentStatus.PENDING]:  { label: 'Pendente',  variant: 'default' },
  [PaymentStatus.APPROVED]: { label: 'Aprovado',  variant: 'success' },
  [PaymentStatus.REJECTED]: { label: 'Rejeitado', variant: 'danger' },
};

const TYPE_MAP: Record<TransactionType, { label: string; color: 'success' | 'danger' | 'primary' }> = {
  [TransactionType.INCOME]:   { label: 'Receita',    color: 'success' },
  [TransactionType.EXPENSE]:  { label: 'Despesa',    color: 'danger' },
  [TransactionType.TRANSFER]: { label: 'Transf.',    color: 'primary' },
};

export function PaymentTransactionRow({ transaction }: PaymentTransactionRowProps) {
  const { label: statusLabel, variant: statusVariant } = STATUS_MAP[transaction.status];
  const { label: typeLabel, color: typeColor } = TYPE_MAP[transaction.type];

  const fmt = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <TableRow>
      <TableCell>
        <Font variant="body-xs-medium" color={typeColor} text={typeLabel} />
      </TableCell>
      <TableCell>
        <Font variant="body" text={METHOD_LABEL[transaction.method]} />
      </TableCell>
      <TableCell>
        <Stack direction="row" align="center" gap={2.5}>
          <Font variant="body-bold" text={fmt(transaction.amount)} />
          {transaction.installments > 1 && (
            <Font variant="auxiliary" color="muted" text={`${transaction.installments}x`} />
          )}
        </Stack>
      </TableCell>
      <TableCell>
        <Badge variant={statusVariant} label={statusLabel} />
      </TableCell>
    </TableRow>
  );
}
