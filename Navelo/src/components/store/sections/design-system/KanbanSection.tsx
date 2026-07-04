import { RegistrySection } from "../../advanced/RegistrySection"
import { Grid } from "../../base/Grid"
import { OrderCard, OrderItemType } from "../../intermediary/OrderCard"
import { KanbanColumn } from "../../intermediary/KanbanColumn"
import { ChefHat } from "lucide-react"

export function KanbanSection() {
  const queueItems: OrderItemType[] = [
    { id: "1", name: "Hambúrguer Clássico", quantity: 2, notes: "Sem cebola, bem passado" },
    { id: "2", name: "Batata Frita M", quantity: 1 }
  ]

  const preparingItems: OrderItemType[] = [
    { id: "3", name: "Pizza Calabresa", quantity: 1, notes: "Borda recheada" },
    { id: "4", name: "Coca-Cola 2L", quantity: 1 }
  ]

  const doneItems: OrderItemType[] = [
    { id: "5", name: "Combo Executivo", quantity: 3 }
  ]

  return (
    <RegistrySection
      title="KDS / Kanban da Cozinha"
      description="Painel de controle para cozinha (Kitchen Display System), pronto para arrastar e soltar (drag and drop)."
      icon={ChefHat}
      id="kanban-section"
    >
      <Grid cols={3} gap={5}>
        <KanbanColumn title="Na Fila" count={2} colorClass="bg-brand-secondary">
          <OrderCard orderId="1042" tableNumber="5" status="queue" time="15:20" items={queueItems} />
          <OrderCard orderId="1043" tableNumber="Balcão" status="queue" time="04:10" items={queueItems} />
        </KanbanColumn>

        <KanbanColumn title="Preparando" count={1} colorClass="bg-brand-primary">
          <OrderCard orderId="1041" tableNumber="12" status="preparing" time="25:10" items={preparingItems} />
        </KanbanColumn>

        <KanbanColumn title="Pronto" count={3} colorClass="bg-emerald-500">
          <OrderCard orderId="1039" tableNumber="3" status="done" time="45:00" items={doneItems} />
          <OrderCard orderId="1038" status="done" time="50:00" items={doneItems} />
          <OrderCard orderId="1037" status="done" time="55:00" items={doneItems} />
        </KanbanColumn>
      </Grid>
    </RegistrySection>
  )
}
