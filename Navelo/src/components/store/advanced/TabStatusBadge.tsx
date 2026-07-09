import React from 'react';
import { Badge } from '@/components/store/base/Badge';
import { TabStatus } from '@/src/types/domain';

export interface TabStatusBadgeProps {
  status: TabStatus;
}

const STATUS_MAP: Record<TabStatus, { label: string; variant: 'success' | 'secondary' | 'danger' | 'primary' | 'default' }> = {
  [TabStatus.FREE]:            { label: 'Livre',              variant: 'success' },
  [TabStatus.OCCUPIED]:        { label: 'Ocupada',            variant: 'secondary' },
  [TabStatus.BILL_REQUESTED]:  { label: 'Conta Solicitada',   variant: 'danger' },
  [TabStatus.PAYING]:          { label: 'Pagando',            variant: 'primary' },
};

export function TabStatusBadge({ status }: TabStatusBadgeProps) {
  const { label, variant } = STATUS_MAP[status] ?? { label: status, variant: 'default' };
  return <Badge variant={variant} label={label} />;
}
