"use client"

import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Button } from "@/components/store/base/Button"
import { Stack } from "@/components/store/base/Stack"
import { Grid } from "@/components/store/base/Grid"
import { KpiCard } from "@/components/store/intermediary/KpiCard"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { ArrowLeft, Download, BarChart3, PieChart } from "lucide-react"
import { Tenant, Plan } from "@/src/types/domain"

/** Mock type para agrupar as informações */
interface TenantRevenueRow {
  tenant: Pick<Tenant, "tradingName">
  plan: Pick<Plan, "name" | "price">
}

const MOCK_REVENUE: TenantRevenueRow[] = [
  { tenant: { tradingName: "Lanchonete Bom Sabor" }, plan: { name: "Pro", price: 149.90 } },
  { tenant: { tradingName: "Restaurante Gourmet" }, plan: { name: "Enterprise", price: 499.90 } },
  { tenant: { tradingName: "Padaria Delícia" }, plan: { name: "Free", price: 0 } },
]

// eslint-disable-next-line max-lines-per-function
export function RelatoriosSection() {
  const [hideValues, setHideValues] = React.useState<boolean>(false)
  const toggleHideValues = () => setHideValues(prev => !prev)

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
        title="Métricas Financeiras Globais"
        description="Consolidação de receitas, MRR, churn e crescimento."
        icon={BarChart3}
        action={
          <Button
            variant="primary"
            label="Exportar PDF"
            icon={Download}
            onClick={() => {}}
          />
        }
      >
        <Grid cols={3} gap={5}>
          <KpiCard
            title="MRR (Receita Mensal)"
            value="R$ 18.420,00"
            subtitle="Crescimento de +12.4% este mês"
            hideValues={hideValues}
            onToggleHide={toggleHideValues}
          />
          <KpiCard
            title="ARR (Receita Anualizada)"
            value="R$ 221.040,00"
            subtitle="Previsão baseada no MRR atual"
            hideValues={hideValues}
            onToggleHide={toggleHideValues}
          />
          <KpiCard
            title="LTV Médio (Tempo de Vida)"
            value="R$ 1.800,00"
            subtitle="Ticket médio acumulado por tenant"
            hideValues={hideValues}
            onToggleHide={toggleHideValues}
          />
        </Grid>
      </RegistrySection>

      <RegistrySection 
        title="Receita por Locatário"
        description="Faturamento detalhado por cada empresa cadastrada."
        icon={PieChart}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead text="Empresa" />
              <TableHead text="Plano Contratado" />
              <TableHead align="right" text="Faturamento Anual Previsto" />
              <TableHead align="right" text="Faturamento Mensal" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_REVENUE.map((row, idx) => {
              const annualRevenue = row.plan.price * 12
              return (
                <TableRow key={idx}>
                  <TableCell fontWeight="medium">{row.tenant.tradingName}</TableCell>
                  <TableCell>{row.plan.name}</TableCell>
                  <TableCell align="right">
                    {annualRevenue === 0 ? "R$ 0,00" : `R$ ${annualRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  </TableCell>
                  <TableCell align="right">
                    {row.plan.price === 0 ? "R$ 0,00" : `R$ ${row.plan.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </RegistrySection>
    </>
  )
}
