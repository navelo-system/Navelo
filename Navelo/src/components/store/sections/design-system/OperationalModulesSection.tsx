import * as React from "react"
import { RegistrySection } from "../../advanced/RegistrySection"
import { Grid } from "../../base/Grid"
import { Stack } from "../../base/Stack"
import { Box } from "../../base/Box"
import { Font } from "../../base/Font"
import { DeliveryTimeline } from "../../intermediary/DeliveryTimeline"
import { BillSplitter } from "../../../store/advanced/BillSplitter"
import { CashSessionManager } from "../../../store/advanced/CashSessionManager"
import { ThermalReceiptPreview } from "../../../store/advanced/ThermalReceiptPreview"
import { BranchSwitcher } from "../../../store/advanced/BranchSwitcher"
import { Cpu } from "lucide-react"

export const OperationalModulesSection: React.FC = () => {
  return (
    <RegistrySection
      title="Módulos Operacionais Avançados"
      description="Componentes moleculares e avançados específicos para fluxos de restaurante, PDV checkout, delivery e SaaS multiempresa."
      icon={Cpu}
      id="operational-modules-section"
    >
      <Stack gap={12.5}>
        <Grid cols={2} gap={12.5}>
          {/* Column 1: Restaurant and Checkout */}
          <Stack gap={5}>
            <Font variant="h3" text="Salão & Checkout" />
            <BillSplitter totalAmount={218.40} />
            <CashSessionManager initialOpenState={false} />
          </Stack>

          {/* Column 2: Logistics and Branch Management */}
          <Stack gap={5}>
            <Font variant="h3" text="Logística & Filiais" />
            <BranchSwitcher activeBranchId="1" />
            <DeliveryTimeline status="dispatched" />
          </Stack>
        </Grid>

        {/* Fiscal Bobina Preview Area */}
        <Stack gap={5}>
          <Font variant="h3" text="Visualizador Fiscal (Thermal Receipt)" />
          <Grid cols={2} gap={12.5}>
            <ThermalReceiptPreview />
            <Box padding={5} bg="bg-surface-sunken" border borderColor="border-border" radius="default" className="flex flex-col justify-center">
              <Stack gap={5}>
                <Font variant="h4" text="Simulação de Impressão" />
                <Font variant="description" text="O pré-visualizador simula o layout de impressão térmica física (bobina de 80mm de largura). Ideal para testar a disposição de produtos, rateios de impostos, formatação de descontos, posicionamento do QR Code da NFC-e e do código de barras de contingência." />
                <Font variant="description" text="Garante que a visualização na tela do PDV do operador seja idêntica ao papel térmico emitido pela impressora do terminal." />
              </Stack>
            </Box>
          </Grid>
        </Stack>
      </Stack>
    </RegistrySection>
  )
}
