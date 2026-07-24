"use client"

/* eslint-disable max-lines-per-function */

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Badge } from "@/components/store/base/Badge"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { FilterPanel } from "@/components/store/intermediary/FilterPanel"
import { Plus, ClipboardList } from "lucide-react"

export interface BalancoProduct {
  id: string
  name: string
  category: string
  systemStock: number
  counted: string
  diff?: number
}

export interface BalancoSession {
  id: string
  date: string
  groups: string
  status: "Finalizado" | "Pendente"
}

export interface InventoryAuditTableProps {
  products?: BalancoProduct[]
  searchQuery?: string
  onCancel: () => void
  onSave: (products: BalancoProduct[]) => void
  onModeChange?: (mode: "history" | "resumo") => void
}

const DEFAULT_SESSIONS: BalancoSession[] = [
  {
    id: "b1",
    date: "01/06/26 14:49",
    groups: "Todos os grupos selecionados",
    status: "Finalizado",
  },
  {
    id: "b2",
    date: "21/07/26 10:30",
    groups: "Bebidas, Lanches",
    status: "Pendente",
  },
]

const DEFAULT_AUDIT_PRODUCTS: BalancoProduct[] = [
  { id: "1", name: "COCA COLA 2L", category: "BEBIDAS - REFRIGERANTE", systemStock: 20, counted: "0", diff: -20 },
  { id: "2", name: "COCA COLA LATA 350ML", category: "BEBIDAS - REFRIGERANTE", systemStock: 15, counted: "0", diff: -15 },
  { id: "3", name: "ÁGUA COM GÁS", category: "BEBIDAS - ÁGUA", systemStock: 8, counted: "5", diff: -3 },
  { id: "4", name: "FICHA 5,00", category: "CAPELA - Geral", systemStock: -5, counted: "0", diff: 5 },
  { id: "5", name: "CALDO BACALHAU", category: "CAPELA - Geral", systemStock: -5, counted: "0", diff: 5 },
  { id: "6", name: "PASTEL", category: "CAPELA - Geral", systemStock: -3, counted: "0", diff: 3 },
  { id: "7", name: "FICHA 10,00", category: "CAPELA - Geral", systemStock: -3, counted: "0", diff: 3 },
  { id: "8", name: "MEDALHÃO DE BOI", category: "CHURRASCO - BOVINA", systemStock: -1, counted: "0", diff: 1 },
  { id: "9", name: "LINGUIÇA", category: "CHURRASCO - PORCO", systemStock: -1, counted: "0", diff: 1 },
  { id: "10", name: "CORAÇÃO", category: "CHURRASCO - AVE", systemStock: -1, counted: "0", diff: 1 },
]

