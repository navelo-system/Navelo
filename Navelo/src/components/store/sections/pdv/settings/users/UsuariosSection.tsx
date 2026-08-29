"use client"

import * as React from "react"
import { Box } from "@/components/store/base/Box"
import { Stack } from "@/components/store/base/Stack"
import { Font } from "@/components/store/base/Font"
import { Button } from "@/components/store/base/Button"
import { Input } from "@/components/store/base/Input"
import { Badge } from "@/components/store/base/Badge"
import { Avatar } from "@/components/store/base/Avatar"
import { Radio } from "@/components/store/base/Radio"
import { Icon } from "@/components/store/base/Icon"
import { EmptyState } from "@/components/store/intermediary/EmptyState"
import { Warning } from "@/components/store/base/Warning"
import {
  Plus,
  Trash2,
  Search,
  Check,
  Shield,
  UserCheck,
  Calculator,
  Headphones,
  Monitor,
  AlertCircle,
} from "lucide-react"
import { MobileHeaderSearch } from "@/components/store/intermediary/PdvCatalogToolbar"
import { useTenant } from "@/lib/context/TenantContext"
import { useAppNavigation } from "@/lib/navigation/NavigationContext"
import { useOperators, dal, db } from "@/lib/dal"
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
  { key: "ADMIN", label: "Administrador", description: "Tem acesso ilimitado a todo o sistema", icon: Shield },
  { key: "SUPERVISOR", label: "Supervisor", description: "Usado apenas para autorizar ações administrativas / Não pode fazer login no sistema", icon: UserCheck },
  { key: "CASHIER", label: "Caixa", description: "Tem acesso limitado ao caixa, delivery, autoatendimento, mesas, comandas e clientes", icon: Calculator },
  { key: "ATTENDANT", label: "Atendente", description: "Tem acesso limitado ao autoatendimento, mesas e comandas", icon: Headphones },
  { key: "TOTEM", label: "Totem Autoatendimento", description: "Modo exclusivo para autoatendimento do cliente", icon: Monitor },
]

function mapOperatorItem(
  u: NonNullable<ReturnType<typeof useOperators>>[number],
  currentId?: string,
  currentEmail?: string
): UserItem {
  const isCurrent = Boolean(
    (currentId && u.id === currentId) ||
    (currentEmail && u.email && u.email.toLowerCase() === currentEmail.toLowerCase())
  )
  return {
    id: u.id,
    name: u.name,
    role: u.role,
    phone: "",
    email: u.email || "",
    password: u.password,
    commission: (u as { commission?: string }).commission || "% 0,00",
    isCurrent,
  }
}

function OperatorRolesSelectCard({
  formRole,
  setFormRole,
}: {
  formRole: string
  setFormRole: (r: string) => void
}) {
  return (
    <Box bg="bg-white" border borderColor="border-border" radius="default" overflow="hidden" w="full">
      <Stack gap={0} w="full">
        {OPERATOR_ROLES_FULL.map((r, idx) => {
          const isSelected = formRole === r.key
          return (
            <React.Fragment key={r.key}>
              {idx > 0 && <Box h="h-[1px]" w="full" bg="bg-border" />}
              <Box
                padding={5}
                cursor="pointer"
                hoverBg="secondary/10"
                onClick={() => setFormRole(r.key)}
                w="full"
              >
                <Stack direction="row" align="center" justify="between" w="full" gap={5}>
                  <Stack direction="row" align="center" gap={5} flex="1" minW="0">
                    <Icon icon={r.icon} variant="circular-secondary" />
                    <Stack gap={1} align="start">
                      <Font variant="body-bold" text={r.label} />
                      <Font variant="description" color="muted" text={r.description} />
                    </Stack>
                  </Stack>
                  <Radio name="operator-role-selection" checked={isSelected} onChange={() => setFormRole(r.key)} />
                </Stack>
              </Box>
            </React.Fragment>
          )
        })}
      </Stack>
    </Box>
  )
}

