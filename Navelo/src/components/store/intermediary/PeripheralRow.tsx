import * as React from "react"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Badge } from "@/components/store/base/Badge"
import { Button } from "@/components/store/base/Button"
import { CircularIcon } from "./CircularIcon"
import { Box } from "@/components/store/base/Box"
import { Printer, Scale, Scan, CreditCard, RefreshCw } from "lucide-react"

export interface Peripheral {
  id: string
  name: string
  type: "printer" | "scale" | "scanner" | "smartpos"
  status: "online" | "offline"
  description: string
}

export interface PeripheralRowProps {
  peripheral: Peripheral
  isTesting: boolean
  onTest: (peripheral: Peripheral) => void
}

export const PeripheralRow: React.FC<PeripheralRowProps> = ({
  peripheral,
  isTesting,
  onTest,
}) => {
  const getIconComponent = (type: Peripheral["type"]) => {
    switch (type) {
      case "printer": return Printer
      case "scale": return Scale
      case "scanner": return Scan
      case "smartpos": return CreditCard
    }
  }

  const isOnline = peripheral.status === "online"
  const IconComponent = getIconComponent(peripheral.type)

  return (
    <Box
      padding={5}
      bg="bg-surface"
      radius="default"
    >
      {/* Mobile: col stack. Desktop: row with button on the right */}
      <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" gap={5}>

        {/* Left: icon + info */}
        <Stack direction="col" mobileDirection="row" align="start" gap={5} w="full">
          <CircularIcon icon={IconComponent} size={20} />
          <Stack gap={1} align="start">
            {/* Badge acima do nome */}
            <Badge
              variant={isOnline ? "success" : "danger"}
              label={isOnline ? "Conectado" : "Desconectado"}
            />
            <Font variant="body-bold" text={peripheral.name} />
            <Font variant="description" text={peripheral.description} />
          </Stack>
        </Stack>

        <Button
          variant={peripheral.type === "smartpos" && !isOnline ? "primary" : "primary"}
          label={isTesting ? "Testando..." : peripheral.type === "smartpos" && !isOnline ? "Reconectar" : "Testar"}
          icon={isTesting ? RefreshCw : undefined}
          onClick={() => onTest(peripheral)}
          disabled={isTesting}
        />

      </Stack>
    </Box>
  )
}
