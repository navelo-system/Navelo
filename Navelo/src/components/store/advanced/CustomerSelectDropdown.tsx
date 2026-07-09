import React from 'react';
import { CustomSelect, CustomSelectItem } from '@/components/store/base/CustomSelect';
import { User } from 'lucide-react';
import { Customer } from '@/src/types/domain';

export interface CustomerSelectDropdownProps {
  customers: Customer[];
  value?: string;
  onChange?: (customerId: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

export function CustomerSelectDropdown({ customers, value, onChange, placeholder = "Vincular Cliente", hasError }: CustomerSelectDropdownProps) {
  return (
    <CustomSelect
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      hasError={hasError}
    >
      {customers.map(customer => (
        <CustomSelectItem
          key={customer.id}
          value={customer.id}
          text={customer.name}
          icon={User}
        />
      ))}
    </CustomSelect>
  );
}
