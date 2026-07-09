import React from 'react';
import { CustomSelect, CustomSelectItem } from '@/components/store/base/CustomSelect';
import { Folder } from 'lucide-react';
import { Category } from '@/src/types/domain';

export interface CategorySelectProps {
  categories: Category[];
  value?: string;
  onChange?: (categoryId: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

export function CategorySelect({ categories, value, onChange, placeholder = "Selecione uma categoria", hasError }: CategorySelectProps) {
  return (
    <CustomSelect 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      hasError={hasError}
    >
      {categories.map(category => (
        <CustomSelectItem 
          key={category.id}
          value={category.id}
          text={category.name}
          icon={Folder}
        />
      ))}
    </CustomSelect>
  );
}