function resolveRoleLabel(role: string): string {
  const roleObj = OPERATOR_ROLES_FULL.find((r) => r.key === role || r.label === role)
  return roleObj?.label || role
}

function resolveRoleBadgeVariant(role: string): "danger" | "warning" | "primary" | "secondary" | "default" {
  const norm = role.toUpperCase()
  if (norm.includes("ADMIN")) return "danger"
  if (norm.includes("SUPERVISOR") || norm.includes("GERENTE")) return "warning"
  if (norm.includes("ATENDENTE") || norm.includes("ATTENDANT") || norm.includes("TOTEM")) return "primary"
  if (norm.includes("CAIXA") || norm.includes("CASHIER") || norm.includes("OPERADOR")) return "secondary"
  return "default"
}

function UserListItemRow({
  user,
  onEdit,
}: {
  user: UserItem
  onEdit: (u: UserItem) => void
}) {
  const s = UI_STRINGS.settings.usuarios
  const badgeVariant = resolveRoleBadgeVariant(user.role)
  const roleLabel = resolveRoleLabel(user.role)

  return (
    <Box w="full" padding={2.5} radius="none" hoverBg="secondary/10" cursor="pointer" onClick={() => onEdit(user)}>
      <Stack direction="row" align="center" justify="between" w="full" gap={2.5}>
        <Stack direction="row" align="center" gap={2.5} flex="1" minW="0">
          <Avatar fallback={user.name.substring(0, 2).toUpperCase()} />
          <Stack gap={0} align="start" flex="1" minW="0">
            <Font variant="body-bold" text={user.name} />
            <Font variant="description" color="muted" text={`Login: ${user.email}`} />
          </Stack>
        </Stack>

        <Stack direction="col" align="end" gap={1}>
          {user.isCurrent && <Badge variant="outline" label={s.currentSessionBadge} />}
          <Badge variant={badgeVariant} label={roleLabel} />
        </Stack>
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
  formError,
  isEditing,
  onSubmit,
}: {
  formName: string; setFormName: (v: string) => void
  formLogin: string; setFormLogin: (v: string) => void
  formPassword: string; setFormPassword: (v: string) => void
  formConfirmPassword: string; setFormConfirmPassword: (v: string) => void
  formCommission: string; setFormCommission: (v: string) => void
  formRole: string; setFormRole: (v: string) => void
  formError?: string | null
  isEditing: boolean
  onSubmit: (e: React.FormEvent) => void
}) {
  const s = UI_STRINGS.settings.usuarios
  return (
    <Box as="form" onSubmit={onSubmit} bg="bg-white" border borderColor="border-border" radius="default" padding={5} w="full">
      <Stack gap={5} w="full">
        {formError && <Warning variant="danger" icon={AlertCircle} title={s.warningTitle} text={formError} />}
        <Input variant="outlined-label" label={s.nameLabel} placeholder={s.namePlaceholder} value={formName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormName(e.target.value)} required />
        <Input variant="outlined-label" label={s.emailLabel} placeholder={s.emailPlaceholder} value={formLogin} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormLogin(e.target.value)} required />
        <Stack direction="col" mobileDirection="row" gap={2.5} w="full">
          <Box flex="1">
            <Input variant="outlined-label" label={s.passwordLabel} type="password" placeholder={s.passwordPlaceholder} value={formPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormPassword(e.target.value)} required={!isEditing} />
          </Box>
          <Box flex="1">
            <Input variant="outlined-label" label={s.confirmPasswordLabel} type="password" placeholder={s.passwordPlaceholder} value={formConfirmPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormConfirmPassword(e.target.value)} required={!isEditing || Boolean(formPassword)} />
          </Box>
        </Stack>
        <Input variant="outlined-label" mask="percent" label={s.commissionLabel} placeholder={s.commissionPlaceholder} value={formCommission} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormCommission(e.target.value)} />
        <OperatorRolesSelectCard formRole={formRole} setFormRole={setFormRole} />
      </Stack>
    </Box>
  )
}

