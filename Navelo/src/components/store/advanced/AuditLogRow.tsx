import React from 'react';
import { TableRow, TableCell } from '@/components/store/base/Table';
import { Font } from '@/components/store/base/Font';
import { AuditLog } from '@/src/types/domain';

export interface AuditLogRowProps {
  log: AuditLog;
  userName?: string;
}

export function AuditLogRow({ log, userName }: AuditLogRowProps) {
  const date = new Date(log.createdAt).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <TableRow>
      <TableCell>
        <Font variant="auxiliary" color="muted" text={date} />
      </TableCell>
      <TableCell>
        <Font variant="body-medium" text={userName ?? log.userId.slice(-8)} />
      </TableCell>
      <TableCell>
        <Font variant="body" text={log.action} />
      </TableCell>
      <TableCell>
        <Font variant="description" text={log.entityType} />
      </TableCell>
      <TableCell>
        <Font
          variant="auxiliary"
          color="muted"
          text={log.ipAddress ?? '—'}
        />
      </TableCell>
    </TableRow>
  );
}
