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
import { UI_STRINGS } from "@/constants/strings"

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
  const u = UI_STRINGS.admin.users
  if (role === UserRole.ADMIN) return u.adminRole
  if (role === UserRole.MANAGER) return u.managerRole
  if (role === UserRole.CASHIER) return u.cashierRole
  return u.attendantRole
}

const MOCK_USERS: UserListRow[] = [
  { id: "1", name: "Carlos Silva", email: "carlos@bomsabor.com", passwordHash: "", role: UserRole.CASHIER, tenantId: "tenant-001", tenantName: "Lanchonete Bom Sabor" },
  { id: "2", name: "Ana Souza", email: "ana@gourmet.com", passwordHash: "", role: UserRole.ADMIN, tenantId: "tenant-002", tenantName: "Restaurante Gourmet" },
  { id: "3", name: "Marcos Oliveira", email: "marcos@padaria.com", passwordHash: "", role: UserRole.MANAGER, tenantId: "tenant-003", tenantName: "Padaria Delícia" },
]

const TENANTS_LIST = [
  { id: "tenant-001", name: "Lanchonete Bom Sabor" },
  { id: "tenant-002", name: "Restaurante Gourmet" },
  { id: "tenant-003", name: "Padaria Delícia" },
]

function AdminUsersTable({ users }: { users: UserListRow[] }) {
  const uStrings = UI_STRINGS.admin.users
  if (users.length === 0) {
    return <EmptyState icon={Users} title={uStrings.emptyUsersTitle} subtitle={uStrings.emptyUsersSubtitle} />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead text={uStrings.nameColumn} />
          <TableHead text={uStrings.emailColumn} />
          <TableHead text={uStrings.companyColumn} />
          <TableHead align="right" text={uStrings.roleHeader} />
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
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
  )
}

function NewAdminUserModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (user: Omit<UserListRow, "id">) => void
}) {
  const [newName, setNewName] = React.useState("")
  const [newEmail, setNewEmail] = React.useState("")
  const [newTenantId, setNewTenantId] = React.useState("tenant-001")
  const [newRole, setNewRole] = React.useState<UserRole>(UserRole.CASHIER)
  const uStrings = UI_STRINGS.admin.users

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newEmail) return
    onSubmit({
      name: newName,
      email: newEmail,
      passwordHash: "",
      role: newRole,
      tenantId: newTenantId,
      tenantName: TENANTS_LIST.find((t) => t.id === newTenantId)?.name,
    })
    setNewName("")
    setNewEmail("")
    setNewTenantId("tenant-001")
    setNewRole(UserRole.CASHIER)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Modal isOpen={isOpen} onClose={onClose} title={uStrings.newUserModalTitle} subtitle={uStrings.newUserModalSubtitle} icon={Users} successText={uStrings.saveUserButton} isSubmit>
        <Stack gap={5}>
          <Input label={uStrings.fullNameLabel} placeholder={uStrings.fullNamePlaceholder} icon={UserIcon} value={newName} onChange={(e) => setNewName(e.target.value)} required />
          <Input label={uStrings.emailAddressLabel} placeholder={uStrings.emailAddressPlaceholder} icon={Mail} type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
          <Stack gap={2.5}>
            <Badge variant="ghost" label={uStrings.tenantBadgeLabel} />
            <CustomSelect value={newTenantId} onChange={setNewTenantId}>
              {TENANTS_LIST.map((t) => (
                <CustomSelectItem key={t.id} value={t.id} text={t.name} icon={Shield} />
              ))}
            </CustomSelect>
          </Stack>
          <Stack gap={2.5}>
            <Badge variant="ghost" label={uStrings.roleBadgeLabel} />
            <CustomSelect value={newRole} onChange={(v) => setNewRole(v as UserRole)}>
              <CustomSelectItem value={UserRole.CASHIER} text={uStrings.cashierRole} icon={UserIcon} />
              <CustomSelectItem value={UserRole.MANAGER} text={uStrings.managerRole} icon={UserIcon} />
              <CustomSelectItem value={UserRole.ADMIN} text={uStrings.adminRole} icon={Shield} />
            </CustomSelect>
          </Stack>
        </Stack>
      </Modal>
    </Form>
  )
}

export function UsuariosSection() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [users, setUsers] = React.useState<UserListRow[]>(MOCK_USERS)
  const uStrings = UI_STRINGS.admin.users

  const handleCreateUser = (newUser: Omit<UserListRow, "id">) => {
    setUsers((prev) => [...prev, { ...newUser, id: crypto.randomUUID() }])
    setIsModalOpen(false)
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.tenantName ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Stack direction="row" align="start" w="fit-content">
        <Button variant="ghost" label={uStrings.backButton} icon={ArrowLeft} onClick={() => { window.location.href = "/admin" }} />
      </Stack>

      <RegistrySection
        title={uStrings.userManagementTitle}
        description={uStrings.userManagementDesc}
        icon={Shield}
        action={<Button variant="primary" label={uStrings.newUserButton} icon={Plus} onClick={() => setIsModalOpen(true)} />}
      >
        <Stack gap={5}>
          <FilterBar searchPlaceholder={uStrings.searchUsersPlaceholder} onSearch={setSearchQuery} />
          <AdminUsersTable users={filteredUsers} />
        </Stack>
      </RegistrySection>

      {isModalOpen && (
        <NewAdminUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateUser} />
      )}
    </>
  )
}