function buildDefaultAdminUser(tenantId: string): UserItem {
  return {
    id: `user-admin-${tenantId}`,
    name: "Administrador",
    role: "ADMIN",
    phone: "",
    email: `admin@${tenantId}.app`,
    password: "123456789",
    commission: "% 0,00",
    isCurrent: true,
  }
}

function resolvePassword(pwd?: string, user?: UserItem | null): string {
  if (pwd && pwd.trim()) return pwd.trim()
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

interface OperatorFormState {
  formName: string
  formLogin: string
  formPassword: string
  formConfirmPassword: string
  formCommission: string
  formRole: string
  editingUser: UserItem | null
}

function validateOperatorFormData(name: string, login: string, pwd: string, confirmPwd: string): string | null {
  const s = UI_STRINGS.settings.usuarios
  if (!name.trim()) return s.errorNameRequired
  if (!login.trim()) return s.errorLoginRequired
  if (pwd !== confirmPwd) return s.errorPasswordMismatch
  return null
}

async function persistOperatorPayload(state: OperatorFormState, tenantId: string): Promise<boolean> {
  const roleObj = OPERATOR_ROLES_FULL.find((r) => r.key === state.formRole || r.label === state.formRole)
  const roleKey = roleObj?.key || "CASHIER"
  const pwd = resolvePassword(state.formPassword, state.editingUser)
  const payload = {
    id: state.editingUser ? state.editingUser.id : crypto.randomUUID(),
    company_id: tenantId,
    tenant_id: tenantId,
    name: state.formName.trim(),
    email: state.formLogin.trim(),
    role: roleKey,
    password: pwd,
    commission: state.formCommission,
    active: true,
  }

  if (state.editingUser) {
    await dal.users.update(payload)
    if (state.editingUser.isCurrent && typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("pdv-operator-data")
        const currentData = saved ? JSON.parse(saved) : {}
        sessionStorage.setItem("pdv-operator-data", JSON.stringify({ ...currentData, name: payload.name, email: payload.email, role: payload.role }))
        sessionStorage.setItem("pdv-operator", payload.name)
      } catch (e) {
        console.error("Erro ao atualizar sessão local do operador:", e)
      }
    }
  } else {
    await dal.users.create(payload)
  }
  return true
}

