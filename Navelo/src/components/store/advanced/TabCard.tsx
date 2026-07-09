import React from 'react';
import { Box } from '@/components/store/base/Box';
import { Stack } from '@/components/store/base/Stack';
import { Font } from '@/components/store/base/Font';
import { Icon } from '@/components/store/base/Icon';
import { TabStatusBadge } from './TabStatusBadge';
import { Users } from 'lucide-react';
import { Tab, TabStatus } from '@/src/types/domain';

export interface TabCardProps {
  tab: Tab;
  onClick?: (tab: Tab) => void;
}

export function TabCard({ tab, onClick }: TabCardProps) {
  const isOccupied = tab.status !== TabStatus.FREE;

  return (
    <Box
      as="button"
      padding={5}
      border
      borderColor={isOccupied ? 'border-brand-primary/50' : 'border-border'}
      bg={isOccupied ? 'bg-brand-primary/5' : 'bg-surface'}
      radius="default"
      hoverBg="surface-sunken"
      cursor="pointer"
      w="full"
      onClick={() => onClick?.(tab)}
    >
      <Stack gap={5}>
        <Stack direction="row" justify="between" align="start" gap={2.5}>
          <Font variant="h4" text={tab.identifier} />
          <TabStatusBadge status={tab.status} />
        </Stack>

        {isOccupied && tab.customerCount > 0 && (
          <Stack direction="row" align="center" gap={2.5}>
            <Icon icon={Users} size={14} color="muted" />
            <Font variant="description" text={`${tab.customerCount} pessoa${tab.customerCount > 1 ? 's' : ''}`} />
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
