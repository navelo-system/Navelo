import React from 'react';
import { Box } from '@/components/store/base/Box';
import { Stack } from '@/components/store/base/Stack';
import { Grid } from '@/components/store/base/Grid';
import { Font } from '@/components/store/base/Font';
import { Icon } from '@/components/store/base/Icon';
import { LucideIcon, Users, ArrowDownCircle, Layers, XCircle } from 'lucide-react';

export interface CashierMenuAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

export interface CashierMenuProps {
  onAddCustomer?: () => void;
  onBleedRegister?: () => void;
  onOpenDrawer?: () => void;
  onCancelSale?: () => void;
  extraActions?: CashierMenuAction[];
}

function MenuButton({ label, icon, onClick, variant = 'default', disabled }: CashierMenuAction) {
  return (
    <Box
      as="button"
      padding={5}
      border
      borderColor={variant === 'danger' ? 'border-brand-danger/50' : 'border-border'}
      bg={variant === 'danger' ? 'bg-brand-danger/5' : 'bg-surface'}
      radius="default"
      hoverBg="surface-sunken"
      cursor="pointer"
      onClick={disabled ? undefined : onClick}
    >
      <Stack gap={2.5} direction="col" align="center" justify="center">
        <Icon
          icon={icon}
          size={24}
          color={variant === 'danger' ? 'danger' : 'secondary'}
        />
        <Font
          variant="body-xs-medium"
          color={variant === 'danger' ? 'danger' : 'secondary'}
          text={label}
          align="center"
        />
      </Stack>
    </Box>
  );
}

export function CashierMenu({
  onAddCustomer,
  onBleedRegister,
  onOpenDrawer,
  onCancelSale,
  extraActions = [],
}: CashierMenuProps) {
  const defaultActions: CashierMenuAction[] = [
    { label: 'Clientes', icon: Users, onClick: onAddCustomer || (() => {}), variant: 'default' },
    { label: 'Sangria', icon: ArrowDownCircle, onClick: onBleedRegister || (() => {}), variant: 'default' },
    { label: 'Gaveta', icon: Layers, onClick: onOpenDrawer || (() => {}), variant: 'default' },
    { label: 'Cancelar', icon: XCircle, onClick: onCancelSale || (() => {}), variant: 'danger' },
  ];

  const actions = [...defaultActions, ...extraActions];

  return (
    <Grid cols={4} gap={2.5} responsive={false}>
      {actions.map((action) => (
        <MenuButton key={action.label} {...action} />
      ))}
    </Grid>
  );
}
