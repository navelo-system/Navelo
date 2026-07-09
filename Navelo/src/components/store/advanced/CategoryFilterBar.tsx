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
        <Box shrink="0">
          <Button 
            variant={selectedCategoryId === undefined ? "secondary-pill" : "outline-pill"}
            label="Todos"
            onClick={() => onSelectCategory(undefined)}
          />
        </Box>
        {categories.map(category => (
          <Box shrink="0" key={category.id}>
            <Button 
              key={category.id}
              variant={selectedCategoryId === category.id ? "secondary-pill" : "outline-pill"}
              label={category.name}
              onClick={() => onSelectCategory(category.id)}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
