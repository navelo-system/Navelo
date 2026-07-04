import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Grid } from "../base/Grid"
import { Font } from "../base/Font"
import { Button } from "../base/Button"
import { CreditCard, Banknote, QrCode } from "lucide-react"

export interface CheckoutPaymentProps {
  onSelectPayment?: (method: string) => void
  onCheckout?: () => void
}

export const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({
  onSelectPayment,
  onCheckout,
}) => {
  return (
    <Box padding={5} bg="bg-surface" radius="default" display="flex" direction="col" justify="end">
      <Stack gap={5}>
        <Font variant="h4" text="Formas de Pagamento" />
        <Grid cols={2} gap={2.5}>
          <Button variant="outline-lg" fullWidth label="Dinheiro" icon={Banknote} onClick={() => onSelectPayment?.("dinheiro")} />
          <Button variant="outline-lg" fullWidth label="Pix" icon={QrCode} onClick={() => onSelectPayment?.("pix")} />
          <Button variant="outline-lg" fullWidth label="Débito" icon={CreditCard} onClick={() => onSelectPayment?.("debito")} />
          <Button variant="outline-lg" fullWidth label="Crédito" icon={CreditCard} onClick={() => onSelectPayment?.("credito")} />
        </Grid>
        <Button variant="primary-lg" fullWidth label="Finalizar venda" icon={CreditCard} onClick={onCheckout} />
      </Stack>
    </Box>
  )
}
