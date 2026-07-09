"use client"

import * as React from "react"
import { RegistrySection } from "@/components/store/advanced/RegistrySection"
import { Button } from "@/components/store/base/Button"
import { Stack } from "@/components/store/base/Stack"
import { Input } from "@/components/store/base/Input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/store/base/Table"
import { Badge } from "@/components/store/base/Badge"
import { Modal } from "@/components/store/base/Modal"
import { Form } from "@/components/store/advanced/Form"
import { CustomSelect, CustomSelectItem } from "@/components/store/base/CustomSelect"
import { FilterBar } from "@/components/store/intermediary/FilterBar"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { User, UserRole } from "@/src/types/domain"
import { Users, ArrowLeft, Plus, User as UserIcon, Shield, Mail } from "lucide-react"

/** Dados de exibição enriquecidos — tenantName vem de um join com Tenant na API real */
interface UserListRow extends User {
  tenantName?: string
}

const roleVariant = (role: UserRole) => {
  if (role === UserRole.ADMIN) return "danger"
  if (role === UserRole.MANAGER) return "primary"
  if (role === UserRole.CASHIER) return "success"
  return "outline"
}

const roleLabel = (role: UserRole) => {
  if (role === UserRole.ADMIN) return "Administrador"
  if (role === UserRole.MANAGER) return "Gerente"
  if (role === UserRole.CASHIER) return "Caixa"
  return "Atendente"
}

const MOCK_USERS: UserListRow[] = [
  { id: "1", name: "Carlos Silva", email: "carlos@bomsabor.com", passwordHash: "", role: UserRole.CASHIER, tenantId: "tenant-001", tenantName: "Lanchonete Bom Sabor" },
  { id: "2", name: "Ana Souza", email: "ana@gourmet.com", passwordHash: "", role: UserRole.ADMIN, tenantId: "tenant-002", tenantName: "Restaurante Gourmet" },
  { id: "3", name: "Marcos Oliveira", email: "marcos@padaria.com", passwordHash: "", role: UserRole.MANAGER, tenantId: "tenant-003", tenantName: "Padaria Delícia" },
]

const tenantsList = [
  { id: "tenant-001", name: "Lanchonete Bom Sabor" },
  { id: "tenant-002", name: "Restaurante Gourmet" },
  { id: "tenant-003", name: "Padaria Delícia" },
]

// eslint-disable-next-line max-lines-per-function
export function UsuariosSection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [users, setUsers] = React.useState<UserListRow[]>(MOCK_USERS)

  const [newName, setNewName] = React.useState("")
  const [newEmail, setNewEmail] = React.useState("")
  const [newTenantId, setNewTenantId] = React.useState("tenant-001")
  const [newRole, setNewRole] = React.useState<UserRole>(UserRole.CASHIER)

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newEmail) return

    const newUser: UserListRow = {
      id: crypto.randomUUID(),
      name: newName,
      email: newEmail,
      passwordHash: "",
      role: newRole,
      tenantId: newTenantId,
      tenantName: tenantsList.find(t => t.id === newTenantId)?.name,
    }

    setUsers(prev => [...prev, newUser])
    setIsModalOpen(false)
    setNewName("")
    setNewEmail("")
    setNewTenantId("tenant-001")
    setNewRole(UserRole.CASHIER)
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.tenantName ?? "").toLowerCase().includes(searchQuery.toLowerCase())
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
        title="Gestão de Usuários"
        description="Lista de logins, convite de novos membros e concessão de cargos."
        icon={Shield}
        action={
          <Button
            variant="primary"
            label="Novo Usuário"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          />
        }
      >
        <Stack gap={5}>
          <FilterBar
            searchPlaceholder="Buscar por nome, email ou empresa..."
            onSearch={setSearchQuery}
          />

          {filteredUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhum usuário encontrado"
              subtitle="Nenhum usuário corresponde ao termo pesquisado."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead text="Nome" />
                  <TableHead text="E-mail" />
                  <TableHead text="Empresa" />
                  <TableHead align="right" text="Cargo" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(u => (
                  <TableRow key={u.id}>
                    <TableCell fontWeight="medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.tenantName ?? u.tenantId}</TableCell>
                    <TableCell align="right">
                      <Badge variant={roleVariant(u.role)} label={roleLabel(u.role)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Stack>
      </RegistrySection>

      {isModalOpen && (
        <Form onSubmit={handleCreateUser}>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Novo Usuário"
            subtitle="Cadastre uma credencial e associe a uma empresa."
            icon={Users}
            successText="Salvar Usuário"
            isSubmit
          >
            <Stack gap={5}>
              <Input
                label="Nome Completo"
                placeholder="Nome do colaborador"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                required
              />
              <Input
                label="Endereço de E-mail"
                placeholder="exemplo@empresa.com"
                icon={Mail}
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                required
              />
              <Stack gap={2.5}>
                <Badge variant="outline" label="Empresa Inquilina" />
                <CustomSelect value={newTenantId} onChange={setNewTenantId}>
                  {tenantsList.map(t => (
                    <CustomSelectItem key={t.id} value={t.id} text={t.name} icon={UserIcon} />
                  ))}
                </CustomSelect>
              </Stack>

              <Stack gap={2.5}>
                <Badge variant="outline" label="Cargo / Nível de Acesso" />
                <CustomSelect value={newRole} onChange={(v) => setNewRole(v as UserRole)}>
                  <CustomSelectItem value={UserRole.CASHIER} text="Caixa" icon={UserIcon} />
                  <CustomSelectItem value={UserRole.ATTENDANT} text="Atendente" icon={UserIcon} />
                  <CustomSelectItem value={UserRole.MANAGER} text="Gerente" icon={Shield} />
                  <CustomSelectItem value={UserRole.ADMIN} text="Administrador" icon={Shield} />
                </CustomSelect>
              </Stack>
            </Stack>
          </Modal>
        </Form>
      )}
    </>
  )
}