function useOperatorFormManager(tenantId: string, initialUser: UserItem | null, isCreateMode: boolean) {
  const currentKey = isCreateMode ? "new" : initialUser?.id || "empty"
  const [prevKey, setPrevKey] = React.useState(currentKey)

  const [editingUser, setEditingUser] = React.useState<UserItem | null>(initialUser)
  const [formName, setFormName] = React.useState(initialUser?.name || "")
  const [formLogin, setFormLogin] = React.useState(initialUser?.email || "")
  const [formPassword, setFormPassword] = React.useState(initialUser?.password || "")
  const [formConfirmPassword, setFormConfirmPassword] = React.useState(initialUser?.password || "")
  const [formCommission, setFormCommission] = React.useState(initialUser?.commission || "% 0,00")
  const [formRole, setFormRole] = React.useState(initialUser?.role || "ADMIN")
  const [formError, setFormError] = React.useState<string | null>(null)

  if (prevKey !== currentKey) {
    setPrevKey(currentKey)
    if (isCreateMode || !initialUser) {
      setEditingUser(null)
      setFormName("")
      setFormLogin("")
      setFormPassword("")
      setFormConfirmPassword("")
      setFormCommission("% 0,00")
      setFormRole("ADMIN")
      setFormError(null)
    } else {
      setEditingUser(initialUser)
      setFormName(initialUser.name)
      setFormLogin(initialUser.email || initialUser.name.toLowerCase().replace(/\s+/g, "."))
      setFormPassword(initialUser.password || "")
      setFormConfirmPassword(initialUser.password || "")
      setFormCommission(initialUser.commission || "% 0,00")
      const roleObj = OPERATOR_ROLES_FULL.find((r) => r.label === initialUser.role || r.key === initialUser.role)
      setFormRole(roleObj?.key || "CASHIER")
      setFormError(null)
    }
  }

  const save = async (): Promise<boolean> => {
    const error = validateOperatorFormData(formName, formLogin, formPassword, formConfirmPassword)
    if (error) {
      setFormError(error)
      return false
    }
    setFormError(null)
    try {
      return await persistOperatorPayload({
        formName, formLogin, formPassword, formConfirmPassword,
        formCommission, formRole, editingUser,
      }, tenantId)
    } catch (err) {
      console.error("Erro ao salvar operador:", err)
      setFormError(UI_STRINGS.settings.usuarios.errorSaveFailed)
      return false
    }
  }

  const isDirty = checkUserFormDirty(editingUser, formName, formLogin, formPassword)

  return {
    editingUser, formName, setFormName, formLogin, setFormLogin,
    formPassword, setFormPassword, formConfirmPassword, setFormConfirmPassword,
    formCommission, setFormCommission, formRole, setFormRole,
    formError, setFormError, save, isDirty,
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

function renderUserHeaderActions(
  formMgrRef: React.MutableRefObject<ReturnType<typeof useOperatorFormManager>>,
  tenantId: string,
  setModeRef: React.MutableRefObject<((m: "list" | "form") => void) | undefined>
) {
  const isDeletable = formMgrRef.current.editingUser && !formMgrRef.current.editingUser.isCurrent
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
            paragraph: `Tem certeza de que deseja excluir o usuário "${formMgrRef.current.editingUser?.name}"? Esta ação não poderá ser desfeita.`,
            icon: Trash2,
            successText: "Confirmar Exclusão",
          }}
          onConfirm={async () => {
            const current = formMgrRef.current
            if (current.editingUser) {
              await dal.users.delete(current.editingUser.id, tenantId)
              setModeRef.current?.("list")
            }
          }}
        />
      )}
      <Button
        type="button"
        variant="primary-icon"
        icon={Check}
        onClick={async () => {
          const ok = await formMgrRef.current.save()
          if (ok) setModeRef.current?.("list")
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
      setCustomActionsRef.current?.(renderUserHeaderActions(formMgrRef, tenantId, setModeRef))
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

function UserListView({
  filtered,
  onAdd,
  onEdit,
}: {
  filtered: UserItem[]
  onAdd: () => void
  onEdit: (u: UserItem) => void
}) {
  const s = UI_STRINGS.settings.usuarios
  return (
    <Box position="relative" w="full">
      {filtered.length > 0 ? (
        <Box display="flex" direction="col" w="full">
          {filtered.map((u, idx) => (
            <Box key={u.id}>
              <UserListItemRow user={u} onEdit={onEdit} />
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

function useEnsureInitialAdmin(tenantId: string) {
  React.useEffect(() => {
    async function ensureInitialAdmin() {
      if (!tenantId) return
      try {
        const allUsers = await db.users.toArray()
        const tenantUsers = allUsers.filter((u) => u.company_id === tenantId || u.tenant_id === tenantId)
        if (tenantUsers.length === 0) {
          await db.users.put({
            id: `user-admin-${tenantId}`,
            company_id: tenantId,
            tenant_id: tenantId,
            name: "Administrador",
            email: `admin@${tenantId}.app`,
            role: "ADMIN",
            password: "123456789",
            active: true,
          })
        }
      } catch (err) {
        console.error("Erro ao verificar/inicializar admin:", err)
      }
    }
    ensureInitialAdmin()
  }, [tenantId])
}

function useMappedUsersList(dbOperators: ReturnType<typeof useOperators>, tenantId: string, currentUser?: { id?: string; email?: string } | null) {
  return React.useMemo(() => {
    if (!dbOperators || dbOperators.length === 0) {
      return [buildDefaultAdminUser(tenantId)]
    }
    const mapped = dbOperators.map((u) => mapOperatorItem(u, currentUser?.id, currentUser?.email))
    const seen = new Set<string>()
    return mapped.filter((item) => {
      const key = item.id || item.email.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [dbOperators, tenantId, currentUser])
}

export const UsuariosSection: React.FC<UsuariosSectionProps> = ({
  onCancel,
  setCustomBack,
  setCustomTitle,
  setCustomActions,
}) => {
  const tenantCtx = useTenant()
  const { currentRoute, navigate, goBack } = useAppNavigation()
  const tenantId = tenantCtx?.currentTenant?.id || "demo-tenant"
  const currentUser = tenantCtx?.currentUser
  const dbOperators = useOperators(tenantId)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDiscardModalOpen, setIsDiscardModalOpen] = React.useState(false)

  useEnsureInitialAdmin(tenantId)
  const usersList = useMappedUsersList(dbOperators, tenantId, currentUser)

  const isUsuariosView = currentRoute.view === "usuarios" || currentRoute.view === "novo-usuario"

  const isCreateMode =
    currentRoute.view === "novo-usuario" ||
    (currentRoute.view === "usuarios" && (currentRoute.params.action === "new" || currentRoute.params.mode === "new" || currentRoute.action === "new"))

  const editingUserId =
    currentRoute.view === "usuarios"
      ? (currentRoute.params.id || currentRoute.entityId)
      : undefined

  const targetUser = React.useMemo(() => (editingUserId ? usersList.find((u) => u.id === editingUserId) || null : null), [usersList, editingUserId])
  const mode: "list" | "form" = isCreateMode || Boolean(editingUserId) ? "form" : "list"

  const formMgr = useOperatorFormManager(tenantId, targetUser, isCreateMode)

  const handleRequestBack = React.useCallback(() => {
    if (formMgr.isDirty) setIsDiscardModalOpen(true)
    else goBack("#usuarios")
  }, [formMgr.isDirty, goBack])

  useUserHeaderSync({
    mode, formMgr, searchQuery, setSearchQuery, onCancel: () => {
      if (onCancel) onCancel()
      else goBack("#configuracoes")
    }, tenantId,
    setCustomBack, setCustomTitle, setCustomActions, setMode: () => {},
    onRequestBack: handleRequestBack,
  })

  const filtered = React.useMemo(() => filterUsers(usersList, searchQuery), [usersList, searchQuery])

  return (
    <ViewTransition viewKey={mode} flex="1" minH="0">
      <Stack gap={5} w="full">
        {mode === "list" ? (
          <UserListView
            filtered={filtered}
            onAdd={() => navigate("#usuarios?action=new")}
            onEdit={(u: UserItem) => navigate(`#usuarios?id=${u.id}&action=edit`)}
          />
        ) : (
          <UserFormCard
            formName={formMgr.formName} setFormName={formMgr.setFormName}
            formLogin={formMgr.formLogin} setFormLogin={formMgr.setFormLogin}
            formPassword={formMgr.formPassword} setFormPassword={formMgr.setFormPassword}
            formConfirmPassword={formMgr.formConfirmPassword} setFormConfirmPassword={formMgr.setFormConfirmPassword}
            formCommission={formMgr.formCommission} setFormCommission={formMgr.setFormCommission}
            formRole={formMgr.formRole} setFormRole={formMgr.setFormRole}
            formError={formMgr.formError}
            isEditing={Boolean(formMgr.editingUser)}
            onSubmit={async (e) => {
              e.preventDefault()
              const success = await formMgr.save()
              if (success) goBack("#usuarios")
            }}
          />
        )}
      </Stack>
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onClose={() => setIsDiscardModalOpen(false)}
        onConfirmDiscard={() => {
          setIsDiscardModalOpen(false)
          goBack("#usuarios")
        }}
      />
    </ViewTransition>
  )
}
