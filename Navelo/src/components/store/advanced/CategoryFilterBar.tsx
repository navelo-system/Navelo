import React from 'react';
import { Box } from '@/components/store/base/Box';
import { Stack } from '@/components/store/base/Stack';
import { Button } from '@/components/store/base/Button';
import { Category } from '@/src/types/domain';

export interface CategoryFilterBarProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (categoryId: string | undefined) => void;
}

export function CategoryFilterBar({ categories, selectedCategoryId, onSelectCategory }: CategoryFilterBarProps) {
  return (
    <Box w="full" overflow="auto" paddingY={2.5}>
      <Stack direction="row" align="center" gap={2.5}>
        <Button 
          variant={selectedCategoryId === undefined ? "primary-pill" : "outline-pill"}
          label="Todos"
          onClick={() => onSelectCategory(undefined)}
        />
        {categories.map(category => (
          <Button 
            key={category.id}
            variant={selectedCategoryId === category.id ? "primary-pill" : "outline-pill"}
            label={category.name}
            onClick={() => onSelectCategory(category.id)}
          />
        ))}
      </Stack>
    </Box>
  );
}
