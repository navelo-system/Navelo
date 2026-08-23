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
import { DiscardChangesModal } from "@/components/store/advanced/DiscardChangesModal"
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

function mapOperatorItem(u: NonNullable<ReturnType<typeof useOperators>>[number], currentId?: string, currentName?: string): UserItem {
  return {
    id: u.id,
    name: u.name,
    role: u.role,
    phone: "",
    email: u.email || "",
    password: u.password,
    commission: (u as { commission?: string }).commission || "% 0,00",
    isCurrent: currentId === u.id || currentName === u.name,
  }
}

function OperatorRolesSelectCard({
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
                key={r.key}
                padding={2.5}
                radius="default"
                border
                borderColor={isSelected ? "border-brand-secondary" : "border-border"}
                bg={isSelected ? "bg-brand-secondary/10" : "bg-white"}
                cursor="pointer"
                onClick={() => setFormRole(r.key)}
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

function UserListItemRow({
  user,
  onEdit,
  onDelete,
}: {
  user: UserItem
  onEdit: (u: UserItem) => void
  onDelete: (id: string) => void
}) {
  const s = UI_STRINGS.settings.usuarios
  const badgeVariant = user.role === "ADMIN" ? "primary" : user.role === "SUPERVISOR" ? "secondary" : "outline"

  return (
    <Box w="full" padding={2.5} radius="none" hoverBg="secondary/10" cursor="pointer" onClick={() => onEdit(user)}>
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
          type="button"
          variant="danger-icon-xs-confirm"
          confirmTitle={s.deleteUserTitle}
          confirmSubtitle={s.deleteUserTitle}
          confirmParagraph="Tem certeza que deseja remover este usuário do sistema?"
          onConfirm={() => onDelete(user.id)}
          disabled={user.isCurrent}
          title={user.isCurrent ? "Não é possível excluir o usuário ativo" : s.deleteUserTitle}
        />
      </Stack>
    </Box>
  )
}

function UserFormCard({
  formName, setFormName,
  formLogin, setFormLogin,
  formPassword, setFormPassword,
  formConfirmPassword, setFormConfirmPassword,
  formCommission, setFormCommission,
  formRole, setFormRole,
  isEditing,
  onSubmit,
}: {
  formName: string; setFormName: (v: string) => void
  formLogin: string; setFormLogin: (v: string) => void
  formPassword: string; setFormPassword: (v: string) => void
  formConfirmPassword: string; setFormConfirmPassword: (v: string) => void
  formCommission: string; setFormCommission: (v: string) => void
  formRole: string; setFormRole: (v: string) => void
  isEditing: boolean
  onSubmit: (e: React.FormEvent) => void
}) {
  const s = UI_STRINGS.settings.usuarios
  return (
    <Box as="form" onSubmit={onSubmit} bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        <Input label={s.nameLabel} placeholder={s.namePlaceholder} value={formName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormName(e.target.value)} required />
        <Input label={s.emailLabel} placeholder={s.emailPlaceholder} value={formLogin} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormLogin(e.target.value)} required />
        <Stack direction="col" mobileDirection="row" gap={2.5} w="full">
          <Box flex="1">
            <Input label={s.passwordLabel} type="password" placeholder={s.passwordPlaceholder} value={formPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormPassword(e.target.value)} required={!isEditing} />
          </Box>
          <Box flex="1">
            <Input label={s.passwordLabel} type="password" placeholder={s.passwordPlaceholder} value={formConfirmPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormConfirmPassword(e.target.value)} required={!isEditing || Boolean(formPassword)} />
          </Box>
        </Stack>
        <Input mask="percent" label={s.commissionLabel} placeholder={s.commissionPlaceholder} value={formCommission} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormCommission(e.target.value)} />
        <OperatorRolesSelectCard formRole={formRole} setFormRole={setFormRole} />
      </Stack>
    </Box>
  )
}

function buildDefaultAdminUser(tenantId: string): UserItem {
  return {
    id: `user-admin-${tenantId}`,
    name: "Administrador",
    role: "Administrador",
    phone: "",
    email: `admin@${tenantId}.app`,
    password: "123456789",
    commission: "% 0,00",
    isCurrent: true,
  }
}

function resolvePassword(pwd?: string, user?: UserItem | null): string {
  if (pwd) return pwd
  if (user?.password) return user.password
  return "123456789"
}

function filterUsers(users: UserItem[], query: string): UserItem[] {
  const q = query.toLowerCase()
  return users.filter((u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q))
}

