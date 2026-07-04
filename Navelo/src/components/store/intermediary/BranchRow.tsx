import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Badge } from "../base/Badge"
import { Button } from "../base/Button"
import { Icon } from "../base/Icon"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"

export interface Branch {
  id: string
  name: string
  location: string
  isOnline: boolean
  pendingSyncCount: number
}

export interface BranchRowProps {
  branch: Branch
  isActive: boolean
  onSelect: (branch: Branch) => void
}

export const BranchRow: React.FC<BranchRowProps> = ({
  branch,
  isActive,
  onSelect,
}) => {
  return (
    <Box 
      padding={5} 
      bg="bg-surface" 
      radius="default"
    >
      <Stack direction="col" mobileDirection="row" align="stretch" mobileAlign="center" justify="between" gap={5}>
        <Box flex="1">
          <Stack gap={1}>
            <Stack direction="col" mobileDirection="row" align="start" mobileAlign="center" gap={2.5}>
              <Font variant="body-bold" text={branch.name} />
              <Badge 
                variant={branch.isOnline ? "success" : "danger"} 
                label={branch.isOnline ? "Online" : "Offline"}
                icon={branch.isOnline ? Wifi : WifiOff}
              />
            </Stack>
            <Font variant="description" text={branch.location} />
            
            {/* Sync Info */}
            {branch.pendingSyncCount > 0 && (
              <Stack direction="row" align="center" gap={1}>
                <Icon icon={RefreshCw} size={12} color="brand-secondary" />
                <Font variant="auxiliary" color="brand-secondary" text={`${branch.pendingSyncCount} registros locais aguardando envio`} />
              </Stack>
            )}
          </Stack>
        </Box>

        <Button 
          variant={isActive ? "outline-primary" : "outline"} 
          label={isActive ? "Ativo" : "Selecionar"} 
          onClick={() => onSelect(branch)}
          disabled={isActive}
        />
      </Stack>
    </Box>
  )
}
