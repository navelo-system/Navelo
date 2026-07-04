import * as React from "react"
import { RegistrySection } from "../../advanced/RegistrySection"
import { Grid } from "../../base/Grid"
import { Stack } from "../../base/Stack"
import { ProductScanner } from "../../intermediary/ProductScanner"
import { ChangeCalculator } from "../../advanced/ChangeCalculator"
import { FiscalStatusIndicator } from "../../intermediary/FiscalStatusIndicator"
import { PeripheralStatusList } from "../../advanced/PeripheralStatusList"
import { Cpu } from "lucide-react"

export const AdvancedCheckoutSection: React.FC = () => {
  const handleScan: (barcode: string) => void = () => {
    //
  }

  const handleSearch: (query: string) => void = () => {
    //
  }

  return (
    <RegistrySection
      title="Operações de Checkout & Dispositivos"
      description="Componentes moleculares avançados para leitura de produtos, cálculo de troco, monitor fiscal offline e periféricos locais."
      icon={Cpu}
    >
      <Grid cols={2} gap={5}>
        <Stack gap={5}>
          <ProductScanner onScan={handleScan} onSearch={handleSearch} />
          <FiscalStatusIndicator status="contingency" pendingInvoicesCount={5} environment="homologacao" />
        </Stack>
        
        <Stack gap={5}>
          <ChangeCalculator totalAmount={142.90} />
          <PeripheralStatusList />
        </Stack>
      </Grid>
    </RegistrySection>
  )
}
export default AdvancedCheckoutSection
