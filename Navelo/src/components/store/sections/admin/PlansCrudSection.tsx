import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Stack } from "@/components/store/base/Stack"
import { Button } from "@/components/store/base/Button"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Badge } from "@/components/store/base/Badge"
import { CreditCard, Plus, Edit2, Trash2, ArrowLeft } from "lucide-react"
import { PlanStatus } from "@/src/types/domain"
import { Plan, PlanFormModal } from "./modals/PlanFormModal"
import { APP_FEATURES } from "@/src/constants/features"
import { FilterBar } from "@/components/store/intermediary/FilterBar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"

// eslint-disable-next-line max-lines-per-function
export const PlansCrudSection: React.FC = () => {
  const [plans, setPlans] = React.useState<Plan[]>([
    { id: "1", name: "Plano Free", price: 0, status: PlanStatus.ACTIVE, features: ["pos_touch", "thermal_print"] },
    { id: "2", name: "Plano Pro", price: 149.90, status: PlanStatus.ACTIVE, features: ["pos_touch", "thermal_print", "bill_splitter", "cash_session", "bento_dashboard", "peripherals_manager"] },
    { id: "3", name: "Plano Enterprise", price: 499.90, status: PlanStatus.ACTIVE, features: APP_FEATURES.map((f: { id: string }) => f.id) }
  ])

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingPlan, setEditingPlan] = React.useState<Plan | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleOpenCreate = () => {
    setEditingPlan(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setIsModalOpen(true)
  }

  const handleSavePlan = (name: string, price: number, features: string[]) => {
    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? {
        ...p,
        name,
        price,
        features
      } : p))
    } else {
      const newPlan: Plan = {
        id: crypto.randomUUID(),
        name,
        price,
        status: PlanStatus.ACTIVE,
        features
      }
      setPlans(prev => [...prev, newPlan])
    }
  }

  const handleDelete = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id))
  }

  const filteredPlans = plans.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        title="CRUD de Planos e Features"
        description="Gerencie os níveis de assinatura e quais módulos cada plano pode acessar."
        icon={CreditCard}
        action={<Button variant="primary" label="Novo Plano" icon={Plus} onClick={handleOpenCreate} />}
      >
        <Stack gap={5}>
          <FilterBar
            searchPlaceholder="Buscar plano por nome..."
            onSearch={setSearchQuery}
          />

          {filteredPlans.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="Nenhum plano encontrado"
              subtitle="Nenhum plano corresponde ao termo pesquisado."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead text="Nome do Plano" />
                  <TableHead text="Preço Mensal" />
                  <TableHead text="Módulos Ativos" />
                  <TableHead text="Status" />
                  <TableHead align="right" text="Ações" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map(plan => (
                  <TableRow key={plan.id}>
                    <TableCell fontWeight="medium">{plan.name}</TableCell>
                    <TableCell>
                      {plan.price === 0 ? "Grátis" : `R$ ${plan.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    </TableCell>
                    <TableCell>
                      {`${plan.features.length} de ${APP_FEATURES.length} módulos ativados`}
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.status === PlanStatus.ACTIVE ? "success" : "danger"} label={plan.status === PlanStatus.ACTIVE ? "Ativo" : "Inativo"} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" gap={2.5} justify="end">
                        <Button variant="outline-icon" icon={Edit2} onClick={() => handleOpenEdit(plan)} />
                        <Button variant="danger-icon" icon={Trash2} onClick={() => handleDelete(plan.id)} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Modal Form */}
          {isModalOpen && (
            <PlanFormModal 
              key={editingPlan ? editingPlan.id : "new"}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              plan={editingPlan}
              onSave={handleSavePlan}
            />
          )}
        </Stack>
      </RegistrySection>
    </>
  )
}
