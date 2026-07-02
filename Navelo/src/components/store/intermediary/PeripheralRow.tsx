import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Badge } from "../base/Badge"
import { Button } from "../base/Button"
import { Icon } from "../base/Icon"
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
      <Stack direction="row" align="center" justify="between" gap={5}>
        {/* Left info */}
        <Stack direction="row" align="center" gap={5}>
          <Box padding={2.5} bg="bg-surface" radius="default">
            <Icon icon={IconComponent} size={18} color="primary" />
          </Box>
          <Stack gap={1}>
            <Stack direction="row" align="center" gap={2.5}>
              <Font variant="body-bold" text={peripheral.name} />
              <Badge
                variant={isOnline ? "success" : "danger"}
                label={isOnline ? "Conectado" : "Desconectado"}
              />
            </Stack>
            <Font variant="description" text={peripheral.description} />
          </Stack>
        </Stack>

        {/* Right test button */}
        <Button
          variant={peripheral.type === "smartpos" && !isOnline ? "primary-xs" : "outline-primary-xs"}
          label={isTesting ? "Testando..." : peripheral.type === "smartpos" && !isOnline ? "Reconectar" : "Testar"}
          icon={isTesting ? RefreshCw : undefined}
          onClick={() => onTest(peripheral)}
          disabled={isTesting}
        />
      </Stack>
    </Box>
  )
}
