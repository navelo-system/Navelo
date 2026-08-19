"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Badge } from "@/components/store/base/Badge"
import { Avatar } from "@/components/store/base/Avatar"
import { Checkbox } from "@/components/store/base/Checkbox"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Plus, Trash2, Search, Check } from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { useTenant } from "@/lib/context/TenantContext"
import { useOperators, dal } from "@/lib/dal/hooks"
import { ViewTransition } from "@/components/store/base/ViewTransition"
import { UI_STRINGS } from "@/constants/strings"

interface UserItem {
  id: string
  name: string
  role: string
  phone: string
  email: string
  password?: string
  commission?: string
  isCurrent: boolean
}

export interface UsuariosSectionProps {
  onCancel: () => void
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
}

const OPERATOR_ROLES_FULL = [
  { key: "ADMIN", label: "Administrador", description: "Tem acesso ilimitado a todo o sistema" },
  { key: "SUPERVISOR", label: "Supervisor", description: "Usado apenas para autorizar ações administrativas / Não pode fazer login no sistema" },
  { key: "CASHIER", label: "Caixa", description: "Tem acesso limitado ao caixa, delivery, autoatendimento, mesas e comandas" },
  { key: "ATTENDANT", label: "Atendente", description: "Tem acesso limitado ao autoatendimento, mesas e comandas" },
  { key: "TOTEM", label: "Totem Autoatendimento", description: "Modo exclusivo para autoatendimento do cliente" },
]

function UserListItemRow({
  user,
  onEdit,
  onDelete,
}: {
  user: UserItem
  onEdit: () => void
  onDelete: (id: string) => void
}) {
  const s = UI_STRINGS.settings.usuarios
  const badgeVariant = user.role === "ADMIN" ? "primary" : user.role === "SUPERVISOR" ? "secondary" : "outline"

  return (
    <Box w="full" paddingY={2.5} paddingX={2.5} radius="none" hoverBg="primary/10" cursor="pointer" onClick={onEdit}>
      <Stack direction="row" align="center" justify="between" w="full">
        <Stack direction="row" align="center" gap={2.5} flex="1">
          <Avatar fallback={user.name.substring(0, 2).toUpperCase()} />
          <Stack gap={0} align="start">
            <Stack direction="row" align="center" gap={2.5}>
              <Font variant="body-bold" text={user.name} />
              <Badge variant={badgeVariant} label={user.role} />
            </Stack>
            <Font variant="description" color="muted" text={`Login: ${user.email}`} />
          </Stack>
        </Stack>
        <Button
          type="button" variant="danger-icon-xs-confirm" confirmTitle={s.deleteUserTitle} confirmSubtitle={s.deleteUserTitle}
          confirmParagraph="Tem certeza que deseja remover este usuário do sistema?" onConfirm={() => onDelete(user.id)}
          disabled={user.isCurrent} title={user.isCurrent ? "Não é possível excluir o usuário ativo" : s.deleteUserTitle}
        />
      </Stack>
    </Box>
  )
}

function UserRoleSelector({
  formRole,
  setFormRole,
}: {
  formRole: string
  setFormRole: (r: string) => void
}) {
  const s = UI_STRINGS.settings.usuarios
  return (
    <Box padding={5} bg="bg-surface-sunken" radius="default" w="full">
      <Stack gap={2.5} w="full">
        <Font variant="body-bold" text={s.accessProfileTitle} />
        <Stack gap={2.5} w="full">
          {OPERATOR_ROLES_FULL.map((r) => {
            const isSelected = formRole === r.key
            return (
              <Box
                key={r.key} padding={2.5} radius="default" border borderColor={isSelected ? "border-brand-primary" : "border-border"}
                bg={isSelected ? "bg-brand-primary/5" : "bg-white"} cursor="pointer" onClick={() => setFormRole(r.key)}
              >
                <Stack direction="row" align="center" justify="between" w="full">
                  <Stack gap={0} flex="1">
                    <Font variant="body-bold" text={r.label} />
                    <Font variant="description" color="muted" text={r.description} />
                  </Stack>
                  <Checkbox checked={isSelected} onChange={() => setFormRole(r.key)} />
                </Stack>
              </Box>
            )
          })}
        </Stack>
      </Stack>
    </Box>
  )
}

