import React from 'react';
import { Box } from '@/components/store/base/Box';
import { Stack } from '@/components/store/base/Stack';
import { Font } from '@/components/store/base/Font';
import { Badge } from '@/components/store/base/Badge';
import { Button } from '@/components/store/base/Button';
import { Icon } from '@/components/store/base/Icon';
import { EmptyState } from '@/components/store/intermediary/EmptyState';
import { Edit2, Trash2, MapPin } from 'lucide-react';
import { CustomerAddress } from '@/src/types/domain';

export interface AddressListProps {
  addresses: CustomerAddress[];
  onEdit?: (address: CustomerAddress) => void;
  onDelete?: (address: CustomerAddress) => void;
}

export function AddressList({ addresses, onEdit, onDelete }: AddressListProps) {
  if (!addresses || addresses.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="Nenhum endereço cadastrado"
        subtitle="Adicione um endereço para o cliente."
      />
    );
  }

  return (
    <Stack gap={2.5}>
      {addresses.map((addr) => (
        <Box
          key={addr.id}
          padding={5}
          border
          borderColor="border-border"
          radius="default"
          w="full"
        >
          <Stack gap={2.5} w="full">
            {/* Linha Superior: Ícone à esquerda, Ações (Editar/Deletar) à direita */}
            <Stack direction="row" justify="between" align="center" w="full">
              <Box padding={2.5} bg="bg-brand-primary/10" radius="full">
                <Icon icon={MapPin} size={20} color="primary" />
              </Box>
              <Stack direction="row" gap={2.5} align="center">
                <Button variant="primary-icon-xs" icon={Edit2} onClick={() => onEdit?.(addr)} />
                {onDelete && <Button variant="danger-icon-xs" icon={Trash2} onClick={() => onDelete?.(addr)} />}
              </Stack>
            </Stack>

            {/* Detalhes do Endereço abaixo */}
            <Stack gap={1} w="full" align="start">
              <Stack direction="row" align="center" gap={2.5} wrap={true}>
                <Font variant="body-bold" text={`${addr.street}, ${addr.number}`} />
                {addr.isDefault && <Badge variant="primary" label="Padrão" />}
              </Stack>
              <Font
                variant="description"
                text={`${addr.neighborhood} - ${addr.city}/${addr.state} | CEP: ${addr.zipCode}`}
              />
              {addr.complement && (
                <Font variant="auxiliary" color="muted" text={`Complemento: ${addr.complement}`} />
              )}
            </Stack>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
