import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { SectionHeader } from "../intermediary/SectionHeader"
import { PeripheralRow, Peripheral } from "../intermediary/PeripheralRow"
import { Cpu } from "lucide-react"

export interface PeripheralStatusListProps {
  initialPeripherals?: Peripheral[]
  onTestPeripheral?: (peripheralId: string) => void
}

export const PeripheralStatusList: React.FC<PeripheralStatusListProps> = ({
  initialPeripherals = [
    { id: "p1", name: "Impressora Térmica 80mm", type: "printer", status: "online", description: "USB - Padrão ESC/POS" },
    { id: "p2", name: "Balança Toledo Prix 3", type: "scale", status: "online", description: "Serial RS232 - Protocolo Prt3" },
    { id: "p3", name: "Leitor Zebra DS2208", type: "scanner", status: "online", description: "USB Keyboard Emulation" },
    { id: "p4", name: "Terminal SmartPOS D190", type: "smartpos", status: "offline", description: "Wi-Fi - TEF Integrado" },
  ],
  onTestPeripheral,
}) => {
  const [peripherals, setPeripherals] = React.useState<Peripheral[]>(initialPeripherals)
  const [testingId, setTestingId] = React.useState<string | null>(null)

  const handleTest = (peripheral: Peripheral) => {
    setTestingId(peripheral.id)
    setTimeout(() => {
      setTestingId(null)
      if (peripheral.id === "p4") {
        // Mock reconnecting smartpos for demo
        setPeripherals(prev =>
          prev.map(p => p.id === "p4" ? { ...p, status: "online" } : p)
        )
      }
      if (onTestPeripheral) onTestPeripheral(peripheral.id)
      console.warn(`Teste de comunicação concluído com sucesso para: ${peripheral.name}`)
    }, 1200)
  }

  return (
    <Box padding={0}>
      <Stack gap={5}>
        {/* Header */}
        <SectionHeader
          icon={Cpu}
          title="Status de Periféricos"
          subtitle="Monitore conexões de impressoras, balanças e leitores locais."
        />

        <Box borderBottom borderColor="border-border" w="full" />

        {/* Peripheral Rows */}
        <Stack gap={2.5}>
          {peripherals.map((item) => (
            <PeripheralRow 
              key={item.id}
              peripheral={item}
              isTesting={testingId === item.id}
              onTest={handleTest}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}