export const InventoryAuditTable: React.FC<InventoryAuditTableProps> = ({
  products = DEFAULT_AUDIT_PRODUCTS,
  searchQuery = "",
  onCancel,
  onSave,
  onModeChange,
}) => {
  void onCancel
  void onModeChange
  const [viewMode, setViewMode] = React.useState<"history" | "resumo">("history")
  const [sessions] = React.useState<BalancoSession[]>(DEFAULT_SESSIONS)
  const [auditProducts] = React.useState<BalancoProduct[]>(products)

  // Filtros da barra lateral
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>("3M")
  const [startDate, setStartDate] = React.useState("22/04/2026 00:00")
  const [endDate, setEndDate] = React.useState("21/07/2026 23:59")
  const [statusFilters, setStatusFilters] = React.useState({
    pendente: true,
    finalizado: true,
  })

  React.useEffect(() => {
    onModeChange?.(viewMode)
  }, [viewMode, onModeChange])

  const toggleStatus = (key: "pendente" | "finalizado") => {
    setStatusFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleOpenResumo = () => {
    setViewMode("resumo")
  }

  const handleSave = () => {
    onSave(auditProducts)
    setViewMode("history")
  }

  const handleFinalize = () => {
    onSave(auditProducts)
    setViewMode("history")
  }

  const filteredProducts = auditProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSessions = sessions.filter((s) => {
    if (!statusFilters.pendente && s.status === "Pendente") return false
    if (!statusFilters.finalizado && s.status === "Finalizado") return false
    return true
  })

  return (
    <Box position="relative" w="full" h="full">
      {viewMode === "history" ? (
        /* ================= VISÃO 1: BALANÇOS DE ESTOQUE (HISTÓRICO + FILTROS) ================= */
        <Stack direction="col" mobileDirection="row" gap={5} w="full" h="full" align="stretch">
          {/* Painel da Esquerda (Lista de Balanços com Scroll Interno) */}
          <Box flex="1" position="relative" h="full" overflow="x-hidden y-auto">
            <Stack gap={2.5} w="full">
              {filteredSessions.length > 0 ? (
                filteredSessions.map((ses) => (
                  <Box
                    key={ses.id}
                    padding={5}
                    bg="bg-white"
                    radius="default"
                    border={true}
                    borderColor="border-border"
                    hoverBg="surface-sunken"
                    cursor="pointer"
                    onClick={handleOpenResumo}
                    w="full"
                  >
                    <Stack direction="row" align="center" justify="between" w="full">
                      <Stack gap={1} align="start">
                        <Font variant="body-bold" text={ses.date} />
                        <Font variant="auxiliary" color="muted" text={`Grupos: ${ses.groups}`} />
                      </Stack>

                      <Badge
                        variant={ses.status === "Finalizado" ? "success" : "primary"}
                        rounded="full"
                        label={ses.status}
                      />
                    </Stack>
                  </Box>
                ))
              ) : (
                <EmptyState
                  icon={ClipboardList}
                  title="Nenhum balanço encontrado"
                  subtitle="Tente ajustar os filtros ao lado ou crie um novo balanço de estoque."
                />
              )}
            </Stack>

            {/* Botão FAB fixo no canto inferior direito */}
            <Box position="fixed" bottom={6} right={6} zIndex="50">
              <Button
                variant="secondary-pill-icon"
                icon={Plus}
                onClick={handleOpenResumo}
              />
            </Box>
          </Box>

          {/* Painel da Direita (Filtros Sidebar) */}
          <FilterPanel
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            statusOptions={[
              { id: "pendente", label: "Pendente" },
              { id: "finalizado", label: "Finalizado" }
            ]}
            selectedStatusIds={[
              ...(statusFilters.pendente ? ["pendente"] : []),
              ...(statusFilters.finalizado ? ["finalizado"] : [])
            ]}
            onStatusToggle={(id) => toggleStatus(id as "pendente" | "finalizado")}
          />
        </Stack>
      ) : (
        /* ================= VISÃO 2: RESUMO DO BALANÇO ================= */
        <Stack gap={5} w="full">
          {/* Cabeçalho da Lista: Produtos (esquerda) x Diferença (direita) */}
          <Stack direction="row" justify="between" align="center" w="full" paddingX={2.5}>
            <Font variant="body-bold" color="muted" text="Produtos" />
            <Font variant="body-bold" color="muted" text="Diferença" />
          </Stack>

          {/* Lista de Produtos do Balanço */}
          <Box display="flex" direction="col" w="full">
            {filteredProducts.map((prod, idx) => {
              const countedVal = typeof prod.counted === "number" ? prod.counted : (parseInt(prod.counted) || 0)
              const diffVal = prod.diff !== undefined ? prod.diff : (countedVal - prod.systemStock)
              const isNegative = diffVal < 0
              const isPositive = diffVal > 0

              return (
                <Box key={prod.id}>
                  <Box paddingY={2.5} paddingX={2.5} w="full">
                    <Stack direction="row" align="center" justify="between" w="full">
                      {/* Lado Esquerdo: Nome + Categoria */}
                      <Stack gap={1} align="start">
                        <Font variant="body-bold" text={prod.name.toUpperCase()} />
                        <Font
                          variant="auxiliary"
                          color="muted"
                          text={prod.category.toUpperCase()}
                        />
                      </Stack>

                      {/* Lado Direito: Diferença em UN + Estoque detail */}
                      <Stack gap={1} align="end">
                        <Font
                          variant="body-bold"
                          color={isNegative ? "danger" : isPositive ? "primary" : "muted"}
                          text={`${isPositive ? "+" : ""}${diffVal} UN`}
                        />
                        <Font
                          variant="auxiliary"
                          color="muted"
                          text={`Estoque: ${prod.systemStock} > ${countedVal} UN`}
                        />
                      </Stack>
                    </Stack>
                  </Box>
                  {idx < filteredProducts.length - 1 && (
                    <Box h="h-[1px]" w="full" bg="bg-border" />
                  )}
                </Box>
              )
            })}
          </Box>

          {/* Barra de Ações Inferior: Salvar e Finalizar */}
          <Box paddingY={5} w="full">
            <Stack direction="col" mobileDirection="row" gap={2.5} w="full">
              <Button
                variant="outline"
                label="Salvar"
                fullWidth
                onClick={handleSave}
              />
              <Button
                variant="primary"
                label="Finalizar"
                fullWidth
                onClick={handleFinalize}
              />
            </Stack>
          </Box>
        </Stack>
      )}
    </Box>
  )
}
