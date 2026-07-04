import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Button } from "../base/Button"
import { Input } from "../base/Input"
import { Badge } from "../base/Badge"
import { SectionHeader } from "./SectionHeader"
import { ScanBarcode, Search } from "lucide-react"

export interface ProductScannerProps {
  onScan?: (barcode: string) => void
  onSearch?: (query: string) => void
}

export const ProductScanner: React.FC<ProductScannerProps> = ({
  onScan,
  onSearch,
}) => {
  const [query, setQuery] = React.useState("")
  const [scannerActive] = React.useState(true)

  const handleSimulateScan = () => {
    const mockBarcodes = ["7891000312012", "7892000413025", "7893000514038"]
    const randomBarcode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)]
    setQuery(randomBarcode)
    if (onScan) {
      onScan(randomBarcode)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <Box padding={5} bg="bg-surface" radius="default">
      <Stack gap={5}>
        {/* Header */}
        <SectionHeader
          icon={ScanBarcode}
          title="Leitor de Código de Barras"
          subtitle="Busque produtos digitando ou simule a leitura de código de barras."
          action={
            <Badge 
              variant={scannerActive ? "success" : "default"} 
              label={scannerActive ? "Scanner ativo" : "Scanner inativo"} 
            />
          }
        />

        <Box borderBottom borderColor="border-border" w="full" />

        {/* Input Form */}
        <Box as="form" onSubmit={handleSearchSubmit} w="full">
          <Stack gap={2.5}>
            <Input 
              label="Buscar por Nome ou Código"
              placeholder="Digite o nome do produto ou código de barras..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              variant="default"
            />
            
            <Stack direction="col" mobileDirection="row" gap={2.5}>
              <Button 
                type="submit"
                variant="primary" 
                label="Buscar" 
                icon={Search}
                fullWidth
              />
              <Button 
                type="button"
                variant="outline" 
                label="Simular bip" 
                icon={ScanBarcode}
                onClick={handleSimulateScan}
                fullWidth
              />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}
