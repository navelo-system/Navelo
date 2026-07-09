import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Badge } from "@/components/store/base/Badge"
import { AuditLog, AuditSeverity } from "@/src/types/domain"

const RECENT_LOGS: AuditLog[] = [
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

export function AuditLogTable() {
  return (
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
        {RECENT_LOGS.map(log => (
          <TableRow key={log.id}>
            <TableCell fontWeight="medium">{String(log.createdAt)}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.entityType}</TableCell>
            <TableCell>{log.ipAddress ?? "—"}</TableCell>
            <TableCell align="right">
              <Badge variant={severityVariant(log.severity)} label={severityLabel(log.severity)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