function UserFormCard({
  editingUser,
  formName, setFormName,
  formLogin, setFormLogin,
  formPassword, setFormPassword,
  formConfirmPassword, setFormConfirmPassword,
  formCommission, setFormCommission,
  formRole, setFormRole,
  onSubmit,
}: {
  editingUser: UserItem | null
  formName: string; setFormName: (v: string) => void
  formLogin: string; setFormLogin: (v: string) => void
  formPassword: string; setFormPassword: (v: string) => void
  formConfirmPassword: string; setFormConfirmPassword: (v: string) => void
  formCommission: string; setFormCommission: (v: string) => void
  formRole: string; setFormRole: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  const s = UI_STRINGS.settings.usuarios
  return (
    <Box as="form" onSubmit={onSubmit} bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Input label={s.nameLabel} placeholder={s.namePlaceholder} value={formName} onChange={(e) => setFormName(e.target.value)} required />
        <Input label={s.emailLabel} placeholder={s.emailPlaceholder} value={formLogin} onChange={(e) => setFormLogin(e.target.value)} required />
        <Stack direction="col" mobileDirection="row" gap={2.5} w="full">
          <Box flex="1">
            <Input label={s.passwordLabel} type="password" placeholder={s.passwordPlaceholder} value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required={!editingUser} />
          </Box>
          <Box flex="1">
            <Input label={s.passwordLabel} type="password" placeholder={s.passwordPlaceholder} value={formConfirmPassword} onChange={(e) => setFormConfirmPassword(e.target.value)} required={!editingUser || Boolean(formPassword)} />
          </Box>
        </Stack>
        <Input mask="percent" label={s.commissionLabel} placeholder={s.commissionPlaceholder} value={formCommission} onChange={(e) => setFormCommission(e.target.value)} />
        <UserRoleSelector formRole={formRole} setFormRole={setFormRole} />
      </Stack>
    </Box>
  )
}

function UserListView({
  filtered,
  onEdit,
  onDelete,
  onAdd,
}: {
  filtered: UserItem[]
  onEdit: (u: UserItem) => void
  onDelete: (id: string) => void
  onAdd: () => void
}) {
  const s = UI_STRINGS.settings.usuarios
  return (
    <Box position="relative" w="full">
      {filtered.length > 0 ? (
        <Box display="flex" direction="col" w="full">
          {filtered.map((u, idx) => (
            <Box key={u.id}>
              <UserListItemRow user={u} onEdit={() => onEdit(u)} onDelete={onDelete} />
              {idx < filtered.length - 1 && <Box borderBottom borderColor="border-border" w="full" />}
            </Box>
          ))}
        </Box>
      ) : (
        <EmptyState icon={Search} title={s.emptyTitle} subtitle={s.emptySubtitle} />
      )}
      <Box position="fixed" bottom="24px" right="24px" zIndex="30">
        <Button variant="secondary-pill-icon" icon={Plus} onClick={onAdd} title={s.newOperatorButton} />
      </Box>
    </Box>
  )
}

function validateUserForm(name: string, login: string, pass: string, confirmPass: string): boolean {
  if (!name || !login) return false
  if (pass !== confirmPass) return false
  return true
}

function useUserFormData(tenantId: string) {
  const [editingUser, setEditingUser] = React.useState<UserItem | null>(null)
  const [formName, setFormName] = React.useState("")
  const [formLogin, setFormLogin] = React.useState("")
  const [formPassword, setFormPassword] = React.useState("")
  const [formConfirmPassword, setFormConfirmPassword] = React.useState("")
  const [formCommission, setFormCommission] = React.useState("% 0,00")
  const [formRole, setFormRole] = React.useState("ADMIN")

  const startCreate = () => {
    setEditingUser(null); setFormName(""); setFormLogin(""); setFormPassword("")
    setFormConfirmPassword(""); setFormCommission("% 0,00"); setFormRole("ADMIN")
  }

  const startEdit = (user: UserItem) => {
    setEditingUser(user); setFormName(user.name)
    setFormLogin(user.email || user.name.toLowerCase().replace(/\s+/g, "."))
    setFormPassword(user.password || ""); setFormConfirmPassword(user.password || "")
    setFormCommission(user.commission || "% 0,00")
    const roleObj = OPERATOR_ROLES_FULL.find((r) => r.label === user.role || r.key === user.role)
    setFormRole(roleObj?.key || "CASHIER")
  }

  const save = async () => {
    if (!validateUserForm(formName, formLogin, formPassword, formConfirmPassword)) return
    const roleObj = OPERATOR_ROLES_FULL.find((r) => r.key === formRole || r.label === formRole)
    const roleLabel = roleObj?.label || "Caixa"
    const payload = {
      id: editingUser ? editingUser.id : crypto.randomUUID(), company_id: tenantId, tenant_id: tenantId,
      name: formName, email: formLogin, role: roleLabel, password: formPassword || editingUser?.password || "123456789",
      commission: formCommission, active: true,
    }
    if (editingUser) await dal.users.update(payload)
    else await dal.users.create(payload)
    setEditingUser(null)
  }

  return {
    editingUser, setEditingUser, formName, setFormName, formLogin, setFormLogin,
    formPassword, setFormPassword, formConfirmPassword, setFormConfirmPassword,
    formCommission, setFormCommission, formRole, setFormRole, startCreate, startEdit, save,
  }
}

function syncUserFormHeader(
  opts: {
    setCustomBack?: (cb: (() => void) | null) => void
    setCustomTitle?: (title: string | null) => void
    setCustomActions?: (actions: React.ReactNode | null) => void
    setMode: (m: "list" | "form") => void
    editingUser: UserItem | null
    onDelete: () => void
    onSave: () => void
  },
  s: typeof UI_STRINGS.settings.usuarios
) {
  opts.setCustomBack?.(() => () => opts.setMode("list"))
  opts.setCustomTitle?.(opts.editingUser ? s.editUserTitle : s.newUserTitle)
  opts.setCustomActions?.(
    <Stack direction="row" align="center" gap={2.5}>
      {opts.editingUser && !opts.editingUser.isCurrent && (
        <Button type="button" variant="danger-icon" icon={Trash2} onClick={opts.onDelete} />
      )}
      <Button type="button" variant="primary-icon" icon={Check} onClick={opts.onSave} />
    </Stack>
  )
}

function syncUserListHeader(
  opts: {
    setCustomBack?: (cb: (() => void) | null) => void
    setCustomTitle?: (title: string | null) => void
    setCustomActions?: (actions: React.ReactNode | null) => void
    onCancel: () => void
    searchQuery: string
    setSearchQuery: (q: string) => void
  },
  s: typeof UI_STRINGS.settings.usuarios
) {
  opts.setCustomBack?.(() => () => opts.onCancel())
  opts.setCustomTitle?.(s.title)
  opts.setCustomActions?.(
    <MobileHeaderSearch searchQuery={opts.searchQuery} onSearchQueryChange={opts.setSearchQuery} placeholder={s.searchPlaceholder} />
  )
}

export const UsuariosSection: React.FC<UsuariosSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const activeTenant = tenantCtx?.currentTenant
  const tenantId = activeTenant?.id || "demo-tenant"
  const currentUser = tenantCtx?.currentUser
  const s = UI_STRINGS.settings.usuarios
  const dbOperators = useOperators(tenantId)

  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [searchQuery, setSearchQuery] = React.useState("")
  const form = useUserFormData(tenantId)

  const usersList: UserItem[] = React.useMemo(() => {
    if (!dbOperators || dbOperators.length === 0) {
      return [{ id: `user-admin-${tenantId}`, name: "Administrador", role: "Administrador", phone: "", email: `admin@${tenantId}.app`, password: "123456789", commission: "% 0,00", isCurrent: true }]
    }
    return dbOperators.map((u) => ({
      id: u.id, name: u.name, role: u.role, phone: "", email: u.email || "",
      password: u.password, commission: (u as { commission?: string }).commission || "% 0,00",
      isCurrent: currentUser?.id === u.id || currentUser?.name === u.name,
    }))
  }, [dbOperators, tenantId, currentUser])

  React.useEffect(() => {
    if (mode === "form") {
      const onDelete = async () => {
        if (form.editingUser) {
          await dal.users.delete(form.editingUser.id, tenantId)
          setMode("list")
        }
      }
      const onSave = async () => { await form.save(); setMode("list") }
      syncUserFormHeader({ setCustomBack, setCustomTitle, setCustomActions, setMode, editingUser: form.editingUser, onDelete, onSave }, s)
    } else {
      syncUserListHeader({ setCustomBack, setCustomTitle, setCustomActions, onCancel, searchQuery, setSearchQuery }, s)
    }
    return () => { setCustomBack?.(null); setCustomTitle?.(null); setCustomActions?.(null) }
  }, [mode, form, searchQuery, setCustomBack, setCustomTitle, setCustomActions, onCancel, tenantId, s])

  const filtered = usersList.filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <ViewTransition viewKey={mode} flex="1" minH="0">
      <Stack gap={5} w="full">
        {mode === "list" ? (
          <UserListView
            filtered={filtered}
            onEdit={(u) => { form.startEdit(u); setMode("form") }}
            onDelete={(id) => dal.users.delete(id, tenantId)}
            onAdd={() => { form.startCreate(); setMode("form") }}
          />
        ) : (
          <UserFormCard
            editingUser={form.editingUser} formName={form.formName} setFormName={form.setFormName}
            formLogin={form.formLogin} setFormLogin={form.setFormLogin} formPassword={form.formPassword} setFormPassword={form.setFormPassword}
            formConfirmPassword={form.formConfirmPassword} setFormConfirmPassword={form.setFormConfirmPassword}
            formCommission={form.formCommission} setFormCommission={form.setFormCommission}
            formRole={form.formRole} setFormRole={form.setFormRole}
            onSubmit={async (e) => { e.preventDefault(); await form.save(); setMode("list") }}
          />
        )}
      </Stack>
    </ViewTransition>
  )
}
