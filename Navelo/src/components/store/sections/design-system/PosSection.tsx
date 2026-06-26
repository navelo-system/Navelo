"use client"

import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { Box } from "@/components/store/base/Box"
import { Font } from "@/components/store/base/Font"
import { TableCard } from "@/components/store/intermediary/TableCard"
import { CartList, CartListItemType } from "@/components/store/advanced/CartList"
import { NumpadTerminal } from "@/components/store/advanced/NumpadTerminal"
import { CheckoutPayment } from "@/components/store/advanced/CheckoutPayment"
import { MonitorSmartphone } from "lucide-react"

export const PosSection: React.FC = () => {
  const [cartItems, setCartItems] = React.useState<CartListItemType[]>([
    { id: "1", name: "Hambúrguer Clássico", quantity: 2, unitPrice: 25.5 },
    { id: "2", name: "Refrigerante Cola Lata", quantity: 1, unitPrice: 6.0 },
  ])

  const handleIncrease = (id: string) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
  }

  const handleDecrease = (id: string) => {
    setCartItems(prev => prev.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
  }

  const handleRemove = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <RegistrySection
      title="Frente de Caixa (PDV Touch)"
      description="Componentes otimizados para toque (Touch-first) para monitores e tablets."
      icon={MonitorSmartphone}
    >
      <Stack gap={12.5}>
        
        {/* Numpad & Cards */}
        <Grid cols={2} gap={12.5}>
          <Stack gap={5}>
            <Font variant="h4" text="Numpad Virtual" />
            <NumpadTerminal />
          </Stack>

          <Stack gap={5}>
            <Font variant="h4" text="Mapeamento (TableCards)" />
            <Grid cols={2} gap={5}>
              <TableCard tableNumber={1} status="free" capacity={4} onClick={() => alert("Mesa 1")} />
              <TableCard tableNumber={2} status="occupied" time="01:25" capacity={2} onClick={() => alert("Mesa 2")} />
              <TableCard tableNumber="Balcão" status="occupied" time="00:15" onClick={() => alert("Balcão")} />
              <TableCard tableNumber={4} status="closing" capacity={6} onClick={() => alert("Mesa 4")} />
            </Grid>
          </Stack>
        </Grid>

        {/* Cart List */}
        <Stack gap={5}>
          <Font variant="h4" text="CartList (Lista de Carrinho)" />
          <Grid cols={2} gap={5}>
            <Box h="h-[400px]">
              <CartList 
                items={cartItems}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            </Box>
            
            <CheckoutPayment 
              onCheckout={() => alert("Venda finalizada com sucesso!")} 
              onSelectPayment={(method) => alert(`Pagamento selecionado: ${method}`)} 
            />
          </Grid>
        </Stack>

      </Stack>
    </RegistrySection>
  )
}
