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
    <Stack 
      gap={2.5}
      onClick={() => onClick?.(product)}
      className="cursor-pointer"
      w="full"
      align="stretch"
    >
      <Box className="w-full aspect-square" bg="bg-surface-sunken" radius="default" overflow="hidden">
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
          <Stack align="center" justify="center" w="full" h="full" className="aspect-square">
            <Font variant="auxiliary" color="muted" text="Sem Foto" />
          </Stack>
        )}
      </Box>

      <Stack gap={1} w="full">
        <Box w="full">
          <Font as="p" variant="body-bold" text={product.name} align="center" />
        </Box>
        
        <Font 
          as="p" 
          variant="body-sm-semibold" 
          color="primary" 
          text={`${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.sellingPrice)} / ${product.unitType || 'UN'}`} 
          align="center" 
        />
      </Stack>
    </Stack>
  );
}
