import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Button } from "../base/Button"
import { SectionHeader } from "../intermediary/SectionHeader"
import { BranchRow, Branch } from "../intermediary/BranchRow"
import { Building, RefreshCw } from "lucide-react"

export interface BranchSwitcherProps {
  branches?: Branch[]
  activeBranchId?: string
  onSelectBranch?: (branch: Branch) => void
  onSyncAll?: () => void
}

export const BranchSwitcher: React.FC<BranchSwitcherProps> = ({
  branches = [
    { id: "1", name: "Matriz Centro", location: "São Paulo - SP", isOnline: true, pendingSyncCount: 0 },
    { id: "2", name: "Filial Shopping", location: "Campinas - SP", isOnline: true, pendingSyncCount: 4 },
    { id: "3", name: "Delivery Hub", location: "São Bernardo - SP", isOnline: false, pendingSyncCount: 17 },
  ],
  activeBranchId = "1",
  onSelectBranch,
  onSyncAll,
}) => {
  const [selectedId, setSelectedId] = React.useState(activeBranchId)
  const [syncing, setSyncing] = React.useState(false)

  const handleSelect = (branch: Branch) => {
    setSelectedId(branch.id)
    if (onSelectBranch) onSelectBranch(branch)
  }

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => {
      setSyncing(false)
      if (onSyncAll) onSyncAll()
      console.warn("Sincronização concluída com o servidor central!")
    }, 1500)
  }

  return (
    <Box padding={0}>
      <Stack gap={5}>
        {/* Header */}
        <SectionHeader
          icon={Building}
          title="Seletor de Filiais (Multiempresa)"
          subtitle="Monitore conexões, sincronização local e selecione o terminal ativo."
          action={
            <Button
              variant="outline-icon-xs"
              icon={RefreshCw}
              onClick={handleSync}
              disabled={syncing}
            />
          }
        />

        <Box borderBottom borderColor="border-border" w="full" />

        {/* Branch Grid */}
        <Stack gap={2.5}>
          {branches.map((branch) => (
            <BranchRow 
              key={branch.id}
              branch={branch}
              isActive={branch.id === selectedId}
              onSelect={handleSelect}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}
