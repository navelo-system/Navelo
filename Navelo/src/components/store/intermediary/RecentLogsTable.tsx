import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Badge } from "@/components/store/base/Badge"

type Severity = "info" | "warning" | "error"

interface LogEntry {
  id: string
  timestamp: string
  action: string
  user: string
  ip: string
  severity: Severity
}

const RECENT_LOGS: LogEntry[] = [
  { id: "1", timestamp: "2026-07-05 10:45:12", action: "Tenant 'Lanchonete Bom Sabor' criado", user: "admin@navelo.com", ip: "192.168.1.15", severity: "info" },
  { id: "2", timestamp: "2026-07-05 09:30:00", action: "Tentativa de login malsucedida", user: "unknown@visitor.com", ip: "203.0.113.88", severity: "warning" },
  { id: "3", timestamp: "2026-07-04 22:15:33", action: "Plano 'Pro' atualizado (Preço: R$ 149,90)", user: "admin@navelo.com", ip: "192.168.1.15", severity: "info" },
  { id: "4", timestamp: "2026-07-04 18:02:11", action: "Falha na sincronização de notas fiscais da Sefaz", user: "system@navelo.com", ip: "127.0.0.1", severity: "error" },
  { id: "5", timestamp: "2026-07-04 14:10:05", action: "Configurações tributárias globais alteradas", user: "admin@navelo.com", ip: "192.168.1.15", severity: "info" },
]

const severityVariant = (s: Severity) =>
  s === "error" ? "danger" : s === "warning" ? "secondary" : "success"

export function RecentLogsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead text="Data/Hora" />
          <TableHead text="Ação" />
          <TableHead text="Usuário" />
          <TableHead text="IP" />
          <TableHead align="right" text="Severidade" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {RECENT_LOGS.map(log => (
          <TableRow key={log.id}>
            <TableCell fontWeight="medium">{log.timestamp}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.user}</TableCell>
            <TableCell>{log.ip}</TableCell>
            <TableCell align="right">
              <Badge variant={severityVariant(log.severity)} label={log.severity.toUpperCase()} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
