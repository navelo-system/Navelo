import React from 'react';
import { Badge } from '@/components/store/base/Badge';
import { InvoiceStatus } from '@/src/types/domain';

export interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

const STATUS_MAP: Record<InvoiceStatus, { label: string; variant: 'success' | 'danger' | 'default' | 'primary' }> = {
  [InvoiceStatus.ISSUED]:      { label: 'Emitida',      variant: 'success' },
  [InvoiceStatus.CONTINGENCY]: { label: 'Contingência', variant: 'default' },
  [InvoiceStatus.CANCELLED]:   { label: 'Cancelada',    variant: 'danger' },
  [InvoiceStatus.REJECTED]:    { label: 'Rejeitada',    variant: 'danger' },
};

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const { label, variant } = STATUS_MAP[status] ?? { label: status, variant: 'default' };
  return <Badge variant={variant} label={label} />;
}
