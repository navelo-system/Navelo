"use client"

import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Button } from "@/components/store/base/Button"
import { Stack } from "@/components/store/base/Stack"
import { Input } from "@/components/store/base/Input"
import { Badge } from "@/components/store/base/Badge"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/store/base/Modal"
import { Switch } from "@/components/store/base/Switch"
import { FilterBar } from "@/components/store/intermediary/FilterBar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Form } from "@/components/store/advanced/Form"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Users, ArrowLeft, Plus, CreditCard } from "lucide-react"

import { TenantListTable, TenantListRow } from "@/components/store/intermediary/TenantListTable"

const MOCK_TENANTS: TenantListRow[] = [
  { id: "1", corporateName: "Lanchonete Bom Sabor LTDA", tradingName: "Lanchonete Bom Sabor", cnpj: "12.345.678/0001-99", subscriptionId: "plan-002", isActive: true, planName: "Pro", monthlyFee: 149.90 },
  { id: "2", corporateName: "Restaurante Gourmet SA", tradingName: "Restaurante Gourmet", cnpj: "98.765.432/0001-00", subscriptionId: "plan-003", isActive: true, planName: "Enterprise", monthlyFee: 499.90 },
  { id: "3", corporateName: "Padaria Delícia ME", tradingName: "Padaria Delícia", cnpj: "45.678.901/0001-22", subscriptionId: "plan-001", isActive: false, planName: "Free", monthlyFee: 0 },
  { id: "4", corporateName: "Mercado Central Eireli", tradingName: "Mercado Central", cnpj: "11.222.333/0001-44", subscriptionId: "plan-002", isActive: true, planName: "Pro", monthlyFee: 149.90 },
]

const plans = [
  { name: "Free", fee: 0 },
  { name: "Pro", fee: 149.90 },
  { name: "Enterprise", fee: 499.90 },
]

// eslint-disable-next-line max-lines-per-function
export function TenantsSection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [tenants, setTenants] = React.useState<TenantListRow[]>(MOCK_TENANTS)

  // Form State — campos alinhados com Tenant do domain.ts
  const [tradingName, setTradingName] = React.useState("")
  const [cnpj, setCnpj] = React.useState("")
  const [selectedPlan, setSelectedPlan] = React.useState("Pro")
  const [isActive, setIsActive] = React.useState(true)

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tradingName || !cnpj) return

    const planObj = plans.find(p => p.name === selectedPlan)
    const newTenant: TenantListRow = {
      id: crypto.randomUUID(),
      corporateName: tradingName,
      tradingName,
      cnpj,
      subscriptionId: `plan-${selectedPlan.toLowerCase()}`,
      isActive,
      planName: selectedPlan,
      monthlyFee: planObj ? planObj.fee : 0,
    }

    setTenants(prev => [...prev, newTenant])
    setIsModalOpen(false)
    setTradingName("")
    setCnpj("")
    setSelectedPlan("Pro")
    setIsActive(true)
  }

  const filteredTenants = tenants.filter(t =>
    t.tradingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.cnpj.includes(searchQuery)
  )

  return (
    <>
      <Stack direction="row" align="start">
        <Button
          variant="ghost-ghost"
          label="Voltar ao Painel"
          icon={ArrowLeft}
          onClick={() => window.location.href = "/admin"}
        />
      </Stack>

      <RegistrySection
        title="Lista de Empresas (Tenants)"
        description="Gerencie as contas de inquilinos e status das licenças."
        icon={Users}
        action={
          <Button
            variant="primary"
            label="Nova Empresa"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          />
        }
      >
        <Stack gap={5}>
          <FilterBar
            searchPlaceholder="Buscar por nome da empresa ou CNPJ..."
            onSearch={setSearchQuery}
          />

          {filteredTenants.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhuma empresa encontrada"
              subtitle="Nenhuma empresa corresponde ao termo pesquisado."
            />
          ) : (
            <TenantListTable tenants={filteredTenants} />
          )}
        </Stack>
      </RegistrySection>

      {isModalOpen && (
        <Form onSubmit={handleCreateTenant}>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <ModalHeader
              title="Nova Empresa"
              subtitle="Cadastre manualmente uma empresa cliente do SaaS."
              icon={Users}
            />
            <ModalBody>
              <Stack gap={5}>
                <Input
                  label="Nome Fantasia"
                  placeholder="Nome comercial da empresa"
                  value={tradingName}
                  onChange={e => setTradingName(e.target.value)}
                  required
                />
                <Input
                  label="CNPJ"
                  placeholder="Ex: 00.000.000/0000-00"
                  value={cnpj}
                  onChange={e => setCnpj(e.target.value)}
                  required
                />

                <Stack gap={2.5}>
                  <Badge variant="outline" label="Plano de Cobrança" />
                  <CustomSelect value={selectedPlan} onChange={setSelectedPlan}>
                    {plans.map(p => (
                      <CustomSelectItem
                        key={p.name}
                        value={p.name}
                        text={`${p.name} (${p.fee === 0 ? "Grátis" : `R$ ${p.fee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/mês`})`}
                        icon={CreditCard}
                      />
                    ))}
                  </CustomSelect>
                </Stack>

                <Stack direction="row" align="center" justify="between">
                  <Badge variant="outline" label="Status Inicial Ativo" />
                  <Switch
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                </Stack>
              </Stack>
            </ModalBody>
            <ModalFooter
              onCancel={() => setIsModalOpen(false)}
              confirmLabel="Salvar Empresa"
              isSubmit
            />
          </Modal>
        </Form>
      )}
    </>
  )
}
