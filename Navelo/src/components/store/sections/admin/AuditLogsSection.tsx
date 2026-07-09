"use client"

import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Button } from "@/components/store/base/Button"
import { Stack } from "@/components/store/base/Stack"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Badge } from "@/components/store/base/Badge"
import { FilterBar } from "@/components/store/intermediary/FilterBar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { AuditLog, AuditSeverity } from "@/src/types/domain"
import { ArrowLeft, RefreshCw, Activity } from "lucide-react"

const MOCK_LOGS: AuditLog[] = [
  { id: "1", userId: "admin-001", action: "Tenant 'Lanchonete Bom Sabor' criado", entityId: "tenant-001", entityType: "Tenant", createdAt: "2026-07-05 10:45:12", ipAddress: "192.168.1.15", severity: AuditSeverity.INFO },
  { id: "2", userId: "unknown-001", action: "Tentativa de login malsucedida", entityId: "unknown-001", entityType: "User", createdAt: "2026-07-05 09:30:00", ipAddress: "203.0.113.88", severity: AuditSeverity.WARNING },
  { id: "3", userId: "admin-001", action: "Plano 'Pro' atualizado (Preço: R$ 149,90)", entityId: "plan-002", entityType: "Plan", createdAt: "2026-07-04 22:15:33", ipAddress: "192.168.1.15", severity: AuditSeverity.INFO },
  { id: "4", userId: "system-001", action: "Falha na sincronização de notas fiscais da Sefaz", entityId: "system-001", entityType: "Invoice", createdAt: "2026-07-04 18:02:11", ipAddress: "127.0.0.1", severity: AuditSeverity.ERROR },
  { id: "5", userId: "admin-001", action: "Configurações tributárias globais alteradas", entityId: "config-001", entityType: "TaxRule", createdAt: "2026-07-04 14:10:05", ipAddress: "192.168.1.15", severity: AuditSeverity.INFO },
]

const severityVariant = (s?: AuditSeverity) =>
  s === AuditSeverity.ERROR ? "danger" : s === AuditSeverity.WARNING ? "secondary" : "success"

const severityLabel = (s?: AuditSeverity) =>
  s === AuditSeverity.ERROR ? "ERRO" : s === AuditSeverity.WARNING ? "ALERTA" : "INFO"

export function AuditLogsSection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [logs, setLogs] = React.useState<AuditLog[]>(MOCK_LOGS)

  const handleRefresh = () => {
    setLogs(prev => [...prev])
  }

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.ipAddress ?? "").includes(searchQuery)
  )

  return (
    <>
      <Stack direction="row" align="start" w="fit-content">
        <Button
          variant="ghost-ghost"
          label="Voltar ao Painel"
          icon={ArrowLeft}
          onClick={() => window.location.href = "/admin"}
        />
      </Stack>

      <RegistrySection
        title="Histórico de Atividades"
        description="Histórico de eventos e auditoria de ações na plataforma."
        icon={Activity}
        action={
          <Button
            variant="primary"
            label="Atualizar"
            icon={RefreshCw}
            onClick={handleRefresh}
          />
        }
      >
        <Stack gap={5}>
          <FilterBar
            searchPlaceholder="Buscar por ação, tipo de entidade ou IP..."
            onSearch={setSearchQuery}
          />

          {filteredLogs.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="Nenhum log encontrado"
              subtitle="Nenhum evento corresponde ao termo pesquisado."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead text="Data/Hora" />
                  <TableHead text="Ação" />
                  <TableHead text="Entidade" />
                  <TableHead text="IP" />
                  <TableHead align="right" text="Severidade" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell fontWeight="medium">{String(log.createdAt)}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.entityType}</TableCell>
                    <TableCell>{log.ipAddress ?? "—"}</TableCell>
                    <TableCell align="right">
                      <Badge
                        variant={severityVariant(log.severity)}
                        label={severityLabel(log.severity)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Stack>
      </RegistrySection>
    </>
  )
}
