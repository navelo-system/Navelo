import React from 'react';
import { TableRow, TableCell } from '@/components/store/base/Table';
import { Font } from '@/components/store/base/Font';
import { Button } from '@/components/store/base/Button';
import { Stack } from '@/components/store/base/Stack';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { ExternalLink, Download } from 'lucide-react';
import { Invoice, InvoiceType } from '@/src/types/domain';

export interface InvoiceListItemProps {
  invoice: Invoice;
  orderNumber?: number;
  onViewXml?: (invoice: Invoice) => void;
  onDownload?: (invoice: Invoice) => void;
}

const TYPE_LABEL: Record<InvoiceType, string> = {
  [InvoiceType.NFCE]: 'NFC-e',
  [InvoiceType.NFE]:  'NF-e',
};

export function InvoiceListItem({ invoice, orderNumber, onViewXml, onDownload }: InvoiceListItemProps) {
  return (
    <TableRow>
      <TableCell>
        <Font variant="body-medium" text={orderNumber ? `#${orderNumber}` : invoice.orderId.slice(-6).toUpperCase()} />
      </TableCell>
      <TableCell>
        <Font variant="body" text={TYPE_LABEL[invoice.type]} />
      </TableCell>
      <TableCell>
        <InvoiceStatusBadge status={invoice.status} />
      </TableCell>
      <TableCell>
        <Font
          variant="auxiliary"
          color="muted"
          text={invoice.accessKey ? `${invoice.accessKey.slice(0, 20)}...` : '—'}
        />
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" justify="end" gap={2.5}>
          {invoice.xmlUrl && (
            <Button variant="outline-icon-xs" icon={ExternalLink} onClick={() => onViewXml?.(invoice)} />
          )}
          <Button variant="outline-icon-xs" icon={Download} onClick={() => onDownload?.(invoice)} />
        </Stack>
      </TableCell>
    </TableRow>
  );
}
