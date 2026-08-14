/* eslint-disable max-lines-per-function, complexity */
import React from 'react';
import { Box } from '@/components/store/base/Box';
import { Stack } from '@/components/store/base/Stack';
import { Font } from '@/components/store/base/Font';
import { Badge } from '@/components/store/base/Badge';
import { Button } from '@/components/store/base/Button';
import { Icon } from '@/components/store/base/Icon';
import { EmptyState } from '@/components/store/intermediary/EmptyState';
import { Edit2, MapPin } from 'lucide-react';
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
      {addresses.map((addr) => {
        const hasDetails = Boolean(addr.neighborhood || addr.city || addr.zipCode)
        const streetText = addr.number && addr.number !== "S/N" && !addr.street.includes(addr.number)
          ? `${addr.street}, ${addr.number}`
          : addr.street

        const detailsText = [
          addr.neighborhood,
          addr.city && addr.state ? `${addr.city}/${addr.state}` : addr.city,
          addr.zipCode ? `CEP: ${addr.zipCode}` : null,
        ].filter(Boolean).join(" - ")

        return (
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
                  <Button
                    type="button"
                    variant="primary-icon-xs"
                    icon={Edit2}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onEdit?.(addr)
                    }}
                    title="Editar endereço"
                  />
                  {onDelete && (
                    <Button
                      type="button"
                      variant="danger-icon-xs-confirm"
                      confirmTitle="Excluir Endereço"
                      confirmSubtitle="Confirmar exclusão de endereço"
                      confirmParagraph="Tem certeza que deseja remover este endereço do cliente? Esta ação não poderá ser desfeita."
                      onConfirm={() => onDelete?.(addr)}
                      title="Excluir endereço"
                    />
                  )}
                </Stack>
              </Stack>

              {/* Detalhes do Endereço abaixo */}
              <Stack gap={1} w="full" align="start">
                <Stack direction="row" align="center" gap={2.5} wrap={true}>
                  <Font variant="body-bold" text={streetText} />
                  {addresses.length > 1 && addr.isDefault && <Badge variant="primary" label="Padrão" />}
                </Stack>
                {hasDetails && (
                  <Font
                    variant="description"
                    text={detailsText}
                  />
                )}
                {addr.complement && (
                  <Font variant="auxiliary" color="muted" text={`Complemento: ${addr.complement}`} />
                )}
              </Stack>
            </Stack>
          </Box>
        )
      })}
    </Stack>
  );
}
