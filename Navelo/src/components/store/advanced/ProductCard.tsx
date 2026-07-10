import React from 'react';
import { Box } from '@/components/store/base/Box';
import { Stack } from '@/components/store/base/Stack';
import { Font } from '@/components/store/base/Font';
import { Button } from '@/components/store/base/Button';
import { Product } from '@/src/types/domain';
import { Minus, Plus, Trash2 } from 'lucide-react';

export interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
}

export function ProductCard({ product, onClick, quantity = 0, onIncrease, onDecrease, onRemove }: ProductCardProps) {
  return (
    <Stack 
      gap={2.5}
      onClick={() => {
        if (quantity === 0) onClick?.(product)
      }}
      cursor={quantity === 0 ? "pointer" : undefined}
      w="full"
      align="stretch"
      flex="1"
    >
      <Box w="full" shrink="0" h="aspect-square" bg="bg-surface-sunken" radius="default" overflow="hidden">
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
          <Stack align="center" justify="center" w="full" h="aspect-square">
            <Font variant="auxiliary" color="muted" text="Sem Foto" />
          </Stack>
        )}
      </Box>

      <Stack gap={1} w="full" flex="1" justify="between">
        <Box w="full" flex="1">
          <Font as="p" variant="body-bold" text={product.name} align="center" lineClamp={2} />
        </Box>
        
        <Stack gap={1} w="full">
          <Font 
            as="p" 
            variant="body-sm-semibold" 
            color="primary" 
            text={`${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.sellingPrice)} / ${product.unitType || 'UN'}`} 
            align="center" 
          />
          {quantity > 0 && (
            <Box padding={1} w="full">
            <Stack direction="row" align="center" justify="center" gap={2.5}>
              {quantity === 1 ? (
                <Button variant="danger-icon-xs" icon={Trash2} onClick={(e) => { e.stopPropagation(); onRemove?.(); }} />
              ) : (
                <Button variant="outline-icon-xs" icon={Minus} onClick={(e) => { e.stopPropagation(); onDecrease?.(); }} />
              )}
              <Box padding={0} w="w-4">
                <Font variant="body-bold" text={String(quantity)} align="center" />
              </Box>
              <Button variant="outline-icon-xs" icon={Plus} onClick={(e) => { e.stopPropagation(); onIncrease?.(); }} />
            </Stack>
          </Box>
        )}
        </Stack>
      </Stack>
    </Stack>
  );
}
