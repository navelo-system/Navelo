import React from 'react';
import { Modal } from '@/components/store/base/Modal';
import { Box } from '@/components/store/base/Box';
import { Stack } from '@/components/store/base/Stack';
import { Grid } from '@/components/store/base/Grid';
import { Font } from '@/components/store/base/Font';
import { Icon } from '@/components/store/base/Icon';

import { LabeledInput } from '@/components/store/intermediary/LabeledInput';
import { Banknote, CreditCard, Smartphone, Wallet, Ticket, Store, Check, LucideIcon } from 'lucide-react';
import { PaymentMethod } from '@/src/types/domain';

interface PaymentOption {
  method: PaymentMethod;
  label: string;
  icon: LucideIcon;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  { method: PaymentMethod.CASH, label: 'Dinheiro', icon: Banknote },
  { method: PaymentMethod.PIX, label: 'Pix', icon: Smartphone },
  { method: PaymentMethod.CREDIT_CARD, label: 'Crédito', icon: CreditCard },
  { method: PaymentMethod.DEBIT_CARD, label: 'Débito', icon: Wallet },
  { method: PaymentMethod.VOUCHER, label: 'Voucher', icon: Ticket },
  { method: PaymentMethod.STORE_CREDIT, label: 'Crédito Loja', icon: Store },
];

export interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onConfirm?: (method: PaymentMethod, amountPaid?: number) => void;
}

export function PaymentMethodModal({ isOpen, onClose, totalAmount, onConfirm }: PaymentMethodModalProps) {
  const [selected, setSelected] = React.useState<PaymentMethod | null>(null);
  const [cashAmount, setCashAmount] = React.useState<string>('');

  const fmt = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const isCash = selected === PaymentMethod.CASH;
  const cashPaid = parseFloat(cashAmount.replace(',', '.')) || 0;
  const change = isCash && cashPaid > 0 ? Math.max(0, cashPaid - totalAmount) : 0;

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm?.(selected, isCash ? cashPaid : totalAmount);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Forma de Pagamento"
      subtitle={`Total: ${fmt(totalAmount)}`}
      icon={CreditCard}
      successText="Confirmar Pagamento"
      onSuccess={handleConfirm}
    >
      <Stack gap={5}>
        <Grid cols={3} gap={2.5} responsive={false}>
          {PAYMENT_OPTIONS.map(({ method, label, icon: IconComp }) => {
            const isActive = selected === method;
            return (
              <Box
                key={method}
                as="button"
                padding={5}
                border
                borderColor={isActive ? 'border-brand-primary' : 'border-border'}
                bg={isActive ? 'bg-brand-primary/10' : 'bg-surface'}
                radius="default"
                hoverBg="surface-sunken"
                cursor="pointer"
                onClick={() => setSelected(method)}
              >
                <Stack gap={2.5} align="center" justify="center" direction="col">
                  {isActive && (
                    <Box position="absolute" top={5} right={5}>
                      <Icon icon={Check} size={12} color="primary" />
                    </Box>
                  )}
                  <Icon icon={IconComp} size={24} color={isActive ? 'primary' : 'secondary'} />
                  <Font
                    variant="body-xs-medium"
                    color={isActive ? 'primary' : 'secondary'}
                    text={label}
                    align="center"
                  />
                </Stack>
              </Box>
            );
          })}
        </Grid>

        {isCash && (
          <Stack gap={2.5}>
            <LabeledInput
              label="VALOR RECEBIDO"
              type="number"
              placeholder={fmt(totalAmount)}
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
            />
            {change > 0 && (
              <Box padding={2.5} bg="bg-brand-success/10" radius="default" border borderColor="border-brand-success/50">
                <Stack direction="row" justify="between" align="center" gap={2.5}>
                  <Font variant="body-medium" text="Troco:" />
                  <Font variant="h4" color="success" text={fmt(change)} />
                </Stack>
              </Box>
            )}
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}


