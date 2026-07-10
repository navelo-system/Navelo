"use client"

import React from 'react';
import { Box } from '@/components/store/base/Box';
import { Stack } from '@/components/store/base/Stack';
import { Font } from '@/components/store/base/Font';
import { Button } from '@/components/store/base/Button';
import { Product } from '@/src/types/domain';
import { Minus, Plus, Trash2 } from 'lucide-react';

const FOOTER_ANIMATION_MS = 240;

export interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
}

export function ProductCard({ product, onClick, quantity = 0, onIncrease, onDecrease, onRemove }: ProductCardProps) {
  const [footerMounted, setFooterMounted] = React.useState(quantity > 0);
  const [footerAnimation, setFooterAnimation] = React.useState<'slide-up' | 'slide-down' | undefined>(
    quantity > 0 ? 'slide-up' : undefined
  );
  const frozenQuantityRef = React.useRef(quantity);
  const exitTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (quantity > 0) {
      frozenQuantityRef.current = quantity;

      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }

      setFooterMounted(true);
      setFooterAnimation('slide-up');
      return;
    }

    if (!footerMounted) return;

    setFooterAnimation('slide-down');
    exitTimerRef.current = setTimeout(() => {
      setFooterMounted(false);
      setFooterAnimation(undefined);
      exitTimerRef.current = null;
    }, FOOTER_ANIMATION_MS);

    return () => {
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
    };
  }, [quantity, footerMounted]);

  const footerQuantity = quantity > 0 ? quantity : frozenQuantityRef.current;

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
      <Box
        position="relative"
        w="full"
        shrink="0"
        bg="bg-surface-sunken"
        radius="default"
        overflow="hidden"
        h="aspect-square"
      >
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

        {footerMounted && footerAnimation && (
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            w="full"
            bg="bg-white"
            padding={1}
            animation={footerAnimation}
          >
            <Stack direction="row" align="center" justify="center" gap={2.5} w="full">
              {footerQuantity === 1 ? (
                <Button variant="danger-icon-xs" icon={Trash2} onClick={(e) => { e.stopPropagation(); onRemove?.(); }} />
              ) : (
                <Button variant="outline-icon-xs" icon={Minus} onClick={(e) => { e.stopPropagation(); onDecrease?.(); }} />
              )}
              <Box padding={0} w="w-4">
                <Font variant="body-bold" text={String(footerQuantity)} align="center" />
              </Box>
              <Button variant="outline-icon-xs" icon={Plus} onClick={(e) => { e.stopPropagation(); onIncrease?.(); }} />
            </Stack>
          </Box>
        )}
      </Box>

      <Stack gap={1} w="full" flex="1" justify="between">
        <Box w="full" flex="1">
          <Font as="p" variant="body-bold" text={product.name} align="center" lineClamp={2} />
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
