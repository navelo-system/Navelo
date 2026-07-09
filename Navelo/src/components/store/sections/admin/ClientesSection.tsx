"use client"

import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Button } from "@/components/store/base/Button"
import { Stack } from "@/components/store/base/Stack"
import { Input } from "@/components/store/base/Input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Badge } from "@/components/store/base/Badge"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/store/base/Modal"
import { Switch } from "@/components/store/base/Switch"
import { FilterBar } from "@/components/store/intermediary/FilterBar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Form } from "@/components/store/advanced/Form"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { Users, ArrowLeft, Plus, MoreHorizontal, CreditCard } from "lucide-react"

interface ClientTenant {
  id: string
  name: string
  document: string
  plan: string
  status: "active" | "inactive"
  monthlyFee: number
}

// eslint-disable-next-line max-lines-per-function
export function ClientesSection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [tenants, setTenants] = React.useState<ClientTenant[]>([
    { id: "1", name: "Lanchonete Bom Sabor", document: "12.345.678/0001-99", plan: "Pro", status: "active", monthlyFee: 149.90 },
    { id: "2", name: "Restaurante Gourmet", document: "98.765.432/0001-00", plan: "Enterprise", status: "active", monthlyFee: 499.90 },
    { id: "3", name: "Padaria Delícia", document: "45.678.901/0001-22", plan: "Free", status: "inactive", monthlyFee: 0 },
    { id: "4", name: "Mercado Central", document: "11.222.333/0001-44", plan: "Pro", status: "active", monthlyFee: 149.90 },
  ])

  // Form State
  const [name, setName] = React.useState("")
  const [document, setDocument] = React.useState("")
  const [selectedPlan, setSelectedPlan] = React.useState("Pro")
  const [status, setStatus] = React.useState<"active" | "inactive">("active")

  const plans = [
    { name: "Free", fee: 0 },
    { name: "Pro", fee: 149.90 },
    { name: "Enterprise", fee: 499.90 }
  ]

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !document) return

    const planObj = plans.find(p => p.name === selectedPlan)
    const newTenant: ClientTenant = {
      id: crypto.randomUUID(),
      name,
      document,
      plan: selectedPlan,
      status,
      monthlyFee: planObj ? planObj.fee : 0
    }

    setTenants(prev => [...prev, newTenant])
    setIsModalOpen(false)

    // Reset Form
    setName("")
    setDocument("")
    setSelectedPlan("Pro")
    setStatus("active")
  }

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.document.includes(searchQuery)
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
        title="Lista de Locatários"
        description="Gerencie as contas de inquilinos e status das licenças."
        icon={Users}
        action={
          <Button
            variant="primary"
            label="Novo Inquilino"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          />
        }
      >
        <Stack gap={5}>
          <FilterBar
            searchPlaceholder="Buscar por nome da empresa ou documento..."
            onSearch={setSearchQuery}
          />

          {filteredTenants.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhum inquilino encontrado"
              subtitle="Nenhuma empresa corresponde ao termo pesquisado."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead text="Empresa" />
                  <TableHead text="Documento" />
                  <TableHead text="Plano" />
                  <TableHead text="Status" />
                  <TableHead align="right" text="Mensalidade" />
                  <TableHead w="w-[50px]" text="" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map(tenant => (
                  <TableRow key={tenant.id}>
                    <TableCell fontWeight="medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.document}</TableCell>
                    <TableCell>
                      <Badge
                        variant={tenant.plan === "Enterprise" ? "primary" : tenant.plan === "Free" ? "outline" : "success"}
                        label={tenant.plan}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={tenant.status === "active" ? "success" : "danger"}
                        label={tenant.status === "active" ? "Ativo" : "Inativo"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {tenant.monthlyFee === 0 ? "Grátis" : `R$ ${tenant.monthlyFee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="outline-icon-xs" icon={MoreHorizontal} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Stack>
      </RegistrySection>

      {/* New Client Modal */}
      {isModalOpen && (
        <Form onSubmit={handleCreateTenant}>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <ModalHeader
              title="Novo Cliente Locatário"
              subtitle="Cadastre manualmente uma empresa cliente do SaaS."
              icon={Users}
            />
            <ModalBody>
              <Stack gap={5}>
                <Input
                  label="Nome da Empresa"
                  placeholder="Nome fantasia ou Razão Social"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <Input
                  label="CNPJ / Documento"
                  placeholder="Ex: 00.000.000/0000-00"
                  value={document}
                  onChange={e => setDocument(e.target.value)}
                  required
                />
                
                <Stack gap={2.5}>
                  <Badge variant="outline" label="Plano de Cobrança" />
                  <CustomSelect
                    value={selectedPlan}
                    onChange={setSelectedPlan}
                  >
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
                    checked={status === "active"}
                    onChange={(e) => setStatus(e.target.checked ? "active" : "inactive")}
                  />
                </Stack>
              </Stack>
            </ModalBody>
            <ModalFooter
              onCancel={() => setIsModalOpen(false)}
              confirmLabel="Salvar Inquilino"
              isSubmit
            />
          </Modal>
        </Form>
      )}
    </>
  )
}
