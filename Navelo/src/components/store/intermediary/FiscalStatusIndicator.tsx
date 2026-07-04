import * as React from "react"
import { Box } from "../base/Box"
import { Stack } from "../base/Stack"
import { Font } from "../base/Font"
import { Badge } from "../base/Badge"
import { SectionHeader } from "./SectionHeader"
import { Alert } from "./Alert"
import { ShieldCheck, AlertCircle, Wifi, WifiOff } from "lucide-react"

export interface FiscalStatusIndicatorProps {
  status?: "online" | "contingency" | "offline"
  pendingInvoicesCount?: number
  environment?: "homologacao" | "producao"
}

export const FiscalStatusIndicator: React.FC<FiscalStatusIndicatorProps> = ({
  status = "online",
  pendingInvoicesCount = 3,
  environment = "homologacao",
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case "online":
        return <Badge variant="success" label="Autorizador SEFAZ online" icon={Wifi} />
      case "contingency":
        return <Badge variant="secondary" label="Modo contingência ativo" icon={AlertCircle} />
      case "offline":
        return <Badge variant="danger" label="SEFAZ fora do ar" icon={WifiOff} />
    }
  }

  return (
    <Box padding={5} bg="bg-surface" radius="default">
      <Stack gap={5}>
        {/* Header */}
        <SectionHeader
          icon={ShieldCheck}
          title="Módulo Fiscal (NFC-e)"
          subtitle="Monitore a comunicação tributária com a SEFAZ."
          action={getStatusBadge()}
        />

        <Box borderBottom borderColor="border-border" w="full" />

        {/* Info Grid */}
        <Stack gap={2.5}>
          <Stack direction="row" align="center" justify="between" gap={5}>
            <Font variant="body-sm-medium" text="Ambiente Fiscal" />
            <Badge 
              variant={environment === "producao" ? "success" : "primary"} 
              label={environment === "producao" ? "Produção" : "Homologação"} 
            />
          </Stack>

          <Stack direction="row" align="center" justify="between" gap={5}>
            <Font variant="body-sm-medium" text="Notas Pendentes de Sincronização" />
            <Badge 
              variant={pendingInvoicesCount > 0 ? "danger" : "success"} 
              label={pendingInvoicesCount > 0 ? `${pendingInvoicesCount} pendentes` : "Tudo em dia"} 
            />
          </Stack>
        </Stack>

        {status === "contingency" && (
          <Alert 
            variant="warning" 
            description="Notas geradas em contingência serão sincronizadas automaticamente assim que a conexão estabilizar." 
          />
        )}
      </Stack>
    </Box>
  )
}