function checkUserFormDirty(
  editingUser: UserItem | null,
  formName: string,
  formLogin: string,
  formPassword: string
): boolean {
  if (editingUser) {
    return formName !== editingUser.name ||
      formLogin !== (editingUser.email || "") ||
      formPassword !== (editingUser.password || "")
  }
  return Boolean(formName || formLogin || formPassword)
}

function useOperatorFormManager(tenantId: string) {
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
    setEditingUser(user); setFormName(user.name); setFormLogin(user.email || user.name.toLowerCase().replace(/\s+/g, "."))
    setFormPassword(user.password || ""); setFormConfirmPassword(user.password || "")
    setFormCommission(user.commission || "% 0,00")
    const roleObj = OPERATOR_ROLES_FULL.find((r) => r.label === user.role || r.key === user.role)
    setFormRole(roleObj?.key || "CASHIER")
  }

  const save = async () => {
    if (!formName || !formLogin || formPassword !== formConfirmPassword) return
    const roleObj = OPERATOR_ROLES_FULL.find((r) => r.key === formRole || r.label === formRole)
    const roleLabel = roleObj?.label || "Caixa"
    const pwd = resolvePassword(formPassword, editingUser)
    const payload = {
      id: editingUser ? editingUser.id : crypto.randomUUID(),
      company_id: tenantId, tenant_id: tenantId, name: formName, email: formLogin,
      role: roleLabel, password: pwd, commission: formCommission, active: true,
    }
    if (editingUser) await dal.users.update(payload)
    else await dal.users.create(payload)
  }

  const isDirty = checkUserFormDirty(editingUser, formName, formLogin, formPassword)

  return {
    editingUser, formName, setFormName, formLogin, setFormLogin,
    formPassword, setFormPassword, formConfirmPassword, setFormConfirmPassword,
    formCommission, setFormCommission, formRole, setFormRole,
    startCreate, startEdit, save, isDirty,
  }
}

interface UserHeaderSyncOptions {
  mode: "list" | "form"
  formMgr: ReturnType<typeof useOperatorFormManager>
  searchQuery: string
  setSearchQuery: (q: string) => void
  onCancel: () => void
  tenantId: string
  setCustomBack?: (cb: (() => void) | null) => void
  setCustomTitle?: (title: string | null) => void
  setCustomActions?: (actions: React.ReactNode | null) => void
  setMode?: (m: "list" | "form") => void
  onRequestBack?: () => void
}

function renderUserHeaderActions(formMgr: ReturnType<typeof useOperatorFormManager>, tenantId: string, setMode?: (m: "list" | "form") => void) {
  const isDeletable = formMgr.editingUser && !formMgr.editingUser.isCurrent
  return (
    <Stack direction="row" align="center" gap={2.5}>
      {isDeletable && (
        <Button
          type="button"
          variant="danger-pill-icon-confirm"
          icon={Trash2}
          confirmModal={{
            title: "Excluir Usuário",
            subtitle: "Confirmar exclusão de operador",
            paragraph: `Tem certeza de que deseja excluir o usuário "${formMgr.editingUser?.name}"? Esta ação não poderá ser desfeita.`,
            icon: Trash2,
            successText: "Confirmar Exclusão",
          }}
          onConfirm={async () => {
            if (formMgr.editingUser) {
              await dal.users.delete(formMgr.editingUser.id, tenantId)
              setMode?.("list")
            }
          }}
        />
      )}
      <Button
        type="button"
        variant="primary-icon"
        icon={Check}
        onClick={async () => {
          await formMgr.save()
          setMode?.("list")
        }}
      />
    </Stack>
  )
}

