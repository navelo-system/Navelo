import React from 'react';
import { Box } from '@/components/store/base/Box';
import { Stack } from '@/components/store/base/Stack';
import { Font } from '@/components/store/base/Font';
import { Badge } from '@/components/store/base/Badge';
import { Button } from '@/components/store/base/Button';
import { Icon } from '@/components/store/base/Icon';
import { CheckCircle, ChefHat, Waves } from 'lucide-react';
import { KitchenTicket, KitchenDestination, KitchenStatus } from '@/src/types/domain';

export interface KitchenTicketCardProps {
  ticket: KitchenTicket;
  itemLabels?: Record<string, string>;
  onAdvance?: (ticket: KitchenTicket) => void;
}

const STATUS_LABEL: Record<KitchenStatus, string> = {
  [KitchenStatus.WAITING]:   'Aguardando',
  [KitchenStatus.PREPARING]: 'Preparando',
  [KitchenStatus.DONE]:      'Pronto',
  [KitchenStatus.DELIVERED]: 'Entregue',
};

const STATUS_VARIANT: Record<KitchenStatus, 'default' | 'secondary' | 'success' | 'primary'> = {
  [KitchenStatus.WAITING]:   'default',
  [KitchenStatus.PREPARING]: 'secondary',
  [KitchenStatus.DONE]:      'success',
  [KitchenStatus.DELIVERED]: 'primary',
};

const NEXT_STATUS: Partial<Record<KitchenStatus, string>> = {
  [KitchenStatus.WAITING]:   'Iniciar',
  [KitchenStatus.PREPARING]: 'Marcar Pronto',
  [KitchenStatus.DONE]:      'Entregar',
};

// eslint-disable-next-line complexity
export function KitchenTicketCard({ ticket, itemLabels = {}, onAdvance }: KitchenTicketCardProps) {
  const isBar = ticket.destination === KitchenDestination.BAR;
  const isDelivered = ticket.status === KitchenStatus.DELIVERED;
  const nextAction = NEXT_STATUS[ticket.status];
  const ticketNumber = ticket.orderId.slice(-6).toUpperCase();

  return (
    <Box
      padding={5}
      border
      borderColor={isBar ? 'border-brand-secondary/50' : 'border-brand-primary/50'}
      radius="default"
      bg={isDelivered ? 'bg-surface/50' : 'bg-surface'}
    >
      <Stack gap={5}>
        {/* Header */}
        <Stack direction="row" justify="between" align="center" gap={2.5}>
          <Stack direction="row" align="center" gap={2.5}>
            <Box
              padding={1}
              bg={isBar ? 'bg-brand-secondary/10' : 'bg-brand-primary/10'}
              radius="full"
            >
              <Icon
                icon={isBar ? Waves : ChefHat}
                size={14}
                color={isBar ? 'brand-secondary' : 'primary'}
              />
            </Box>
            <Font variant="body-bold" text={`#${ticketNumber}`} />
            <Badge
              variant={isBar ? 'secondary' : 'primary'}
              label={isBar ? 'Bar' : 'Cozinha'}
            />
          </Stack>
          <Badge
            variant={STATUS_VARIANT[ticket.status]}
            label={STATUS_LABEL[ticket.status]}
          />
        </Stack>

        {/* Item list */}
        <Stack gap={1}>
          {ticket.itemIds.map((id) => (
            <Font key={id} variant="description" text={`• ${itemLabels[id] ?? id}`} />
          ))}
        </Stack>

        {/* Advance button */}
        {nextAction && !isDelivered && (
          <Button
            variant="outline-primary"
            icon={CheckCircle}
            label={nextAction}
            fullWidth
            onClick={() => onAdvance?.(ticket)}
          />
        )}
      </Stack>
    </Box>
  );
}
