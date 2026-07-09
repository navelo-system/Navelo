import React from 'react';
import { Box } from '@/components/store/base/Box';
import { Stack } from '@/components/store/base/Stack';
import { Font } from '@/components/store/base/Font';
import { Product } from '@/src/types/domain';

export interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Box 
      bg="bg-surface" 
      radius="default" 
      border 
      borderColor="border-border"
      overflow="hidden"
      cursor="pointer"
      hoverBg="surface-sunken"
      onClick={() => onClick?.(product)}
      display="flex"
      direction="col"
    >
      <Box h="h-32" w="full" bg="bg-surface-sunken">
        {product.mainImage ? (
          <Box 
            as="img" 
            src={product.mainImage} 
            alt={product.name} 
            w="full" 
            h="full" 
            objectFit="cover" 
          />
        ) : (
          <Stack align="center" justify="center" w="full" h="full">
            <Font variant="auxiliary" color="muted" text="Sem Foto" />
          </Stack>
        )}
      </Box>

      <Box padding={5}>
        <Stack gap={2.5}>
          <Box w="full">
            <Font as="p" variant="body-bold" text={product.name} align="center" />
          </Box>
          
          <Font as="p" variant="body-sm-semibold" color="primary" text={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.sellingPrice)} align="center" />
        </Stack>
      </Box>
    </Box>
  );
}
