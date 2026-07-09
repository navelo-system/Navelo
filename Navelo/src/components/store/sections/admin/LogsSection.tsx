"use client"

import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Button } from "@/components/store/base/Button"
import { Stack } from "@/components/store/base/Stack"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Badge } from "@/components/store/base/Badge"
import { FilterBar } from "@/components/store/intermediary/FilterBar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { ArrowLeft, RefreshCw, Activity } from "lucide-react"

interface SystemLog {
  id: string
  timestamp: string
  action: string
  user: string
  ip: string
  severity: "info" | "warning" | "error"
}

// eslint-disable-next-line max-lines-per-function
export function LogsSection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [logs, setLogs] = React.useState<SystemLog[]>([
    { id: "1", timestamp: "2026-07-05 10:45:12", action: "Tenant 'Lanchonete Bom Sabor' criado", user: "admin@navelo.com", ip: "192.168.1.15", severity: "info" },
    { id: "2", timestamp: "2026-07-05 09:30:00", action: "Tentativa de login malsucedida", user: "unknown@visitor.com", ip: "203.0.113.88", severity: "warning" },
    { id: "3", timestamp: "2026-07-04 22:15:33", action: "Plano 'Pro' atualizado (Preço: R$ 149,90)", user: "admin@navelo.com", ip: "192.168.1.15", severity: "info" },
    { id: "4", timestamp: "2026-07-04 18:02:11", action: "Falha na sincronização de notas fiscais da Sefaz", user: "system@navelo.com", ip: "127.0.0.1", severity: "error" },
    { id: "5", timestamp: "2026-07-04 14:10:05", action: "Configurações tributárias globais alteradas", user: "admin@navelo.com", ip: "192.168.1.15", severity: "info" },
  ])

  const handleRefresh = () => {
    setLogs(prev => [...prev])
  }

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.ip.includes(searchQuery)
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
            searchPlaceholder="Buscar por ação, usuário ou IP..."
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
                  <TableHead text="Usuário" />
                  <TableHead text="IP" />
                  <TableHead align="right" text="Severidade" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell fontWeight="medium">{log.timestamp}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell align="right">
                      <Badge
                        variant={log.severity === "error" ? "danger" : log.severity === "warning" ? "secondary" : "success"}
                        label={log.severity.toUpperCase()}
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