function useUserHeaderSync(opts: UserHeaderSyncOptions) {
  const {
    mode, formMgr, searchQuery, setSearchQuery, onCancel, tenantId,
    setCustomBack, setCustomTitle, setCustomActions, setMode, onRequestBack,
  } = opts
  const s = UI_STRINGS.settings.usuarios

  const onRequestBackRef = React.useRef(onRequestBack)
  const onCancelRef = React.useRef(onCancel)
  const formMgrRef = React.useRef(formMgr)
  const setModeRef = React.useRef(setMode)
  const setSearchQueryRef = React.useRef(setSearchQuery)
  const setCustomBackRef = React.useRef(setCustomBack)
  const setCustomTitleRef = React.useRef(setCustomTitle)
  const setCustomActionsRef = React.useRef(setCustomActions)

  React.useEffect(() => {
    onRequestBackRef.current = onRequestBack
    onCancelRef.current = onCancel
    formMgrRef.current = formMgr
    setModeRef.current = setMode
    setSearchQueryRef.current = setSearchQuery
    setCustomBackRef.current = setCustomBack
    setCustomTitleRef.current = setCustomTitle
    setCustomActionsRef.current = setCustomActions
  })

  const editingUserId = formMgr.editingUser?.id

  React.useEffect(() => {
    if (mode === "form") {
      setCustomBackRef.current?.(() => () => onRequestBackRef.current?.())
      setCustomTitleRef.current?.(editingUserId ? s.editUserTitle : s.newUserTitle)
      setCustomActionsRef.current?.(renderUserHeaderActions(formMgrRef.current, tenantId, (m) => setModeRef.current?.(m)))
    } else {
      setCustomBackRef.current?.(() => () => onCancelRef.current?.())
      setCustomTitleRef.current?.(s.title)
      setCustomActionsRef.current?.(
        <MobileHeaderSearch
          searchQuery={searchQuery}
          onSearchQueryChange={(q) => setSearchQueryRef.current?.(q)}
          placeholder={s.searchPlaceholder}
        />
      )
    }
  }, [
    mode, editingUserId, searchQuery, tenantId,
    s.editUserTitle, s.newUserTitle, s.title, s.searchPlaceholder,
  ])

  React.useEffect(() => () => {
    setCustomBackRef.current?.(null)
    setCustomTitleRef.current?.(null)
    setCustomActionsRef.current?.(null)
  }, [])
}

export const UsuariosSection: React.FC<UsuariosSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const tenantId = tenantCtx?.currentTenant?.id || "demo-tenant"
  const currentUser = tenantCtx?.currentUser
  const s = UI_STRINGS.settings.usuarios
  const dbOperators = useOperators(tenantId)
  const [mode, setMode] = React.useState<"list" | "form">("list")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)
  const formMgr = useOperatorFormManager(tenantId)

  const usersList: UserItem[] = React.useMemo(() => {
    if (!dbOperators || dbOperators.length === 0) {
      return [buildDefaultAdminUser(tenantId)]
    }
    return dbOperators.map((u) => mapOperatorItem(u, currentUser?.id, currentUser?.name))
  }, [dbOperators, tenantId, currentUser])

  const handleRequestBack = React.useCallback(() => {
    if (formMgr.isDirty) {
      setIsDiscardModalOpen(true)
    } else {
      setMode("list")
    }
  }, [formMgr.isDirty])

  useUserHeaderSync({
    mode, formMgr, searchQuery, setSearchQuery, onCancel, tenantId,
    setCustomBack, setCustomTitle, setCustomActions, setMode,
    onRequestBack: handleRequestBack,
  })

  const filtered = React.useMemo(() => filterUsers(usersList, searchQuery), [usersList, searchQuery])

  return (
    <ViewTransition viewKey={mode} flex="1" minH="0">
      <Stack gap={5} w="full">
        {mode === "list" ? (
          <Box position="relative" w="full">
            {filtered.length > 0 ? (
              <Box display="flex" direction="col" w="full">
                {filtered.map((u, idx) => (
                  <Box key={u.id}>
                    <UserListItemRow user={u} onEdit={(user) => { formMgr.startEdit(user); setMode("form") }} onDelete={async (id) => { await dal.users.delete(id, tenantId); setMode("list") }} />
                    {idx < filtered.length - 1 && <Box borderBottom borderColor="border-border" w="full" />}
                  </Box>
                ))}
              </Box>
            ) : (
              <EmptyState icon={Search} title={s.emptyTitle} subtitle={s.emptySubtitle} />
            )}
            <Box position="fixed" bottom="24px" right="24px" zIndex="30">
              <Button variant="secondary-pill-icon" icon={Plus} onClick={() => { formMgr.startCreate(); setMode("form") }} title={s.newOperatorButton} />
            </Box>
          </Box>
        ) : (
          <UserFormCard
            formName={formMgr.formName} setFormName={formMgr.setFormName}
            formLogin={formMgr.formLogin} setFormLogin={formMgr.setFormLogin}
            formPassword={formMgr.formPassword} setFormPassword={formMgr.setFormPassword}
            formConfirmPassword={formMgr.formConfirmPassword} setFormConfirmPassword={formMgr.setFormConfirmPassword}
            formCommission={formMgr.formCommission} setFormCommission={formMgr.setFormCommission}
            formRole={formMgr.formRole} setFormRole={formMgr.setFormRole}
            isEditing={Boolean(formMgr.editingUser)}
            onSubmit={async (e) => { e.preventDefault(); await formMgr.save(); setMode("list") }}
          />
        )}
      </Stack>
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          setMode("list")
        }}
      />
    </ViewTransition>
  )
}
