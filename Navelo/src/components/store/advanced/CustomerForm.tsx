import React from 'react';
import { Grid } from '@/components/store/base/Grid';
import { Stack } from '@/components/store/base/Stack';
import { LabeledInput } from '@/components/store/intermediary/LabeledInput';
import { Customer } from '@/src/types/domain';

export interface CustomerFormProps {
  initialData?: Partial<Customer>;
}

export function CustomerForm({ initialData }: CustomerFormProps) {
  return (
    <Stack gap={5}>
      <LabeledInput
        label="NOME COMPLETO"
        defaultValue={initialData?.name}
        placeholder="Ex: João Silva"
      />

      <Grid cols={2} gap={5}>
        <LabeledInput
          label="CPF / CNPJ"
          defaultValue={initialData?.document}
          placeholder="000.000.000-00"
        />
        <LabeledInput
          label="TELEFONE"
          defaultValue={initialData?.phone}
          placeholder="(00) 00000-0000"
        />
      </Grid>

      <LabeledInput
        label="E-MAIL"
        type="email"
        defaultValue={initialData?.email}
        placeholder="email@exemplo.com"
      />
    </Stack>
  );
}
